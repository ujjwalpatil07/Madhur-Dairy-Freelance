export const filterReviews = (reviews, filterType) => {
  switch (filterType) {
    case "top":
      return [...reviews].sort((a, b) => b.rating - a.rating);
    case "liked":
      return [...reviews].sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    case "recent":
      return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "all":
    default:
      return reviews;
  }
};
