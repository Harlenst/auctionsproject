
import { useState } from 'react';

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
import BidModal from '../components/BidModal';

import type { Auction } from '../components/AuctionCard';

interface HomeProps {
  onLogin: () => void;
  onRegister: () => void;
}

function Home({ onLogin, onRegister }: HomeProps) {
  const [selectedAuction, setSelectedAuction] =
    useState<Auction | null>(null);

  function handleBid(auction: Auction) {
    setSelectedAuction(auction);
  }

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

      {selectedAuction && (
        <BidModal
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}
    </>
  );
}

export default Home;
