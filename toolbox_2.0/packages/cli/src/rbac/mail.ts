// import nodemailer module//
// require('dotenv').config()
import * as dotenv from "dotenv";

dotenv.config();

const nodemailer = require("nodemailer");
// import * as nodemailer from "nodemailer"
//export that module//

// export default mailSend
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "toolbox.services.2020@gmail.com",
        pass: "pcwffcmdepxglekh"
    }
});
// const mailOptions;
/*------------------SMTP Over-----------------------------*/
 
/*------------------Routing Started ------------------------*/

// tslint:disable-next-line: no-default-export
export default function (data:any) {
    // console.log("Data In Mail: ", data)
    // console.log("Verification Link: ",(data.url+data.token))
  const mailOptions = { 
        from: "toolbox.services.2020@gmail.com",
        to: data.username,
        subject: "Please confirm your Email account",
        html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${data.url+data.type+"/"+data.token}>Click here to verify</a>`
    };
    // console.log("---",mailOptions);
    smtpTransport.sendMail(mailOptions, (error:any, response:any) => {
        if (error) {
            console.log(error);
            return error;

        }
        else {
            // console.log("Message sent");

             return ("Message sent: " + JSON.stringify(response));

        }
    });
}
