const timeUtil = require('./time')

// 64位， 首位不用，41位时间戳，5位工作ID，12位序列号
// Number.MAX_SAFE_INTEGER = 9007199254740991
//                           2378724359053317n

const TIME_STAMP_BITS = 41n
const WORKER_ID_BITS = 5n
const SEQUENCE_BITS = 12n
const MAX_SEQUENCE = (1n << SEQUENCE_BITS) - 1n
const TIME_STAMP_BIT_OFFSET = WORKER_ID_BITS + SEQUENCE_BITS
const WORKER_ID_BIT_OFFSET = SEQUENCE_BITS
const START_TIME_STAMP = 1609430400000 // 2021-01-01 00:00:00

const workerId = 10n

const newTimestamp = function () {
  return BigInt(timeUtil.now() - START_TIME_STAMP)
}

const newNextTimestamp = function(timeStamp) {
  let tempStamp = newTimestamp()
  // 当单位时间内生产ID量超过MAX_SEQUENCE，则进入阻塞，直至获取到下一个时间戳
  while (tempStamp <= timeStamp) {
    tempStamp = newTimestamp()
  }
  return tempStamp
}

let sequence = 0n
let timeStamp = newTimestamp()
const nextId = function () {
  sequence++
  if (sequence > MAX_SEQUENCE) {
    sequence = 0n
    timeStamp = newNextTimestamp(timeStamp)
  }

  return (timeStamp << TIME_STAMP_BIT_OFFSET) | (workerId << WORKER_ID_BIT_OFFSET) | sequence
}

// const test = function() {
//   for (let i = 0; i < 10; i++) {
//     const id = nextId()
//     let bitStrs = id.toString(2)
//     if (bitStrs.length < 64) {
//       bitStrs = bitStrs.padStart(64, '0')
//     }
//     console.log(bitStrs.length, bitStrs.slice(0, 42), bitStrs.slice(42, 52), bitStrs.slice(52, 64), id);
//   }  
// }
// test()

module.exports = {
  newUniqueId: function(toString = true) {
    if (toString) {
      return nextId().toString()
    }
    return nextId()
  }
}