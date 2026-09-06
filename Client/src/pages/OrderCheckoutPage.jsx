import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";
import Slide from '@mui/material/Slide';

import { CartContext } from "../context/CartProvider";
import { UserAuthContext } from "../context/AuthProvider";
import { calculateCartTotals, getCartProductDetails } from "../utils/cartUtils";
import { getDiscountedPrice } from "../utils/helper";
import { formatNumberWithCommas } from "../utils/format";
import { razorpayOrderPayment } from "../services/paymentService";
import { ThemeContext } from "../context/ThemeProvider";
import { ProductContext } from "../context/ProductProvider";
import { socket } from "../socket/socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderCheckoutPage() {

  const { enqueueSnackbar } = useSnackbar();
  const { theme } = useContext(ThemeContext);

  const { authUser, deliveryAddress } = useContext(UserAuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { products, productLoading } = useContext(ProductContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [highlightedItems, setHighlightedItems] = useState([]);

  const orderPlaceConfirmation = useCallback((data) => {
    enqueueSnackbar(data.message || 'Order placed successfully!', { variant: 'success' });
    clearCart();
    setOpen(false);
    setOrderLoading(false);
    navigate(`/user-profile/orders`);
  }, [clearCart, navigate, enqueueSnackbar]);

  const orderPlaceFailed = useCallback((error) => {
    setOrderLoading(false);
    enqueueSnackbar(error?.message || "Something went wrong while placing the order.", { variant: 'error' });
  }, [enqueueSnackbar]);

  useEffect(() => {
    socket.on("new-order-place-success", orderPlaceConfirmation);
    socket.on("new-order-place-failed", orderPlaceFailed);

    return () => {
      socket.off("new-order-place-success", orderPlaceConfirmation);
      socket.off("new-order-place-failed", orderPlaceFailed);
    }
  }, [orderPlaceConfirmation, orderPlaceFailed]);

  const cartDetails = useMemo(
    () => getCartProductDetails(cartItems, products),
    [cartItems, products]
  );

  const { subtotal, totalAmount, totalSaving } = useMemo(() => {
    return calculateCartTotals(cartDetails);
  }, [cartDetails]);

  const handleStockExceeds = () => {
    const outOfStockIds = cartDetails
      .filter(item => item?.selectedQuantity > item?.stock)
      .map(item => item?.id);

    if (outOfStockIds?.length > 0) {
      setHighlightedItems(outOfStockIds);

      setTimeout(() => {
        setHighlightedItems([]);
      }, 4000);

      return true;
    }
    return false;
  }

  const handlePaymentMode = () => {
    if (!deliveryAddress) {
      enqueueSnackbar("Please select a delivery address before proceeding to checkout.", { variant: "error" });
      return;
    }

    if (handleStockExceeds()) {
      enqueueSnackbar("Some products exceed available stock. Please adjust quantities.", {
        variant: "warning",
      });
      return;
    }

    setOpen(true);
  };

  const handlePlaceOrder = async (selectedMode) => {

    if (handleStockExceeds()) {
      enqueueSnackbar("Some products exceed available stock. Please adjust quantities.", {
        variant: "warning",
      });
      return;
    }

    setSelectedPaymentMode(selectedMode);

    const orderData = {
      address: deliveryAddress?._id,
      productsData: cartDetails.map((item) => {
        const discount = item.discount || 0;
        const discountedPrice = item.price - (item.price * discount) / 100;

        return {
          productId: item.id,
          productQuantity: item.selectedQuantity,
          productPrice: parseFloat(discountedPrice.toFixed(2)),
          productName: item.name,
        };
      }),
      paymentMode: selectedMode,
      totalAmount: totalAmount,
      userId: authUser?._id,
      date: new Date().toISOString()
    };

    setOrderLoading(true);

    try {
      if (selectedMode === "Cash on Delivery") {
        socket.emit("place-new-order", { orderData });
      } else if (selectedMode === "Online") {

        const data = await razorpayOrderPayment(totalAmount);

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Madhur Dairy & Daily Needs",
          description: "Payment for your order",
          order_id: data.orderId,
          handler: async (response) => {
            const paymentInfo = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            socket.emit("place-new-order", { orderData, paymentInfo });
          },
          prefill: {
            name: authUser?.firstName && authUser?.lastName
              ? `${authUser.firstName} ${authUser.lastName}`
              : authUser?.username || authUser?.shopName,
            email: authUser?.email,
            contact: authUser?.mobileNo,
          },
          theme: {
            color: theme === "dark" ? "#1f2937" : "#9ca3af",
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "An error occurred while placing the order.", { variant: "error" });
    } finally {
      if (selectedMode === "Online") {
        setOrderLoading(false);
      }
    }
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
        <Link to={"/login"} className="text-blue-500 hover:text-blue-600" >
          Go to Login
        </Link>
      </div>
    );
  }

  if (cartItems?.length === 0) {
    return (
      <div className="p-5 text-center flex flex-col items-center justify-center h-[300px]">
        <h2 className="text-xl font-semibold">No items to checkout</h2>
        <Link to="/products" className="mt-4 inline-block bg-[#843E71] text-white py-2 px-4 rounded hover:bg-[#843e71dd]">
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <section
        className="max-w-4xl mx-auto my-10 px-4"
      >
        <h1
          className="text-2xl font-bold mb-4 text-[#843E71] dark:text-white"
        >
          Confirm Delivery Details
        </h1>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white dark:bg-gray-500/20 rounded-lg p-4 mb-6"
        >


          {deliveryAddress ? (
            <>
              <h2 className="text-lg font-semibold mb-2">Deliver To:</h2>
              <p>
                <span className="font-medium">Name:</span>{" "}
                <span className="text-gray-500 dark:text-gray-300">
                  {deliveryAddress?.name}
                </span>
              </p>
              <p>
                Mobile No:{" "}
                <span className="text-gray-500 dark:text-gray-300">
                  {deliveryAddress?.phone || "N/A"}
                </span>
              </p>
              <p>
                Address Type:{" "}
                <span className="text-gray-500 dark:text-gray-300">
                  {deliveryAddress?.addressType || "N/A"}
                </span>
              </p>
              <p className="mb-2">
                Address:{" "}
                <span className="text-gray-500 dark:text-gray-300">
                  {deliveryAddress?.streetAddress}, {deliveryAddress?.city},{" "}
                  {deliveryAddress?.state}, {deliveryAddress?.pincode}
                </span>
              </p>
            </>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p className="mb-2 pb-2">No delivery address found.</p>
              <Link
                to={"/cart"}
                className="mt-2 bg-[#843E71] text-white px-6 py-2 rounded hover:bg-[#843e71d4]"
              >
                Add Address
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-white dark:bg-gray-500/20 rounded-lg"
        >
          <h2 className="text-lg font-semibolds p-3 sm:p-4">Order Summary</h2>

          {cartDetails.map((item, idx) => {
            const { discountedPrice, saved } = getDiscountedPrice(item.price, item.discount);
            const shouldAnimate = highlightedItems?.includes(item?.id);

            return (
              <div
                key={item.id || idx}
                className={`flex justify-between p-3 sm:p-4 border-b border-dashed border-gray-500/50 rounded transition ${shouldAnimate ? "animate-pulse ring-1 ring-red-500 bg-red-500/10" : ""
                  }`}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.selectedQuantity} {item.quantityUnit} &times;{" "}
                    <span className="line-through text-gray-400 mr-1">
                      &#8377; {formatNumberWithCommas(item?.price)}
                    </span>
                    <span className="text-green-700 font-semibold">
                      &#8377; {formatNumberWithCommas(discountedPrice)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">
                    &#8377; {formatNumberWithCommas(discountedPrice * item.selectedQuantity)}
                  </p>
                  {saved > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Saved &#8377; {formatNumberWithCommas(saved * item.selectedQuantity)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <div className="p-3 sm:p-4 text-sm text-gray-800 dark:text-gray-100 space-y-2 font-medium">
            <p>Total MRP: <span className="float-right text-gray-600 dark:text-gray-200 font-bold">&#8377;{formatNumberWithCommas(subtotal)}</span></p>
            <p className="text-green-500 dark:text-green-600">You Saved: <span className="float-right text-green-500 dark:text-green-600">&#8377;{formatNumberWithCommas(totalSaving)}</span></p>
            <p className="text-lg font-bold text-gray-600 dark:text-[#cc5eaf]">Final Payable: <span className="float-right text-gray-600 dark:text-[#cc5eaf]">&#8377;{formatNumberWithCommas(totalAmount)}</span></p>
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex justify-between"
        >
          <Link
            to="/cart"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Cart
          </Link>
          <button
            disabled={orderLoading}
            onClick={handlePaymentMode}
            className="bg-[#843E71] text-white px-6 py-2 rounded hover:bg-[#843e71d4] disabled:cursor-not-allowed"
          >
            Place Order
          </button>
        </motion.div>
      </section>

      <Dialog
        open={open}
        onClose={() => {
          if (!orderLoading) {
            setOpen(false)
          }
        }}
        slots={{
          transition: Transition,
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              boxShadow: 24,
              borderRadius: 1,
            },
          },
        }}
        maxWidth="sm"
        fullWidth
      >
        <div className="bg-white dark:bg-gray-500/20 text-gray-900 dark:text-white backdrop-blur-sm">

          <header className="sticky top-0 left-0 flex justify-between items-center px-4 py-3 border-b border-gray-300 dark:border-gray-600 backdrop-blur-md bg-white/70 dark:bg-gray-500/20 z-10">
            <span className="text-xl font-semibold">Choose Payment Mode</span>
            <button onClick={() => setOpen(false)} className="text-gray-600 dark:text-gray-300 dark:hover:text-white">
              <CloseIcon fontSize="small" />
            </button>
          </header>

          <DialogContent className="space-y-2 px-4 pt-4 pb-2">
            <p><strong>Total Items:</strong> {cartDetails.length}</p>
            <p><strong>Total MRP:</strong> &#8377; {formatNumberWithCommas(subtotal)}</p>
            <p className="text-green-500 dark:text-green-600">
              <strong>You Saved:</strong> &#8377; {formatNumberWithCommas(totalSaving)}
            </p>
            <p className="text-blue-600 dark:text-blue-500 font-bold">
              <strong>Payable Amount:</strong> &#8377; {formatNumberWithCommas(totalAmount)}
            </p>
          </DialogContent>

          <div className="px-3 pb-4 pt-2 flex justify-end space-x-3">
            <button
              disabled={orderLoading}
              onClick={() => handlePlaceOrder("Cash on Delivery")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-2 rounded shadow disabled:cursor-not-allowed"
            >
              {(orderLoading && selectedPaymentMode === "Cash on Delivery") ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LocalShippingIcon fontSize="small" className="!hidden sm:!flex" />
                  Cash on Delivery
                </span>
              )}
            </button>

            <button
              disabled={orderLoading}
              onClick={() => handlePlaceOrder("Online")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:cursor-not-allowed"
            >
              {(orderLoading && selectedPaymentMode === "Online") ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PaidIcon fontSize="small" className="!hidden sm:!flex" />
                  Online Payment
                </span>
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
