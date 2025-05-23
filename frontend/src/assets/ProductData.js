import ReethaImage from '../assets/images/Reetha.webp'
import Shikakai from '../assets/images/Shikakai.webp'
import Amla from '../assets/images/Amla.jpeg'
import Bhringraj from '../assets/images/Bhringraj.webp'
import Neem from '../assets/images/Neem.jpg'
import Hibiscus from '../assets/images/Hibiscus.jpg'
import Fenugreek from '../assets/images/Fenugreek.jpg'
import aloeVera from '../assets/images/Aloe Vera.jpg'
import Rosemary from '../assets/images/Rosemary.webp'


const ProductData = [
    {
        productName: 'Reetha (Soapnut)',
        description:
            'Reetha, commonly known as Soapnut, is a natural cleansing agent sourced from the fruit of the Sapindus mukorossi tree. Renowned in Ayurvedic traditions, Reetha offers gentle, eco-friendly cleaning properties, serving as a sustainable alternative to chemical-based soaps and detergents. Rich in saponins, it produces a natural lather, making it ideal for hair care, skincare, and household cleaning.',
        benefits: [
            { title: 'Natural Cleanser', description: 'Gently cleanses hair and skin without stripping essential oils.' },
            { title: 'Eco-Friendly', description: 'Biodegradable and free from harmful chemicals, promoting environmental sustainability.' },
            { title: 'Hair Health', description: 'Enhances hair shine and reduces dandruff and scalp irritation.' },
            { title: 'Hypoallergenic', description: 'Suitable for sensitive skin, minimizing allergic reactions.' },
            { title: 'Versatile Use', description: 'Perfect for laundry, dishwashing, and natural shampoo applications.' },
        ],
        imageSrc: ReethaImage,
        imageAlt: 'Reetha (Soapnut)',
        ctaText: 'Explore Reetha Products',
        ctaLink: '#reetha',
    },
    {
        productName: 'Shikakai',
        description:
            'Shikakai, derived from the Acacia concinna plant, is a traditional Ayurvedic herb used for its gentle cleansing and nourishing properties. Known as "fruit for hair," it promotes healthy hair growth and adds shine without stripping natural oils, making it a popular choice for natural hair care.',
        benefits: [
            { title: 'Hair Nourishment', description: 'Strengthens hair roots and promotes healthy growth.' },
            { title: 'Gentle Cleansing', description: 'Cleanses the scalp without removing natural oils.' },
            { title: 'Dandruff Control', description: 'Helps reduce dandruff and soothes scalp irritation.' },
            { title: 'Natural Conditioner', description: 'Leaves hair soft, shiny, and manageable.' },
            { title: 'Chemical-Free', description: 'Free from harsh chemicals, safe for regular use.' },
        ],
        imageSrc: Shikakai,
        imageAlt: 'Shikakai',
        ctaText: 'Explore Shikakai Products',
        ctaLink: '#shikakai',
    },
    {
        productName: 'Amla (Indian Gooseberry)',
        description:
            'Amla, or Indian Gooseberry, is a powerhouse of antioxidants and Vitamin C, widely used in Ayurveda for its rejuvenating properties. It strengthens hair follicles, enhances skin health, and supports overall wellness, making it a versatile ingredient in natural care products.',
        benefits: [
            { title: 'Hair Growth', description: 'Promotes stronger, thicker hair by nourishing follicles.' },
            { title: 'Antioxidant-Rich', description: 'Protects skin and hair from oxidative stress.' },
            { title: 'Scalp Health', description: 'Reduces premature graying and scalp issues.' },
            { title: 'Skin Brightening', description: 'Enhances skin glow and reduces blemishes.' },
            { title: 'Immunity Boost', description: 'Supports overall health with high Vitamin C content.' },
        ],
        imageSrc: Amla,
        imageAlt: 'Amla (Indian Gooseberry)',
        ctaText: 'Explore Amla Products',
        ctaLink: '#amla',
    },
    {
        productName: 'Bhringraj',
        description:
            'Bhringraj, known as the "King of Herbs" in Ayurveda, is celebrated for its ability to promote hair growth and prevent hair loss. Its nourishing properties also benefit the scalp and skin, making it a staple in natural wellness and beauty routines.',
        benefits: [
            { title: 'Hair Growth', description: 'Stimulates hair follicles for thicker, stronger hair.' },
            { title: 'Prevents Hair Loss', description: 'Reduces hair fall and premature balding.' },
            { title: 'Scalp Care', description: 'Soothes scalp irritation and reduces dandruff.' },
            { title: 'Skin Rejuvenation', description: 'Promotes healthy, glowing skin.' },
            { title: 'Stress Relief', description: 'Calms the mind and supports overall wellness.' },
        ],
        imageSrc: Bhringraj,
        imageAlt: 'Bhringraj',
        ctaText: 'Explore Bhringraj Products',
        ctaLink: '#bhringraj',
    },
    {
        productName: 'Neem',
        description:
            'Neem, a revered herb in Ayurveda, is known for its powerful antibacterial, antifungal, and anti-inflammatory properties. Used in skincare and haircare, it helps combat acne, dandruff, and infections, promoting clear skin and a healthy scalp.',
        benefits: [
            { title: 'Antibacterial', description: 'Fights acne-causing bacteria and skin infections.' },
            { title: 'Dandruff Control', description: 'Reduces dandruff and soothes itchy scalp.' },
            { title: 'Anti-Inflammatory', description: 'Calms irritated skin and reduces redness.' },
            { title: 'Detoxifying', description: 'Purifies the skin and supports overall health.' },
            { title: 'Hair Strength', description: 'Nourishes hair roots for stronger, healthier hair.' },
        ],
        imageSrc: Neem,
        imageAlt: 'Neem',
        ctaText: 'Explore Neem Products',
        ctaLink: '#neem',
    },
    {
        productName: 'Hibiscus',
        description:
            'Hibiscus, known for its vibrant flowers, is a natural beauty enhancer in Ayurvedic practices. Rich in antioxidants, it promotes hair growth, improves skin texture, and adds a natural shine, making it a favorite in hair and skincare products.',
        benefits: [
            { title: 'Hair Growth', description: 'Stimulates hair follicles for thicker hair.' },
            { title: 'Shine Enhancer', description: 'Adds natural shine and softness to hair.' },
            { title: 'Scalp Health', description: 'Reduces dandruff and soothes the scalp.' },
            { title: 'Skin Exfoliation', description: 'Gently exfoliates for smoother, brighter skin.' },
            { title: 'Antioxidant-Rich', description: 'Protects against environmental damage.' },
        ],
        imageSrc: Hibiscus,
        imageAlt: 'Hibiscus',
        ctaText: 'Explore Hibiscus Products',
        ctaLink: '#hibiscus',
    },
    {
        productName: 'Fenugreek (Methi)',
        description:
            'Fenugreek, or Methi, is a versatile herb used in Ayurveda for its nourishing and conditioning properties. Packed with proteins and nutrients, it promotes hair growth, reduces hair fall, and enhances skin health, making it ideal for natural care routines.',
        benefits: [
            { title: 'Hair Growth', description: 'Strengthens hair roots and promotes growth.' },
            { title: 'Reduces Hair Fall', description: 'Minimizes hair loss and breakage.' },
            { title: 'Scalp Care', description: 'Soothes scalp irritation and reduces dandruff.' },
            { title: 'Skin Hydration', description: 'Moisturizes and softens the skin.' },
            { title: 'Anti-Aging', description: 'Reduces fine lines and improves skin elasticity.' },
        ],
        imageSrc: Fenugreek,
        imageAlt: 'Fenugreek (Methi)',
        ctaText: 'Explore Fenugreek Products',
        ctaLink: '#fenugreek',
    },
    {
        productName: 'Aloe Vera',
        description:
            'Aloe Vera is a well-known plant celebrated for its soothing, hydrating, and healing properties. Widely used in Ayurveda and modern skincare, it moisturizes skin, promotes hair health, and aids in healing minor skin irritations, making it a versatile natural ingredient.',
        benefits: [
            { title: 'Skin Hydration', description: 'Deeply moisturizes and softens the skin.' },
            { title: 'Healing Properties', description: 'Soothes burns, cuts, and skin irritations.' },
            { title: 'Hair Care', description: 'Nourishes scalp and promotes shiny hair.' },
            { title: 'Anti-Inflammatory', description: 'Reduces redness and inflammation.' },
            { title: 'Anti-Aging', description: 'Minimizes wrinkles and improves skin elasticity.' },
        ],
        imageSrc: aloeVera,
        imageAlt: 'Aloe Vera',
        ctaText: 'Explore Aloe Vera Products',
        ctaLink: '#aloe-vera',
    },
    {
        productName: 'Rosemary',
        description:
            'Rosemary is a fragrant herb valued in Ayurveda and herbal traditions for its stimulating and nourishing properties. It promotes hair growth, improves scalp health, and enhances skin clarity, making it a popular choice for natural hair and skincare products.',
        benefits: [
            { title: 'Hair Growth', description: 'Stimulates hair follicles for thicker hair.' },
            { title: 'Scalp Health', description: 'Reduces dandruff and improves scalp circulation.' },
            { title: 'Antioxidant-Rich', description: 'Protects skin and hair from free radical damage.' },
            { title: 'Skin Clarity', description: 'Improves skin tone and reduces blemishes.' },
            { title: 'Aromatherapy', description: 'Uplifts mood and reduces stress.' },
        ],
        imageSrc: Rosemary,
        imageAlt: 'Rosemary',
        ctaText: 'Explore Rosemary Products',
        ctaLink: '#rosemary',
    },
];

export default ProductData;