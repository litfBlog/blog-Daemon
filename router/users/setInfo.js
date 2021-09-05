
const path = require('path')
const fs = require('fs')

const router = require('express')()

// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')
// uuid
// const uuid = require('uuid')
const users = require('./../../modules/users')

router.use(multer({
  dest: './userAvatar',
  limits: {
    //限制文件大小10MB
    fileSize: 10485760,
    //限制文件数量
    files: 1
  },
  fileFilter: function (req, file, cb) {
    // 限制文件上传类型，仅可上传png格式图片
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
}).any())

router.use('/upavatar', (req, res) => {
  console.log(req.files)
  console.log(req.session);
  if (req.files[0].mimetype == 'image/png' || req.files[0].mimetype == 'image/jpg' || req.files[0].mimetype == 'image/jpeg') {
    const filename = req.files[0].filename + path.parse(req.files[0].originalname).ext
    console.log(filename)
    fs.rename(req.files[0].path, `./userAvatar/${filename}`, async function (err) {
      if (err) {
        console.log(err)
        res.send({ code: 500, msg: '上传失败' })
      } else {
        await users.updateOne({ _id: req.session.uid }, {
          avatar: `/data/userAvatar/${filename}`
        })
        res.send({ code: 200 })
      }
    })
  } else {
    res.send({ code: 400, msg: '文件类型有误！' })
  }
})

module.exports = router
