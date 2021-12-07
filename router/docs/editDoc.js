/*
 * @Author: litfa 
 * @Date: 2021-12-05 19:20:14 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-06 19:54:22
 */
/**
 * 发布文章
 * @Author: litfa
 * @Date: 2021-8-28
 */
const path = require('path')
const fs = require('fs')

const addDoc = require('express')()
const docs = require('./../../modules/docs')
// const ids = require('./../../modules/ids')

// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')

// uuid
// const uuid = require('uuid')
// console.log(uuid.v1);
// console.log(uuid.v2);
// console.log(uuid.v3);
// console.log(uuid.v4());
// console.log(uuid.v5);

// 进入编辑页 初始化数据
// 分配文章id
// 保存草稿功能

// function sleep (time) {
//   return new Promise((resolve) => setTimeout(resolve, time));
// }
addDoc.use('/init', async (req, res) => {
  // await sleep(5000)
  logger.info(`初始化更新文章 ${req.userip} ${JSON.stringify(req.session)} ${JSON.stringify(req.body)}`)
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

  let { _id } = req.body
  let doc = await docs.findOne({
    _id,
    author: req.session.uid,
    status: 1
  })
  console.log(doc)
  if (doc) {
    req.session.edit = {
      editing: true,
      date: Date.now(),
      id: doc.dataUuid
    }
    res.send({
      code: 200,
      type: 'editing',
      content: doc.content,
      title: doc.title,
      info: doc.info,
      docConfig: {
        noIndexView: doc.noIndexView,
        noSearch: doc.noSearch,
        public: doc.public,
        usePassWord: doc.usePassWord,
        passWord: doc.passWord
      }
    })
  } else {
    res.send({ code: 500 })
  }

  // 若是编辑中状态
  //  if (req.session.edit && req.session.edit.editing) {
  //    // 返回编辑状态
  //    res.send({ code: 200, type: 'editing', content: '草稿', title: '', info: '' })
  //  } else {
  //    // 非编辑中状态
  //    // 初始化编辑状态
  //    let id = uuid.v4()
  //    fs.mkdir(`./uploads/${id}/`, (err) => {
  //      if (err) {
  //        res.send({ code: 500 })
  //        return
  //      }
  //      req.session.edit = {
  //        editing: true,
  //        date: Date.now(),
  //        id: id
  //      }
  //      res.send({ code: 200, type: 'init' })
  //    })
  //  }
})

addDoc.use(multer({
  dest: './uploads',
  limits: {
    // 限制文件大小10MB
    fileSize: 10485760,
    // 限制文件数量
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
addDoc.use(async (req, res) => {
  logger.info(`更新文章 ${req.userip} ${JSON.stringify(req.session)} ${JSON.stringify(req.body)}`)
  // if (req.session.isLogin && req.session.status == 1 && req.session.permission.indexof(config.allow_addDoc) != -1) {
  // console.log(req.session)
  if (!req.session.isLogin) {
    res.send({ code: 403, msg: '未登录' })
    return
  }
  // console.log(config.allow_addDoc);
  // console.log(config.allow_addDoc.indexOf(req.session.permission));
  // console.log(req.session);
  if (config.allow_addDoc.indexOf(req.session.permission) == -1) {
    res.send({ code: 403, msg: '权限不足' })
    return
  }
  let { _id, title, info, content, docConfig } = req.body

  // 内容判断
  if (
    info.length > 50 ||
    info.length < 10
  ) {
    logger.info(`标题过长/过短 ${req.userip} ${JSON.stringify(req.session)} ${JSON.stringify(req.body)}`)
    return res.send({ code: 403, msg: '标题过长/过短' })
  }
  if (
    info.length > 50 ||
    info.length < 10
  ) {
    logger.info(`简介过长/过短 ${req.userip} ${JSON.stringify(req.session)} ${JSON.stringify(req.body)}`)
    return res.send({ code: 403, msg: '简介过长/过短' })
  }
  if (content.length > 10000 ||
    content.length < 20
  ) {
    logger.info(`内容过长/过短 ${req.userip} ${JSON.stringify(req.session)} ${JSON.stringify(req.body)}`)
    return res.send({ code: 403, msg: '简介过长/过短' })
  }

  let doc = await docs.findOne({
    _id,
    author: req.session.uid,
    status: 1
  })
  let oldContent
  let oldTitle
  let oldInfo
  if (doc) {
    oldContent = doc.content
    oldTitle = doc.title
    oldInfo = doc.info
  }
  console.log(docConfig)
  docs.findOneAndUpdate({
    _id,
    author: req.session.uid,
    status: 1
  }, {
    content,
    title,
    info,
    noIndexView: docConfig.noIndexView,
    noSearch: docConfig.noSearch,
    usePassWord: docConfig.usePassWord,
    passWord: docConfig.passWord,
    public: docConfig.public,
    $addToSet: {
      edits: {
        date: Date.now(),
        user: req.session.uid,
        oldContent,
        oldTitle,
        oldInfo,
        newContent: content,
        newTitle: title,
        newInfo: info
      }
    }
  }).then(() => {
    res.send({ code: 200 })
  }).catch(err => {
    logger.error(err)
    res.send({ code: 500, msg: '修改失败' })
  })
  // 自增ids 自增后就是文章的id
  // ids.findOneAndUpdate(
  //   {
  //     name: 'docs',
  //   },
  //   {
  //     // $inc 需要自增的字段
  //     $inc: {
  //       id: +1
  //     }
  //   },
  //   {
  //     upsert: true, // 如果该文档不存在则插入
  //     returnOriginal: false, // 返回更新是否成功/更新后结果  false返回更新后结果
  //   }
  // ).then(id => {
  //   docs.create({
  //     _id: id.id,
  //     title,
  //     info,
  //     date: Date.now(),
  //     content,
  //     author: req.session.uid,
  //     dataUuid: req.session.edit.id,
  //     status: 1
  //   }).then(doc => {
  //     res.send({ code: 200, msg: '发布成功' })
  //   }).catch(err => {
  //     // console.log(err)
  //     logger.error(err)
  //     res.send({ code: 500, msg: '发布失败' })
  //   })
  // })
})

module.exports = addDoc
