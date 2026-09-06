import React, { useContext, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PropTypes from "prop-types"
import { Pagination } from "@mui/material";
import { ThemeContext } from "../../../context/ThemeProvider";
import { getDiscountedPrice } from "../../../utils/helper";
// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function TopSellingStock({ topSellingStocks, loading }) {

  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useContext(ThemeContext)
  const productsPerPage = 10;

  let content;
  if (topSellingStocks.length === 0) {
    content = (
      <div>
        No data available
      </div>
    )
  } else {

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = topSellingStocks?.slice(indexOfFirstProduct, indexOfLastProduct);
    
    content = (
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="min-w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Total Quantity Sold</th>
              <th className="py-3 px-4">Stock Remaining</th>
              <th className="py-3 px-4">Current Price</th>
              <th className="py-3 px-4">Discount</th>
            </tr>
          </thead>

          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index * 0.69}
                  className="animate-pulse border-b dark:border-gray-700"
                >
                  <td className="py-3 px-4">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded" />
                  </td>
                </tr>
              ))
              : currentProducts?.map((product, index) => {
                const isLowStock = product?.stock < product?.thresholdVal;
                const { discountedPrice } = getDiscountedPrice(product?.price || 0, product?.discount || 0);
                const hasDiscount = product?.discount > 0;

                return (
                  <motion.tr
                    key={index * 0.9}
                    variants={rowVariants}
                    className={`text-sm text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600/20 transition-colors`}
                  >
                    <td className={`${isLowStock && "text-red-500 animate-pulse"} py-3 px-4 font-medium`}>{product?.name}</td>
                    <td className="py-3 px-4">
                      {product?.totalQuantitySold} {product?.quantityUnit}
                    </td>
                    <td className="py-3 px-4">
                      {product?.stock} {product?.quantityUnit}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          &#8377;{discountedPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            &#8377;{product?.price}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{product?.discount}&#37;</td>
                  </motion.tr>
                );
              })}

          </motion.tbody>
        </table>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-500/20 rounded p-3 shadow-md"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Top Selling Stock
      </h2>

      {content}

      <div className=" p-4 mt-2 flex justify-center text-gray-800 dark:text-white">
        <Pagination
          count={Math.ceil(topSellingStocks?.length / productsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          variant="outlined"
          shape="rounded"
          siblingCount={1}
          boundaryCount={0}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "inherit",
              transition: "all 0.2s ease",
              "&:hover": {
                border: "2px solid #843E71",
              },
            },
            "& .Mui-selected": {
              backgroundColor: `${theme === "dark" ? "#843E71" : "#fff"}`,
              color: `${theme === "light" ? "#843E71" : "#fff"}`,
              borderColor: "#843E71",
              "&:hover": {
                backgroundColor: "#6e305e",
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
}


TopSellingStock.propTypes = {
  topSellingStocks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      totalQuantitySold: PropTypes.number,
      quantityUnit: PropTypes.string,
      stock: PropTypes.number,
      thresholdVal: PropTypes.number,
      price: PropTypes.number,
      discount: PropTypes.number,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired
};