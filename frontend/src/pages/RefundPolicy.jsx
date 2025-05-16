import React from 'react';
import HeadingText from '../components/HeadingText';

const RefundPolicy = () => {
    return (
        <section className="min-h-screen  py-16 px-6">
            <div className="p-8 rounded-2xl">

                <HeadingText title='Refund & Exchange Policy' />

                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                    <p className="font-semibold text-xl text-green-700">
                        What is your Return/Exchange Policy?
                    </p>
                    <p>
                        A product can only be returned or exchanged if it is found damaged upon receipt.
                        We will facilitate the exchange or return if the product delivered was either damaged
                        or did not meet your specifications.
                    </p>
                    <p>
                        To initiate a return or exchange, please contact our customer service team within
                        <span className="font-semibold text-red-600"> 24 hours </span> of receiving your order.
                        Make sure to include photographic evidence of the product, a picture of the invoice,
                        and your order ID via email or phone.
                    </p>
                    <p>
                        Any complaints made after the 24-hour window cannot be accommodated. Please ensure
                        you do not dispose of the product or packaging before contacting us.
                    </p>
                    <p>
                        <strong className="text-red-700">Note:</strong> Items purchased online are not eligible
                        for exchange at Harbie retail stores.
                    </p>

                    <p className="font-semibold text-xl text-green-700">
                        What if there is a defect in the order received?
                    </p>
                    <p>
                        If a defective item is delivered, Harbie will arrange a pickup via our courier partner.
                        Pickup timings will be communicated to the customer in advance.
                    </p>
                    <p>
                        To proceed, you’ll need to email or WhatsApp us the following:
                        <ul className="list-disc list-inside pl-4 mt-2">
                            <li>Clear photos of the damaged product</li>
                            <li>A copy/photo of the invoice</li>
                            <li>The courier’s airway bill (if available)</li>
                        </ul>
                    </p>
                    <p>
                        Once verified, a replacement will be issued for the specific item as listed on the invoice.
                        The same 24-hour complaint window applies here as well.
                    </p>
                    <p>
                        Products must be returned in their original packaging to facilitate a smooth exchange process.
                        Any repackaging or mishandling may result in additional charges, to be borne by the customer.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RefundPolicy;
