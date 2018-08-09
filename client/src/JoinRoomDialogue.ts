module mj.scene {
    import Sprite = laya.display.Sprite;
    import Image = Laya.Image

    export class JoinRoomDialogue extends ui.test.JoinRoomUI {
        /** 房间最大号，10**6， 最多一百万个房间？  */
        private INPUT_MAX = 6
        /** 当前每几位数 */
        public index = 0
        // /** 房间号字符串 */
        // private room_string = ''
        /** 房间号字符，比如['1','2'] */
        public room_chars = []
        /** 保存laya.stage的原始alpha值，便于还原 */
        private stageAlpha = 0;

        constructor() {
            super()
            this.btn_close.on(Laya.Event.CLICK, this, () => {
                // Laya.stage.alpha = this.stageAlpha
                this.close()
                this.removeSelf()

            })
            this.btn_ok.on(Laya.Event.CLICK, this, () => {
                console.log('real room_nubmer is: ', this.room_nubmer)

                //todo: for test
                this.room_chars = ['1']
                console.log('test room_nubmer is: ', this.room_nubmer)

                Laya.god_player.room_number = this.room_nubmer
                //发送完成后需要关闭对话框，房间号应该作为个全局变量存在，玩家一次也就只能进入一个房间
                this.close()
                //使用room_number加入房间
                Laya.socket.sendmsg({
                    type: g_events.client_join_room,
                    room_number: this.room_nubmer
                })

            })
            this.btn_delete.on(Laya.Event.CLICK, this, () => {
                this.room_chars.pop()
                this.show_room_number()
            })
            this.btn_redo.on(Laya.Event.CLICK, this, () => {
                this.room_chars = []
                this.show_room_number()
            })

            this.numberClicked()

        }
        /** 数字的图片skin */
        skin_ofNumber(value: number): string {
            return `base/number/win/${value}.png`
        }
        /** 显示房间号，有几位就显示几位 */
        show_room_number() {
            //如果大于MAX, 就把前面的取消掉，始终保持6位数！
            if (this.room_chars.length > this.INPUT_MAX) {
                this.room_chars.shift()
            }
            //先隐藏所有房间数字
            this.numbersShow._childs.forEach(item => {
                item.visible = false
            })

            for (var index = 0; index < this.room_chars.length; index++) {
                var item = this.room_chars[index];
                var skin = this.skin_ofNumber(item)
                var image = this.numbersShow._childs[index] as Image
                image.visible = true
                var number_image = image.getChildAt(0) as Image
                number_image.skin = skin
            }
        }
        /** 如果数字键被点击 */
        numberClicked(): void {
            this.n0.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('0')
                this.show_room_number()
            })
            this.n1.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('1')
                this.show_room_number()
            })
            this.n2.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('2')
                this.show_room_number()
            })
            this.n3.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('3')
                this.show_room_number()
            })
            this.n4.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('4')
                this.show_room_number()
            })
            this.n5.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('5')
                this.show_room_number()
            })
            this.n6.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('6')
                this.show_room_number()
            })
            this.n7.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('7')
                this.show_room_number()
            })
            this.n8.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('8')
                this.show_room_number()
            })
            this.n9.on(Laya.Event.CLICK, this, () => {
                this.room_chars.push('9')
                this.show_room_number()
            })
        }
        get room_string(): string {
            return this.room_chars.join('')
        }
        get room_nubmer(): number {
            return parseInt(this.room_string)
        }



    }
}