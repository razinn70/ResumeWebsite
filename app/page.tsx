import { Hero } from '@/components/hero'
import NavigationEdh from '@/components/navigation-edh'
import { Projects } from '@/components/projects-edh'
import { AboutEdh } from '@/components/about-edh'
import { ContactEdh } from '@/components/contact-edh'
import { FooterEdh } from '@/components/footer-edh'

export default function Home() {
  return (
    <>
      <NavigationEdh />
      <main>
        <Hero />
        <AboutEdh />
        <Projects />
        <ContactEdh />
      </main>
      <FooterEdh />
    </>
  )
}
