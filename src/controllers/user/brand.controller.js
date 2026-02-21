const Brand = require("../../models/Brand");

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ status: "active" }).select(
      "name status description createdAt _id",
    );

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
    const brand = await Brand.findOne({
      _id: req.params.id,
      status: "active",
    }).select("name status description createdAt _id");

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
