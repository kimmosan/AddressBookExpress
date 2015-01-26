var email = require('emailjs');

var emailServer = email.server.connect({
    user: "teeteppo@gmail.com",
    password: "strongpassword123",
    host: "smtp.gmail.com",
    tls: true
});

exports.sendEmail = function(req, res){
    
    var emailData = {
        text: req.body.message,
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject
    }
    
    console.log(emailData);
    
    emailServer.send(emailData, function(err, data){
        if(err) {
            console.log(err);
        }
        else {
            console.log(data);
            res.redirect('/names');
        }
    });
}
    