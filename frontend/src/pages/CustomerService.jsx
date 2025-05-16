import React from 'react';
import HeadingText from '../components/HeadingText';

const CustomerService = () => {
    return (
        <main className="min-h-screen py-12 md:px-4 sm:px-2 lg:px-20 text-gray-800">
            <div className="rounded-2xl sm:p-4 md:p-12 transition-all duration-300">
                <HeadingText
                    title='Customer Services'
                />

                {/* Section Component (Reusable Pattern) */}
                {sections.map((section, idx) => (
                    <section key={idx} className="mb-10">
                        <h2 className="sm:text-base md:text-2xl font-semibold text-green-700 mb-4 border-b-2 border-green-600 pb-2">
                            {section.heading}
                        </h2>
                        <p className="text-sm md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {section.content}
                        </p>
                    </section>
                ))}
            </div>
        </main>
    );
};

// Simulated section data
const sections = [
    {
        heading: "1. Overview",
        content: `This website is operated by Harbie. Throughout the site, the terms "we", "us", and "our" refer to Harbie...

These Terms apply to all users of the site, including browsers, vendors, customers, merchants...

It is your responsibility to check this page periodically for changes. Continued use of the site after any changes constitutes acceptance of those changes.`
    },
    {
        heading: "2. Online Store Terms",
        content: `By using our site, you confirm that you are of legal age in your jurisdiction...

You may not use our services for illegal or unauthorized purposes...`
    },
    {
        heading: "3. General Conditions",
        content: `We reserve the right to refuse service to anyone at any time for any reason...

You understand that your content may be transferred unencrypted...`
    },
    {
        heading: "4. Accuracy, Completeness, and Timeliness of Information",
        content: `We are not responsible if information made available on this site is inaccurate...

You agree that it is your responsibility to monitor changes.`
    },
    {
        heading: "5. Modifications to the Service and Prices",
        content: `Product prices are subject to change without notice...

We reserve the right to modify or discontinue any part of the Service without notice.`
    },
    {
        heading: "18. Entire Agreement",
        content: `These Terms of Service, along with any policies or legal notices posted by us...

Our failure to enforce any provision does not waive that right.`
    }
    // Add the rest of your 18 sections as needed.
];

export default CustomerService;
