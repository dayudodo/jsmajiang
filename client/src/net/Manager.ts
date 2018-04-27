import GameTableScene = mj.scene.GameTableScene;
namespace mj.net {
    export class Manager {
        public socket: Laya.Socket;
        public byte: Laya.Byte;
        public eventsHandler: Array<any>

        constructor() {
            this.connect();
        }
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
            this.eventsHandler = [
                [events.server_welcome, this.server_welcome],
                [events.server_login, this.server_login],
                [events.server_no_room, this.server_no_room],
                [events.server_no_such_room, this.server_no_such_room],
                [events.server_other_player_enter_room, this.server_other_player_enter_room],
                [events.server_player_enter_room, this.server_player_enter_room],
                [events.server_room_full, this.server_room_full],
                [events.server_create_room_ok, this.server_create_room_ok],
                [events.server_receive_ready, this.server_receive_ready],
                [events.server_game_start, this.server_game_start],
                [events.server_table_fa_pai, this.server_table_fa_pai]
            ]

        }
        private server_table_fa_pai(server_message){
            console.log(server_message.data);
            
        }
        private server_game_start(server_message) {
            console.log(server_message.data);
            
          
        }
        public openHandler(event: any = null): void {
            //正确建立连接；
        }
        //看来这儿会成为新的调度口了，根据发过来的消息进行各种处理，暂时感觉这样也OK，不过那种socketio的on办法也实在是方便啊。
        public receiveHandler(msg: any = null): void {
            ///接收到数据触发函数
            let server_message = JSON.parse(msg);
            for (let index = 0; index < this.eventsHandler.length; index++) {
                const element = this.eventsHandler[index];
                if (server_message.type == element[0]) {
                    element[1].call(this, server_message)
                    return;
                }
            }
            console.log("未知消息:", server_message);

        }
        private server_receive_ready(server_message) {
            console.log(`${server_message.username}玩家已经准备好游戏`);

        }
        private server_welcome(server_message: any) {
            console.log("welcome:", server_message.welcome);
        }
        private server_login(server_message: any) {
            let { username, user_id } = server_message;
            console.log("登录成功, 用户名：%s, 用户id: %s", username, user_id);
            Laya.god_player.username = username;
            Laya.god_player.user_id = user_id;
            //进入主界面！
            let home = new scene.MainScene(username, user_id);
            Laya.stage.destroyChildren();
            Laya.stage.addChild(home);
        }

        private server_create_room_ok(server_message: any) {
            console.log(`成功创建房间:${server_message.room_id}`);
            this.open_room(server_message);
        }

        private open_room(server_message: any) {
            Laya.stage.destroyChildren();
            let { god_player } = Laya;
            let gameTable = new GameTableScene();
            gameTable.roomCheckId.text = "房间号：" + server_message.room_id;
            gameTable.leftGameNums.text = "剩余：" + 99 + "盘"; //todo: 本局剩下盘数
            //一开始其它人头像不显示
            gameTable.userHead0.visible = false;
            gameTable.userHead1.visible = false;
            gameTable.userHead2.visible = false;
            //所有人的手牌是不显示的，其它人还没有加入进来！要等所有人开始游戏才行！
            gameTable.shouPai0.visible = false;
            gameTable.shouPai1.visible = false;
            gameTable.shouPai2.visible = false;
            gameTable.shouPai3.visible = false;
            //打出的牌不显示
            gameTable.out0.visible = false;
            gameTable.out1.visible = false;
            gameTable.out2.visible = false;
            gameTable.out3.visible = false;
            //剩余张数不显示
            gameTable.leftPaiCountSprite.visible = false;
            //解散房间不显示
            gameTable.waitSprite.visible = false;
            //当前打牌不显示
            gameTable.movieSprite.visible = false;
            //听牌不显示
            gameTable.tingPaiSprite.visible = false;
            gameTable.userHeadOffline3.visible = false;
            gameTable.userName3.text = god_player.username;
            gameTable.userId3.text = god_player.user_id;
            gameTable.zhuang3.visible = true; //todo: 应该有一个扔骰子选庄的过程，测试阶段创建房间人就是庄
            gameTable.gold3.text = "888"; //todo: 用户的积分需要数据库配合
            //设置为自动开始
            if (gameTable.isAutoStart.selected) {
                // console.log('本玩家准备好游戏了。。。');
                this.socket.sendmsg({ type: events.client_player_ready })
            }
            Laya.stage.addChild(gameTable);

        }

        private server_other_player_enter_room(server_message: any) {
            let { username, user_id } = server_message;
            console.log(`其它玩家${username}加入房间, id:${user_id}`);
            //添加其它玩家的信息，还得看顺序如何！根据顺序来显示玩家的牌面，服务器里面保存的位置信息，可惜与layabox里面正好是反的！

        }

        private server_player_enter_room(server_message: any) {
            console.log(`本玩家进入房间！`);
            this.open_room(server_message)
        }

        private server_no_such_room() {
            console.log("无此房间号");
            let dialog = new DialogScene("无此房间号", () => {
                dialog.close();
            });
            dialog.popup();
            Laya.stage.addChild(dialog);
        }

        private server_room_full() {
            let dialog = new DialogScene("服务器房间已满！", () => {
                dialog.close();
            });
            dialog.popup();
            Laya.stage.addChild(dialog);
        }

        private server_no_room() {
            let dialog = new DialogScene("服务器无可用房间！", () => {
                dialog.close();
            });
            dialog.popup();
            Laya.stage.addChild(dialog);
        }

        public closeHandler(e: any = null) {
            //关闭事件
            // console.log('服务器已经关闭，请查看官网说明');
            this.socket.cleanSocket();
            let closeDialogue = new DialogScene("服务器已经关闭，请查看官网说明");
            closeDialogue.popup();
            Laya.stage.addChild(closeDialogue);
        }
        public errorHandler(e: any = null) {
            //连接出错
            let dialog = new DialogScene(`连接出错！${e}`);
            dialog.popup();
            Laya.stage.addChild(dialog);
        }
    }
}
