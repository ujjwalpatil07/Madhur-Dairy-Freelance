
import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import UpdateProductModel from './Models/UpdateProductModel';
import AddProductModel from "./Models/AddProductModel"
import RemoveModel from './Models/RemoveProductModel';
import { SidebarContext } from '../../../context/SidebarProvider';
import { FilterIcon } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Slide from '@mui/material/Slide';
import { ThemeContext } from '../../../context/ThemeProvider';
import {
  Pagination, Menu
} from "@mui/material";
import { searchProducts } from '../../../utils/filterData';
import { useDebounce } from 'use-debounce';
import { getDiscountedPrice } from '../../../utils/helper';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function ProductsList({ products, loading }) {

  const { navbarInput, highlightMatch } = useContext(SidebarContext);
  const { theme } = useContext(ThemeContext);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openRemoveModel, setOpenRemoveModel] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productList, setProductList] = useState(products || []);
  const [filterType, setFilterType] = useState('Filter');
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [debouncedQuery] = useDebounce(navbarInput);

  const productsPerPage = 7;

  useEffect(() => {
    setProductList(products || []);
  }, [products]);

  const filterOptions = [
    { label: "Out of stock", value: "outOfStock" },
    { label: "Low Stocks", value: "lowStock" },
    { label: "Price: Low to High", value: "priceLowToHigh" },
    { label: "Price: High to Low", value: "priceHighToLow" },
    { label: "Quantity: Low to High", value: "quantityLowToHigh" },
    { label: "Quantity: High to Low", value: "quantityHighToLow" },
    { label: "Sold: Low to High", value: "soldLowToHigh" },
    { label: "Sold: High to Low", value: "soldHighToLow" },
    { label: "Clear", value: "Filter" },
  ];

  const handleFilter = (type) => {
    setFilterType(type);

    let sortedProducts = [...products];

    switch (type) {
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'quantityLowToHigh':
        sortedProducts.sort((a, b) => a.stock - b.stock);
        break;
      case 'quantityHighToLow':
        sortedProducts = sortedProducts.sort((a, b) => b.stock - a.stock);
        break;
      case 'outOfStock':
        sortedProducts = sortedProducts.filter((p) => p.stock === 0);
        break;
      case 'lowStock':
        sortedProducts = sortedProducts.filter((p) => p?.stock < p?.thresholdVal);
        break;
      case 'soldLowToHigh':
        sortedProducts.sort((a, b) => (a.totalQuantitySold || 0) - (b.totalQuantitySold || 0));
        break;
      case 'soldHighToLow':
        sortedProducts.sort((a, b) => (b.totalQuantitySold || 0) - (a.totalQuantitySold || 0));
        break;
      default:
        sortedProducts = products;
    }

    setProductList(sortedProducts);
    setCurrentPage(1);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filteredProducts = useMemo(() => {
    return searchProducts(productList || [], debouncedQuery);
  }, [productList, debouncedQuery]);

  let content;
  if (loading) {
    content = (
      <div className="flex items-center justify-center h-[50vh] text-gray-600 dark:text-white gap-3">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
        <span className="text-xl">Loading products...</span>
      </div>
    );
  } else if (!filteredProducts || filteredProducts?.length === 0) {
    content = (
      <div className="text-center text-gray-500 dark:text-gray-300 py-4">
        No products found.
      </div>
    );
  } else {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

    content = (
      <>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-500/20 text-gray-600 dark:text-gray-300">
                <th className="pb-3 px-3 whitespace-nowrap">Products</th>
                <th className="pb-3 px-3 whitespace-nowrap">Selling Price</th>
                <th className="pb-3 px-3 whitespace-nowrap">Quantity</th>
                <th className="pb-3 px-3 whitespace-nowrap">Threshold Value</th>
                <th className="pb-3 px-3 whitespace-nowrap">Category</th>
                <th className="pb-3 px-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentProducts?.map((product, index) => {

                const isLowStock = product?.stock < product?.thresholdVal;
                const { discountedPrice } = getDiscountedPrice(product?.price || 0, product?.discount || 0);
                const hasDiscount = product?.discount > 0;

                return (
                  <motion.tr
                    key={product?._id || index}
                    variants={rowVariants}

                    className={`border-b border-gray-200 dark:border-gray-500/20`}
                  >
                    <td className={`py-2 px-3 font-medium  ${isLowStock ? "text-red-500 animate-pulse" : "text-gray-700 dark:text-white"}`}>
                      {highlightMatch(product?.name, navbarInput)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          &#8377;{discountedPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            &#8377;{highlightMatch(product?.price, navbarInput)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {product?.stock} {product?.quantityUnit}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {product?.thresholdVal} {product?.quantityUnit}
                    </td>
                    <td className="py-2 px-3 whitespace-break-spaces">{highlightMatch(product?.category, navbarInput)}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenUpdateModal(true);
                          }}
                          className="text-sm bg-green-200 text-black dark:bg-blue-800/40 dark:hover:bg-blue-800/50 dark:text-white px-4 py-2 rounded hover:bg-green-300/80"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenRemoveModel(true);
                          }}
                          className="text-sm bg-red-200 text-black dark:bg-red-800/40 dark:hover:bg-red-800/50 dark:text-white px-4 py-2 rounded hover:bg-red-300/80"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </motion.tr>

                );
              })}
            </motion.tbody>

          </table>
        </div>

        <div className="p-4 mt-2 flex justify-center text-gray-800 dark:text-white">
          <Pagination
            count={Math.ceil(filteredProducts?.length / productsPerPage)}
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
                "& .Mui-selected": {
                  backgroundColor: `${theme === "dark" ? "#843E71" : "#fff"}`,
                  color: `${theme === "light" ? "#843E71" : "#fff"}`,
                  borderColor: "#843E71",
                  "&:hover": {
                    backgroundColor: "#6e305e",
                  },
                },
              },
            }}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-500/20 rounded p-4 md:p-6 shadow-md w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Products</h2>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 w-full md:w-auto">
            <div className='flex gap-2'>
              <button
                onClick={() => setOpenAddModal(true)}
                className="bg-blue-500 dark:bg-orange-600/30 dark:hover:bg-orange-600/40 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Add Product
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex items-center gap-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 cursor-pointer"
                  aria-haspopup="listbox"
                >
                  <FilterIcon size={"18px"} />
                  <span>{filterType}</span>
                </button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                >
                  <div className='space-y-3 p-3 bg-white text-gray-800 dark:bg-gray-500/50 backdrop-blur-md dark:text-white'>
                    {filterOptions.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          handleFilter(filter.value);
                          handleClose();
                        }}
                        className="dark:hover:bg-gray-600 flex"
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </Menu>
              </div>
            </div>
          </div>
        </div>

        {content}
      </div>

      <AddProductModel open={openAddModal} onClose={() => setOpenAddModal(false)} />
      <UpdateProductModel open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} selectedProduct={selectedProduct} />
      <RemoveModel open={openRemoveModel} onClose={() => setOpenRemoveModel(false)} selectedProduct={selectedProduct} />
    </>
  )
}

ProductsList.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,

};
