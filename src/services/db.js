import mysql from "mysql2/promise";
import config from "../configs/config.js";
const pool = mysql.createPool(config.db);

export default async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
}

