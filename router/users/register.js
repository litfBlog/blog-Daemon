/**
 * 注册功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const register = require('express')()
const users = require('./../../modules/users')
const ids = require('./../../modules/ids')

// const sendMail = require("./../../modules/sendMail")

const md5 = require('md5')

register.use('/find', async (req, res) => {
  let { userName, email } = req.body
  // console.log(req.body);
  let doc
  if (userName) {
    doc = await users.findOne({ userName })
  } else if (email) {
    doc = await users.findOne({ email })
  }
  if (doc) {
    res.send({ code: 200, status: 'no' })
  } else {
    res.send({ code: 200, status: 'ok' })
  }
})

// 已在 app.js 声明路由
register.use('/auth', require('./authEmail'))

register.use('/register', async (req, res) => {
  logger.info(`注册 ${req.userip}, ${JSON.stringify(req.body)}`)
  let { userName, email, passWord, emailCode } = req.body

  if (!/^[a-z0-9_-]{3,16}$/.test(userName)) return res.send({ code: 403, msg: '用户名有误' })
  if (!/^[a-z0-9_-]{6,18}$/.test(passWord)) return res.send({ code: 403, msg: '密码格式有误' })
  // if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  // req.session.authCode = null
  if (emailCode != req.session.mailCode) return res.send({ code: 403, msg: '邮箱验证码错误' })
  let doc = await users.findOne({ userName })
  if (doc) return res.send({ code: 403, msg: '该用户名已被占用' })
  let doc1 = await users.findOne({ email })
  if (doc1) return res.send({ code: 403, msg: '该邮箱已注册' })

  if (
    (req.session.mailDate + (1000 * 60 * 5)) > Date.now()
  ) {
    // 
  } else {
    return res.send({ code: 403, msg: '验证码已过期' })
  }

  // passWord = md5(md5(passWord) + 'xingWiki')

  ids.findOneAndUpdate(
    {
      name: 'user'
    },
    {
      // $inc 需要自增的字段
      $inc: {
        id: +1
      }
    },
    {
      upsert: true, // 如果该文档不存在则插入
      returnOriginal: false // 返回更新是否成功/更新后结果  false返回更新后结果
    }
  ).then(id => {
    users.create({
      _id: id.id,
      userName,
      email: req.session.mailCode_Mail,
      passWord: md5(md5(passWord) + 'xingWiki'),
      register: Date.now(),
      status: 1,
      permission: 'member'
    }).then(() => {
      res.send({ code: 200, msg: '注册成功' })
    }).catch(err => {
      // console.log(err)
      logger.error(err)
      res.send({ code: 500, msg: '注册失败' })
    })
  })
})

module.exports = register