import { useContext, memo } from "react";
import { ThemeContext } from "../context/ThemeProvider";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import company from "../data/company.json";
import { Twitter, YouTube } from "@mui/icons-material";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function Footer() {
  const { theme } = useContext(ThemeContext);

  const currentLogo = theme === "light" ? company?.logoLightTheme : company?.logoDaraTheme;

  const socialIcons = [
    { key: "facebook", Icon: FacebookIcon, className: "hover:text-blue-600" },
    { key: "instagram", Icon: InstagramIcon, className: "hover:text-pink-500" },
    { key: "linkedin", Icon: LinkedInIcon, className: "hover:text-blue-500" },
    { key: "twitter", Icon: Twitter, className: "hover:text-blue-500" },
    { key: "youtube", Icon: YouTube, className: "hover:text-red-500" }
  ];


  return (
    <footer className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <img
              src={currentLogo}
              alt="Madhur Dairy Logo"
              className="w-32 object-contain"
              loading="lazy"
            />
            <h2 className="text-lg font-semibold">
              {company?.name}
            </h2>
            <div className="flex gap-4 text-xl">
              <div className="flex gap-4 text-xl">
                {/* eslint-disable-next-line no-unused-vars */}
                {socialIcons.map(({ key, Icon, className }) =>
                  company?.socials?.[key] ? (
                    <a
                      key={key}
                      href={company.socials[key]}
                      aria-label={key}
                      target="_blank"
                      rel="noopener noreferrer"
                    >

                      <Icon className={`${className} transition-colors`} />
                    </a>
                  ) : null
                )}
              </div>

            </div>
          </motion.div>

          {[
            {
              heading: "Our Services",
              links: [
                { label: "Dairy Products", to: "/products" },
                { label: "Subscriptions", to: "/subscriptions" },
                { label: "Home Delivery", to: "/delivery" },
              ],
            },
            {
              heading: "Support",
              links: [
                { label: "About Us", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Terms & Conditions", href: "/terms" },
              ],
            },
            {
              heading: "Contact",
              links: [
                { label: "Contact Us", href: "/contact-us" },
                { label: "Customer Support", href: "/support" },
                { label: "Feedback", href: "/feedback" },
              ],
            },
          ].map((section) => (
            <motion.div key={section.heading} variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.heading}</h3>
              <ul className="space-y-2">
                {section.links.map((link) =>
                  link.to ? (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-blue-500 transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link to={link.href} className="hover:text-blue-500 transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="mt-12 border-t pt-4 text-sm text-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          &copy; {new Date().getFullYear()} {company?.name}. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}

export default memo(Footer);
