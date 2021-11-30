const router = require('express')()

const docs = require('../../modules/docs')

router.use('/like', async (req, res) => {
  let { _id } = req.body
  // let likes = await docs.findOne({ _id }, {
  //   like: 1
  // })
  // 点赞
  // 登录用户
  // if (req.session.isLogin) {
  //   for (let i in likes) {
  //     // 判断用户是否看过该文章，若看过不增加阅读量
  //     // 该项有 _id 且等于该用户 id
  //     if (likes[i]._id && req.session.uid == likes[i]._id) {
  //       // 点过赞的 return 不再判断
  //       return res.send({ code: 403, msg: '您已赞过该文章', liked: true })
  //     }
  //   }
  // }
  // let { id } = req.body
  docs.findByIdAndUpdate({ _id: _id }, {
    $push: {
      likes: {
        // 记录用户id及阅读时间
        // _id: req.session.uid,
        ip: req.userip,
        date: Date.now()
      }
    }
  }).then((e) => {
    console.log(e)
    res.send({ id: _id, code: 200 })
  })
})
// router.use('/unlike', (req, res) => {

// })

module.exports = router