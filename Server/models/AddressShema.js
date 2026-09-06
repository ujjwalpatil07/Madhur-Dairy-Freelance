import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  owner : {type : mongoose.Types.ObjectId , ref : "User"},
  addressType: {
    type: String,
    required: true,
    enum: ["Home", "Work", "Other"],
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});


export default mongoose.model("Address", AddressSchema);