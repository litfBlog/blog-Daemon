/**
 * 个人页面显示自己的文章
 * @Author: litfa
 */
const router = require('express')()
const docs = require('./../../modules/docs.js')

// const marked = require('marked')
// marked.setOptions({
//   highlight: function (code) {
//     return require('highlight.js').highlightAuto(code).value
//   },
// })

router.use(async (req, res) => {
  let { num } = req.body
  let doc = await docs.find({
    author: req.session.uid,
    status: 1
  }, { title: 1, info: 1, date: 1, author: 1, status: 1, _id: 1 }).limit(num).populate('author')
  if (doc) {
    doc = doc.reverse()
    res.send({
      code: 200, data: doc
    })
  }
})


module.exports = router
