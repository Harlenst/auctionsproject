
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import AuctionGrid from '../components/AuctionGrid';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import SellSection from '../components/SellSection';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

interface HomeProps {
  onLogin: () => void;
  onRegister: () => void;
}

function Home({ onLogin, onRegister }: HomeProps) {
  const handleBid = () => {
    alert('Próximamente podrás realizar tu puja desde aquí.');
  };

  return (
    <>
      <Navbar
        onLogin={onLogin}
        onRegister={onRegister}
      />

      <main>
        <Hero />
        <TrustBar />
        <AuctionGrid onBid={handleBid} />
        <Categories />
        <HowItWorks />
        <SellSection />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}

export default Home;
