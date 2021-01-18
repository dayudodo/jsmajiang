import { isMaster } from "cluster"
import { exit } from "process"
import * as config from "./config"

/**计时器类
 * 1、当服务器进入等待状态时启动
 * 2、超过规定时间退出或玩家有操作后退出
 * 3、一个房间有且仅有一个计时器
 */
export class Timer {
  /**计时器状态，分为waiting, end */
  public state = ""
  public id: number
  public timeout_fn: any
  public my_fn: NodeJS.Timeout
  constructor(id: number, timeout_fn: Function) {
    this.state = "waiting"
    this.id = id
    this.timeout_fn = timeout_fn
    this.start()
  }
  /**
   * 计时过后运行timeout_fn函数
   * @param timeout_fn 一般为自动打牌函数
   * @param id 计时器唯一标识
   * @param maxWaitTime 最大等待秒数
   */
  start(maxWaitTime = config.MaxWaitTime) {
    this.my_fn = setTimeout(() => {
      this.state = "end"
      this.timeout_fn()
    }, maxWaitTime * 1000)
  }
  /**
   * 取消计时, 或者时间未到，由用户取消
   */
  cancel() {
    if ("waiting" == this.state) {
      console.log(`取消计时器${this.id}`)
      this.state = "end"
      clearTimeout(this.my_fn)
      this.timeout_fn()
    }
  }
}

