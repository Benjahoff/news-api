import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://benjahoffman:HyyXapQNAfqeWI7T@cluster0.8ve2j.mongodb.net/newsDB');
    console.log('MongoDB Cloud connected!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
