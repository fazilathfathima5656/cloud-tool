import * as jwt from "jsonwebtoken";
// const config=require('../config.json')
import { Request, Response, NextFunction } from "express";

require('dotenv').config();

export  function middleware(req:Request, res:Response, next:NextFunction){
    try {
        const jwtToken:any = req.headers.authorization;
        // tslint:disable-next-line: only-arrow-functions
        jwt.verify(jwtToken, "process.env.SECERET",function (err:any, decoded:any){
            if (err) {
               res.status(401).json({
                    status: 401,
                    "error": true,
                    msg: 'UNAUTHORIZED ACCESS'
                });
            } else {
               // console.log("jwt: ",decoded)
                // req.decoded = decoded
                (req as any).decoded = decoded;
                next();
            }
        });
    } catch (error) {
         res.status(401).json({
            msg: "auth failed"
        });
    }

}

