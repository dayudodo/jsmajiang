var mj;
(function (mj) {
    var model;
    (function (model) {
        class Room {
            constructor() {
                this.players = [];
            }
            left_player(person) {
                let index = person.seat_index - 1;
                index = index == -1 ? config.LIMIT_IN_ROOM - 1 : index;
                return this.players[index];
            }
            right_player(person) {
                let index = person.seat_index + 1;
                index = index == config.LIMIT_IN_ROOM ? 0 : index;
                return this.players[index];
            }
        }
        model.Room = Room;
    })(model = mj.model || (mj.model = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Room.js.map