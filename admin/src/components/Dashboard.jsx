import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="flex pt-16">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    currentPath={location.pathname}
                />
                <div className="flex-1 mt-10 md:mt-2 p-2 md:p-6 overflow-x-hidden overflow-y-auto">
                    <Outlet /> {/* This renders the nested routes */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;