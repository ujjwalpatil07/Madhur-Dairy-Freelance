import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { FaHourglassHalf, FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaGlassWhiskey, FaShoppingCart } from "react-icons/fa";
import CloseIcon from '@mui/icons-material/Close';
import { UserOrderContext } from "../../context/UserOrderProvider";
import { enqueueSnackbar } from "notistack";

import Slide from '@mui/material/Slide';
import { UserAuthContext } from "../../context/AuthProvider";
import { socket } from "../../socket/socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyOrders() {

  const { userOrders, orderLoading } = useContext(UserOrderContext);
  const { authUser } = useContext(UserAuthContext);

  const orderStats = {
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
    Confirmed: 0,
  };

  userOrders?.forEach(order => {
    if (orderStats[order?.status] !== undefined) {
      orderStats[order?.status]++;
    }
  });

  const statCards = [
    { title: "All", count: userOrders?.length, color: "bg-gray-600/30 text-gray-300", icon: <FaGlassWhiskey /> },
    { title: "Confirmed", count: orderStats.Confirmed, color: "bg-blue-600/30 text-blue-600", icon: <FaCheckCircle /> },
    { title: "Pending", count: orderStats.Pending, color: "bg-yellow-500/30 text-yellow-500", icon: <FaHourglassHalf /> },
    { title: "Processing", count: orderStats.Processing, color: "bg-blue-400/30 text-blue-400", icon: <FaBoxOpen /> },
    { title: "Shipped", count: orderStats.Shipped, color: "bg-purple-500/30 text-purple-500", icon: <FaShippingFast /> },
    { title: "Delivered", count: orderStats.Delivered, color: "bg-green-600/30 text-green-600", icon: <FaCheckCircle /> },
    { title: "Cancelled", count: orderStats.Cancelled, color: "bg-red-500/30 text-red-500", icon: <FaTimesCircle /> },
  ];

  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(statCards[0]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusTypeUpdate = ({ success, message }) => {
    if (success) {
      enqueueSnackbar(message, { variant: "success" });
      setSelectedOrder(null);
    } else {
      enqueueSnackbar(message, { variant: "error" });
    }
    setLoading(false);
  }

  useEffect(() => {
    socket.on("order:update-delivered-status", handleStatusTypeUpdate);

    return () => {
      socket.off("order:update-delivered-status", handleStatusTypeUpdate);
    }
  }, []);

  const handleOrderReceived = () => {

    if (!selectedOrder) {
      enqueueSnackbar("No order selected!", { variant: "error" });
      return;
    }

    if (!authUser) {
      enqueueSnackbar("User not authenticated!", { variant: "error" });
      return;
    }

    setLoading(true);
    socket.emit("order:delivered", {
      orderId: selectedOrder?._id,
      status: "Delivered",
      userId: authUser?._id,
    });
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "Processing":
        return <FaBoxOpen className="text-blue-500" />;
      case "Shipped":
        return <FaShippingFast className="text-purple-500" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-600" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "Confirmed":
        return <FaCheckCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredOrders = (selectedStatus?.title === "All")
    ? userOrders
    : userOrders.filter((order) => order?.status === selectedStatus?.title);

  let content;
  if (orderLoading) {
    content = (
      <div className="flex items-center justify-center py-20 text-gray-500 space-x-2">
        <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
        <p className="text-sm">Loading...</p>
      </div>
    );
  } else if (!filteredOrders || filteredOrders?.length === 0) {
    content = (
      <div className="text-center text-gray-600 dark:text-gray-300 py-16 w-full">
        {selectedStatus.title === "All"
          ? "You haven't placed any orders yet."
          : `No ${selectedStatus?.title.toLowerCase()} orders found.`}
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        {filteredOrders?.map((order) => (
          <div
            key={order?._id}
            className="bg-gray-100 dark:bg-gray-500/10 md:rounded-lg p-3 md:p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(order?.status)}
                <span className="font-semibold text-lg">{order?.status}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {new Date(order?.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide mb-3">
              <table className="w-full overflow-x-auto text-sm text-left">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th className="p-2 md:px-4 md:py-2 border-e border-gray-500 font-semibold hidden sm:flex">Image</th>
                    <th className="p-2 md:px-4 md:py-2 border-e border-gray-500 font-semibold">Product</th>
                    <th className="p-2 md:px-4 md:py-2 border-e border-gray-500 font-semibold">Quantity</th>
                    <th className="p-2 md:px-4 md:py-2 border-e border-gray-500 font-semibold">Price</th>
                    <th className="p-2 md:px-4 md:py-2 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.productsData?.map((product, idx) => (
                    <tr
                      key={idx * 0.5}
                      className="border-b border-gray-200 dark:border-gray-600"
                    >
                      <td className="p-2 hidden sm:flex w-12 h-12">
                        {product?.productId?.image?.[0] ? (
                          <img
                            src={product?.productId?.image[0]}
                            alt={product?.productId?.name || "Product"}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="bg-black/20 w-full h-full rounded flex justify-center items-center"><FaGlassWhiskey className="text-sm text-gray-500" /></div>
                        )}
                      </td>
                      <td className="p-2 md:px-4 md:py-2 break-words">{product?.productId?.name}</td>
                      <td className="p-2 md:px-4 md:py-2 break-words">{product?.productQuantity}</td>
                      <td className="p-2 md:px-4 md:py-2 break-words">&#8377;{(product?.productPrice || 0).toFixed(2)} / {product?.productId?.quantityUnit}</td>
                      <td className="p-2 md:px-4 md:py-2 font-semibold text-gray-700 dark:text-white break-words">
                        &#8377;{(product?.productQuantity * product?.productPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-sm">
              <h4 className="font-semibold mb-1 text-gray-700 dark:text-white">Delivery Address:</h4>
              <p>{order?.address?.name}, {order.address?.phone}</p>
              <p className="text-gray-600 dark:text-gray-300">
                {order?.address?.streetAddress}, {order?.address?.city}, {order?.address?.state} - {order?.address?.pincode}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded">
                {order?.address?.addressType}
              </span>
            </div>

            <div className="flex flex-row flex-wrap justify-between items-center gap-3 mt-4 border-t pt-3">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                <span className="hidden sm:flex">Payment: </span>
                {order?.paymentMode}
              </p>

              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                &#8377;{order?.totalAmount}
              </p>

              {order?.status === "Confirmed" && (
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-1.5 w-full sm:w-fit text-sm font-semibold rounded bg-green-600 hover:bg-green-700 text-white"
                >
                  Order Received
                </button>
              )}

              {order?.status === "Delivered" && (
                <a
                  href={`https://madhur-dairy-daily-need-server-1eu6.onrender.com/pdf/generate-bill/${order?._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-fit px-4 py-1.5 text-sm font-semibold rounded bg-[#843E71] hover:bg-[#843E7190] text-white inline-block text-center"
                  download
                >
                  Download Bill
                </a>
              )}

            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center sticky top-0 mb-4 gap-5 z-90">
        <h2 className="w-fit !h-fit flex justify-between items-centertext-xl font-bold backdrop-blur-md px-2 py-1 rounded whitespace-nowrap">My Orders</h2>

        <div className="flex overflow-auto flex-col sm:flex-row sm:items-center sm:justify-between gap-3 scrollbar-hide">

          <div className="flex overflow-auto flex-row sm:items-center sm:justify-between gap-3 scrollbar-hide">
            {statCards?.map((card, idx) => {
              const isSelected = selectedStatus?.title === card?.title;
              return (
                <button
                  key={card?.title || idx}
                  onClick={() => setSelectedStatus(card)}
                  className={`
          flex items-center gap-2 rounded-full px-3 py-1.5 min-w-fit
          transition-all duration-200 border backdrop-blur-md  
          ${card?.color}
          ${isSelected ? "opacity-100 shadow-md" : "opacity-70 hover:opacity-90"}
        `}
                >
                  {card.icon}
                  <span className="font-medium">{card.title}</span>
                  <span className="text-sm font-semibold">{card.count}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {content}

      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        slots={{
          transition: Transition,
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              borderRadius: 1,
            },
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        <div className="bg-white/40 dark:bg-black/50 text-black dark:text-white backdrop-blur-sm rounded-md">
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-sm px-2 py-2 flex justify-between items-center">
            <h1 className="flex items-center gap-2 font-bold text-lg">
              <FaShoppingCart className="text-[#843E71]" size={20} />
              Order Details
            </h1>
            <button className="hover:text-gray-200" onClick={() => setSelectedOrder(null)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>

          <div className="overflow-x-auto px-3">
            <table className="w-full text-sm border-separate border-spacing-y-1">
              <thead className="text-left text-gray-700 dark:text-gray-300 font-semibold">
                <tr>
                  <th className="p-2">Product</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.productsData.map((item, idx) => (
                  <tr
                    key={idx * 0.5}
                    className="bg-gray-100/50 dark:bg-gray-800 rounded text-gray-900 dark:text-gray-100"
                  >
                    <td className="p-2 line-clamp-1">{item?.productId?.name}</td>
                    <td className="p-2 text-right">{item?.productQuantity}</td>
                    <td className="p-2 text-right">&#8377;{item?.productPrice}</td>
                    <td className="p-2 text-right font-medium">
                      &#8377;{(item?.productPrice * item?.productQuantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-2 px-3 font-semibold text-base text-gray-800 dark:text-green-400">
            Total: &#8377;{selectedOrder?.totalAmount}
          </div>

          <div className="mt-2 text-xs text-gray-800 dark:text-gray-400 text-right px-3">
            Ordered on:{" "}
            {new Date(selectedOrder?.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>

          <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 px-3 flex items-center gap-1">
            <span>Please ensure all items have been received in correct quantity and condition before confirming.</span>
          </div>


          {/* Actions */}
          <div className="flex justify-end items-center gap-3 mt-2 pt-0 p-3">
            <button
              disabled={loading}
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-1 px-4 py-1.5 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm text-black dark:text-white disabled:cursor-not-allowed"
            >
              <FaTimesCircle size={16} />
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleOrderReceived}
              className="flex items-center gap-1 px-4 py-1.5 rounded bg-[#843E71] hover:bg-green-700 text-sm text-white disabled:cursor-not-allowed"
            >
              {
                loading ? <p>Updating...</p>
                  : <>
                    <FaCheckCircle size={16} />
                    Received
                  </>
              }
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}


