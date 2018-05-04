var mj;
(function (mj) {
    var model;
    (function (model) {
        class Player {
            constructor() {
                this.shou_pai = [];
                this.used_pai = [];
                /**         是否是庄家         */
                this.east = false;
                /**         玩家的席位！         */
                this.seat_index = null;
                /**玩家的积分 */
                this.score = 0;
            }
            /**
             * 加入参数pai到玩家手牌之中
             */
            set table_pai(pai) {
                this._table_pai = pai;
                this.shou_pai.push(pai);
            }
            get table_pai() {
                return this._table_pai;
            }
            /**
             * 从玩家手牌中删除pai
             * @param pai
             */
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
                this._table_pai = null; //打牌之后说明桌面牌是真的没有了
            }
        }
        model.Player = Player;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Player.js.map