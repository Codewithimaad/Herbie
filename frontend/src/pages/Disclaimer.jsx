import React from 'react';
import HeadingText from '../components/HeadingText';

const Disclaimer = () => {
    return (
        <section className="min-h-scree px-4 md:py-16 md:px-6">
            <div className="md:p-8 rounded-2xl">
                <HeadingText
                    title='Disclaimer'
                />

                <p className="text-gray-700 sm:text-sm md:text-lg leading-relaxed mb-4">
                    All content, products, images, logos, designs, videos, newsletters, and
                    catalogues available on this site are the exclusive intellectual property of
                    <span className="font-semibold text-green-700"> Harbie</span>, and are intended
                    solely for use on this platform.
                </p>

                <p className="text-gray-700 sm:text-sm md:text-lg leading-relaxed mb-4">
                    Any unauthorized use, duplication, modification, reproduction, or distribution
                    of this content, in whole or in part, without prior written consent from Harbie
                    is strictly prohibited and may result in legal action.
                </p>

                <p className="text-gray-700 sm:text-sm md:text-lg leading-relaxed mb-4">
                    Harbie reserves the right to update, modify, or remove any content on the
                    website at any time without prior notice. While we strive to keep all
                    information accurate and up-to-date, we do not guarantee the completeness,
                    reliability, or timeliness of the content displayed.
                </p>

                <p className="text-gray-700 sm:text-sm md:text-lg leading-relaxed">
                    By accessing and using this website, you agree to comply with and be bound by
                    this disclaimer. If you do not agree with any part of this notice, please do
                    not use this website.
                </p>
            </div>
        </section>
    );
};

export default Disclaimer;
