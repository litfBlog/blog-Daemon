/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:35:40 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-10 20:29:39
 */

// log
global.logger = {}
require('./modules/log')

const fs = require('fs')
const path = require('path')

logger.info('初始化配置文件')

global.config = {}

if (!fs.existsSync('./config.js')) {
  logger.info('未找到配置文件， 将生成默认配置')
  // 生成配置文件
  try {
    fs.writeFileSync('./config.js', require('./modules/init_config'))
  } catch (e) {
    logger.error('配置文件生成失败', e)
  }
  logger.info('配置文件生成成功')
  logger.warning('默认配置会导致部分功能不可用，请修改配置文件')
}
config.mail = {}
require('./config')

const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()

logger.info('初始化express')

// post解析
var bodyParser = require('body-parser') // 用于req.body获取值的
app.use(bodyParser.json())
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

app.use((req, res, next) => {
  try {
    req.userip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    req.userip = req.userip.match(/\d+\.\d+\.\d+\.\d+/)[0]
  } catch (e) {
    logger.error(e)
  }
  next()
})

const uuid = require('uuid')

app.use(
  session({
    name: 'xingWiki',
    secret: uuid.v4(), // 建议使用 128 个字符的随机字符串
    // 1天过期
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 },
    resave: true,
    saveUninitialized: 'aaa'
  })
)

// 数据库
require('./modules/content')

// api相关操作
// 所有用户相关，文章相关均在此路由

// 文章中的图片
app.use('/api/data/img', express.static('./uploads/'))
// 用户头像
app.use('/api/data/userAvatar', express.static('./userAvatar/'))

// 用户相关
// 登录
app.use('/api/user/login', require('./router/users/login'))
// 登录状态
app.use('/api/user/loginStatus', require('./router/users/loginStatus'))
// 注册
app.use('/api/user/register', require('./router/users/register'))
// 设置资料
app.use('/api/user/setInfo', require('./router/users/setInfo'))
// 验证码
app.use('/api/authCode', require('./router/users/authCode'))

// 文章相关操作
// 单个页面  (返回 md转换html后的字符串)
app.use('/api/docs/findOne', require('./router/docs/findDoc'))
// 点赞
app.use('/api/docs/likeDoc', require('./router/docs/likeDoc'))
// 首页文章列表
app.use('/api/docs/find', require('./router/docs/findDocInIndex'))
// 搜索
app.use('/api/docs/search', require('./router/docs/search'))
// 查看自己的文章
app.use('/api/docs/findMyDoc', require('./router/docs/findMyDoc'))
// 删除自己的文章
app.use('/api/docs/rmMyDoc', require('./router/docs/rmDoc'))
// 发布文章
app.use('/api/docs/add', require('./router/docs/addDoc'))
// 修改文章
app.use('/api/docs/edit', require('./router/docs/editDoc'))

// 后台管理
app.use(config.admin_path, express.static('./public'))
// 登录
app.use('/api/admin/login', require('./router/admin/login'))
// 验证登录
app.use('/api/admin', (req, res, next) => {
  if (req.session.adminIsLogin) {
    next()
  } else {
    res.redirect('/')
    res.send()
  }
})
// 用户管理
app.use('/api/admin/user', require('./router/admin/user'))
// 文章管理
app.use('/api/admin/page', require('./router/admin/pages'))

// 静态资源
const connectHistoryApiFallback = require('connect-history-api-fallback')

app.use('/', connectHistoryApiFallback())

app.use('/', express.static(path.join(__dirname, 'dist')))

// 监听端口
app.listen(config.port, () => {
  // console.log('listen ' + config.port)
  logger.info(`listen port: ${config.port}`)
})
