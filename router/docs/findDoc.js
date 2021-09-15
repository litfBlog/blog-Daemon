/**
 * @Author: litfa
 * @Date: 2021-8-28
 */
const router = require('express')()
const docs = require('./../../modules/docs.js')

const marked = require('marked')
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  },
})
// 目录+页面
router.use('/:dir/:file', (req, res) => {
  res.send('dir')
})
// 单个页面
router.use('/:id', async (req, res) => {
  // res.send('file')
  let doc = await docs.findOne({
    _id: req.params.id
  }).populate('author')
  if (doc) {
    doc.content = marked(doc.content)
    res.send({
      code: 200, data: doc
    })
  } else {
    res.send({ code: 404 })
  }
})

module.exports = router
