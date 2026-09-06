import React, { useContext, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { UserAuthContext } from "../context/AuthProvider"
import { CartContext } from "../context/CartProvider";
import { getCartProductDetails, calculateCartTotals } from "../utils/cartUtils";
import { getDiscountedPrice } from "../utils/helper";
import { formatNumberWithCommas } from "../utils/format";
import ProductCard from "../components/CartComponents/ProductCard";
import SavedAddressList from "../components/CartComponents/SavedAddressList";
import { ProductContext } from "../context/ProductProvider";
import { useSnackbar } from "notistack";

export default function CartPage() {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { authUser, deliveryAddress, setOpenLoginDialog } = useContext(UserAuthContext);
    const { cartItems, removeFromCart } = useContext(CartContext);
    const { products, productLoading } = useContext(ProductContext);

    const [open, setOpen] = useState(false);
    const [highlightedItems, setHighlightedItems] = useState([]);

    const cartDetails = useMemo(
        () => getCartProductDetails(cartItems, products, removeFromCart),
        [cartItems, products, removeFromCart]
    );

    const { subtotal, totalAmount, totalSaving } = useMemo(() => {
        return calculateCartTotals(cartDetails);
    }, [cartDetails]);


    const handleDialogStatus = (status) => {
        setOpen(status);
    }

    const handleProceedCheckout = () => {

        if (!deliveryAddress) {
            enqueueSnackbar("Please select a delivery address before proceeding to checkout.", { variant: "error" })
            return;
        }

        const outOfStockItems = cartDetails?.filter(item => item?.selectedQuantity > item?.stock);

        if (outOfStockItems?.length > 0) {
            const outOfStockIds = outOfStockItems?.map(item => item?.id);
            setHighlightedItems(outOfStockIds);

            setTimeout(() => {
                setHighlightedItems([]);
            }, 3000);

            return;
        }

        navigate("/order-checkout");
    };

    if (productLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-gray-600 dark:text-white gap-3">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
                <span className="text-xl">Loading product...</span>
            </div>
        );
    }

    if (!authUser) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">You're not logged in.</h2>
                <p className="text-gray-500 mb-4 dark:text-gray-300">Please log in to view your cart.</p>
                <button onClick={() => setOpenLoginDialog(true)} className="text-blue-500 hover:text-blue-600" >
                    Go to Login
                </button>
            </div>
        );
    }

    if (cartItems?.length === 0) {
        return (
            <div className="px-3 py-10 text-center">
                <ShoppingCartIcon className="mx-auto text-4xl text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Could not find matching products in your cart.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-blue-500 hover:text-blue-600 rounded hover:bg-primary-600 transition"
                >
                    <ArrowBackIcon className="mr-2" sx={{ fontSize: "1.3rem" }} />
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            <section
                className="max-w-4xl mx-auto my-5 px-3"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 md:p-5 rounded-lg bg-white dark:bg-gray-500/20">
                    {deliveryAddress ? (
                        <>
                            <h1>
                                Deliver To:
                                <span className="ps-1 text-lg font-bold break-all text-[#b1338f] dark:text-[#cc5eaf]">
                                    {deliveryAddress?.name}
                                </span>
                                <span className="text-sm ms-3 px-3 rounded-full bg-gray-500/10 dark:bg-gray-200/50">
                                    {deliveryAddress?.addressType}
                                </span>
                            </h1>
                            <p>
                                Mobile No:{" "}
                                <span className="text-gray-500 dark:text-gray-300">
                                    {deliveryAddress?.phone}
                                </span>
                            </p>
                            <p className="mb-2">
                                Address:{" "}
                                <span className="text-gray-500 dark:text-gray-300">
                                    {deliveryAddress?.streetAddress}, {deliveryAddress?.city},{" "}
                                    {deliveryAddress?.state}, {deliveryAddress?.pincode}.
                                </span>
                            </p>
                            <div className="space-x-5 flex justify-end">
                                <button
                                    onClick={() => setOpen(true)}
                                    className="text-blue-500 hover:text-blue-600 border px-2 rounded-sm"
                                >
                                    Change
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                                No delivery address found.
                            </h2>
                            <button
                                onClick={() => setOpen(true)}
                                className="bg-[#843E71] text-white px-6 py-2 rounded hover:bg-[#843e71d4]"
                            >
                                Add Address
                            </button>
                        </div>
                    )}
                </motion.div>
            </section>

            <section
                className="max-w-4xl mx-auto my-5 px-3 flex flex-wrap gap-5"
            >
                <motion.div layout className="space-y-3 w-full md:flex-1">
                    {cartDetails.map((item, idx) => (
                        <ProductCard
                            key={idx * 0.55}
                            item={item}
                            highlightOutOfStock={highlightedItems?.includes(item?.id)}
                        />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-70 bg-white dark:bg-gray-500/20 rounded-lg h-fit p-3"
                >
                    <h1 className="p-2 text-2xl font-bold text-center mb-2">Price Details</h1>

                    {cartDetails.map((item, idx) => {
                        const { discountedPrice, saved } = getDiscountedPrice(item.price, item.discount);
                        const itemTotal = discountedPrice * item.selectedQuantity;
                        const itemSaved = saved * item.selectedQuantity;

                        return (
                            <div
                                key={idx * 0.89}
                                className="pb-2 border-b border-dashed border-gray-300 dark:border-gray-600 mb-2 space-y-1"
                            >
                                <p className="font-semibold text-base text-gray-800 dark:text-white">
                                    {item.name}
                                </p>

                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {item.selectedQuantity} {item.quantityUnit} ×{" "}
                                    <span className="line-through text-gray-400 dark:text-gray-500 me-1">
                                        ₹{formatNumberWithCommas(item.price)}
                                    </span>
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                        ₹{formatNumberWithCommas(discountedPrice)}
                                    </span>
                                </p>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                                        Total: ₹{formatNumberWithCommas(itemTotal)}
                                    </span>

                                    {saved > 0 && (
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            Saved ₹{formatNumberWithCommas(itemSaved)}
                                        </span>
                                    )}
                                </div>
                            </div>

                        );
                    })}

                    <div className="space-y-1 font-medium border-b border-dashed border-gray-500/30 dark:border-gray-400/30 py-2">
                        <p className="text-gray-800 dark:text-gray-100">
                            Total MRP :
                            <span className="ml-1 text-gray-600 dark:text-gray-100 font-bold"> &#8377; {formatNumberWithCommas(subtotal)}</span>
                        </p>



                        <p className="text-lg font-bold text-[#843E71] dark:text-[#cc5eaf]">
                            Final Total:
                            <span className="ml-1">&#8377;{formatNumberWithCommas(totalAmount)}</span>
                        </p>
                    </div>

                    <div className="pt-3 ">
                        <button
                            onClick={handleProceedCheckout}
                            className="block w-full text-center bg-[#843E71] text-white py-2 rounded-md hover:bg-[#843e71d4] transition"
                        >
                            Proceed to Checkout
                        </button>

                        <p className="text-green-600/80 mt-2 ms-2">
                            You will save
                            <span className="ml-1 font-bold ">&#8377;{formatNumberWithCommas(totalSaving)} </span>on this order.
                        </p>
                    </div>

                </motion.div>
            </section >

            <section
                className="max-w-4xl mx-auto my-10 px-3 flex justify-center"
            >
                <Link
                    to="/products"
                    className="w-fit text-center bg-[#843E71] text-white py-2 px-3 rounded-md hover:bg-[#843e71d4] transition"
                >
                    Add More Products
                </Link>
            </section>

            <SavedAddressList open={open} handleDialogStatus={handleDialogStatus} />
        </>
    )
}