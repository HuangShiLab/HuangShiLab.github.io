import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Research from './pages/Research'
import Team from './pages/Team'
import Publications from './pages/Publications'
import Facilities from './pages/Facilities'
import Awards from './pages/Awards'
import News from './pages/News'
import Contact from './pages/Contact'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/team" element={<Team />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  )
}
