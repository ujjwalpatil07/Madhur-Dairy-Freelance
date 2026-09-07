import React, { useContext, lazy, Suspense, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import EastIcon from '@mui/icons-material/East';
import { ThemeContext } from "../context/ThemeProvider";
import { faqs, products } from "../data/products";
import ProductCard from "../components/LandingComponents/ProductCard";
import { features } from "../data/productGoodness ";
import { UserAuthContext } from "../context/AuthProvider";
import company from "../data/company.json";
import MadhurLoader from "../components/MadhurLoader";

const QuestionAnswer = lazy(() => import("../components/LandingComponents/QuestionAnswer"));
const FeatureCard = lazy(() => import("../components/LandingComponents/FeatureCard"));

export default function LandingPage() {

     const { authUser } = useContext(UserAuthContext);
     const { theme } = useContext(ThemeContext);
     const randomProducts = [...products]?.sort(() => Math.random() - 0.5)?.slice(0, 6); // sort(() => Math.random() - 0.5) // Shuffle the array

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

     if (pageLoading) {
          return (
               <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black">
                    <MadhurLoader />
               </div>
          );
     }

     return (
          <>
               <section className="relative w-full md:h-[100vh] overflow-hidden">
                    <img
                         src="https://res.cloudinary.com/dyahibuzy/image/upload/v1750157405/happyFamily_uuyftj.png"
                         alt="Happy Family"
                         className="absolute top-0 left-0 w-full h-full object-cover z-0"
                         fetchPriority="high"
                    />

                    <div className="absolute inset-0 bg-black/50 z-10" />

                    <motion.div
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ duration: 0.8 }}
                         className="relative z-20 py-16 px-3 text-center w-full h-full flex flex-col justify-center items-center"
                    >
                         <h1 className="text-xl sm:text-4xl md:text-5xl mb-2 font-bold text-white">
                              Welcome to
                         </h1>
                         <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 bg-clip-text text-transparent">
                              {company?.name}
                         </h1>
                         <p className="text-xl md:text-2xl mb-6 font-semibold text-white">
                              {company?.tagline}
                         </p>
                         <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl leading-relaxed text-white">
                              {company?.description}
                         </p>
                         <Link
                              to={authUser ? "/home" : "/login"}
                              className="flex items-center gap-4 px-8 py-3 rounded-full font-semibold text-lg bg-[#843E71] text-white transition-colors duration-300"
                         >
                              Get Started <EastIcon />
                         </Link>
                    </motion.div>
               </section>

               <section className="py-10 md:py-16 px-3 md:px-20">
                    <h2
                         className="text-2xl md:text-4xl font-bold mb-5 md:mb-5 text-gray-900 dark:text-gray-100"
                    >
                         Our Product Categories
                    </h2>


                    <div className="space-y-14 max-w-7xl mx-auto">
                         {
                              randomProducts.map((product, index) => (
                                   <motion.div
                                        key={index * 0.6}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 bg-white dark:bg-[#2b2b2b] p-2 md:p-6 rounded-xl transition-colors duration-300 shadow-md`}
                                   >
                                        <ProductCard
                                             title={product.title}
                                             description={product.description}
                                             image={product.image}
                                             features={product?.features}
                                        />
                                   </motion.div>
                              ))
                         }
                    </div>

                    <div className="flex justify-center py-15">
                         <Link
                              to="/products"
                              className="flex items-center gap-4 px-8 py-3 rounded-full font-semibold text-lg bg-[#843E71] text-white transition-colors duration-300 w-fit"
                         >
                              Explore Our Products
                         </Link>
                    </div>
               </section>

               <section className="max-w-6xl mx-auto px-4 pb-10 pt-5">
                    <h1
                         className="text-2xl md:text-4xl font-bold text-center mb-5 max-w-130 mx-auto"
                    >
                         Why Choose {company?.name}
                    </h1>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                         <Suspense fallback={<div className="text-center text-gray-600 dark:text-gray-300">Loading Features...</div>}>
                              {
                                   features?.map((feature, idx) => (
                                        <FeatureCard key={idx * 0.8} {...feature} />
                                   ))
                              }
                         </Suspense>

                    </div>
               </section>

               <section className="max-w-5xl mx-auto px-3 py-10">
                    <h2
                         className="text-2xl font-bold mb-6 text-gray-800 dark:text-white"
                    >
                         Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                         <Suspense fallback={<div className="text-center text-gray-600 dark:text-gray-300">Loading FAQs...</div>}>
                              {
                                   faqs.map((faq, index) => (
                                        <QuestionAnswer key={index * 0.9} question={faq.question} answer={faq.answer} />
                                   ))
                              }
                         </Suspense>

                    </div>
               </section>

               <section className="max-w-5xl mx-auto px-4 py-10">
                    <motion.div
                         initial={{ opacity: 0 }}
                         whileInView={{ opacity: 1 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.6 }}
                         className="flex flex-col md:flex-row items-center gap-8"
                    >
                         <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8 }}
                              className="flex justify-center items-center w-full md:w-1/2"
                         >
                              <img
                                   src={theme === "light" ? "https://res.cloudinary.com/dyahibuzy/image/upload/v1750157423/reviewDarkImage_nwyi9f.png" : "https://res.cloudinary.com/dyahibuzy/image/upload/v1750157422/reviewLightImage_gvenap.png"}
                                   alt="Customer Reviews"
                                   className="rounded-xl w-70 md:w-100 h-auto"
                              />
                         </motion.div>

                         <motion.div
                              initial={{ x: 50, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8 }}
                              className="w-full md:w-1/2 text-center md:text-left"
                         >
                              <h2 className="text-2xl font-bold mb-4">What Our Customers Say</h2>
                              <p className="text-gray-700 dark:text-gray-300 text-lg">
                                   At <span className="font-semibold">MilkyWay Farms</span>, we provide fresh, nutritious, and
                                   high-quality milky products loved by families and especially ideal for small children. Our customers' feedback
                                   reflects our commitment to quality and health!
                              </p>
                         </motion.div>
                    </motion.div>
               </section>
          </>
     );
}
