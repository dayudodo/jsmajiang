"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    //连接之后，用户就会有一个socket_id，一个socket其实就是一个连接了
    constructor({ shou_pai = [], socket, username, user_id }) {
        /**用户是否连接？有可能掉线！*/
        this.connect = false;
        /**用户是否已经准备好，全部准备好后就可以开始了*/
        this.ready = false;
        /**用户是否是东家*/
        this.east = false;
        this._table_pai = null; //用户还没有选择打的时候，服务器发给的牌
        this.used_pai = []; //打过的牌有哪些，断线后可以重新发送此数据
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
        this.shou_pai = shou_pai;
        this.socket = socket;
        this.username = username;
        this.user_id = user_id;
    }
    /**  加入参数pai到玩家手牌之中  */
    set table_pai(pai) {
        this._table_pai = pai;
        this.shou_pai.push(pai);
    }
    get table_pai() {
        return this._table_pai;
    }
    /** 删除玩家手牌index处的牌 */
    da_pai(pai) {
        let firstIndex = this.shou_pai.indexOf(pai);
        if (firstIndex > -1) {
            this.shou_pai.splice(firstIndex, 1);
            this.shou_pai.sort(); //删除元素之后排序
            this.used_pai.push(pai);
        }
        else {
            throw new Error(`${this.username}居然打了张不存在的牌？${pai}`);
        }
        this._table_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
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