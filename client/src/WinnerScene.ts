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
			this.btn_restart.on(Laya.Event.CLICK, this, ()=>{
				Laya.socket.sendmsg({
					type: g_events.client_restart_game
				})
				this.destroy()
			})
		}
		/**初始化，先把一些东西隐藏起来 */
		public init() {
			// this.resultLine3.visible = true
			// this.userHead3.visible = true

		}
		public show_all(players: any) {
			players.forEach(p => {
				p.shouPai_start_index = 0
				this.show_resultOf(p)
			});
		}
		public show_resultOf(player: any) {
			let {gameTable } = Laya
			let {ui_index} = player
			this["win_info" + ui_index].text = player.result_info.win_info
			this["win_info" + ui_index].visible = true
			this["lose_info" + ui_index].text = player.result_info.lose_info
			this["lose_info" + ui_index].visible = true

			if(player.is_hu){
				let hupaiSprite = this["fa"+ ui_index] as Sprite
				let huImage = hupaiSprite.getChildAt(0).getChildAt(0) as Image
				huImage.skin = PaiConverter.skinOfShou(player.hupai_zhang)
				hupaiSprite.visible = true
			}

			let one_shou_pai_width = this.shou3.width //牌的宽度都是一样的，这无所谓！
			//其实只需要显示杠及碰即可，不再有SelfPeng，anGang之类的，都会显示出来，需要服务器发送改变后的数据
			gameTable.showMingGang(player.result_shou_pai, player, one_shou_pai_width, 0, this, true)
			gameTable.showPeng(player.result_shou_pai, player, one_shou_pai_width, 0, this, true)
			this.show_head(player)
			this.show_shoupai(player)
			this.show_huOrLost(player)
		}

		public show_head(player: Player) {
			let { ui_index } = player;

			this["zhuang"+ ui_index].visible =  player.east
			this["userName" + ui_index].text = player.username
			// this["userName" + ui_index].visible = true
			this["oneju_score" + ui_index].text ="得分："+ player.oneju_score
			// this["score" + ui_index].visible = true

		}
		public show_huOrLost(player: Player){
			if(player.is_hu){
				this["img_huOrLose"+ player.ui_index].skin = "ui/game/hu.png"
				this["img_huOrLose"+ player.ui_index].visible = true
			}
			if(player.is_fangpao){
				this["img_huOrLose"+ player.ui_index].skin = "ui/game/fangpao.png"
				this["img_huOrLose"+ player.ui_index].visible = true
			}
		}

		private show_shoupai(player: Player) {
			let result_shou_pai = player.result_shou_pai
			let { ui_index } = player;
			// let all_pais: Array<string> = shou_pai
			let shouPai_urls = PaiConverter.ToShouArray(result_shou_pai.shouPai);
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