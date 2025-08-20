import HeroSection from "../../../components/LandingPageComponents/Hero";
import HowItWorks from "../../../components/LandingPageComponents/HowItWorks";
import Testimonial from "../../../components/LandingPageComponents/Testimonial";
import CTASection from "../../../components/LandingPageComponents/CTASection";
import Footer from "../../../components/LandingPageComponents/Footer";
import NavBar from "../../../components/LandingPageComponents/NavBar";

export default function LandingPage() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  );
}
