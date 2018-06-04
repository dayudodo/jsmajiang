/**
* name 
*/
module mj.scene {
	import Sprite = laya.display.Sprite;
	import Image = Laya.Image;
	import ShoupaiConstuctor = mj.model.ShoupaiConstuctor;
	import PaiConverter = mj.utils.PaiConverter;
	import LayaUtils = mj.utils.LayaUtils

	export class WinnerScene extends ui.test.WinnerUI {
		constructor() {
			super()

		}
		/**初始化，先把一些东西隐藏起来 */
		public init() {
			// this.resultLine3.visible = true
			// this.userHead3.visible = true

		}
		public show_resultOf(player: Player, hupai_names) {
			let {gameTable } = Laya
			let {ui_index} = player
			this["hupai_names" + ui_index].text = hupai_names
			this["hupai_names" + ui_index].visible = true

			let one_shou_pai_width = this.shou3.width //牌的宽度都是一样的，这无所谓！
			//其实只需要显示杠及碰即可，不再有SelfPeng，anGang之类的，都会显示出来，需要服务器发送改变后的数据
			gameTable.showMingGang(player.group_shou_pai, player, one_shou_pai_width, 0, this, true)
			gameTable.showPeng(player.group_shou_pai, player, one_shou_pai_width, 0, this, true)
			this.show_shoupai(player)
		}

		private show_shoupai(player: Player) {

			let { group_shou_pai, ui_index } = player;
			// let all_pais: Array<string> = shou_pai
			let shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
			let one_shou_pai_width = this.shou3.width;
			let posiX = one_shou_pai_width * player.shouPai_start_index + config.X_GAP;
			this["shouPai" + ui_index].visible = true;

			for (let index = 0; index < shouPai_urls.length; index++) {
				const url = shouPai_urls[index];
				this["skin_shoupai" + ui_index].skin = `ui/majiang/${url}`;
				this["shou" + ui_index].x = posiX;

				let newPaiSprite = LayaUtils.clone(this["shou" + ui_index]) as Sprite;
				newPaiSprite.visible = true;

				this["shouPai" + ui_index].addChild(newPaiSprite);
				posiX += one_shou_pai_width;
			}
		}

	}
}