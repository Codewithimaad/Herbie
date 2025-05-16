import React from 'react';

const HeadingText = ({ title, description, center = true }) => {
    return (
        <div className={`${center ? 'text-center' : 'text-left'} mb-12`}>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-600 mb-4 tracking-tight">
                {title}
                <span className={`block ${center ? 'mx-auto' : ''} mt-3 w-16 h-1 rounded-full bg-gradient-to-r from-green-500 to-green-400`}></span>
            </h2>
            {description && (
                <p className={`text-gray-600 max-w-2xl ${center ? 'mx-auto' : ''} text-lg leading-relaxed`}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default HeadingText;