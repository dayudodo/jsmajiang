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
        var LoginScene = /** @class */ (function (_super) {
            __extends(LoginScene, _super);
            function LoginScene() {
                var _this = _super.call(this) || this;
                _this.agreeCheck.selected = true; //默认就接受协议
                //todo: 调试其中就不需要啥微信，只有一个测试登录。
                _this.weixinLoginBtn.visible = false;
                _this.testLoginBtn.on(Laya.Event.CLICK, _this, _this.loginClicked);
                return _this;
            }
            LoginScene.prototype.loginClicked = function () {
                //todo: 使用自动的用户名称，简化测试或者其它操作！
                var msg = { type: events.client_testlogin };
                var socket = Laya.client.socket;
                if (socket) {
                    socket.sendmsg(msg);
                }
            };
            return LoginScene;
        }(ui.test.LoginUI));
        scene.LoginScene = LoginScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=LoginScene.js.map