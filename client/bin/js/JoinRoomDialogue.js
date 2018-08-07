var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mj;
(function (mj) {
    var scene;
    (function (scene) {
        var JoinRoomDialogue = /** @class */ (function (_super) {
            __extends(JoinRoomDialogue, _super);
            function JoinRoomDialogue() {
                var _this = _super.call(this) || this;
                /** 房间最大号，10**6， 最多一百万个房间？  */
                _this.MAX = 6;
                /** 当前每几位数 */
                _this.index = 0;
                // /** 房间号字符串 */
                // private room_string = ''
                /** 房间号字符，比如['1','2'] */
                _this.room_chars = [];
                _this.btn_close.on(Laya.Event.CLICK, _this, function () {
                    _this.removeSelf();
                    _this.destroy();
                });
                _this.btn_ok.on(Laya.Event.CLICK, _this, function () {
                    //使用room_number加入房间
                    Laya.socket.sendmsg({
                        type: g_events.client_join_room,
                        room_number: _this.room_nubmer
                    });
                });
                return _this;
            }
            Object.defineProperty(JoinRoomDialogue.prototype, "room_string", {
                get: function () {
                    return this.room_chars.join('');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JoinRoomDialogue.prototype, "room_nubmer", {
                get: function () {
                    return parseInt(this.room_string);
                },
                enumerable: true,
                configurable: true
            });
            return JoinRoomDialogue;
        }(ui.test.JoinRoomUI));
        scene.JoinRoomDialogue = JoinRoomDialogue;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=JoinRoomDialogue.js.map