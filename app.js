const axios = require('axios')
const express = require('express')
const path = require('path')
const { readFile, writeFile, readFileSync } = require('fs')

const app = express()

const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// 初始化 Cookie and Session 的基础功能

app.use(cookieParser())
app.use(
  bodyParser.urlencoded({
    extended: false
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
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    resave: false,
    saveUninitialized: false
  })
)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
// 登录
app.use('/login', async (req, res) => {
  let { username, password } = req.body
  let data = readFileSync('./users/users.json', 'utf8')
  data = JSON.parse(data)
  for (i in data) {
    if (data[i].username == username && data[i].password == md5(password)) {
      req.session.user = {
        username,
        uuid: data[i].uuid,
        isLogin = true
      }
      res.send({ status: 200, msg: '登录成功' })
      return
    } else {
      console.log('密码错误')
      break
    }
  }
  req.session = {}
  res.send({ status: 500, msg: '账号或密码错误' })
})
app.use('/api', require('./router/api'))
app.use(express.static('docs/.vuepress/dist/'))
console.log(111)
app.listen(3000)
