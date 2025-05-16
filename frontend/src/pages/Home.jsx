// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProduct';
import BestSellers from '../components/BestSeller';
import NewArrivals from '../components/NewArrivals';

export default function Home() {
    return (
        <section className="text-center">
            <HeroSection />
            <FeaturedProducts />
            <BestSellers />
            <NewArrivals />
        </section>
    );
}
