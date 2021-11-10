/**
 * 删除文章
 * @Author: litfa
 */
const router = require('express')()
const docs = require('./../../modules/docs.js')

router.use(async (req, res) => {
  let { _id } = req.body
  logger.info(`删除文章 ${req.userip} ${JSON.stringify(req.body)} ${JSON.stringify(req.session)}`)
  docs.findOneAndUpdate({
    _id,
    // 同时查询两个条件，查不到可能不是作者
    author: req.session.uid
  }, {
    status: 2
  }).then(() => {
    res.send({ code: 200 })
  }).catch(err => {
    logger.error(err)
    res.send({ code: 500, msg: '删除失败' })

  })
  // let doc = await docs.find({ author: req.session.uid }, { title: 1, info: 1, date: 1, author: 1, status: 1, _id: 1 }).limit(num).populate('author')
  // if (doc) {
  //   doc = doc.reverse()
  //   res.send({
  //     code: 200, data: doc
  //   })
  // }
})

module.exports = router
