// 专门用来处理selectShow有很多的情况，直接处理完成
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
        this.handleSelectShowOneByOne()
    }

    adjustPrioritybySelectShow() {
        let newArr = []
        //胡first, 杠second, 亮？
        //只可能有一个人能扛，因为就4张牌
        //先按照位置排序
        newArr = _.orderBy(this.players, p => p.seat_index)
        let playerTemp: Player = this.findHuPlayer()
        // 有可能一炮双响，一个个处理，按照玩家位置顺序来
        while (playerTemp) {
            this.players.remove(playerTemp)
            newArr.push(playerTemp)
            playerTemp = this.findHuPlayer()
        }
        
        playerTemp = this.findLiangPlayer() //
        if(playerTemp){
            this.players.remove(playerTemp)
            newArr.push(playerTemp)
        }
        playerTemp = this.findGangPlayer() //
        if(playerTemp){
            this.players.remove(playerTemp)
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
    handleSelectShowOneByOne() {
        throw new Error("Method not implemented.");
    }
    public hasSelectShow(): boolean {
        return this.players.some(p => !_.isEmpty(p.arr_select_show))
    }

}