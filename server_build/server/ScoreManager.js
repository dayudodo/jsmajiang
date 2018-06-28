"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const MajiangAlgo_1 = require("./MajiangAlgo");
//每一个玩家的数据保存在此类中
const config = require("./config");
/**算分管理器 */
class ScoreManager {
    static other_players(person, players) {
        let o_players = players.filter(p => p.user_id != person.user_id);
        return o_players;
    }
    /**所有玩家的一局得分，计算结果直接保存到各player的oneju_score中 */
    static cal_oneju_score(players) {
        //todo: 扛分计算
        // 每个玩家都要算一次扛分
        players.forEach(p => {
            p.oneju_score += this.cal_gang_score(p.gang_win_codes, true);
            console.log(`${p.username}的赢杠有：${p.gang_win_names}，分值：${p.oneju_score}`);
            p.oneju_score -= this.cal_gang_score(p.gang_lose_codes, false);
            console.log(`${p.username}出杠钱有：${p.gang_lose_names}，分值：${p.oneju_score}`);
        });
        let all_hu_players = players.filter(p => true == p.is_hu);
        all_hu_players.forEach(hu_player => {
            let all_hupaiTypesCode = hu_player.hupai_typesCode();
            //如果自摸，其它两家出钱
            // all_typesCode.forEach(code => {
            //   score += this.scoreOf(code);
            // });
            //杠牌算分，暗杠、擦炮两家给钱，这些应该由room负责保存胡牌代码。
            //todo:所有的胡都包括屁胡，所以可能需要减去屁胡的分，如果只有屁胡就不用减，或者直接就在获取hupai_data的时候处理？
            //单独的屁胡其实是不可能胡的，最小的胡也是屁胡+自摸！
            if (hu_player.is_zimo) {
                //自摸后需要扣除其它两个玩家的相应分数！分数算在胡家手中。
                this.other_players(hu_player, players).forEach(p => {
                    let score = 0;
                    let onlyIncludePiHu = _.isEqual([config.HuisPihu], all_hupaiTypesCode);
                    if (!onlyIncludePiHu) {
                        all_hupaiTypesCode.remove(config.HuisPihu);
                    }
                    score = this.cal_fang_score(all_hupaiTypesCode);
                    //扣掉其它两个玩家的分数
                    p.oneju_score -= score;
                    //分数添加到胡家里面
                    hu_player.oneju_score += score;
                    //漂单独算，貌似玩家单独还可以设置！其实也可以强制漂，这由庄家决定。创建房间的人可以设定漂
                    if (config.have_piao) {
                        //漂的加分减分都是要算双倍的！
                        p.oneju_score -= config.piao_score * 2;
                        hu_player.oneju_score += config.piao_score * 2;
                    }
                    console.log("====================================");
                    console.log(`${hu_player.username}.oneju_score: ${hu_player.oneju_score}`);
                    console.log("====================================");
                });
                //todo: 自摸的算番
            }
            else {
                let score = 0;
                //不是自摸的屁胡不需要计算屁胡，肯定会有其它的胡牌方式
                all_hupaiTypesCode.remove(config.HuisPihu);
                score = this.cal_fang_score(all_hupaiTypesCode);
                //不是自摸，有人放炮，扣除放炮者的分数！
                let fangpao_player = players.find(p => true == p.is_fangpao);
                fangpao_player.oneju_score -= score;
                //分数添加到胡家里面
                hu_player.oneju_score += score;
            }
        });
        //todo: 平局
    }
    /** gangCodes中的所有杠分 */
    static cal_gang_score(gangCodes, is_win) {
        /**某种杠code的分数 */
        let gangScoreOf = (code) => {
            let hu_item;
            if (is_win) {
                hu_item = config.GangWinSheet.find(item => item.type == code);
            }
            else {
                hu_item = config.GangLoseSheet.find(item => item.type == code);
            }
            return hu_item.multiple * config.base_score;
        };
        let score = 0;
        gangCodes.forEach(code => {
            score += gangScoreOf(code);
        });
        return score;
    }
    /**计算某种胡code的分数 */
    static scoreOf(code) {
        let hu_item = config.HuPaiSheet.find(item => item.type == code);
        return hu_item.multiple * config.base_score;
    }
    /**算player扣多少分，根据别人的typesCode */
    static cal_fang_score(typesCode) {
        console.log("====================================");
        console.log(MajiangAlgo_1.MajiangAlgo.HuPaiNamesFrom(typesCode));
        console.log("====================================");
        let score = 0;
        typesCode.forEach(code => {
            score += this.scoreOf(code);
        });
        return score;
    }
}
exports.ScoreManager = ScoreManager;
//# sourceMappingURL=ScoreManager.js.map