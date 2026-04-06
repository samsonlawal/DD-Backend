const Tag = require("../../models/Tag");

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ status: "active" }).select("name status createdAt _id");

    const formattedTags = tags.map((tag) => ({
      id: tag._id,
      name: tag.name,
      status: tag.status,
      createdAt: tag.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: tags.length,
      data: formattedTags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
    });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      _id: req.params.id,
      status: "active",
    }).select("name status createdAt _id");

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: tag._id,
        name: tag.name,
        status: tag.status,
        createdAt: tag.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tag",
    });
  }
};
