/**
 * 登录查询功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const loginStatus = require('express')()
const users = require('./../../modules/users')

// 已在 app.js 声明路由
loginStatus.use(async (req, res) => {
  // let { userName, passWord, authCode } = req.body
  // console.log(req.body);

  // console.log(req.session)
  // req.session.isLogin = 'set'
  // console.log(req.session)
  // res.send(123)
  // return
  // let doc = await users.findOne({ userName })
  // if (doc && doc.userName == userName && doc.passWord == passWord) {
  //   req.session.isLogin = true
  //   req.session.status = doc.status
  //   req.session.permission = doc.permission
  //   req.session.uid = doc._id
  //   res.send({ code: 200, msg: '登录成功' })
  // } else {
  //   req.session = null
  //   res.send({ code: 403, msg: '账号或密码错误' })
  // }
  if (req.session.isLogin) {
    res.send({
      code: 200, data: {
        isLogin: true,
        userName: req.session.userName,
        avatar: 'https://i1.hdslb.com/bfs/face/de63b899bc2db6b9b995e41fa783b02b445105b4.jpg@96w_96h_1c_1s.webp'
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
