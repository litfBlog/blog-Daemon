/**
 * 获取单个界面
 * @Author: litfa
 * @Date: 2021-8-28
 */
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
    res.send({
      code: 200, data: doc
    })
    // 增加阅读量
    if (req.session.isLogin) {
      // console.log('自增');
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
