const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  tokens: [
    {
      token: { type: String, required: true }
    }
  ],
  bio: { type: String, default: '', maxlength: 160 }, // Short bio
  profilePic: { type: String, default: '' }, // Profile image URL
  coverPic: { type: String, default: '' }, // New: Cover image URL
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  themePreference: { type: String, enum: ['light', 'dark'], default: 'light' },
  accountPrivacy: { type: String, enum: ['public', 'private'], default: 'public' }, // New: Privacy toggle
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);