/**
 * 登录查询功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const loginStatus = require('express')()
const users = require('./../../modules/users')
const docs = require('./../../modules/docs')

// 已在 app.js 声明路由
loginStatus.use(async (req, res) => {
  if (req.session.isLogin) {
    let user = await users.findOne({ _id: req.session.uid })
    let doc = await docs.find({
      author: req.session.uid,
      status: 1
    }, { title: 0, info: 0, date: 0, author: 0, status: 0, _id: 0 })
    res.send({
      code: 200, data: {
        isLogin: true,
        userName: req.session.userName,
        avatar: user.avatar,
        email: req.session.email,
        status: req.session.status,
        permission: req.session.permission,
        // 文章数量
        pagesNum: doc.length,
        // 点赞和粉丝 先写死
        fansNum: 0,
        loveNum: 0
      }
    })
  } else {
    res.send({
      code: 200,
      data: {
        isLogin: false
      }
    })
  }
})

module.exports = loginStatus
