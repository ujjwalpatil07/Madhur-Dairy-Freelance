import { useContext, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import { Pagination } from "@mui/material";
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';

import { ThemeContext } from "../context/ThemeProvider";

import ProductDetails from "../components/ProductDetalisComponent/ProductDetails";
import ReviewSection from "../components/ProductDetalisComponent/ReviewSection.jsx";

import { slugify } from "../utils/slugify";
import { recommendProducts } from "../utils/filterData";
import { unslugify } from "../utils/unslugify.js"
import { ProductContext } from "../context/ProductProvider.jsx";

export default function ProductDetailsPage() {

    const { productId } = useParams();
    const { theme } = useContext(ThemeContext);
    const { products, productLoading } = useContext(ProductContext);

    const [page, setPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (!productId || !products) return;

        if (products.length === 0) {
            setSelectedProduct(null);
            return;
        }

        const selected = products.find((p) => slugify(p.name) === productId);
        setSelectedProduct(selected);

        const currRelatedProducts = recommendProducts(products, productId);
        setRelatedProducts(currRelatedProducts);
    }, [productId, products]);

    const totalPages = Math.ceil(relatedProducts.length / 10);
    const startIndex = (page - 1) * 10;
    const currentItems = relatedProducts.slice(startIndex, startIndex + 10);

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    if (productLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-gray-600 dark:text-white gap-3">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
                <span className="text-xl">Loading product...</span>
            </div>
        );
    }

    if (!selectedProduct) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-white text-lg mb-3">
                    {products.length === 0
                        ? "No products available in the store."
                        : `${unslugify(productId)} Product not found.`}
                </p>
                <Link
                    to="/products"
                    className="mt-4 px-4 py-2 bg-[#843E71] text-white rounded hover:bg-[#843E71] transition"
                >
                    Go to Products
                </Link>
            </div>
        );
    }

    return (
        <>
            <section className="px-3 md:px-6 py-6 md:py-10 md:max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 ">
                    <ProductDetails
                        productId={selectedProduct?._id || ""}
                    />
                </div>
            </section>

            {
                (relatedProducts?.length > 0) && <section
                    className="px-3 md:px-6 pb-6 md:pb-10 md:max-w-6xl mx-auto"
                >

                    <h1 className="border-t border-dashed border-gray-500/50 pb-2 pt-5 text-xl font-semibold">Related Product</h1>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                        {currentItems.map((product, idx) => (
                            <motion.div
                                key={product?._id || idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                className="bg-white dark:bg-gray-500/20 transition-colors duration-300 rounded-lg shadow-md overflow-hidden hover:shadow-lg"
                            >
                                {!product?.image?.[0] ? (
                                    <div className="w-full h-40 flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800">
                                        <EmojiFoodBeverageIcon className="text-gray-400 dark:text-gray-300 text-5xl" />
                                        <Link to={`/product-details/${slugify(product?.name)}`}>
                                            <span className="text-gray-500 dark:text-gray-300 text-sm font-medium hover:text-blue-500">
                                                {product?.name}
                                            </span>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to={`/product-details/${slugify(product?.name)}`} className="w-full">
                                        <img
                                            src={product?.image?.[0]}
                                            alt={product?.name}
                                            className="w-full h-40 object-cover"
                                        />

                                        {/* {(!product?.image?.[0] || product?.image?.[0] === "null") ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                <EmojiFoodBeverageIcon className="text-gray-400 dark:text-gray-300 text-5xl" />
                                                <Link to={`/product-details/${slugify(product?.name)}`}>
                                                    <span className="text-gray-500 dark:text-gray-300 text-sm font-medium hover:text-blue-500">
                                                        {product?.name}
                                                    </span>
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link to={`/product-details/${slugify(product?.name)}`} className="w-full" >
                                                <img
                                                    src={product?.image?.[0]}
                                                    alt={product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                        )} */}
                                    </Link>
                                )}

                                <div className="p-4">
                                    <Link
                                        to={`/product-details/${slugify(product?.name)}`}
                                        className="text-lg font-semibold text-gray-800 dark:text-white truncate hover:text-blue-500 line-clamp-1"
                                    >
                                        {product?.name}
                                    </Link>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                        {product?.description || ""}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: theme === 'dark' ? '#ffffff' : '#000000',
                                        borderColor: theme === 'dark' ? '#555' : '#ccc',
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: '#843E71',
                                        color: '#ffffff',
                                        borderColor: '#843E71',
                                        '&:hover': {
                                            backgroundColor: '#843E71',
                                        },
                                    },
                                }}
                            />

                        </div>
                    )}

                </section>
            }

            {
                (selectedProduct) && <section className="px-3 md:px-6 py-6 md:py-10 md:max-w-6xl mx-auto">
                    <h1 className="border-t border-dashed border-gray-500/50 pb-2 pt-5 text-xl font-semibold">Product Reviews</h1>

                    <ReviewSection productId={selectedProduct?._id} />
                </section>
            }
        </>
    )
}
