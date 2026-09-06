import React from "react";
import {
  ShoppingCart,
  BookCheck,
  Undo2,
  NotepadTextDashedIcon,
  Ban,
} from "lucide-react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
// Motion variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function OrdersSummary({
  totalOrders,
  totalRecievedOrders,
  totalCanceledOrders,
  handleStatusFilter,
}) {
  const orderSummaryData = [
    {
      name: "Pending Orders",
      value: totalOrders,
      icon: <ShoppingCart size={28} className="text-green-600" />,
      bg: "bg-green-100 dark:bg-green-800/30",
      status: "Pending",
    },
    {
      name: "Total Orders Recieved",
      value: totalRecievedOrders,
      icon: <BookCheck size={28} className="text-yellow-600" />,
      bg: "bg-yellow-100 dark:bg-yellow-800/30",
      status: "All",
    },
    {
      name: "Total Returned Orders",
      value: 0,
      icon: <Undo2 size={28} className="text-orange-600" />,
      bg: "bg-orange-100 dark:bg-orange-800/30",
      status: "All",
    },
    {
      name: "Total Canceled Orders",
      value: totalCanceledOrders,
      icon: <Ban size={28} className="text-red-600" />,
      bg: "bg-red-100 dark:bg-red-800/30",
      status: "Cancelled",
    },
    {
      name: "Total Drafted Orders",
      value: 0,
      icon: <NotepadTextDashedIcon size={28} className="text-blue-600" />,
      bg: "bg-blue-100 dark:bg-blue-800/30",
      status: "All",
    },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-gray-500/20 rounded-sm p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>

      <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 scrollbar-hide">
        {orderSummaryData.map((item, index) => (
          <motion.div
            key={index * 0.9}
            variants={cardVariants}
            className={`min-w-[220px] sm:min-w-0 flex items-center gap-4 p-4 rounded-lg ${item.bg} cursor-pointer`}
            onClick={() => handleStatusFilter(item.status)}
          >
            <div className="text-2xl shrink-0">{item.icon}</div>
            <div className="flex flex-col">
              <div className="text-sm text-gray-500 dark:text-gray-300 break-words">
                {item.name}
              </div>
              <div className="text-lg font-bold flex-nowrap whitespace-nowrap text-ellipsis overflow-hidden">
                {item.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

OrdersSummary.propTypes = {
  totalOrders: PropTypes.number.isRequired,
  totalRecievedOrders: PropTypes.number.isRequired,
  totalCanceledOrders: PropTypes.number.isRequired,
  handleStatusFilter: PropTypes.func.isRequired,
};
