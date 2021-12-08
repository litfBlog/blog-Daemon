/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:36:18 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:36:18 
 */
/**
 * id自增
 * 在此文档记录 {name: 'docs', id: 1}
 * 插入文档时，此处id自增一，插入自增后的id 此id也是文章总数
 */

const mongoose = require('mongoose')

const idsSchema = new mongoose.Schema({
  name: String,
  id: Number
})
const ids = mongoose.model('Ids', idsSchema)

module.exports = ids
