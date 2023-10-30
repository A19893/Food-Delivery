import mongoose, { Document, Schema } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string;
  items: [any]; //[{food, unit:1}]
  totalAmount: number;
  orderDate: Date;
  paidThrough: string; //COD, Credit Card, Wallet
  paymentRsponse: string;
  orderStatus: string;
}

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    items: [
      {
        food: {
          type: Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    paidThrough: {
      type: String
    },
    paymentResponse: {
      type: String
    },
    orderStatus: {
      type: String
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("Orders", OrderSchema);
export {Order}