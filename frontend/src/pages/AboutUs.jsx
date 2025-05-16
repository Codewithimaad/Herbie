import herbieAbout from '../assets/images/HeroSection.jpeg'
import HeadingText from '../components/HeadingText';


const AboutUs = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <HeadingText
                        title='About Us'
                        description=' Nurturing organic and natural beauty since 2000 with halal, toxin-free, and naturally powerful products.'
                    />

                </div>

                {/* Company Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-green-800">Our Journey</h3>
                        <p className="text-gray-700 text-base leading-relaxed">
                            Harbie is a nature-inspired beauty brand that began its journey in 2000 from a small retail store in Dubai, UAE. Now expanding into Pakistan’s beauty industry, Harbie proudly opens its doors to a new audience.
                        </p>
                        <p className="text-gray-700 text-base leading-relaxed">
                            We strive to serve our customers with halal, toxin-free natural skin and hair care products, and premium-quality fragrances—each crafted with dedication to purity and well-being.
                        </p>
                    </div>

                    {/* Image or Illustration */}
                    <div className="w-full h-64 lg:h-full rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={herbieAbout}
                            alt="Harbie Natural Products"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Product Categories */}
                <div className="mt-16">
                    <HeadingText
                        title='What we Offer'

                    />                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                            <h4 className="text-lg font-semibold text-green-900 mb-2">Fragrances</h4>
                            <p className="text-sm text-gray-600">Elegant, long-lasting scents made with ethically sourced ingredients.</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                            <h4 className="text-lg font-semibold text-green-900 mb-2">Skin Care</h4>
                            <p className="text-sm text-gray-600">Gentle and effective skincare rooted in natural, halal-certified ingredients.</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                            <h4 className="text-lg font-semibold text-green-900 mb-2">Hair Care</h4>
                            <p className="text-sm text-gray-600">Revitalize your hair with herbal, nourishing formulas free from toxins.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
