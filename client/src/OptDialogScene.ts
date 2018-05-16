

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
        public showPlayerSelect({isShowHu, isShowLiang, isShowGang, isShowPeng}) {

            this.initButton(this.hu, isShowHu, () => {
                console.log(`用户选择胡`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_hu
                })
                this.removeSelf()
            })
            this.initButton(this.liang, isShowLiang, () => {
                console.log(`用户选择亮`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_liang
                })
                this.removeSelf()
            })
            this.initButton(this.gang, isShowGang, () => {
                console.log(`用户选择杠`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_gang
                })
                this.removeSelf()
            })
            this.initButton(this.peng, isShowPeng, () => {
                console.log(`用户选择碰`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_peng
                })
                this.removeSelf()
            })
            //过肯定是在所有情况下都要显示的！
            this.initButton(this.guo, true, () => {
                console.log(`用户选择过`);
                this.socket.sendmsg({
                    type: g_events.client_confirm_guo
                })
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