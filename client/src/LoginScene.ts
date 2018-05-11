

module mj.scene {

    export class LoginScene extends ui.test.LoginUI {

        constructor() {
            super()
            this.agreeCheck.selected = true //默认就接受协议
            //todo: 调试其中就不需要啥微信，只有一个测试登录。
            this.weixinLoginBtn.visible = false

            this.testLoginBtn.on(Laya.Event.CLICK, this, this.loginClicked)


        }

        loginClicked(): void {
            //todo: 使用自动的用户名称，简化测试或者其它操作！
            let msg = { type: g_events.client_testlogin }
            var socket = Laya.client.socket
            if (socket.connected) {
                socket.sendmsg(msg)
            } 
        }


    }

}