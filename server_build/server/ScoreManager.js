"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const NMajiangAlgo_1 = require("./NMajiangAlgo");
//每一个玩家的数据保存在此类中
const config = require("./config");
const chalk_1 = require("chalk");
/**算分管理器 */
class ScoreManager {
    static other_players(person, players) {
        let o_players = players.filter(p => p.user_id != person.user_id);
        return o_players;
    }
    /**所有玩家的一局得分，计算结果直接保存到各player的oneju_score中 */
    static cal_oneju_score(players) {
        // 每个玩家都要算一次扛分，且杠分不算漂，也没有倍率，就是固定的
        //得分其实是个总程序，其它的应该直接用方法名称写出代码的意义所在
        ScoreManager.count_players_gang_score(players);
        //是否封顶，最高也就是8倍，比如5*8=40块钱封顶
        let top_score, base_top_score = config.base_score * 8;
        if (config.have_piao) { //如果有漂的话，赢家双倍，输家也是双倍
            top_score = base_top_score + config.piao_score * 2;
        }
        else {
            top_score = base_top_score;
        }
        //有可能一炮双响，二个人都胡
        let all_hu_players = players.filter(p => true == p.is_hu);
        all_hu_players.forEach(hu_player => {
            let all_hupaiTypesCode = hu_player.hupai_typesCode();
            //杠牌算分，暗杠、擦炮两家给钱，这些应该由room负责保存胡牌代码。
            //todo:所有的胡都包括屁胡，所以需要减去屁胡的分，如果只有屁胡就不用减
            //单独的屁胡是不可能胡的，最小的胡也是屁胡+自摸！
            if (hu_player.is_zimo) {
                //自摸后需要扣除其它两个玩家的相应分数！分数算在胡家手中。
                console.log(`${hu_player.username}自摸，开始计算其它两家的分数。。。`);
                this.other_players(hu_player, players).forEach(p => {
                    let score = 0;
                    //是否只包括屁胡，其实有三种情况！
                    let onlyIncludePiHu = _.isEqual([config.HuisPihu], all_hupaiTypesCode) ||
                        _.isEqual([config.HuisPihu, config.HuisZiMo], all_hupaiTypesCode) ||
                        _.isEqual([config.HuisPihu, config.HuisLiangDao], all_hupaiTypesCode);
                    //已经有其它胡了，不再把屁胡的分数加上
                    if (!onlyIncludePiHu) {
                        all_hupaiTypesCode.remove(config.HuisPihu);
                    }
                    score = this.count_hu_score(all_hupaiTypesCode);
                    console.log(all_hupaiTypesCode, score);
                    if (hu_player.is_liang) {
                        score = score * 2;
                        console.log(`${hu_player.username}亮倒，分数*2： ${score}`);
                    }
                    if (p.is_liang) {
                        score = score * 2;
                    }
                    //胡分不能超过封顶的分数，所以杠和胡分开算是正确的！
                    if (score > top_score) {
                        score = top_score;
                    }
                    //分数添加到胡家里面
                    hu_player.oneju_score += score;
                    console.log(`增加${hu_player.username}分数：${score}`);
                    //扣掉其它两个玩家的分数，还要看亮倒的情况
                    p.oneju_score -= score;
                    console.log(`扣除${p.username}分数：${score}`);
                    //漂单独算，貌似玩家单独还可以设置！其实也可以强制漂，这由庄家决定。创建房间的人可以设定漂
                    //如果已经封顶，不再计算漂
                    if (score < top_score) {
                        this.count_piao_score(p, hu_player);
                    }
                    // console.log("====================================");
                    // console.log(`自摸玩家：${hu_player.username}.oneju_score: ${hu_player.oneju_score}`);
                    // console.log("====================================");
                });
            }
            else {
                //非自摸，有人放炮
                let score = 0;
                let fangpao_player = players.find(p => true == p.is_fangpao);
                //不是自摸的屁胡不需要计算屁胡，肯定会有其它的胡牌方式
                //是否只包括屁胡，其实有三种情况！
                let onlyIncludePiHu = _.isEqual([config.HuisPihu], all_hupaiTypesCode) ||
                    _.isEqual([config.HuisPihu, config.HuisZiMo], all_hupaiTypesCode) ||
                    _.isEqual([config.HuisPihu, config.HuisLiangDao], all_hupaiTypesCode);
                if (!onlyIncludePiHu) {
                    all_hupaiTypesCode.remove(config.HuisPihu);
                }
                score = this.count_hu_score(all_hupaiTypesCode);
                if (hu_player.is_liang) {
                    score = score * 2;
                    console.log(`${hu_player.username}亮倒，分数*2： ${score}`);
                }
                if (fangpao_player.is_liang) {
                    score = score * 2;
                }
                //胡分不能超过封顶的分数，所以杠和胡分开算是正确的！
                if (score > top_score) {
                    score = top_score;
                }
                //扣除放炮者的分数！
                fangpao_player.oneju_score -= score;
                //分数添加到胡家手里
                hu_player.oneju_score += score;
                //输赢双方的漂分，如果已经封顶，不再计算漂
                if (score < top_score) {
                    this.count_piao_score(fangpao_player, hu_player);
                }
            }
        });
        //todo: 平局
    }
    /**计算房间内所有玩家的杠分，无论是赢杠还是输杠*/
    static count_players_gang_score(players) {
        players.forEach(p => {
            let gang_win_score = this.count_gang_score(p.gang_win_codes, true);
            p.oneju_score += gang_win_score;
            if (gang_win_score > 0) {
                console.log(chalk_1.default.green(`${p.username}的
        赢杠：${p.gang_win_names}，分值：${gang_win_score}`));
            }
            let gang_lose_score = this.count_gang_score(p.gang_lose_codes, false);
            p.oneju_score -= gang_lose_score;
            if (gang_lose_score > 0) {
                console.log(chalk_1.default.red(`${p.username}的
        出杠钱有：${p.gang_lose_names}，分值：${gang_lose_score}`));
            }
        });
    }
    /**计算输赢玩家的漂分 */
    static count_piao_score(fangpao_player, hu_player) {
        if (config.have_piao) {
            //漂的加分减分都是要算双倍的！
            fangpao_player.oneju_score -= config.piao_score * 2;
            hu_player.oneju_score += config.piao_score * 2;
        }
    }
    /** gangCodes中的所有杠分，可能赢杠，也可能放杠 */
    static count_gang_score(gangCodes, is_win) {
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
        //如果有倍率，则计算，没有就返回0
        if (hu_item.multiple) {
            return hu_item.multiple * config.base_score;
        }
        else {
            return 0;
        }
    }
    /**算player扣多少分，根据别人的typesCode */
    static count_hu_score(typesCode) {
        let score = 0;
        typesCode.forEach(code => {
            score += this.scoreOf(code);
        });
        console.log("====================================");
        console.log("胡：%s, 分值：%s", NMajiangAlgo_1.NMajiangAlgo.HuPaiNamesFrom(typesCode), score);
        console.log("====================================");
        return score;
    }
}
exports.ScoreManager = ScoreManager;
//# sourceMappingURL=ScoreManager.js.map