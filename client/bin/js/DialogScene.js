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
        var DialogScene = /** @class */ (function (_super) {
            __extends(DialogScene, _super);
            function DialogScene(message, confirmClicked) {
                var _this = _super.call(this) || this;
                _this.contentText.wordWrap = true;
                _this.contentText.text = message;
                _this.cancelBtn.on(Laya.Event.CLICK, _this, _this.close);
                _this.confirmBtn.on(Laya.Event.CLICK, _this, confirmClicked);
                return _this;
            }
            //重新连接
            DialogScene.prototype.reconnect = function () {
                window.location.reload();
            };
            return DialogScene;
        }(ui.test.DialogUI));
        scene.DialogScene = DialogScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=DialogScene.js.map