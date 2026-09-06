import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { UserAuthContext } from "../../context/AuthProvider"
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating } from "@mui/material";
import {
    ThumbUpOffAlt,
    ThumbDownOffAlt,
    ThumbUpAlt,
    Edit,
    Delete,
    Save,
    Close,
} from "@mui/icons-material";
import Slide from '@mui/material/Slide';

import { socket } from "../../socket/socket";
import { enqueueSnackbar } from "notistack";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ReviewCard({ reviews, productId }) {

    const { authUser } = useContext(UserAuthContext);

    const [editReview, setEditReview] = useState(null);
    const [editMessage, setEditMessage] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [loading, setLoading] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(null);
    const [likeLoading, setLikeLoading] = useState(null);

    const handleRemoveReviewFailed = ({ message }) => {
        enqueueSnackbar(message, { variant: "error" });
        setLoading(null);
    }

    const handleRemoveReviewSuccess = ({ message }) => {
        enqueueSnackbar(message, { variant: "success" });
        setLoading(false);
    }

    const handleEditReviewFailed = ({ message }) => {
        enqueueSnackbar(message, { variant: "error" });
        setLoading(null);
    }

    const handleEditReviewSuccess = ({ message }) => {
        enqueueSnackbar(message, { variant: "success" });
        setLoading(null);
        setEditReview(null);
    };

    const handleReviewLikeUpdate = ({ success, message }) => {
        if(success) {
            enqueueSnackbar(message, { variant: "success" });
        } else {
            enqueueSnackbar(message, { variant: "error" });
        }
        setLikeLoading(null);
    }

    useEffect(() => {
        socket.on("review:remove-failed", handleRemoveReviewFailed);
        socket.on("remove-review-success", handleRemoveReviewSuccess);
        socket.on("review:edit-update-failed", handleEditReviewFailed);
        socket.on("review:edit-update-success", handleEditReviewSuccess);
        socket.on("review:like-update", handleReviewLikeUpdate);

        return () => {
            socket.off("review:remove-failed", handleRemoveReviewFailed);
            socket.off("remove-review-success", handleRemoveReviewSuccess);
            socket.off("review:edit-update-failed", handleEditReviewFailed);
            socket.off("review:edit-update-success", handleEditReviewSuccess);
            socket.off("review:like-update", handleReviewLikeUpdate);
        }
    }, []);

    const handleReviewLike = async (reviewId) => {

        if (!authUser?._id) {
            enqueueSnackbar("Please log in to like review.", { variant: "error" });
            return;
        }

        if ((editReview?.likes || []).includes(authUser?._id)) {
            enqueueSnackbar("You already liked this review.");
            return;
        }

        setLikeLoading(reviewId);
        socket.emit("review:like", {
            userId: authUser._id,
            productId,
            reviewId
        });
    };

    const handleDeleteReview = async (productId) => {
        if (!deleteDialogOpen?._id || !productId) {
            enqueueSnackbar("Missing review or product ID.", { variant: "error" });
            return;
        }

        setLoading(deleteDialogOpen?._id);
        socket.emit("review:remove", { reviewId: deleteDialogOpen?._id, productId });
        setDeleteDialogOpen(null);
    }

    const handleSaveEdit = async () => {

        if (!authUser) {
            enqueueSnackbar("You must be logged in to edit a review.", { variant: "error" });
            return;
        }

        if (!editReview) {
            enqueueSnackbar("No review selected for editing.", { variant: "error" });
            return;
        }

        if (!editMessage.trim()) {
            enqueueSnackbar("Message cannot be empty.", { variant: "error" });
            return;
        }

        setLoading(editReview?._id);
        socket.emit("review:edit-update", {
            productId,
            reviewId: editReview?._id,
            userId: authUser?._id,
            message: editMessage.trim(),
            rating: editRating || 0
        });
    }

    const handleReviewEdit = (editReview) => {
        setEditReview(editReview);
        setEditMessage(editReview?.message || "");
        setEditRating(editReview?.rating || 5);
    }

    const iconButtonClass = "w-7 h-7 flex items-center justify-center rounded-sm bg-gray-500/10 dark:bg-gray-500/20 transition";

    return (
        <>

            {
                reviews?.map((review) => {
                    const reviewOwnerId = review?.userId?._id || "";
                    const isReviewOwner = authUser?._id === reviewOwnerId;
                    const username = review?.userId?.username;
                    const hasLiked = (review?.likes || []).includes(authUser?._id);
                    const isEditing = editReview && editReview._id === review._id;
                    const isLoading = review && loading === review?._id;

                    return (
                        <motion.div
                            key={review?._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full p-4 rounded-lg space-y-2 border border-dashed border-gray-400 dark:border-gray-600"
                        >

                            <Rating
                                value={isEditing ? editRating : review?.rating}
                                readOnly={!isEditing}
                                precision={1}
                                size="small"
                                onChange={(e, val) => setEditRating(val)}
                            />

                            {isEditing ? (
                                <textarea
                                    className="w-full text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-500/10 dark:text-white transition-colors duration-300"
                                    value={editMessage}
                                    rows={3}
                                    onChange={(e) => setEditMessage(e.target.value)}
                                />
                            ) : (
                                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line break-all">
                                    {review?.message}
                                </p>
                            )}

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(review?.createdAt).toDateString()}
                            </p>

                            <div className="flex items-center justify-between pt-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <Avatar alt={username} src={review?.userId?.photo} sx={{ width: 32, height: 32 }} />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 dark:text-white break-all">
                                            {username}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    {
                                        (likeLoading === review?._id)
                                            ? <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                                            :
                                            <button
                                                onClick={() => handleReviewLike(review?._id)}
                                                type="button"
                                                className={`${iconButtonClass} ${hasLiked ? "text-[#843E71]" : "hover:text-[#843E71]"}`}
                                            >
                                                {hasLiked ? <ThumbUpAlt fontSize="small" /> : <ThumbUpOffAlt fontSize="small" />}
                                            </button>
                                    }

                                    <span className="text-sm">{(review?.likes || []).length}</span>

                                    <div className={`${iconButtonClass} cursor-default opacity-50`}>
                                        <ThumbDownOffAlt fontSize="small" />
                                    </div>

                                    {isReviewOwner && !isEditing && (
                                        <>
                                            <button
                                                onClick={() => handleReviewEdit(review)}
                                                className={`${iconButtonClass} hover:text-blue-600`}
                                            >
                                                <Edit fontSize="small" />
                                            </button>

                                            <button
                                                onClick={() => setDeleteDialogOpen(review)}
                                                className={`${iconButtonClass} hover:text-red-600`}
                                            >
                                                {isLoading ? <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div> : <Delete fontSize="small" />}
                                            </button>
                                        </>
                                    )}

                                    {isReviewOwner && isEditing && (
                                        <>
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={isLoading}
                                                className={`${iconButtonClass} hover:text-green-600 disabled:cursor-not-allowed`}
                                            >
                                                {isLoading ? <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div> : <Save fontSize="small" />}
                                            </button>
                                            <button
                                                onClick={() => handleReviewEdit(null)}
                                                className={`${iconButtonClass} hover:text-gray-500`}
                                            >
                                                <Close fontSize="small" />
                                            </button>
                                        </>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    )
                })
            }

            <Dialog
                open={deleteDialogOpen?._id}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setDeleteDialogOpen(null)}
                fullWidth={true}
                maxWidth="sm"
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="dark:bg-black/80 dark:text-white">
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <p
                            id="alert-dialog-slide-description"
                            className="text-sm text-gray-800 dark:text-gray-300 line-clamp-2"
                        >
                            Do you want to delete this review?
                        </p>
                        <p className="line-clamp-2">{deleteDialogOpen?.message}</p>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(null)}>Cancel</Button>
                        <Button onClick={() => handleDeleteReview(productId)}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}

ReviewCard.propTypes = {
    reviews: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.shape({
                _id: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired,
                photo: PropTypes.string,
            }).isRequired,
            date: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            rating: PropTypes.number.isRequired,
            likes: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ),
    productId: PropTypes.string.isRequired,
};