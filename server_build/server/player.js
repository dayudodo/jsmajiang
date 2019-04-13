"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const NMajiangAlgo_1 = require("./NMajiangAlgo");
//每一个玩家的数据保存在此类中
const config = require("./config");
class Player {
    //新建，用户就会有一个socket_id，一个socket其实就是一个连接了
    constructor({ group_shou_pai, socket, username, user_id }) {
        /**用户是否连接？有可能掉线！*/
        this.connect = false;
        /**IP地址 */
        this.ip = null;
        /**用户是否已经准备好，全部准备好后就可以开始了*/
        this.ready = false;
        /**是否是房主 */
        this.master = false;
        /**用户是否是东家*/
        this.east = false;
        /** 玩家在房间的座位号，也是加入房间的顺序号 */
        this.seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用
        this._mo_pai = null;
        /**玩家打牌形成的数组 */
        this.arr_dapai = []; //打过的牌有哪些，断线后可以重新发送此数据
        /** 玩家是否亮牌，只在可以听胡的时候才能亮牌, 注意，胡里面也包括有亮的信息*/
        this.is_liang = false;
        /**是否是自摸，其实不能算是一种胡牌，而是一种状态，杠上胡也可以算！加番的一种方式。 */
        this.is_zimo = false;
        //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
        this.is_thinking = false;
        /**todo: 是否是胡玩家，确保只有一个 */
        this.is_hu = false;
        /**是否放炮 */
        this.is_fangpao = false;
        /**玩家放杠、放炮的记录，但于结算！user_id牌放给谁了，如果杠的玩家是自己，那么就得其它两家出钱了 */
        this.gang_lose_data = [
        // {type: config.FangGang, pai:''},
        // {type: config.FangGangShangGang, pai:''},
        // {type: config.FangPihuPao, pai:''},
        // {type: config.FangDaHuPao, pai:''}
        ];
        /**玩家的积分 */
        this.score = 0;
        /**一局得分 */
        this.oneju_score = 0;
        /**暗杠数量 */
        this.count_anGang = 0;
        /**明杠数量 */
        this.count_mingGang = 0;
        /**自摸数量 */
        this.count_zimo = 0;
        /**放炮数量，8局为一次？需要合在一起进行计算，但是每一次的计算放哪儿呢？ */
        this.count_fangPao = 0;
        /**最后胡的是哪张牌 */
        this.hupai_zhang = null;
        // /**玩家现在的状态，控制了玩家可以进行的操作，比如在能打牌的时候才能打 */
        // public can_status: playerStatus;
        /**摸扛之后是否打牌 */
        this.after_mo_gang_dapai = false;
        /**客户端能打牌的控制变量 */
        this.can_dapai = false;
        /**临时的赢代码，比如杠 */
        this.gang_win_codes = [];
        this.group_shou_pai = group_shou_pai;
        this.socket = socket;
        this.username = username;
        this.user_id = user_id;
    }
    //除了我以外的其它玩家
    other_players() {
        // console.log("查找本玩家%s的其它玩家", person.username);
        return this.room.players.filter(p => p.user_id != this.user_id);
    }
    /**保存杠上杠，并通知放杠家伙! */
    saveGangShangGang(fangGangPlayer, pai_name) {
        this.gang_win_codes.push(config.HuisGangShangGang);
        fangGangPlayer.gang_lose_data.push({
            type: config.LoseGangShangGang,
            pai: pai_name
        });
    }
    /**保存普通杠消息，并通知放杠者 */
    saveGang(fangGangPlayer, pai_name) {
        this.gang_win_codes.push(config.HuisGang);
        fangGangPlayer.gang_lose_data.push({
            type: config.LoseGang,
            pai: pai_name
        });
    }
    /**保存擦炮的消息，并通知其它的玩家你得掏钱了! */
    saveCaPao(other_players, pai_name) {
        this.gang_win_codes.push(config.HuisCaPao);
        other_players.forEach(person => {
            person.gang_lose_data.push({
                type: config.LoseCaPao,
                pai: pai_name
            });
        });
    }
    /**保存暗杠的消息，改变其它两个玩家的扣分! */
    saveAnGang(other_players, pai_name) {
        this.gang_win_codes.push(config.HuisAnGang);
        other_players.forEach(person => {
            person.gang_lose_data.push({
                type: config.LoseAnGang,
                pai: pai_name
            });
        });
    }
    /**到底要出哪些杠钱的名称！包括屁胡炮，大胡炮 */
    get lose_names() {
        return NMajiangAlgo_1.NMajiangAlgo.LoseNamesFrom(this.gang_lose_data);
    }
    /**出杠钱的数字代码 */
    get gang_lose_codes() {
        return this.gang_lose_data.map(d => d.type);
    }
    /**赢了哪些杠 */
    get gang_win_names() {
        return NMajiangAlgo_1.NMajiangAlgo.GangNamesFrom(this.gang_win_codes, true);
    }
    /**放了哪些杠 */
    get gang_lose_names() {
        return NMajiangAlgo_1.NMajiangAlgo.GangNamesFrom(this.gang_lose_codes, false);
    }
    /**胡了哪些项目 */
    get all_win_names() {
        return NMajiangAlgo_1.NMajiangAlgo.HuPaiNamesFrom(this.all_win_codes);
    }
    /**返回所有赢代码，如果没胡，只返回杠的 */
    get all_win_codes() {
        if (this.is_hu) {
            //todo: 胡之后，如何得到所有的胜类型代码？
            return this.hupai_typesCode().concat(this.gang_win_codes);
        }
        else {
            return this.gang_win_codes;
        }
    }
    /**当前玩家的胡牌类型码，可以在最后胡牌的时候进行修改 */
    hupai_typesCode() {
        if (this.is_hu) {
            return this.hupai_data.hupai_dict[this.hupai_zhang];
        }
        else {
            return null;
        }
    }
    /**玩家胜负结果信息 */
    get result_info() {
        //todo: 返回玩家的胜负两种消息！即使没胡，还是可能会有收入的！
        //或者只显示你赢了多少钱，哪怕是个单杠！
        // if (this.is_hu) {
        //   return this.all_win_names.join(" ");
        // } else {
        //   return this.lose_names.join(" ");
        // }
        return {
            win_info: this.all_win_names.join(" "),
            lose_info: this.lose_names.join(" ")
        };
    }
    /**返回result可用的手牌，把anGang移动到mingGang中，selfPeng移动到peng里面 */
    //胜负最后需要显示的shou_pai, 所有的牌都需要显示出来！
    get result_shou_pai() {
        let result = _.cloneDeep(this.group_shou_pai);
        if (result.anGang.length > 0) {
            result.anGang.forEach(pai => {
                result.mingGang.push(pai);
            });
            result.anGang = [];
        }
        if (result.selfPeng.length > 0) {
            result.selfPeng.forEach(pai => {
                result.peng.push(pai);
            });
            result.selfPeng = [];
        }
        return result;
    }
    // /**是否放炮 */
    // get is_fangpao(): boolean {
    //   // return this.gang_lose_data.some(item => item.type == config.LoseDaHuPao || item.type == config.LosePihuPao);
    //   return true;
    // }
    /**能够杠的牌，包括peng, selfPeng里面可以自扛以及暗杠的牌 */
    canGangPais() {
        let output = [];
        output = output.concat(this.group_shou_pai.peng.filter(pai => this.group_shou_pai.shouPai.includes(pai)));
        output = output.concat(this.group_shou_pai.selfPeng.filter(pai => this.group_shou_pai.shouPai.includes(pai)));
        output = output.concat(NMajiangAlgo_1.NMajiangAlgo.count4A(this.group_shou_pai.shouPai));
        return output;
    }
    /**返回group手牌中出现3次的牌！ */
    PaiArr3A() {
        return NMajiangAlgo_1.NMajiangAlgo.count3A(this.group_shou_pai.shouPai);
    }
    /**摸牌后四张，用于判断暗四归，暗杠，在group手牌中存在3张相同的牌，因为mo_pai后会添加到shouPai中，
     * 所以需要检查数量是否为4
     */
    isMoHouSi(pai_name) {
        let countPai = this.group_shou_pai.shouPai.filter(pai => pai == pai_name);
        return (countPai.length === 4 || this.group_shou_pai.selfPeng.includes(pai_name));
    }
    /**能否胡pai_name */
    canHu(pai_name) {
        if (this.hupai_data.all_hupai_zhang.includes(pai_name)) {
            return true;
        }
        else {
            return false;
        }
        // return true
    }
    /**是否是大胡 */
    isDaHu(pai_name) {
        return NMajiangAlgo_1.NMajiangAlgo.isDaHu(this.hupai_data.hupai_dict[pai_name]);
    }
    /** 玩家手牌数组，从group_shou_pai中生成 */
    get flat_shou_pai() {
        return NMajiangAlgo_1.NMajiangAlgo.flat_shou_pai(this.group_shou_pai);
        // return []
    }
    /** 从牌数组中删除一张牌 */
    delete_pai(arr, pai) {
        let firstIndex = arr.indexOf(pai);
        if (firstIndex > -1) {
            arr.splice(firstIndex, 1);
            return true;
        }
        else {
            return false;
        }
    }
    /**玩家摸的牌，其实也就是服务器发的牌，保存到自己的group手牌中
     * 一旦打出，才会清空
     */
    set mo_pai(pai) {
        if (this._mo_pai) {
            //设置的时候一定要保证其是个空
            throw new Error(`已经摸过牌:${this._mo_pai}，需要先打一张`);
        }
        this._mo_pai = pai;
        this.after_mo_gang_dapai = false;
        //扛或者碰之后就会清除_mo_pai,由他们来添加这张摸牌
        // this.group_shou_pai.shouPai.push(pai);
        // this.group_shou_pai.shouPai.sort();
    }
    get mo_pai() {
        return this._mo_pai;
    }
    // /**能否听牌，玩家没亮的时候，屁胡不能听牌！其它情况下是可以的！ */
    // canTing(): boolean {
    //   return this.hupai_data.all_hupai_zhang.length > 0;
    // }
    /**能亮否？能胡就能亮？ */
    canLiang() {
        // return MajiangAlgo.isDaHu(this.hupai_data.all_hupai_typesCode)
        return this.hupai_data.all_hupai_zhang.length > 0;
    }
    /**能碰吗？只能是手牌中的才能检测碰，已经碰的牌就不需要再去检测碰了 */
    canPeng(pai) {
        return NMajiangAlgo_1.NMajiangAlgo.canPeng(this.group_shou_pai.shouPai, pai, this.is_liang);
        // return true
    }
    /**能杠吗？分碰了之后杠还是本来就有三张牌，亮牌后只有selfPeng可以扛！ */
    canGang(pai) {
        let selfMo = this.mo_pai != null;
        //能否杠还能分你是自摸碰还是求人碰，selfPeng是可以随便杠的，但是求人碰则得自己摸牌才能杠！
        return NMajiangAlgo_1.NMajiangAlgo.canGang(this.group_shou_pai, pai, this.is_liang, selfMo);
        // return true
    }
    confirm_peng(pai) {
        this._mo_pai = null;
        this.group_shou_pai.peng.push(pai);
        //从手牌中删除二张牌，因为把别人的牌当成是mo_pai加入了手牌！
        //这样的话其它玩家liang, guo之后就知道碰玩家是摸牌的人了！
        for (let i = 0; i < 2; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        //删除掉重新排序
        this.group_shou_pai.shouPai = _.orderBy(this.group_shou_pai.shouPai);
    }
    /**杠别人的牌是明杠 */
    confirm_mingGang(pai) {
        this._mo_pai = null;
        this.after_mo_gang_dapai = false;
        this.group_shou_pai.mingGang.push(pai);
        //需要删除杠之前的3张牌，可能存在于peng, selfPeng, shoupai之中！
        //如果是碰了之后杠，需要删除这张碰牌
        this.group_shou_pai.peng.remove(pai);
        //包括亮牌中的selfPeng，因为peng, selfPeng里面只可能有一个，所以都删除不会出错！
        this.group_shou_pai.selfPeng.remove(pai);
        //当自己摸牌杠的时候，其实是需要删除4次的！好在delete_pai找不到的时候并不会出错！
        //不过自己摸牌其实是属于暗杠的范围了
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.shouPai = _.orderBy(this.group_shou_pai.shouPai);
        //杠之后需要重新算下胡牌！
        this.calculateHu();
    }
    /**自己摸的牌就是暗杠了*/
    confirm_anGang(pai) {
        this._mo_pai = null;
        this.after_mo_gang_dapai = false;
        //首先从手牌中删除四！张牌，
        // 因为自己摸牌后会添加到手牌之中，这样就会有4张牌
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.anGang.push(pai);
        this.group_shou_pai.shouPai = _.orderBy(this.group_shou_pai.shouPai);
        //杠之后需要重新算下胡牌！
        this.calculateHu();
    }
    /**亮牌时需要确定自碰牌，将三张pai从shouPai中移动到selfPeng之中！这样还有机会杠，并且不会展示 */
    confirm_selfPeng(pai) {
        this._mo_pai = null;
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.selfPeng.push(pai);
        this.group_shou_pai.shouPai = _.orderBy(this.group_shou_pai.shouPai);
    }
    /**  从玩家手牌中删除pai并计算胡牌*/
    da_pai(pai_name) {
        if (this.delete_pai(this.group_shou_pai.shouPai, pai_name)) {
            this.arr_dapai.push(pai_name);
        }
        else {
            throw new Error(`${this.username}打了张非法牌？${pai_name}`);
        }
        //如果打的牌与摸牌相同，不用重复计算，就算是以前手牌里面有，其实也相当于是打了张摸牌
        let shouPaiChanged = pai_name != this.mo_pai;
        if (shouPaiChanged) {
            //手牌变化也说明这张牌有用，需要看mo_pai是否为空
            //不为空就需要把这张摸牌添加到shouPai中！如果已经碰了或者扛了，那么就不需要再次添加！
            //为空可能是碰的或者扛的别人牌，并非是摸牌
            if (this._mo_pai != null) {
                this.group_shou_pai.shouPai.push(this._mo_pai);
            }
            this.group_shou_pai.shouPai = _.orderBy(this.group_shou_pai.shouPai);
            this.calculateHu();
        }
        this._mo_pai = null; //打牌之后玩家处于非摸牌状态
        this.after_mo_gang_dapai = true;
    }
    /**计算各种胡牌的状态 */
    calculateHu() {
        //只要手牌改变，其实都是需要重新计算胡牌！
        //todo: 如果已经亮牌，则不再继续计算胡牌，但是要确认你首先打了一张牌之后再选择亮
        // if(this.is_liang){
        //   return
        // }
        let shoupai_changed = true;
        if (shoupai_changed) {
            this.hupai_data = NMajiangAlgo_1.NMajiangAlgo.HuWhatGroupPai(this.group_shou_pai, this.is_liang);
        }
    }
}
/**可以返回到客户端的玩家属性数组 */
Player.filter_properties = [
    "username",
    "user_id",
    "seat_index",
    "group_shou_pai",
    "arr_dapai",
    "is_liang"
];
/**胜负属性组 */
Player.result_properties = [
    "user_id",
    "username",
    "seat_index",
    "result_shou_pai",
    "result_info",
    "is_hu",
    "hupai_zhang",
    "is_fangpao",
    "oneju_score"
];
exports.Player = Player;
//# sourceMappingURL=player.js.map