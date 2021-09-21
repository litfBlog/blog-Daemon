/**
 * xingWiki
 * @Author: litfa
 * @Date: 2021-8-23
 */

// log
var log4js = require("log4js");
global.logger = log4js.getLogger();
logger.level = "all"; // default level is OFF - which means no logs at all.
// logger.debug("Some debug messages");
let programName = "wikilog";
log4js.configure({
  appenders: {
    console: {//记录器1:输出到控制台
      type: 'console'
    },
    log_file: {//记录器2：输出到文件
      type: 'file',
      filename: __dirname + `/logs/${programName}.log`,//文件目录，当目录文件或文件夹不存在时，会自动创建
      maxLogSize: 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
      //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8',//default "utf-8"，文件的编码
    },
    data_file: {//：记录器3：输出到日期文件
      type: "dateFile",
      filename: __dirname + `/logs/${programName}`,//您要写入日志文件的路径
      alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
      // daysToKeep: 10,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
      //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
      pattern: "-yyyy-MM-dd hh:mm.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
      encoding: 'utf-8',//default "utf-8"，文件的编码
    },
    error_file: {//：记录器4：输出到error log
      type: "dateFile",
      filename: __dirname + `/logs/${programName}_error`,//您要写入日志文件的路径
      alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
      // daysToKeep: 10,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
      //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
      pattern: "_yyyy-MM-dd.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
      encoding: 'utf-8',//default "utf-8"，文件的编码
      // compress: true, //是否压缩
    }
  },
  categories: {
    default: { appenders: ['data_file', 'console', 'log_file'], level: 'info' },//默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可
    // production: { appenders: ['data_file'], level: 'warn' },  //生产环境 log类型 只输出到按日期命名的文件，且只输出警告以上的log
    // console: { appenders: ['console'], level: 'debug' }, //开发环境  输出到控制台
    // debug: { appenders: ['console', 'log_file'], level: 'debug' }, //调试环境 输出到log文件和控制台    
    error_log: { appenders: ['error_file'], level: 'error' }//error 等级log 单独输出到error文件中 任何环境的errorlog 将都以日期文件单独记录
  },
});
const fs = require('fs')

logger.info('初始化配置文件')

global.config = {}

if (!fs.existsSync('./config.js')) fs.copyFileSync('./modules/init_config.js', './config.js')

config.mail = {}
require('./configDev')

const uuid = require('uuid')

const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
// const express = require('express')
const app = express()

logger.info('初始化express')

// post解析
var bodyParser = require('body-parser') //用于req.body获取值的
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
// const marked = require('marked')
// const { default: axios } = require('axios')
// marked.setOptions({
//   highlight: function (code) {
//     return require('highlight.js').highlightAuto(code).value
//   },
// })
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
// 查看自己的文章
app.use('/api/docs/findMyDoc', require('./router/docs/findMyDoc'))
// 删除自己的文章
app.use('/api/docs/rmMyDoc', require('./router/docs/rmDoc'))
// 发布文章
app.use('/api/docs/add', require('./router/docs/addDoc'))
// 修改文章
app.use('/api/docs/edit', require('./router/docs/editDoc'))

// 后台管理
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

// app.use('/', express.static(''))
const { createProxyMiddleware } = require('http-proxy-middleware');
const HOST = 'http://127.0.0.1:8080', PORT = '8080';
// app.use(createProxyMiddleware('/adminadmin', {
//   target: 'htttp://127.0.0.1:8081', // target host
//   changeOrigin: true, // needed for virtual hosted sites
//   ws: true, // proxy websockets
//   pathRewrite: {
//     '^/adminadmin': '', // rewrite path
//   }
// }));
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
  // console.log('listen ' + config.port)
  logger.info(`listen port: ${config.port}`)
})
