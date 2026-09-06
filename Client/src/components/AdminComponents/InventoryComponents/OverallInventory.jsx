import PropTypes from "prop-types";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function OverallInventory({
  totalCategories,
  totalProducts,
  lowStockCount,
  outOfStockProducts,
  expiringSoonCount,
  loading
}) {

  const inventorySummaryData = [
    {
      name: "Total Categories",
      value: totalCategories,
      icon: <CategoryIcon className="text-green-600" />,
      bg: "bg-green-100 dark:bg-green-800/30",
    },
    {
      name: "Total Products",
      value: totalProducts,
      icon: <InventoryIcon className="text-yellow-600" />,
      bg: "bg-yellow-100 dark:bg-yellow-800/30",
    },
    {
      name: "Low Stock Products",
      value: lowStockCount,
      icon: <TrendingDownIcon className="text-red-600" />,
      bg:
        lowStockCount > 0
          ? "bg-red-300 dark:bg-red-700/70 animate-pulse"
          : "bg-red-100 dark:bg-red-800/30",
    },
    {
      name: "Out of Stock",
      value: outOfStockProducts,
      icon: <ErrorOutlineIcon className="text-orange-600" />,
      bg:
        outOfStockProducts > 0
          ? "bg-orange-300 dark:bg-orange-700/70 animate-pulse"
          : "bg-orange-100 dark:bg-orange-800/30",
    },
    {
      name: "Expiring Soon",
      value: expiringSoonCount,
      icon: <AccessTimeIcon className="text-blue-600" />,
      bg:
        expiringSoonCount > 0
          ? "bg-blue-300 dark:bg-blue-700/70 animate-pulse"
          : "bg-blue-100 dark:bg-blue-800/30",
    },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-gray-500/20 rounded-sm p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-lg font-semibold mb-4">Inventory Overview</h2>

      <motion.div
        className="flex flex-nowrap overflow-x-auto gap-4 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 scrollbar-hide"
        variants={containerVariants}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index * 0.89}
              className="min-w-[220px] sm:min-w-0 flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-500/10 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))
          : inventorySummaryData.map((item, index) => (
            <motion.div
              key={index * 0.9}
              className={`min-w-[220px] sm:min-w-0 flex items-center gap-4 p-4 rounded-lg ${item.bg}`}
              variants={itemVariants}
            >
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div className="flex flex-col">
                <div className="text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  {item.name}
                </div>
                <div className="text-lg font-bold flex-nowrap whitespace-nowrap text-ellipsis overflow-hidden">
                  {item.value}
                </div>
              </div>
            </motion.div>
          ))}

      </motion.div>
    </motion.div>
  );
}

OverallInventory.propTypes = {
  totalCategories: PropTypes.number.isRequired,
  totalProducts: PropTypes.number.isRequired,
  lowStockCount: PropTypes.number.isRequired,
  outOfStockProducts: PropTypes.number.isRequired,
  expiringSoonCount: PropTypes.number.isRequired,
  loading: PropTypes.bool
};
