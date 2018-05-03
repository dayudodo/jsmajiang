var mj;
(function (mj) {
    var model;
    (function (model) {
        class Player {
            constructor() {
                this.shou_pai = [];
                this.used_pai = [];
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
             * 删除玩家手牌index处的牌
             * @param index
             */
            da_pai(index) {
                let firstIndex = this.shou_pai.indexOf(this.shou_pai[index]);
                if (firstIndex > -1) {
                    this.shou_pai.splice(firstIndex, 1);
                    this.shou_pai.sort(); //删除元素之后排序
                    this.used_pai.push(this.shou_pai[index]);
                }
                else {
                    throw new Error(`我居然打了张不存在的牌？index: ${index}`);
                }
                this._table_pai = null; //打牌之后说明桌面牌是真的没有了
            }
        }
        model.Player = Player;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Player.js.map