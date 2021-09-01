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
// 单个页面
router.use('/:dir/:file', (req, res) => {
  res.send('dir')
})
// 目录+页面
router.use('/:file', async (req, res) => {
  // res.send('file')
  let doc = await docs.findOne({
    title: req.params.file
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
