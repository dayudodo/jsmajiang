import test from "ava"
import * as util from "util"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import * as config from "../../server/config"
import chalk from "chalk"
import { TablePaiManager } from "../../server/TablePaiManager"
import _ = require("lodash")

/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}
function orderPais(strs) {
  return _.orderBy(pais(strs))
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
    shouPai: []
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
    shouPai: []
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
    shouPai: []
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

//开始游戏之前要先准备一下
room.players.forEach(item => (item.ready = true))
room.server_game_start(TablePaiManager.zhuang_mopai_gang())

test("服务器发牌后player1手牌能扛", function(t) {
  let shou1 = orderPais("b8 b9 t1 t1 t1 t1 t7 zh zh fa di di di")
  let shou2 = orderPais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
  let shou3 = orderPais("b4 b5 b6 b7 b8 b9 t2 t7 t7 t7 t8 t8 t9")
  t.deepEqual(player1.group_shou_pai.shouPai, shou1)
  t.deepEqual(player2.group_shou_pai.shouPai, shou2)
  t.deepEqual(player3.group_shou_pai.shouPai, shou3)
  //游戏一开始就会摸一张di
  t.deepEqual(player1.mo_pai, to_number("di"))

  //摸牌后有两个扛可以选择
  t.deepEqual(player1.canZhiGangPais(), [11, 35])
  //摸牌之后可以显示选择菜单[isShowHu, isShowLiang, isShowGang, isShowPeng]
  //这个顺序其实也是个优先级，如果两个玩家都有选择菜单，那么还需要确定优先级，胡、亮、杠、碰这样的顺序
  // t.deepEqual(player1.arr_select, [false,false,true,false])
  //摸牌后是可以打牌的
  t.is(player1.can_dapai, true)
  //并且在思考中，其它玩家没有思考状态！
  t.is(player1.is_thinking, true)
  t.is(player2.is_thinking, false)
  t.is(player3.is_thinking, false)

  // 调用打牌的时候需要通过房间来打牌，不能直接调用player.da_pai!
  room.client_da_pai(player1.socket, to_number('t7'))
  //打牌之后不能再打，要等其它人操作了！
  t.is(player1.can_dapai, false)
  //打牌后mo_pai应该为空！自然，其它的也是为空的！
  t.is(player1.mo_pai, null)
  t.is(player2.mo_pai, null)
  t.is(player3.mo_pai, null)

  //player不会听胡
  t.deepEqual(player1.hupai_data.all_hupai_zhang, [])
  //可以扛player1打的牌，并且可以扛的牌里面包括t7
  t.deepEqual(player3.canGangOther(to_number("t7")), true)
  //能够扛的牌里面不包括t7, 因为其只会检测能否自扛！
  t.deepEqual(player3.canZhiGangPais(), [])
  t.deepEqual(player3.allGangPais, [17])
  //但是，其arr_select里面应该有数据
  t.deepEqual(player3.arr_select, [false,false,true,false])
  t.deepEqual(player3.is_thinking, true)

  // //操作都应该是由room来发送的
  // room.client_confirm_gang({
  //   selectedPai: to_number('t7')
  // }, player3.socket)
  // //player3扛之后，其会成为当前player
  // t.is(room.current_player, player3)
})
