import re

with open('assets/index-si8ypnaa.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = 'const e3=[{date:"Jan 2025",title:"Joseph Lister Award Finalist",detail:"Dr. Shi Huang named finalist at IADR 2025, Barcelona"}'

new_entry = '{date:"Aug 2026",title:"ISME20 Presentation",detail:"Lab members presented at the 20th International Symposium on Microbial Ecology in Auckland, New Zealand"}'

replacement = f'const e3=[{new_entry},{{date:"Jan 2025",title:"Joseph Lister Award Finalist",detail:"Dr. Shi Huang named finalist at IADR 2025, Barcelona"}}'

if old_str in content:
    print("Found exact match for news array")
    content = content.replace(old_str, replacement, 1)
else:
    print("Exact match not found")
    exit(1)

if 'ISME20' in content:
    print("SUCCESS: ISME20 entry added")
else:
    print("FAILED")
    exit(1)

with open('assets/index-si8ypnaa.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
