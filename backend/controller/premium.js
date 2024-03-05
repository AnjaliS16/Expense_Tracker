const User = require('../model/model')
const Expense = require('../model/expense')
const sequelize = require('../util/database')



exports.checkPremium = async (req, res) => {
    try {

        const result = await req.user.ispremiumuser;
        return res.json(result)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })

    }
}


exports.getmethod = async (req, res, next) => {
    try {

        const users = await User.findAll({

            order: [['totalExpenses', 'DESC']]
        });
        console.log(users)
        res.status(202).json(users);

        next();
    }
    catch (error) {
        console.log(error);
        next();
        throw new Error(error);


    }
}