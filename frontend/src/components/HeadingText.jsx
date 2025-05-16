import React from 'react';

const HeadingText = ({ title, description }) => {
    return (
        <div className='text-center'>
            <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-600 to-green-800 mb-8 tracking-wide drop-shadow-md relative inline-block">
                {title}
                <span className="block mx-auto mt-3 w-24 h-1 rounded-full bg-green-700"></span>
            </h2>
            <p className="text-center text-green-700 max-w-xl mx-auto mb-16 text-lg font-medium tracking-wide">
                {description}
            </p>
        </div>
    );
};

export default HeadingText;
