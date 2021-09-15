/**
 * 发布文章
 * @Author: litfa
 * @Date: 2021-8-28
 */
const path = require('path')
const fs = require('fs')

const addDoc = require('express')()
const docs = require('./../../modules/docs')
const ids = require('./../../modules/ids')

// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')
// uuid
const uuid = require('uuid')
const { Logger } = require('log4js')
// console.log(uuid.v1);
// console.log(uuid.v2);
// console.log(uuid.v3);
// console.log(uuid.v4());
// console.log(uuid.v5);

// 进入编辑页 初始化数据
// 分配文章id
// 保存草稿功能
addDoc.use('/init', (req, res) => {
  // 账号状态
  if (!req.session.isLogin) {
    res.send({ code: 403, msg: '未登录' })
    return
  }
  if (req.session.status != 1) {
    res.send({ code: 403, msg: '账号状态异常' })
    return
  }
  // console.log(config.allow_addDoc);
  // console.log(config.allow_addDoc.indexOf(req.session.permission));
  // console.log(req.session);
  if (config.allow_addDoc.indexOf(req.session.permission) == -1) {
    res.send({ code: 403, msg: '权限不足' })
    return
  }

  // 若是编辑中状态
  if (req.session.edit && req.session.edit.editing) {
    // 返回编辑状态
    res.send({ code: 200, type: 'editing', content: '草稿', title: '', info: '' })
  } else {
    // 非编辑中状态
    // 初始化编辑状态
    let id = uuid.v4()
    fs.mkdir(`./uploads/${id}/`, (err) => {
      if (err) {
        res.send({ code: 500 })
        return
      }
      req.session.edit = {
        editing: true,
        date: Date.now(),
        id: id
      }
      res.send({ code: 200, type: 'init' })
    })
  }
})

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
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
}).any())

addDoc.use('/upImg', (req, res) => {
  // console.log(req.files)
  // console.log(req.session);
  logger.info(`上传文件 ${req.userip} ${JSON.stringify(req.files)} ${JSON.stringify(req.session)}`)
  if (req.files[0].mimetype == 'image/png' || req.files[0].mimetype == 'image/jpg' || req.files[0].mimetype == 'image/jpeg') {
    const filename = req.files[0].filename + path.parse(req.files[0].originalname).ext
    // console.log(filename)
    logger.info(filename)
    fs.rename(req.files[0].path, `./uploads/${req.session.edit.id}/${filename}`, function (err) {
      if (err) {
        // console.log(err)
        logger.error(err)
        res.send({ code: 500, msg: '上传失败' })
      } else {
        res.send({ code: 200, path: `/data/img/${req.session.edit.id}/${req.files[0].filename + path.parse(req.files[0].originalname).ext}` })
      }
    })
  } else {
    res.send({ code: 400, msg: '文件类型有误！' })
  }
})
addDoc.post('/delImg', (req, res) => {
  let { fileName } = req.body
  fileName = fileName.split('/')
  fileName = fileName[fileName.length - 1]
  // console.log(fileName)
  logger.info(`删除图片 ${req.userip}, ${fileName}, ${JSON.stringify(req.session)}`)
  fs.rename(`./uploads/${req.session.edit.id}/${fileName}`, `./delLoads/${fileName}.bak`, (err) => {
    if (err) {
      // console.log(err);
      logger.error(err)
      res.send({ code: 500 })
      return
    }
    res.send({ code: 200 })
  })
})

// 已在 app.js 声明路由
addDoc.use((req, res) => {
  // if (req.session.isLogin && req.session.status == 1 && req.session.permission.indexof(config.allow_addDoc) != -1) {
  // console.log(req.session)
  if (!req.session.isLogin) {
    res.send({ code: 403, msg: '未登录' })
    return
  }
  if (req.session.status != 1) {
    res.send({ code: 403, msg: '账号状态异常' })
    return
  }
  // console.log(config.allow_addDoc);
  // console.log(config.allow_addDoc.indexOf(req.session.permission));
  // console.log(req.session);
  if (config.allow_addDoc.indexOf(req.session.permission) == -1) {
    res.send({ code: 403, msg: '权限不足' })
    return
  }
  let { title, info, content } = req.body
  // 自增ids 自增后就是文章的id
  ids.findOneAndUpdate(
    {
      name: 'docs',
    },
    {
      // $inc 需要自增的字段
      $inc: {
        id: +1
      }
    },
    {
      upsert: true, // 如果该文档不存在则插入
      returnOriginal: false, // 返回更新是否成功/更新后结果  false返回更新后结果
    }
  ).then(id => {
    docs.create({
      _id: id.id,
      title,
      info,
      date: Date.now(),
      content,
      author: req.session.uid,
      dataUuid: req.session.edit.id
    }).then(doc => {
      res.send({ code: 200, msg: '发布成功' })
    }).catch(err => {
      // console.log(err)
      logger.error(err)
      res.send({ code: 500, msg: '发布失败' })
    })
  })
})

module.exports = addDoc
