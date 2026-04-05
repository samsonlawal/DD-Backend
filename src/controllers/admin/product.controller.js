const Product = require("../../models/Product");
const uploadToCloudinary = require("../../utils/cloudinaryUpload");

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

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

exports.createProduct = async (req, res) => { 
  
try {
   let uploadedImages = [] 
   console.log(req.files)
  // Upload new files 
  if (req.files?.length) { uploadedImages = await Promise.all(
     req.files.map(file => uploadToCloudinary(
      file.buffer, "products"
    ) ) ) } 
  // Parse existing images (expect JSON string) 
  let existingImages = [] 
  if (req.body.existingImages) { 
    try { 
      existingImages = JSON.parse(req.body.existingImages) 
    } catch { 
      existingImages = [] 
    } } 
    if (!Array.isArray(existingImages)) {
       existingImages = [] 
      } 
      // Merge 
      req.body.images = [...existingImages, ...uploadedImages] 

      // Parse JSON fields 
      if (typeof req.body.specifications === "string") {
         try { req.body.specifications = JSON.parse(req.body.specifications) 

         } catch {} }
         
        if (typeof req.body.tags === "string") {
           try { req.body.tags = JSON.parse(req.body.tags) 

           } catch {} } 
           
          const product = await Product.create(req.body) 
    res.status(201).json({
       success: true, data: product, 
      }) } catch (error) {
         res.status(400).json({
           success: false, message: error.message, 
          }) } 
        }

exports.updateProduct = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, "products"))
      );
    }
    
    let existingImages = [];
    if (req.body.images) {
      if (typeof req.body.images === "string") {
        try {
          const parsed = JSON.parse(req.body.images);
          existingImages = Array.isArray(parsed) ? parsed : [req.body.images];
        } catch (e) {
          existingImages = [req.body.images];
        }
      } else {
        existingImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      }
    } else if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
    } else if (req.body["existingImages[]"]) {
      existingImages = Array.isArray(req.body["existingImages[]"]) ? req.body["existingImages[]"] : [req.body["existingImages[]"]];
    }
    
    existingImages = existingImages.filter(img => typeof img === "string" && img.trim() !== "" && img !== "[{}]" && img !== "[ {} ]");
    
    req.body.images = [...existingImages, ...imageUrls];

    if (req.body.specifications && typeof req.body.specifications === "string") {
      try { req.body.specifications = JSON.parse(req.body.specifications); } catch(e) {}
    }
    if (req.body.tags && typeof req.body.tags === "string") {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) {}
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deactivated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate product",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
