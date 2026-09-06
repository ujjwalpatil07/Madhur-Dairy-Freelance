import mongoose, { Schema } from "mongoose";


const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique : true },
    category: {
      type: String,
      enum: [
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
      ],
    },
      
    description: { type: String },
    inInventory: {
      type : Boolean,
      default: true
    },

    image: {
      type: [String],
      validate: [(arr) => arr.length <= 3, "Maximum 3 images allowed"],
      default: [],
    },

    minQuantity: { type: Number, default: 1 },

    quantityUnit: {
      type: String,
      required: true,
      enum: ["Litre", "Ml", "Kg", "Gram", "Pack"],
    },

    stock: { type: Number, default: 0, min: 0 },
    manufacturingCost : {type: Number},
    thresholdVal : {type: Number},

    price: { type: Number, required: true, min: 0 },

    type: { type: String },
    totalQuantitySold: {type: Number},
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],

    nutrition: {
      type: Map,
      of: String,
    },

    shelfLife: { type: String },
    expiryDate : {type : Date },
    discount: {type : Number, default : 10},

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
