/**
 * 验证码
 * @Author: litfa
 * @Date: 2021-9-1
 */

const authCode = require('express')()
// const users = require('./../../modules/users')
const svgCaptcha = require('svg-captcha')
// app.use(cookieParase())
// 已在 app.js 声明路由
authCode.use(async (req, res) => {
  logger.info(`获取图片验证码 ${req.userip}`)
  // 获取验证码
  var captcha = svgCaptcha.create({
    // 翻转颜色 
    inverse: false,
    // 字体大小 
    fontSize: 36,
    // 噪声线条数 
    noise: 0,
    // 宽度 
    width: 80,
    // 高度 
    height: 40
  })
  // 保存到session,忽略大小写 

  req.session.authCode = captcha.text.toLowerCase()
  // console.log(req.session); //0xtg 生成的验证码
  //保存到cookie 方便前端调用验证
  // res.cookie('captcha', req.session);
  res.setHeader('Content-Type', 'image/svg+xml')
  res.write(String(captcha.data))
  res.end()
})

module.exports = authCode

