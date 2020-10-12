const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')
fs.readFile(fileName, (err, data) => {
    if (err) {
        console.log(err)
        return
    }
})

const content = '合伙人计划'
const opt = {
    flag: 'a'
}
fs.writeFile(fileName, content, opt, err => {
    if (err) {
        console.log(err)
        return
    }
})
