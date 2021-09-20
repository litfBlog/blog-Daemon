const router = require('express')()
// const users = require('./../../modules/users')
const pages = require('./../../modules/docs')
const md5 = require('md5')

router.use('/getPages', async (req, res) => {
  let pagesData = await pages.find().populate('author')
  pagesData = pagesData.reverse()
  res.send(pagesData)
})
// router.use('/getOnePage', async (req, res) => {
//   let { _id } = req.body
//   let usersData = await users.findOne({ _id })
//   res.send(usersData)
// })
router.use('/edit', async (req, res) => {
  let { type, value, _id } = req.body
  // if (type == 'passWord') {
  //   value = md5(md5(value) + 'xingWiki')
  // }
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
