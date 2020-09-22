import { Db } from '../';
import * as Moment from 'moment';
require('dotenv').config();
import { Request, Response, NextFunction } from "express";
// import { getRepository } from "typeorm";
// import {a} from '../index';

import * as bcrypt from "bcryptjs";
const saltRounds = 10;
import mail from "./mail";

const { v4: uuidv4 } = require('uuid');
import * as jwt from "jsonwebtoken";
// import { MySQLDb } from "../../databases/index";
// import { TokenAuth } from "../entity/tokenAuth";
// const { User , TokenAuth} =  MySQLDb;
const datetime = Moment().format('YYYY-MM-DD HH:mm:ss');


export class UserAuth {
    constructor() {

    }
    signup(req: Request, res: Response) {
        return new Promise((resolve, reject) => {

            // const token = getRepository(TokenAuth);
            // const userRepository = getRepository(User);
            // console.log("==============");

            // console.log(req.body);
            const obj = {
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                contact_number: req.body.contact_number,
                status: "pending",
                createdAt: datetime,
                updatedAt: datetime
            };
            // console.log(req.body.username);
            // const obj = new User();
            // obj.username = req.body.username;
            // obj.password = req.body.password;
            // obj.name = req.body.name;
            // obj.contact_number = req.body.contact_number;
            // obj.status = "pending";
            // obj.hashPassword();

            if (!req.body.contact_number) {
                reject(res.send({
                    status: 500,
                    msg: "Mobile No is required"
                }));
            }
            else if (!req.body.username) {
                reject(res.send({
                    status: 500,
                    msg: "username is required"
                }));
            }
            else if (!req.body.name) {
                reject(res.send({
                    status: 500,
                    msg: " Name is required"
                }));
            }
            else if (!req.body.password) {
                reject(res.send({
                    status: 500,
                    msg: "password required"
                }));
            }

            else {
                // tslint:disable-next-line: no-any
                bcrypt.hash(obj.password, saltRounds, (err: any, hash: any) => {
                    obj.password = hash;
                    if (err) {
                        reject(res.send(`${err}`));
                    } else {
                        Db.collections.Users!.find({
                            where: { "username": req.body.username }
                        })
                            .then(data => {
                                // //console.log("Data: ", data)
                                if (data.length > 0) {
                                    resolve(res.send({
                                        status: 500,
                                        msg: "username already taken."
                                    }));
                                } else {
                                    Db.collections.Users!.save(obj)
                                        .then(result => {

                                            const tokens = uuidv4();
                                            const tokenType = "mailAuth";
                                            mail(
                                                {
                                                    username: obj.username,
                                                    // tslint:disable-next-line: object-literal-shorthand
                                                    type: tokenType,
                                                    token: tokens,
                                                    url: 'http://localhost:5678/rest/verify/'
                                                }
                                            );
                                            // const obj1 = new TokenAuth();
                                            // obj1.userID = result.id,
                                            // obj1.token = tokens,
                                            // obj1.type = type,
                                            // obj1.verified = false,
                                            const tokenObj = {
                                                userID: result.id,
                                                token: tokens,
                                                type: tokenType,
                                                verified: false,
                                                createdAt: datetime,
                                                updatedAt: datetime
                                            };

                                            Db.collections.TokenAuth!.save(tokenObj)
                                                .then(() => {
                                                    resolve(res.send({
                                                        status: 200,
                                                        msg: "User created succesfully",
                                                        email_confirmation: "you have got confirmation email please confirm your email"
                                                    }));
                                                })
                                                .catch((err) => {
                                                    reject(res.send(`${err}`));
                                                });
                                        })
                                        .catch(err => {
                                            reject(res.send(`${err}`));
                                        });
                                }
                            })
                            .catch(err => {
                                reject(res.send(`${err}`));
                            });
                    }

                });
            }
        });
    }
    signin(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            // //console.log(req.body)
            // const token = getRepository(TokenAuth);
            // //  const user: User;
            // const obj = new User();
            // obj.username = req.body.username;
            // obj.password = req.body.password;
            // const userRepository = getRepository(User);
            const obj = {
                username: req.body.username,
                password: req.body.password
            };

            if (!req.body.username) {
                reject({
                    statuscode: (412),
                    msg: "email is required"
                });
            } else if (!req.body.password) {
                reject({
                    statusCode: 412,
                    msg: "password is required"
                });
            } else {
                Db.collections.Users!.findOne({
                    where: {
                        "username": req.body.username
                    }
                })
                    .then(data => {
                        // //console.log("Data:", data)
                        if (data != null) {
                            // tslint:disable-next-line: triple-equals
                            if (data.status == 'pending') {
                                const tokens = uuidv4();
                                //console.log(tokens)
                                const tokentype = "mailAuth";
                                mail(
                                    {
                                        username: data.username,
                                        type: tokentype,
                                        token: tokens,
                                        url: 'http://localhost:3000/user/verify/'
                                    }
                                );
                                Db.collections.TokenAuth!.update(
                                    {
                                        userID: data.id,
                                        type: tokentype,
                                        verified: false
                                    },
                                    {
                                        token: tokens
                                    },

                                )
                                    .then(() => {
                                        resolve(res.send("Please verify your email"));
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            }
                            else {
                                bcrypt.compare(req.body.password, data.password)
                                    .then(isMatch => {
                                        if (isMatch) {
                                            //Check log-in role
                                            Db.collections.Users!.update(
                                                {
                                                    username: data.username
                                                },
                                                {
                                                    last_login: datetime,
                                                    loggedInAs: "user"
                                                }

                                            )
                                                .then((result) => {
                                                    //console.log("+++++++++++++++++", result)
                                                    const payload = { subject: data.username, id: data.id };

                                                    const jwtToken = jwt.sign({
                                                        payload
                                                    },
                                                        "process.env.SECERET", {
                                                        expiresIn: "1h"
                                                    }
                                                    );
                                                    resolve(res.send({
                                                        msg: "successfully logged in",
                                                        data: {
                                                            email: req.body.email,
                                                            // tslint:disable-next-line: object-literal-shorthand
                                                            jwtToken: jwtToken
                                                        }
                                                    }));

                                                }).catch((err) => {
                                                    reject(res.send(`${err}`));
                                                });
                                        } else {
                                            resolve(res.send({
                                                status: 400,
                                                msg: "Authentication failed"
                                            }));
                                        }

                                    })
                                    .catch(err => {
                                        reject(res.send(`${err}`));
                                    });
                            }
                        } else {
                            resolve(res.send({
                                status: 400,
                                msg: "user not found"
                            }));
                        }
                    })
                    .catch(err => {
                        reject(res.send(`${err}`));
                    });
            }
        });
    }

    // forgetPassword(req) {
    //     return new Promise((resolve, reject) => {
    //         const data = {
    //             type: "forgetPassword",
    //             token: uuidv4(),
    //             verified: false
    //         }
    //         users.findOne({
    //             where: {
    //                 username: req.body.username
    //             }
    //         })
    //             .then(user => {
    //                 if (user != null) {
    //                     data.userId = user.id;
    //                     try {
    //                         mail.mailSend({ username: user.username, type: data.type, token: data.token, url: 'http://localhost:4201/user/verify/' })
    //                     }
    //                     catch (err) {
    //                         reject(`${err}`);
    //                     }
    //                     TokenAuth.create(data)
    //                         .then(token => {
    //                             resolve("Token generated!!!");
    //                         })
    //                         .catch(err => {
    //                             reject(`${err}`);
    //                         })
    //                 }
    //                 else {
    //                     reject("User not found!!!")
    //                 }
    //             })
    //             .catch(err => {
    //                 reject(`${err}`)
    //             })

    //     })
    // }

    // changePassword(req) {
    //     return new Promise((resolve, reject) => {
    //         const token = req.params.token
    //         TokenAuth.findOne({
    //             where: {
    //                 token: token,
    //                 verified: true
    //             }
    //         })
    //             .then((data) => {
    //                 if (data != null) {
    //                     if (new Date().getTime() > new Date(data.updatedAt).getTime() + 300000) {
    //                         resolve("Token expired...")
    //                     } else {
    //                         if (!req.body.newpassword) {
    //                             reject("new password required")
    //                         } else {
    //                             //console.log("---", data.userId)
    //                             bcrypt.hash(req.body.newpassword, saltRounds, function (err, hash) {
    //                                 // Store hash in your password DB.
    //                                 req.body.newpassword = hash
    //                                 // //console.log(hash)
    //                                 if (err) {
    //                                     reject(err)
    //                                 } else {
    //                                     // users.findOne({
    //                                     //     where: { "id": data.userId }
    //                                     // })
    //                                     //     .then(res => {
    //                                     //         // //console.log("Data: ", data)
    //                                     //         if (res.length > 0) {
    //                                     users.update(
    //                                         {
    //                                             password: req.body.newpassword
    //                                         },
    //                                         {
    //                                             "where": {
    //                                                 id: data.userId
    //                                             }
    //                                         }
    //                                     )
    //                                         .then((result) => {
    //                                             TokenAuth.update(
    //                                                 {
    //                                                     token: null
    //                                                 },
    //                                                 {
    //                                                     where: {
    //                                                         userId: data.userId,
    //                                                         type: "forgetPassword",
    //                                                         token: token
    //                                                     }
    //                                                 }
    //                                             )
    //                                                 .then((data) => {
    //                                                     resolve("Password reset successfully")
    //                                                 }).catch((err) => {
    //                                                     reject(`${err}`)
    //                                                 });
    //                                         }).catch((err) => {
    //                                             reject(`${err}`)
    //                                         });
    //                                     //     } else {
    //                                     //         resolve("no user found")
    //                                     //     }
    //                                     // })
    //                                     // .catch(err => {
    //                                     //     reject(`${err}`);
    //                                     // })
    //                                 }
    //                             });
    //                         }
    //                     }

    //                 } else {
    //                     resolve("invalid token !!")
    //                 }
    //             }).catch((err) => {
    //                 reject(`${err}`)
    //             });
    //     })
    // }

    verifyToken(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const token = req.params.token;
            const tokentype = req.params.type;
            //console.log("--->", token, type)
            // const tokenRepository = getRepository(TokenAuth);

            // const userRepository = getRepository(User);

            Db.collections.TokenAuth!.findOne({
                where: {
                    "token": token,
                    "type": tokentype,
                    "verified": false
                }
            })
                .then(data => {
                    //console.log("Data in Verify: ", data)
                    if (data != null) {
                        if (new Date().getTime() > new Date(data.updatedAt).getTime() + 300000) {
                            resolve(res.send("Token expired..."));
                        }
                        else {

                            // tslint:disable-next-line: triple-equals
                            if (tokentype == "mailAuth") {

                                Db.collections.TokenAuth!.update(
                                    {
                                        userID: data.userID,
                                        type: "mailAUth",
                                        verified: false
                                    },
                                    {
                                        token: null!,
                                        verified: true
                                    }

                                )
                                    .then(() => {
                                        Db.collections.Users!.update(
                                            {

                                                id: data.userID

                                            },
                                            {
                                                // remember_me: null,
                                                status: 'active'
                                            }

                                        )
                                            .then(() => {
                                                resolve(res.send("Verification complete!!!"));
                                            })
                                            .catch(err => {
                                                reject(res.send(`${err}`));
                                            });
                                    })
                                    .catch(err => {
                                        reject(res.send(`${err}`));
                                    });

                            }
                            // tslint:disable-next-line: triple-equals
                            else if (tokentype == "forgetPassword") {
                                Db.collections.TokenAuth!.update(
                                    {
                                        userID: data.userID,
                                        type: "forgetPassword",
                                        // tslint:disable-next-line: object-literal-shorthand
                                        token: token

                                    },
                                    {
                                        token: null!,
                                        verified: true
                                    }

                                )
                                    .then(() => {
                                        resolve(res.send("Link Verified!!!"));
                                    })
                                    // tslint:disable-next-line: no-any
                                    .catch((err: any) => {
                                        reject(res.send(`${err}`));
                                    });
                            }
                            else {
                                resolve(res.send("Verification link expired!!!"));
                            }
                            // else {
                            //     resolve("Invalid token!!!")
                            // }
                        }
                    } else {
                        resolve(res.send("invalid token"));
                    }

                })
                .catch(err => {
                    // //console.log(err)
                    reject(res.send(`${err}`));
                });
        });
    }

}



// export default UserAuth;

