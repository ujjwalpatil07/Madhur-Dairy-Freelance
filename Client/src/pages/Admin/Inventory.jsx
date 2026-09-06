import React, { useContext } from "react";
import OverallInventory from "../../components/AdminComponents/InventoryComponents/OverallInventory";
import ProductsList from "../../components/AdminComponents/InventoryComponents/ProductsList";

import {
  getExpiryStatusCounts,
  lowStockCount,
  outOfStockProducts,
  totalCategories,
  totalProducts,
} from "../../utils/InventoryHelpers/inventoryOverviewHelper";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ProductContext } from "../../context/ProductProvider";
// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

export default function Inventory() {
  const { products, productLoading } = useContext(ProductContext)
  const { expiredCount, expiringSoonCount } = getExpiryStatusCounts(products);

  return (
    <>
      <motion.div
        className="p-3"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        <OverallInventory
          totalCategories={totalCategories(products)}
          totalProducts={totalProducts(products)}
          lowStockCount={lowStockCount(products)}
          outOfStockProducts={outOfStockProducts(products)}
          expiringSoonCount={expiringSoonCount}
          expiredCount={expiredCount}
          loading={productLoading}
        />
      </motion.div>

      <motion.div
        className="p-3"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        <ProductsList
          products={products}
          loading={productLoading}
        />
      </motion.div>
    </>
  );
}
