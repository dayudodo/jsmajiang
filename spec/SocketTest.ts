import _ = require("lodash");
import { puts } from "../server/room";

export class SocketTest {
  public id: any;
  public username: string;
  //保存最后一次发送的消息，专门用来检查看是否正确！
  public arr_msg: Array<object> = [];
  constructor(username: string) {
    this.username = username;
    this.id = Math.random();
  }
  get latest_msg() {
    return _.last(this.arr_msg);
  }
  sendmsg(msg) {
    this.arr_msg.push(msg);
    console.log(`===${this.username} msg==`);
    // for (let key in msg) {
    //   console.log(chalk.green(`${key}: ${msg[key]}`))
    // }
    puts(msg);
    console.log(`===${this.username} end===`);
  }
}
