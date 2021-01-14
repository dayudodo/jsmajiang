"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Room = exports.puts = void 0;
var config = require("./config");
var _ = require("lodash");
var chalk_1 = require("chalk");
var g_events = require("./events");
var player_1 = require("./player");
var util = require("util");
var TablePaiManager_1 = require("./TablePaiManager");
var ScoreManager_1 = require("./ScoreManager");
var MyDataBase_1 = require("./MyDataBase");
var SelectShowQueue_1 = require("./SelectShowQueue");
var room_valid_names = ["ange", "jack", "rose"];
/**玩家的各种操作 */
var Operate;
(function (Operate) {
    Operate["mo"] = "mo";
    Operate["da"] = "da";
    Operate["peng"] = "peng";
    Operate["gang"] = "gang";
    Operate["hu"] = "hu";
    Operate["liang"] = "liang";
    Operate["guo"] = "guo";
})(Operate || (Operate = {}));
function puts(obj) {
    console.log(util.inspect(obj));
}
exports.puts = puts;
//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
var Room = /** @class */ (function () {
    function Room() {
        //房间创建时间，房间肯定是有限时
        this.createTime = Date.now();
        //房间内的所有玩家，人数有上限，定义在config的LIMIT_IN_ROOM中
        this.players = [];
        //房间内的牌
        this.cloneTablePais = [];
        /**当前玩家，哪个打牌哪个就是当前玩家*/
        this.current_player = null;
        //todo: 是否接受用户的吃、碰，服务器在计时器，过时就不会等待用户确认信息了！
        this.can_receive_confirm = false;
        /** 服务器当前发的牌 */
        // public table_fa_pai: Pai = null;
        /**发牌给哪个玩家 */
        this.fapai_to_who = null;
        /**哪个玩家在打牌 */
        this.dapai_player = null;
        /**哪个玩家在杠！ */
        // public gang_player = null;
        //计时器
        this.room_clock = null;
        /**玩家操作序列 */
        this.operation_sequence = [
        // { who: this, action: Operate.mo, pai: "b2" },
        // { who: this, action: Operate.da, pai: "t3" },
        // //被别人碰了，有这个序列，历史复现也非常简单！
        // { who: this, action: Operate.peng, detail: { from: "me_id", to: "pengPlayerId" } },
        // //碰了别人的牌，从打牌玩家到我这儿
        // { who: this, action: Operate.peng, detail: { from: "dapaiplayer", to: "me_id" } },
        // //被别人杠了
        // { who: this, action: Operate.gang, detail: { from: "me-id", to: "gangPlayer" } },
        // //杠了别人的
        // { who: this, action: Operate.gang, detail: { from: "gangPlayer", to: "me_id" } },
        // //杠了自己的
        // { who: this, action: Operate.gang, detail: { from: "me_id", to: "me_id" }, self: true },
        // { who: this, action: Operate.hu, pai: "b1" },
        // { who: this, action: Operate.liang },
        // { who: this, action: Operate.guo }
        ];
        // 房间新建之后，就会拥有个id了
        this.id = Room.getId();
        this.selectShowQue = new SelectShowQueue_1.SelectShowQueue();
    }
    /**创建一个唯一的房间号，其实可以用redis来生成一个号，就放在内存里面*/
    Room.getId = function () {
        //todo: 暂时用模拟的功能，每次要创建的时候，其实都是用的数组中的一个名称
        //正规的自然是要生成几个唯一的数字了，然后还要分享到微信之中让其它人加入
        return 1001;
    };
    /**玩家创建房间并发送消息 */
    Room.prototype.create_by = function (person) {
        if (this.creator) {
            console.warn("\u5DF2\u7ECF\u6709\u521B\u5EFA\u8005\u4E86\uFF0C\u623F\u95F4\u53EA\u80FD\u6709\u4E00\u4E2A" + person.username);
            return;
        }
        this.creator = person;
        this.setDongJia(person);
        person.seat_index = 0; //创建者座位号从0开始
        person.room = this; //玩家知道自己在哪个房间！
        this.players.push(person);
        //todo: 客户端要有相应的变化！
        person.socket.sendmsg({
            type: g_events.server_create_room_ok,
            room_id: this.id,
            username: person.username,
            user_id: person.user_id,
            seat_index: person.seat_index,
            east: person.east,
            treasure: person.treasure
        });
    };
    //用户加入房间，还需要告诉其它的用户我已经加入了
    Room.prototype.join_player = function (person) {
        if (_.isEmpty(this.players)) {
            throw new Error("用户加入之前，一定要先创建房间！");
        }
        //玩家不需要重复添加
        if (this.players.includes(person)) {
            console.warn("\u73A9\u5BB6\u4E0D\u9700\u8981\u91CD\u590D\u6DFB\u52A0\uFF1A" + person.username);
            return;
        }
        //座位号增加
        person.seat_index = this.last_join_player.seat_index + 1;
        person.room = this;
        this.players.push(person);
        //通知
        this.player_enter_room(person.socket);
    };
    //玩家通知加入房间
    Room.prototype.player_enter_room = function (socket) {
        //首先应该看玩家是否已经 在房间里面了
        var player = this.find_player_by(socket);
        if (!player) {
            console.warn("玩家未登录，不能加入房间！bug...");
        }
        //首先告诉其它人player进入房间！客户端会添加此玩家
        var msg = {
            type: g_events.server_other_player_enter_room,
            username: player.username,
            user_id: player.user_id,
            seat_index: player.seat_index,
            score: player.score
        };
        player.otherPlayersInRoom.forEach(function (p) {
            p.socket.sendmsg(msg);
        });
        //用户加入房间，肯定是2，3玩家，需要服务器发送时添加其它玩家的数据
        //庄家创建房间时只有一个人，所以不需要另行通知。
        var other_players_info = player.otherPlayersInRoom.map(function (item) {
            return {
                username: item.username,
                user_id: item.user_id,
                seat_index: item.seat_index,
                east: item.east,
                score: item.score
            };
        });
        //给自己发消息时携带其它玩家的信息
        player.socket.sendmsg({
            type: g_events.server_player_enter_room,
            room_id: this.id,
            username: player.username,
            user_id: player.user_id,
            seat_index: player.seat_index,
            east: player.east,
            other_players_info: other_players_info
        });
    };
    Room.prototype.server_receive_ready = function (socket) {
        //向房间内所有人通知我已经准备好
        var player = this.find_player_by(socket);
        this.players.forEach(function (p) {
            p.socket.sendmsg({
                type: g_events.server_receive_ready,
                username: player.username
            });
        });
    };
    //玩家选择退出房间，应该会有一定的惩罚，如果本局还没有结束
    Room.prototype.exit_room = function (socket) {
        _.remove(this.players, function (item) {
            return item.socket.id == socket.id;
        });
    };
    Room.prototype.find_player_by = function (socket) {
        return this.players.find(function (item) { return item.socket == socket; });
    };
    /**某玩家的所有操作 */
    Room.prototype.OperationsOf = function (player) {
        return this.operation_sequence.filter(function (item) { return item.who === player; });
    };
    /**玩家player的前step次操作，限定玩家，以免有其它玩家的操作干扰 */
    Room.prototype.front_operationOf = function (player, step) {
        var p_operations = this.OperationsOf(player);
        if (p_operations[p_operations.length - step]) {
            return p_operations[p_operations.length - step];
        }
        else {
            return null;
        }
    };
    /**最后 一个操作 */
    Room.prototype.last_Operation = function () {
        return _.last(this.operation_sequence);
    };
    Object.defineProperty(Room.prototype, "all_ready", {
        //玩家们是否都已经准备好开始游戏
        get: function () {
            var player_ready_count = this.players.filter(function (item) { return item.ready; }).length;
            console.log("\u623F\u95F4:" + this.id + "\u5185\u73A9\u5BB6\u51C6\u5907\u5F00\u59CB\u8BA1\u6570\uFF1A" + player_ready_count);
            return player_ready_count == config.LIMIT_IN_ROOM;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "players_count", {
        //统计当前房间的玩家人数
        get: function () {
            return this.players.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "all_player_names", {
        get: function () {
            return this.players.map(function (person) {
                return person.username;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "last_join_player", {
        //最后一位加入游戏的玩家
        get: function () {
            return _.last(this.players);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "next_player", {
        /** 房间中要发牌的下一个玩家 */
        get: function () {
            //下一家
            var next_index = (this.current_player.seat_index + 1) % config.LIMIT_IN_ROOM;
            //最后通过座位号来找到玩家,而不是数组序号,更不容易出错，哪怕是players数组乱序也不要紧
            return this.players.find(function (p) { return p.seat_index == next_index; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "fangpao_player", {
        /**放炮玩家，玩家自摸则返回空 */
        get: function () {
            return this.players.find(function (p) { return p.is_fangpao == true; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "hupai_players", {
        /**胡牌玩家，可能有多个，一炮双响！ */
        get: function () {
            return this.players.filter(function (p) { return p.hupai_zhang != null; });
        },
        enumerable: false,
        configurable: true
    });
    Room.prototype.left_player = function (person) {
        //左手玩家
        var index = person.seat_index - 1;
        index = index == -1 ? config.LIMIT_IN_ROOM - 1 : index;
        return this.players.find(function (p) { return p.seat_index == index; });
    };
    Room.prototype.right_player = function (person) {
        //右手玩家
        var index = person.seat_index + 1;
        index = index == config.LIMIT_IN_ROOM ? 0 : index;
        return this.players.find(function (p) { return p.seat_index == index; });
    };
    /**没有玩家摸牌 */
    Room.prototype.no_player_mopai = function () {
        return this.players.every(function (p) { return p.mo_pai == null; });
    };
    /**
     * 玩家数据过滤器，返回客户端需要的属性值
     * @param socket 哪个socket
     * @param player 需要向哪个玩家发送消息
     * @param ignore_filter 是否忽略filter
     */
    Room.prototype.player_data_filter = function (socket, player, ignore_filter) {
        if (ignore_filter === void 0) { ignore_filter = false; }
        var player_data = {};
        player_1.Player.filter_properties.forEach(function (item) {
            player_data[item] = _.clone(player[item]);
        });
        //是玩家本人的socket，返回所有的数据
        if (player.socket == socket) {
            return player_data;
        }
        else if (ignore_filter) {
            //哪怕是忽略过滤器，sidePlayer也不能显示出其它人的selfPeng及暗杠
            player_data["group_shou_pai"]["selfPeng"] = [];
            player_data["group_shou_pai"]["selfPengCount"] =
                player.group_shou_pai.selfPeng.length;
            player_data["group_shou_pai"]["anGang"] = [];
            player_data["group_shou_pai"]["anGangCount"] =
                player.group_shou_pai.anGang.length;
            return player_data;
        }
        else {
            //不是god_player, 也没有忽略过滤器，就全过滤！
            //暗杠只有数量，不显示具体的内容
            var shou_pai = player_data["group_shou_pai"];
            shou_pai["anGang"] = [];
            shou_pai["anGangCount"] = player.group_shou_pai.anGang.length;
            shou_pai["selfPeng"] = [];
            shou_pai["selfPengCount"] = player.group_shou_pai.selfPeng.length;
            shou_pai["shouPai"] = [];
            shou_pai["shouPaiCount"] = player.group_shou_pai.shouPai.length;
            //只有明杠和碰会显示在其它人那儿！
            shou_pai["mingGang"] = player.group_shou_pai.mingGang;
            shou_pai["peng"] = player.group_shou_pai.peng;
            // player_data["group_shou_pai"] = shou_pai;
            //返回过滤的数据
            return player_data;
        }
    };
    /**玩家胜负属性值，由result_properties决定 */
    Room.prototype.player_result_filter = function (player) {
        var result = {};
        player_1.Player.result_properties.forEach(function (item) {
            result[item] = _.cloneDeep(player[item]);
        });
        return result;
    };
    /**玩家碰、杠后，打牌玩家打的牌会消失，只是个简单的过程 */
    Room.prototype.daPaiDisappearAndReturnTablePai = function () {
        if (this.dapai_player) {
            this.dapai_player.socket.sendmsg({
                type: g_events.server_dapai_disappear
            });
            return this.dapai_player.arr_dapai.pop();
        }
        else {
            return null;
        }
    };
    /**玩家选择碰牌，或者是超时自动跳过！*/
    Room.prototype.client_confirm_peng = function (pengPlayer) {
        var _this = this;
        //如果玩家选择操作无效，直接返回
        if (!this.selectShowQue.canSelect(pengPlayer)) {
            return;
        }
        //碰之后打牌玩家的打牌就跑到碰玩家手中了，todo: 前端也会有相应的显示，dapai_player的打牌消失了
        var dapai = this.daPaiDisappearAndReturnTablePai();
        //玩家确认碰牌后将会在group_shou_pai.peng中添加此dapai
        pengPlayer.confirm_peng(dapai);
        //碰牌的人成为当家玩家，因为其还要打牌！下一玩家也是根据这个来判断的！
        this.current_player = pengPlayer;
        if (this.isAllPlayersNormal()) {
            console.log(chalk_1["default"].green("\u73A9\u5BB6\u4EEC\u6B63\u5E38\uFF0C\u78B0\u5BB6\uFF1A" + pengPlayer.username + "\u53EF\u4EE5\u6253\u724C"));
            pengPlayer.socket.sendmsg({ type: g_events.server_can_dapai });
        }
        //给每个人都要发出全部玩家的更新数据，这样最方便！
        this.players.forEach(function (person) {
            var players = _this.players.map(function (p) {
                //如果玩家已经亮牌，显示其所有牌，除了hidePais
                if (p.is_liang) {
                    return _this.player_data_filter(person.socket, p, true);
                }
                else {
                    return _this.player_data_filter(person.socket, p);
                }
            });
            person.socket.sendmsg({
                type: g_events.server_peng,
                players: players,
                pengPlayer_user_id: pengPlayer.user_id
            });
        });
        this.selectShowQue.selectCompleteBy(pengPlayer);
    };
    /**玩家选择杠牌，或者是超时自动跳过！其实操作和碰牌是一样的，名称不同而已。*/
    Room.prototype.client_confirm_gang = function (client_message, gangPlayer) {
        var _this = this;
        //如果玩家选择操作无效，直接返回
        if (!this.selectShowQue.canSelect(gangPlayer)) {
            console.warn("\u73B0\u5728\u8FD8\u4E0D\u80FD\u625B\uFF0C\u6709\u5176\u5B83\u73A9\u5BB6\u9009\u62E9\u64CD\u4F5C\u4F18\u5148\u7EA7\u66F4\u9AD8:" + this.selectShowQue.players[0].username);
            return;
        }
        // let gangPlayer = this.find_player_by(socket)
        //有选择的杠牌说明用户现在有两套可以杠的牌，包括手起4，和别人打的杠牌！
        var selectedPai = client_message.selectedPai;
        //有可能传递过来的杠牌是别人打的牌，这样算杠感觉好麻烦，不够清晰！有啥其它的办法？
        //如果杠别人的牌，或者杠自己摸的牌
        var table_dapai;
        // console.log('~~~gangPlayer.mo_pai: ', gangPlayer.mo_pai);
        if (_.isEmpty(this.dapai_player)) {
            if (_.isNull(gangPlayer.mo_pai)) {
                throw new Error("没人打牌，扛家也没有摸牌，严重错误");
            }
            table_dapai = gangPlayer.mo_pai; //说明是玩家自己摸到的扛牌！
        }
        else {
            table_dapai = this.daPaiDisappearAndReturnTablePai();
        }
        if (selectedPai == table_dapai || selectedPai == gangPlayer.mo_pai) {
            //设置为null, 表明不是自己摸的扛或者天生就是4张。
            selectedPai = null;
        }
        //对参数进行检查！
        if (selectedPai) {
            if (!gangPlayer.canZhiGangPais().includes(selectedPai)) {
                throw new Error("\u73A9\u5BB6\uFF1A" + gangPlayer.username + "\u53EF\u4EE5\u6760\u7684\u724C" + gangPlayer.canZhiGangPais() + "\u5E76\u4E0D\u5305\u62EC" + selectedPai);
            }
        }
        var otherDaGangPai;
        //自己扛, 包括客户端能够发送selectedPai, 或者摸牌的玩家就是扛玩家
        // this.fapai_to_who === gangPlayer会有一个问题，正好是给下一家发牌且他能杠！就出错了。
        //所以，发牌的时候，要控制下，只有杠玩家打牌之后才能发牌！
        var selfGang = selectedPai || this.fapai_to_who === gangPlayer;
        if (selfGang) {
            otherDaGangPai = selectedPai ? selectedPai : gangPlayer.mo_pai;
            this.operation_sequence.push({
                who: gangPlayer,
                action: Operate.gang,
                pai: otherDaGangPai,
                self: true
            });
            //如果是玩家自己摸的4张牌
            if (selectedPai) {
                gangPlayer.confirm_anGang(selectedPai);
            }
            else {
                //如果是摸牌之后可以暗杠？不能暗杠就是擦炮了
                if (gangPlayer.canAnGang) {
                    console.log("\u73A9\u5BB6" + gangPlayer.username + "\u81EA\u5DF1\u6478\u724C" + otherDaGangPai + "\u53EF\u4EE5\u625B");
                    gangPlayer.confirm_anGang(gangPlayer.mo_pai);
                }
                else {
                    console.log("\u73A9\u5BB6" + gangPlayer.username + "\u64E6\u70AE " + otherDaGangPai);
                    //擦炮其实也是一种明杠
                    gangPlayer.confirm_mingGang(gangPlayer.mo_pai);
                }
            }
        }
        else {
            //扛别人的牌,
            //暗杠还没有完成，别人又打了一个杠！这种情况下应该优先选择是否杠别人的牌，或者过，过了就不能再选自己的扛牌了
            //按理说应该一次只能来一次操作！扛了再扛已经是有点儿过份了！这种处理的话如果选择过，别人打牌后自己还是可以扛，编程来说也
            //方便的多
            //杠之后打牌玩家的打牌就跑到杠玩家手中了
            otherDaGangPai = table_dapai;
            this.operation_sequence.push({
                who: gangPlayer,
                action: Operate.gang,
                pai: otherDaGangPai,
                detail: {
                    from: this.dapai_player,
                    to: gangPlayer
                }
            });
            //纪录玩家放了一杠，扣钱！还得判断下打牌玩家打牌之前是否杠牌了, 杠家其实是前三步，第一步杠，第二步摸，第三步才是打牌！
            var isGangShangGang = false;
            var prev3_operation = this.front_operationOf(this.dapai_player, 3);
            if (prev3_operation) {
                isGangShangGang = prev3_operation.action === Operate.gang;
            }
            // console.log("isGangShangGang:", isGangShangGang);
            if (isGangShangGang) {
                gangPlayer.saveGangShangGang(this.dapai_player, otherDaGangPai);
            }
            else {
                //不是杠上杠，就是普通杠了
                gangPlayer.saveGang(this.dapai_player, otherDaGangPai);
            }
            console.log("====================================");
            // puts(this.OperationsOf(this.daPai_player))
            console.log(this.dapai_player.username + " lose_names:");
            console.dir(this.dapai_player.gang_lose_names);
            console.log("====================================");
            //在杠玩家的group_shou_pai.peng中添加此dapai, 二参数为true表明前面已经save了
            gangPlayer.confirm_mingGang(otherDaGangPai, true);
            //自己摸杠和杠他人牌后的发牌分开处理！
            //杠别人的牌后就得发一张牌，当前还是加个判断比较好，没人摸牌的话，就给自己发一张。
            // if (this.no_player_mopai()) {
            //   this.server_fa_pai(gangPlayer)
            // }
        }
        //碰牌的人成为当家玩家，因为其还要打牌！下一玩家也是根据这个来判断的！
        this.current_player = gangPlayer;
        //给每个人都要发出全部玩家的更新数据，这样最方便！简单粗暴，尤其适合开发阶段及教学
        this.players.forEach(function (person) {
            var players = _this.players.map(function (p) {
                //如果玩家已经亮牌，显示其所有牌！
                if (p.is_liang) {
                    return _this.player_data_filter(person.socket, p, true);
                }
                else {
                    return _this.player_data_filter(person.socket, p);
                }
            });
            person.socket.sendmsg({
                type: g_events.server_mingGang,
                players: players,
                gangPlayer_user_id: gangPlayer.user_id
            });
        });
        this.selectShowQue.selectCompleteBy(gangPlayer);
        if (selfGang) {
            console.log(chalk_1["default"].green("\u73A9\u5BB6\u6478\u724C\u53EF\u81EA\u5DF1\u6760\uFF0C\u53D1\u724C\u7ED9" + gangPlayer.username));
        }
        this.server_fa_pai(gangPlayer, true); //只要扛了就会从后面发牌
    };
    /**亮牌，胡后2番，打牌之后才能亮，表明已经听胡了*/
    Room.prototype.client_confirm_liang = function (client_message, player) {
        var _this = this;
        //如果玩家选择操作无效，直接返回
        if (!this.selectShowQue.canSelect(player)) {
            console.log(chalk_1["default"].red('无法亮牌，有其它人可操作！'));
            return;
        }
        //玩家已经有决定，不再想了。
        // player.is_thinking = false
        player.is_liang = true;
        //如果liangHidePais有效
        if (client_message.liangHidePais &&
            client_message.liangHidePais.length > 0) {
            var liangHidePais = client_message.liangHidePais.sort();
            var rightSelectPais_1 = player.PaiArr3A();
            //所有的牌都应该在PaiArr3A之中，安全检测
            var normalSelect = liangHidePais.every(function (pai) {
                return rightSelectPais_1.includes(pai);
            });
            if (normalSelect) {
                liangHidePais.forEach(function (pai) {
                    player.confirm_selfPeng(pai);
                });
            }
            else {
                console.warn("\u7528\u6237\u4EAE\u724C\u540E\u9009\u62E9" + liangHidePais + "\u4E0D\u5728\u670D\u52A1\u5668\u7684\u6B63\u5E38\u9009\u62E9\u4E2D\uFF1A" + rightSelectPais_1);
            }
        }
        //亮牌之后，需要显示此玩家的所有牌，除了暗杠及自碰牌！
        this.players.forEach(function (p) {
            p.socket.sendmsg({
                type: g_events.server_liang,
                liangPlayer: _this.player_data_filter(p.socket, player, true)
            });
        });
        this.operation_sequence.push({
            who: player,
            action: Operate.liang
        });
        this.selectShowQue.selectCompleteBy(player);
        //还没有发过牌呢，说明是刚开始游戏，庄家亮了。
        //此判断还能防止两家都亮的情况，如果有人摸了牌，就算你亮牌也不会有啥影响，保证只有一个人手里面有摸牌！
        //仅仅依靠最后一个是打牌来进行发牌是不对的，如果遇上了一人打牌后 有人可亮，有人可碰，还没有碰呢，你亮了，结果就发牌了！
        //所以还需要啥呢？没人在思考状态！或者说是正常的状态下！并且有人打牌了，才可以发牌！
        if (this.selectShowQue.isAllPlayersNormal()) {
            this.fapai_ifcan();
        }
        else {
            return;
        }
    };
    //玩家选择放弃，给下一家发牌
    Room.prototype.client_confirm_guo = function (player) {
        if (!this.selectShowQue.canSelect(player)) {
            return;
        }
        //如果用户是可以胡牌的时候选择过，那么需要删除计算出来的胡牌张！
        //玩家有决定了，状态改变
        // player.is_thinking = false
        //选择过牌之后，还得判断一下当前情况才好发牌，比如一开始就有了听牌了，这时候选择过，准确的应该是头家可以打牌！
        //同一时间只能有一家可以打牌！服务器要知道顺序！知道顺序之后就好处理了，比如哪一家需要等待，过时之后你才能够打牌！
        //现在的情况非常特殊，两家都在听牌，都可以选择过，要等的话两个都要等。
        //房间玩家手里面都没有摸牌，可以发牌！因为玩家在打牌之后其摸牌为空！
        this.selectShowQue.selectCompleteBy(player);
        if (this.selectShowQue.isAllPlayersNormal()) {
            this.fapai_ifcan();
        }
        else {
            return;
        }
    };
    /**玩家选择胡牌*/
    //todo: 选择胡还得看其它玩家是不也胡这张牌
    Room.prototype.client_confirm_hu = function (player) {
        var _this = this;
        //能胡就不用再看其它人的操作了，操作了也无效，不过如果其它人也有胡呢？
        if (!this.selectShowQue.canSelect(player)) {
            console.warn("选胡但是无法选择操作，当前可以选择操作的玩家：", this.selectShowQue.players);
            return;
        }
        var table_dapai = this.daPaiDisappearAndReturnTablePai();
        // player.is_thinking = false //一炮双响的时候会起作用！
        //自摸，胡自己摸的牌！
        if (player.mo_pai && player.canHu(player.mo_pai)) {
            player.is_zimo = true;
            player.hupai_zhang = player.mo_pai;
            //获取前2次的操作，因为上一次肯定是摸牌，摸牌的上一次是否是杠！
            //todo: 特殊的胡能否写在player中？
            var prev2_operation = this.front_operationOf(player, 2);
            if (prev2_operation && prev2_operation.action == Operate.gang) {
                //保存杠上开花到胡牌类型码数组中
                player.hupai_typesCode().push(config.HuisGangShangKai);
            }
            puts(this.operation_sequence);
            //并且扛牌是可以自己摸也可以求人！记录用户操作倒是对历史回放有一定帮助。
            this.sendAllResultsOfOneJu(player, player.mo_pai);
        }
        //胡别人的打的牌
        else {
            if (player.canHu(table_dapai)) {
                //todo: 重复判断了，能够执行这个操作说明已经检测出来可以胡了
                this.recordHuOf(player, table_dapai);
                //剩下的其它玩家是否也能胡？如果是四个人，可能还有一炮三响。
                var remainPlayer = this.players.find(function (p) {
                    return p != _this.dapai_player && p != player;
                });
                if (remainPlayer.canHu(table_dapai)) {
                    this.recordHuOf(remainPlayer, table_dapai);
                }
                this.sendAllResultsOfOneJu(player, table_dapai);
            }
            else {
                console.warn(player.user_id + ", " + player.username + "\u60F3\u80E1\u4E00\u5F20\u4E0D\u5B58\u5728\u7684\u724C\uFF0C\u6293\u4F4F\u8FD9\u5BB6\u4F19\uFF01");
            }
        }
        console.log(chalk_1["default"].red("胡牌玩家们的信息："));
        console.dir(this.hupai_players);
        if (this.fangpao_player) {
            console.log(chalk_1["default"].red("放炮玩家信息："));
            console.dir(this.fangpao_player.all_win_codes);
        }
    };
    Room.prototype.recordHuOf = function (player, table_dapai) {
        player.hupai_zhang = table_dapai;
        //记录放炮者
        this.dapai_player.is_fangpao = true;
        //看是否是杠牌！
        var prev2_operation = this.front_operationOf(this.dapai_player, 2);
        if (prev2_operation && prev2_operation.action == Operate.gang) {
            //杠上炮，打的杠牌是别人的胡牌
            player.hupai_typesCode().push(config.HuisGangShangPao);
        }
        player.arr_selectShow = [];
        this.selectShowQue.selectCompleteBy(player);
    };
    /**决定在何种情况下可以发牌并决定哪个玩家可以打牌！ */
    Room.prototype.fapai_ifcan = function () {
        if (this.isAllPlayersNormal()) {
            //都正常且没人摸牌的情况下才能发牌
            if (this.no_player_mopai()) {
                this.server_fa_pai(this.next_player);
            }
            //这时候才能够告诉摸牌的人你可以打牌
            // let moPlayer: Player = this.players.find(p => p.mo_pai != null);
            var moPlayers = this.players.filter(function (p) { return p.mo_pai !== null; });
            if (moPlayers && moPlayers.length > 1) {
                throw new Error("\u5B58\u5728\u4E24\u73A9\u5BB6\u540C\u65F6\u6478\u724C\uFF01" + moPlayers);
            }
            var moPlayer = moPlayers[0];
            this.sendClient_can_dapai_ifcan(moPlayer);
        }
    };
    /**所有玩家的牌面返回客户端 */
    Room.prototype.sendAllResultsOfOneJu = function (player, hupaiZhang) {
        var _this = this;
        if (player.is_liang) {
            player.hupai_typesCode().push(config.HuisLiangDao);
        }
        //todo: 读秒结束才会发送所有结果，因为可能会有两个胡牌玩家！
        //暂时用思考变量来控制最终的发送！
        //有人胡就不管selectshow了，直接显示结果，在胡判断里面会有判断一炮双响的情况！
        ScoreManager_1.ScoreManager.cal_oneju_score(this.players);
        //一局结束的时候会发送玩家所有的数据，除了一些敏感的
        var players = this.players.map(function (person) { return _this.player_result_filter(person); });
        this.players.forEach(function (p) {
            p.socket.sendmsg({
                type: g_events.server_winner,
                players: players
            });
        });
    };
    /**房间发一张给player, 让player记录此次发牌，只有本玩家能看到
     * @param player 发牌给哪个玩家
     * @param fromEnd 是否从最后发牌
     */
    Room.prototype.server_fa_pai = function (player, fromEnd) {
        if (fromEnd === void 0) { fromEnd = false; }
        var paiName;
        if (fromEnd) {
            paiName = this.cloneTablePais.pop();
        }
        else {
            paiName = _.first(this.cloneTablePais.splice(0, 1));
        }
        if (_.isNull(paiName) || _.isUndefined(paiName)) {
            //todo: 无可用牌其实牌局就结束了，流局！
            throw new Error(chalk_1["default"].red("room.pai\u4E2D\u65E0\u53EF\u7528\u724C\u4E86"));
        }
        //todo: 用户亮，可以自动打牌，如果有扛呢？
        if (player.is_liang) {
            console.log("todo: " + player.username + "\u5DF2\u7ECF\u4EAE\u724C\uFF0C\u5BA2\u6237\u7AEF\u5E94\u81EA\u52A8\u6253\u724C\uFF0C\u6216\u8005\u80E1");
        }
        //房间记录发牌给谁，以便分析哪个玩家拿牌了但是没有打，说明在等待其它玩家！
        player.mo_pai = paiName;
        this.fapai_to_who = player;
        //发牌给谁，谁就是当前玩家
        this.current_player = player;
        //发牌后要清空所有玩家的其它玩家打牌记录，便于进行杠、胡的分析。
        player.otherPlayersInRoom.forEach(function (p) { return (p.otherDapai = {}); });
        this.operation_sequence.push({
            who: player,
            action: Operate.mo,
            pai: paiName
        });
        //判断完毕再保存到用户的手牌中！不然会出现重复判断的情况！
        //在这儿需要计算下胡牌，防止出现扛之后可以亮，但是没有把mo_pai算在内的情况！
        // player.calculateHu()
        console.log(chalk_1["default"].cyan("服务器发牌 %s 给：%s"), player.mo_pai, player.username);
        console.log("房间 %s 牌还有%s张", this.id, this.cloneTablePais.length);
        // player.socket.emit("server_table_fapai", pai);
        player.socket.sendmsg({
            type: g_events.server_table_fa_pai,
            pai: player.mo_pai
        });
        //发牌还应该通知其它玩家以便显示指向箭头，不再是只给当前玩家发消息
        player.otherPlayersInRoom.forEach(function (p) {
            p.socket.sendmsg({
                type: g_events.server_table_fa_pai_other,
                user_id: player.user_id
            });
        });
        //对发的牌进行判断，有可能扛或胡的。如果用户没有打牌，不再进行发牌后的选择检测
        //另外，玩家可以留杠，等摸牌后再去扛张牌，看能否胡！
        //没有第二个参数，表明只是用于自己的检测！
        this.decideSelectShow(player, paiName);
        //发牌之后给其发送消息，如果有select选项的话！
        if (this.selectShowQue.canSelect(player)) {
            this.selectShowQue.send_can_select_to(player);
        }
        this.sendClient_can_dapai_ifcan(player);
        return paiName;
    };
    /**决定玩家是否可以打牌 todo: 玩家的can_pai作为唯一能够打牌的判断 */
    Room.prototype.sendClient_can_dapai_ifcan = function (player) {
        if (this.isAllPlayersNormal()) {
            console.log(chalk_1["default"].green("\u73A9\u5BB6\u4EEC\u6B63\u5E38\uFF0C" + player.username + "\u53EF\u4EE5\u6253\u724C"));
            player.socket.sendmsg({ type: g_events.server_can_dapai });
        }
    };
    /**所有玩家处于正常状态，指房间内所有玩家不是碰、杠、亮、胡选择状态的时候*/
    Room.prototype.isAllPlayersNormal = function () {
        return this.selectShowQue.isAllPlayersNormal();
    };
    /**玩家所在socket打牌pai*/
    Room.prototype.client_da_pai = function (player, dapai_name) {
        var _this = this;
        if (this.selectShowQue.hasSelectShow()) {
            // throw new Error();
            console.log(chalk_1["default"].red("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + " \u65E0\u6CD5\u6253\u724C\uFF0C" + this.selectShowQue.players.map(function (p) { return p.username; }) + "\u5B58\u5728selectShow"));
            return;
        }
        //记录下哪个在打牌
        this.dapai_player = player;
        //告诉其它两个玩家，谁在打牌，打什么牌
        player.otherPlayersInRoom.forEach(function (p) {
            p.otherDapai = { pai_name: dapai_name, player: player };
        });
        /**没有用户在选择操作胡、杠、碰、过、亮 */
        if (this.isAllPlayersNormal()) {
            //帮玩家记录下打的是哪个牌,保存在player.used_pai之中
            player.daPai(dapai_name);
            //记录此玩家的打牌操作
            this.operation_sequence.push({
                who: player,
                action: Operate.da,
                pai: dapai_name
            });
            //房间记录下用户打的牌
            // this.table_dapai = dapai_name
            //todo: 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！
            this.broadcastServerDapaiInclude(player, dapai_name);
            // this.server_fa_pai(this.next_player);
            // return;
            var noPaiInRoom = 0 === this.cloneTablePais.length;
            if (noPaiInRoom) {
                //告诉所有人游戏结束了
                this.players.forEach(function (p) {
                    p.socket.sendmsg({
                        type: g_events.server_gameover,
                        result: "liuju"
                    });
                });
                //todo:告诉其它人哪个是赢家或者是平局
            }
            else {
                //打牌之后自己也可以听、或者亮的！当然喽，不能胡自己打的牌。所以还是有可能出现三家都在听的情况！
                // let oplayers = this.other_players(player);
                var refreshAllPlayersSelectShow = function () {
                    for (var _i = 0, _a = _this.players; _i < _a.length; _i++) {
                        var item_player = _a[_i];
                        //每次循环开始前都需要重置，返回并控制客户端是否显示胡、亮、杠、碰
                        //todo: 打牌玩家和其它看牌的玩家其实还是应该分开处理，以体现出差别。
                        _this.decideSelectShow(item_player, dapai_name);
                    }
                };
                refreshAllPlayersSelectShow();
                this.selectShowQue.send_can_select_to_TopPlayer();
                //todo: 打牌玩家其实还可以有操作，亮、自扛，但是不能碰、杠自己打的牌！
                //不能胡、杠、碰就发牌给下一个玩家
                if (this.isAllPlayersNormal()) {
                    this.server_fa_pai(this.next_player);
                }
            }
        }
        else {
            //有玩家在选择状态，不能打牌
            //todo: 过时计算，双重保险，有变量is_thinking_tingliang来控制。
            //另外，商用版本的话有人这时候打牌肯定是用了外挂或者客户端出了毛病！
            //有人还在想着打牌，你就打了，这样是无效的操作。
            console.log(chalk_1["default"].red("\u6709\u73A9\u5BB6\u5728\u601D\u8003\u4E2D\uFF0C" + player.username + "\u4E0D\u80FD\u6253\u724C"));
        }
    };
    /**玩家是否能显示（胡、亮、杠、碰）的选择窗口 */
    Room.prototype.decideSelectShow = function (player, pai_name) {
        if (pai_name === void 0) { pai_name = null; }
        player.arr_selectShow = Array(4).fill(false);
        /**客户端亮之后可以隐藏的牌*/
        //首先要清空能够亮、能扛的牌，因为需要重新计算
        player.canHidePais = [];
        player.canGangPais = [];
        //流式处理，一次判断所有，然后结果发送给客户端
        //玩家能胡了就可以亮牌,已经亮过的就不需要再检测了
        //此种情况也包括了pai_name为空的情况！意思就是只检测能否亮牌！
        //如果没亮而且玩家没有摸牌，才去检测亮。
        if (!player.is_liang && !player.mo_pai) {
            if (player.canLiang()) {
                // isShowLiang = true
                player.isShowLiang = true;
                player.canHidePais = player.PaiArr3A();
                console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u53EF\u4EE5\u4EAE\u724C");
                puts(player.hupai_data);
            }
        }
        //如果玩家自己有杠，也是可以杠的，哪怕是别人打了牌！貌似有点儿小问题，啥呢？每次打牌我都不杠，这也叫气死个人！
        //比如我碰了张牌，后来又起了一张，但是与其它牌是一句话，这样每次都会提醒杠！你每次都要选择过！
        //不管摸不摸牌，都会检测有没有自扛的牌，因为玩家可能留着以后再扛
        this.get_canGangPais_To(player);
        var otherPlayer_dapai = this.dapai_player !== player;
        /**有pai_name, 说明是别人打或者自己摸的 */
        if (pai_name) {
            //是否是其它玩家打牌
            if (this.dapai_player && otherPlayer_dapai && !player.mo_pai) {
                //如果用户亮牌而且可以胡别人打的牌
                if (player.is_liang && player.canHu(pai_name)) {
                    // isShowHu = true
                    player.isShowHu = true;
                    console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u4EAE\u724C\u4E4B\u540E\u53EF\u4EE5\u80E1\u724C" + pai_name);
                }
                // 大胡也可以显示胡牌
                //todo: 如果已经可以显示胡，其实这儿可以不用再检测了！
                if (!player.isShowHu && player.isDaHu(pai_name)) {
                    // isShowHu = true
                    player.isShowHu = true;
                    console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u53EF\u4EE5\u5927\u80E1\uFF1A" + pai_name);
                    //todo: 等待20秒，过时发牌
                }
                if (player.canGangOther(pai_name)) {
                    //如果能够扛其它人的牌
                    player.isShowGang = true;
                    //还要把这张能够扛的牌告诉客户端，canGangPais是发往客户端告诉你哪些牌能扛的！
                    //todo:如果canGangPais为空，那么就不要让用户选择！如果只有一个，也不需要用户选择，直接扛
                    player.canGangPais.push(pai_name);
                    console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u53EF\u4EE5\u625B\u7684\u724C" + player.canGangPais);
                }
                if (player.canPeng(pai_name)) {
                    player.isShowPeng = true;
                    console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u53EF\u4EE5\u78B0\u724C" + pai_name);
                }
            }
        }
        //如果是自己打牌或者摸牌，就不再去检测碰他人、杠他人
        //自己摸牌后其实已经有canGangPais, 不用再检查杠了。
        //摸牌后并没有重复计算胡牌，所以可以使用其判断胡牌！
        if (player.mo_pai) {
            if (player.canZhiMo()) {
                player.isShowHu = true;
                console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u53EF\u4EE5\u81EA\u6478" + player.mo_pai);
            }
        }
        // [isShowHu, isShowLiang, isShowGang, isShowPeng]统计这个即可！
        var hasOperation = player.arr_selectShow.some(function (s) { return s === true; });
        if (hasOperation) {
            console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + " \u53EF\u4EE5\u663E\u793A\u9009\u62E9\u5BF9\u8BDD\u6846\uFF0C\u5176\u624B\u724C\u4E3A:");
            // puts(player.group_shou_pai)
            console.log("\u53EF\u4EE5\u9690\u85CF\u7684\u724C\uFF1A" + player.canHidePais);
            console.log("\u53EF\u4EE5\u6760\u7684\u724C\uFF1A" + player.canGangPais);
            //每次都是新的数组赋值，但是其它时候可能会读取到此数据，并不保险！
            //todo: 打牌之后应该清空此可选择菜单数组, 四个变量已经改成player的属性值！
            // player.arr_selectShow = [isShowHu, isShowLiang, isShowGang, isShowPeng]
            this.selectShowQue.addAndAdjustPriority(player);
            // console.log(`${item_player.username} isShowHu: %s, isShowLiang: %s, isShowGang: %s, isShowPeng: %s`, isShowHu, isShowLiang, isShowGang, isShowPeng);
            //todo: 客户端需要更新名称allHidePais, allGangPais
            // player.socket.sendmsg({
            //   type: g_events.server_can_select,
            //   arr_selectShow: player.arr_selectShow,
            //   canHidePais: player.canHidePais,
            //   canGangPais: player.canGangPais
            // })
        }
        else {
            //如果没有操作选项，则清空
            player.arr_selectShow = [];
        }
        //给队列头玩家发送消息，其它人不发送
        return hasOperation;
    };
    Room.prototype.get_canGangPais_To = function (player) {
        if (player.mo_pai) {
            player.canGangPais = player.canZhiGangPais();
            if (player.canGangPais.length > 0) {
                // isShowGang = true
                player.isShowGang = true;
                console.log("\u623F\u95F4" + this.id + " \u73A9\u5BB6" + player.username + "\u53EF\u4EE5\u81EA\u6760\u724C:" + player.canGangPais);
            }
        }
    };
    /**
     * 给房间内的所有玩家广播消息
     * @param event_type 事件类型
     * @param data 事件所携带数据
     * @param except_player 需要排除的玩家，参数可以忽略，表示为所有人发送数据
     */
    Room.prototype.broadcast = function (event_type, data, except_player) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player == except_player) {
                continue;
            }
            player.socket.sendmsg(__assign({ type: event_type }, data));
        }
    };
    /**
     * 广播服务器打牌的消息给所有玩家
     * @param player 包括本玩家
     * @param pai_name 打的什么牌
     */
    Room.prototype.broadcastServerDapaiInclude = function (player, pai_name) {
        player.socket.sendmsg({
            type: g_events.server_dapai,
            pai_name: pai_name,
            group_shou_pai: player.group_shou_pai
        });
        //告诉其它玩家哪个打牌了, 其它信息用户在加入房间的时候已经发送过了。
        player.otherPlayersInRoom.forEach(function (p) {
            p.socket.sendmsg({
                type: g_events.server_dapai_other,
                username: player.username,
                user_id: player.user_id,
                pai_name: pai_name
            });
        });
    };
    Object.defineProperty(Room.prototype, "zhuangJia", {
        get: function () {
            //获取东家
            return this.players.find(function (p) { return true === p.east; });
        },
        enumerable: false,
        configurable: true
    });
    Room.prototype.setDongJia = function (player) {
        //只能有一个东家, 不使用other_players计算麻烦
        this.players.forEach(function (p) {
            p.east = false;
        });
        player.east = true;
    };
    /**过滤grou_shou_pai,
     * @param ignore_filter 是否忽略此过滤器，用户选择亮牌，就不再需要过滤了。
     */
    Room.prototype.filterGroup = function (player, ignore_filter) {
        if (ignore_filter === void 0) { ignore_filter = false; }
        if (ignore_filter) {
            return player.group_shou_pai;
        }
        else {
            //需要新建group对象返回，不能改变原有的数据！
            var newGroup = _.cloneDeep(player.group_shou_pai);
            newGroup.anGang = [];
            newGroup.anGangCount = player.group_shou_pai.anGang.length;
            newGroup.selfPeng = [];
            newGroup.selfPengCount = player.group_shou_pai.selfPeng.length;
            newGroup.shouPai = [];
            newGroup.shouPaiCount = player.group_shou_pai.shouPai.length;
            return newGroup;
        }
    };
    Room.prototype.sendGroupShouPaiOf = function (p) {
        var leftGroup = this.filterGroup(this.left_player(p));
        var rightGroup = this.filterGroup(this.right_player(p));
        p.socket.sendmsg({
            type: g_events.server_game_start,
            god_player: { group_shou_pai: p.group_shou_pai },
            left_player: { group_shou_pai: leftGroup },
            right_player: { group_shou_pai: rightGroup }
        });
    };
    Room.prototype.serverGameStart = function (clonePais) {
        var _this = this;
        if (clonePais === void 0) { clonePais = TablePaiManager_1.TablePaiManager.fapai_random(); }
        //如果没有准备好，返回！
        if (!this.all_ready) {
            return;
        }
        //初始化牌面
        //todo: 转为正式版本 this.clone_pai = _.shuffle(config.all_pai);
        //todo: 仅供测试用的发牌器
        this.cloneTablePais = clonePais;
        //开始给所有人发牌，并给东家多发一张
        if (!this.zhuangJia) {
            throw new Error(chalk_1["default"].red("房间${id}没有东家，检查代码！"));
        }
        //先把所有玩家的牌准备好！
        this.players.forEach(function (p, index) {
            //玩家收到的牌保存好，以便服务器进行分析，每次都需要排序下，便于分析和查看
            p.group_shou_pai.shouPai = _.orderBy(_this.cloneTablePais.splice(0, 13));
            //发牌完毕就要计算胡了，会有人可能天胡，或者起手就听牌
            p.calculateHu();
        });
        // 再进行相关的消息发送！
        this.players.forEach(function (p, index) {
            //有可能游戏一开始就听牌，或者你可以亮出来！这时候是不可能胡的，因为你牌不够，需要别人打一张或者自己摸张牌
            //todo: 如果东家也可以听牌呢？所以每个用户都需要检测一遍！
            _this.sendGroupShouPaiOf(p);
            if (p == _this.zhuangJia) {
                //告诉东家，服务器已经开始发牌了，房间还是得负责收发，玩家类只需要保存数据和运算即可。
                //不管东家会不会胡，都是需要发牌的！
                // this.server_fa_pai(p);
            }
            else {
                //测试一下如何显示其它两家的牌，应该在发牌之后，因为这时候牌算是发完了，不然没牌的时候你显示个屁哟。
                //非东家，接收到牌即可
                // this.sendGroupShouPaiOf(p);
                _this.decideSelectShow(p);
            }
        });
        //所有人发完13张，再给东家发张牌，从其开始打
        this.server_fa_pai(this.zhuangJia);
        //decideSelectShow已经写入server_fa_pai中。
        // this.decideSelectShow(this.dong_jia, this.dong_jia.mo_pai)
        //游戏开始后，所有玩家退出准备状态！为重新开启游戏做准备。
        this.players.forEach(function (p) { return (p.ready = false); });
    };
    Room.prototype.initPlayers = function (lobby) {
        var newPlayers = [];
        this.players.forEach(function (p) {
            var person = new player_1.Player({
                group_shou_pai: {
                    anGang: [],
                    mingGang: [],
                    peng: [],
                    selfPeng: [],
                    shouPai: []
                },
                socket: p.socket,
                username: p.username,
                user_id: p.user_id
            });
            //todo: 设定哪个是庄家，貌似是放炮的是庄家？如果平局，则还是上一家。
            person.east = p.east;
            //保留玩家的座位号
            person.seat_index = p.seat_index;
            //赋值后相当于是清空了玩家的所有数据。
            newPlayers.push(person);
            lobby.find_conn_by(p.socket).player = person;
        });
        this.players = newPlayers;
    };
    //游戏结束后重新开始游戏！
    Room.prototype.clientRestartGame = function (lobby, client_message, socket) {
        var player = this.find_player_by(socket);
        //todo: 做一简单防护，玩家不能保存两次数据
        MyDataBase_1.MyDataBase.getInstance().save(player);
        player.ready = true;
        var all_confirm_restart = this.players.every(function (p) { return true === p.ready; });
        if (all_confirm_restart) {
            //清空所有玩家的牌，还是新建player? 哪个速度更快一些呢？可能新建对象会慢吧。
            this.initPlayers(lobby);
            this.serverGameStart();
        }
    };
    /**房主解散房间 */
    Room.prototype.clientCreatorDissolve = function (lobby, client_message, socket) {
        var player = this.find_player_by(socket);
        //如果不是房主，则返回
        if (player.master == false) {
            return;
        }
        //通知所有人房主解散了
        this.broadcast(g_events.server_dissolve, {});
        socket.disconnect();
        return "ok";
    };
    return Room;
}());
exports.Room = Room;
