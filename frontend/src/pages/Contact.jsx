// src/pages/Contact.jsx
import { useState } from 'react';
import HeadingText from '../components/HeadingText';

export default function Contact() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder: replace with actual submission logic
        alert(`Thank you, ${form.name}! Your message has been received.`);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <section className="max-w-5xl mx-auto px-6 py-12">

            <HeadingText
                title='Get in Touch'
                description='Have questions or need assistance? We are here to help. Reach out to us anytime!'

            />

            <div className="flex flex-col md:flex-row gap-12">
                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 bg-white shadow-md rounded-lg p-8"
                >
                    <div className="mb-6">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 mb-2"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Write your message here..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Send Message
                    </button>
                </form>

                {/* Contact Info Sidebar */}
                <aside className="flex-1 bg-green-50 rounded-lg p-8 shadow-inner text-green-900">
                    <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                    <p className="mb-4">
                        <strong>Phone:</strong> <br />
                        <a href="tel:+1234567890" className="hover:underline">
                            +1 (234) 567-890
                        </a>
                    </p>
                    <p className="mb-4">
                        <strong>Email:</strong> <br />
                        <a href="mailto:support@herbie.com" className="hover:underline">
                            support@herbie.com
                        </a>
                    </p>
                    <p>
                        <strong>Address:</strong> <br />
                        123 Herbal Lane, Green City, CA 90210
                    </p>
                </aside>
            </div>
        </section>
    );
}
