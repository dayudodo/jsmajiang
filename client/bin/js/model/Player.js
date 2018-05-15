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
            Player.prototype.cloneValuesFrom = function (p2) {
                var _this = this;
                Player.filter_properties.forEach(function (prop) {
                    _this[prop] = p2[prop];
                });
            };
            Object.defineProperty(Player.prototype, "flat_shou_pai", {
                /** 应该只初始化 一次，以后的添加删除通过add, delete来操作 */
                get: function () {
                    var real_shoupai = [];
                    this.group_shou_pai.anGang.forEach(function (pai) {
                        for (var i = 0; i < 4; i++) {
                            real_shoupai.push(pai);
                        }
                    });
                    this.group_shou_pai.mingGang.forEach(function (pai) {
                        for (var i = 0; i < 4; i++) {
                            real_shoupai.push(pai);
                        }
                    });
                    this.group_shou_pai.peng.forEach(function (pai) {
                        for (var i = 0; i < 3; i++) {
                            real_shoupai.push(pai);
                        }
                    });
                    real_shoupai = real_shoupai.concat(this.group_shou_pai.shouPai);
                    return real_shoupai.sort();
                },
                enumerable: true,
                configurable: true
            });
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
            Object.defineProperty(Player.prototype, "received_pai", {
                get: function () {
                    return this._received_pai;
                },
                /**玩家收到的牌，保存到手牌及group手牌中 */
                set: function (pai) {
                    this._received_pai = pai;
                    this.group_shou_pai.shouPai.push(pai);
                },
                enumerable: true,
                configurable: true
            });
            /**  从玩家手牌中删除pai并计算胡牌*/
            Player.prototype.da_pai = function (pai) {
                if (this.delete_pai(this.group_shou_pai.shouPai, pai)) {
                    this.arr_dapai.push(pai);
                }
                else {
                    throw new Error(this.username + "\u6253\u4E86\u5F20\u975E\u6CD5\u724C\uFF1F" + pai);
                }
                this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
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
            Player.filter_properties = [
                "username",
                "user_id",
                "seat_index",
                "group_shou_pai",
                "arr_dapai",
                "is_liang",
                "is_ting"
            ];
            return Player;
        }());
        model.Player = Player;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Player.js.map