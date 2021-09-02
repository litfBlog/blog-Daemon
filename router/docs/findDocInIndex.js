/**
 * @Author: litfa
 * @Date: 2021-9-2
 */
const router = require('express')()
const docs = require('./../../modules/docs.js')

const marked = require('marked')
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  },
})

router.use(async (req, res) => {
  let { num } = req.body
  let doc = await docs.find({}, { title: 1, info: 1, date: 1, author: 1, status: 1, dataUuid: 1, _id: 1 }).limit(num).populate('author')
  console.log(doc);
  if (doc) {
    // for (i in doc) {
    //   doc[i].content = marked(doc[i].content)
    // }
    // doc.content = marked(doc.content)
    res.send({
      code: 200, data: doc
    })
  }
})


module.exports = router
