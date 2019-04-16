import test from "ava"
import * as util from "util"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import * as config from "../../server/config"
import chalk from "chalk"
import { TablePaiManager } from "../../server/TablePaiManager"
import _ = require("lodash");

/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}
function puts(obj: any) {
  console.log(chalk.green(util.inspect(obj)))
}

class SocketTest {
  public id: any
  public username: string
  constructor(username) {
    this.username = username
    this.id = Math.random()
  }
  sendmsg(msg) {
    console.log(`===${this.username} msg==`)
    // for (let key in msg) {
    //   console.log(chalk.green(`${key}: ${msg[key]}`))
    // }
    puts(msg)
    console.log(`===${this.username} end===`)
  }
}

var room = new Room()
//玩家必须有socket, 用于传递消息！
var player1 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
  },
  socket: new SocketTest("jack1"),
  username: "jack1",
  user_id: "10001"
})

var player2 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais("t1 t1 t1 t3 t4 t5 zh zh zh fa fa fa di")
  },
  socket: new SocketTest("rose2"),
  username: "rose2",
  user_id: "10002"
})
var player3 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9")
  },
  socket: new SocketTest("tom3"),
  username: "tom3",
  user_id: "10003"
})
room.create_by(player1)
room.join_player(player2)
room.join_player(player3)

test("应该有个房间号1001", function(t) {
  t.is(room.id, 1001)
})
test("用户全部加入房间", function(t) {
  t.is(room.players_count, 3)
})

room.server_game_start(TablePaiManager.zhuang_mopai_gang())
test("服务器发牌后player1手牌能扛", function(t) {
  let shou1 = _.orderBy(pais("b8 b9 t1 t1 t1 t1 t7 zh zh fa di di di"))
  let shou2 = _.orderBy(pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa"))
  let shou3 = _.orderBy(pais("b4 b5 b6 b7 b8 b9 t2 t7 t7 t7 t8 t8 t9"))
  t.deepEqual(player1.group_shou_pai.shouPai, shou1)
  t.deepEqual(player2.group_shou_pai.shouPai, shou2)
  t.deepEqual(player3.group_shou_pai.shouPai, shou3)
  t.deepEqual(player1.canGangPais(), [11])
  t.deepEqual(player1.mo_pai, 35)
  //只有一个玩家可以在思考中！
  t.is(player1.is_thinking, true)
  t.is(player2.is_thinking, false)
  t.is(player3.is_thinking, false)
  // t.deepEqual(player1.canGangPais(), [11,35])
  // t.is(player1.rema)
})
