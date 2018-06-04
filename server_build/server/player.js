"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
//每一个玩家的数据保存在此类中
const config = require("./config");
const MajiangAlgo_1 = require("./MajiangAlgo");
class Player {
    //新建，用户就会有一个socket_id，一个socket其实就是一个连接了
    constructor({ group_shou_pai, socket, username, user_id }) {
        /**用户是否连接？有可能掉线！*/
        this.connect = false;
        /**用户是否已经准备好，全部准备好后就可以开始了*/
        this.ready = false;
        /**用户是否是东家*/
        this.east = false;
        /** 玩家在房间的座位号，也是加入房间的顺序号 */
        this.seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用
        this._mo_pai = null;
        /**玩家打牌形成的数组 */
        this.arr_dapai = []; //打过的牌有哪些，断线后可以重新发送此数据
        /** 玩家是否亮牌，只在可以听胡的时候才能亮牌*/
        this.is_liang = false;
        /**是否是自摸，其实不能算是一种胡牌，而是一种状态，杠上胡也可以算！加番的一种方式。 */
        this.is_zimo = false;
        //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
        this.is_thinking = false;
        /**todo: 是否是胡玩家，确保只有一个 */
        this.is_hu = false;
        /**玩家放杠、放炮的记录，但于结算！user_id牌放给谁了，如果杠的玩家是自己，那么就得其它两家出钱了 */
        this.fangpai_data = [
        // {type: config.FangGang, pai:''},
        // {type: config.FangGangShangGang, pai:''},
        // {type: config.FangPihuPao, pai:''},
        // {type: config.FangDaHuPao, pai:''}
        ];
        /**收到哪个的碰、杠，user_id：哪个玩家放的牌 */
        this.shou = {
            gang: [{ pai: "", user_id: "" }],
            peng: [{ pai: "", user_id: "" }]
        };
        /**玩家的积分 */
        this.score = 0;
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
        /**能打牌了 */
        this.can_dapai = false;
        this.group_shou_pai = group_shou_pai;
        this.socket = socket;
        this.username = username;
        this.user_id = user_id;
    }
    /**是否放炮 */
    get is_fangpao() {
        return this.fangpai_data.some(item => item.type == config.FangDaHuPao || item.type == config.FangPihuPao);
    }
    /**返回group手牌中出现3次的牌！ */
    PaiArr3A() {
        let result = _.countBy(this.group_shou_pai.shouPai);
        let output = [];
        for (const key in result) {
            if (result[key] == 3) {
                output.push(key);
            }
        }
        return output;
    }
    /**是否是暗四归，在group手牌中存在3张相同的牌 */
    isAnSiGui(pai_name) {
        let countPai = this.group_shou_pai.shouPai.filter(pai => pai == pai_name);
        return countPai.length === 3;
    }
    /**能否胡pai_name */
    canHu(pai_name) {
        if (this.hupai_data.all_hupai_zhang.includes(pai_name)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**是否是大胡 */
    isDaHu(pai_name) {
        return MajiangAlgo_1.MajiangAlgo.isDaHu(this.hupai_data.hupai_dict[pai_name]);
    }
    /** 玩家手牌数组，从group_shou_pai中生成 */
    get flat_shou_pai() {
        return MajiangAlgo_1.MajiangAlgo.flat_shou_pai(this.group_shou_pai);
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
    /**玩家摸的牌，其实也就是服务器发的牌，保存到自己的group手牌中 */
    set mo_pai(pai) {
        this._mo_pai = pai;
        this.group_shou_pai.shouPai.push(pai);
        this.group_shou_pai.shouPai.sort();
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
        return MajiangAlgo_1.MajiangAlgo.canPeng(this.group_shou_pai.shouPai, pai, this.is_liang);
    }
    /**能杠吗？分碰了之后杠还是本来就有三张牌！最简单的自然是使用flat_shou_pai */
    canGang(pai) {
        //能否杠还能分你是自摸碰还是求人碰，selfPeng是可以随便杠的，但是求人碰则得自己摸牌才能杠！
        return MajiangAlgo_1.MajiangAlgo.canGang(this.group_shou_pai, pai, this.is_liang, this.mo_pai);
    }
    confirm_peng(pai) {
        this.group_shou_pai.peng.push(pai);
        //从手牌中删除三张牌，因为把别人的牌当成是mo_pai加入了手牌！
        //这样的话其它玩家liang, guo之后就知道碰玩家是摸牌的人了！
        for (let i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.shouPai.sort();
    }
    /**杠别人的牌是明杠 */
    confirm_mingGang(pai) {
        this.group_shou_pai.mingGang.push(pai);
        //需要删除杠之前的3张牌，可能存在于peng, selfPeng, shoupai之中！
        //如果是碰了之后杠，需要删除这张碰牌
        this.group_shou_pai.peng.remove(pai);
        //包括亮牌中的selfPeng
        this.group_shou_pai.selfPeng.remove(pai);
        //当自己摸牌杠的时候，其实是需要删除4次的！好在delete_pai找不到的时候并不会出错！
        //不过自己摸牌其实是属于暗杠的范围了
        for (var i = 0; i < 4; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.shouPai.sort();
    }
    /**自己摸的牌就是暗杠了*/
    confirm_anGang(pai) {
        //首先从手牌中删除四！张牌，
        // 因为自己摸牌后会添加到手牌之中，这样就会有4张牌
        for (var i = 0; i < 4; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.anGang.push(pai);
        this.group_shou_pai.shouPai.sort();
    }
    /**确定自碰牌，将pai从shouPai中移动到selfPeng之中！ */
    confirm_selfPeng(pai) {
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.selfPeng.push(pai);
        this.group_shou_pai.shouPai.sort();
    }
    /**  从玩家手牌中删除pai并计算胡牌*/
    da_pai(pai) {
        if (this.delete_pai(this.group_shou_pai.shouPai, pai)) {
            this.arr_dapai.push(pai);
        }
        else {
            throw new Error(`${this.username}打了张非法牌？${pai}`);
        }
        this.group_shou_pai.shouPai.sort();
        this._mo_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
        // this.gang_mopai = false; //打牌之后就不再是杠摸牌了。
        this.calculateHu();
    }
    /**计算各种胡牌的状态 */
    calculateHu() {
        let shoupai_changed = true;
        if (shoupai_changed) {
            this.hupai_data = MajiangAlgo_1.MajiangAlgo.HuWhatGroupPai(this.group_shou_pai);
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
    "is_liang",
    "is_hu",
    "is_fangpao"
];
exports.Player = Player;
//# sourceMappingURL=player.js.map