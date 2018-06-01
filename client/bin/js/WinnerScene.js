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
            WinnerScene.prototype.show_winner = function (win_player, hupai_names) {
                var gameTable = Laya.gameTable;
                this.hupaiNames3.text = hupai_names;
                this.hupaiNames3.visible = true;
                var one_shou_pai_width = this.shou3.width;
                //其实只需要显示杠及碰即可，不再有SelfPeng，anGang之类的，都会显示出来
                gameTable.showMingGang(win_player.group_shou_pai, win_player, one_shou_pai_width, 0, this);
                gameTable.showPeng(win_player.group_shou_pai, win_player, one_shou_pai_width, 0, this);
                this.show_shoupai(win_player);
            };
            WinnerScene.prototype.show_shoupai = function (player) {
                var group_shou_pai = player.group_shou_pai;
                // let all_pais: Array<string> = shou_pai
                var shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
                var one_shou_pai_width = this.shou3.width;
                var posiX = one_shou_pai_width * player.shouPai_start_index + config.X_GAP;
                this.shouPai3.visible = true;
                for (var index = 0; index < shouPai_urls.length; index++) {
                    var url = shouPai_urls[index];
                    this.skin_shoupai3.skin = "ui/majiang/" + url;
                    this.shou3.x = posiX;
                    console.log(this.shou3);
                    var newPaiSprite = LayaUtils.clone(this.shou3);
                    newPaiSprite.visible = true;
                    this.shouPai3.addChild(newPaiSprite);
                    posiX += one_shou_pai_width;
                }
            };
            return WinnerScene;
        }(ui.test.WinnerUI));
        scene.WinnerScene = WinnerScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=WinnerScene.js.map