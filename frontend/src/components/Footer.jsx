// src/components/Footer.jsx
export default function Footer() {
    return (
        <footer className="bg-green-800 text-white text-center py-4 mt-10">
            <div className="container mx-auto">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} HerbalStore. All rights reserved.
                </p>
                <p className="text-xs mt-1">
                    Crafted with 🌿 for herbal wellness.
                </p>
            </div>
        </footer>
    );
}
