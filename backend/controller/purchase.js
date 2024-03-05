const razorpay = require('razorpay')
const Order = require('../model/purchase');
const path = require('path')
const controller = require('./controller');
require('dotenv').config({ path: __dirname + '/../.env' });
const sequelize = require('../util/database')

//console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
//console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

exports.purchasepremium = async (req, res, next) => {
  try {
    var rzp = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;
    const order = await rzp.orders.create({ amount, currency: "INR" });


    await Order.create({ oderId: order.id, status: "FAILED", userId: req.user.id });

    res.status(201).json({ order, key_id: rzp.key_id });
    next();


  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      message: "Something went wrong while creating order",
      error: error,
    });
    next();
  }
}


exports.updatetransaction = async (req, res, next) => {
 
  const { payment_id, order_id } = req.body;
  try {
    const userId = req.user.id
    console.log(order_id, "order id from updatettrrrr");

    const order = await Order.findOne({ where: { oderId: order_id } })
    const promise1 = order.update({ paymentId: payment_id, status: "SUCCESSFULL" })
    const promise2 = req.user.update({ ispremiumuser: true })
    Promise.all([promise1, promise2]).then(() => {
      
      return res.status(202).json({ success: true, message: "Transaction successfull", token: controller.generatetoken(userId, undefined, true) })


    }).catch((error) => {
      console.log(error);
      
    })
    
  }

  catch (error) {
    
    console.log(error, "error from purchase update");

    console.log(order_id, 'from transaction status>>>>>>>>>>>>>>>>>>>>>>')

    res.status(500).json({ success: false, message: "Internal server error" });
    next();
  }


}


