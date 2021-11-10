const router = require('express')()
const docs = require('./../../modules/docs.js')

const marked = require('marked')
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})

router.use(async (req, res) => {
  // 每页显示数量 页码  
  // 页码 - 1 * 数量 开始查找
  let { num, page } = req.body
  // 页码 - 1
  page--
  // 页码默认 1
  if (!page) page = 0
  // 跳过的数量
  let skip = page * num
  let doc = await docs.find({
    status: 1
  }, {
    title: 1,
    info: 1,
    date: 1,
    author: 1,
    status: 1,
    views: 1,
    _id: 1
  }).sort({
    // 排序
    $natural: 1
  }).skip(skip).limit(num).populate('author')
  // 文章总数
  let allNum = await docs.find({
    status: 1
  }, {
    _id: 1
  })
  if (doc) {
    // 倒序
    doc = doc.reverse()
    // 阅读量数据改为数字
    for (let i in doc) {
      doc[i].views = doc[i].views.length
    }
    res.send({
      code: 200, data: doc, allNum: allNum.length
    })
  }
})

module.exports = router
