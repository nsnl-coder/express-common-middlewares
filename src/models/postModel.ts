const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
);

const Post = mongoose.model('post', schema);

export { Post };
