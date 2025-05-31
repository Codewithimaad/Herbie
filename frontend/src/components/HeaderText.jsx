import logoImage from '../assets/images/HerbalReality.png'
import { Link } from 'react-router-dom'

const HeaderText = () => {

    return (
        <div className="hidden md:flex justify-between items-center bg-gradient-to-r from-green-100 via-white to-green-100 py-8 px-8">
            {/* Left Illustration */}
            <div>
                <Link to='/'>
                    <img
                        src={logoImage}
                        alt="Herbal Illustration"
                        className="w-64 h-auto rounded-lg shadow-lg"
                    />
                </Link>

            </div>

            {/* Right Text Section */}
            <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 leading-tight">
                    A voice for herbal product
                </h1>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                    We share traditional, scientific, and practical insights written by experienced herbalists and health experts from the world of herbal medicine and natural health.
                </p>
            </div>
        </div>
    );
};

export default HeaderText;
