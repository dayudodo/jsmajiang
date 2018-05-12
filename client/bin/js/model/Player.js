var mj;
(function (mj) {
    var model;
    (function (model) {
        var Player = /** @class */ (function () {
            function Player() {
                this._flat_shou_pai = [];
                this.group_shou_pai = {
                    anGang: [],
                    mingGang: [],
                    peng: [],
                    shouPai: []
                };
                this.arr_dapai = [];
                /**         是否是庄家         */
                this.east = false;
                /**         玩家的席位！         */
                this.seat_index = null;
                /**玩家的积分 */
                this.score = 0;
                /** 在界面中的序号，左玩家是0，右玩家是2, 上玩家是1，自己是3 */
                this.ui_index = null;
                /** 手牌从哪个位置开始 */
                this.shouPai_start_index = 0;
            }
            Object.defineProperty(Player.prototype, "flat_shou_pai", {
                /** 玩家手牌数组 */
                get: function () {
                    return this._flat_shou_pai;
                },
                /** 应该只初始化 一次，以后的添加删除通过add, delete来操作 */
                set: function (arr_pai) {
                    this._flat_shou_pai = arr_pai;
                    this.group_shou_pai.shouPai = [].concat(arr_pai);
                },
                enumerable: true,
                configurable: true
            });
            /** 手牌中增加一张牌 */
            Player.prototype.add_shoupai = function (pai) {
                this._flat_shou_pai.push(pai);
                this.group_shou_pai.shouPai.push(pai);
            };
            /** 从牌数组中删除一张牌 */
            Player.prototype.delete_pai = function (arr, pai) {
                var firstIndex = arr.indexOf(pai);
                if (firstIndex > -1) {
                    arr.splice(firstIndex, 1);
                    return true;
                }
                else {
                    return false;
                }
            };
            /**从手牌中删除一张牌，同时也会删除group_shou_pai中的！ */
            Player.prototype.delete_shoupai = function (pai) {
                var shouResult = this.delete_pai(this._flat_shou_pai, pai);
                this._flat_shou_pai.sort(); //删除元素之后排序
                var groupShouResult = this.delete_pai(this.group_shou_pai.shouPai, pai);
                this.group_shou_pai.shouPai.sort();
                return shouResult && groupShouResult;
            };
            Object.defineProperty(Player.prototype, "received_pai", {
                get: function () {
                    return this._received_pai;
                },
                /**玩家收到的牌，有三种途径：服务器发的牌，碰、杠到的牌 */
                set: function (pai) {
                    this._received_pai = pai;
                    this.add_shoupai(pai);
                },
                enumerable: true,
                configurable: true
            });
            /**         从玩家手牌中删除pai         */
            Player.prototype.da_pai = function (pai) {
                if (this.delete_shoupai(pai)) {
                    this.arr_dapai.push(pai);
                }
                else {
                    throw new Error(this.username + "\u5C45\u7136\u6253\u4E86\u5F20\u4E0D\u5B58\u5728\u7684\u724C\uFF1F" + pai);
                }
                this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
            };
            Player.prototype.confirm_peng = function (pai) {
                //首先从手牌中删除三张牌，变成peng: pai
                for (var i = 0; i < 3; i++) {
                    this.delete_pai(this.group_shou_pai.shouPai, pai);
                }
                this.group_shou_pai.peng.push(pai);
            };
            Player.prototype.confirm_mingGang = function (pai) {
                //首先从手牌中删除三张牌，变成peng: pai
                for (var i = 0; i < 4; i++) {
                    this.delete_pai(this.group_shou_pai.shouPai, pai);
                }
                this.group_shou_pai.mingGang.push(pai);
            };
            Player.prototype.confirm_anGang = function (pai) {
                //首先从手牌中删除三张牌，变成peng: pai
                for (var i = 0; i < 4; i++) {
                    this.delete_pai(this.group_shou_pai.shouPai, pai);
                }
                this.group_shou_pai.anGang.push(pai);
            };
            Object.defineProperty(Player.prototype, "last_out_coordinate", {
                /** 最后一张打出的牌在out中的坐标，out结构为2行*12列 */
                get: function () {
                    var line = 0, row = 0;
                    var len = this.arr_dapai.length;
                    if (len >= config.OutLineBreakCount) {
                        line = 1;
                        row = len - config.OutLineBreakCount;
                    }
                    else {
                        line = 0;
                        row = (len == 0 ? 0 : len - 1);
                    }
                    return [line, row];
                },
                enumerable: true,
                configurable: true
            });
            return Player;
        }());
        model.Player = Player;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Player.js.map