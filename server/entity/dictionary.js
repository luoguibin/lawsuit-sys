
const db = require("../core/db")
const snowUtil = require("../util/snowflake")

module.exports = {
  create(parentId = -1, key, label, value, remark = '') {
    const keys = ['id', 'parent_id', 'dict_key', 'dict_label', 'dict_value', 'remark']
    const values = [snowUtil.newUniqueId(true), parentId, key, label, value, remark]
    return db.exec(`INSERT INTO dictionary (${keys.join(',')}) VALUES(${keys.map(() => '?').join(',')})`, values)
  },
  update(id, key, label, value, remark) {
    return db.exec(`UPDATE dictionary SET dict_key=?, dict_label=?, dict_value=?, remark=? WHERE id=?`, [key, label, value, remark, id])
  },
  delete(id) {
    return db.exec(`DELETE FROM dictionary WHERE id=?`, [id])
  },
  list(parentId = -1) {
    return db.exec(`SELECT id, parent_id AS parentId, dict_key AS dictKey, dict_label AS dictLabel, dict_value AS dictValue, remark FROM dictionary WHERE parent_id=?`, [parentId])
  },
  detailByKey(key) {
    return db.exec(`SELECT id, parent_id AS parentId, dict_key AS dictKey, dict_label AS dictLabel, dict_value AS dictValue, remark FROM dictionary WHERE dict_key=?`, [key])
  },
  listChildrenByKey(key) {
    return db.exec(`SELECT id, parent_id AS parentId, dict_key AS dictKey, dict_label AS dictLabel, dict_value AS dictValue, remark FROM dictionary WHERE parent_id IN (SELECT id FROM dictionary WHERE dict_key=?)`, [key])
  }
}