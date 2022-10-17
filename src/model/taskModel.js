const mongoose = require("mongoose");

//-------------------------------------------------------[Schema]---------------------------------------------------------------------//

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: null,
    },
    toDoList: {
      type: Array,
      default: [],
    },

    updatedAt: { type: Date, default: null },

    deletedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema); // Exporting collection & module
