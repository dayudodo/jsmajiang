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
        var Sprite = laya.display.Sprite;
        var GlowFilter = laya.filters.GlowFilter;
        var Event = Laya.Event;
        var PaiConverter = mj.utils.PaiConvertor;
        var OptDialogScene = /** @class */ (function (_super) {
            __extends(OptDialogScene, _super);
            function OptDialogScene(canHidePais) {
                var _this = _super.call(this) || this;
                /**点击数组，用于判断哪些已经选中 */
                _this.clickedArr = {};
                _this.socket = Laya.client.socket;
                _this.canHidePais = canHidePais;
                return _this;
            }
            OptDialogScene.prototype.show_liang = function () {
                var _this = this;
                //改变的肯定是god_player的手牌显示
                var gameTable = Laya.gameTable;
                //重新计时
                Laya.gameTable.show_count_down(Laya.god_player, true);
                gameTable.selfPeng3.visible = false;
                //但是需要把三个相同的给标记出来，让用户选择到底哪些不需要亮牌！也就是选择需要隐藏的牌
                //可能有多个，因为玩家是碰碰胡，而碰碰胡是可以杠的。
                //取消所有的按钮事件！
                gameTable.clonePaiSpriteArray.forEach(function (paiSprite) {
                    // 所有手牌事件不再响应，因为亮牌之后这些牌都不需要点击了！
                    paiSprite.offAll(Laya.Event.CLICK);
                    //然后再决定把哪三个绑定为一体，再去添加新的点击事件处理。这些可以选择的牌应该由服务器来告诉我，在发送你可以亮的时候计算出来！
                });
                //能够隐藏的牌由服务器传递过来参数canHidePais
                //选择的效果就是把其隐藏起来，换个背景即可！首先要找出这几张牌所处的位置，再改变其点击事件？任意一个点击，都会隐藏起来
                //貌似使用上一级点击就可以实现？
                this.canHidePais.forEach(function (pai) {
                    //新建sprite？貌似不需要，直接复制，然后改变位置？
                    // let newSelfPengSprite = Utils.clone(gameTable.selfPeng3) as Sprite
                    var newSelfPengSprite = new Sprite();
                    //找到
                    var shouPai = Laya.god_player.group_shou_pai.shouPai;
                    var index = shouPai.indexOf(pai);
                    for (var i = 0; i < 3; i++) {
                        var hidePai = gameTable.clonePaiSpriteArray[index + i];
                        newSelfPengSprite.addChild(hidePai);
                        //添加之后隐藏起来，免得干扰显示
                        // hidePai.visible = false
                    }
                    //调整这个克隆碰的显示位置，看起来似乎是还在显示。gameTable.clonePaiSpriteArray[index]为第一个找到的需要隐藏牌的位置
                    newSelfPengSprite.x = gameTable.clonePaiSpriteArray[index].x;
                    newSelfPengSprite.visible = true;
                    gameTable.shouPai3.addChild(newSelfPengSprite);
                    //给这个Sprite添加点击事件，这样三个可以一起改变显示效果
                    newSelfPengSprite.on(Laya.Event.CLICK, _this, function () {
                        console.log("cloneSelfPengSprite clicked");
                        for (var key in _this.clickedArr) {
                            //有值说明已经点击过了
                            if (_this.clickedArr[key] == newSelfPengSprite) {
                                //改变三张牌的显示为原始
                                newSelfPengSprite._childs.forEach(function (imgSprite) {
                                    imgSprite.getChildAt(0).skin = PaiConverter.skinOfShou(pai);
                                });
                                //还是上下移来的方便，删除后问题麻烦
                                delete _this.clickedArr[key];
                            }
                            else {
                                //保存到点击字典中
                                _this.clickedArr[pai] = newSelfPengSprite;
                                //改变三张牌的显示为原始
                                newSelfPengSprite._childs.forEach(function (imgSprite) {
                                    imgSprite.getChildAt(0).skin = PaiConverter.skinOfShouBack();
                                });
                            }
                        }
                    });
                });
                // this.socket.sendmsg({
                //     type: g_events.client_confirm_liang,
                //     pais: []
                // })
            };
            OptDialogScene.prototype.showPlayerSelect = function (_a) {
                var _this = this;
                var isShowHu = _a.isShowHu, isShowLiang = _a.isShowLiang, isShowGang = _a.isShowGang, isShowPeng = _a.isShowPeng;
                this.initButton(this.liang, isShowLiang, function () {
                    console.log("\u7528\u6237\u9009\u62E9\u4EAE");
                    _this.close();
                    _this.removeSelf();
                    //亮牌有所不同的是其还需要改变桌面的显示
                    _this.show_liang();
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