import { useContext, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { ProductContext } from "../context/ProductProvider";

export default function Layout({ children }) {

    const scrollRef = useRef(null);
    const location = useLocation();

    const { setShowHeaderExtras } = useContext(ProductContext);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0 });
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = scrollRef.current.scrollTop;

            if (scrollTop > 100) {
                setShowHeaderExtras(true);
            } else {
                setShowHeaderExtras(false);
            }
        };

        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [setShowHeaderExtras]);

    return (
        <div ref={scrollRef} className="h-screen scroll-smooth flex flex-col overflow-y-auto overflow-x-hidden bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node
};