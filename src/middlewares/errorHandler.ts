import {NextFunction, Request, Response} from "express";
import logger from "../utils/logger";

async function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status ? err.status : 400
    logger.error('error ', err)
    if(err.errors) {
        return res.status(status).send({ errors: err.errors })
    }
    return res.status(status).send({error: err})
}
module.exports = {errorHandler}