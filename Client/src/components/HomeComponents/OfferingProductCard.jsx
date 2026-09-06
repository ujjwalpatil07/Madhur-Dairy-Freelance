import PropTypes from "prop-types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function OfferingProductCard({ image, title }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-white dark:bg-gray-800 shadow-md rounded-2xl group transition duration-300 mb-5 md:mb-10"
        >
            <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-64 object-cover rounded-xl"
            />

            <div className="absolute rounded-xl inset-0 bg-black/20 bg-opacity-30 flex items-end justify-center">
                <h3 className="text-3xl font-bold text-white p-10">{title}</h3>
            </div>

            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                <Link
                    to={`/products/${slugify(title)}`}
                    className="bg-[#843E71] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition shadow-2xl"
                >
                    View All <ArrowForwardIcon fontSize="small" />
                </Link>
            </div>
        </motion.div>
    );
}

OfferingProductCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};
