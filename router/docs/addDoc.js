/**
 * 发布文章
 * @Author: litfa
 * @Date: 2021-8-28
 */

const addDoc = require('express')()
const docs = require('./../../modules/docs')

// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')
const path = require('path')
const fs = require('fs')

addDoc.use(multer({
  dest: './uploads',
  limits: {
    //限制文件大小10MB
    fileSize: 10485760,
    //限制文件数量
    files: 1
  },
  fileFilter: function (req, file, cb) {
    // 限制文件上传类型，仅可上传png格式图片
    if (file.mimetype == 'image/png') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
}).any())

addDoc.use('/upImg', (req, res) => {

  console.log(req.files)

  const filename = req.files[0].path + path.parse(req.files[0].originalname).ext
  fs.rename(req.files[0].path, filename, function (err) {
    if (err) {
      res.send(err)
    } else {
      res.send({ code: 200, path: `/data/img/${req.files[0].filename + path.parse(req.files[0].originalname).ext}` })
    }
  })
})
// app.use(multer({ dest: './uploads' }).any())

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
