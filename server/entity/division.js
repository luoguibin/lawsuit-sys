const db = require("../core/db")

module.exports = {
  list(parentId = -1) {
    return db.exec(`SELECT id, name, parent_id AS parentId, level FROM administrative_division WHERE parent_id=?`, [parentId])
  },
}