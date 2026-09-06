// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"; import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
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
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function InventorySummary({
  totalProducts,
  lowStockCount,
  outOfStockProducts,
  expiringSoonCount,
  loading,
}) {

  const inventorySummaryData = [
    {
      name: "Total Stock Items",
      value: totalProducts,
      icon: <FormatListNumberedIcon className="text-blue-600" />,
      bg: "bg-blue-100 dark:bg-blue-800/30",
    },
    {
      name: "Low Stock",
      value: lowStockCount,
      icon: <ReportProblemIcon className="text-yellow-600" />,
      bg:
        lowStockCount > 0
          ? "bg-yellow-300 dark:bg-yellow-700/70 animate-pulse"
          : "bg-yellow-100 dark:bg-yellow-800/30",
    },
    {
      name: "Out of Stock",
      value: outOfStockProducts,
      icon: <ErrorOutlineIcon className="text-red-600" />,
      bg:
        outOfStockProducts > 0
          ? "bg-red-300 dark:bg-red-700/70 animate-pulse"
          : "bg-red-100 dark:bg-red-800/30",
    },
    {
      name: "Near Expiry",
      value: expiringSoonCount,
      icon: <AccessTimeIcon className="text-orange-600" />,
      bg:
        expiringSoonCount > 0
          ? "bg-orange-300 dark:bg-orange-700/70 animate-pulse"
          : "bg-orange-100 dark:bg-orange-800/30",
    },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-gray-500/20 rounded-sm p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-lg font-semibold mb-4">Inventory Summary</h2>

      <motion.div
        className="flex flex-wrap sm:grid sm:grid-cols-2 gap-3 overflow-x-auto scrollbar-hide pb-2"
        variants={containerVariants}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index * 0.8}
              className="w-full sm:min-w-[220px] lg:min-w-0 flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-500/10 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))
          : inventorySummaryData.map((item, index) => (
            <motion.div
              key={index * 0.9}
              variants={cardVariants}
              className={`w-full sm:min-w-[220px] lg:min-w-0 flex items-center gap-3 p-3 rounded-lg ${item.bg}`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="truncate">
                <div className="text-sm text-gray-500 dark:text-gray-300">{item.name}</div>
                <div className="text-lg font-bold whitespace-nowrap">{item.value}</div>
              </div>
            </motion.div>
          ))}

      </motion.div>
    </motion.div>
  );
}

InventorySummary.propTypes = {
  totalProducts: PropTypes.number.isRequired,
  lowStockCount: PropTypes.number.isRequired,
  outOfStockProducts: PropTypes.number.isRequired,
  expiringSoonCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
};
