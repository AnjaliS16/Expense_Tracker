const { Op, literal, fn } = require('sequelize')
const Expense = require('../model/expense')




exports.postdate = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {

            const data = await Expense.findAll({
                where: {
                    userId: req.user.id,
                    createdAt: req.body.date
                }
            })
            return res.json(data)
        } else {

            return res.status(403).json({ success: false, msg: "you are not a premium user" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}


exports.getweekly = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {

            const currDate = new Date()
            currDate.setDate(currDate.getDate() - 7)
            const result = await Expense.findAll({
                attributes: [
                    [fn('DAYNAME', literal('createdAt')), 'week'],
                    [literal('SUM(exp)'), 'totalExpenses']
                ],
                where: {
                    userId: req.user.id,
                    createdAt: {
                        [Op.gt]: currDate
                    }
                },
                group: [fn('DAYNAME', literal('createdAt'))]
            })
            return res.json(result)
        } else {
            return res.status(403).json({ success: false, msg: "you are not a premium user" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}


exports.postmonthly = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {


            const month = req.body.month;
            const startDate = new Date(month);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);

            const result = await Expense.findAll({

                attributes: [
                    [fn('DATE', literal('createdAt')), 'date'],
                    [literal('SUM(exp)'), 'totalExpenses']
                ],
                where: {
                    userId: req.user.id,
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate

                    }
                },
                group: [fn('DATE', literal('createdAt'))]
            })
            return res.json(result)
        } else {
            return res.status(403).json({ success: false, msg: "you are not a premium user" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}


exports.postyearly = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {


            const year = req.body.year;
            const startYear = new Date(year)
            const endYear = new Date(startYear.getFullYear() + 2, 0, 1)
            const result = await Expense.findAll({
                attributes: [
                    [fn('MONTHNAME', literal('createdAt')), 'month'],
                    [literal('SUM(exp)'), 'totalExpenses'],
                ],
                where: {
                    userId: req.user.id,
                    createdAt: {
                        [Op.gte]: startYear,
                        [Op.lt]: endYear,
                    },
                },
                group: [fn('MONTHNAME', literal('createdAt'))],
                raw: true,
            });
            return res.json(result)
        } else {
            return res.status(403).json({ success: false, msg: "you are not a premium user" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}
