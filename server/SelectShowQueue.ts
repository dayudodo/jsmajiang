// 专门用来处理selectShow有很多的情况，一个玩家就会产生好几个selectShow
//
import * as config from "./config"
import * as _ from "lodash"
import chalk from "chalk"
import * as g_events from "./events"
import { Player } from "./player"

export class SelectShowQueue {
  public players: Player[] = []
  constructor(players: Player[] = []) {
    this.players = _.clone(players)
    this.adjustPrioritybySelectShow()
    // this.processSelectShowOneByOne()
  }

  //并没有改变玩家数据，与room中的players相比，顺序不同而已。
  adjustPrioritybySelectShow() {
    if (this.players.length <= 1) {
      //就一个或者是0干脆直接返回自己
      return
    }
    // this.players.sort((a, b) => (a.seat_index > b.seat_index ? 1 : -1))
    let numberSeatOfPlayers = this.getNumberSeatOfPlayers()
    this.sortByNumberSeatIndex(numberSeatOfPlayers)
    this.players = numberSeatOfPlayers.map(item => item.player)
  }
  /**按照selectShow的数值及座位来排序 */
  public sortByNumberSeatIndex(
    numberSeatOfPlayers: {
      player: Player
      selectNum: number
      seat_index: any
    }[]
  ) {
    numberSeatOfPlayers.sort((a, b) => {
      if (a.selectNum > b.selectNum) {
        return -1
      }
      if (a.selectNum == b.selectNum) {
        return a.seat_index > b.seat_index ? 1 : -1
      }
      if (a.selectNum < b.selectNum) {
        return 1
      }
    })
  }

  public getNumberSeatOfPlayers() {
    //将[true, false,false,false]转换成[1,0,0,0]之后再连起来，再转换成数值
    return this.players.map(p => {
      let numArrOfSelectShow = p.arr_selectShow.map(s => (s ? 1 : 0))
      let selectNum = parseInt(numArrOfSelectShow.join(""))
      return { player: p, selectNum: selectNum, seat_index: p.seat_index }
    })
  }

  //[isShowHu, isShowLiang, isShowGang, isShowPeng]
  /** 找到能胡玩家*/
  findHuPlayer(): Player {
    return this.players.find(p => p.arr_selectShow[0] == true)
  }
  /** 找到能亮玩家*/
  findLiangPlayer(): Player {
    return this.players.find(p => p.arr_selectShow[1] == true)
  }
  /**找到能扛玩家 */
  findGangPlayer(): Player {
    return this.players.find(p => p.arr_selectShow[2] == true)
  }
  selectCompleteBy(player: Player) {
    //选择完毕，则arr_selectshow要清空
    player.arr_selectShow = []
    _.remove(this.players, player)
    //如果有下一个操作玩家，通知并让其可操作
    let nextPlayer = _.first(this.players)
    if (nextPlayer) {
      console.log(
        chalk.green(`下一个玩家可以选择操作： ${nextPlayer.username}`)
      )
      this.send_can_select_to(nextPlayer)
    }
  }
  send_can_select_to(nextPlayer: Player) {
    nextPlayer.socket.sendmsg({
      type: g_events.server_can_select,
      arr_selectShow: nextPlayer.arr_selectShow,
      canHidePais: nextPlayer.canHidePais,
      canGangPais: nextPlayer.canGangPais
    })
  }
  //如果有头玩家，就发送消息给头玩家，其它人暂时不发送消息
  send_can_select_to_TopPlayer() {
    if (this.hasSelectShow()) {
      this.send_can_select_to(this.players[0])
    }
  }

  /**增加一个玩家并且重新排序 */
  addAndAdjustPriority(player: Player) {
    //确保只会添加一次，或许用set更好？但是set不能排序貌似
    if (!_.isEmpty(this.players) && this.players.find(p => p == player)) {
      return
    } else {
      this.players.push(player)
    }
    this.adjustPrioritybySelectShow()
  }

  /**玩家的选择是否有效，指点击了胡、亮、杠、碰之类的 */
  canSelect(player: Player) {
    //这里只检测select操作，打牌并不在其中，玩家执行confirm操作系列是肯定会有selectShow的，起码有1个否则就是逻辑错误了。
    //如果有双胡呢？任一玩家胡都可以。。
    // if (_.isEmpty(this.players)) {
    //   return true
    // }
    return this.players[0] == player ? true : false
  }
  hasSelectShow(): boolean {
    if (_.isEmpty(this.players)) {
      return false
    }
    return this.players.some(p => !_.isEmpty(p.arr_selectShow))
  }
  /** 当所有玩家的arr_selectShow都为空的时候， */
  isAllPlayersNormal() {
    return !this.hasSelectShow()
  }
}
