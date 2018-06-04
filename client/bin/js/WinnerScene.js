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
/**
* name
*/
var mj;
(function (mj) {
    var scene;
    (function (scene) {
        var PaiConverter = mj.utils.PaiConverter;
        var LayaUtils = mj.utils.LayaUtils;
        var WinnerScene = /** @class */ (function (_super) {
            __extends(WinnerScene, _super);
            function WinnerScene() {
                return _super.call(this) || this;
            }
            /**初始化，先把一些东西隐藏起来 */
            WinnerScene.prototype.init = function () {
                // this.resultLine3.visible = true
                // this.userHead3.visible = true
            };
            WinnerScene.prototype.show_resultOf = function (player, hupai_names) {
                var gameTable = Laya.gameTable;
                var ui_index = player.ui_index;
                this["hupai_names" + ui_index].text = hupai_names;
                this["hupai_names" + ui_index].visible = true;
                var one_shou_pai_width = this.shou3.width; //牌的宽度都是一样的，这无所谓！
                //其实只需要显示杠及碰即可，不再有SelfPeng，anGang之类的，都会显示出来，需要服务器发送改变后的数据
                gameTable.showMingGang(player.group_shou_pai, player, one_shou_pai_width, 0, this, true);
                gameTable.showPeng(player.group_shou_pai, player, one_shou_pai_width, 0, this, true);
                this.show_shoupai(player);
            };
            WinnerScene.prototype.show_shoupai = function (player) {
                var group_shou_pai = player.group_shou_pai, ui_index = player.ui_index;
                // let all_pais: Array<string> = shou_pai
                var shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
                var one_shou_pai_width = this.shou3.width;
                var posiX = one_shou_pai_width * player.shouPai_start_index + config.X_GAP;
                this["shouPai" + ui_index].visible = true;
                for (var index = 0; index < shouPai_urls.length; index++) {
                    var url = shouPai_urls[index];
                    this["skin_shoupai" + ui_index].skin = "ui/majiang/" + url;
                    this["shou" + ui_index].x = posiX;
                    var newPaiSprite = LayaUtils.clone(this["shou" + ui_index]);
                    newPaiSprite.visible = true;
                    this["shouPai" + ui_index].addChild(newPaiSprite);
                    posiX += one_shou_pai_width;
                }
            };
            return WinnerScene;
        }(ui.test.WinnerUI));
        scene.WinnerScene = WinnerScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=WinnerScene.js.map