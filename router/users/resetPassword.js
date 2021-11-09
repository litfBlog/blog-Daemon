// const path = require('path')
// const fs = require('fs')

const router = require('express')()

// 引入multer中间件，用于处理上传的文件数据
// const multer = require('multer')
// uuid
// const uuid = require('uuid')
const users = require('./../../modules/users')
const md5 = require('md5')
const sendMail = require('./../../modules/sendMail')

// 已在 app.js 声明路由
router.use('/auth', (req, res) => {
  let { email, authCode } = req.body
  // if (!/^[a-z0-9_-]{3,16}$/.test(userName)) return res.send({ code: 403, msg: '用户名有误' })
  // if (!/^[a-z0-9_-]{6,18}$/.test(passWord)) return res.send({ code: 403, msg: '密码格式有误' })
  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  // let doc = await users.findOne({ userName })
  // if (doc) return res.send({ code: 403, msg: '该用户名已被占用' })
  // let doc1 = await users.findOne({ email })
  // if (doc1) return res.send({ code: 403, msg: '该邮箱已注册' })
  // console.log((req.session.mailDate + (1000 * 60)), Date.now());
  // console.log((req.session.mailDate + (1000 * 60)) < Date.now());
  if ((req.session.mailDate + (1000 * 60)) > Date.now()) {
    return res.send({ code: 200, msg: '获取过于频繁' })
  }

  let code = ''
  for (let i = 1; i <= 6; i++) {
    code += Math.floor(Math.random() * 10)
  }
  req.session.mailCode = code
  req.session.mailDate = Date.now()

  sendMail(email, 'html', '用户注册-验证码', `
    您的验证码是 ${code}
  `)

  res.send({ code: 200, msg: '发送成功' })
})

router.use('/reSet', (req, res) => {
  logger.info(`重置密码 ${JSON.stringify(req.body)}`)
  let { authCode, emailCode, newPassWord } = req.body

  // if (!/^[a-z0-9_-]{3,16}$/.test(userName)) return res.send({ code: 403, msg: '用户名有误' })
  // if (!/^[a-z0-9_-]{6,18}$/.test(passWord)) return res.send({ code: 403, msg: '密码格式有误' })
  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  req.session.authCode = null
  if (emailCode != req.session.mailCode) return res.send({ code: 403, msg: '邮箱验证码错误' })
  // if (email != req.session.email) return res.send({ code: 403, msg: '???' })
  // let doc = await users.findOne({ userName })
  // if (doc) return res.send({ code: 403, msg: '该用户名已被占用' })
  // let doc1 = await users.findOne({ email })
  // if (doc1) return res.send({ code: 403, msg: '该邮箱已注册' })

  // console.log((req.session.mailDate + (1000 * 60)) < Date.now());
  // console.log((req.session.mailDate + (1000 * 60 * 5)) > Date.now());
  // console.log(req.session);

  if (
    (req.session.mailDate + (1000 * 60 * 5)) > Date.now()
  ) {
    // 
  } else {
    return res.send({ code: 403, msg: '验证码已过期' })
  }
  users.updateOne({ email: req.session.email }, {
    passWord: md5(md5(newPassWord) + 'xingWiki')
  }).then(() => {
    res.send({ code: 200, msg: '注册成功' })
  }).catch(err => {
    // console.log(err)
    logger.error(err)
    res.send({ code: 500, msg: '注册失败' })
  })
})

module.exports = router

