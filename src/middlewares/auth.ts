import {NextFunction, Request, Response} from "express";

const jwt = require("jsonwebtoken");
const config = require('../config');

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    /*
     * Check if authorization header is set
     */

    console.log('verify token')
    if( req.headers && req.headers.authorization) {
        try {
            /*
             * Try to decode & verify the JWT token
             * The token contains user's id ( it can contain more informations )
             * and this is saved in req.user object
             */
            let user =  jwt.verify(req.headers.authorization.split(' ')[1], config.JWT_SECRET)
            res.locals.user = user
        } catch(err) {
            /*
             * If the authorization header is corrupted, it throws exception
             * So return 401 status code with JSON error message
             */
            return res.status(401).json({
                error: {
                    msg: 'Failed to authenticate token!'
                }
            });
        }
    } else {
        /*
         * If there is no autorization header, return 401 status code with JSON
         * error message
         */
        return res.status(401).json({
            error: {
                msg: 'No token!'
            }
        });
    }
    return next();

};
module.exports = { verifyToken }