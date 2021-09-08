const mysql = require('mysql')
const { db: configDB } = require('../config')

const pool = mysql.createPool(configDB)

const exec = async function (sql, params) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, con) {
      if (err) {
        reject(err)
        return
      }

      if (!params || !params.length) {
        con.query(sql, function (err, results, fields) {
          err ? reject(err) : resolve(results, fields)
        })
      } else {
        con.query(sql, params, function (err, results, fields) {
          err ? reject(err) : resolve(results, fields)
        })
      }
      pool.releaseConnection(con)
    })
  })

}

const db = {}
db.exec = exec

module.exports = db
