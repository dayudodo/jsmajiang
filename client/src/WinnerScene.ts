/**
* name 
*/
module mj.scene{
	    import Sprite = laya.display.Sprite;
    import Image = Laya.Image;
    import ShoupaiConstuctor = mj.model.ShoupaiConstuctor;
    import PaiConverter = mj.utils.PaiConverter;
    import LayaUtils =mj.utils.LayaUtils

	export class WinnerScene extends ui.test.WinnerUI{
		constructor(){
			super()

		}
		/**初始化，先把一些东西隐藏起来 */
		public init(){
			// this.resultLine3.visible = true
			// this.userHead3.visible = true

		}
		public show_winner(win_player: Player, hupai_names){
			let {gameTable }= Laya
			this.hupaiNames3.text = hupai_names
			this.hupaiNames3.visible = true

			let one_shou_pai_width = this.shou3.width
			//其实只需要显示杠及碰即可，不再有SelfPeng，anGang之类的，都会显示出来
			gameTable.showMingGang(win_player.group_shou_pai, win_player,  one_shou_pai_width,0, this )
			gameTable.showPeng(win_player.group_shou_pai, win_player,  one_shou_pai_width,0, this )
			this.show_shoupai(win_player)
		}

		private show_shoupai(player: Player) {

            let { group_shou_pai } = player;
            // let all_pais: Array<string> = shou_pai
            let shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
            let one_shou_pai_width = this.shou3.width;
            let posiX = one_shou_pai_width * player.shouPai_start_index + config.X_GAP;
            this.shouPai3.visible = true;

            for (let index = 0; index < shouPai_urls.length; index++) {
                const url = shouPai_urls[index];
                this.skin_shoupai3.skin = `ui/majiang/${url}`;
                this.shou3.x = posiX;
				
                let newPaiSprite = LayaUtils.clone(this.shou3) as Sprite;
                newPaiSprite.visible = true;

                this.shouPai3.addChild(newPaiSprite);
                posiX += one_shou_pai_width;
            }
        }

	}
}