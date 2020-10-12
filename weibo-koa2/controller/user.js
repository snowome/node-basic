const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../utils/crypto.js')

const login = async (username, password) => {
    username = escape(username)
    // 生成加密密码
    password = genPassword(password)
    // 防sql注入
    password = escape(password)
    const sql = `select username, realname from users where username = ${username} and password = ${password}`

    const result = await exec(sql)
    return result[0] || {}
}

module.exports = {
    login
}
