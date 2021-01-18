// 测试计时器是否正常工作，2秒手动取消，7秒之后再检查状态是否正常
// 因为2秒后计时器已经取消了，所以只会出现一次打牌！
import * as config from "../../server/config"
import { Timer } from "../../server/Timer"

let room_id = 10001
let timer = new Timer(room_id, () => {
  console.log("打牌")
})
let userThingTime = 2
console.log(`等待${userThingTime}秒`)
setTimeout(() => {
  timer.cancel()
  console.log("当前计时器状态：" + timer.state)
}, 2 * 1000)
let beyondConfigMaxtime = config.MaxWaitTime + 2
console.log(`系统等待${beyondConfigMaxtime}秒`)
setTimeout(() => {
  console.log(`系统等待${beyondConfigMaxtime}秒后计时器状态：` + timer.state)
  console.log(timer.my_fn)
}, 7 * 1000)

let timer1 = new Timer(room_id, () => {
  console.log("超时自动打牌")
})
console.log(`timer1超时等待${beyondConfigMaxtime}秒`)
setTimeout(() => {
  console.log(`timer1系统等待${beyondConfigMaxtime}秒后计时器状态：` + timer1.state)
}, 7 * 1000)