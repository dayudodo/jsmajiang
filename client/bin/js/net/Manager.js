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
                ];
            };
            Manager.prototype.server_table_fa_pai = function (server_message) {
                console.log(server_message.data);
            };
            Manager.prototype.server_game_start = function (server_message) {
                console.log(server_message.data);
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
                for (var index = 0; index < this.eventsHandler.length; index++) {
                    var element = this.eventsHandler[index];
                    if (server_message.type == element[0]) {
                        element[1].call(this, server_message);
                        return;
                    }
                }
                console.log("未知消息:", server_message);
            };
            Manager.prototype.server_receive_ready = function (server_message) {
                console.log(server_message.username + "\u73A9\u5BB6\u5DF2\u7ECF\u51C6\u5907\u597D\u6E38\u620F");
            };
            Manager.prototype.server_welcome = function (server_message) {
                console.log("welcome:", server_message.welcome);
            };
            Manager.prototype.server_login = function (server_message) {
                var username = server_message.username, user_id = server_message.user_id;
                console.log("登录成功, 用户名：%s, 用户id: %s", username, user_id);
                Laya.god_player.username = username;
                Laya.god_player.user_id = user_id;
                //进入主界面！
                var home = new mj.scene.MainScene(username, user_id);
                Laya.stage.destroyChildren();
                Laya.stage.addChild(home);
            };
            Manager.prototype.server_create_room_ok = function (server_message) {
                console.log("\u6210\u529F\u521B\u5EFA\u623F\u95F4:" + server_message.room_id);
                this.open_room(server_message);
            };
            Manager.prototype.open_room = function (server_message) {
                Laya.stage.destroyChildren();
                var god_player = Laya.god_player;
                var gameTable = new GameTableScene();
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
                    this.socket.sendmsg({ type: events.client_player_ready });
                }
                Laya.stage.addChild(gameTable);
            };
            Manager.prototype.server_other_player_enter_room = function (server_message) {
                var username = server_message.username, user_id = server_message.user_id;
                console.log("\u5176\u5B83\u73A9\u5BB6" + username + "\u52A0\u5165\u623F\u95F4, id:" + user_id);
                //添加其它玩家的信息，还得看顺序如何！根据顺序来显示玩家的牌面，服务器里面保存的位置信息，可惜与layabox里面正好是反的！
            };
            Manager.prototype.server_player_enter_room = function (server_message) {
                console.log("\u672C\u73A9\u5BB6\u8FDB\u5165\u623F\u95F4\uFF01");
                this.open_room(server_message);
            };
            Manager.prototype.server_no_such_room = function () {
                console.log("无此房间号");
                var dialog = new DialogScene("无此房间号", function () {
                    dialog.close();
                });
                dialog.popup();
                Laya.stage.addChild(dialog);
            };
            Manager.prototype.server_room_full = function () {
                var dialog = new DialogScene("服务器房间已满！", function () {
                    dialog.close();
                });
                dialog.popup();
                Laya.stage.addChild(dialog);
            };
            Manager.prototype.server_no_room = function () {
                var dialog = new DialogScene("服务器无可用房间！", function () {
                    dialog.close();
                });
                dialog.popup();
                Laya.stage.addChild(dialog);
            };
            Manager.prototype.closeHandler = function (e) {
                if (e === void 0) { e = null; }
                //关闭事件
                // console.log('服务器已经关闭，请查看官网说明');
                this.socket.cleanSocket();
                var closeDialogue = new DialogScene("服务器已经关闭，请查看官网说明");
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