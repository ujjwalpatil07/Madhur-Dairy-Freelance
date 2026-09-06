import React, { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDebounce } from "use-debounce";
import { useSnackbar } from "notistack";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { AdminAuthContext } from "../../../context/AuthProvider";
import { SidebarContext } from "../../../context/SidebarProvider";
import { filterOrdersBySearch } from "../../../utils/filterOrders";
import { socket } from "../../../socket/socket";
import { Avatar, Menu } from "@mui/material";
import { FilterIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderDetails({ allOrders, loading, statusFilter, handleStatusFilter }) {
  const { enqueueSnackbar } = useSnackbar();
  const { navbarInput, highlightMatch } = useContext(SidebarContext);
  const { authAdmin } = useContext(AdminAuthContext);

  const [debouncedSearchText] = useDebounce(navbarInput, 300);
  const [localOrders, setLocalOrders] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [sortOption, setSortOption] = useState("latest");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Apply sorting when data or sort option changes
  useEffect(() => {
    if (!allOrders?.length) return;

    const sorted = [...allOrders];
    if (sortOption === "latest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "amountHigh") {
      sorted.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortOption === "amountLow") {
      sorted.sort((a, b) => a.totalAmount - b.totalAmount);
    }
    setLocalOrders(sorted);
  }, [allOrders, sortOption]);

  const handleOrderUpdateFailed = useCallback(({ message, status }) => {
    const action = status === "Cancelled" ? "cancel" : "accept";
    enqueueSnackbar(message || `Failed to ${action} order.`, { variant: "error" });
    setProcessingId(null);
  }, [enqueueSnackbar]);

  const handleOrderUpdateSuccess = useCallback(({ message, status }) => {
    const action = status === "Cancelled" ? "cancelled" : "accepted";
    enqueueSnackbar(message || `Order ${action} successfully.`, { variant: "success" });
    setProcessingId(null);
  }, [enqueueSnackbar]);

  useEffect(() => {
    socket.on("order:update-status-failed", handleOrderUpdateFailed);
    socket.on("order:update-status-success", handleOrderUpdateSuccess);

    return () => {
      socket.off("order:update-status-failed", handleOrderUpdateFailed);
      socket.off("order:update-status-success", handleOrderUpdateSuccess);
    };
  }, [handleOrderUpdateFailed, handleOrderUpdateSuccess]);

  const handleAcceptOrders = (orderId, userId) => {
    if (!authAdmin?._id) {
      enqueueSnackbar("Unauthorized: Please login as admin.", { variant: "error" });
      return;
    }

    if (!orderId || !userId) {
      enqueueSnackbar("Invalid order/user ID.", { variant: "error" });
      return;
    }

    setProcessingId({ orderId, status: "Accept" });

    socket.emit("order:accept", {
      orderId,
      status: "Confirmed",
      userId,
      date: new Date().toISOString(),
    });
  };

  const handleRejectOrders = (orderId, userId) => {
    if (!authAdmin?._id) {
      enqueueSnackbar("Unauthorized: Please login as admin.", { variant: "error" });
      return;
    }

    if (!orderId || !userId) {
      enqueueSnackbar("Invalid order/user ID.", { variant: "error" });
      return;
    }

    setProcessingId({ orderId, status: "Reject" });

    socket.emit("order:reject", {
      orderId,
      userId,
      status: "Cancelled",
      date: new Date().toISOString(),
    });
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const filterOptions = [
    { value: "latest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "amountHigh", label: "High to Low Amount" },
    { value: "amountLow", label: "Low to High Amount" },
  ];

  const filteredOrders = filterOrdersBySearch(localOrders, debouncedSearchText);
  const statusFilteredOrders = statusFilter === "All"
    ? filteredOrders
    : filteredOrders.filter((order) => order.status === statusFilter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300";
      case "Confirmed": return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300";
      default: return "bg-gray-200 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300";
    }
  };

  let content;
  if (loading) {
    content = (
      <div className="flex items-center justify-center h-[50vh] text-gray-600 dark:text-white gap-3">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]" />
        <span className="text-xl">Loading orders...</span>
      </div>
    );
  } else if (!statusFilteredOrders?.length) {
    content = (
      <div className="text-center text-gray-500 dark:text-gray-300 py-4">
        No orders found for selected filter or search.
      </div>
    );
  } else {
    content = statusFilteredOrders.map((order) => {
      const { address, productsData, totalAmount, status, createdAt, _id, paymentMode } = order;
      const owner = address?.owner;

      const isProcessing = processingId?.orderId === _id;

      return (
        <div key={_id} className="relative bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-white rounded-lg p-3 md:p-6 shadow-lg space-y-3 w-full mx-auto">
          <div className="absolute top-3 right-3 text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusBadgeClass(status)}`}>
              {status}
            </span>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Avatar src={owner?.photo} alt={owner?.firstName} className="!w-10 !h-10" />
            <div>
              <Link to={`/admin/customers/${owner?._id}/orders-history`} className="font-semibold">
                {highlightMatch(owner?.firstName, navbarInput)} {highlightMatch(owner?.lastName, navbarInput)}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-300">{owner?.mobileNo}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Delivery Details</h3>
            <p><strong>Name:</strong> {address?.name}</p>
            <p><strong>Phone:</strong> {address?.phone}</p>
            <p><strong>Address:</strong> {highlightMatch(address?.streetAddress, navbarInput)}</p>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <h3 className="font-semibold mb-2">Order Products</h3>
            <table className="min-w-[600px] w-full text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                  <th className="p-2 text-left">Product ID</th>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product, idx) => (
                  <tr key={product?.productId?._id || idx} className="border-b border-gray-300 dark:border-gray-700">
                    <td className="p-2">{product?.productId?._id}</td>
                    <td className="p-2">{product?.productId?.name}</td>
                    <td className="p-2">{product?.productQuantity}</td>
                    <td className="p-2">&#8377;{(product?.productPrice || 0).toFixed(2)}</td>
                    <td className="p-2">&#8377;{(product?.productQuantity * product?.productPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-between gap-4 pt-4">
            <div className="w-full flex justify-between items-center sm:flex-1 space-x-2">
              <span className="text-lg font-semibold">Total Amount: &#8377;{totalAmount}</span>
              <span className="text-green-500 line-clamp-1">{paymentMode}</span>
            </div>

            {status === "Pending" && (
              <div className="space-x-3 grid grid-cols-2 sm:flex w-full sm:w-fit">
                <button
                  onClick={() => handleAcceptOrders(_id, owner?._id)}
                  disabled={isProcessing}
                  className={`px-3 py-1 rounded transition text-white ${isProcessing && processingId.status === "Accept" ? "bg-green-600/50" : "bg-green-600"} dark:bg-green-700`}
                >
                  {isProcessing && processingId.status === "Accept" ? "Accepting..." : "Accept"}
                </button>

                <button
                  onClick={() => handleRejectOrders(_id, owner?._id)}
                  disabled={isProcessing}
                  className={`px-3 py-1 rounded transition text-white ${isProcessing && processingId.status === "Reject" ? "bg-red-600/50" : "bg-red-600"} dark:bg-red-700`}
                >
                  {isProcessing && processingId.status === "Reject" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  return (
    <div className="bg-white dark:bg-gray-500/20 rounded-lg p-4 shadow-md w-full overflow-x-auto flex flex-col gap-y-4">
      <div className="flex flex-nowrap justify-between items-start md:items-center gap-4 border-b border-gray-300 dark:border-gray-700 pb-4">
        <h2 className="sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 whitespace-nowrap">
          <ReceiptLongOutlinedIcon className="text-[#843E71] !hidden sm:flex" />
          Orders Section
        </h2>

        <div>
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition dark:bg-gray-500/10 dark:text-white dark:hover:bg-gray-500"
            aria-haspopup="listbox"
          >
            <FilterIcon size={18} className="!hidden sm:flex" />
            <span className="text-sm line-clamp-1">
              {filterOptions.find((f) => f.value === sortOption)?.label || "Select Filter"}
            </span>
          </button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <div className="flex flex-col space-y-1 p-2 bg-white dark:bg-gray-500/20 dark:text-white backdrop-blur-md rounded-md shadow-md text-sm">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSortOption(filter.value);
                    handleClose();
                  }}
                  className={`text-start px-3 py-2 w-full rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${sortOption === filter?.value ? "font-semibold text-indigo-600 dark:text-indigo-400" : ""
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </Menu>
        </div>
      </div>

      <div className="flex flex-nowrap w-full overflow-auto gap-2 text-sm font-medium text-gray-600 dark:text-white mb-4 scrollbar-hide">
        {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Confirmed"]
          .map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${statusFilter === status
                ? "bg-[#843E71] text-white shadow"
                : "bg-gray-200 dark:bg-gray-500/10 hover:bg-gray-300 dark:hover:bg-gray-500/30 text-gray-800 dark:text-white"
                }`}
            >
              {status}
            </button>
          ))}
      </div>

      {content}
    </div>
  );
}

OrderDetails.propTypes = {
  allOrders: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  statusFilter: PropTypes.string.isRequired,
  handleStatusFilter: PropTypes.func.isRequired,
};
