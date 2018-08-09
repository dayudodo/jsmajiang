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
                _this.INPUT_MAX = 6;
                /** 当前每几位数 */
                _this.index = 0;
                // /** 房间号字符串 */
                // private room_string = ''
                /** 房间号字符，比如['1','2'] */
                _this.room_chars = [];
                /** 保存laya.stage的原始alpha值，便于还原 */
                _this.stageAlpha = 0;
                _this.btn_close.on(Laya.Event.CLICK, _this, function () {
                    // Laya.stage.alpha = this.stageAlpha
                    _this.close();
                    _this.removeSelf();
                });
                _this.btn_ok.on(Laya.Event.CLICK, _this, function () {
                    console.log('real room_nubmer is: ', _this.room_nubmer);
                    //todo: for test
                    _this.room_chars = ['1'];
                    console.log('test room_nubmer is: ', _this.room_nubmer);
                    Laya.god_player.room_number = _this.room_nubmer;
                    //发送完成后需要关闭对话框，房间号应该作为个全局变量存在，玩家一次也就只能进入一个房间
                    _this.close();
                    //使用room_number加入房间
                    Laya.socket.sendmsg({
                        type: g_events.client_join_room,
                        room_number: _this.room_nubmer
                    });
                });
                _this.btn_delete.on(Laya.Event.CLICK, _this, function () {
                    _this.room_chars.pop();
                    _this.show_room_number();
                });
                _this.btn_redo.on(Laya.Event.CLICK, _this, function () {
                    _this.room_chars = [];
                    _this.show_room_number();
                });
                _this.numberClicked();
                return _this;
            }
            /** 数字的图片skin */
            JoinRoomDialogue.prototype.skin_ofNumber = function (value) {
                return "base/number/win/" + value + ".png";
            };
            /** 显示房间号，有几位就显示几位 */
            JoinRoomDialogue.prototype.show_room_number = function () {
                //如果大于MAX, 就把前面的取消掉，始终保持6位数！
                if (this.room_chars.length > this.INPUT_MAX) {
                    this.room_chars.shift();
                }
                //先隐藏所有房间数字
                this.numbersShow._childs.forEach(function (item) {
                    item.visible = false;
                });
                for (var index = 0; index < this.room_chars.length; index++) {
                    var item = this.room_chars[index];
                    var skin = this.skin_ofNumber(item);
                    var image = this.numbersShow._childs[index];
                    image.visible = true;
                    var number_image = image.getChildAt(0);
                    number_image.skin = skin;
                }
            };
            /** 如果数字键被点击 */
            JoinRoomDialogue.prototype.numberClicked = function () {
                var _this = this;
                this.n0.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('0');
                    _this.show_room_number();
                });
                this.n1.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('1');
                    _this.show_room_number();
                });
                this.n2.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('2');
                    _this.show_room_number();
                });
                this.n3.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('3');
                    _this.show_room_number();
                });
                this.n4.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('4');
                    _this.show_room_number();
                });
                this.n5.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('5');
                    _this.show_room_number();
                });
                this.n6.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('6');
                    _this.show_room_number();
                });
                this.n7.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('7');
                    _this.show_room_number();
                });
                this.n8.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('8');
                    _this.show_room_number();
                });
                this.n9.on(Laya.Event.CLICK, this, function () {
                    _this.room_chars.push('9');
                    _this.show_room_number();
                });
            };
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