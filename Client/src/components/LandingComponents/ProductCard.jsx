import PropTypes from "prop-types";
import CheckIcon from '@mui/icons-material/Check';
import { Link } from "react-router-dom";

export default function ProductCard({ title, description, image, features }) {

  return (
    <>
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-54 object-cover rounded-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-4">
          {description}
        </p>
        <ul className="space-y-2 my-3">
          {features?.map((feature, i) => (
            <li
              key={i * 0.2}
              className="flex items-start text-gray-700 dark:text-gray-200"
            >
              <span className="mr-2 text-amber-500 dark:text-amber-300">
                <CheckIcon />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <Link to={`/products/${title?.toLowerCase()}`} className="text-sm text-blue-500 hover:underline underline-offset-4">View More</Link>
      </div>
    </>

  );
}

ProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string),
};
