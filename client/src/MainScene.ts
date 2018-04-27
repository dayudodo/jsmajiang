import SettingScene = ui.test.SettingDialogUI

module mj.scene {

    export class MainScene extends ui.test.MainUI {
        public socket = Laya.client.socket

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
            let msg = {
                type: events.join_room,
                username: god_player.username,
                user_id: god_player.user_id,
                room_id: '001'
            }
            this.socket.send(JSON.stringify(msg))

        }
        ClickCreate(): void {
            //创建房间

            let msg = { type: events.create_room }
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

        loginClicked(): void {
            //todo: 使用自动的用户名称，简化测试或者其它操作！
            let msg = { testlogin: true, username: 'jack' }

            if (this.socket) {
                this.socket.send(JSON.stringify(msg))
            }

            // if (Laya.client) {

            // }else{
            //     Laya.client.socket.
            // }
        }


    }

}