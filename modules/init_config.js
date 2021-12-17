module.exports = `
// 监听端口
config.port = '3000'
// 数据库
config.dbUrl = 'mongodb://xing:123456@127.0.0.1/xingwiki'
// 允许发表内容的
config.allow_addDoc = ['admin', 'member']

config.mail.host = 'smtp.qq.com'
config.mail.secureConnection = true
config.mail.port = 465
config.mail.auth = {
  user: 'xing2233@foxmail.com',
  pass: 'gcxezidsjobtbaag'
}
config.mail.from = 'xing2233@foxmail.com'

config.admin_key_2md5 = '93e3eb81d1576043a222686c2659c791'

config.admin_path = '/admin123'

/**
 * 文章限制
 * 这些规则会在初始化时传递到前端
 * 在提交时后端仍会验证
 */
 config.editConfig.docTitle = {
  rules: {
    maxLength: 15,
    minLength: 2
  },
  tip: '标题长度为2~15个字符'
}
// 文章内容限制
config.editConfig.docContent = {
  rules: {
    maxLength: 1000000,
    minLength: 2
  },
  tip: '文章内容有点少哦~'
}
// 文章访问密码
config.editConfig.viewPassword = {
  rules: {
    maxLength: 15,
    minLength: 2
  },
  tip: '密码为2~15个字符'
}`