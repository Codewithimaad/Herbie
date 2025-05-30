import { useState } from 'react';
import axios from 'axios';
import HeadingText from '../components/HeadingText';
import { useAuth } from '../context/authContext'

export default function Contact() {
    const { backendUrl } = useAuth();
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            await axios.post(`${backendUrl}/api/contact`, form);
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            setStatus('idle');
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
            <HeadingText
                title='Get in Touch'
                description='Have questions or need assistance? Reach out to us anytime, and our team will respond promptly.'
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-14">
                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-10 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg"
                >
                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200 outline-none placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200 outline-none placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="subject"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200 outline-none placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="message"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            placeholder="Write your message here..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200 outline-none resize-none placeholder-gray-400"
                        ></textarea>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                    )}
                    {status === 'success' && (
                        <p className="text-sm text-green-600 mb-4">
                            Thank you, {form.name}! Your message has been sent.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.01] focus:ring-4 focus:ring-green-200 ${status === 'loading' ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                {/* Contact Info Sidebar */}
                <aside className="bg-gradient-to-br from-green-50 to-gray-50 rounded-2xl p-10 shadow-md flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">Contact Information</h3>
                    <div className="space-y-8">
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span>
                                <strong>Phone:</strong><br />
                                <a href="tel:+923305245401" className="text-green-600 hover:underline">
                                    +92 330 5245401
                                </a>
                            </span>
                        </p>
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                            <span>
                                <strong>WhatsApp:</strong> <br />
                                <a href="https://wa.me/+923020929309" className="text-green-600 hover:underline">
                                    +92 302 0929309
                                </a>
                            </span>
                        </p>
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span>
                                <strong>Email:</strong> <br />
                                <a href="mailto:support@herbie.com" className="text-green-600 hover:underline">
                                    support@herbie.com
                                </a>
                            </span>
                        </p>
                        <p className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>
                                <strong>Address:</strong> <br />
                                123 Herbal Lane, Green City, CA 90210
                            </span>
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
}