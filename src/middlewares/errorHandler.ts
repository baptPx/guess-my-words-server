import {NextFunction, Request, Response} from "express";

async function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if(err.errors) {
        return res.send({ errors: err.errors })
    }
    return res.send({error: err})
}
module.exports = {errorHandler}