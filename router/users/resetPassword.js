const path = require('path')
const fs = require('fs')

const router = require('express')()

// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')
// uuid
// const uuid = require('uuid')
const users = require('./../../modules/users')

router.use('/authEmail', (req, res) => {
  let { email, authCode } = req.body
  if (authCode != req.session.authCode) return res.send({ code: 200, msg: '验证码有误' })
})

module.exports = router