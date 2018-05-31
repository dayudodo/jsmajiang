module mj.scene {
    import Sprite = laya.display.Sprite;
    import Image = Laya.Image
    import GlowFilter = laya.filters.GlowFilter;
    import Event = Laya.Event
    import Utils = mj.utils.LayaUtils
    import PaiConverter = mj.utils.PaiConverter;
    import LiangSelect = mj.scene.LianSelectScene;


    export class OptDialogScene extends ui.test.OptDialogUI {
        private static btnGlowFilters = [new GlowFilter("#ebb531", 8, 5, 5)];
        private static downBtnGlowFilters = [new GlowFilter("#ebb531", 14, 5, 5)];
        public socket: Laya.Socket;
        /**可以隐藏的牌 */
        public canHidePais: Array<Pai>
        public liangSelectOpt: LiangSelect

        constructor(canHidePais) {
            super()
            this.socket = Laya.client.socket
            this.canHidePais = canHidePais
        }


        public showPlayerSelect({isShowHu, isShowLiang, isShowGang, isShowPeng}) {
            this.initButton(this.liang, isShowLiang, () => {
                console.log(`god_player我选择亮`);
                Laya.god_player.is_liang = true
                //弹出选择3A牌的对话框，设定为全局是为了方便调试！
                //另外，没有需要隐藏的牌就不用再去显示了
                this.liangSelectOpt = new LiangSelect(this.canHidePais)
                this.liangSelectOpt.decidePopup()
                //显示完毕把自己干掉
                this.close()
                this.removeSelf()
                //亮牌有所不同的是其还需要改变桌面的显示
            })
            this.initButton(this.hu, isShowHu, () => {
                console.log(`用户选择胡`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_hu
                })
                this.close()
                this.removeSelf()
            })

            this.initButton(this.gang, isShowGang, () => {
                console.log(`用户选择杠`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_mingGang
                })
                this.close()
                this.removeSelf()
            })
            this.initButton(this.peng, isShowPeng, () => {
                console.log(`用户选择碰`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_peng
                })
                this.close()
                this.removeSelf()
            })
            //过肯定是在所有情况下都要显示的！
            this.initButton(this.guo, true, () => {
                console.log(`用户选择过`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_guo
                })
                this.close()
                this.removeSelf()
            })
        }
        /**
         * 初始化能够操作的按钮，包括胡、杠、碰、过
         * @param button 
         * @param isShow 是否显示这个按钮
         * @param clickHandler 点击此按钮后干啥
         */
        public initButton(button: Image, isShow: boolean, clickHandler: Function) {
            let btn = button
            if (isShow) {
                btn.visible = true
            }
            else {
                btn.visible = false
            }
            button.on(Event.MOUSE_OVER, this, function (): void {
                button.filters = OptDialogScene.btnGlowFilters;
            });

            button.on(Event.MOUSE_OUT, this, function (): void {
                button.filters = null;
            });

            button.on(Event.MOUSE_DOWN, this, function (): void {
                button.filters = OptDialogScene.downBtnGlowFilters;
            });
            button.on(Event.CLICK, this, clickHandler)
        }

    }

}