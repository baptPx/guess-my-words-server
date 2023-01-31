import {NextFunction, Request, Response} from 'express'
const express = require('express')
const app = express()
const crypto = require('crypto')

app.post('/', async (req: Request, res: Response) => {

    Object.keys(req.files).forEach(fileKey => {
        const file = req.files[fileKey]
        const randomUUID = crypto.randomUUID()
        file.mv('maps/' + randomUUID + '.png')
    })
    return res.send({ok: req.files})
})


app.get('', async (req: Request, res: Response) => {
    console.log('reach GET')
    return res.send({ok: true})
})

module.exports = app