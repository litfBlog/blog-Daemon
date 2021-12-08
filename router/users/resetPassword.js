/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:45:03 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:45:03 
 */

const router = require('express')()

const users = require('./../../modules/users')
const md5 = require('md5')
const sendMail = require('./../../modules/sendMail')

// 已在 app.js 声明路由
router.use('/auth', (req, res) => {
  let { email, authCode } = req.body
  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })

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

  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  req.session.authCode = null
  if (emailCode != req.session.mailCode) return res.send({ code: 403, msg: '邮箱验证码错误' })

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
    logger.error(err)
    res.send({ code: 500, msg: '注册失败' })
  })
})

module.exports = router

