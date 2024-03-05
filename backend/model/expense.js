const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const user = sequelize.define("expensers",{
    id:{
      type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    exp:{
        type:Sequelize.STRING,
        allowNull:false
    },
    des:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    select:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    createdAt : {
      type : Sequelize.DATEONLY,
      defaultValue : Sequelize.NOW
  }
},
  {
      timestamps: false

  
    
});

(async () => {
    try {
      await user.sync(); 
      console.log('expensers table created successfully.');
    } catch (error) {
      console.error('Error creating expensers table:', error);
    }
  })();
  
module.exports = user;