const mongoose = require('mongoose')

mongoose
  .connect(config.dbUrl, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('链接成功')
    // logger.info("数据库链接成功")
  })
  .catch((err) => {
    console.log(err)
  })
