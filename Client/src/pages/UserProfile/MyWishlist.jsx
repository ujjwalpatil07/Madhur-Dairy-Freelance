import React, { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../../context/AuthProvider";
import { getWishlistedProducts, removeProductFromWishList } from "../../services/userProfileService";
import { Link } from "react-router-dom";
import { FaGlassWhiskey } from "react-icons/fa";
import { getDiscountedPrice } from "../../utils/helper";
import { slugify } from "../../utils/slugify";
import { useSnackbar } from "notistack";

export default function MyWishlist() {
  const { enqueueSnackbar } = useSnackbar();
  const { authUser, setAuthUser } = useContext(UserAuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (authUser?._id) {
          const res = await getWishlistedProducts(authUser._id);
          setWishlist(res?.wishlistedProducts || []);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [authUser]);

  const handleRemove = async (productId) => {

    if (deleteLoading) {
      enqueueSnackbar("Please wait, removing item...", { variant: "info" });
      return;
    }

    try {
      setDeleteLoading(productId);
      const data = await removeProductFromWishList(authUser._id, productId);
      if (data?.success) {
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
        enqueueSnackbar("Removed from wishlist", { variant: "success" });
        setAuthUser((prev) => ({
          ...prev,
          wishlistedProducts: (prev?.wishlistedProducts || []).filter(
            (id) => id !== productId
          ),
        }));
      }
    } catch {
      enqueueSnackbar("Failed to remove from wishlist", { variant: "error" });
    } finally {
      setDeleteLoading(null);
    }
  };

  let content;

  if (loading) {
    content = (
      <div className="text-center py-20 text-gray-600">
        <div className="animate-spin w-6 h-6 border-4 border-dashed rounded-full mx-auto border-[#843E71] mb-3" />
        Loading your wishlist...
      </div>
    );
  } else if (wishlist.length === 0) {
    content = (
      <div className="text-center py-10 px-3">
        You haven't added anything to your wishlist yet.
      </div>
    );
  } else {
    content = (

      <ul className="space-y-4">
        {wishlist.map((product) => {
          const { discountedPrice } = getDiscountedPrice(
            product?.price,
            product?.discount
          );
          return (
            <li
              key={product?._id}
              className="w-full rounded-lg bg-gray-100 dark:bg-gray-500/10 hover:shadow transition"
            >
              <div className="flex items-start">
                <div className="w-25 h-25 flex-shrink-0 bg-white rounded-tl sm:rounded-s overflow-hidden flex justify-center items-center">
                  {product?.image?.[0] ? (
                    <img
                      src={product.image[0]}
                      alt={product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaGlassWhiskey className="text-xl text-gray-400" />
                  )}
                </div>

                <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <Link to={`/product-details/${slugify(product?.category)}`} className="font-semibold text-gray-800 dark:text-white truncate">
                      {product?.name || "Unnamed Product"}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {product?.category || "Category"} &bull; {product?.quantityUnit || ""}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-[#843E71] font-bold text-sm">
                          &#8377;{discountedPrice}
                        </span>
                        {product?.discount > 0 && (
                          <>
                            <span className="text-xs line-through text-gray-500 ml-1">
                              &#8377;{product?.price}
                            </span>
                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded ml-1">
                              {product.discount}&#37; OFF
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemove(product?._id)}
                        disabled={deleteLoading === product?._id}
                        className={`hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full transition 
    ${(deleteLoading === product?._id) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500/20 text-red-600 hover:bg-red-500/30"}`}
                      >
                        {(deleteLoading === product?._id) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin" />
                            Removing...
                          </>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemove(product._id)}
                disabled={deleteLoading === product?._id}
                className={`w-full py-1 rounded-b text-sm font-medium transition sm:hidden 
    ${deleteLoading === product?._id ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500/20 text-red-600 hover:text-red-800"}`}
              >
                {deleteLoading === product?._id ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin" />
                    Removing...
                  </div>
                ) : (
                  "Remove"
                )}
              </button>
            </li>
          );
        })
        }
      </ul >
    )
  }

  return (
    <>
      <h2 className="font-semibold text-xl w-full !h-fit md:h-full mx-auto flex justify-between items-center mb-4">
        My Wishlist
      </h2>
      {content}
    </>
  );
}