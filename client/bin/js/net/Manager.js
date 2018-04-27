var GameTableScene = mj.scene.GameTableScene;
var mj;
(function (mj) {
    var net;
    (function (net) {
        var Manager = /** @class */ (function () {
            function Manager() {
                this.connect();
            }
            Manager.prototype.connect = function () {
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
            };
            Manager.prototype.openHandler = function (event) {
                if (event === void 0) { event = null; }
                //正确建立连接；
            };
            //看来这儿会成为新的调度口了，根据发过来的消息进行各种处理，暂时感觉这样也OK，不过那种socketio的on办法也实在是方便啊。
            Manager.prototype.receiveHandler = function (msg) {
                if (msg === void 0) { msg = null; }
                ///接收到数据触发函数
                var server_message = JSON.parse(msg);
                switch (server_message.type) {
                    case events.server_welcome:
                        console.log('welcome:', server_message.welcome);
                        break;
                    case events.server_login:
                        var username = server_message.username, user_id = server_message.user_id;
                        console.log('登录成功, 用户名：', username);
                        Laya.god_player.username = username;
                        Laya.god_player.user_id = user_id;
                        //进入主界面！
                        var home = new mj.scene.MainScene(username, user_id);
                        Laya.stage.destroyChildren();
                        Laya.stage.addChild(home);
                        break;
                    case events.server_no_room:
                        {
                            var dialog_1 = new DialogScene("服务器无可用房间！", function () { dialog_1.close(); });
                            dialog_1.popup();
                            Laya.stage.addChild(dialog_1);
                        }
                        break;
                    case events.server_room_full:
                        {
                            var dialog_2 = new DialogScene("服务器房间已满！", function () { dialog_2.close(); });
                            dialog_2.popup();
                            Laya.stage.addChild(dialog_2);
                        }
                        break;
                    case events.server_no_such_room:
                        {
                            console.log('无此房间号');
                            var dialog_3 = new DialogScene("无此房间号", function () { dialog_3.close(); });
                            dialog_3.popup();
                            Laya.stage.addChild(dialog_3);
                        }
                        break;
                    case events.server_player_enter_room:
                        {
                            console.log(server_message.username + "\u73A9\u5BB6\u8FDB\u5165\u623F\u95F4\uFF01");
                        }
                        break;
                    case events.server_join_room_ok:
                        //进入游戏界面，已经成功创建房间
                        console.log("\u6210\u529F\u521B\u5EFA\u623F\u95F4:" + server_message.room_name);
                        Laya.stage.destroyChildren();
                        var gameTable = new GameTableScene();
                        Laya.stage.addChild(gameTable);
                        break;
                    default:
                        console.log('server info:', server_message.info);
                        break;
                }
            };
            Manager.prototype.closeHandler = function (e) {
                if (e === void 0) { e = null; }
                //关闭事件
                // console.log('服务器已经关闭，请查看官网说明');
                this.socket.cleanSocket();
                var closeDialogue = new DialogScene('服务器已经关闭，请查看官网说明');
                closeDialogue.popup();
                Laya.stage.addChild(closeDialogue);
            };
            Manager.prototype.errorHandler = function (e) {
                if (e === void 0) { e = null; }
                //连接出错
                var dialog = new DialogScene("\u8FDE\u63A5\u51FA\u9519\uFF01" + e);
                dialog.popup();
                Laya.stage.addChild(dialog);
            };
            return Manager;
        }());
        net.Manager = Manager;
    })(net = mj.net || (mj.net = {}));
})(mj || (mj = {}));
//# sourceMappingURL=Manager.js.map