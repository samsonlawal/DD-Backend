const Product = require("../../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { category, brand, subCategory, minPrice, maxPrice, tags } = req.query;
    const filter = { status: "active" };

    if (category && category !== "") filter.category = { $regex: category, $options: "i" };
    if (brand && brand !== "") filter.brand = { $regex: brand, $options: "i" };
    if (subCategory && subCategory !== "") filter.subCategory = { $regex: subCategory, $options: "i" };

    // Price Filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {};
      if (minPrice !== undefined) filter.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.basePrice.$lte = parseFloat(maxPrice);
    }

    // Tag Filtering (expects comma-separated string or single string)
    if (tags && tags !== "") {
      const tagArray = tags.split(",").map(t => t.trim());
      filter.tags = { $in: tagArray };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};
