import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import db from './db'
import { BaseResp } from './types/BaseResp'
import { DetailResp } from './types/DetailResp'
import { DetailPerson, Person } from './types/Person'

dotenv.config()

const app = express()

async function fetchSql(query: string) {
    const [rows, fields] = await db.query(query)
    return { rows, fields }
}

app.get('/', async (req: Request, res: Response) => {
    const query = req.query
    try {
        if (query.code && parseInt(query.code.toString()) > 0) {
            const generation = query.code.toString().split('.')
            const parentGeneration = generation.slice(0, generation.length - 1)
            const self = await fetchSql(`SELECT * FROM members WHERE code = '${query.code}'`)
            const parent = await fetchSql(`SELECT id, code, name FROM members WHERE code = '${parentGeneration.join('.')}'`)
            const child = await fetchSql(`SELECT id, code, name FROM members WHERE status = 'Biological' AND code LIKE '${query.code}.%' AND code NOT LIKE '${query.code}.%.%' ORDER BY code ASC`)
            const result: DetailResp = {
                status: 200,
                message: 'OK',
                data: {
                    self: self.rows as DetailPerson[],
                    parents: parent.rows as DetailPerson[],
                    childs: child.rows as Person[]
                }
            }
            res.json(result)
        } else {
            const members = await fetchSql('SELECT id, code, name FROM members ORDER BY name ASC')
            const result: BaseResp = {
                status: 200,
                message: 'OK',
                data: members.rows
            }
            res.json(result)
        }
    } catch (err) {
        console.error('Error:', err)
        const resp: BaseResp = {
            status: 500,
            message: 'Internal Server Error'
        }
        res.status(resp.status).send(resp)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}`)
})