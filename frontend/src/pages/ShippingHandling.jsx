import React from 'react';
import HeadingText from '../components/HeadingText';

const ShippingHandling = () => {
    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg p-8">

                <HeadingText title='Shipping & Handling' />

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">How long will my order take to arrive?</h2>
                    <p className="text-gray-700 mb-2">Delivery usually takes <strong>3 to 6 working days</strong>.</p>
                    <p className="text-gray-700 mb-2">
                        At <span className="font-semibold">Herbie</span>, we strive to process and dispatch your order within <strong>24 hours</strong> of confirmation.
                        Please ensure you are reachable on your provided contact number, as our delivery team may contact you.
                    </p>
                    <p className="text-gray-600 italic text-sm">
                        Please note that delivery timelines may be affected by weather conditions, political situations, or other unforeseen events.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">What are the delivery charges?</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Free shipping is available on all orders above <strong>PKR 1,399</strong>.</li>
                        <li>For orders below PKR 1,399, a standard shipping fee of <strong>PKR 149</strong> will apply.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">How do I track my order?</h2>
                    <p className="text-gray-700">
                        Once your order is dispatched, tracking information will be shared with you via SMS or email. You can use this information to monitor the delivery progress.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">How many delivery attempts will be made if I’m unavailable?</h2>
                    <p className="text-gray-700">
                        Our courier service will make up to <strong>three delivery attempts</strong>. If you’re not available on the first attempt, the next attempt will be made the following working day—not the same day.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default ShippingHandling;
