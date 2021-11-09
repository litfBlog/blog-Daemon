const router = require('express')()
const users = require('./../../modules/users')
const md5 = require('md5')

router.use('/getUsers', async (req, res) => {
  let usersData = await users.find()
  res.send(usersData)
})
router.use('/getOneUsers', async (req, res) => {
  let { _id } = req.body
  let usersData = await users.findOne({ _id })
  res.send(usersData)
})
router.use('/edit', async (req, res) => {
  let { type, value, _id } = req.body
  if (type == 'passWord') {
    value = md5(md5(value) + 'xingWiki')
  }
  users.findByIdAndUpdate({
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




