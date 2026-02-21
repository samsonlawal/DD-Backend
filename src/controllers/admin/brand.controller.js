const Brand = require("../../models/Brand");

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().select("name status description createdAt _id");

    const formattedBrands = brands.map((brand) => ({
      id: brand._id,
      name: brand.name,
      description: brand.description,
      status: brand.status,
      createdAt: brand.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: brands.length,
      data: formattedBrands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch brands",
    });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).select(
      "name status description createdAt _id",
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch brand",
    });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: brand._id,
        name: brand.name,
        description: brand.description,
        status: brand.status,
        createdAt: brand.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deactivateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true },
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deactivated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate brand",
    });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete brand",
    });
  }
};
