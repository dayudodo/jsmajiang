import GameTableScene = mj.scene.GameTableScene
module mj.net {
    export class Manager {
        public socket: Laya.Socket
        public byte: Laya.Byte

        constructor() { this.connect() }
        public connect(): void {
            this.byte = new Laya.Byte();
            //这里我们采用小端
            this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
            this.socket = new Laya.Socket();
            //这里我们采用小端
            this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
            //建立连接
            this.socket.connectByUrl("ws://192.168.2.200:3333");
            this.socket.on(Laya.Event.OPEN, this, this.openHandler);
            this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
            this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
            this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
        }
        public openHandler(event: any = null): void {
            //正确建立连接；
        }
        //看来这儿会成为新的调度口了，根据发过来的消息进行各种处理，暂时感觉这样也OK，不过那种socketio的on办法也实在是方便啊。
        public receiveHandler(msg: any = null): void {
            ///接收到数据触发函数
            let server_message = JSON.parse(msg)
            switch (server_message.type) {
                case events.server_welcome:
                    console.log('welcome:', server_message.welcome);
                    break;
                case events.server_login:
                    let { username, user_id } = server_message
                    console.log('登录成功, 用户名：', username);
                    Laya.god_player.username = username
                    Laya.god_player.user_id = user_id
                    //进入主界面！
                    let home = new scene.MainScene(username, user_id)
                    Laya.stage.destroyChildren()
                    Laya.stage.addChild(home)
                    break;
                case events.server_no_room:
                    {
                        let dialog = new DialogScene("服务器无可用房间！", () => { dialog.close() })
                        dialog.popup()
                        Laya.stage.addChild(dialog)
                    }
                    break
                case events.server_room_full:
                    {
                        let dialog = new DialogScene("服务器房间已满！", () => { dialog.close() })
                        dialog.popup()
                        Laya.stage.addChild(dialog)
                    }
                    break;
                case events.server_no_such_room:
                    {
                        console.log('无此房间号');
                        
                        let dialog = new DialogScene("无此房间号", () => { dialog.close() })
                        dialog.popup()
                        Laya.stage.addChild(dialog)
                    }
                    break;
                case events.server_player_enter_room:
                    {
                        console.log(`${server_message.username}玩家进入房间！`);
                        
                    }
                    break;
                case events.server_join_room_ok:
                    //进入游戏界面，已经成功创建房间
                    console.log(`成功创建房间:${server_message.room_name}`);
                    Laya.stage.destroyChildren()
                    let gameTable = new GameTableScene()
                    Laya.stage.addChild(gameTable)
                    break

                default:
                    console.log('server info:', server_message.info);
                    break;
            }


        }
        public closeHandler(e: any = null): void {
            //关闭事件
            // console.log('服务器已经关闭，请查看官网说明');
            this.socket.cleanSocket()
            let closeDialogue = new DialogScene('服务器已经关闭，请查看官网说明')
            closeDialogue.popup()
            Laya.stage.addChild(closeDialogue)

        }
        public errorHandler(e: any = null): void {
            //连接出错
            let dialog = new DialogScene(`连接出错！${e}`)
            dialog.popup()
            Laya.stage.addChild(dialog)

        }
    }
}