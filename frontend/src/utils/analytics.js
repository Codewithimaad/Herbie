export const initAnalytics = () => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize data layer
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        // Enable debug mode if needed
        if (import.meta.env.VITE_GA_DEBUG === 'true') {
            gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, { debug_mode: true });
        } else {
            gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
        }
    }
};

export const trackPageView = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: url,
            page_title: document.title,
            page_location: window.location.href
        });
    }
};

export const trackEvent = ({ action, category, label, value }) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};