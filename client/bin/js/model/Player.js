var mj;
(function (mj) {
    var model;
    (function (model) {
        var Player = /** @class */ (function () {
            function Player() {
                this.shou_pai = [];
                this.used_pai = [];
                /**         是否是庄家         */
                this.east = false;
                /**         玩家的席位！         */
                this.seat_index = null;
                /**玩家的积分 */
                this.score = 0;
                /** 在界面中的序号，左玩家是0，右玩家是2, 上玩家是1，自己是3 */
                this.ui_index = null;
            }
            Object.defineProperty(Player.prototype, "table_pai", {
                get: function () {
                    return this._table_pai;
                },
                /**         加入参数pai到玩家手牌之中         */
                set: function (pai) {
                    this._table_pai = pai;
                    this.shou_pai.push(pai);
                },
                enumerable: true,
                configurable: true
            });
            /**         从玩家手牌中删除pai         */
            Player.prototype.da_pai = function (pai) {
                var firstIndex = this.shou_pai.indexOf(pai);
                if (firstIndex > -1) {
                    this.shou_pai.splice(firstIndex, 1);
                    this.shou_pai.sort(); //删除元素之后排序
                    this.used_pai.push(pai);
                }
                else {
                    throw new Error(this.username + "\u5C45\u7136\u6253\u4E86\u5F20\u4E0D\u5B58\u5728\u7684\u724C\uFF1F" + pai);
                }
                this._table_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
            };
            return Player;
        }());
        model.Player = Player;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Player.js.map