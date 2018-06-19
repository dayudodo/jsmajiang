"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const _ = require("lodash");
const chalk_1 = require("chalk");
const g_events = require("./events");
const player_1 = require("./player");
const util = require("util");
const TablePaiManager_1 = require("./TablePaiManager");
const ScoreManager_1 = require("./ScoreManager");
let room_valid_names = ["ange", "jack", "rose"];
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
//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
class Room {
    constructor() {
        /**房间号，唯一，用户需要根据这个id进入房间*/
        this.id = null;
        //房间内的所有玩家，人数有上限，定义在config.
        this.players = [];
        //房间内的牌
        this.cloneTablePais = [];
        /**当前玩家，哪个打牌哪个就是当前玩家*/
        this.current_player = null;
        //todo: 是否接受用户的吃、碰，服务器在计时器，过时就不会等待用户确认信息了！
        this.can_receive_confirm = false;
        /** 服务器当前发的牌 */
        // public table_fa_pai: Pai = null;
        /**当前桌子上的所有人都能看到的打牌，可能是服务器发的，也可能是用户从自己手牌中打出来的。*/
        this.table_dapai = null;
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
        /**游戏刚开始，需要检测一次选择状态！ */
        this.game_start = true;
        // 房间新建之后，就会拥有个id了
        this.id = Room.getId();
    }
    /**创建一个唯一的房间号，其实可以用redis来生成一个号，就放在内存里面*/
    static getId() {
        //todo: 暂时用模拟的功能，每次要创建的时候，其实都是用的数组中的一个名称
        //正规的自然是要生成几个唯一的数字了，然后还要分享到微信之中让其它人加入
        return "001";
    }
    //用户加入房间，还需要告诉其它的用户我已经加入了
    join_player(person) {
        this.players.push(person);
    }
    player_enter_room(socket) {
        //首先应该看玩家是否已经 在房间里面了
        let player = this.find_player_by(socket);
        if (!player) {
            console.warn("加入房间之前，玩家未加入this.players");
        }
        //首先告诉其它人player进入房间！客户端会添加此玩家
        this.other_players(player).forEach(p => {
            p.socket.sendmsg({
                type: g_events.server_other_player_enter_room,
                username: player.username,
                user_id: player.user_id,
                seat_index: player.seat_index,
                score: player.score
            });
        });
        //用户加入房间，肯定是2，3玩家，需要服务器发送时添加其它玩家的数据
        //庄家创建房间时只有一个人，所以不需要另行通知。
        let other_players_info = this.other_players(player).map(item => {
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
    }
    server_receive_ready(socket) {
        //向房间内所有人通知我已经准备好
        let player = this.find_player_by(socket);
        this.players.forEach(p => {
            p.socket.sendmsg({
                type: g_events.server_receive_ready,
                username: player.username
            });
        });
    }
    //玩家选择退出房间，应该会有一定的惩罚，如果本局还没有结束
    exit_room(socket) {
        _.remove(this.players, function (item) {
            return item.socket.id == socket.id;
        });
    }
    find_player_by(socket) {
        return this.players.find(item => item.socket == socket);
    }
    /**某玩家的所有操作 */
    OperationsOf(player) {
        return this.operation_sequence.filter(item => item.who === player);
    }
    /**玩家player的前step次操作，限定玩家，以免有其它玩家的操作干扰 */
    front_operationOf(player, step) {
        let p_operations = this.OperationsOf(player);
        if (p_operations[p_operations.length - step]) {
            return p_operations[p_operations.length - step];
        }
        else {
            return null;
        }
    }
    /**最后 一个操作 */
    last_Operation() {
        return _.last(this.operation_sequence);
    }
    //玩家们是否都已经准备好开始游戏
    get all_ready() {
        let player_ready_count = this.players.filter(item => item.ready).length;
        console.log(`房间:${this.id}内玩家准备开始计数：${player_ready_count}`);
        return player_ready_count == config.LIMIT_IN_ROOM;
    }
    get players_count() {
        return this.players.length;
    }
    get all_player_names() {
        return this.players.map(person => {
            return person.username;
        });
    }
    //最后一位加入游戏的玩家
    get last_join_player() {
        return _.last(this.players);
    }
    /** 房间中要发牌的下一个玩家 */
    get next_player() {
        //下一家
        let next_index = (this.current_player.seat_index + 1) % config.LIMIT_IN_ROOM;
        //最后通过座位号来找到玩家,而不是数组序号,更不容易出错，哪怕是players数组乱序也不要紧
        return this.players.find(p => p.seat_index == next_index);
    }
    /**放炮玩家，玩家自摸则返回空 */
    get fangpao_player() {
        return this.players.find(p => p.is_fangpao == true);
    }
    /**胡牌玩家，可能有多个，一炮双响！ */
    get hupai_players() {
        return this.players.filter(p => p.hupai_zhang != null);
    }
    //除了person外的其它玩家们
    other_players(person) {
        // console.log("查找本玩家%s的其它玩家", person.username);
        let o_players = this.players.filter(p => p.user_id != person.user_id);
        // console.log(o_players.map(p => p.username));
        return o_players;
    }
    left_player(person) {
        //左手玩家
        let index = person.seat_index - 1;
        index = index == -1 ? config.LIMIT_IN_ROOM - 1 : index;
        return this.players.find(p => p.seat_index == index);
    }
    right_player(person) {
        //右手玩家
        let index = person.seat_index + 1;
        index = index == config.LIMIT_IN_ROOM ? 0 : index;
        return this.players.find(p => p.seat_index == index);
    }
    /**没有玩家摸牌 */
    no_player_mopai() {
        return this.players.every(p => p.mo_pai == null);
    }
    /**
     * 玩家数据过滤器，返回客户端需要的属性值
     * @param socket 哪个socket
     * @param player 需要向哪个玩家发送消息
     * @param ignore_filter 是否忽略filter
     */
    player_data_filter(socket, player, ignore_filter = false) {
        let player_data = {};
        player_1.Player.filter_properties.forEach(item => {
            player_data[item] = _.clone(player[item]);
        });
        //是玩家本人的socket，返回所有的数据
        if (player.socket == socket) {
            return player_data;
        }
        else if (ignore_filter) {
            //哪怕是忽略过滤器，sidePlayer也不能显示出其它人的selfPeng
            player_data["group_shou_pai"]["selfPeng"] = [];
            player_data["group_shou_pai"]["selfPengCount"] = player.group_shou_pai.selfPeng.length;
            return player_data;
            //不是god_player, 也没有忽略过滤器，就全过滤！
        }
        else {
            //暗杠只有数量，但是不显示具体的内容
            let shou_pai = player_data["group_shou_pai"];
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
    }
    /**玩家胜负属性值，由result_properties决定 */
    player_result_filter(player) {
        let result = {};
        player_1.Player.result_properties.forEach(item => {
            result[item] = _.cloneDeep(player[item]);
        });
        return result;
    }
    /**玩家选择碰牌，或者是超时自动跳过！*/
    client_confirm_peng(socket) {
        let pengPlayer = this.find_player_by(socket);
        pengPlayer.is_thinking = false;
        //碰之后打牌玩家的打牌就跑到碰玩家手中了
        let dapai = this.dapai_player.arr_dapai.pop();
        //碰也相当于是碰玩家也摸了张牌！
        pengPlayer.mo_pai = dapai;
        //玩家确认碰牌后将会在group_shou_pai.peng中添加此dapai
        pengPlayer.confirm_peng(dapai);
        //碰牌的人成为当家玩家，因为其还要打牌！下一玩家也是根据这个来判断的！
        this.current_player = pengPlayer;
        pengPlayer.can_dapai = true;
        if (this.all_players_normal()) {
            console.log(chalk_1.default.green(`玩家们正常，碰家：${pengPlayer.username}可以打牌`));
            pengPlayer.socket.sendmsg({ type: g_events.server_can_dapai });
        }
        //给每个人都要发出全部玩家的更新数据，这样最方便！
        this.players.forEach(person => {
            let players = this.players.map(p => {
                //如果玩家已经亮牌，显示其所有牌！
                if (p.is_liang) {
                    return this.player_data_filter(person.socket, p, true);
                }
                else {
                    return this.player_data_filter(person.socket, p);
                }
            });
            person.socket.sendmsg({
                type: g_events.server_peng,
                players: players,
                pengPlayer_user_id: pengPlayer.user_id
            });
        });
    }
    /**玩家选择杠牌，或者是超时自动跳过！其实操作和碰牌是一样的，名称不同而已。*/
    client_confirm_mingGang(client_message, socket) {
        let gangPlayer = this.find_player_by(socket);
        gangPlayer.is_thinking = false;
        //有选择的杠牌说明用户现在有两套可以杠的牌，包括手起4，和别人打的杠牌！
        let selectedPai = client_message.selectedPai;
        //有可能传递过来的杠牌是别人打的牌，这样算杠感觉好麻烦，不够清晰！有啥其它的办法？
        //如果杠别人的牌，或者杠自己摸的牌
        if (selectedPai == this.table_dapai || selectedPai == gangPlayer.mo_pai) {
            //设置为null, 表明不是自己摸的扛或者天生就是4张。
            selectedPai = null;
        }
        //对参数进行检查！
        if (selectedPai) {
            if (!gangPlayer.canGangPais().includes(selectedPai)) {
                throw new Error(`玩家：${gangPlayer.username}可以杠的牌${gangPlayer.canGangPais()}并不包括${selectedPai}`);
            }
        }
        let gangPai;
        //自己扛, 包括客户端能够发送selectedPai, 或者摸牌的玩家就是扛玩家
        // this.fapai_to_who === gangPlayer会有一个问题，正好是给下一家发牌且他能杠！就出错了。
        //所以，发牌的时候，要控制下，只有杠玩家打牌之后才能发牌！
        let selfGang = selectedPai || this.fapai_to_who === gangPlayer;
        if (selfGang) {
            gangPai = selectedPai ? selectedPai : gangPlayer.mo_pai;
            this.operation_sequence.push({
                who: gangPlayer,
                action: Operate.gang,
                pai: gangPai,
                self: true
            });
            //如果是玩家自己摸的4张牌
            if (selectedPai) {
                gangPlayer.confirm_anGang(selectedPai);
                gangPlayer.saveAnGang(this.other_players(gangPlayer), selectedPai);
            }
            else {
                //如果是摸牌之后可以暗杠？不能暗杠就是擦炮了
                if (gangPlayer.isMoHouSi(gangPlayer.mo_pai)) {
                    console.log(`玩家${gangPlayer.username}自己摸牌${gangPai}可以扛`);
                    gangPlayer.confirm_anGang(gangPlayer.mo_pai);
                    gangPlayer.saveAnGang(this.other_players(gangPlayer), gangPlayer.mo_pai);
                }
                else {
                    console.log(`玩家${gangPlayer.username}擦炮 ${gangPai}`);
                    //擦炮其实也是一种明杠
                    gangPlayer.confirm_mingGang(gangPlayer.mo_pai);
                    gangPlayer.saveCaPao(this.other_players(gangPlayer), gangPlayer.mo_pai);
                }
            }
            //只要扛了就从后面发牌，并且不用判断是否已经打牌！
            console.log(`玩家自摸牌可杠，发牌给${gangPlayer.username}`);
            this.server_fa_pai(gangPlayer, true);
        }
        else {
            //扛别人的牌, 暗杠还没有完成，别人又打了一个杠！这种情况下应该优先选择是否杠别人的牌，或者过，过了就不能再选自己的扛牌了
            //按理说应该一次只能来一次操作！扛了再扛已经是有点儿过份了！这种处理的话如果选择过，别人打牌后自己还是可以扛，编程来说也
            //方便的多
            //杠之后打牌玩家的打牌就跑到杠玩家手中了
            gangPai = this.dapai_player.arr_dapai.pop();
            if (gangPai != this.table_dapai) {
                throw new Error(`放杠者：${gangPai} 与 table_pai: ${this.table_dapai}不相同？`);
            }
            this.operation_sequence.push({
                who: gangPlayer,
                action: Operate.gang,
                pai: gangPai,
                detail: {
                    from: this.dapai_player,
                    to: gangPlayer
                }
            });
            //纪录玩家放了一杠，扣钱！还得判断下打牌玩家打牌之前是否杠牌了, 杠家其实是前三步，第一步杠，第二步摸，第三步才是打牌！
            let gangShangGang = false;
            let prev3_operation = this.front_operationOf(this.dapai_player, 3);
            if (prev3_operation) {
                gangShangGang = prev3_operation.action === Operate.gang;
            }
            if (gangShangGang) {
                gangPlayer.saveGangShangGang(this.dapai_player, gangPai);
            }
            else {
                gangPlayer.saveGang(this.dapai_player, gangPai);
            }
            console.log("====================================");
            // puts(this.OperationsOf(this.daPai_player))
            console.log(`${this.dapai_player.username} lose_names:`);
            console.dir(this.dapai_player.lose_names);
            console.log("====================================");
            //在杠玩家的group_shou_pai.peng中添加此dapai
            gangPlayer.confirm_mingGang(gangPai);
            //自己摸杠和杠他人牌后的发牌分开处理！
            //杠别人的牌后就得发一张牌，当前还是加个判断比较好，没人摸牌的话，就给自己发一张。
            if (this.no_player_mopai()) {
                this.server_fa_pai(gangPlayer);
                //并且让自己可以打牌
                // this.decide_can_dapai(gangPlayer);
            }
        }
        //碰牌的人成为当家玩家，因为其还要打牌！下一玩家也是根据这个来判断的！
        this.current_player = gangPlayer;
        //给每个人都要发出全部玩家的更新数据，这样最方便！简单粗暴，尤其适合开发阶段及教学
        this.players.forEach(person => {
            let players = this.players.map(p => {
                //如果玩家已经亮牌，显示其所有牌！
                if (p.is_liang) {
                    return this.player_data_filter(person.socket, p, true);
                }
                else {
                    return this.player_data_filter(person.socket, p);
                }
            });
            person.socket.sendmsg({
                type: g_events.server_mingGang,
                players: players,
                gangPlayer_user_id: gangPlayer.user_id
            });
        });
    }
    /**决定在何种情况下可以发牌并决定哪个玩家可以打牌！ */
    decide_fapai() {
        if (this.all_players_normal()) {
            //都正常且没人摸牌的情况下才能发牌
            if (this.no_player_mopai()) {
                this.server_fa_pai(this.next_player);
            }
            //这时候才能够告诉摸牌的人你可以打牌
            // let moPlayer: Player = this.players.find(p => p.mo_pai != null);
            let moPlayers = this.players.filter(p => p.mo_pai !== null);
            if (moPlayers && moPlayers.length > 1) {
                throw new Error(`存在两玩家同时摸牌！${moPlayers}`);
            }
            let moPlayer = moPlayers[0];
            this.decide_can_dapai(moPlayer);
        }
    }
    /**亮牌，胡后2番，打牌之后才能亮，表明已经听胡了*/
    client_confirm_liang(client_message, socket) {
        let player = this.find_player_by(socket);
        //玩家已经有决定，不再想了。
        player.is_thinking = false;
        player.is_liang = true;
        //如果liangHidePais有效
        if (client_message.liangHidePais && client_message.liangHidePais.length > 0) {
            let liangHidePais = client_message.liangHidePais.sort();
            let rightSelectPais = player.PaiArr3A();
            //所有的牌都应该在PaiArr3A之中，安全检测
            let normalSelect = liangHidePais.every(pai => rightSelectPais.includes(pai));
            if (normalSelect) {
                liangHidePais.forEach(pai => {
                    player.confirm_selfPeng(pai);
                });
            }
            else {
                console.warn(`用户亮牌后选择${liangHidePais}不在服务器的正常选择中：${rightSelectPais}`);
            }
        }
        //亮牌之后，需要显示此玩家的所有牌，除了暗杠及自碰牌！
        this.players.forEach(p => {
            p.socket.sendmsg({
                type: g_events.server_liang,
                liangPlayer: this.player_data_filter(p.socket, player, true)
            });
        });
        this.operation_sequence.push({
            who: player,
            action: Operate.liang
        });
        //还没有发过牌呢，说明是刚开始游戏，庄家亮了。
        //此判断还能防止两家都亮的情况，如果有人摸了牌，就算你亮牌也不会有啥影响，保证只有一个人手里面有摸牌！
        //仅仅依靠最后一个是打牌来进行发牌是不对的，如果遇上了一人打牌后 有人可亮，有人可碰，还没有碰呢，你亮了，结果就发牌了！
        //所以还需要啥呢？没人在思考状态！或者说是正常的状态下！并且有人打牌了，才可以发牌！
        this.decide_fapai();
    }
    //玩家选择放弃，给下一家发牌
    client_confirm_guo(socket) {
        //如果用户是可以胡牌的时候选择过，那么需要删除计算出来的胡牌张！
        let player = this.find_player_by(socket);
        //玩家有决定了，状态改变
        player.is_thinking = false;
        //选择过牌之后，还得判断一下当前情况才好发牌，比如一开始就有了听牌了，这时候选择过，准确的应该是头家可以打牌！
        //同一时间只能有一家可以打牌！服务器要知道顺序！知道顺序之后就好处理了，比如哪一家需要等待，过时之后你才能够打牌！
        //现在的情况非常特殊，两家都在听牌，都可以选择过，要等的话两个都要等。
        //房间玩家手里面都没有摸牌，可以发牌！因为玩家在打牌之后其摸牌为空！
        this.decide_fapai();
    }
    /**玩家选择胡牌*/
    client_confirm_hu(socket) {
        let player = this.find_player_by(socket);
        player.is_hu = true;
        player.is_thinking = false; //一炮双响的时候会起作用！
        //自摸，胡自己摸的牌！
        if (player.mo_pai && player.canHu(player.mo_pai)) {
            player.is_zimo = true;
            player.hupai_zhang = player.mo_pai;
            player.temp_win_codes.push(config.HuisZiMo);
            //获取前2次的操作，因为上一次肯定是摸牌，摸牌的上一次是否是杠！
            let prev2_operation = this.front_operationOf(player, 2);
            if (prev2_operation && prev2_operation.action == Operate.gang) {
                player.temp_win_codes.push(config.HuisGangShangKai);
            }
            puts(this.operation_sequence);
            //并且扛牌是可以自己摸也可以求人！记录用户操作倒是对历史回放有一定帮助。
            this.sendAllResults(player, player.mo_pai);
        }
        //胡别人的打的牌
        else if (player.canHu(this.table_dapai)) {
            player.hupai_zhang = this.table_dapai;
            //记录放炮者
            let fangType = player.isDaHu(this.table_dapai) ? config.LoseDaHuPao : config.LosePihuPao;
            this.dapai_player.lose_data.push({
                type: fangType,
                pai: this.table_dapai
            });
            this.sendAllResults(player, this.table_dapai);
            console.dir(this.hupai_players);
            console.dir(this.dapai_player.lose_data);
        }
        else {
            `${player.user_id}, ${player.username}想胡一张不存在的牌，抓住这家伙！`;
        }
    }
    /**所有玩家的牌面返回客户端 */
    sendAllResults(player, hupaiZhang) {
        if (player.is_liang) {
            player.temp_win_codes.push(config.HuisLiangDao);
        }
        ScoreManager_1.ScoreManager.cal_oneju_score(this.players);
        //todo: 读秒结束才会发送所有结果，因为可能会有两个胡牌玩家！
        //暂时用思考变量来控制最终的发送！
        if (this.all_players_normal) {
            let players = this.players.map(person => this.player_result_filter(person));
            this.players.forEach(p => {
                p.socket.sendmsg({
                    type: g_events.server_winner,
                    players: players
                });
            });
        }
    }
    /**房间发一张给player, 让player记录此次发牌，只有本玩家能看到
     * @param fromEnd 是否从最后发牌
     */
    server_fa_pai(player, fromEnd = false) {
        let pai;
        if (fromEnd) {
            pai = [this.cloneTablePais.pop()];
        }
        else {
            pai = this.cloneTablePais.splice(0, 1);
        }
        if (_.isEmpty(pai)) {
            throw new Error(chalk_1.default.red(`room.pai中无可用牌了`));
        }
        //看用户的状态，如果快要胡牌了，发牌还不太一样！不需要用户再操作了！
        if (player.is_liang) {
            console.log(`todo: ${player.username}已经亮牌，客户端应自动打牌，或者胡`);
        }
        //房间记录发牌给谁，以便分析哪个玩家拿牌了但是没有打，说明在等待其它玩家！
        this.fapai_to_who = player;
        //发牌给谁，谁就是当前玩家
        this.current_player = player;
        this.operation_sequence.push({
            who: player,
            action: Operate.mo,
            pai: pai[0]
        });
        //判断完毕再保存到用户的手牌中！不然会出现重复判断的情况！
        player.mo_pai = pai[0];
        //对发的牌进行判断，有可能扛或胡的。如果用户没有打牌，不再进行发牌后的选择检测
        this.decideSelectShow(player, pai[0]);
        console.log(chalk_1.default.cyan("服务器发牌 %s 给：%s"), player.mo_pai, player.username);
        console.log("房间 %s 牌还有%s张", this.id, this.cloneTablePais.length);
        // player.socket.emit("server_table_fapai", pai);
        player.socket.sendmsg({
            type: g_events.server_table_fa_pai,
            pai: player.mo_pai
        });
        //发牌还应该通知其它玩家以便显示指向箭头，不再是只给当前玩家发消息
        this.other_players(player).forEach(p => {
            p.socket.sendmsg({
                type: g_events.server_table_fa_pai_other,
                user_id: player.user_id
            });
        });
        this.decide_can_dapai(player);
        return pai[0];
    }
    /**决定玩家是否可以打牌 */
    decide_can_dapai(player) {
        player.can_dapai = true;
        if (this.all_players_normal()) {
            console.log(chalk_1.default.green(`玩家们正常，${player.username}可以打牌`));
            player.socket.sendmsg({ type: g_events.server_can_dapai });
        }
    }
    /**所有玩家处于正常状态，指房间内所有玩家不是碰、杠、亮、胡选择状态的时候*/
    all_players_normal() {
        return this.players.every(p => p.is_thinking === false);
    }
    /**玩家所在socket打牌pai*/
    client_da_pai(socket, dapai_name) {
        let player = this.find_player_by(socket);
        if (!player.can_dapai) {
            // throw new Error();
            console.log(chalk_1.default.red(`房间${this.id} 玩家${player.username} 强制打牌，抓住！！！！`));
            return;
        }
        //能否正常给下一家发牌
        let canNormalFaPai = true;
        //记录下哪个在打牌
        this.dapai_player = player;
        /**没有用户在选择操作胡、杠、碰、过、亮 */
        if (this.all_players_normal()) {
            //帮玩家记录下打的是哪个牌,保存在player.used_pai之中
            player.da_pai(dapai_name);
            //打牌后不能再打牌！
            player.can_dapai = false;
            //记录此玩家的打牌操作
            this.operation_sequence.push({
                who: player,
                action: Operate.da,
                pai: dapai_name
            });
            //房间记录下用户打的牌
            this.table_dapai = dapai_name;
            //todo: 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！
            this.broadcast_server_dapai(player, dapai_name);
            // this.server_fa_pai(this.next_player);
            // return;
            let isRoomPaiEmpty = 0 === this.cloneTablePais.length;
            if (isRoomPaiEmpty) {
                //告诉所有人游戏结束了
                this.players.forEach(p => {
                    p.socket.sendmsg({
                        type: g_events.server_gameover,
                        result: "liuju"
                    });
                });
                //todo:告诉其它人哪个是赢家或者是平局
            }
            else {
                //打完牌之后如果能胡，就可以亮，但是肯定不能胡自己打的牌，另外，亮了之后就不需要再亮了！
                // if (!player.is_liang) {
                //   if (player.canLiang()) {
                //     let isShowHu = false,
                //       isShowLiang = true,
                //       isShowGang = false,
                //       isShowPeng = false;
                //     player.socket.sendmsg({
                //       type: g_events.server_can_select,
                //       select_opt: [isShowHu, isShowLiang, isShowGang, isShowPeng]
                //     });
                //   }
                // }
                //todo: 在玩家选择的时候服务器应该等待，但是如果有多个玩家在选择呢？比如这个打的牌别人可以碰或者杠？
                //发牌肯定是不可以的，要等玩家选择完牌之后才能正常发牌！
                //打牌之后自己也可以听、或者亮的！当然喽，不能胡自己打的牌。所以还是有可能出现三家都在听的情况！
                // let oplayers = this.other_players(player);
                for (let item_player of this.players) {
                    //每次循环开始前都需要重置，返回并控制客户端是否显示胡、亮、杠、碰
                    let canShowSelect = this.decideSelectShow(item_player, dapai_name);
                    if (canShowSelect) {
                        item_player.is_thinking = true;
                        canNormalFaPai = false;
                    }
                }
                //todo: 打牌玩家其实还可以有操作，亮、自扛，但是不能碰、杠自己打的牌！
                //不能胡、杠、碰就发牌给下一个玩家
                if (canNormalFaPai) {
                    this.server_fa_pai(this.next_player);
                }
            }
        }
        else {
            //有玩家在选择状态，不能打牌
            //todo: 过时计算，双重保险，有变量is_thinking_tingliang来控制。
            //另外，商用版本的话有人这时候打牌肯定是用了外挂或者客户端出了毛病！
            //有人还在想着打牌，你就打了，这样是无效的操作。
            console.log(chalk_1.default.red(`有玩家在思考中，${player.username}不能打牌`));
        }
    }
    /**发牌后决定玩家是否能显示（胡、杠）的选择窗口。
     * 碰、杠他人不会检测，因为你不能碰、杠自己打的牌！ */
    // private decideFaPaiSelectShow(item_player: Player, mo_pai: Pai): boolean {
    //   let isShowHu: boolean = false,
    //     isShowLiang: boolean = false,
    //     isShowGang: boolean = false,
    //     isShowPeng: boolean = false;
    //   /**客户端亮之后可以隐藏的牌*/
    //   let canLiangPais: Array<Pai> = [];
    //   let canGangPais: Array<Pai> = [];
    //   //todo: 玩家选择听或者亮之后就不再需要检测胡牌了，重复计算
    //   //流式处理，一次判断所有，然后结果发送给客户端
    //   //玩家能胡了就可以亮牌,已经亮过的就不需要再检测了
    //   if (!item_player.is_liang) {
    //     if (item_player.canLiang()) {
    //       canLiangPais = item_player.PaiArr3A();
    //       isShowLiang = true;
    //       console.log(`房间${this.id} 玩家${item_player.username}可以亮牌`);
    //       puts(item_player.hupai_data);
    //     }
    //   }
    //   //看自己能否杠
    //   canGangPais = item_player.canGangPais();
    //   if (canGangPais.length > 0) {
    //     isShowGang = true;
    //   }
    //   //没亮的时候呢可以杠，碰就不需要再去检测了
    //   if (item_player.canGang(mo_pai)) {
    //     isShowGang = true;
    //     if (!_.isEmpty(canGangPais)) {
    //       canGangPais.push(mo_pai);
    //     }
    //     console.log(`房间${this.id} 玩家${item_player.username}可以杠牌${mo_pai}`);
    //   }
    //   if (item_player.canHu(mo_pai)) {
    //     isShowHu = true;
    //     console.log(`房间${this.id} 玩家${item_player.username}可以自摸${mo_pai}`);
    //   }
    //   let canShowSelect = isShowHu || isShowLiang || isShowGang || isShowPeng;
    //   if (canShowSelect) {
    //     //表示玩家正在 想，会影响发牌、胡牌
    //     item_player.is_thinking = true;
    //     console.log(`房间${this.id} 玩家${item_player.username} 显示选择对话框，其手牌为:`);
    //     puts(item_player.group_shou_pai);
    //     // console.log(`${item_player.username} isShowHu: %s, isShowLiang: %s, isShowGang: %s, isShowPeng: %s`, isShowHu, isShowLiang, isShowGang, isShowPeng);
    //     item_player.socket.sendmsg({
    //       type: g_events.server_can_select,
    //       select_opt: [isShowHu, isShowLiang, isShowGang, isShowPeng],
    //       canLiangPais: canLiangPais,
    //       canGangPais: canGangPais
    //     });
    //   }
    //   return canShowSelect;
    // }
    /**玩家是否能显示（胡、亮、杠、碰）的选择窗口 */
    decideSelectShow(player, pai_name = null) {
        let isShowHu = false, isShowLiang = false, isShowGang = false, isShowPeng = false;
        /**客户端亮之后可以隐藏的牌*/
        let canLiangPais = [];
        let canGangPais = [];
        //流式处理，一次判断所有，然后结果发送给客户端
        //玩家能胡了就可以亮牌,已经亮过的就不需要再检测了
        //此种情况也包括了pai_name为空的情况！意思就是只检测能否亮牌！
        if (!player.is_liang) {
            if (player.canLiang()) {
                isShowLiang = true;
                canLiangPais = player.PaiArr3A();
                console.log(`房间${this.id} 玩家${player.username}可以亮牌`);
                puts(player.hupai_data);
            }
        }
        //如果玩家自己有杠，也是可以杠的，哪怕是别人打了牌！貌似有点儿小问题，啥呢？每次打牌我都不杠，这也叫气死个人！
        //比如我碰了张牌，后来又起了一张，但是与其它牌是一句话，这样每次都会提醒杠！你每次都要选择过！
        //摸牌后才会检测自扛的情况
        if (player.mo_pai) {
            canGangPais = player.canGangPais();
            if (canGangPais.length > 0) {
                isShowGang = true;
                console.log(`房间${this.id} 玩家${player.username}可以自杠牌:${canGangPais}`);
            }
        }
        let otherPlayer_dapai = this.dapai_player !== player;
        /**有pai_name, 说明是别人打或者自己摸的 */
        if (pai_name) {
            //是否是其它玩家打牌
            if (this.dapai_player && otherPlayer_dapai && !player.mo_pai) {
                //如果用户亮牌而且可以胡别人打的牌
                if (player.is_liang && player.canHu(pai_name)) {
                    isShowHu = true;
                    console.log(`房间${this.id} 玩家${player.username}亮牌之后可以胡牌${pai_name}`);
                }
                // 大胡也可以显示胡牌
                //todo: 如果已经可以显示胡，其实这儿可以不用再检测了！
                if (!isShowHu && player.isDaHu(pai_name)) {
                    isShowHu = true;
                    console.log(`房间${this.id} 玩家${player.username}可以大胡：${pai_name}`);
                    //todo: 等待20秒，过时发牌
                }
                if (player.canGang(pai_name)) {
                    isShowGang = true;
                    //还要把这张能够扛的牌告诉客户端，canGangPais是发往客户端告诉你哪些牌能扛的！
                    //如果canGangPais为空，那么就不要让用户选择！
                    if (!_.isEmpty(canGangPais)) {
                        canGangPais.push(pai_name);
                    }
                    console.log(`房间${this.id} 玩家${player.username}可以杠牌${pai_name}`);
                }
                if (player.canPeng(pai_name)) {
                    isShowPeng = true;
                    console.log(`房间${this.id} 玩家${player.username}可以碰牌${pai_name}`);
                }
            }
            else {
                //如果是自己打牌或者摸牌，就不再去检测碰他人、杠他人 
                let mo_pai = pai_name;
                //自己摸牌后其实已经有canGangPais, 不用再检查杠了。
                // if (player.canGang(mo_pai)) {
                //   isShowGang = true;
                //   if (!_.isEmpty(canGangPais)) {
                //     canGangPais.push(mo_pai);
                //   }
                //   console.log(`房间${this.id} 玩家${player.username}摸牌后可以杠牌${mo_pai}`);
                // }
                //摸牌后并没有重复计算胡牌，所以可以使用其判断胡牌！
                if (player.canHu(mo_pai)) {
                    isShowHu = true;
                    console.log(`房间${this.id} 玩家${player.username}可以自摸胡${mo_pai}`);
                }
            }
        }
        let canShowSelect = isShowHu || isShowLiang || isShowGang || isShowPeng;
        if (canShowSelect) {
            player.is_thinking = true;
            console.log(`房间${this.id} 玩家${player.username} 可以显示选择对话框，其手牌为:`);
            puts(player.group_shou_pai);
            console.log(`可以隐藏的牌：${canLiangPais}`);
            console.log(`可以杠的牌：${canGangPais}`);
            // console.log(`${item_player.username} isShowHu: %s, isShowLiang: %s, isShowGang: %s, isShowPeng: %s`, isShowHu, isShowLiang, isShowGang, isShowPeng);
            player.socket.sendmsg({
                type: g_events.server_can_select,
                select_opt: [isShowHu, isShowLiang, isShowGang, isShowPeng],
                canLiangPais: canLiangPais,
                canGangPais: canGangPais
            });
        }
        return canShowSelect;
    }
    /**
     * 给房间内的所有玩家广播消息
     * @param event_type 事件类型
     * @param data 事件所携带数据
     */
    broadcast(event_type, data) {
        this.players.forEach(p => {
            p.socket.sendmsg({
                type: event_type,
                data: data
            });
        });
    }
    /**广播服务器打牌的消息给所有玩家 */
    broadcast_server_dapai(player, pai_name) {
        player.socket.sendmsg({
            type: g_events.server_dapai,
            pai_name: pai_name,
            group_shou_pai: player.group_shou_pai
        });
        //告诉其它玩家哪个打牌了, 其它信息用户在加入房间的时候已经发送过了。
        this.other_players(player).forEach(p => {
            p.socket.sendmsg({
                type: g_events.server_dapai_other,
                username: player.username,
                user_id: player.user_id,
                pai_name: pai_name
            });
        });
    }
    get zhuang_jia() {
        //获取东家
        return _.find(this.players, { east: true });
    }
    set_dong_jia(player) {
        //只能有一个东家, 不使用other_players计算麻烦
        this.players.forEach(p => {
            p.east = false;
        });
        player.east = true;
    }
    /**过滤grou_shou_pai,
     * @param ignore_filter 是否忽略此过滤器，用户选择亮牌，就不再需要过滤了。
     */
    filter_group(group_shouPai, ignore_filter = false) {
        if (ignore_filter) {
            return group_shouPai;
        }
        else {
            //需要新建group对象返回，不能改变原有的数据！
            let newGroup = _.clone(group_shouPai);
            newGroup.anGang = [];
            newGroup.anGangCount = group_shouPai.anGang.length;
            newGroup.selfPeng = [];
            newGroup.selfPengCount = group_shouPai.selfPeng.length;
            newGroup.shouPai = [];
            newGroup.shouPaiCount = group_shouPai.shouPai.length;
            return newGroup;
        }
    }
    sendGroupShouPaiOf(p) {
        let leftGroup = this.filter_group(this.left_player(p).group_shou_pai);
        let rightGroup = this.filter_group(this.right_player(p).group_shou_pai);
        p.socket.sendmsg({
            type: g_events.server_game_start,
            god_player: { group_shou_pai: p.group_shou_pai },
            left_player: { group_shou_pai: leftGroup },
            right_player: { group_shou_pai: rightGroup }
        });
    }
    server_game_start() {
        //初始化牌面
        //todo: 转为正式版本 this.clone_pai = _.shuffle(config.all_pai);
        //todo: 仅供测试用的发牌器
        this.cloneTablePais = TablePaiManager_1.TablePaiManager.zhuang_mopai_gang();
        //开始给所有人发牌，并给东家多发一张
        if (!this.zhuang_jia) {
            throw new Error(chalk_1.default.red("房间${id}没有东家，检查代码！"));
        }
        //先把所有玩家的牌准备好！
        this.players.forEach((p, index) => {
            //玩家收到的牌保存好，以便服务器进行分析，每次都需要排序下，便于分析和查看
            p.group_shou_pai.shouPai = this.cloneTablePais.splice(0, 13).sort();
            //发牌完毕就要计算胡了
            p.calculateHu();
        });
        // 再进行相关的消息发送！
        this.players.forEach((p, index) => {
            //有可能游戏一开始就听牌，或者你可以亮出来！这时候是不可能胡的，因为你牌不够，需要别人打一张或者自己摸张牌
            //todo: 如果东家也可以听牌呢？所以每个用户都需要检测一遍！
            this.sendGroupShouPaiOf(p);
            if (p == this.zhuang_jia) {
                //告诉东家，服务器已经开始发牌了，房间还是得负责收发，玩家类只需要保存数据和运算即可。
                //不管东家会不会胡，都是需要发牌的！
                // this.server_fa_pai(p);
            }
            else {
                //测试一下如何显示其它两家的牌，应该在发牌之后，因为这时候牌算是发完了，不然没牌的时候你显示个屁哟。
                //非东家，接收到牌即可
                // this.sendGroupShouPaiOf(p);
                this.decideSelectShow(p);
            }
        });
        //所有人发完13张，再给东家发张牌，从其开始打
        this.server_fa_pai(this.zhuang_jia);
        // this.decideFaPaiSelectShow(this.dong_jia, this.dong_jia.mo_pai)
    }
    //游戏结束后重新开始游戏！
    restart_game() {
        //清空所有玩家的牌
        this.players.forEach(p => {
            p.group_shou_pai = {
                anGang: [],
                mingGang: [],
                peng: [],
                selfPeng: [],
                shouPai: []
            };
            p.ready = false;
            p.arr_dapai = [];
        });
        this.server_game_start();
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map