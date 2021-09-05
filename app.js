/**
 * xingWiki
 * @Author: litfa
 * @Date: 2021-8-23
 */
const path = require('path')
const fs = require('fs')

global.config = {}
config.mail = {}
require('./configDev')

const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
// const express = require('express')
const app = express()

// post解析
var bodyParser = require('body-parser') //用于req.body获取值的
app.use(bodyParser.json())
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

app.use(
  session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    // 1天过期
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 },
  })
)

// 数据库
require('./modules/content')
// 跨域配置
app.use((req, res, next) => {
  //   if (config.allowCorf) {
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', true)
  //   //     // res.header({
  //   //     // res.header('Access-Control-Allow-Origin', '*')
  //   //     // res.header('Set-Cookie', 'myCookie=connect.sid; Domain=http://localhost/; Path=/login;')
  //   //     // res.header('Content-Type', 'text/plain')

  //   //     res.setHeader('Access-Control-Allow-Credentials', true)
  //   //     //因为设置允许携带cookie之后那么请求头Access-Control-Allow-Origin的值就不能设置为*，所以要另外指向一个
  //   //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/login')
  //   //     // })
  //   //   }
  next()
})
// const cors = require('cors')
// // var app = express()

// app.use(
//   cors({
//     credentials: true,

//     origin: 'http://127.0.0.1:8080', // web前端服务器地址

//     // origin: '*' // 这样会出错
//   })
// )
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080') //必须是具体网址 不是 *
//   res.header('Access-Control-Allow-Credentials: true') //是否支持cookie跨域
//   res.header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept')

//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')

//   res.header('X-Powered-By', ' 3.2.1')
//   if (req.method == 'OPTIONS') {
//     res.status(200)
//     // return
//   }
//   next()
// })

// app.use((req, res) => {
//   console.log(req.session)
//   req.session.set = 'set'
//   console.log(req.session)
//   res.send('1')
// })

// 初始化 marked 模块
const marked = require('marked')
const { default: axios } = require('axios')
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  },
})
// 预留目录+文件 后面做
// app.use('/docs/:dir/:file', (req, res) => {
//   console.log(req.params.file)
//   console.log(req.params.dir)
//   // console.log(req.params.fill, req.params.dir)
//   res.send(`two  /${req.params.file}/${req.params.dir}`)
// })
// 页面  (接口返回 md转换html后的字符串)
app.use('/docs', require('./router/docs/findDoc'))
app.use('/data/img', express.static('./uploads/'))
app.use('/data/userAvatar', express.static('./userAvatar/'))
// app.use('/docs/:file', (req, res) => {
//   console.log(req.params.file)
//   const fileName = req.params.file + '.md'
//   fs.readFile(path.join(__dirname, 'docs', fileName), 'utf8', (err, doc) => {
//     if (err) {
//       res.status(201).send({ status: 404 })
//     } else {
//       res.send(marked(doc))
//     }
//   })
// })
// api相关操作
// 所有用户相关，文章相关均在此路由

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
// 首页文章列表
app.use('/api/docs/find', require('./router/docs/findDocInIndex'))
// 发布文章
app.use('/api/docs/add', require('./router/docs/addDoc'))

// app.use('/', express.static(''))
const { createProxyMiddleware } = require('http-proxy-middleware');
const HOST = 'http://127.0.0.1:8080', PORT = '8080';
app.use(createProxyMiddleware('/', {
  target: HOST, // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  pathRewrite: {
    '^/': '', // rewrite path
  }
}));
// app.use(['/', '/login'], (req, res) => {
//   console.log(`http://127.0.0.1:8080${req.path}`);
//   axios({
//     method: 'GET',
//     url: `http://127.0.0.1:8080${req.path}`
//   }).then(doc => {
//     res.send(doc.data)
//   }).catch(err => {
//     console.log(err);
//   })
// })

// app.use('/css', express.static('./public/css'))
// app.use('/js', express.static('./public/js'))
// app.use('/img', express.static('./public/img'))
// app.use('/fonts', express.static('./public/fonts'))
// app.use('/', express.static('./public'))
// 监听端口
app.listen(config.port, () => {
  console.log('listen ' + config.port)
})
