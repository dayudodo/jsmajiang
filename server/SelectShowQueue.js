"use strict";
exports.__esModule = true;
exports.SelectShowQueue = void 0;
var _ = require("lodash");
var chalk_1 = require("chalk");
var g_events = require("./events");
var SelectShowQueue = /** @class */ (function () {
    function SelectShowQueue(players) {
        if (players === void 0) { players = []; }
        this.players = [];
        this.players = _.clone(players);
        this.adjustPrioritybySelectShow();
        // this.processSelectShowOneByOne()
    }
    //并没有改变玩家数据，与room中的players相比，顺序不同而已。
    SelectShowQueue.prototype.adjustPrioritybySelectShow = function () {
        if (this.players.length <= 1) {
            //就一个或者是0干脆直接返回自己
            return;
        }
        // this.players.sort((a, b) => (a.seat_index > b.seat_index ? 1 : -1))
        var numberSeatOfPlayers = this.getNumberSeatOfPlayers();
        this.sortByNumberSeatIndex(numberSeatOfPlayers);
        this.players = numberSeatOfPlayers.map(function (item) { return item.player; });
    };
    /**按照selectShow的数值及座位来排序 */
    SelectShowQueue.prototype.sortByNumberSeatIndex = function (numberSeatOfPlayers) {
        numberSeatOfPlayers.sort(function (a, b) {
            if (a.selectNum > b.selectNum) {
                return -1;
            }
            if (a.selectNum == b.selectNum) {
                return a.seat_index > b.seat_index ? 1 : -1;
            }
            if (a.selectNum < b.selectNum) {
                return 1;
            }
        });
    };
    SelectShowQueue.prototype.getNumberSeatOfPlayers = function () {
        //将[true, false,false,false]转换成[1,0,0,0]之后再连起来，再转换成数值
        return this.players.map(function (p) {
            var numArrOfSelectShow = p.arr_selectShow.map(function (s) { return (s ? 1 : 0); });
            var selectNum = parseInt(numArrOfSelectShow.join(""));
            return { player: p, selectNum: selectNum, seat_index: p.seat_index };
        });
    };
    //[isShowHu, isShowLiang, isShowGang, isShowPeng]
    /** 找到能胡玩家*/
    SelectShowQueue.prototype.findHuPlayer = function () {
        return this.players.find(function (p) { return p.arr_selectShow[0] == true; });
    };
    /** 找到能亮玩家*/
    SelectShowQueue.prototype.findLiangPlayer = function () {
        return this.players.find(function (p) { return p.arr_selectShow[1] == true; });
    };
    /**找到能扛玩家 */
    SelectShowQueue.prototype.findGangPlayer = function () {
        return this.players.find(function (p) { return p.arr_selectShow[2] == true; });
    };
    SelectShowQueue.prototype.selectCompleteBy = function (player) {
        //选择完毕，则arr_selectshow要清空
        player.arr_selectShow = [];
        _.remove(this.players, player);
        //如果有下一个操作玩家，通知并让其可操作
        var nextPlayer = _.first(this.players);
        if (nextPlayer) {
            console.log(chalk_1["default"].green("\u4E0B\u4E00\u4E2A\u73A9\u5BB6\u53EF\u4EE5\u9009\u62E9\u64CD\u4F5C\uFF1A " + nextPlayer.username));
            this.send_can_select_to(nextPlayer);
        }
    };
    SelectShowQueue.prototype.send_can_select_to = function (nextPlayer) {
        nextPlayer.socket.sendmsg({
            type: g_events.server_can_select,
            arr_selectShow: nextPlayer.arr_selectShow,
            canHidePais: nextPlayer.canHidePais,
            canGangPais: nextPlayer.canGangPais
        });
    };
    //如果有头玩家，就发送消息给头玩家，其它人暂时不发送消息
    SelectShowQueue.prototype.send_can_select_to_TopPlayer = function () {
        if (this.hasSelectShow()) {
            this.send_can_select_to(this.players[0]);
        }
    };
    /**增加一个玩家并且重新排序 */
    SelectShowQueue.prototype.addAndAdjustPriority = function (player) {
        //确保只会添加一次，或许用set更好？但是set不能排序貌似
        if (!_.isEmpty(this.players) && this.players.find(function (p) { return p == player; })) {
            return;
        }
        else {
            this.players.push(player);
        }
        this.adjustPrioritybySelectShow();
    };
    /**玩家的选择是否有效，指点击了胡、亮、杠、碰之类的 */
    SelectShowQueue.prototype.canSelect = function (player) {
        //这里只检测select操作，打牌并不在其中，玩家执行confirm操作系列是肯定会有selectShow的，起码有1个否则就是逻辑错误了。
        //如果有双胡呢？任一玩家胡都可以。。
        // if (_.isEmpty(this.players)) {
        //   return true
        // }
        return this.players[0] == player ? true : false;
    };
    SelectShowQueue.prototype.hasSelectShow = function () {
        if (_.isEmpty(this.players)) {
            return false;
        }
        return this.players.some(function (p) { return !_.isEmpty(p.arr_selectShow); });
    };
    /** 当所有玩家的arr_selectShow都为空的时候， */
    SelectShowQueue.prototype.isAllPlayersNormal = function () {
        return !this.hasSelectShow();
    };
    return SelectShowQueue;
}());
exports.SelectShowQueue = SelectShowQueue;
