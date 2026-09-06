import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { products } from "../../data/products";

export default function DairyProductsCarousel({ half }) {

    const mid = Math.ceil(products?.length / 2);
    const displayedProducts = half === "first" ? products?.slice(0, mid) : products?.slice(mid);

    return (
        <div className="flex">
            {displayedProducts?.map((product, index) => (
                <Link key={index * 0.9} to={`/products/${product?.title}`} className="sm:mx-6 text-center min-w-[130px] sm:min-w-[150px]">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="h-17 w-17 sm:h-24 sm:w-24 mx-auto object-cover rounded-full shadow-md"
                    />

                    <p className={`mt-2 text-sm font-medium text-gray-900 dark:text-white`}>
                        {product?.title}
                    </p>
                </Link>
            ))}
        </div>
    );
}

DairyProductsCarousel.propTypes = {
    half: PropTypes.string.isRequired
}