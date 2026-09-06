import React, { useEffect, useState } from "react";
import { MessageCircle, ThumbsUp, Loader } from "lucide-react";
import { Avatar, Rating } from "@mui/material";
import { fetchRecentReviews } from "../../../services/productServices";

export default function AdminProfileReviews() {
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetchRecentReviews();;
        setCustomerReviews(res?.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  let content;

  if (loading) {
    content = (
      <div className="flex justify-center items-center py-6">
        <Loader className="animate-spin text-purple-600 w-6 h-6" />
      </div>
    );
  } else if (customerReviews.length === 0) {
    content = (
      <div className="text-center text-gray-500 dark:text-gray-300 py-4">
        No reviews found.
      </div>
    );
  } else {
    content = customerReviews.map((review) => (
      <div
        key={review._id}
        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30 shadow-sm transition-all duration-300"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 mb-2">
            <Avatar
              src={review.userId?.photo || "/default-avatar.png"}
              alt={review.userId?.username}
              sx={{ width: 32, height: 32 }}
            />
            <div className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
              {review.userId?.username || "Anonymous"}
            </div>
          </div>

          <Rating
            value={review?.rating || 1}
            precision={0.5}
            readOnly
            size="small"
          />
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 italic mt-2 line-clamp-5">
          "{review.message}"
        </p>

        <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
          <div className="flex items-center gap-1">
            <ThumbsUp size={14} className="text-blue-500" />
            {review.likes?.length || 0}
          </div>
          <div>
            {new Date(review.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    ));
  }


  return (
    <div className="bg-gray-100 dark:bg-gray-500/20 p-4 rounded shadow space-y-4 w-full md:w-80 lg:w-90 h-fit  transition-all duration-300">
      <h2 className="sm:text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <MessageCircle className="text-purple-600 hidden sm:flex" />
        Recent 20 Customer Reviews
      </h2>

      {
        content
      }
    </div>
  );
}
