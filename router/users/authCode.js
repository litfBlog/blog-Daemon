/*
 * 验证码
 * @Author: litfa 
 * @Date: 2021-12-08 16:42:25 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-08 16:42:52
 */

const authCode = require('express')()
const svgCaptcha = require('svg-captcha')
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
  res.setHeader('Content-Type', 'image/svg+xml')
  res.write(String(captcha.data))
  res.end()
})

module.exports = authCode

