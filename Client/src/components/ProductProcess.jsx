
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

const productWorkflow = [
    {
        icon: <LocalDrinkIcon sx={{ fontSize: 50 }} />,
        title: "Milking Twice a Day",
        description:
            "We source milk from farmers on the outskirts of your city for complete freshness and purity.",
    },
    {
        icon: <ScienceOutlinedIcon sx={{ fontSize: 50 }} />,
        title: "100+ Tests Everyday",
        description:
            "We quality test all milk for adulteration every single day to ensure purity.",
    },
    {
        icon: <ThermostatAutoIcon sx={{ fontSize: 50 }} />,
        title: "Pasteurization & Packing at 4°C",
        description:
            "Maintaining milk at 4°C improves its shelf life and prevents harmful bacteria growth.",
    },
    {
        icon: <DeliveryDiningIcon sx={{ fontSize: 50 }} />,
        title: "Assured 7 AM Doorstep Delivery",
        description:
            "Fresh milk & best quality groceries delivered to your doorstep every morning.",
    },
];

export default function ProductProcess() {
    return (
        <section
            className="mb-10 px-3"
        >
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-6xl mx-auto bg-white dark:bg-gray-700/20 transition-colors duration-500 py-16 p-6 rounded-2xl"
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center mb-5"
                >
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Bringing Natural & Freshness Back to Your Kitchen
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                        Better everyday health begins with the basics. We ensure everything in
                        your kitchen is thoroughly tested for purity and freshness.
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.15,
                            },
                        },
                    }}
                >
                    {productWorkflow.map(({ icon, title, description }, i) => (
                        <motion.div
                            key={i * 0.9}
                            className="flex flex-col items-center text-center p-3"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            <div className="text-gray-600 dark:text-white mb-4">{icon}</div>
                            <h3 className="text-[1.1rem] font-semibold text-gray-900 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">{description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
