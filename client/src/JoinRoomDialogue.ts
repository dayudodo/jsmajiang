module mj.scene {
    import Sprite = laya.display.Sprite;
    export class JoinRoomDialogue extends ui.test.JoinRoomUI {
        /** 房间最大号，10**6， 最多一百万个房间？  */
        private MAX = 6
        /** 当前每几位数 */
        public index = 0
        // /** 房间号字符串 */
        // private room_string = ''
        /** 房间号字符，比如['1','2'] */
        public room_chars = []

        constructor() {
            super()
            this.btn_close.on(Laya.Event.CLICK, this, () => {
                this.removeSelf()
                this.destroy()
            })
            this.btn_ok.on(Laya.Event.CLICK, this, () => {
                console.log('real room_nubmer is: ', this.room_nubmer)

                //todo: for test
                this.room_chars = ['1']
                console.log('test room_nubmer is: ', this.room_nubmer)

                //使用room_number加入房间
                Laya.socket.sendmsg({
                    type: g_events.client_join_room,
                    room_number: this.room_nubmer
                })
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