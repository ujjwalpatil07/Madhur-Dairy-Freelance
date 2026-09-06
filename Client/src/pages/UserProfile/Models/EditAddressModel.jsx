import React from "react";
import PropTypes from "prop-types";
import {
  User, Phone, Building2, Mail,
  X, MapPin, Locate, Check, Pen
} from "lucide-react";

export default function EditAddressModel({ selectedAddress, editAddress, setEditModal, setSelectedAddress, loading }) {
  return (
    <div className="bg-white/70 dark:bg-black/30 backdrop-blur-sm">
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-sm px-2 py-2 flex justify-between items-center mb-2">
        <h2 className="text-xl sm:text-2xl flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-100">
          <Pen /> Edit Address
        </h2>
        <button className="text-white hover:text-gray-300" onClick={() => setEditModal(false)}>
          <X fontSize="small" />
        </button>
      </div>

      <form onSubmit={editAddress} className="grid gap-3 text-sm sm:text-base p-3">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded text-black dark:text-white">
          <User className="w-5 h-5" />
          <input
            type="text"
            defaultValue={selectedAddress.name}
            placeholder="Full Name"
            className="flex-1 bg-transparent outline-none"
            onChange={(e) => setSelectedAddress({ ...selectedAddress, name: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded text-black dark:text-white">
          <Phone className="w-5 h-5" />
          <input
            type="text"
            defaultValue={selectedAddress.phone}
            placeholder="Phone Number"
            className="flex-1 bg-transparent outline-none"
            onChange={(e) => setSelectedAddress({ ...selectedAddress, phone: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded text-black dark:text-white">
          <MapPin className="w-5 h-5" />
          <input
            type="text"
            defaultValue={selectedAddress.streetAddress}
            placeholder="Street Address"
            className="flex-1 bg-transparent outline-none"
            onChange={(e) => setSelectedAddress({ ...selectedAddress, streetAddress: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded text-black dark:text-white">
            <Building2 className="w-5 h-5" />
            <input
              type="text"
              defaultValue={selectedAddress.city}
              placeholder="City"
              className="flex-1 bg-transparent outline-none"
              onChange={(e) => setSelectedAddress({ ...selectedAddress, city: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded text-black dark:text-white">
            <Locate className="w-5 h-5" />
            <input
              type="text"
              defaultValue={selectedAddress.state}
              placeholder="State"
              className="flex-1 bg-transparent outline-none"
              onChange={(e) => setSelectedAddress({ ...selectedAddress, state: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 bg-gray-100 dark:bg-gray-500/20 p-2 rounded text-black dark:text-white">
            <Mail className="w-5 h-5" />
            <input
              type="text"
              defaultValue={selectedAddress.pincode}
              placeholder="Pincode"
              className="flex-1 bg-transparent outline-none"
              onChange={(e) => setSelectedAddress({ ...selectedAddress, pincode: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <button
            type="button"
            onClick={() => setEditModal(false)}
            className="flex justify-center items-center py-2 gap-1 border border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-white transition-all duration-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            className="flex justify-center items-center py-2 gap-1 border border-green-600 text-green-600 font-semibold rounded hover:bg-green-600/10 hover:text-green-600 dark:hover:text-white transition-all duration-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {
              loading ? "Updating..." : <><Check size={18} /> Update</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

EditAddressModel.propTypes = {
  selectedAddress: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    streetAddress: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    addressType: PropTypes.string,
  }).isRequired,
  setEditModal: PropTypes.func.isRequired,
  editAddress: PropTypes.func.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
