import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProduct';
import BestSeller from '../components/BestSeller';
import NewArrivals from '../components/NewArrivals';
import ProductSection from '../components/ProductSection';
import productData from '../assets/ProductData';

export default function Home() {
    return (
        <div>
            <HeroSection />
            <section className="py-16 space-y-16">
                {productData.map((product, index) => (
                    <ProductSection
                        key={index}
                        productName={product.productName}
                        description={product.description}
                        benefits={product.benefits}
                        imageSrc={product.imageSrc}
                        imageAlt={product.imageAlt}
                        ctaText={product.ctaText}
                        ctaLink={product.ctaLink}
                    />
                ))}
            </section>
            <FeaturedProducts />
            <BestSeller />
            <NewArrivals />
        </div>
    );
}