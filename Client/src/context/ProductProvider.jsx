import { useMemo, useState, createContext, useEffect, useCallback } from "react";
import { getProducts } from "../services/productServices";
import { socket } from "../socket/socket";
import PropTypes from "prop-types"
import { enqueueSnackbar } from "notistack";
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    const [filter, setFilter] = useState("Sort By");
    const [showHeaderExtras, setShowHeaderExtras] = useState(false);
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                if (data?.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                enqueueSnackbar(error?.response?.data?.message || "Error fetching products", { variant: "error" });
            } finally {
                setProductLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const updateProducts = useCallback(({ updatedData }) => {

        const updateMap = new Map();
        updatedData?.forEach((u) => {
            updateMap?.set(u?.productId, u?.change);
        });

        setProducts((prevProducts) =>
            prevProducts?.map((product) => {
                const change = updateMap?.get(product?._id);

                if (change !== undefined) {
                    
                    const updatedStock = Math.max(product?.stock + change, 0);
                    const updatedSoldQuantity = product?.totalQuantitySold + (-1 * change)
                    
                    return {
                        ...product,
                        stock: updatedStock,
                        totalQuantitySold: updatedSoldQuantity
                    };
                }
                return product;
            })
        );
    }, []);

    const handleAddReviewSuccess = useCallback(({ review, productId }) => {

        setProducts((prevProducts) => {
            return prevProducts?.map((p) => {
                if (p?._id === productId) {
                    return {
                        ...p,
                        reviews: [...(p?.reviews || []), review],
                    }
                }
                return p;
            })
        });
    }, []);

    const removeReviewFromProduct = useCallback((product, productId, reviewId) => {
        if (product?._id !== productId) return product;

        const updatedReviews = (product?.reviews || [])?.filter(
            (review) => review?._id !== reviewId
        );

        return { ...product, reviews: updatedReviews };
    }, []);

    const handleRemoveReviewSuccess = useCallback(({ productId, reviewId }) => {
        setProducts((prevProducts) => {
            return prevProducts?.map((product) =>
                removeReviewFromProduct(product, productId, reviewId)
            );
        });
    }, [removeReviewFromProduct]);

    const handleReviewEditSuccess = useCallback(({ productId, reviewId, message, rating }) => {
        const updateReview = (review) => {
            if (review?._id === reviewId) {
                return {
                    ...review,
                    message,
                    rating,
                };
            }
            return review;
        };

        const updateProduct = (product) => {
            if (product?._id !== productId) return product;

            const updatedReviews = (product?.reviews || []).map(updateReview);

            return {
                ...product,
                reviews: updatedReviews,
            };
        };

        setProducts((prevProducts) => {
            return prevProducts?.map(updateProduct);
        });
    }, []);

    const handleReviewLikeSuccess = useCallback(({ userId, productId, reviewId }) => {
        const updateReviewLikes = (review) => {
            if (review?._id !== reviewId) return review;

            const alreadyLiked = review?.likes?.includes(userId);
            if (!alreadyLiked) {
                return {
                    ...review,
                    likes: [...review.likes, userId],
                };
            }
            return review;
        };

        const updateProductReviews = (product) => {
            if (product?._id !== productId) return product;

            const updatedReviews = (product?.reviews || []).map(updateReviewLikes);

            return {
                ...product,
                reviews: updatedReviews,
            };
        };

        setProducts((prevProducts) => {
            return prevProducts?.map(updateProductReviews);
        });
    }, []);

    const handleAddNewProduct = useCallback((data) => {
        const { newProduct } = data;
        setProducts((prev) => [...prev, newProduct]);
    }, []);

    const handleRemoveProduct = useCallback((data) => {
        const { deletedProduct } = data;

        setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== deletedProduct._id)
        );
    }, []);

    const handleUpdateProduct = useCallback((data) => {
        const { updatedProduct } = data;

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            )
        );
    }, []);

    useEffect(() => {
        socket.on("product-stock-update", updateProducts);
        socket.on("review:add-success", handleAddReviewSuccess);
        socket.on("review:remove-success", handleRemoveReviewSuccess);
        socket.on("review:edit-success", handleReviewEditSuccess);
        socket.on("review:like-success", handleReviewLikeSuccess);
        socket.on("add-new-product:success", handleAddNewProduct);
        socket.on("remove-product:success", handleRemoveProduct);
        socket.on("update-product:success", handleUpdateProduct);


        return () => {
            socket.off("product-stock-update", updateProducts);
            socket.off("review:add-success", handleAddReviewSuccess);
            socket.off("review:remove-success", handleRemoveReviewSuccess);
            socket.off("review:edit-success", handleReviewEditSuccess);
            socket.off("review:like-success", handleReviewLikeSuccess);
            socket.off("add-new-product:success", handleAddNewProduct);
            socket.off("remove-product:success", handleRemoveProduct);
            socket.off("update-product:success", handleUpdateProduct);

        }
    }, [updateProducts,
        handleAddReviewSuccess,
        handleRemoveReviewSuccess,
        handleReviewEditSuccess,
        handleReviewLikeSuccess,
        handleAddNewProduct,
        handleRemoveProduct,
        handleUpdateProduct
    ]);

    const contextValue = useMemo(() => ({
        filter,
        showHeaderExtras,
        products,
        productLoading,
        setFilter,
        setShowHeaderExtras,
        setProducts,
        setProductLoading
    }), [filter, showHeaderExtras, products, productLoading]);

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    )
}

ProductProvider.propTypes = {
    children: PropTypes.node.isRequired
};  