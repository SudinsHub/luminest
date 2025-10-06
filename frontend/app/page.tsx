import Banner from "@/components/banner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { FeaturedSection } from "@/components/home/featured-section"
import { CategoriesSection } from "@/components/home/categories-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <FeaturedSection title="New Arrivals" tag="new-arrival" />
        <FeaturedSection title="Hot Sales" tag="hot-sales" />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  )
}
