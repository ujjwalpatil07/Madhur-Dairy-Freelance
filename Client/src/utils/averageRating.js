export const getAverageRating = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const average = sum / reviews.length;

  return (isNaN(average) ? 0 : Number(average.toFixed(1)));
};

