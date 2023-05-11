import { Pool } from "pg"
import * as pgConfig from "../config/pg.json"

const pool = new Pool(pgConfig)

export default async function query(text: string, values?: any[]) {
    const start = Date.now()
    return pool.query(text,values).then(result => {
        const end = Date.now()
        const duration = end - start
        console.log('executed query', { text, duration, rows: result.rowCount })
    })
}