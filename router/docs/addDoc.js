/**
 * 发布文章
 * @Author: litfa
 * @Date: 2021-8-28
 */

const addDoc = require('express')()
const docs = require('./../../modules/docs')

// 已在 app.js 声明路由
addDoc.use((req, res) => {
  // if (req.session.isLogin && req.session.status == 1 && req.session.permission.indexof(config.allow_addDoc) != -1) {
  console.log(req.session)
  if (!req.session.isLogin) {
    res.send({ code: 403, msg: '未登录' })
    return
  }
  if (req.session.status != 1) {
    res.send({ code: 403, msg: '账号状态异常' })
    return
  }
  if (config.allow_addDoc.indexOf(req.session.permission) == -1) {
    res.send({ code: 403, msg: '权限不足' })
    return
  }
  let { title, info, content } = req.body
  docs
    .create({
      title,
      info,
      date: Date.now(),
      content,
      author: req.session.uid,
    })
    .then((doc) => {
      res.send({ code: 200, msg: '发布成功' })
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: 500, msg: '发布失败' })
    })
})

module.exports = addDoc
