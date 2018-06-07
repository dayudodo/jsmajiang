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
// var g_events = require('../net/g_events')
var mj;
(function (mj) {
    var scene;
    (function (scene) {
        var SettingScene = ui.test.SettingDialogUI;
        var MainScene = /** @class */ (function (_super) {
            __extends(MainScene, _super);
            function MainScene(username, user_id) {
                var _this = _super.call(this) || this;
                _this.socket = Laya.client.socket;
                _this.userName.text = username;
                _this.userId.text = user_id;
                var room_gold = 1; //todo: 用户有多少房卡？
                _this.gold.text = "房卡：" + room_gold;
                //显示系统消息：
                _this.notice.visible = false;
                //显示系统公告
                _this.newNotice.wordWrap = true;
                _this.newNotice.text = "谢绝赌博，请文明游戏";
                _this.quitBtn.on(Laya.Event.CLICK, _this, _this.clickQuit);
                _this.settingBtn.on(Laya.Event.CLICK, _this, _this.ClickSetting);
                _this.createBtn.on(Laya.Event.CLICK, _this, _this.ClickCreate);
                _this.joinBtn.on(Laya.Event.CLICK, _this, _this.ClickJoin);
                return _this;
            }
            MainScene.prototype.ClickJoin = function () {
                //加入房间
                var god_player = Laya.god_player;
                //todo: 应该要弹出一个选择窗口，测试时直接加入rose房间，房间其实还应该有个id号，唯一的。
                var msg = {
                    type: g_events.client_join_room,
                    username: god_player.username,
                    user_id: god_player.user_id,
                    room_id: '001'
                };
                this.socket.send(JSON.stringify(msg));
            };
            MainScene.prototype.ClickCreate = function () {
                //创建房间
                var msg = { type: g_events.client_create_room };
                this.socket.send(JSON.stringify(msg));
            };
            MainScene.prototype.ClickSetting = function () {
                //点击设置
                var dialog = new SettingScene();
                Laya.stage.addChild(dialog);
            };
            MainScene.prototype.clickQuit = function () {
                //点击退出
                var dialog = new scene.DialogScene("\u786E\u5B9A\u9000\u51FA\u5417\uFF1F", function () {
                    window.close();
                });
                dialog.popup();
                Laya.stage.addChild(dialog);
            };
            return MainScene;
        }(ui.test.MainUI));
        scene.MainScene = MainScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=MainScene.js.map