// Entry point for backend API
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth';
import sweetRoutes from './src/routes/sweets';
import orderRoutes from './src/routes/orders';
import { User } from './src/models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Seed default admin user
const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!existingAdmin) {
      const saltRounds = 12; // Match the auth controller
      const hashedPassword = await bcrypt.hash('admin@123', saltRounds);
      const adminUser = new User({
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created: admin@gmail.com / admin@123');
    } else {
      // Check if password works, if not, update it
      const isPasswordValid = await bcrypt.compare('admin@123', existingAdmin.password);
      if (!isPasswordValid) {
        console.log('Updating admin password to ensure it works...');
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash('admin@123', saltRounds);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('Admin password updated successfully');
      } else {
        console.log('Admin user already exists with correct password');
      }
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdminUser();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Sweet Shop Management API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});