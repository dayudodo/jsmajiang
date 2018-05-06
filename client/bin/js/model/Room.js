var mj;
(function (mj) {
    var model;
    (function (model) {
        var Room = /** @class */ (function () {
            function Room() {
                this.players = [];
            }
            /** 左手玩家，在此确定玩家的UI顺序 */
            Room.prototype.left_player = function (person) {
                var index = person.seat_index - 1;
                index = (index == -1 ? config.LIMIT_IN_ROOM - 1 : index);
                var player = this.players.find(function (p) { return p.seat_index == index; });
                if (player) {
                    player.ui_index = config.UI_LEFT_INDEX;
                }
                return player;
            };
            /** 右手玩家，在此确定玩家的UI顺序 */
            Room.prototype.right_player = function (person) {
                var index = person.seat_index + 1;
                index = (index == config.LIMIT_IN_ROOM ? 0 : index);
                var player = this.players.find(function (p) { return p.seat_index == index; });
                if (player) {
                    player.ui_index = config.UI_RIGHT_INDEX;
                }
                return player;
            };
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