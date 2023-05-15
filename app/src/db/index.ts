import { Pool } from "pg"
import * as pgConfig from "../config/pg.json"
import {exec} from "child_process";

const pool = new Pool(pgConfig)

if (pgConfig.use_ssh_tunnel) {
    exec(`ssh -L ${pgConfig.port}:${pgConfig.tunnel_host}:${pgConfig.tunnel_port} ${pgConfig.ssh_user}@${pgConfig.ssh_host}`)
}

export default async function query(text: string, values?: any[]) {
    const start = Date.now()
    return pool.query(text,values).then(result => {
        const end = Date.now()
        const duration = end - start
        console.log('executed query', { text, duration, rows: result.rowCount })
        return result
    })
}
