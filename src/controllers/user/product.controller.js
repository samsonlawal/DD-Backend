const Product = require("../../models/Product");
const { formatProduct, formatProducts } = require("../../utils/productFormatter");

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { category, brand, subCategory, minPrice, maxPrice, tags } = req.query;
    const filter = { status: "active" };

    if (category && category !== "") filter.category = category;
    if (brand && brand !== "") filter.brand = brand;
    if (subCategory && subCategory !== "") filter.subCategory = subCategory;

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

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select("name basePrice costPrice images status badge tags")
        .sort({ status: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .maxTimeMS(5000),
      Product.countDocuments(filter).maxTimeMS(5000),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: formatProducts(products),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
      tags: "best seller", // Using direct string match for efficiency with index
    })
      .select("name basePrice costPrice images status badge tags")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .maxTimeMS(3000);

    res.status(200).json({
      success: true,
      count: products.length,
      data: formatProducts(products),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch best sellers",
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("name brand category subCategory description basePrice costPrice images specifications availableQuantity lowStockThreshold badge tags shippingWeight dimensions status")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};
