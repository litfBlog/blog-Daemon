// 监听端口
config.port = '3000'
// 允许跨域
config.allowCorf = true
// 数据库
config.dbUrl = 'mongodb://127.0.0.1/xingwiki'
// 允许发表内容的
config.allow_addDoc = ['admin', 'member']

config.mail.host = ''
config.mail.secureConnection = true
config.mail.port = 465
config.mail.auth = {
  user: "",
  pass: ""
}
config.mail.from = ""