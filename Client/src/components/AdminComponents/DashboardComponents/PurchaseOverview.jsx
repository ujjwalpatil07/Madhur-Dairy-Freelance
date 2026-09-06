// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"; import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import UndoIcon from "@mui/icons-material/Undo";
import CancelIcon from "@mui/icons-material/Cancel";
import { Timer } from "lucide-react";
import PropTypes from "prop-types";
// Animation Variants
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

export default function OrdersOverview({ totalOrdersRecieved, totalPendingOrders, countCanceledOrders, countDeliveredOrders, loading }) {

  const purchaseOverviewData = [
    {
      name: "Total Orders Recieved",
      value: totalOrdersRecieved,
      icon: <ShoppingCartIcon className="text-green-600" />,
      bg: "bg-green-100 dark:bg-green-800/30",
    },
    {
      name: "Total Delivered",
      value: countDeliveredOrders || 0,
      icon: <UndoIcon className="text-yellow-600" />,
      bg: "bg-yellow-100 dark:bg-yellow-800/30",
    },
    {
      name: "Total Canceled",
      value: countCanceledOrders || 0,
      icon: <CancelIcon className="text-red-600" />,
      bg: "bg-red-100 dark:bg-red-800/30",
    },
    {
      name: "Total Pending Orders",
      value: totalPendingOrders,
      icon: <Timer className="text-blue-600" />,
      bg: "bg-blue-100 dark:bg-blue-800/30",
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

      <motion.div
        className="flex flex-wrap sm:grid sm:grid-cols-2 gap-3 overflow-x-auto scrollbar-hide pb-2"
        variants={containerVariants}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index * 0.9}
              className="w-full sm:min-w-[220px] lg:min-w-0 flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-500/10 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))
          : purchaseOverviewData.map((item, index) => (
            <motion.div
              key={index * 0.9}
              variants={cardVariants}
              className={`w-full sm:min-w-[220px] lg:min-w-0 flex items-center gap-3 p-3 rounded-lg ${item.bg}`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{item.name}</div>
                <div className="text-lg font-bold">{item.value}</div>
              </div>
            </motion.div>
          ))}

      </motion.div>
    </motion.div>
  );
}

OrdersOverview.propTypes = {
  totalOrdersRecieved: PropTypes.number.isRequired,
  totalPendingOrders: PropTypes.number.isRequired,
  countCanceledOrders: PropTypes.number.isRequired,
  countDeliveredOrders: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};