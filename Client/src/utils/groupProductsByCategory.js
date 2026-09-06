export const groupProductsByCategory = (products = []) => {
    const map = {};

    for (let product of products) {
        const category = product.category || "Others";
        if (!map[category]) {
            map[category] = [];
        }
        map[category].push(product);
    }

    return map;
}
