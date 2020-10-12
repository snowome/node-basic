const fs = require('fs')
const path = require('path')
const readline = require('readline')

/** 文件名 **/
const fileName = path.resolve(__dirname, '../', '../', 'logs', 'access.log')

/** 创建read stream **/
const readStream = fs.createReadStream(fileName)

/** 常见read line 对象 **/
const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

rl.on('line', lineData => {
    if (!lineData) {
        return
    }
    sum++
    const arr = lineData.split(' —— ')
    if (arr[3] && arr[3].indexOf('Chrome') > 0) {
        chromeNum++
    }
})
rl.on('close', () => {
    console.log('chrome占比：', chromeNum / sum)
    console.log('总访问量：', sum)
})
