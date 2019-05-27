// 专门用来处理selectShow有很多的情况，一个玩家就会产生好几个selectShow
import * as config from "./config"
import * as _ from "lodash"
import chalk from "chalk"
import * as g_events from "./events"
import { Player } from "./player"

export class SelectShowQueue {



    public players: Player[] = []
    constructor(players: Player[]) {
        this.players = _.clone(players)
        this.players = this.adjustPrioritybySelectShow()
        // this.processSelectShowOneByOne()
    }

    adjustPrioritybySelectShow() {
        let newArr = []
        //胡first, 杠second, 亮？
        //只可能有一个人能扛，因为就4张牌
        //先按照位置排序
        this.players.sort((a,b)=>(a.seat_index > b.seat_index)? 1 : -1 )
        let playerTemp: Player = this.findHuPlayer()
        // 有可能一炮双响，一个个处理，按照玩家位置顺序来
        while (playerTemp) {
            _.remove(this.players, playerTemp)
            newArr.push(playerTemp)
            playerTemp = this.findHuPlayer()
        }
        
        playerTemp = this.findLiangPlayer()
        if(playerTemp){
            _.remove(this.players, playerTemp)
            newArr.push(playerTemp)
        }
        playerTemp = this.findGangPlayer()
        if(playerTemp){
            _.remove(this.players, playerTemp)
            newArr.push(playerTemp)
        }
        newArr.push(...this.players)
        return newArr
    }
    //[isShowHu, isShowLiang, isShowGang, isShowPeng]
    /** 找到能胡玩家*/
    findHuPlayer(): Player {
        return this.players.find(p => p.arr_select_show[0] == true)
    }
    /** 找到能亮玩家*/
    findLiangPlayer(): Player {
        return this.players.find(p => p.arr_select_show[1] == true)
    }
    /**找到能扛玩家 */
    findGangPlayer(): Player {
        return this.players.find(p => p.arr_select_show[2] == true)
    }

    hasSelectShow(): boolean {
        return this.players.some(p => !_.isEmpty(p.arr_select_show))
    }
    /**玩家的选择是否有效，指点击了胡、亮、杠、碰之类的 */
    selectValid(player: Player){
        //这里只检测select操作，打牌并不在其中，玩家执行confirm操作系列是肯定会有selectShow的，起码有1个否则就是逻辑错误了。
        return this.players[0] == player ? true : false
    }
    selectCompleteBy(player:Player){
        _.remove(this.players, player)
    }

}