var nodemailer = require('nodemailer')
var user = require('./api/user/user.controller.js')

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sharium@gmail.com',
    pass: ''
  }
})

exports.reset = function (req, res) {
    // setup e-mail
  var newPass = user.resetPassword(req.query.email)

  var mailOptions = {
    from: 'Sharium <sharium@gmail.com>', // sender address
    to: req.query.email,
    subject: 'New Sharium password.', // Subject line
    html: '<b>Your new password is ' + newPass + '.  </b><a href="http://localhost:9000/login">Login here.</a>' // html body
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Message sent: ' + info.response)
    }
  })
  res.end()
}
