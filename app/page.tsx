import { NavigationEdh } from '../components/navigation-edh'
import { Hero } from '../components/hero'
import { Projects } from '../components/projects-edh'
import { ContactEdh } from '../components/contact-edh'
import { FooterEdh } from '../components/footer-edh'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationEdh />
      <Hero />
      <Projects />
      <ContactEdh />
      <FooterEdh />
    </main>
  )
}
