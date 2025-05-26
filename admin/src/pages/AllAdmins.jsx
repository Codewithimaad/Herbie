import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiUser, FiPlus, FiSearch, FiRefreshCw, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AdminDetailsModal from '../components/AdminDetailsModal';
import AddAdminModal from '../components/AddAdminModal';

const AllAdmins = () => {
    const { admins = [], loadingAdmins, adminsError, fetchAllAdmins } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
        console.log('Fetching admins in useEffect');
        fetchAllAdmins();
    }, [fetchAllAdmins]);

    const filteredAdmins = admins.filter(admin =>
        admin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (admin) => {
        setSelectedAdmin(admin);
    };

    const handleDeleteClick = (admin) => {
        setSelectedAdmin(admin);
        setIsDeleteModalOpen(true);
    };

    const handleViewClick = (admin) => {
        setSelectedAdmin(admin);
        setIsDetailsModalOpen(true);
    };

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleRetry = () => {
        console.log('Retrying fetchAllAdmins');
        fetchAllAdmins();
    };

    console.log('Rendering AllAdmins, admins:', admins, 'loading:', loadingAdmins, 'error:', adminsError);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:ml-72">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Management</h1>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search admins..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleAddClick}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm hover:shadow-md"
                        >
                            <FiPlus className="h-5 w-5" />
                            <span>Add Admin</span>
                        </button>
                    </div>
                </div>

                {/* Admins Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-gray-100/50"
                >
                    {loadingAdmins ? (
                        <div className="p-8 flex justify-center">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-8 w-8 bg-emerald-200 rounded-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : adminsError ? (
                        <div className="p-8 text-center">
                            <p className="text-red-500 mb-4">{adminsError}</p>
                            <button
                                onClick={handleRetry}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                            >
                                <FiRefreshCw className="h-5 w-5" />
                                Retry
                            </button>
                        </div>
                    ) : filteredAdmins.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm ? 'No matching admins found' : 'No admins available'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAdmins.map((admin) => (
                                        <motion.tr
                                            key={admin._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <FiUser className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{admin.name || 'No name'}</div>
                                                        <div className="text-sm text-gray-500">{admin.bio || 'No bio'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {admin.email || 'No email'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleViewClick(admin)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-lg hover:bg-blue-50"
                                                        aria-label={`View ${admin.name || 'admin'} details`}
                                                    >
                                                        <FiEye className="h-5 w-5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteClick(admin)}
                                                        className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                                                        aria-label={`Delete ${admin.name || 'admin'}`}
                                                    >
                                                        <FiTrash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>



            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <DeleteConfirmationModal
                        admin={selectedAdmin}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onSuccess={fetchAllAdmins}
                    />
                )}
            </AnimatePresence>

            {/* Admin Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && (
                    <AdminDetailsModal
                        admin={selectedAdmin}
                        onClose={() => setIsDetailsModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddAdminModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={fetchAllAdmins}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllAdmins;