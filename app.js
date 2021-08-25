global.config = {}
require('./config')
const express = require('express')
const app = express()

const path = require('path')
const fs = require('fs')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// 初始化 Cookie and Session 的基础功能
app.use(cookieParser())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(bodyParser.json())
// 初始化 Session 功能
var UUID = require('uuid')
const md5 = require('md5')
app.use(
  session({
    secret: UUID.v4(),
    name: 'Xing-wiki-id',
    cookie: {
      // 7天
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    resave: false,
    saveUninitialized: false,
  })
)

// 跨域配置
app.use((req, res, next) => {
  if (config.allowCorf) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
  }
  next()
})

// 监听端口
app.listen(config.port, () => {
  console.log('listen ' + config.port)
})
