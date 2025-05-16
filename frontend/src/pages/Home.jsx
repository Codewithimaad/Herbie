// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProduct';

export default function Home() {
    return (
        <section className="text-center">
            <HeroSection />
            <FeaturedProducts />
        </section>
    );
}
