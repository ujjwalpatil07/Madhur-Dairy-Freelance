// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PercentIcon from "@mui/icons-material/Percent";
import BarChartIcon from "@mui/icons-material/BarChart";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ListAltIcon from '@mui/icons-material/ListAlt';
import { formatNumberWithCommas } from "../../../utils/format";
import PropTypes from "prop-types"

// Animation variants
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

export default function SalesOverview({ totalRevenue, totalSales, totalProfit, totalExpenses, loading }) {

    const salesData = [
        {
            name: "Revenue",
            value: totalRevenue,
            icon: <TrendingUpIcon className="text-green-600" />,
            bg: "bg-green-100 dark:bg-green-800/30",
        },
        {
            name: "Sales",
            value: totalSales,
            icon: <PercentIcon className="text-blue-600" />,
            bg: "bg-blue-100 dark:bg-blue-800/30",
        },
        {
            name: "Profit",
            value: totalProfit,
            icon: <BarChartIcon className="text-purple-600" />,
            bg: "bg-purple-100 dark:bg-purple-800/30",
        },
        {
            name: "Cost",
            value: totalRevenue - totalProfit,
            icon: <MoneyOffIcon className="text-yellow-600" />,
            bg: "bg-yellow-100 dark:bg-yellow-800/30",
        },
        {
            name: "Expenses",
            value: totalExpenses,
            icon: <ListAltIcon className="text-red-600" />,
            bg: "bg-red-100 dark:bg-red-800/30",
        },
    ];

    return (
        <motion.div
            className="bg-white dark:bg-gray-500/20 rounded-sm p-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>

            <motion.div
                className="flex flex-nowrap overflow-x-auto gap-4 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 scrollbar-hide"
                variants={containerVariants}
            >
                {
                    loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index * 0.5}
                                className="min-w-[220px] sm:min-w-0 flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-500/10 animate-pulse"
                            >
                                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        ))
                        : salesData.map((item, index) => (
                            <motion.div
                                key={index * 0.9}
                                className={`min-w-[220px] sm:min-w-0 flex items-center gap-4 p-4 rounded-lg ${item.bg}`}
                                variants={cardVariants}
                            >
                                <div className="text-2xl shrink-0">{item.icon}</div>
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                        {item.name}
                                    </div>
                                    <div className="text-lg font-bold flex-nowrap whitespace-nowrap text-ellipsis overflow-hidden">
                                        &#8377; {formatNumberWithCommas(item.value)}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                }
            </motion.div>
        </motion.div>
    );
}

SalesOverview.propTypes = {
    totalRevenue: PropTypes.number.isRequired,
    totalSales: PropTypes.number.isRequired,
    totalProfit: PropTypes.number.isRequired,
    totalExpenses: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired
};
