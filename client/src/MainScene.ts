
// var g_events = require('../net/g_events')
module mj.scene {
    import SettingScene = ui.test.SettingDialogUI
    
    
    export class MainScene extends ui.test.MainUI {
        public socket = Laya.client.socket
        public join_room 

        constructor(username: string, user_id: string) {
            super()
            this.userName.text = username
            this.userId.text = user_id
            let room_gold: number = 1 //todo: 用户有多少房卡？
            this.gold.text = "房卡：" + room_gold

            //显示系统消息：
            this.notice.visible = false
            //显示系统公告
            this.newNotice.wordWrap = true
            this.newNotice.text = "谢绝赌博，请文明游戏"

            this.quitBtn.on(Laya.Event.CLICK, this, this.clickQuit)
            this.settingBtn.on(Laya.Event.CLICK, this, this.ClickSetting)

            this.createBtn.on(Laya.Event.CLICK, this, this.ClickCreate)
            this.joinBtn.on(Laya.Event.CLICK, this, this.ClickJoin)
        }
        ClickJoin(): void {
            //加入房间
            let {god_player} = Laya
            //todo: 应该要弹出一个选择窗口，测试时直接加入rose房间，房间其实还应该有个id号，唯一的。
            laya.ui.Dialog.manager.maskLayer.alpha = 0.6
            let dialog = new JoinRoomDialogue()
            this.join_room = dialog
            Laya.stage.addChild(dialog)
            dialog.popup()
            
            // let msg = {
            //     type: g_events.client_join_room,
            //     username: god_player.username,
            //     user_id: god_player.user_id,
            //     room_id: '001'
            // }
            // this.socket.send(JSON.stringify(msg))

        }
        ClickCreate(): void {
            //创建房间

            let msg = { type: g_events.client_create_room }
            this.socket.send(JSON.stringify(msg))
        }
        ClickSetting(): void {
            //点击设置
            let dialog = new SettingScene()
            Laya.stage.addChild(dialog)
        }
        clickQuit(): void {
            //点击退出
            let dialog = new DialogScene(`确定退出吗？`, () => {
                window.close()
            })
            dialog.popup()
            Laya.stage.addChild(dialog)
        }


    }

}