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
    let newArr = []
    //胡first, 杠second, 亮？
    //只可能有一个人能扛，因为就4张牌
    //先按照位置排序
    this.players.sort((a, b) => (a.seat_index > b.seat_index ? 1 : -1))
    let playerTemp: Player = this.findHuPlayer()
    // 有可能一炮双响，一个个处理，按照玩家位置顺序来
    while (playerTemp) {
      _.remove(this.players, playerTemp)
      newArr.push(playerTemp)
      playerTemp = this.findHuPlayer()
    }

    playerTemp = this.findLiangPlayer()
    if (playerTemp) {
      _.remove(this.players, playerTemp)
      newArr.push(playerTemp)
    }
    playerTemp = this.findGangPlayer()
    if (playerTemp) {
      _.remove(this.players, playerTemp)
      newArr.push(playerTemp)
    }
    newArr.push(...this.players)
    this.players =  newArr
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
    if(nextPlayer){
      console.log(chalk.green(`下一个玩家可以选择操作： ${nextPlayer.username}`));
      nextPlayer.socket.sendmsg({
        type: g_events.server_can_select,
        select_opt: nextPlayer.arr_selectShow,
        canHidePais: nextPlayer.canHidePais,
        canGangPais: nextPlayer.canGangPais
      })
    }
  }
  /**增加一个玩家并且重新排序 */
  addAndAdjustPriority(player: Player) {
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
