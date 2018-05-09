"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    //连接之后，用户就会有一个socket_id，一个socket其实就是一个连接了
    constructor({ flat_shou_pai = [], socket, username, user_id }) {
        /**用户是否连接？有可能掉线！*/
        this.connect = false;
        /**用户是否已经准备好，全部准备好后就可以开始了*/
        this.ready = false;
        /**用户是否是东家*/
        this.east = false;
        this._received_pai = null;
        this._flat_shou_pai = [];
        /**玩家打牌形成的数组 */
        this.arr_dapai = []; //打过的牌有哪些，断线后可以重新发送此数据
        /** 玩家在房间的座位号，也是加入房间的顺序号 */
        this.seat_index = null; //玩家的座位号，关系到发牌的顺序，以及碰之后顺序的改变需要使用
        /** 什么样的胡，保存这个数据也是为了能够保存到数据库中 */
        this.hupai_types = [];
        /**胡牌张，玩家胡的啥牌，便于分析，尤其象卡五星这种，不能算错喽。
         还得知道是谁打的这张牌，自摸还是他人放炮？还是杠了之后的牌？*/
        this.hupai_zhang = [];
        //临时保存的胡牌张，供用户选择，如果听或者亮，则成为正式的胡牌张
        this.temp_hupai_zhang = [];
        /** 玩家是否亮牌，只在可以听胡的时候才能亮牌*/
        this.is_liang = false;
        /**玩家是否选择听牌，只有大胡的时候才能听牌！*/
        this.is_ting = false;
        //哪个玩家还在想，有人在想就不能打牌！记录好玩家本身的状态就好
        this.is_thinking_tingliang = false;
        /**玩家的积分 */
        this.score = 0;
        this.group_shou_pai = {
            anGang: [],
            mingGang: [],
            peng: [],
            shouPai: []
        };
        this.flat_shou_pai = flat_shou_pai;
        this.socket = socket;
        this.username = username;
        this.user_id = user_id;
    }
    /** 应该只初始化 一次，以后的添加删除通过add, delete来操作 */
    set flat_shou_pai(arr_pai) {
        this._flat_shou_pai = arr_pai;
        this.group_shou_pai.shouPai = [].concat(arr_pai);
    }
    /** 玩家手牌数组 */
    get flat_shou_pai() {
        return this._flat_shou_pai;
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
    /**从手牌中删除一张牌，同时也会删除group_shou_pai中的！ */
    delete_shoupai(pai) {
        let groupShouDeleteOK = this.delete_pai(this.group_shou_pai.shouPai, pai);
        if (!groupShouDeleteOK) {
            throw new Error(`group_shou_pai中找不到${pai}`);
        }
        this.group_shou_pai.shouPai.sort();
        let shouDeleteOK = this.delete_pai(this._flat_shou_pai, pai);
        if (!groupShouDeleteOK) {
            throw new Error(`_flat_shou_pai中找不到${pai}`);
        }
        this._flat_shou_pai.sort(); //删除元素之后排序
        return shouDeleteOK && groupShouDeleteOK;
    }
    /**玩家收到的牌，保存到手牌及group手牌中 */
    set received_pai(pai) {
        this._received_pai = pai;
        this._flat_shou_pai.push(pai);
        this.group_shou_pai.shouPai.push(pai);
    }
    get received_pai() {
        return this._received_pai;
    }
    /**         从玩家手牌中删除pai         */
    da_pai(pai) {
        if (this.delete_shoupai(pai)) {
            this.arr_dapai.push(pai);
        }
        else {
            throw new Error(`${this.username}打了张非法牌？${pai}`);
        }
        this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
    }
    confirm_peng(pai) {
        //首先从手牌中删除三张牌，变成peng: pai
        for (var i = 0; i < 3; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.peng.push(pai);
    }
    confirm_mingGang(pai) {
        //首先从手牌中删除三张牌，变成peng: pai
        for (var i = 0; i < 4; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.mingGang.push(pai);
    }
    confirm_anGang(pai) {
        //首先从手牌中删除三张牌，变成peng: pai
        for (var i = 0; i < 4; i++) {
            this.delete_pai(this.group_shou_pai.shouPai, pai);
        }
        this.group_shou_pai.anGang.push(pai);
    }
}
exports.Player = Player;
// var p = new Player({
//   shou_pai:"zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa".split(" "),
//   socket:456,
//   user_id: 1,
//   username: ''}
// );
// p.receive_pai("b1");
// p.receive_pai("b2");
// p.receive_pai("c1");
// p.receive_pai("c2");
// p.receive_pai("fa");
// p.receive_pai("fa");
// console.dir(p);
//# sourceMappingURL=player.js.map