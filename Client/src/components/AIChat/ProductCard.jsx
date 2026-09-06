import React from "react";

const ProductCard = ({ product, theme }) => {
     if (!product) return null;

     const isInStock =
          product.inInventory !== false &&
          Number(product.stock || 0) > 0;

     return (
          <div
               className={`
        mt-3
        overflow-hidden
        rounded-xl
        border
        ${theme === "dark"
                         ? "border-gray-700 bg-[#202020]"
                         : "border-gray-200 bg-white"
                    }
      `}
          >
               <div className="p-3">
                    <div className="flex items-start justify-between gap-3">
                         <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                   {product.name}
                              </p>

                              {product.category && (
                                   <p className="mt-0.5 text-[10px] text-gray-500">
                                        {product.category}
                                   </p>
                              )}
                         </div>

                         <p className="shrink-0 text-sm font-bold text-[#843E71]">
                              ₹{Number(product.price || 0).toFixed(2)}
                         </p>
                    </div>

                    {product.description && (
                         <p
                              className={`
              mt-2
              line-clamp-2
              text-xs
              leading-5
              ${theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                   }
            `}
                         >
                              {product.description}
                         </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-2">
                         <span
                              className={`
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
              ${isInStock
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                   }
            `}
                         >
                              {isInStock ? "In Stock" : "Out of Stock"}
                         </span>

                         {product.quantityUnit && (
                              <span className="text-[10px] text-gray-500">
                                   Per {product.quantityUnit}
                              </span>
                         )}
                    </div>
               </div>
          </div>
     );
};

export default ProductCard;