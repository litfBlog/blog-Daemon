/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:42:14 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-08 16:42:54
 */
const router = require('express')()

const docs = require('../../modules/docs')

router.use('/get', async (req, res) => {
  let { _id } = req.body
  let { likes: likesData } = await docs.findOne({ _id }, {
    likes: 1
  })

  let liked = false
  if (req.session.isLogin) {
    for (let i in likesData) {
      if (likesData[i]._id || likesData[i]._id == req.session.uid) {
        liked = true
        break
      }
    }
  } else {
    // 未登录 判断ip
    for (let i in likesData) {
      if (likesData[i].ip === req.userip) {
        liked = true
        break
      }
    }
  }

  res.send({ code: 200, liked, likes: likesData.length })
})

router.use('/like', async (req, res) => {
  let { _id } = req.body
  let { likes: likesData } = await docs.findOne({ _id }, {
    likes: 1
  })

  // 点赞
  // 循环判断
  // 登录用户
  let likes = {}
  if (req.session.isLogin) {
    for (let i in likesData) {
      if (likesData[i]._id || likesData[i]._id == req.session.uid) {
        return res.send({ code: 403, msg: '您已赞过该文章' })
      }
    }
    likes = {
      _id: req.session.uid,
      ip: req.userip,
      date: Date.now()
    }
  } else {
    // 未登录 判断ip
    for (let i in likesData) {
      if (likesData[i].ip === req.userip) {
        return res.send({ code: 403, msg: '您已赞过该文章' })
      }
    }
    likes = {
      ip: req.userip,
      date: Date.now()
    }
  }

  docs.findByIdAndUpdate({ _id: _id }, {
    $push: {
      likes
    }
  }).then(() => {
    res.send({ id: _id, code: 200 })
  })
})
router.use('/unlike', (req, res) => {
  let { _id } = req.body
  let likes = {}
  if (req.session.isLogin) {
    likes = {
      _id: req.session.uid
    }
  } else {
    likes = {
      ip: req.userip
    }
  }
  docs.findByIdAndUpdate({ _id: _id }, {
    $pull: {
      likes
    }
  }).then(() => {
    res.send({ id: _id, code: 200 })
  }).catch(() => {
    res.send({ code: 500, msg: '您未赞过该文章' })
  })
})

module.exports = router