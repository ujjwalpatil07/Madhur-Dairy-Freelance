import React from "react";

const getStatusClasses = (status) => {
     switch (status) {
          case "Delivered":
               return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

          case "Pending":
               return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

          case "Processing":
               return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

          case "Shipped":
               return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

          case "Cancelled":
               return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

          default:
               return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
     }
};

const OrderCard = ({ order, theme }) => {
     if (!order) return null;

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
               {/* Header */}
               <div
                    className={`
          flex
          items-center
          justify-between
          gap-2
          border-b
          px-3
          py-3
          ${theme === "dark"
                              ? "border-gray-700"
                              : "border-gray-100"
                         }
        `}
               >
                    <div className="min-w-0">
                         <p className="text-[10px] uppercase tracking-wide text-gray-500">
                              Order
                         </p>

                         <p className="truncate text-xs font-semibold">
                              #{order.id}
                         </p>
                    </div>

                    <span
                         className={`
            shrink-0
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-semibold
            ${getStatusClasses(order.status)}
          `}
                    >
                         {order.status}
                    </span>
               </div>

               {/* Products */}
               {order.products?.length > 0 && (
                    <div className="space-y-2 px-3 py-3">
                         {order.products.map((product, index) => (
                              <div
                                   key={`${product.productId}-${index}`}
                                   className="flex items-center justify-between gap-3"
                              >
                                   <div className="min-w-0">
                                        <p className="truncate text-xs font-medium">
                                             {product.name}
                                        </p>

                                        <p className="text-[10px] text-gray-500">
                                             {product.quantity} {product.quantityUnit}
                                        </p>
                                   </div>

                                   <p className="shrink-0 text-xs font-semibold">
                                        ₹{Number(product.price || 0).toFixed(2)}
                                   </p>
                              </div>
                         ))}
                    </div>
               )}

               {/* Footer */}
               <div
                    className={`
          grid
          grid-cols-2
          gap-2
          border-t
          px-3
          py-3
          text-xs
          ${theme === "dark"
                              ? "border-gray-700"
                              : "border-gray-100"
                         }
        `}
               >
                    <div>
                         <p className="text-[10px] text-gray-500">
                              Total
                         </p>

                         <p className="font-semibold">
                              ₹{Number(order.totalAmount || 0).toFixed(2)}
                         </p>
                    </div>

                    <div>
                         <p className="text-[10px] text-gray-500">
                              Payment
                         </p>

                         <p className="font-semibold">
                              {order.paymentMode || "N/A"}
                         </p>
                    </div>
               </div>
          </div>
     );
};

export default OrderCard;