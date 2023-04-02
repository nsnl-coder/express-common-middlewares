const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: mongoose.Schema.Types.ObjectId,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model('UserModel', schema);

export { User };
