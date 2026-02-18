const Tag = require("../../models/Tag");

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find().select("name status createdAt _id");

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
    const tag = await Tag.findById(req.params.id).select(
      "name status createdAt _id",
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tag",
    });
  }
};

exports.createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: tag._id,
        name: tag.name,
        status: tag.status,
        createdAt: tag.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deactivateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true },
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tag deactivated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate tag",
    });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tag deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete tag",
    });
  }
};
