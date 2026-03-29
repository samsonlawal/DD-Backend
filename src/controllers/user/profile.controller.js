const User = require("../../models/User");
const cloudinary = require("../../config/cloudinary");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordOTP -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Prevent overwriting sensitive fields via this endpoint
    const { password, role, resetPasswordOTP, resetPasswordExpire, ...safeUpdates } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, safeUpdates, {
      new: true,
      runValidators: true,
    }).select("-password -resetPasswordOTP -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex((a) => a._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If it was default and we have other addresses, pick a new default (the first one)
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({ success: true, message: "Address deleted", data: user.addresses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { addressLine1, addressLine2, city, state, postCode, phone, country, isDefault } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If this is the first address, make it default regardless of what is passed
    const shouldBeDefault = user.addresses.length === 0 ? true : isDefault;

    if (shouldBeDefault) {
      // Unset all other defaults
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    const newAddress = {
      addressLine1,
      addressLine2,
      city,
      state,
      postCode,
      phone,
      country,
      isDefault: shouldBeDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    // Get the added address (it will be the last one)
    const addedAddress = user.addresses[user.addresses.length - 1];
    res.status(201).json({ success: true, data: addedAddress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const { addressLine1, addressLine2, city, state, postCode, phone, country, isDefault } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (isDefault === true) {
      // Unset all other defaults
      user.addresses.forEach((a) => (a.isDefault = false));
      address.isDefault = true;
    } else if (isDefault === false && address.isDefault) {
      // If we are unsetting the current default, we need a new one if possible
      address.isDefault = false;
      if (user.addresses.length > 0) {
        // Find another one to be default or just pick the first one
        const otherIndex = user.addresses.findIndex(a => a._id.toString() !== addressId);
        if (otherIndex !== -1) {
          user.addresses[otherIndex].isDefault = true;
        }
      }
    }

    // Update fields if provided
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postCode !== undefined) address.postCode = postCode;
    if (phone !== undefined) address.phone = phone;
    if (country !== undefined) address.country = country;

    await user.save();

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Upload buffer to Cloudinary via upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "discount-drinks/avatars", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: uploadResult.secure_url },
      { new: true }
    ).select("-password -resetPasswordOTP -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
