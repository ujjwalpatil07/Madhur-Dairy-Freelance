import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import { Tooltip } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { slugify } from "../../utils/slugify";
import { UserAuthContext } from "../../context/AuthProvider";
import { CartContext } from "../../context/CartProvider";
import { productLike } from "../../services/productServices";
import { getDiscountedPrice } from "../../utils/helper";
import { formatNumberWithCommas } from "../../utils/format";
import { addToWishlist } from "../../services/userProfileService";
import { useSnackbar } from 'notistack';

export default function ProductVarietyCard({ id, image, name, discount, rating, likes, price, minQuantity, stock, quantityUnit }) {
    const { enqueueSnackbar } = useSnackbar();

    const { authUser, setAuthUser, setOpenLoginDialog } = useContext(UserAuthContext);
    const { cartItems, addToCart } = useContext(CartContext);
    const minQty = Number(minQuantity) || 1;
    const existing = cartItems?.find(item => item?.productId === id);

    const [quantity, setQuantity] = useState(0);
    const [localLikes, setLocalLikes] = useState(likes);
    const [likeLoading, setLikeLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const priceNumber = Number(price);
    const discountPercent = Number(discount) || 0;
    const { discountedPrice, saved } = getDiscountedPrice(priceNumber, discountPercent);
    const isWishlisted = authUser?.wishlistedProducts?.includes(id);

    useEffect(() => {
        setLocalLikes(likes);
    }, [likes]);

    const handleAddProduct = (productId, price) => {

        if (!authUser?._id) {
            enqueueSnackbar("Please log in to add items to cart.", { variant: "info" });
            setOpenLoginDialog(true);
            return;
        }
        
        if (quantity <= 0) {
            enqueueSnackbar("Please select quantity.", { variant: "error" });
            return;
        }
        if (quantity > stock) {
            enqueueSnackbar("Stock not available!", { variant: "error" });
            return;
        }

        addToCart(productId, quantity, price);
        setQuantity(0);
        enqueueSnackbar("Product added to cart!", { variant: "success" });
    }

    const handleLikeProduct = async (productId) => {
        if (!authUser?._id) {
            enqueueSnackbar("Please log in to like products.", { variant: "error" });
            setOpenLoginDialog(true);
            return;
        }

        if (localLikes.includes(authUser._id)) {
            enqueueSnackbar("You already liked this product.", { variant: "info" });
            return;
        }

        setLikeLoading(true);

        try {
            const { message, updatedLikes } = await productLike(productId, authUser._id);
            setLocalLikes(updatedLikes);
            enqueueSnackbar(message || "You liked the product!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to like product.", { variant: "error" });
        } finally {
            setLikeLoading(false);
        }
    };

    const handleAddProductInWishlist = async (productId) => {
        if (!authUser?._id) {
            enqueueSnackbar("Please log in to add items to your wishlist.", { variant: "info" });
            setOpenLoginDialog(true);
            return;
        }

        if (isWishlisted) {
            enqueueSnackbar("This product is already in your wishlist.", { variant: "info" });
            return;
        }

        if (wishlistLoading) {
            enqueueSnackbar("Please wait, adding to wishlist...", { variant: "info" });
            return;
        }

        try {
            setWishlistLoading(true);
            const data = await addToWishlist(authUser._id, productId);

            if (data?.success) {
                enqueueSnackbar("Product added to wishlist!", { variant: "success" });
                setAuthUser((prev) => ({
                    ...prev,
                    wishlistedProducts: Array.isArray(prev?.wishlistedProducts)
                        ? [...prev.wishlistedProducts, productId]
                        : [productId],
                }));
            } else {
                enqueueSnackbar(data?.error || "Something went wrong.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to add to wishlist.", { variant: "error" });
        } finally {
            setWishlistLoading(false);
        }
    };

    const showSnackbar = (message, variant = "info") => {
        enqueueSnackbar(message, { variant });
    };

    let wishlistIconContent;

    if (wishlistLoading) {
        wishlistIconContent = (
            <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
        );
    } else if (isWishlisted) {
        wishlistIconContent = <BookmarkIcon sx={{ fontSize: "1.2rem" }} />;
    } else {
        wishlistIconContent = <BookmarkBorderIcon sx={{ fontSize: "1.2rem" }} />;
    }

    return (
        <motion.div
            className="rounded-lg h-fit overflow-hidden relative shadow-md bg-white dark:bg-gray-500/20 transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="relative h-44 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
                {(!image || image === "null") ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <EmojiFoodBeverageIcon className="text-gray-400 dark:text-gray-300 text-5xl" />
                        <Link to={`/product-details/${slugify(name)}`}>
                            <span className="text-gray-500 dark:text-gray-300 text-sm font-medium hover:text-blue-500">
                                {name}
                            </span>
                        </Link>
                    </div>
                ) : (
                    <Link to={`/product-details/${slugify(name)}`} className="w-full" >
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                )}

                {!localLikes?.includes(authUser?._id) && (
                    <button
                        onClick={() => handleLikeProduct(id)}
                        className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-red-500 hover:bg-white/50 dark:bg-gray-500/50 transition-colors cursor-pointer"
                        disabled={likeLoading}
                    >
                        {likeLoading ? (
                            <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                        ) : (
                            <FavoriteBorderIcon sx={{ fontSize: "1.3rem" }} />
                        )}
                    </button>
                )}

            </div>

            <div className="p-4">
                <Link to={`/product-details/${slugify(name)}`} className="text-lg font-bold mb-2 dark:text-white hover:text-blue-500">{name}</Link>

                <div className="grid grid-cols-2 items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <StarIcon className="text-[#FE8C00]" sx={{ fontSize: "1.3rem" }} />
                        <span className="text-sm dark:text-gray-300">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FavoriteBorderIcon className="text-[#FE8C00]" sx={{ fontSize: "1.3rem" }} />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{localLikes?.length || 0}</span>
                    </div>
                </div>

                {discountPercent > 0 ? (
                    <div className="mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-[#b02e8d]">
                                &#8377;{formatNumberWithCommas(discountedPrice)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                                &#8377;{formatNumberWithCommas(priceNumber)}
                            </span>
                            <span className="bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                                {discountPercent}&#37; OFF
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300 italic">
                            You save &#8377;{formatNumberWithCommas(saved)} - Per {quantityUnit}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm mb-2 dark:text-gray-300">
                        Price: <span className="font-bold text--[#843E71] dark:text-white">&#8377;{formatNumberWithCommas(priceNumber)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Per {quantityUnit}</span>
                    </p>
                )}

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => handleAddProductInWishlist(id)}
                        disabled={isWishlisted || wishlistLoading}
                        className={`w-fit flex items-center gap-1 px-2 py-1.5 rounded-sm text-sm transition-all duration-300 ${isWishlisted
                            ? "bg-red-100 text-red-600 dark:bg-[#843E71]/20 dark:text-[#b02e8d]"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-500/20 dark:text-gray-100 dark:hover:bg-gray-200/20"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {wishlistIconContent}
                    </button>

                    {stock === 0 && (
                        <p className="text-red-600 font-semibold text-sm">Out of Stock</p>
                    )}

                    {existing && (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                            In Cart: {existing?.quantity} {quantityUnit}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center gap-2">
                        <Tooltip
                            title={quantity <= 0 ? "Minimum quantity reached" : "Decrease quantity"}
                            arrow
                            placement="top"
                        >
                            <span>
                                <button
                                    onClick={() => {
                                        if (quantity <= 0) {
                                            showSnackbar("Minimum quantity reached", "warning");
                                        } else {
                                            setQuantity(prev => Math.max(0, prev - (minQty || 1)));
                                        }
                                    }}
                                    className="w-6 h-6 rounded-md flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-500 disabled:opacity-50"
                                >
                                    <RemoveIcon sx={{ fontSize: "1.2rem" }} />
                                </button>
                            </span>
                        </Tooltip>
                        <input
                            type="number"
                            className="hide-input-spin text-center w-10 dark:text-white font-semibold"
                            value={quantity}
                            min={0}
                            max={Math.max(0, stock - (existing?.quantity || 0))}
                            disabled={stock <= (existing?.quantity || 0)}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                const maxQty = stock - (existing?.quantity || 0);
                                if (value > maxQty) {
                                    showSnackbar("Exceeds available stock", "error");
                                } else if (value < 0) {
                                    showSnackbar("Quantity cannot be negative", "error");
                                } else {
                                    setQuantity(value);
                                }
                            }}
                        />

                        <Tooltip
                            title={
                                quantity + (existing?.quantity || 0) >= stock
                                    ? "No more stock available"
                                    : "Increase quantity"
                            }
                            arrow
                            placement="top"
                        >
                            <span>
                                <button
                                    onClick={() => {
                                        const currentTotal = quantity + (existing?.quantity || 0);
                                        if (currentTotal >= stock) {
                                            showSnackbar("No more stock available", "warning");
                                        } else {
                                            setQuantity(prev => prev + (minQty || 1));
                                        }
                                    }}
                                    className="w-6 h-6 rounded-md flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-green-500 disabled:opacity-50"
                                >
                                    <AddIcon sx={{ fontSize: "1.2rem" }} />
                                </button>
                            </span>
                        </Tooltip>
                    </div>

                    <button
                        onClick={() => handleAddProduct(id, price)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#843E71] hover:bg-[#843E7190] text-white cursor-pointer"
                    >
                        <ShoppingCartIcon sx={{ fontSize: "1.2rem" }} />
                        <span className="line-clamp-1">Add to Cart</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

ProductVarietyCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    discount: PropTypes.number.isRequired,
    minQuantity: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    stock: PropTypes.number,
    price: PropTypes.number.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
    quantityUnit: PropTypes.string.isRequired,
};