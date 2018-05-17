"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._received_pai = null;
        /**玩家打牌形成的数组 */
        this.arr_dapai = []; //打过的牌有哪些，断线后可以重新发送此数据
        /** 玩家是否亮牌，只在可以听胡的时候才能亮牌*/
        this.is_liang = false;
        /**玩家是否选择听牌，只有大胡的时候才能听牌！*/
        this.is_ting = false;
        //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
        this.is_thinking_tingliang = false;
        /**玩家放碰、杠的记录，但于结算！user_id牌放给谁了，如果杠的玩家是自己，那么就得其它两家出钱了 */
        this.fang = {
            gang: [{ pai: "", user_id: "" }],
            peng: [{ pai: "", user_id: "" }]
        };
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
        this.group_shou_pai = group_shou_pai;
        this.socket = socket;
        this.username = username;
        this.user_id = user_id;
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
    /**玩家收到的牌，保存到手牌及group手牌中 */
    set received_pai(pai) {
        this._received_pai = pai;
        this.group_shou_pai.shouPai.push(pai);
        this.group_shou_pai.shouPai.sort();
    }
    get received_pai() {
        return this._received_pai;
    }
    /**能否听牌 */
    canTing() {
        return this.hupai_data.all_hupai_zhang.length > 0;
    }
    // /**能亮否？ */
    // canLiang(): boolean {
    //   return MajiangAlgo.isDaHu(this.hupai_data.all_hupai_typesCode)
    // }
    /**能碰吗？只能是手牌中的才能检测碰 */
    canPeng(pai) {
        return MajiangAlgo_1.MajiangAlgo.canPeng(this.group_shou_pai.shouPai, pai);
    }
    /**能杠吗？分碰了之后杠还是本来就有三张牌！最简单的自然是使用flat_shou_pai */
    canGang(pai) {
        return MajiangAlgo_1.MajiangAlgo.canGang(this.flat_shou_pai, pai);
    }
    confirm_peng(pai) {
        this.group_shou_pai.peng.push(pai);
        //首先从手牌中删除二张牌
        for (let i = 0; i < 2; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.shouPai.sort();
    }
    //确定杠肯定就是明杠！暗杠不需要检测，是由玩家来选择的！
    confirm_mingGang(pai) {
        this.group_shou_pai.mingGang.push(pai);
        //如果是碰了之后杠，需要删除这张碰牌
        if (this.group_shou_pai.peng.includes(pai)) {
            this.group_shou_pai.peng.remove(pai);
            //如果是手牌里面杠的，删除这三张牌！
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.delete_pai(this.group_shou_pai.shouPai, pai);
            }
            this.group_shou_pai.shouPai.sort();
        }
    }
    confirm_anGang(pai) {
        //首先从手牌中删除三张牌，变成peng: pai
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.anGang.push(pai);
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
        this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
        this.calculateHu();
    }
    /**计算各种胡牌的状态 */
    calculateHu() {
        let shoupai_changed = true;
        if (shoupai_changed) {
            this.hupai_data = MajiangAlgo_1.MajiangAlgo.HuWhatPai(this.flat_shou_pai);
        }
    }
}
/**可以返回到客户端的玩家属性值 */
Player.filter_properties = [
    "username",
    "user_id",
    "seat_index",
    "group_shou_pai",
    "arr_dapai",
    "is_liang",
    "is_ting"
];
exports.Player = Player;
//# sourceMappingURL=player.js.map