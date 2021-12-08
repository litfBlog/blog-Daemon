/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:41:07 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-08 16:51:09
 */
const router = require('express')()
const docs = require('./../../modules/docs.js')

router.use(async (req, res) => {
  // 第一页应该显示最后十条
  // 总的 - 当前页 开始查找

  // 每页显示数量 页码  
  // 页码 - 1 * 数量 开始查找
  let { num, page } = req.body
  // 页码默认 1
  if (!page) page = 1
  // 跳过的数量 每页显示数*页码
  let skip = page * num
  // 文章总数
  let allNum = await docs.find({
    status: 1
  }, {
    _id: 1
  })

  // 总的 - 当前页 开始查找
  skip = allNum.length - skip
  // 文章少于一页从0查找，不能是负数
  if (skip < 0) {
    skip = 0
  }
  // 文章
  let doc = await docs.find({
    status: 1,
    $or: [
      { public: true },
      { public: undefined }
    ],
    // 不在首页显示为 false 或 undefined(未设置过，未指定)
    $or: [
      { noIndexView: false },
      { noIndexView: undefined }
    ]
  }, {
    title: 1,
    info: 1,
    date: 1,
    author: 1,
    status: 1,
    views: 1,
    likes: 1,

    _id: 1
  }
  ).sort({
    // 排序
    $natural: 1
  }).skip(skip).limit(num).populate('author')

  if (doc) {
    // 倒序
    doc = doc.reverse()
    // 阅读量数据改为数字
    for (let i in doc) {
      doc[i].views = doc[i].views.length
    }
    // 点赞量数据改为数字
    for (let i in doc) {
      if (!doc[i].likes) doc[i].likes = []
      doc[i].likes = doc[i].likes.length
    }
    res.send({
      code: 200, data: doc, allNum: allNum.length
    })
  }
})

module.exports = router
