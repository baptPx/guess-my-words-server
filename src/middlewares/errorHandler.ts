import {NextFunction, Request, Response} from "express";

async function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if(err.errors) {
        return res.status(400).send({ errors: err.errors })
    }
    return res.status(400).send({error: err})
}
module.exports = {errorHandler}