/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:36:09 
 * @Last Modified by: litfa
 * @Last Modified time: 2021-12-08 16:38:43
 */
const mongoose = require('mongoose')

mongoose
  .connect(config.dbUrl, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    // console.log('链接成功')
    logger.info('数据库链接成功')

  })
  .catch((err) => {
    console.log(err)
  })
