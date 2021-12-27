/*
 * @Author: litfa 
 * @Date: 2021-12-27 12:40:14 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-27 16:43:53
 */
module.exports = (req, res, next) => {
  // 账号状态
  if (!req.session.isLogin) {
    res.send({ code: 403, msg: '未登录' })
    return
  }
  if (req.session.status != 1) {
    res.send({ code: 403, msg: '账号状态异常' })
    return
  }

  if (config.allow_addDoc.indexOf(req.session.permission) == -1) {
    res.send({ code: 403, msg: '权限不足' })
    return
  }

  // 接收参数
  let { title, content } = req.body

  // 标题
  if (!config.editConfig.docTitle.rules.rule.test(title)) {
    return res.send({ code: 403, msg: config.editConfig.docTitle.tip })
  }

  // 内容
  if (!config.editConfig.docContent.rules.rule.test(content)) {
    return res.send({ code: 403, msg: config.editConfig.docContent.tip })
  }

  // 验证通过
  next()
}