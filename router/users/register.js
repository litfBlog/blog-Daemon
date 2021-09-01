/**
 * 登录功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const register = require('express')()
const users = require('./../../modules/users')

// 已在 app.js 声明路由
register.use('/register', (req, res) => {
  let { userName, email, password, authCode } = req.body
})

//引入multer
const multer = require('multer')
//设置上传文件存储地址
const upload = multer({ dest: 'uploads/' })

register.post('/upload', upload.single('file'), (req, res, next) => {
  //返回客户端的信息
  let data = {}
  data['code'] = 200
  //获取文件
  let file = req.file
  if (file) {
    //获取文件名
    let fileNameArr = file.originalname.split('.')
    //获取文件后缀名
    var suffix = fileNameArr[fileNameArr.length - 1]
    //文件重命名
    fs.renameSync('./uploads/' + file.filename, `新路径+新文件名.${suffix}`)
    file['newfilename'] = `新文件名.${suffix}`
  }
  data['file'] = file
  res.send(data)
})
module.exports = register