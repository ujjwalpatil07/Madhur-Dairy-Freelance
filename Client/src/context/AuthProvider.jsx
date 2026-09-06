import React, { useEffect, useMemo, useState, createContext, useCallback } from "react";
import { getUserById } from "../services/userService";
import { getAdminById } from "../services/adminService";
import { socket } from "../socket/socket";
import { getSavedAddresses } from "../services/userProfileService";

export const UserAuthContext = createContext();
export const AdminAuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [authUser, setAuthUser] = useState(null);
    const [authAdmin, setAuthAdmin] = useState(null);
    const [authUserLoading, setAuthUserLoading] = useState(false);
    const [authAdminLoading, setAuthAdminLoading] = useState(false);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    const storedAddress = JSON.parse(localStorage.getItem("deliveryAddress"));
    const [deliveryAddress, setDeliveryAddress] = useState(storedAddress || null);

    const fetchUserData = useCallback(async (userId) => {
        try {
            setAuthUserLoading(true);
            if (userId) {
                const userData = await getUserById(userId);
                const user = userData?.user;

                if (user) {
                    setAuthUser(user);
                }

                const addressData = await getSavedAddresses(userId);
                const firstAddress = addressData?.userAddresses?.[0] || null;
                setDeliveryAddress(firstAddress);
            }
        } catch {
            setAuthUser(null);
            setDeliveryAddress(null);
        } finally {
            setAuthUserLoading(false);
        }
    }, []);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("User"));
        if (localUser?._id) fetchUserData(localUser?._id);
    }, [fetchUserData]);

    const fetchAdminData = useCallback(async (adminId) => {
        try {
            setAuthAdminLoading(true);
            if (adminId) {
                const data = await getAdminById(adminId);
                setAuthAdmin(data?.admin);
            }
        } catch {
            setAuthAdmin(null);
        } finally {
            setAuthAdminLoading(false);
        }
    }, []);

    useEffect(() => {
        const localAdmin = JSON.parse(localStorage.getItem("Admin"));
        if (localAdmin?._id) fetchAdminData(localAdmin?._id);
    }, [fetchAdminData]);

     const handleUserLogout = useCallback(() => {
          if (socket && authUser?._id) {
               socket.emit("client:logout", {
                    userId: authUser._id,
               });
          }

          setAuthUser(null);

          localStorage.removeItem("User");
          localStorage.removeItem("accessToken");
     }, [authUser?._id]);

    const handleAdminLogout = useCallback(() => {

        if (socket && authAdmin?._id) {
            socket.emit("client:logout", { adminId: authAdmin._id });
        }
        setAuthAdmin(null);
        localStorage.removeItem("Admin");
    }, [authAdmin?._id]);

    const value1 = useMemo(() => ({
        authAdmin,
        authAdminLoading,
        setAuthAdmin,
        setAuthAdminLoading,
        handleAdminLogout,
        fetchAdminData
    }), [authAdmin, authAdminLoading, handleAdminLogout, fetchAdminData]);

    const value2 = useMemo(() => ({
        authUser,
        deliveryAddress,
        authUserLoading,
        openLoginDialog,
        setAuthUser,
        setDeliveryAddress,
        setAuthUserLoading,
        setOpenLoginDialog,
        handleUserLogout,
        fetchUserData
    }), [authUser, deliveryAddress, authUserLoading, openLoginDialog, handleUserLogout, fetchUserData]);

    return (
        <AdminAuthContext.Provider value={value1}>
            <UserAuthContext.Provider value={value2}>
                {children}
            </UserAuthContext.Provider>
        </AdminAuthContext.Provider>
    );
}
