

module mj.scene {
    import Image = Laya.Image
    import GlowFilter = laya.filters.GlowFilter;
    import Event = Laya.Event

    export class OptDialogScene extends ui.test.OptDialogUI {
        private static btnGlowFilters = [new GlowFilter("#ebb531", 8, 5, 5)];
        private static downBtnGlowFilters = [new GlowFilter("#ebb531", 14, 5, 5)];
        public socket: Laya.Socket;

        constructor() {
            super()
            this.socket = Laya.client.socket
        }
        public show_liang() {
            //改变的肯定是god_player的手牌显示
            let gameTable = Laya.gameTable
            //但是需要把三个相同的给标记出来，让用户选择到底哪些不需要亮牌！也就是选择需要隐藏的牌
            //可能有多个，因为玩家是碰碰胡，而碰碰胡是可以杠的。
            //三个一起进行标记，同时上移或者下移， 上移的就是选中的
            //取消所有的按钮事件！
            gameTable.clonePaiSpriteArray.forEach(paiSprite => {
                // 所有手牌事件不再响应，因为亮牌之后这些牌都不需要点击了！
                paiSprite.offAll(Laya.Event.CLICK)
                //然后再决定把哪三个绑定为一体，再去添加新的点击事件处理。这些可以选择的牌应该由服务器来告诉我，在发送你可以亮的时候计算出来！


            })
            this.socket.sendmsg({
                type: g_events.client_confirm_liang,
                pais: []
            })
        }
        public showPlayerSelect({isShowHu, isShowLiang, isShowGang, isShowPeng}) {

            this.initButton(this.hu, isShowHu, () => {
                console.log(`用户选择胡`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_hu
                })
                this.close()
                this.removeSelf()
            })
            this.initButton(this.liang, isShowLiang, () => {
                console.log(`用户选择亮`);
                this.close()
                this.removeSelf()
                //亮牌有所不同的是其还需要改变桌面的显示
                this.show_liang()
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