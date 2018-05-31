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
        var GlowFilter = laya.filters.GlowFilter;
        var Event = Laya.Event;
        var LiangSelect = mj.scene.LianSelectScene;
        var OptDialogScene = /** @class */ (function (_super) {
            __extends(OptDialogScene, _super);
            function OptDialogScene(canHidePais) {
                var _this = _super.call(this) || this;
                _this.socket = Laya.client.socket;
                _this.canHidePais = canHidePais;
                return _this;
            }
            OptDialogScene.prototype.showPlayerSelect = function (_a) {
                var _this = this;
                var isShowHu = _a.isShowHu, isShowLiang = _a.isShowLiang, isShowGang = _a.isShowGang, isShowPeng = _a.isShowPeng;
                this.initButton(this.liang, isShowLiang, function () {
                    console.log("god_player\u6211\u9009\u62E9\u4EAE");
                    Laya.god_player.is_liang = true;
                    //弹出选择3A牌的对话框，设定为全局是为了方便调试！
                    //另外，没有需要隐藏的牌就不用再去显示了
                    _this.liangSelectOpt = new LiangSelect(_this.canHidePais);
                    _this.liangSelectOpt.decidePopup();
                    //显示完毕把自己干掉
                    _this.close();
                    _this.removeSelf();
                    //亮牌有所不同的是其还需要改变桌面的显示
                });
                this.initButton(this.hu, isShowHu, function () {
                    console.log("\u7528\u6237\u9009\u62E9\u80E1");
                    _this.socket.sendmsg({
                        type: g_events.client_confirm_hu
                    });
                    _this.close();
                    _this.removeSelf();
                });
                this.initButton(this.gang, isShowGang, function () {
                    console.log("\u7528\u6237\u9009\u62E9\u6760");
                    _this.socket.sendmsg({
                        type: g_events.client_confirm_mingGang
                    });
                    _this.close();
                    _this.removeSelf();
                });
                this.initButton(this.peng, isShowPeng, function () {
                    console.log("\u7528\u6237\u9009\u62E9\u78B0");
                    _this.socket.sendmsg({
                        type: g_events.client_confirm_peng
                    });
                    _this.close();
                    _this.removeSelf();
                });
                //过肯定是在所有情况下都要显示的！
                this.initButton(this.guo, true, function () {
                    console.log("\u7528\u6237\u9009\u62E9\u8FC7");
                    _this.socket.sendmsg({
                        type: g_events.client_confirm_guo
                    });
                    _this.close();
                    _this.removeSelf();
                });
            };
            /**
             * 初始化能够操作的按钮，包括胡、杠、碰、过
             * @param button
             * @param isShow 是否显示这个按钮
             * @param clickHandler 点击此按钮后干啥
             */
            OptDialogScene.prototype.initButton = function (button, isShow, clickHandler) {
                var btn = button;
                if (isShow) {
                    btn.visible = true;
                }
                else {
                    btn.visible = false;
                }
                button.on(Event.MOUSE_OVER, this, function () {
                    button.filters = OptDialogScene.btnGlowFilters;
                });
                button.on(Event.MOUSE_OUT, this, function () {
                    button.filters = null;
                });
                button.on(Event.MOUSE_DOWN, this, function () {
                    button.filters = OptDialogScene.downBtnGlowFilters;
                });
                button.on(Event.CLICK, this, clickHandler);
            };
            OptDialogScene.btnGlowFilters = [new GlowFilter("#ebb531", 8, 5, 5)];
            OptDialogScene.downBtnGlowFilters = [new GlowFilter("#ebb531", 14, 5, 5)];
            return OptDialogScene;
        }(ui.test.OptDialogUI));
        scene.OptDialogScene = OptDialogScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=OptDialogScene.js.map