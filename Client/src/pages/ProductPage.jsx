import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { getTopProductsByReviewsAndLikes, recommendProducts, searchProducts, sortProducts } from "../utils/filterData";
import ProductList from "../components/ProductComponents/ProductList";
import SearchProducts from "../components/ProductComponents/SearchProducts";
import RecommendedCard from "../components/ProductComponents/RecommendedCard";
import ProductVarietyCart from "../components/ProductComponents/ProductVarietyCard";
import { getAverageRating } from "../utils/averageRating";

import { ProductContext } from "../context/ProductProvider";
import { getRandomImage } from "../utils/imagePicker";
import MilkyLoader from "../components/MilkyLoader";

export default function ProductPage() {

     const { productId } = useParams();
     const { filter, products, productLoading } = useContext(ProductContext);

     const [query, setQuery] = useState(productId || "");
     const [debouncedQuery] = useDebounce(query, 300);
     const [visibleCount, setVisibleCount] = useState(5);
     const [visibleCount1, setVisibleCount1] = useState(3);

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
          setQuery(productId);
     }, [productId]);

     const handleInputChange = (e) => {
          setQuery(e.target.value);
     }

     const filteredProducts = useMemo(() => {
          return searchProducts(products ?? [], debouncedQuery);
     }, [products, debouncedQuery]);

     const recommendedProducts = useMemo(() => {
          return recommendProducts(products ?? [], debouncedQuery);
     }, [products, debouncedQuery]);

     const topProducts = getTopProductsByReviewsAndLikes(filteredProducts ?? []);

     const sortedFilteredProducts = useMemo(() => {
          return sortProducts(filteredProducts ?? [], filter);
     }, [filteredProducts, filter]);


     if (pageLoading) {
          return (
               <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black">
                    <MilkyLoader />
               </div>
          );
     }

     return (
          <>
               <SearchProducts query={query} handleInputChange={handleInputChange} />

               <div className="w-full p-3 lg:px-8 flex flex-col sm:flex-row md:gap-5">

                    <motion.div
                         initial={{ opacity: 0, x: -30 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.5, ease: "easeOut" }}
                         className="sticky top-18 scrollbar-hide hidden md:block w-60 p-4 h-[calc(100vh-90px)] overflow-y-auto bg-white dark:bg-gray-500/20 rounded-lg shadow-sm transition-colors duration-500 border-y-15 border-white dark:border-transparent"
                    >
                         <ProductList />
                    </motion.div>

                    <div className="flex-1 space-y-5">
                         {productLoading ? (
                              <MilkyLoader />
                         ) : (
                              <>
                                   <section
                                        className="w-full"
                                   >
                                        {(sortedFilteredProducts?.length ?? 0) === 0 ? (
                                             <div className="py-20 text-center">No products found matching your search/filter.</div>
                                        ) : (
                                             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-5 border-b border-dashed border-gray-500/50">
                                                  {sortedFilteredProducts.map((product, index) => (
                                                       <ProductVarietyCart
                                                            key={product?._id || index}
                                                            id={product?._id}
                                                            image={getRandomImage(product?.image || []) || null}
                                                            name={product?.name || "Unnamed Product"}
                                                            discount={product?.discount || 0}
                                                            rating={getAverageRating(product?.reviews || []) || 0}
                                                            likes={Array.isArray(product?.likes) ? product.likes : []}
                                                            type={product?.type || "Unknown"}
                                                            price={product?.price || 0}
                                                            minQuantity={product?.minQuantity || 1}
                                                            stock={product?.stock || 0}
                                                            quantityUnit={product?.quantityUnit || "unit"}
                                                       />
                                                  ))}
                                             </div>
                                        )}
                                   </section>

                                   {recommendedProducts?.length > 0 && (
                                        <section
                                             className="pt-5"
                                        >
                                             <h2 className="text-lg font-semibold py-2">Recommended</h2>

                                             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-5">
                                                  {recommendedProducts.slice(0, visibleCount).map((variety, idx) => (
                                                       <RecommendedCard
                                                            key={variety?._id || idx}
                                                            id={variety._id}
                                                            image={variety?.image?.[0] || ""}
                                                            name={variety?.name || "Unknown Product"}
                                                            description={variety?.description || "No description"}
                                                            likes={variety?.likes || []}
                                                            rating={getAverageRating(variety?.reviews || [])}
                                                       />
                                                  ))}
                                             </div>

                                             {visibleCount < recommendedProducts.length && (
                                                  <div className="text-center pt-4">
                                                       <button
                                                            onClick={() => setVisibleCount(prev => prev + 5)}
                                                            className="bg-[#213448] text-white px-6 py-2 rounded-full shadow-md transition cursor-pointer"
                                                       >
                                                            Load More
                                                       </button>
                                                  </div>
                                             )}
                                        </section>
                                   )}

                                   {topProducts?.length > 0 && (
                                        <section>
                                             <h2 className={`text-lg font-semibold ${recommendedProducts?.length > 0 && "border-t border-dashed border-gray-500/50 pt-5"}`}>
                                                  Most Reviews & Likes
                                             </h2>

                                             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
                                                  {topProducts.slice(0, visibleCount1).map((variety, idx) => (
                                                       <RecommendedCard
                                                            key={variety?._id || idx}
                                                            id={variety._id}
                                                            image={variety?.image?.[0] || ""}
                                                            name={variety?.name || "Unnamed"}
                                                            description={variety?.description || "No description available"}
                                                            likes={variety?.likes ?? []}
                                                            rating={getAverageRating(variety?.reviews ?? [])}
                                                       />
                                                  ))}
                                             </div>

                                             {visibleCount1 < topProducts.length && (
                                                  <div className="text-center pt-4">
                                                       <button
                                                            onClick={() => setVisibleCount1(prev => prev + 3)}
                                                            className="bg-[#213448] text-white px-6 py-2 rounded-full shadow-md transition cursor-pointer"
                                                       >
                                                            Load More
                                                       </button>
                                                  </div>
                                             )}
                                        </section>
                                   )}
                              </>
                         )}
                    </div>
               </div>
          </>
     );
}
