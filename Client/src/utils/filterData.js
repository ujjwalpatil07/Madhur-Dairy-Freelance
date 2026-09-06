import { getAverageRating } from "./averageRating";

export const searchProducts = (products, productId) => {
  if (!productId || !Array.isArray(products)) return products ?? [];

  const keyword = productId.replace(/-/g, " ").toLowerCase();

  return products.filter((product) => {
    const nameMatch = product?.name?.toLowerCase()?.includes(keyword) ?? false;
    const categoryMatch = product?.category?.toLowerCase()?.includes(keyword) ?? false;
    const priceMatch = String(product?.price || "")?.includes(keyword) || false;
    return nameMatch || categoryMatch || priceMatch;
  });
};

export const recommendProducts = (products, productId) => {
  if (!productId || !Array.isArray(products)) return [];

  const keywords = productId.replace(/-/g, " ").toLowerCase().split(/\s+/);

  const recommendedProducts = products.filter((product) => {
    const descriptionTokens = product?.description?.toLowerCase()?.split(/\s+/) ?? [];
    const typeTokens = product?.type?.toLowerCase()?.split(/\s+/) ?? [];
    const unitTokens = product?.quantityUnit?.toLowerCase()?.split(/\s+/) ?? [];

    const allTokens = [...descriptionTokens, ...typeTokens, ...unitTokens];
    return keywords.some((kw) => allTokens.includes(kw));
  });

  // Shuffle
  for (let i = recommendedProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [recommendedProducts[i], recommendedProducts[j]] = [
      recommendedProducts[j],
      recommendedProducts[i],
    ];
  }

  return recommendedProducts;
};

export const getTopProductsByReviewsAndLikes = (products) => {
  if (!Array.isArray(products)) return [];

  const scoredProducts = products.map((product) => {
    const likesCount = product?.likes?.length ?? 0;
    const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
    const reviewCount = reviews.length;

    const totalReviewLikes = reviews.reduce((sum, review) => {
      return sum + (review?.likes?.length ?? 0);
    }, 0);

    const totalScore = likesCount + totalReviewLikes + reviewCount;

    return {
      ...product,
      totalScore,
    };
  });

  return scoredProducts.sort((a, b) => b.totalScore - a.totalScore);
};

export const sortProducts = (products, filterType) => {
  if (!Array.isArray(products)) return [];

  switch (filterType) {
    case "Most Reviews":
      return [...products].sort(
        (a, b) => (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0)
      );

    case "Most Likes":
      return [...products].sort(
        (a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0)
      );

    case "Price: Low to High":
      return [...products].sort(
        (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
      );

    case "Price: High to Low":
      return [...products].sort(
        (a, b) => (b.price ?? 0) - (a.price ?? 0)
      );

    case "Sort by: Rating":
      return [...products].sort(
        (a, b) => getAverageRating(b.reviews ?? []) - getAverageRating(a.reviews ?? [])
      );

    default:
      return products;
  }
};

