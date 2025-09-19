import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SweetSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  imageUrl: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
SweetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Sweet = mongoose.model<ISweet>('Sweet', SweetSchema);