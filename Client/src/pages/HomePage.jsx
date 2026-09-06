import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import heroImage from "../assets/heroImage.png"
import { offerings, products } from "../data/products";
import MadhurLoader from "../components/MadhurLoader";
import { UserAuthContext } from "../context/AuthProvider";
import OfferingCard from "../components/HomeComponents/OfferingCard";
import OfferingProductCard from "../components/HomeComponents/OfferingProductCard";
import { fetchRecentReviews } from "../services/productServices";
import company from "../data/company.json";

const Marquee = lazy(() => import("react-fast-marquee"));
const DairyProductsCarousel = lazy(() => import("../components/HomeComponents/DairyProductsCarousel"));
const ReviewCard = lazy(() => import("../components/HomeComponents/ReviewCard"));
const ProductProcess = lazy(() => import("../components/ProductProcess"));

export default function HomePage() {

    const { authUser } = useContext(UserAuthContext);
    const [productCount, setProductCount] = useState(8);

    const [customerReviews, setCustomerReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        // Wait until browser has fully loaded (including images, fonts, etc.)
        const handleWindowLoad = () => {
            setPageLoading(false);
        };

        // If already loaded (e.g., fast refresh), skip
        if (document.readyState === "complete") {
            handleWindowLoad();
        } else {
            window.addEventListener("load", handleWindowLoad);
        }

        return () => {
            window.removeEventListener("load", handleWindowLoad);
        };
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetchRecentReviews();;
                setCustomerReviews(res?.reviews || []);
            } catch (err) {
                console.error("Error fetching reviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleLoadMore = () => {
        setProductCount((prev) => prev + 3);
    };

    if (pageLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black">
                <MadhurLoader />
            </div>
        );
    }

    return (
        <>
            <section className="w-full p-3 sm:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg"
                >
                    <div className="absolute inset-0 bg-black/50 z-10" />

                    <img
                        src={heroImage}
                        alt="Welcome Banner"
                        fetchPriority="high"
                        className="w-full object-cover"
                    />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="absolute inset-0 bg-black/30 flex items-center justify-center px-6 z-20"
                    >
                        <div className="text-center">
                            {authUser && (
                                <>
                                    {
                                        authUser?.firstName && <h1
                                            className="text-lg sm:text-xl md:text-5xl font-bold md:mb-2 text-yellow-100"
                                        >
                                            Hi{" "}
                                            <span className="text-[#FFEB3B]">
                                                {authUser?.firstName} {authUser?.lastName}
                                            </span>
                                        </h1>
                                    }

                                    <h2
                                        className="text-lg md:text-3xl text-white"
                                    >
                                        Welcome To
                                    </h2>
                                </>
                            )}

                            <h1 className="text-lg sm:text-2xl md:text-7xl font-bold mb-4 bg-gradient-to-t from-[#00ce03] to-white bg-clip-text text-transparent drop-shadow-md">
                                {company?.name}
                            </h1>

                            <p
                                className="hidden sm:flex text-sm md:text-2xl max-w-2xl mx-auto justify-center text-gray-100"
                            >
                                {company?.tagline}
                            </p>

                            <div className="flex justify-center mt-15">
                                <Link
                                    to="/products"
                                    className="flex items-center gap-4 px-8 py-3 rounded-full font-semibold text-lg bg-[#843E71] text-white transition-colors duration-300 w-fit"
                                >
                                    Explore Our Products
                                </Link>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            </section>

            <section className="px-3 py-5 sm:px-6 md:py-15">
                <h2
                    className="text-xl md:text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white"
                >
                    Discover Our Delicious Dairy Range
                </h2>

                <Suspense fallback={<div className="text-center py-5 text-gray-400">Loading carousel...</div>}>
                    <Marquee speed={40} gradient={false} pauseOnHover={true}>
                        <DairyProductsCarousel half="first" />
                    </Marquee>
                </Suspense>

                <Suspense fallback={<div className="text-center py-5 text-gray-400">Loading carousel...</div>}>
                    <Marquee speed={35} gradient={false} direction="right" className="mt-6" pauseOnHover={true}>
                        <DairyProductsCarousel half={"second"} />
                    </Marquee>
                </Suspense>
            </section>

            <section className="py-16 px-3 md:px-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto text-center">
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
                    >
                        Elevate Your Health <br />
                        <span className="text-[#706c93] dark:text-indigo-400">
                            With Our Superior Dairy Range
                        </span>
                    </h2>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:px-5 lg:px-20">
                        {offerings.map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                key={index * 0.9}
                            >
                                <OfferingCard
                                    image={item.image}
                                    title={item.title}
                                    description={item.description}
                                />
                            </motion.div>

                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 md:px-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Our Goodness</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
                        Comes in many forms — all pure, nutritious, and farm-fresh.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.slice(0, productCount).map((product, index) => (
                        <OfferingProductCard key={index * 0.7} title={product?.title} image={product?.image} />
                    ))}
                </div>

                {productCount < products.length && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            className="bg-[#213448] text-white px-6 py-2 rounded-full shadow-md transition"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </section>

            <section className="mb-10 w-full py-10 px-4 sm:px-6 md:px-16 bg-white dark:bg-gray-700/20 transition-colors duration-500">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">

                    <div className="h-full flex items-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-snug">
                            Taste the Tradition, <br className="hidden sm:block" />
                            Crafted with Care & Purity
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                            From farm to table, every product is a promise of natural goodness. Our dairy delights are made to nourish your day with flavor and freshness you can trust.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Link
                                to="/products"
                                className="px-6 py-2.5 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/contact"
                                className="px-6 py-2.5 rounded-md text-sm font-medium border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-6 md:px-16 transition-colors duration-500">
                <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    What Our Customers Say
                </h2>

                {loading ? (
                    <div className="text-center py-5 text-gray-400">Loading testimonials...</div>
                ) : (
                    <Suspense fallback={<div className="text-center py-5 text-gray-400">Loading testimonials...</div>}>
                        <Marquee gradient={false} speed={20}>
                            <div className="flex gap-10 p-3">
                                {customerReviews.map((review) => (
                                    <ReviewCard
                                        key={review._id}
                                        userImage={review?.userId?.photo || "/default-user.png"}
                                        name={review?.userId?.username || "Anonymous"}
                                        message={review.message}
                                        rating={review.rating}
                                        likesCount={review.likes?.length || 0}
                                    />
                                ))}
                            </div>
                        </Marquee>
                    </Suspense>
                )}
            </section>

            <Suspense fallback={<div className="text-center py-5 text-gray-400">Loading product process...</div>}>
                <ProductProcess />
            </Suspense>

        </>
    );
}
