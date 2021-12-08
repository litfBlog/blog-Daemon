/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:37:11 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:37:11 
 */
const router = require('express')()
const pages = require('./../../modules/docs')

router.use('/getPages', async (req, res) => {
  let pagesData = await pages.find().populate('author')
  pagesData = pagesData.reverse()
  res.send(pagesData)
})

router.use('/edit', async (req, res) => {
  let { type, value, _id } = req.body
  pages.findByIdAndUpdate({
    _id
  }, {
    [type]: value
  }).then(doc => {
    res.send(doc)
  }).catch(err => {
    res.send(err)
  })
})

module.exports = router
