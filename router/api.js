const app = require('express')()
const { writeFile, readFile } = require('fs')
var UUID = require('uuid')

app.use('/add', async (req, res) => {
  // 文章信息
  const { name, title, content, info } = req.body
  // 获取所有文章
  let data = readFile('./docs/docs.json')
  data = JSON.parse(data)
  // 判断文件已存在
  for (i in data) {
    if (data[i].fileName == name) {
      res.send({ status: 500, msg: '该文件已存在' })
    }
  }
  // 添加信息
  data.push({
    uuid: UUID.v4(),
    title: title,
    fileName: `${name}.md`,
    parseFile: `${name}.html`,
    parsePath: `/${fileName}.html`,
    date: Date.now(),
    author: '',
    edit: [
      {
        author: '',
        date: Date.now(),
        content: content,
        ip: req.ip.match(/\d+\.\d+\.\d+\.\d+/)
      }
    ]
  })
  // 写入信息
  let state = await writeFile(`./docs/${name}.md`, content, 'utf8')
  // writeFile()

  console.log(state)
})

module.exports = app
