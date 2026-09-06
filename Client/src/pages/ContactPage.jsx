import React, { useState } from "react";
import { LocationOn, Phone, Email } from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import company from "../data/company.json";

export default function ContactPage() {

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        message: "",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        const { fullName, phone, email, message } = formData;
        if (!fullName.trim()) {
            enqueueSnackbar("Please enter your full name.", { variant: "error" });
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            enqueueSnackbar("Please enter a valid 10-digit mobile number.", { variant: "error" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            enqueueSnackbar("Please enter a valid email address.", { variant: "error" });
            return;
        }

        if (!message.trim()) {
            enqueueSnackbar("Please enter your message.", { variant: "error" });
            return;
        }

        const whatsappMessage = `Hello! I'm ${fullName},\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/919209143657?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 my-10 p-3 max-w-5xl mx-auto">

            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2 space-y-4 p-3"
            >
                <h2 className="text-2xl font-bold text-[#843E71]">Contact Information</h2>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <LocationOn className="text-[#843E71]" sx={{ fontSize: "1.3rem" }} />
                    <a
                        href={company.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        {company.address.line}, {company.address.city}, {company.address.state} - {company.address.pincode}
                    </a>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Phone className="text-[#843E71]" sx={{ fontSize: "1.3rem" }} />
                    <a href={`tel:${company.phone}`} className="hover:underline">
                        {company.phone}
                    </a>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Email className="text-[#843E71]" sx={{ fontSize: "1.3rem" }} />
                    <a href={`mailto:${company.email}`} className="hover:underline">
                        {company.email}
                    </a>
                </div>

                <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                    {company.supportText}
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:w-1/2 space-y-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-[#843E71]">Send a Message</h2>

                <div>
                    <label htmlFor="fullName" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#843E71] dark:bg-gray-500/20 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Mobile Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter your mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#843E71] dark:bg-gray-500/20 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#843E71] dark:bg-gray-500/20 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Enter your message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#843E71] dark:bg-gray-500/20 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#843E71] text-white rounded hover:bg-[#74285e] transition"
                >
                    Send via WhatsApp
                </button>
            </motion.form>
        </div>
    );
}
