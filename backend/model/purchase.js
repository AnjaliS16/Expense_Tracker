const  Sequelize=require('sequelize');
const  sequelize=require('../util/database')

const Order=sequelize.define('Orders',{
    id:{
        type: Sequelize.INTEGER,
          primaryKey:true,
          allowNull:false,
          autoIncrement:true
      },
      paymentId:Sequelize.STRING,
      oderId:Sequelize.STRING,
      status:Sequelize.STRING

})
module.exports=Order;