import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Star, StarBorder } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import { getAverageRating } from "../../utils/averageRating";
import { ThemeContext } from "../../context/ThemeProvider";
import ReviewCard from "./ReviewCard";
import { filterReviews } from "../../utils/filterReviews";
import ReviewForm from "./ReviewForm";
import { ProductContext } from "../../context/ProductProvider";
import { slugify } from "../../utils/slugify";

const filters = [
  { label: "All Reviews", value: "all" },
  { label: "Top Rated", value: "top" },
  { label: "Most Liked", value: "liked" },
  { label: "Recent", value: "recent" },
];


export default function ReviewSection({ productId }) {

  const { theme } = useContext(ThemeContext);
  const { products } = useContext(ProductContext);

  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState("all");
  const [page, setPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {

    if (!productId || !products) return;

    const selected = products.find((p) => slugify(p._id) === productId);
    setReviews(selected?.reviews);
  }, [productId, products]);

  const filteredReviews = useMemo(
    () => filterReviews(reviews, selected),
    [reviews, selected]
  );

  const paginatedReviews = useMemo(() => {
    const startIndex = (page - 1) * reviewsPerPage;
    return filteredReviews.slice(startIndex, startIndex + reviewsPerPage);
  }, [filteredReviews, page]);


  const totalReviews = reviews.length;
  const averageRating = getAverageRating(reviews);

  const handleFilterClick = (value) => {
    setSelected(value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div>
        <p className="rounded-xl text-center text-gray-600 dark:text-gray-300 py-10">No reviews available yet.</p>

        <ReviewForm productId={productId} />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row gap-10 p-6 mb-5 rounded-lg border border-dashed border-gray-400 dark:border-gray-600"
      >

        <div className="flex items-center w-full md:w-1/3 space-x-5">
          <div className="relative w-24 h-24 md:w-30 md:h-30 flex items-center justify-center text-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">

              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke={theme === "dark" ? "#1e2939" : "#ebe6e7"}
                strokeWidth="8"
              />

              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#f0b100"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(averageRating / 5) * 283} 283`} // 2πr ≈ 283
                transform="rotate(-90 50 50)"

              />
            </svg>
            <span className="absolute text-2xl font-bold text-yellow-500">
              {averageRating.toFixed(1)}
            </span>
          </div>

          <div>
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }, (_, i) =>
                i < Math.round(averageRating) ? (
                  <Star key={i} className="text-yellow-500" />
                ) : (
                  <StarBorder key={i} className="text-gray-500" />
                )
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {totalReviews} Review{totalReviews > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter((r) => r.rating === rating).length;
            const percentage = (count / totalReviews) * 100;

            return (
              <div key={rating} className="flex items-center gap-2">
                <p className="w-5 text-sm text-gray-700 dark:text-gray-200 font-semibold">
                  {rating}.0
                </p>
                <Star className="text-yellow-500" fontSize="small" />
                <div className="w-full h-2 bg-gray-200 rounded dark:bg-gray-800">
                  <div
                    className="h-2 bg-yellow-500 rounded"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-6 text-sm text-gray-600 dark:text-gray-300 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="flex gap-5 flex-col sm:flex-row"
      >

        <div className="w-full h-fit sm:w-50 md:w-60 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-3 space-y-3">
          <h1 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Reviews Filter</h1>

          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value)}
              className={`w-full text-left px-3 py-2 rounded-md transition text-sm font-medium ${selected === filter.value
                ? "bg-[#843E71] text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="space-y-5 flex-1">
          {filteredReviews?.length === 0 ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-300">
              No reviews match this filter.
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium px-1">
                Showing {filteredReviews.length} review{filteredReviews.length > 1 ? "s" : ""}
              </div>

              <ReviewCard reviews={paginatedReviews} productId={productId} />

              {filteredReviews?.length > reviewsPerPage && (
                <div className="pt-4 flex justify-center">
                  <Pagination
                    count={Math.ceil(filteredReviews.length / reviewsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                </div>
              )}
            </>
          )}

          <ReviewForm productId={productId} />
        </div>
      </motion.div>
    </>
  );
}

ReviewSection.propTypes = {
  productId: PropTypes.string.isRequired
};
