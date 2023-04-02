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
    role: {
      type: String,
      enum: ['user', 'admin'],
    },
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model('UserModel', schema);

export { User };
