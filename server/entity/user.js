const db = require("../core/db")
const snowUtil = require("../util/snowflake")
const timeUtil = require("../util/time")

module.exports = {
  create(username, password, mobile, deptId, postId) {
    const time = timeUtil.getTime(timeUtil.newDate())
    const list = [
      { key: "id", value: snowUtil.newUniqueId(true) },
      { key: "user_name", value: username },
      { key: "password", value: password },
      { key: "mobile", value: mobile },
      { key: "level", value: 1 },
      { key: "dept_id", value: deptId },
      { key: "post_id", value: postId },
      { key: "create_time", value: time },
      { key: "update_time", value: time },
    ]

    const keys = list.map(o => o.key)
    const values = list.map(o => o.value)
    return db.exec(`INSERT INTO user (${keys.join(',')}) VALUES(${keys.map(() => '?').join(',')})`, values)
  },

  update(id, username, mobile, level, deptId, postId) {
    const keys = ['user_name', 'mobile', 'level', 'dept_id', 'post_id']
    const values = [username, mobile, level, deptId, postId, id]
    return db.exec(`UPDATE user SET ${keys.map(v => v + '=?').join(',')} WHERE id=?`, values)
  },

  delete(id) {
    return db.exec(`DELETE FROM user WHERE id=?`, id)
  },

  login(mobile, password) {
    const values = [mobile, password]
    return db.exec(`SELECT id, user_name AS username, mobile, password, level, dept_id AS deptId, post_id AS postId, create_time AS createTime, update_time AS updateTime FROM user WHERE mobile=?`, values)
  },

  list(page, size) {
    const limit = size
    const offset = (page - 1) * size
    return db.exec(`SELECT id, user_name AS username, mobile, level, dept_id AS deptId, post_id AS postId, create_time AS createTime, update_time AS updateTime FROM user LIMIT ? OFFSET ?`, [limit, offset])
  },
  listCount() {
    return db.exec(`SELECT COUNT(id) AS count FROM user `)
  }
}