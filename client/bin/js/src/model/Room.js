var mj;
(function (mj) {
    var model;
    (function (model) {
        var Room = /** @class */ (function () {
            function Room() {
                this.players = [];
            }
            Object.defineProperty(Room.prototype, "left_player", {
                /** 左手玩家，在此确定玩家的UI顺序 */
                get: function () {
                    if (!this._leftPlayer) {
                        var index_1 = Laya.god_player.seat_index - 1;
                        index_1 = (index_1 == -1 ? config.LIMIT_IN_ROOM - 1 : index_1);
                        var player = this.players.find(function (p) { return p.seat_index == index_1; });
                        if (player) {
                            player.ui_index = config.UI_LEFT_INDEX;
                        }
                        this._leftPlayer = player;
                    }
                    return this._leftPlayer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Room.prototype, "right_player", {
                /** 右手玩家，在此确定玩家的UI顺序 */
                get: function () {
                    if (!this._rightPlayer) {
                        var index_2 = Laya.god_player.seat_index + 1;
                        index_2 = (index_2 == config.LIMIT_IN_ROOM ? 0 : index_2);
                        var player = this.players.find(function (p) { return p.seat_index == index_2; });
                        if (player) {
                            player.ui_index = config.UI_RIGHT_INDEX;
                        }
                        this._rightPlayer = player;
                    }
                    return this._rightPlayer;
                },
                enumerable: true,
                configurable: true
            });
            /** 除了person外的其它玩家们 */
            Room.prototype.other_players = function (person) {
                return this.players.filter(function (p) { return p.user_id != person.user_id; });
            };
            return Room;
        }());
        model.Room = Room;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Room.js.map