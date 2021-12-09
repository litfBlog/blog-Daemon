/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:40:58 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-09 19:59:54
 */
const router = require('express')()
const docs = require('./../../modules/docs.js')

// 单个页面
router.use('/:id', async (req, res) => {
  // 查询数据库
  let doc = await docs.findOne({
    _id: req.params.id,
    status: 1
  }).populate('author')
  if (doc) {
    // 密码
    let { passWord } = req.body
    // console.log(doc)
    if (doc.public == false) {
      // 仅作者可见
      if (req.session.isLogin && req.session.uid) {
        // 
      } else {
        return res.send({ code: 404 })
      }
    }
    if (
      doc.usePassWord
    ) {
      // 作者不需要密码
      if (
        req.session.isLogin &&
        doc.author._id == req.session.uid
      ) {
        // 
      } else {
        if (passWord) {
          if (passWord != doc.passWord) {
            return res.send({ code: 403, msg: '密码错误 ' })
          }
        } else {
          return res.send({ code: 200, type: 'usePassWord' })
        }
      }
    }
    // views 用于储存阅读数据
    let views = doc.views
    // 原数据改为阅读量数字传递给前端
    doc.views = views.length

    // 点赞
    // 无点赞 空数组
    if (!doc.likes) doc.likes = []
    // 默认未点过
    // mongo查询对象无法添加值
    let liked = false
    // 循环判断
    // 登录用户
    if (req.session.isLogin) {
      for (let i in doc.likes) {
        if (doc.likes[i]._id || doc.likes[i]._id == req.session.uid) {
          liked = true
          break
        }
      }
    } else {
      // 未登录 判断ip
      for (let i in doc.likes) {
        if (doc.likes[i].ip === req.userip) {
          liked = true
          break
        }
      }
    }
    // 隐藏点赞数据
    doc.likes = doc.likes.length

    res.send({
      code: 200, data: doc, liked
    })
    // 增加阅读量
    // 登录用户
    if (req.session.isLogin) {
      for (let i in views) {
        // 判断用户是否看过该文章，若看过不增加阅读量
        // 该项有 _id 且等于该用户 id
        if (views[i]._id && req.session.uid == views[i]._id) {
          // 看过直接 return 不再自增
          return
        }
      }
      // push 数据
      docs.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          views: {
            // 记录用户id及阅读时间
            _id: req.session.uid,
            ip: req.userip,
            date: Date.now()
          }
        }
      }).then()
      // 未登录 通过ip判断
    } else {
      // 判断该ip是否看过该文章
      for (let i in views) {
        // 判断用户是否看过该文章，若看过不增加阅读量
        // 该项有 ip 且等于该用户 ip
        if (views[i].ip && req.userip == views[i].ip) {
          // 看过直接 return 不再自增
          return
        }
      }
      // push 数据
      docs.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          views: {
            // 记录用户 ip 及阅读时间
            // _id: req.session.uid,
            ip: req.userip,
            date: Date.now()
          }
        }
      }).then()
    }
  } else {
    res.send({ code: 404 })
  }
})

module.exports = router
