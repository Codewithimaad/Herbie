import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {


    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    return (
        <AdminContext.Provider
            value={{
                backendUrl

            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

// Hook for consuming AdminContext easily
export const useAdmin = () => useContext(AdminContext);

export default AdminContext;
