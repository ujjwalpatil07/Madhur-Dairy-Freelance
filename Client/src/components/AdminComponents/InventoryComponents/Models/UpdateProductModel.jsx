import {
  Dialog,
  DialogActions
} from "@mui/material";
import { useState, useEffect } from "react";
import { Image, Tag, Archive, Package, AlertCircle, FlaskConical, X } from "lucide-react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import NutritionInput from "../NutritionalInfo";
import PropTypes from "prop-types";
import { useSnackbar } from 'notistack';
import { convertToBase64 } from "../../../../utils/InventoryHelpers/imageBase64Converter";
import { socket } from "../../../../socket/socket";

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
  "Dairy-Based Sweets (e.g., Rasgulla, Gulab Jamun, Kalakand)",
];

const quantityUnits = ["Litre", "Ml", "Kg", "Gram", "Pack"];

export default function UpdateProductModel({ open, onClose, selectedProduct }) {

  const { enqueueSnackbar } = useSnackbar();

  const [productDetails, setProductDetails] = useState({
    _id: selectedProduct._id,
    name: "",
    category: "",
    description: "",
    image: "",
    shelfLife: 0,
    quantityUnit: "",
    stock: 0,
    thresholdVal: 0,
    price: 0,
    nutrition: {},
    discount: 0
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    typeof productDetails?.image === "string"
      ? productDetails.image
      : productDetails?.image?.[0]?.url || ""
  );

  useEffect(() => {
    if (selectedProduct) {
      setProductDetails({
        _id: selectedProduct?._id,
        name: selectedProduct?.name || "",
        category: selectedProduct?.category || "",
        description: selectedProduct?.description || "",
        image: selectedProduct?.image?.[0] || "",
        shelfLife: selectedProduct?.shelfLife || 0,
        quantityUnit: selectedProduct?.quantityUnit || "",
        manufacturingCost: selectedProduct?.manufacturingCost || 0,
        stock: selectedProduct?.stock || 0,
        thresholdVal: selectedProduct?.thresholdVal || 0,
        price: selectedProduct?.price || 0,
        nutrition: selectedProduct?.nutrition || {},
        discount: selectedProduct?.discount || 0,
      });
    }
  }, [selectedProduct]);


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
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);

      setProductDetails((prev) => ({
        ...prev,
        image: imageURL, // keep file for backend
      }));

      setSelectedFile(file);
    }
  };


  const validateInputs = () => {
    const { name, category, price, image, stock, quantityUnit, thresholdVal, shelfLife, discount, description, nutrition } = productDetails;
    if (!name || !category || !price || !image || !stock || !quantityUnit || !thresholdVal || !shelfLife || !nutrition || !discount || !description) {
      enqueueSnackbar("Please fill all fields and select an image.", { variant: "error" });
      return false;
    }
    if (isNaN(price) || isNaN(stock) || isNaN(thresholdVal) || isNaN(discount) || isNaN(shelfLife)) {
      enqueueSnackbar("Price, Stock, Discount, Shelflife and Threshold should be numbers.", { variant: "error" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    socket.on("update-product:failed", (data) => {
      enqueueSnackbar(data?.message, { varient: "error" })
      setIsUpdating(false)
    })

    socket.on("update-product:updated", (data) => {
      enqueueSnackbar(data?.message, { varient: "success" });
      setIsUpdating(false);
      onClose();
    })

    return () => {
      socket.off("update-product:failed")
      socket.off("update-product:updated")
    }
  }, [onClose, enqueueSnackbar])

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsUpdating(true)
    if (!validateInputs()) return;

    let updatedProductData;
    if (!selectedFile) {
      updatedProductData = productDetails
      socket.emit("update-product", updatedProductData);
      return;
    }

    const base64Image = await convertToBase64(selectedFile);

    updatedProductData = {
      ...productDetails,
      image: base64Image
    };

    socket.emit("update-product", updatedProductData);

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

      <div className="sticky top-0 z-10 bg-white dark:bg-gray-500/20 px-6 pt-6 pb-4 rounded">

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          🧾 Update the Product
        </h2>
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-3 right-5 text-xl"
        ><X className="text-black dark:text-gray-100" /></button>
      </div>

      <div className="overflow-y-auto scrollbar-hide px-6  flex-1 bg-white dark:bg-gray-500/20 p-6 sm:p-8 shadow-xl w-full max-w-4xl space-y-4 ">

        <form onSubmit={handleUpdateProduct} className="space-y-6 text-sm sm:text-base">
          {/* Image upload */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={
                previewImage ||
                (typeof productDetails.image === "string"
                  ? productDetails.image
                  : productDetails.image?.url) || // if stored as { url: '...' }
                "https://img.freepik.com/free-vector/dairy-products-poster_1284-18867.jpg?semt=ais_hybrid&w=740"
              }
              alt="Product Preview"
              className={`w-24 h-24 rounded-xl object-cover border ${isUpdating ? "cursor-not-allowed opacity-50" : ""
                }`}
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
            <div className="w-full md:w-1/2">
              <InputWithLabel
                value={productDetails?.name}
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
                className="text-sm text-gray-700 dark:text-white font-medium flex items-center gap-2"
              >
                <Package className="text-gray-500 text-sm" />
                Category
              </label>
              <select
                id="category"
                name="category"
                value={productDetails?.category}
                onChange={handleInputChange}
                defaultValue=""

                className={`${isUpdating ? "cursor-not-allowed" : null} p-3 rounded-lg border border-gray-600 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-500/30 text-gray-700 dark:text-white 
              focus:outline-none focus:ring-1 focus:ring-gray-500`}            >
                <option value="" disabled hidden>
                  Select a category
                </option>
                {categories.map((cat, index) => (
                  <option key={index * 0.9} value={cat} className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
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
                name="description"
                value={productDetails?.description}
                rows={5}
                cols={40}
                placeholder="Enter something product"
                className={`${isUpdating ? " cursor-not-allowed" : null} flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white`}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Nutrition Input  */}
          <NutritionInput
            value={productDetails?.nutrition}
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
            value={productDetails?.manufacturingCost}
            placeholder="Ex. 20Rs"
            icon={<CurrencyRupeeIcon className="text-gray-500" />}
            onChange={handleInputChange}
          />

          {/* Product"s Shelflife and Selling Price */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-full md:w-1/2">
              <InputWithLabel
                value={productDetails?.shelfLife}
                label="Product's Shelflife"
                name="shelfLife"
                placeholder="Ex: 4 Days"
                icon={<CurrencyRupeeIcon className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <InputWithLabel
                value={productDetails?.price}
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
                value={productDetails?.stock}
                label="Stock"
                name="stock"
                placeholder="Ex: 100"
                isUpdating={isUpdating}
                icon={<Archive className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quantityUnit"
                  className="text-sm text-gray-700 dark:text-white font-medium flex items-center gap-2"
                >
                  <FlaskConical className="text-gray-500 !text-sm" />
                  Quantity Unit
                </label>
                <select
                  id="quantityUnit"
                  name="quantityUnit"
                  value={productDetails?.quantityUnit}
                  onChange={handleInputChange}
                  defaultValue=""

                  className={`${isUpdating ? "cursor-not-allowed" : null} p-3 rounded-lg border border-gray-600 dark:border-gray-600 
                 bg-gray-50 dark:bg-gray-500/30 text-gray-700 dark:text-white 
                 focus:outline-none focus:ring-1 focus:ring-gray-500`}
                >
                  <option value="" disabled hidden>
                    Select unit
                  </option>

                  {quantityUnits.map((unit, index) => (
                    <option
                      key={index * 0.9}
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

          {/* Threshold Value and Discount */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-full md:w-1/2">
              <InputWithLabel
                value={productDetails?.thresholdVal}
                label="Threshold Value"
                name="thresholdVal"
                placeholder="Ex: 10"
                icon={<AlertCircle className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <InputWithLabel
                value={productDetails?.discount}
                label="Discount (%)"
                name="discount"
                placeholder="Ex: 10%"
                icon={<CurrencyRupeeIcon className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>

      <DialogActions className="sticky bottom-0 z-10 bg-white dark:bg-gray-500/20 !px-7 !py-5 rounded">
        <button
          onClick={onClose}
          disabled={isUpdating}
          className=" bg-gray-200 text-black dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white px-3 py-1 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button onClick={handleUpdateProduct} disabled={isUpdating}
          className=" bg-green-200 text-black dark:bg-blue-800/60 dark:hover:bg-blue-800/70 dark:text-white px-3 py-1 rounded hover:bg-green-300/80"
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </DialogActions>

    </Dialog >
  );
}

function InputWithLabel({ label, name, placeholder, icon, onChange, isUpdating, value }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50 dark:bg-gray-500/30 dark:border-gray-600">
        {icon}
        <input
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          className={`${isUpdating ? " cursor-not-allowed" : null} flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white`}
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
  isUpdating: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

UpdateProductModel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object.isRequired,
};