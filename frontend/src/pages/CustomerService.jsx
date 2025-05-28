import React, { useState } from 'react';
import HeadingText from '../components/HeadingText';

const CustomerService = () => {
    // State to manage which section is expanded
    const [openSection, setOpenSection] = useState(null);

    // Toggle function for accordion
    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-20 bg-gray-50 text-gray-800">
            <div className="max-w-8xl mx-auto">
                <HeadingText
                    title="Customer Services"
                    className="text-center mb-12"
                />

                {/* Accordion for Sections */}
                <div className="space-y-4">
                    {sections.map((section, idx) => (
                        <section
                            key={idx}
                            className="bg-white rounded-lg shadow-md transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleSection(idx)}
                                className="w-full flex justify-between items-center p-4 sm:p-6 text-left focus:outline-none"
                            >
                                <h2 className="sm:text-lg md:text-xl font-semibold text-green-700">
                                    {section.heading}
                                </h2>
                                <span className="text-green-600">
                                    {openSection === idx ? (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 15l7-7 7 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    )}
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openSection === idx ? 'max-h-screen p-4 sm:p-6' : 'max-h-0'
                                    }`}
                            >
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Note */}
                <p className="mt-12 text-center text-sm text-gray-500">
                    Last updated: May 28, 2025
                </p>
            </div>
        </main>
    );
};

// Complete section data with all 18 sections
const sections = [
    {
        heading: "1. Overview",
        content: `This website is operated by Harbie. Throughout the site, the terms "we", "us", and "our" refer to Harbie. By accessing or using our website and services, including making purchases, you agree to comply with and be bound by these Terms of Service and all related policies referenced herein or available via hyperlink.
These Terms apply to all users of the site, including but not limited to browsers, vendors, customers, merchants, and contributors of content. If you do not agree with these Terms, you may not access the site or use any services.
Any new features or tools added to our site will also be subject to these Terms. We reserve the right to update or modify these Terms at any time. It is your responsibility to check this page periodically for changes. Continued use of the site after any changes constitutes acceptance of those changes.`,
    },
    {
        heading: "2. Online Store Terms",
        content: `By using our site, you confirm that you are of legal age in your jurisdiction, or that you are of legal age and have given consent for any minors in your care to use the site.
You may not use our services for illegal or unauthorized purposes. You also agree not to violate any laws in your jurisdiction, including but not limited to copyright laws. Transmitting any destructive code, viruses, or malware is strictly prohibited. Any violation of these Terms will result in immediate termination of service.`,
    },
    {
        heading: "3. General Conditions",
        content: `We reserve the right to refuse service to anyone at any time for any reason.
You understand that your content (excluding credit card information) may be transferred unencrypted and involve transmission over various networks or changes to meet technical requirements. Credit card information is always encrypted during transfer.
You agree not to reproduce, duplicate, sell, resell or exploit any portion of the Service without express written permission from us.`,
    },
    {
        heading: "4. Accuracy, Completeness, and Timeliness of Information",
        content: `We are not responsible if information made available on this site is inaccurate, incomplete, or outdated. The content is provided for general information and should not be solely relied upon. You assume all risk for your reliance on such material.
We may update site content at any time, but we are under no obligation to do so. You agree that it is your responsibility to monitor changes.`,
    },
    {
        heading: "5. Modifications to the Service and Prices",
        content: `Product prices are subject to change without notice. We reserve the right to modify or discontinue any part of the Service without notice and will not be liable for any such changes.`,
    },
    {
        heading: "6. Products or Services",
        content: `Some products or services may be available exclusively online and in limited quantities, subject to our Return Policy.
We strive to display accurate colors and images of products but cannot guarantee your monitor will display them accurately.
We may limit sales on a case-by-case basis and reserve the right to discontinue any product or change its description at any time. We do not guarantee that products or services will meet your expectations or that errors in the Service will be corrected.`,
    },
    {
        heading: "7. Billing and Account Information",
        content: `We reserve the right to refuse or cancel orders at our sole discretion. Limits may apply per account, credit card, billing or shipping address.
You agree to provide accurate and up-to-date information for all transactions. This includes updating your account, email, billing, and payment details to ensure successful transactions.
See our Returns Policy for more details.`,
    },
    {
        heading: "8. Optional Tools",
        content: `We may provide access to third-party tools which we neither monitor nor control.
You acknowledge that such tools are provided “as is” and we disclaim any responsibility arising from your use of them. Use them at your own risk and ensure you agree to any applicable third-party terms.
Future services or features offered will also be subject to these Terms.`,
    },
    {
        heading: "9. Third-Party Links",
        content: `Some content, products, and services may be provided by third parties. Third-party links may direct you to sites not affiliated with us. We do not assume any responsibility for their content or accuracy.
We are not liable for any transactions made with third-party websites. Review their terms and policies before engaging in any transaction.`,
    },
    {
        heading: "10. User Comments, Feedback & Submissions",
        content: `If you send us comments, feedback, or creative content (solicited or unsolicited), you grant us the unrestricted right to use, edit, and distribute them in any medium. We are not obligated to maintain comments in confidence or provide compensation.
You agree your comments will not violate any third-party rights or contain unlawful, offensive, or harmful content. We are not responsible for user comments and reserve the right to remove objectionable content at our discretion.`,
    },
    {
        heading: "11. Personal Information",
        content: `Your submission of personal information is governed by our Privacy Policy, which can be reviewed on our website.`,
    },
    {
        heading: "12. Errors, Inaccuracies, and Omissions",
        content: `Occasionally, there may be errors in product descriptions, pricing, promotions, or availability. We reserve the right to correct such errors and to cancel or update orders if necessary, without prior notice.
We are under no obligation to update any information unless legally required.`,
    },
    {
        heading: "13. Prohibited Uses",
        content: `You are prohibited from using our site or its content:
• For any unlawful purpose
• To solicit unlawful acts
• To violate any laws or regulations
• To infringe upon our or others’ intellectual property
• To harass or discriminate against others
• To submit false information
• To upload malicious code
• To collect or track personal information
• For spamming, phishing, or crawling
• To interfere with the site’s security
Violating these prohibitions may result in termination of your access.`,
    },
    {
        heading: "14. Disclaimer of Warranties; Limitation of Liability",
        content: `We do not guarantee that our service will be uninterrupted or error-free. Use of the service is at your own risk. All services and products are provided “as is” and “as available” without warranties of any kind.
In no case shall Harbie or its affiliates be liable for any damages, including lost profits or data, arising from the use of our service or products. Where local law does not allow the exclusion of certain warranties or liabilities, our liability shall be limited to the maximum extent permitted by law.`,
    },
    {
        heading: "15. Indemnification",
        content: `You agree to indemnify and hold harmless Harbie and its affiliates from any claims or demands arising from your breach of these Terms or violation of any law or third-party rights.`,
    },
    {
        heading: "16. Severability",
        content: `If any provision of these Terms is deemed unlawful or unenforceable, the remaining provisions shall remain valid and enforceable.`,
    },
    {
        heading: "17. Termination",
        content: `Either you or we may terminate these Terms at any time. We may do so without notice if we believe you have violated any provision of these Terms. Termination will not affect any obligations or liabilities incurred before the termination date.`,
    },
    {
        heading: "18. Entire Agreement",
        content: `These Terms of Service, along with any policies or legal notices posted by us, constitute the full agreement between you and us and govern your use of the site. Our failure to enforce any provision does not waive that right.`,
    },
];

export default CustomerService;