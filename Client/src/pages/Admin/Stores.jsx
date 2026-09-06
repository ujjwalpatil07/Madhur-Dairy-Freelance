import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import { getAllStores } from "../../services/storeServices";
import { SidebarContext } from "../../context/SidebarProvider";
import { filterStoresByInput } from "../../utils/filterStores";
import { useSnackbar } from 'notistack';

export default function Stores() {
    const { enqueueSnackbar } = useSnackbar();

    const { navbarInput } = useContext(SidebarContext);
    const [debouncedInput] = useDebounce(navbarInput, 300);

    const [totalStores, setTotalStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleGetAllStores = async () => {
            try {
                const data = await getAllStores();
                if (data?.success) {
                    setTotalStores(data.stores);
                }
            } catch (error) {
                enqueueSnackbar(error?.response?.data?.message || "Error occured while fetching all stores", { variant: "error" });
            } finally {
                setLoading(false);
            }
        }

        handleGetAllStores();
    }, [enqueueSnackbar]);

    const filteredStores = filterStoresByInput(totalStores, debouncedInput);

    const companyName = "Madhur Dairy & Daily Needs";
    const address = "Shed no. A-31, Datri Mala, Ambad, MIDC Ambad, Nashik, Maharashtra 422010";
    const appLink = "https://madhur-dairy-and-daily-needs.vercel.app";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-600 dark:text-white gap-3">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
                <span className="">Loading Stores...</span>
            </div>
        )
    }

    return (
        <div className="p-3">
            <div className="bg-white dark:bg-gray-500/20 rounded-lg p-3">
                <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">All Stores</h2>

                <div className="space-y-6">
                    {
                        filteredStores?.length > 0 ? (
                            filteredStores.map((store) => (
                                <div
                                    key={store._id}
                                    className="md:flex items-start bg-white dark:bg-gray-500/10 rounded-lg shadow-lg overflow-hidden"
                                >
                                    {
                                        (store?.photo) ? (<img
                                            src={store.photo}
                                            alt={store.shopName}
                                            loading="lazy"
                                            className="h-40 w-full md:h-70 md:w-60 object-cover"
                                        />) : (
                                            <div className="h-40 w-full md:h-70 md:w-60 bg-gray-500/10 flex items-center justify-center">
                                                <EmojiFoodBeverageIcon className="text-gray-400 dark:text-gray-300 text-5xl" />
                                            </div>
                                        )
                                    }


                                    <div className="flex-1 flex flex-col justify-between md:h-70 space-y-1 text-gray-800 dark:text-white p-3 md:p-4">
                                        <h3 className="text-lg sm:text-xl font-semibold">{store.shopName || "Unnamed Store"}</h3>
                                        <p className="text-sm text-gray-400 dark:text-gray-300 md:line-clamp-2">
                                            <span className="font-medium">Address:</span>{" "}
                                            {store.address?.streetAddress}, {store.address?.city} - {store.address?.pincode}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-400 dark:text-gray-300">Owner:</span> {store.firstName} {store.lastName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-400 dark:text-gray-300">Email:</span> {store.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-400 dark:text-gray-300">Mobile:</span> {store.mobileNo}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-400 dark:text-gray-300">Gender:</span> {store.gender}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-400 dark:text-gray-300">Total Orders:</span> {store.orders?.length || 0}
                                        </p>

                                        <div className="flex items-end justify-between gap-3">
                                            <Link
                                                to={`/admin/customers/${store?._id}/orders-history`}
                                                className="flex items-center gap-1 text-sm bg-[#843E71] text-white px-3 py-1.5 rounded-md shadow hover:bg-[#6c2f5c] transition"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                                View Orders
                                            </Link>

                                            <a
                                                href={`https://wa.me/91${store?.mobileNo}?text=${encodeURIComponent(
                                                    `Hello, I'm contacting you via *${companyName}*.\nAddress: ${address}\nApp: ${appLink}\nMessage: `
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
                                                title="Message on WhatsApp"
                                            >
                                                <WhatsAppIcon fontSize="small" />
                                                <span className="hidden sm:flex">Message on WhatsApp</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-300 text-lg">
                                {navbarInput?.trim()
                                    ? <>No stores found matching <span className="font-semibold">"{navbarInput}"</span>.</>
                                    : "No stores available."}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}