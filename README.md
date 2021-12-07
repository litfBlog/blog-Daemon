# blog

状态码：
200: 正常
403: 权限不足
500: 未知错误


用户状态  
用户权限说明：  
0: 不可用  
1：正常  
2: 封禁  
3: 删除

用户权限(权限可在配置文件修改)  
admin: 最高权限   
operator: 管理员  
member: 成员  


文章状态  
0: 不可用(可能是未审核)  
1: 正常  
2: 封禁(不可见)  
3: 删除(删除不删除数据库 仅隐藏文章)
只要不是1就不展示

# 阅读量
1. 登录用户阅读增加阅读量，重复阅读不会增加  
1. 未登录用户将记录ip，同一ip只增加一次阅读量  
1. 文章中阅读量为0时显示为1  
1. 个人页和侧边栏展示发布文章的阅读量总和
[状态码](https://github.com/litfa/wiki-daemon/wiki/%E7%8A%B6%E6%80%81%E7%A0%81%E5%8F%8A%E7%94%A8%E6%88%B7%E7%8A%B6%E6%80%81%E8%AF%B4%E6%98%8E)

# 功能列表
- 文章通过id访问 √
- 用户id √
- 文章状态 √
- 删除文章 √
- 用户状态 √
- 后台管理 √
- 发布文章 保存草稿
- 编辑文章 √
- 编辑记录 √
- 文章封面
- 用户不存在的处理 √
- 搜索 √


# api相关操作
### 文章路由

#### 文章图片 静态资源
- 请求方式：get
- 请求路径 /api/data/img/{资源id}/{文件名}


#### 用户头像
- 请求方式：get
- 请求路径 /api/data/userAvatar/{文件名}




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
// 单个页面  (返回 md转换html后的字符串)
app.use('/api/docs/findOne', require('./router/docs/findDoc'))
// 点赞
app.use('/api/docs/likeDoc', require('./router/docs/likeDoc'))
// 首页文章列表
app.use('/api/docs/find', require('./router/docs/findDocInIndex'))
// 搜索
app.use('/api/docs/search', require('./router/docs/search'))
// 查看自己的文章
app.use('/api/docs/findMyDoc', require('./router/docs/findMyDoc'))
// 删除自己的文章
app.use('/api/docs/rmMyDoc', require('./router/docs/rmDoc'))
// 发布文章
app.use('/api/docs/add', require('./router/docs/addDoc'))
// 修改文章
app.use('/api/docs/edit', require('./router/docs/editDoc'))

// 后台管理
app.use(config.admin_path, express.static('./public'))
// 登录
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