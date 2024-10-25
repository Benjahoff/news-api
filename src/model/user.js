import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export class UserModel {
  // Obtener un usuario por email
  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user ? user : null;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to find the user. Please try again later.');
    }
  }

  // Registrar un nuevo usuario
  static async registerUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to register the user. Please try again later.');
    }
  }
}
