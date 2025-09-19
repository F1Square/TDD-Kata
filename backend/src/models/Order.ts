import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    sweetId: mongoose.Types.ObjectId;
    sweetName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: Date;
  customerEmail: string;
  customerUsername: string;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    sweetId: {
      type: Schema.Types.ObjectId,
      ref: 'Sweet',
      required: true
    },
    sweetName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerUsername: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);