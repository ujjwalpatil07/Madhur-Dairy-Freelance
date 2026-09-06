import React from "react";
import PropTypes from "prop-types";
import {
  User, Phone, Building2, Mail,
  Home, MapPin, Locate, Plus,
  X,
} from "lucide-react";
import { maharashtraCities } from "../../../data/cities";

export default function NewAddressModel({ setNewAddressModel, addAddress, newAddress, setNewAddress, loading }) {
  return (
    <div className="bg-white/70 dark:bg-black/30 backdrop-blur-sm ">

      <div className="mb-2 bg-white/60 dark:bg-black/40 backdrop-blur-sm px-3 py-2 flex justify-between items-center">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
          <Plus className="inline mr-2 mb-1" /> Add New Address
        </h2>

        <button className="text-white hover:text-gray-300" onClick={() => setNewAddressModel(false)}>
          <X fontSize="small" />
        </button>
      </div>

      <form onSubmit={addAddress} className="space-y-4 text-sm sm:text-base py-5 px-5">
        <div>
          <label htmlFor="addressType" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Address Type</label>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
            <Home className="w-5 h-5 text-gray-500" />
            <select
              name="addressType"
              id="addressType"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white"
              value={newAddress?.addressType}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressType: e.target.value })
              }
            >
              <option value="Home" className="dark:bg-gray-500">Home</option>
              <option value="Work" className="dark:bg-gray-500">Work</option>
              <option value="Other" className="dark:bg-gray-500">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Full Name *</label>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="fullName"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white"
              placeholder="e.g. Ujjwal Patil"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Phone *</label>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
            <Phone className="w-5 h-5 text-gray-500" />
            <input
              type="tel"
              pattern="[0-9]{10}"
              id="phone"
              title="Enter a 10-digit valid phone number"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white"
              placeholder="e.g. 9876543210"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="streetAdd" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Street Address *</label>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
            <MapPin className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="streetAdd"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white"
              placeholder="e.g. Flat 101, MG Road"
              value={newAddress.streetAddress}
              onChange={(e) =>
                setNewAddress({ ...newAddress, streetAddress: e.target.value })
              }
              required
            />
          </div>
        </div>


        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">City *</label>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
              <Building2 className="w-5 h-5 text-gray-500" />

              <select
                name="city"
                required
                value={newAddress?.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }                
                className={` rounded-md w-full text-[#555] dark:text-[#ccc] transition duration-200 ease-in-out scrollbar-hide ${loading ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <option value="" className="">Select City</option>
                {maharashtraCities.map((city, idx) => (
                  <option key={idx * 0.9} value={city} className="text-black dark:text-white bg-white dark:bg-gray-500">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <label htmlFor="state" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">State *</label>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
              <Locate className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                id="state"
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white"
                placeholder="e.g. Maharashtra"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="pincode" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Pincode *</label>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded">
            <Mail className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="pincode"
              pattern="[0-9]{6}"
              title="Enter a valid 6-digit pincode"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white"
              placeholder="e.g. 400001"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="flex-1 py-2 border border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-white transition-all duration-300 disabled:cursor-not-allowed"
            onClick={() => setNewAddressModel(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-1 border border-green-600 text-green-600 font-semibold rounded hover:bg-green-600/10  hover:text-green-600 dark:hover:text-white transition-all duration-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {
              loading ? "Saving..." : "Save Address"
            }
          </button>
        </div>
      </form>
    </div>
  );
}

NewAddressModel.propTypes = {
  newAddress: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    streetAddress: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    addressType: PropTypes.string,
  }).isRequired,
  setNewAddressModel: PropTypes.func.isRequired,
  addAddress: PropTypes.func.isRequired,
  setNewAddress: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
