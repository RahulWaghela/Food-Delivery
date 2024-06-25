import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import express from 'express';
const app=express();
import cors from 'cors'
app.use(cors()); // Enable CORS for all origins
const stripe = new Stripe('sk_test_51NLRHnSHCIpFmnPVy2aDWGgumll9VcBAIvImoO1rlrmSgFbG41E8Co5OBqjlFkFXo6BRqEaHi7WLFMRuvlIZM8mL00u9Gme00q');
const ClientUrl = 'http://localhost:5173';
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // console.log('Place order request:', req.body);

    if (!userId || !items || items.length === 0 || !amount || !address) {
      console.error('Validation error:', req.body);
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Fee',
        },
        unit_amount: 90 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${ClientUrl}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${ClientUrl}/verify?success=false&orderId=${newOrder.id}`,
    });

    // console.log('Order placed successfully:', newOrder);
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const verifyOrder = async (req, res) => {
  console.log('Request received at /api/order/verify');
  const { orderId, success } = req.body;
  // console.log(`getting from client : ${orderId} - ${success}`);
  //  const user=user.req.body.userId
    //  console.log(`getting user ; ${user} `);
     
  try {
    console.log(`Verifying order. Order ID: ${orderId}, Success: ${success}`);
    
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (success === 'true') {
      order.payment = true;
      await order.save();
      console.log('Order updated successfully:', order);
      res.json({ success: true, message: 'Order placed successfully' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      console.log('Order cancelled:', orderId);
      res.json({ success: false, message: 'Order cancelled' });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const userOrders=async(req,res)=>{
  try {
    const orders=await orderModel.find({userId:req.body.userId});
    res.status(200).json({success: true, data:orders})
  } catch (error) {
    console.error('Server Error:', error);

    // res.status(500).json({ success: false, message: 'Internal server error' });
    res.json({success:false, message: 'Error'})
  }
}

const listOrders=async(req,res)=>{
  try {
    const orders = await orderModel.find({})
    res.json({success:true, data:orders});
  } catch (error) {
    console.log(`${error} `);
    res.json({success:false, message:"Error"});
    
  }
}
const updateStatus=async(req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true, message:'status updated successfully'});
  } catch (error) {
    console.log(`${error} `);
    res.json({success:false, message:"Error"});
    
  }
}



export { placeOrder, verifyOrder ,userOrders,
  listOrders,
  updateStatus

};
