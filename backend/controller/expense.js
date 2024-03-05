const User = require('../model/expense');
const user = require('../model/model')
const sequelize = require('../util/database')
const S3Services = require('../services/s3services')



exports.addmethod = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { exp, des, select } = req.body;
    const userId = req.user.id;
    console.log('from req.body>>>>', exp, des, select, userId);


    const newUser = await User.create({
      exp,
      des,
      select,
      userId,

    },
      {
        transaction: t
      });
    const totalExpense = Number(req.user.totalExpenses) + Number(exp);
    console.log(totalExpense, 'totaExpense>>>>>>>>>>>')
    await user.update({
      totalExpenses: totalExpense
    }, {
      where: { id: req.user.id },
      transaction: t
    })
    await t.commit();
    res.json({ newuser: newUser });
    console.log('response from add method');
    next()
  } catch (error) {
    await t.rollback();
    res.json({ Error: error.message });
    console.log('error from add method in add.js', error);
    next()
  }

}



exports.getmethod = async (req, res, next) => {
  try {
    const data = await User.findAll({ where: { userId: req.user.id } });
    console.log('id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.user.id)
    const modifiedData = data.map((User) => ({
      id: User.id,
      exp: User.exp,
      des: User.des,
      select: User.select,
      userId: User.userId

    }))
    res.json({ alluser: modifiedData });
    next();
  } catch (error) {
    console.log('Error from add.js get method', error);
    res.json({ Error: error });
    next();
  }
};



exports.deletemethod = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const deletedExpense = await User.findOne({
      attributes: ['exp'],
      where: {
        id: id,
        userId: userId
      },
      transaction: t
    });


    const deleted = await User.destroy({
      where: {
        id: id,
        userId: userId
      },
      transaction: t
    })

    const totalExpense = Number(req.user.totalExpenses) - Number(deletedExpense.exp);
    await user.update(
      {
        totalExpenses: totalExpense
      },
      {
        where: { id: req.user.id },
        transaction: t
      }
    );
    await t.commit();
    res.json(deleted);
    next();
  }
  catch (error) {
    await t.rollback();
    console.log('error while deleting', error);
    next();
  }


};

//bucket_name='expensetracker3916'
exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await req.user.getExpensers();
    console.log(expenses, 'expenses>>>>>>>>>>>>>>>>>>>>>>>>>');


    const expensesToString = JSON.stringify(expenses)
    const fileName = `expense${req.user.id}/${new Date()}.txt`
    const fileUrl = await S3Services.uploadToS3(expensesToString, fileName);
    let url = fileUrl.Location
    await req.user.createDownload({ url: url })
    return res.json({ fileUrl: fileUrl.Location, success: true })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, msg: "Internal server error" })

  }
}



exports.downloadUrls = async (req, res) => {
  try {
    const urls = await req.user.getDownloads();
    return res.json({ success: true, urls })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, msg: "Internal server error" })
  }
}



exports.getExpenses = async (req, res) => {
  try {
    const page = +req.query.page || 1
    const items = +req.body.items || 5
    console.log(items)
    const exp = req.user.getExpensers({
      offset: (page - 1) * items,
      limit: items
    })
    const totalExp = req.user.countExpensers()
    const [expenses, totalExpenses] = await Promise.all([exp, totalExp])
    return res.json({ expenses, totalExpenses })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, msg: "Internal server error" })
  }
}