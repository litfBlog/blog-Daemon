
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
  // 判断文件大小及类型
  if (req.files[0].mimetype == 'image/png' || req.files[0].mimetype == 'image/jpg' || req.files[0].mimetype == 'image/jpeg') {
    const filename = req.files[0].filename + path.parse(req.files[0].originalname).ext
    console.log(filename)
    // 重命名图片
    fs.rename(req.files[0].path, `./userAvatar/${filename}`, async function (err) {
      if (err) {
        console.log(err)
        res.send({ code: 500, msg: '上传失败' })
      } else {
        // 查询数据库中旧文件名
        let { avatarFileName } = await users.findOne({ _id: req.session.uid })
        // 旧头像移动到回收站
        // 数据库有头像时再发，没头像显示的默认头像 无需删除
        if (avatarFileName) fs.renameSync(`./userAvatar/${avatarFileName}`, `./delLoads/${avatarFileName}`)
        // 更新数据库数据
        await users.updateOne({ _id: req.session.uid }, {
          avatar: `/data/userAvatar/${filename}`,
          avatarFileName: filename
        })
        res.send({ code: 200 })
      }
    })
  } else {
    res.send({ code: 400, msg: '文件类型有误！' })
  }
})

module.exports = router
