import { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Sidebar from "../components/AdminComponents/Sidebar";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarProvider";
import AdminNavbar from "../components/AdminComponents/AdminNavbar";
import { AdminAuthContext, UserAuthContext } from "../context/AuthProvider";
import AdminOrderProvider from "../context/AdminOrderProvider";

export default function AdminLayout({ children }) {
     const scrollRef = useRef(null);
     const location = useLocation();

     const {
          authAdmin,
          authAdminLoading,
     } = useContext(AdminAuthContext);

     const {
          setOpenLoginDialog,
     } = useContext(UserAuthContext);

     useEffect(() => {
          if (scrollRef.current) {
               scrollRef.current.scrollTo({
                    top: 0,
               });
          }
     }, [location.pathname]);


     /*
      * ============================================================
      * AUTHENTICATION LOADING
      * ============================================================
      *
      * AuthProvider checks:
      *
      * accessToken
      *      ↓
      * JWT role
      *      ↓
      * /auth/admin/me
      *      ↓
      * authAdmin
      *
      * Therefore we wait for AuthProvider instead of checking
      * localStorage.Admin.
      */

     if (authAdminLoading) {
          return (
               <div className="h-screen p-4 gap-3 flex justify-center items-center bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>

                    <p className="text-sm animate-pulse">
                         Loading admin details...
                    </p>
               </div>
          );
     }


     /*
      * ============================================================
      * ADMIN AUTHENTICATION CHECK
      * ============================================================
      *
      * IMPORTANT:
      *
      * We DO NOT navigate to /admin/login here.
      *
      * During logout:
      *
      * handleAdminLogout()
      *        ↓
      * authAdmin = null
      *        ↓
      * navigate("/")
      *
      * If this layout automatically navigates to /admin/login
      * when authAdmin becomes null, it can override the intended
      * logout flow.
      *
      * Therefore this component only displays the unauthorized
      * state if an unauthenticated user directly accesses an
      * admin-protected route.
      */

     if (!authAdmin?._id) {
          return (
               <div className="h-screen p-4 flex flex-col items-center justify-center text-center space-y-4 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">

                    <span className="text-red-500 font-medium">
                         Unauthorized access. Please login as admin.
                    </span>

                    <button
                         onClick={() => setOpenLoginDialog(true)}
                         className="px-4 py-2 bg-[#843E71] text-white rounded hover:bg-[#843E7190] transition"
                    >
                         Login
                    </button>

               </div>
          );
     }


     /*
      * ============================================================
      * AUTHENTICATED ADMIN
      * ============================================================
      */

     return (
          <AdminOrderProvider>
               <SidebarProvider>
                    <div
                         ref={scrollRef}
                         className="h-screen scroll-smooth flex overflow-hidden bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300"
                    >
                         <Sidebar />

                         <main className="flex-1 h-full overflow-y-auto overflow-x-hidden">
                              <AdminNavbar />

                              {children}
                         </main>
                    </div>
               </SidebarProvider>
          </AdminOrderProvider>
     );
}

AdminLayout.propTypes = {
     children: PropTypes.node,
};