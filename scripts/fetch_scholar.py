#!/usr/bin/env python3
"""
Fetch publications and citation stats from Google Scholar via SerpAPI.
Filters for Shi Huang's papers, categorizes them, supplements DOIs via CrossRef,
and merges with manual overrides.

Usage:
    export SERPAPI_KEY="your_key_here"
    python3 scripts/fetch_scholar.py
"""

import json
import os
import re
import time
import urllib.request
from datetime import datetime
from typing import Any

AUTHOR_ID = "D6Keal0AAAAJ"
SERPAPI_KEY = os.environ.get("SERPAPI_KEY", "")
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "site", "src", "data")

# ── categorization keywords ──────────────────────────────────────────
METHODS_KEYWORDS = [
    "2brad", "benchmark", "metagenomic profiler", "profiling",
    "sequencing method", "phylogeny", "phylogenetic", "meta-omics",
    "single-cell raman", "raman-activated", "scrs",
]

PROBIOTICS_KEYWORDS = [
    "probiotic", "lactobacillus", "l. plantarum", "colonization",
    "adaptive mutation", "galactooligosaccharide", "gut microbiome stability",
    "structural variation", "sv of", "exogenous probiotic",
]


def categorize(title: str) -> str:
    t = title.lower()
    if any(k in t for k in METHODS_KEYWORDS):
        return "Metagenomics Methods"
    if any(k in t for k in PROBIOTICS_KEYWORDS):
        return "Probiotics"
    return "Microbiome & Disease"


# ── retry helper ─────────────────────────────────────────────────────
def fetch_json(url: str, retries: int = 3, backoff: float = 2.0) -> dict:
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "huangshilab-sync/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            print(f"  [attempt {attempt}/{retries}] {e}")
            if attempt < retries:
                time.sleep(backoff * attempt)
    return {}


# ── title normalization ──────────────────────────────────────────────
def normalize_title(title: str) -> str:
    return re.sub(r"[^\w\s]", "", title.lower()).strip()


# ── fetch from SerpAPI ───────────────────────────────────────────────
def fetch_serpapi() -> dict:
    if not SERPAPI_KEY:
        print("ERROR: SERPAPI_KEY environment variable not set")
        return {}

    print(f"Fetching Google Scholar data for author {AUTHOR_ID}...")
    all_articles: list = []
    merged: dict = {}
    start = 0
    while True:
        url = (
            "https://serpapi.com/search.json"
            f"?engine=google_scholar_author"
            f"&author_id={AUTHOR_ID}"
            f"&api_key={SERPAPI_KEY}"
            f"&num=100&start={start}"
        )
        data = fetch_json(url)
        if "error" in data:
            print(f"SerpAPI error: {data['error']}")
            return {} if not merged else merged
        articles = data.get("articles", [])
        all_articles.extend(articles)
        if not merged:
            merged = data  # keep author_info / cited_by / h_index from first page
        print(f"  -> page start={start}: {len(articles)} articles")
        if len(articles) < 100:
            break
        start += 100
        time.sleep(2)  # be gentle with the API
    merged["articles"] = all_articles
    merged["total_articles"] = len(all_articles)
    print(f"  -> total raw articles: {len(all_articles)}")
    return merged


# ── fetch DOI from CrossRef ──────────────────────────────────────────
def fetch_doi(title: str) -> str:
    encoded = urllib.parse.quote(title)
    url = f"https://api.crossref.org/works?query.title={encoded}&rows=1"
    data = fetch_json(url, retries=2, backoff=1.0)
    items = data.get("message", {}).get("items", [])
    if not items:
        return ""
    first = items[0]
    cr_title = first.get("title", [""])[0]
    # simple similarity check
    if normalize_title(cr_title) == normalize_title(title):
        return first.get("DOI", "")
    return ""


# ── load manual overrides ────────────────────────────────────────────
def load_manual_overrides() -> dict:
    path = os.path.join(DATA_DIR, "publications_manual.json")
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        entries = json.load(f)
    mapping = {}
    for entry in entries:
        mapping[normalize_title(entry["title"])] = entry
    print(f"Loaded {len(mapping)} manual override entries")
    return mapping


# ── main processing ──────────────────────────────────────────────────
def process():
    os.makedirs(DATA_DIR, exist_ok=True)

    # 1. Fetch from SerpAPI
    raw = fetch_serpapi()
    if not raw:
        print("Failed to fetch data. Aborting.")
        return

    # 2. Extract stats
    author_info = raw.get("author_info", {})
    cited_by = raw.get("cited_by", {})
    stats = {
        "citations_all": cited_by.get("all_time", 0) or author_info.get("cited_by", 0),
        "h_index_all": 0,
        "i10_index_all": 0,
        "papers_count": raw.get("total_articles", len(raw.get("articles", []))),
        "updated_at": datetime.now().isoformat(),
    }

    # Try to get h-index from table data if available
    h_index_data = raw.get("h_index", {})
    if h_index_data:
        stats["h_index_all"] = h_index_data.get("all_time", 0)
        stats["i10_index_all"] = h_index_data.get("since_2015", 0)  # approximation

    print(f"Stats: citations={stats['citations_all']}, h-index={stats['h_index_all']}")

    # 3. Process articles
    articles = raw.get("articles", [])
    manual_overrides = load_manual_overrides()
    seen_titles = set()
    publications = []

    for idx, article in enumerate(articles, start=1):
        title = article.get("title", "").strip()
        authors_str = article.get("authors", "")
        year_str = article.get("year", "")
        journal = article.get("publication", "")

        if not title:
            continue

        # Filter: must contain Huang S or Shi Huang
        authors_check = authors_str.lower()
        if "huang s" not in authors_check and "shi huang" not in authors_check:
            continue

        norm_title = normalize_title(title)

        # Check manual override
        if norm_title in manual_overrides:
            entry = manual_overrides.pop(norm_title)
            entry["id"] = idx
            publications.append(entry)
            seen_titles.add(norm_title)
            print(f"  [{idx}] MANUAL: {title[:60]}...")
            continue

        # Parse year
        try:
            year = int(year_str)
        except (ValueError, TypeError):
            year = 0

        # Categorize
        category = categorize(title)

        # Try to get DOI from CrossRef
        doi = ""
        if journal:  # only search if we have a journal
            doi = fetch_doi(title)
            if doi:
                print(f"  [{idx}] DOI found: {doi}")

        pub = {
            "id": idx,
            "title": title,
            "authors": authors_str,
            "journal": journal,
            "year": year,
            "category": category,
            "doi": doi,
        }
        publications.append(pub)
        seen_titles.add(norm_title)
        print(f"  [{idx}] {category}: {title[:60]}...")

    # 4. Add remaining manual overrides (new papers not on Scholar yet)
    for entry in manual_overrides.values():
        entry["id"] = len(publications) + 1
        publications.append(entry)
        print(f"  [+] ADDED manual: {entry['title'][:60]}...")

    # 5. Sort: year desc, then title asc
    publications.sort(key=lambda p: (-p.get("year", 0), p.get("title", "")))
    # Re-assign IDs after sorting
    for i, pub in enumerate(publications, start=1):
        pub["id"] = i

    print(f"\nTotal publications after filtering: {len(publications)}")

    # 6. Save JSON (reference copies)
    stats_path = os.path.join(DATA_DIR, "stats.json")
    pubs_path = os.path.join(DATA_DIR, "publications.json")

    with open(stats_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    print(f"Saved stats -> {stats_path}")

    with open(pubs_path, "w", encoding="utf-8") as f:
        json.dump(publications, f, indent=2, ensure_ascii=False)
    print(f"Saved publications -> {pubs_path}")

    # 7. Regenerate src/data/index.ts (the file the site actually imports;
    #    Vite tree-shakes JSON imports, so the site reads TS constants)
    ts_path = os.path.join(DATA_DIR, "index.ts")
    stats_extra = {"papers_count": stats.get("papers_count", len(publications)), "first_author_count": 31, "patent_count": 7}

    def ts_str(s: Any) -> str:
        return json.dumps(str(s or ""), ensure_ascii=False)

    lines = [
        "// Auto-synced from Google Scholar via scripts/fetch_scholar.py",
        f"// Last updated: {datetime.now().strftime('%Y-%m-%d')}",
        "",
        "export const statsJson = {",
        f"  citations_all: {stats['citations_all']},",
        f"  h_index_all: {stats['h_index_all']},",
        f"  i10_index_all: {stats['i10_index_all']},",
        f"  papers_count: {stats_extra['papers_count']},",
        f"  first_author_count: {stats_extra['first_author_count']},",
        f"  patent_count: {stats_extra['patent_count']},",
        f'  updated_at: "{datetime.now().isoformat(timespec="seconds")}",',
        "};",
        "",
        "export type Publication = {",
        "  id: number; title: string; authors: string; journal: string;",
        "  year: number; category: string; doi: string;",
        "};",
        "",
        "export const publications: Publication[] = [",
    ]
    for pub in publications:
        lines.append(
            f"  {{ id: {pub['id']}, title: {ts_str(pub.get('title'))}, "
            f"authors: {ts_str(pub.get('authors'))}, journal: {ts_str(pub.get('journal'))}, "
            f"year: {pub.get('year', 0)}, category: {ts_str(pub.get('category'))}, "
            f"doi: {ts_str(pub.get('doi'))} }},"
        )
    lines.append("];")
    lines.append("")

    with open(ts_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Saved TypeScript -> {ts_path}")


if __name__ == "__main__":
    process()
