import { useContext, useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
    Menu,
    MenuItem,
    IconButton,
    Drawer,
    Avatar,
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ProductContext } from "../../context/ProductProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import ProductList from "./ProductList";
import { UserAuthContext } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartProvider";
import company from "../../data/company.json";

export default function SearchProducts({ query, handleInputChange }) {

    const navigate = useNavigate();

    const { authUser, setOpenLoginDialog } = useContext(UserAuthContext);
    const { filter, setFilter, showHeaderExtras } = useContext(ProductContext);
    const { theme } = useContext(ThemeContext);
    const { cartItems } = useContext(CartContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = (value) => {
        if (value) setFilter(value);
        setAnchorEl(null);
    };

    const handleCart = () => {
        if (!authUser) {
            setOpenLoginDialog(true);
            return;
        }

        navigate("/cart");
    }

    const displayLogo = (theme === "light" ? company?.logoLightTheme : company?.logoDaraTheme);
    const navbarClass1 = "sticky top-0 left-0 z-60 w-full px-2 bg-white dark:bg-[#1d1d1d] transition-colors duration-300";

    return (
        <>
            <motion.div
                className={`${showHeaderExtras ? navbarClass1 : "mt-2 px-3 lg:px-8 z-100"}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >

                <div className={`${!showHeaderExtras && "bg-white dark:bg-gray-500/20 shadow-sm rounded-md"} px-2 py-2 text-gray-800 dark:text-white flex justify-between items-center gap-2 transition-colors duration-300`}>

                    <div className={`flex items-center space-x-2 ${!showHeaderExtras && "md:hidden"}`}>
                        <button onClick={() => setIsSidebarOpen(true)} className="flex md:hidden p-[5px] hover:bg-gray-500/10 border border-gray-500/50 rounded-md cursor-pointer">
                            <KeyboardArrowRightIcon className="text-gray-700 dark:text-white" />
                        </button>

                        {
                            (showHeaderExtras) && <Link to="/" className="hidden sm:flex">
                                <img
                                    src={displayLogo}
                                    alt="logo"
                                    loading='lazy'
                                    className="h-10 sm:h-12 object-cover rounded-md"
                                />
                            </Link>
                        }
                    </div>

                    <div className={`${showHeaderExtras && "justify-center py-1"} flex flex-1 items-center space-x-2`}>
                        <div className={`relative flex-1 ${showHeaderExtras && "max-w-150"}`}>
                            <input
                                type="text"
                                value={query || ""}
                                onChange={handleInputChange}
                                placeholder="Search products..."
                                className={`w-full pl-4 pr-10 py-1.5 rounded-md bg-gray-100 dark:bg-[#1f1f1f] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none transition-colors duration-300 ${showHeaderExtras && "!bg-gray-500/10"}`}
                            />
                            <SearchIcon
                                sx={{ fontSize: "1.2rem" }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                            />
                        </div>

                        <div className="flex items-center w-fit border border-gray-500/50 rounded-md">
                            <IconButton
                                onClick={handleClick}
                                className="p-1.5"
                            >
                                <FilterListIcon className="text-gray-700 dark:text-white" sx={{ fontSize: "1.3rem" }} />
                            </IconButton>
                            <span className="ml-2 text-sm pe-2 hidden md:flex whitespace-nowrap">{filter}</span>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => handleClose(null)}
                                className="mt-4"
                            >
                                {["Clear", "Most Reviews", "Most Likes", "Sort by: Rating", "Price: Low to High", "Price: High to Low"].map((option) => (
                                    <MenuItem
                                        key={option}
                                        onClick={() => handleClose(option === "Clear" ? "Sort By" : option)}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    </div>

                    {showHeaderExtras && <div className="flex items-center space-x-2">
                        { authUser && <button onClick={handleCart} className="rounded-lg px-2 py-1 bg-[#FDE12D] flex items-center shadow-md">
                            <ShoppingCartIcon className="text-gray-700 mt-1" sx={{ fontSize: "1.2rem" }} />
                            <span className='ps-1 font-semibold text-lg text-gray-700'>{cartItems?.length || 0}</span>
                        </button> }
                        {authUser ? (
                            <Link to={`/user-profile`} className="p-0">
                                <Avatar alt={authUser?.firstName} src={authUser?.photo} />
                            </Link>
                        ) : (
                            <button
                                onClick={() => setOpenLoginDialog(true)}
                                className="text-white bg-[#843E71] px-3 py-[0.4rem] rounded-sm"
                            >
                                Login
                            </button>
                        )}
                    </div>}
                </div>
            </motion.div>

            <Drawer open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} >
                <div className="w-60 p-4 bg-white dark:bg-black/90 h-full overflow-auto transition-colors duration-500" >
                    <ProductList />
                </div>
            </Drawer>
        </>
    )
}

SearchProducts.propTypes = {
    query: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
};
