const router = require('express')()
const docs = require('./../../modules/docs.js')

const marked = require('marked')
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})
// 目录+页面
router.use('/:dir/:file', (req, res) => {
  res.send('dir')
})
// 单个页面
router.use('/:id', async (req, res) => {
  // 查询数据库
  let doc = await docs.findOne({
    _id: req.params.id,
    status: 1
  }).populate('author')
  if (doc) {
    // 转换 markdown
    doc.content = marked(doc.content)
    // views 用于储存阅读数据
    let views = doc.views
    // 原数据改为阅读量数字传递给前端
    doc.views = views.length

    res.send({
      code: 200, data: doc
    })
    // 增加阅读量
    if (req.session.isLogin) {
      for (let i in views) {
        // 判断用户是否看过该文章，若看不增加阅读量
        if (req.session.uid == views[i]._id) {
          // 看过直接 return 不再自增
          return
        }
      }
      docs.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          views: {
            // 记录用户id及阅读时间
            _id: req.session.uid,
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
