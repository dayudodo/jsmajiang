"use strict";
exports.__esModule = true;
var _ = require("lodash");
var MajiangAlgo_1 = require("./MajiangAlgo");
//每一个玩家的数据保存在此类中
var config = require("./config");
var chalk_1 = require("chalk");
/**算分管理器 */
var ScoreManager = /** @class */ (function () {
    function ScoreManager() {
    }
    ScoreManager.other_players = function (person, players) {
        var o_players = players.filter(function (p) { return p.user_id != person.user_id; });
        return o_players;
    };
    /**所有玩家的一局得分，计算结果直接保存到各player的oneju_score中 */
    ScoreManager.cal_oneju_score = function (players) {
        var _this = this;
        // 每个玩家都要算一次扛分，且杠分不算漂，也没有倍率，就是固定的
        //得分其实是个总程序，其它的应该直接用方法名称写出代码的意义所在
        ScoreManager.count_players_gang_score(players);
        //是否封顶
        var top_score, base_top_score = config.base_score * 8;
        if (config.have_piao) {
            top_score = base_top_score + config.piao_score * 2;
        }
        else {
            top_score = base_top_score;
        }
        var all_hu_players = players.filter(function (p) { return true == p.is_hu; });
        all_hu_players.forEach(function (hu_player) {
            var all_hupaiTypesCode = hu_player.hupai_typesCode();
            //杠牌算分，暗杠、擦炮两家给钱，这些应该由room负责保存胡牌代码。
            //todo:所有的胡都包括屁胡，所以需要减去屁胡的分，如果只有屁胡就不用减
            //单独的屁胡是不可能胡的，最小的胡也是屁胡+自摸！
            if (hu_player.is_zimo) {
                //自摸后需要扣除其它两个玩家的相应分数！分数算在胡家手中。
                _this.other_players(hu_player, players).forEach(function (p) {
                    var score = 0;
                    //是否只包括屁胡，其实有三种情况！
                    var onlyIncludePiHu = _.isEqual([config.HuisPihu], all_hupaiTypesCode) ||
                        _.isEqual([config.HuisPihu, config.HuisZiMo], all_hupaiTypesCode) ||
                        _.isEqual([config.HuisPihu, config.HuisLiangDao], all_hupaiTypesCode);
                    if (!onlyIncludePiHu) {
                        all_hupaiTypesCode.remove(config.HuisPihu);
                    }
                    score = _this.count_hu_score(all_hupaiTypesCode);
                    if (hu_player.is_liang) {
                        score = score * 2;
                        console.log(hu_player.username + "\u4EAE\u5012\uFF0C\u5206\u6570*2\uFF1A " + score);
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
                    console.log("\u589E\u52A0" + hu_player.username + "\u5206\u6570\uFF1A" + score);
                    //扣掉其它两个玩家的分数，还要看亮倒的情况
                    p.oneju_score -= score;
                    console.log("\u6263\u9664" + p.username + "\u5206\u6570\uFF1A" + score);
                    //漂单独算，貌似玩家单独还可以设置！其实也可以强制漂，这由庄家决定。创建房间的人可以设定漂
                    //如果已经封顶，不再计算漂
                    if (score < top_score) {
                        _this.count_piao_score(p, hu_player);
                    }
                    // console.log("====================================");
                    // console.log(`自摸玩家：${hu_player.username}.oneju_score: ${hu_player.oneju_score}`);
                    // console.log("====================================");
                });
            }
            else {
                //非自摸，有人放炮
                var score = 0;
                var fangpao_player = players.find(function (p) { return true == p.is_fangpao; });
                //不是自摸的屁胡不需要计算屁胡，肯定会有其它的胡牌方式
                //是否只包括屁胡，其实有三种情况！
                var onlyIncludePiHu = _.isEqual([config.HuisPihu], all_hupaiTypesCode) ||
                    _.isEqual([config.HuisPihu, config.HuisZiMo], all_hupaiTypesCode) ||
                    _.isEqual([config.HuisPihu, config.HuisLiangDao], all_hupaiTypesCode);
                if (!onlyIncludePiHu) {
                    all_hupaiTypesCode.remove(config.HuisPihu);
                }
                score = _this.count_hu_score(all_hupaiTypesCode);
                if (hu_player.is_liang) {
                    score = score * 2;
                    console.log(hu_player.username + "\u4EAE\u5012\uFF0C\u5206\u6570*2\uFF1A " + score);
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
                    _this.count_piao_score(fangpao_player, hu_player);
                }
            }
        });
        //todo: 平局
    };
    ScoreManager.count_players_gang_score = function (players) {
        var _this = this;
        players.forEach(function (p) {
            var gang_win_score = _this.count_gang_score(p.gang_win_codes, true);
            p.oneju_score += gang_win_score;
            if (gang_win_score > 0) {
                console.log(chalk_1["default"].green(p.username + "\u7684\n        \u8D62\u6760\uFF1A" + p.gang_win_names + "\uFF0C\u5206\u503C\uFF1A" + gang_win_score));
            }
            var gang_lose_score = _this.count_gang_score(p.gang_lose_codes, false);
            p.oneju_score -= gang_lose_score;
            if (gang_lose_score > 0) {
                console.log(chalk_1["default"].red(p.username + "\u7684\n        \u51FA\u6760\u94B1\u6709\uFF1A" + p.gang_lose_names + "\uFF0C\u5206\u503C\uFF1A" + gang_lose_score));
            }
        });
    };
    /**计算输赢玩家的漂分 */
    ScoreManager.count_piao_score = function (fangpao_player, hu_player) {
        if (config.have_piao) {
            //漂的加分减分都是要算双倍的！
            fangpao_player.oneju_score -= config.piao_score * 2;
            hu_player.oneju_score += config.piao_score * 2;
        }
    };
    /** gangCodes中的所有杠分 */
    ScoreManager.count_gang_score = function (gangCodes, is_win) {
        /**某种杠code的分数 */
        var gangScoreOf = function (code) {
            var hu_item;
            if (is_win) {
                hu_item = config.GangWinSheet.find(function (item) { return item.type == code; });
            }
            else {
                hu_item = config.GangLoseSheet.find(function (item) { return item.type == code; });
            }
            return hu_item.multiple * config.base_score;
        };
        var score = 0;
        gangCodes.forEach(function (code) {
            score += gangScoreOf(code);
        });
        return score;
    };
    /**计算某种胡code的分数 */
    ScoreManager.scoreOf = function (code) {
        var hu_item = config.HuPaiSheet.find(function (item) { return item.type == code; });
        //如果有倍率，则计算，没有就返回0
        if (hu_item.multiple) {
            return hu_item.multiple * config.base_score;
        }
        else {
            return 0;
        }
    };
    /**算player扣多少分，根据别人的typesCode */
    ScoreManager.count_hu_score = function (typesCode) {
        var _this = this;
        var score = 0;
        typesCode.forEach(function (code) {
            score += _this.scoreOf(code);
        });
        console.log("====================================");
        console.log("胡：%s, 分值：%s", MajiangAlgo_1.MajiangAlgo.HuPaiNamesFrom(typesCode), score);
        console.log("====================================");
        return score;
    };
    return ScoreManager;
}());
exports.ScoreManager = ScoreManager;
