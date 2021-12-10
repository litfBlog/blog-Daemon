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

config.admin_path = '/admin123'`