// 测试计时器是否正常工作，2秒手动取消，7秒之后再检查状态是否正常
// 因为2秒后计时器已经取消了，所以只会出现一次打牌！
import { Timer } from "../../server/Timer"

let room_id = 10001
let timer = new Timer(room_id, () => {
  console.log("打牌")
})
console.log("等待2秒")
setTimeout(() => {
  timer.cancel()
  console.log("当前计时器状态：" + timer.state)
}, 2 * 1000)
console.log("等待7秒")
setTimeout(() => {
  console.log("当前计时器状态：" + timer.state)
  console.log(timer.my_fn)
}, 7 * 1000)
