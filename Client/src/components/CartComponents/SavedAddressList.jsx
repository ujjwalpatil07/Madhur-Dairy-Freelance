import React, { useCallback, useContext, useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import PropTypes from "prop-types";
import { addNewAddress, getSavedAddresses } from "../../services/userProfileService";
import { UserAuthContext } from "../../context/AuthProvider";
import { Close } from "@mui/icons-material";
import { useSnackbar } from 'notistack';
import NewAddressModel from "../../pages/UserProfile/Models/NewAddressModel";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function SavedAddressList({ open, handleDialogStatus }) {
  const { enqueueSnackbar } = useSnackbar();

  const { authUser, setDeliveryAddress } = useContext(UserAuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    addressType: "Home",
    name: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [newAddressModel, setNewAddressModel] = useState(false);
  const [newAddressLoading, setNewAddressLoading] = useState(false);


  const handleSelectAddress = (address) => {
    handleDialogStatus(false);
    setDeliveryAddress(address);
  };

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await getSavedAddresses(authUser?._id);
      setAddresses(data?.userAddresses || []);
    } catch (err) {
      enqueueSnackbar(err?.response?.message || "Failed to fetch addresses", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [authUser?._id, enqueueSnackbar]);

  useEffect(() => {
    if (authUser) fetchAddresses();
  }, [authUser, fetchAddresses]);

  const addAddress = async (e) => {
    e.preventDefault();
    setNewAddressLoading(true);
    try {
      const data = await addNewAddress(authUser?._id, newAddress);
      if (data?.success) {
        setNewAddress({
          addressType: "Home",
          name: "",
          phone: "",
          streetAddress: "",
          city: "",
          state: "",
          pincode: "",
        });
        setAddresses(prev => [...prev, data?.address]);
        setDeliveryAddress(data?.address);
        enqueueSnackbar("New address added successfully", { variant: "success" });
        setNewAddressModel(false);
      }
    } catch {
      enqueueSnackbar("Failed to add address", { variant: "error" });
    } finally {
      setNewAddressLoading(false);
    }
  };

  let addressContent;
  if (loading) {
    addressContent = (
      <div className="flex items-center justify-center h-[50vh] text-gray-600 dark:text-white gap-3 pb-10 pt-6">
        <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
        <span>Loading addresses...</span>
      </div>
    );
  } else if (addresses.length === 0) {
    addressContent = (
      <p className="text-gray-600 dark:text-gray-300 text-center pb-10 pt-6">No addresses found.</p>
    );
  } else {
    addressContent = (
      <div className="grid gap-4 px-3">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-gray-100 dark:bg-gray-500/20 rounded-md shadow-md p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2">
              <LocationOnIcon sx={{ fontSize: "1.2rem" }} className="text-[#843E71]" />
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {addr.addressType}
              </p>
            </div>

            <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <p><span className="font-semibold">Name:</span> {addr.name}</p>
              <p><span className="font-semibold">Phone:</span> {addr.phone}</p>
              <p>
                <span className="font-semibold">Full Address:</span>{" "}
                {`${addr.streetAddress}, ${addr.city}, ${addr.state} - ${addr.pincode}`}
              </p>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => handleSelectAddress(addr)}
                className="bg-[#843E71] text-white hover:bg-[#732d62] transition-colors px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Select Address
              </button>
            </div>
          </div>
        ))}

        <br />
      </div>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={() => handleDialogStatus(false)}
        fullWidth="Full width"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <div className=" dark:bg-black/80 !max-w-5xl">
          <div className="p-3 sticky top-0 left-0 text-gray-800 dark:text-gray-100 mb-4 flex justify-between backdrop-blur-md bg-white/70 dark:bg-black/30 z-10">
            <h2 className="text-xl font-semibold">Saved Addresses</h2>
            <button
              onClick={() => handleDialogStatus(false)}
              className="hover:bg-gray-500/20 dark:hover:bg-gray-500/50 border border-gray-500/50 dark:border-gray-500 h-7 w-7 rounded-full flex justify-center items-center"
            >
              <Close sx={{ fontSize: "1.2rem" }} />
            </button>
          </div>

          {addressContent}

          <div className="w-full flex justify-center">
            <button onClick={() => setNewAddressModel(true)} className="w-fit px-3 py-2 bg-[#843E71] text-white rounded">Add New Address</button>
          </div>

          <br />
        </div>
      </Dialog>

      <Dialog
        open={newAddressModel}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={() => setNewAddressModel(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              boxShadow: 24,
              borderRadius: 1,
            },
          },
        }}
        fullWidth="Full width"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <NewAddressModel
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          setNewAddressModel={setNewAddressModel}
          addAddress={addAddress}
          loading={newAddressLoading}
        />
      </Dialog>
    </>
  );
}

SavedAddressList.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
};
