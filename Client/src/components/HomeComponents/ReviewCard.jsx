import React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function ReviewCard({ userImage, name, message, rating, likesCount }) {
    return (
        <div className="bg-white dark:bg-gray-700/20 p-6 rounded-xl shadow-md flex flex-col items-center text-center max-w-sm w-full mx-auto hover:shadow-lg transition">
            <Avatar
                alt={name}
                src={userImage}
                sx={{
                    width: 72,
                    height: 72,
                    mb: 4,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
            />
            <Rating
                name="read-only"
                value={rating}
                readOnly
                precision={0.5}
                sx={{ mb: 2 }}
            />
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
                "{message}"
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>

            <div className="flex items-center gap-1 mt-3 text-sm text-gray-600 dark:text-gray-300">
                <ThumbUpIcon fontSize="small" />
                <span>{likesCount} {likesCount === 1 ? "like" : "likes"}</span>
            </div>
        </div>
    );
}

ReviewCard.propTypes = {
    userImage: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    likesCount: PropTypes.number.isRequired
};
