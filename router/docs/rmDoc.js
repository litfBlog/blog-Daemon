/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:42:05 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:42:05 
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
})

module.exports = router
