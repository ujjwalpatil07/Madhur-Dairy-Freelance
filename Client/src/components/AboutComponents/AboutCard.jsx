import React from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function AboutCard({ title, description, image, reverse }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row items-center gap-8 my-20 ${reverse ? "md:flex-row-reverse" : ""
                }`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full md:w-1/2 px-3"
            >
                <img
                    src={image}
                    alt={title}
                    className="rounded-lg w-full h-full object-cover"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full md:w-1/2 px-4"
            >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-base leading-relaxed">
                    {description}
                </p>
            </motion.div>
        </motion.div>
    );
}

AboutCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    reverse: PropTypes.bool,
};
