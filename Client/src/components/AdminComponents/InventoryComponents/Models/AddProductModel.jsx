import {
  Dialog,
  DialogActions
} from "@mui/material";
import { Image, Tag, Archive, Package, AlertCircle, FlaskConical, X, Percent, LifeBuoy, Hourglass } from "lucide-react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import { useEffect, useState } from "react";
import { socket } from "../../../../socket/socket";
import { convertToBase64 } from "../../../../utils/InventoryHelpers/imageBase64Converter";
import NutritionInput from "../NutritionalInfo";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";


const categories = [
  "Milk",
  "Curd (Dahi)",
  "Paneer",
  "Butter",
  "Ghee (Clarified Butter)",
  "Cheese",
  "Cream",
  "Buttermilk (Chaas)",
  "Lassi",
  "Flavored Milk",
  "Milk Powder",
  "Condensed Milk",
  "Khoa / Mawa",
  "Yogurt",
  "Ice Cream",
  "Shrikhand",
  "Whey Protein",
  "Dairy-Based Sweets",
];

const quantityUnits = ["Litre", "Ml", "Kg", "Gram", "Pack"];


export default function AddProductModel({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    shelfLife: 0,
    quantityUnit: "",
    stock: 0,
    thresholdVal: 0,
    price: 0,
    manufacturingCost: 0,
    nutrition: {},
    discount: 0
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProductDetails((prev) => ({
        ...prev,
        image: URL.createObjectURL(file)
      }
      ));
    }
  };

  const validateInputs = () => {
    const { name, category, price, stock, quantityUnit, thresholdVal, shelfLife, nutrition, discount, description } = productDetails;
    if (!name || !category || !price || !stock || !quantityUnit || !thresholdVal || !selectedFile || !shelfLife || !nutrition || !discount || !description) {
      enqueueSnackbar("Please fill all fields and select an image.");
      return false;
    }
    if (isNaN(price) || isNaN(stock) || isNaN(thresholdVal) || isNaN(discount) || isNaN(shelfLife)) {
      enqueueSnackbar("Price, Stock, Discount, Shelflife and Threshold should be numbers.", { variant: "info" });
      return false;
    }
    return true;
  };


  useEffect(() => {
    socket.on("add-new-product:failed", (data) => {
      enqueueSnackbar(data?.message, { variant: "error" });
      setIsAdding(false);
    })

    socket.on("added-new-product:to-inventory", (data) => {
      enqueueSnackbar(data?.message, { variant: "success" });
      onClose(false);
      setIsAdding(false)
    })

    return () => {
      socket.off("add-new-product:failed")
      socket.off("added-new-product:to-inventory")
    }
  }, [enqueueSnackbar, onClose])

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;


    setIsAdding(true)
    const base64Image = await convertToBase64(selectedFile);

    const productData = {
      image: base64Image,
      productDetails,
    };

    socket.emit("add-new-product", productData);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        ...{
          paper: {
            className: "!relative !bg-white dark:!bg-gray-500/20 !rounded !shadow-xl !w-full !max-w-2xl !scrollbar-hide"
          },
          backdrop: {
            className: "!bg-black/40 !backdrop-blur-sm"
          }
        }
      }}
    >

      {/* Sticky Title */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-500/20 px-6 pt-6 pb-4 rounded">

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          🧾 Add New Product
        </h2>
        <button
          onClick={() => onClose(false)}
          className="absolute top-3 right-5 text-xl"
        >
          <X className="text-black dark:text-gray-100 "/>
        </button>
      </div>


      <div className="overflow-y-auto scrollbar-hide px-6  flex-1 bg-white dark:bg-gray-500/20 p-6 sm:p-8 shadow-xl w-full max-w-4xl space-y-4 ">
        <form onSubmit={handleAddProduct} className="space-y-6 text-sm sm:text-base ">
          {/* Image upload */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={productDetails?.image || "https://img.freepik.com/free-vector/dairy-products-poster_1284-18867.jpg?semt=ais_hybrid&w=740"}
              alt="Product Preview"
              className={`${isAdding ? "cursor-not-allowed" : null} w-24 h-24 rounded-xl object-cover border opacity-50`}
            />
            <label htmlFor="photoInput" className="absolute bottom-0 right-0 bg-white border p-1 rounded-full cursor-pointer">
              <Image className="w-5 h-5 text-blue-600" />
            </label>
            <input
              type="file"
              accept="image/*"
              id="photoInput"
              name="image"
              className="hidden"

              onChange={handlePhotoChange}
            />
          </div>

          {/* Product Name and Category */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-full md:w-1/2 ">
              <InputWithLabel
                label="Product Name"
                name="name"
                placeholder="Ex: Milk"
                icon={<Tag className="text-gray-500" />}
                onChange={handleInputChange}

              />
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <label
                htmlFor="category"
                className="text-sm text-gray-200/90  font-medium"
              >
                Category
              </label>

              <div className="relative mt-1">
                {/* Icon inside the select field */}
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500  pointer-events-none" />

                <select
                  id="category"
                  name="category"
                  onChange={handleInputChange}
                  defaultValue=""
                  className={`pl-10 pr-3 py-2.5 w-full rounded-lg border border-gray-600 dark:border-gray-600 
        bg-gray-50 dark:bg-gray-500/30 text-gray-700 dark:text-white 
        focus:outline-none focus:ring-1 focus:ring-gray-500 scrollbar-hide ${isAdding ? "cursor-not-allowed" : ""
                    }`}
                >
                  <option value="" className="!text-gray-500" disabled hidden>
                    Select a category
                  </option>
                  {categories.map((cat, index) => (
                    <option
                      key={index}
                      value={cat}
                      className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Description
            </label>
            <div className="flex items-start gap-2 border rounded-md p-2 bg-gray-50 dark:bg-gray-500/30 dark:border-gray-600">
              <DescriptionIcon className="text-gray-500" />
              <textarea
                type="text"
                id="description"
                name="description"
                rows={5}
                cols={40}
                placeholder="Enter something product"
                className={`${isAdding ? " cursor-not-allowed" : null} flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white`}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Nutrition Input  */}
          <NutritionInput
            onChange={(nutritionData) =>
              setProductDetails((prev) => ({
                ...prev,
                nutrition: nutritionData,
              }))
            }
          />

          <InputWithLabel
            label="Manufacturing Cost for admin"
            name="manufacturingCost"
            placeholder="Ex. 20Rs"
            icon={<CurrencyRupeeIcon className="text-gray-500" />}
            onChange={handleInputChange}
          />

          {/* Product"s Shelflife and Selling Price */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-full md:w-1/2">
              <InputWithLabel
                label="Product's Shelflife"
                name="shelfLife"
                placeholder="Ex: 4 Days"
                icon={<Hourglass className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <InputWithLabel
                label="Selling Price (₹)"
                name="price"
                placeholder="Ex: 50"
                icon={<CurrencyRupeeIcon className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Stock and Quantity Unit */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 ">
            <div className="w-full md:w-1/2">
              <InputWithLabel
                label="Stock"
                name="stock"
                placeholder="Ex: 100"
                isAdding={isAdding}
                icon={<Archive className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex flex-col gap-1 relative">
                <label
                  htmlFor="quantityUnit"
                  className="text-sm text-gray-700 dark:text-white font-medium"
                >
                  Quantity Unit
                </label>

                <div className="relative">
                  {/* Icon inside the select field */}
                  <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500  pointer-events-none" />

                  <select
                    id="quantityUnit"
                    name="quantityUnit"
                    onChange={handleInputChange}
                    defaultValue=""
                    className={`pl-10 pr-3 py-2 w-full rounded-lg border border-gray-600 dark:border-gray-600 
                    bg-gray-50 dark:bg-gray-500/30 text-gray-700 dark:text-white 
                    focus:outline-none focus:ring-1 focus:ring-gray-500 ${isAdding ? "cursor-not-allowed" : ""
                      }`}
                  >
                    <option value="" className="!text-gray-500" disabled hidden>
                      Select unit
                    </option>

                    {quantityUnits.map((unit, index) => (
                      <option
                        key={index}
                        value={unit}
                        className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                      >
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Threshold Value and Discount */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-full md:w-1/2">
              <InputWithLabel
                label="Threshold Value"
                name="thresholdVal"
                placeholder="Ex: 10"
                icon={<AlertCircle className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <InputWithLabel
                label="Discount (%)"
                name="discount"
                placeholder="Ex: 10%"
                icon={<Percent className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>


      <DialogActions className="sticky bottom-0 z-10 bg-white dark:bg-gray-500/20 !px-4 !py-5 rounded">
        <button
          onClick={onClose}
          disabled={isAdding}
          className="bg-gray-200 text-black dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white px-3 py-1 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button onClick={handleAddProduct} disabled={isAdding}
          className="bg-blue-500 dark:bg-orange-600/30 dark:hover:bg-orange-600/40 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          {isAdding ? "Adding..." : "Add Product"}
        </button>
      </DialogActions>
    </Dialog>
  );
}

function InputWithLabel({ label, name, placeholder, icon, onChange, isAdding }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded- p-2 bg-gray-50 dark:bg-gray-500/30 dark:border-gray-600">
        {icon}
        <input
          type="text"
          name={name}md
          placeholder={placeholder}
          className={`${isAdding ? " cursor-not-allowed" : null} flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white`}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

InputWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  isAdding: PropTypes.bool
};
