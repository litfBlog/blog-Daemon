/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:36:44 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:36:44 
 */
const ndoemailer = require('nodemailer')

const sendMail = (to, type, title, content) => {
    let transporter = ndoemailer.createTransport({
        host: config.mail.host,
        secureConnection: config.mail.secureConnection,
        port: config.mail.port,
        secure: true,
        auth: {
            user: config.mail.auth.user,
            pass: config.mail.auth.pass
        }
    })

    let mailOptions = {
        from: config.mail.from,
        to: to,
        subject: title
    }
    if (type == 'html') {
        mailOptions.html = content
    } else if (type == 'text') {
        mailOptions.text = content
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('发送成功：')
            console.log(info)
        }
    })
}

module.exports = sendMail