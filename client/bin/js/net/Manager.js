var mj;
(function (mj) {
    var net;
    (function (net) {
        var GameTableScene = mj.scene.GameTableScene;
        var LayaUtils = mj.utils.LayaUtils;
        var DialogScene = mj.scene.DialogScene;
        var OptDialogScene = mj.scene.OptDialogScene;
        var Manager = /** @class */ (function () {
            function Manager() {
                this.connect();
                Laya.manager = this;
            }
            Manager.prototype.connect = function () {
                this.byte = new Laya.Byte();
                //这里我们采用小端
                this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
                this.socket = new Laya.Socket();
                //这里我们采用小端
                this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
                this.socket.on(Laya.Event.OPEN, this, this.openHandler);
                this.socket.on(Laya.Event.MESSAGE, this, this.messageHandler);
                this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
                this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
                //建立连接, 如果想在手机上使用，需要用物理地址，只是浏览器测试，用localhost!
                // this.socket.connectByUrl("ws://192.168.2.200:3333");
                // this.socket.connectByUrl("ws://192.168.2.23:3333");
                this.socket.connectByUrl("ws://localhost:3333");
                this.eventsHandler = [
                    [g_events.server_welcome, this.server_welcome],
                    [g_events.server_login, this.server_login],
                    [g_events.server_no_room, this.server_no_room],
                    [g_events.server_no_such_room, this.server_no_such_room],
                    [g_events.server_other_player_enter_room, this.server_other_player_enter_room],
                    [g_events.server_player_enter_room, this.server_player_enter_room],
                    [g_events.server_room_full, this.server_room_full],
                    // [events.server_create_room_ok, this.server_create_room_ok],
                    [g_events.server_receive_ready, this.server_receive_ready],
                    [g_events.server_game_start, this.server_game_start],
                    [g_events.server_gameover, this.server_gameover],
                    [g_events.server_table_fa_pai_other, this.server_table_fa_pai_other],
                    [g_events.server_table_fa_pai, this.server_table_fa_pai],
                    [g_events.server_dapai, this.server_dapai],
                    [g_events.server_dapai_other, this.server_dapai_other],
                    [g_events.server_can_select, this.server_can_select],
                    [g_events.server_peng, this.server_peng],
                    [g_events.server_mingGang, this.server_mingGang],
                    [g_events.server_liang, this.server_liang],
                    [g_events.server_winner, this.server_winner],
                    [g_events.server_can_dapai, this.server_can_dapai],
                ];
            };
            /**服务器发送winner消息，准备开始下一局！ */
            Manager.prototype.server_winner = function (server_message) {
                // console.log(server_message);
                //todo: 结算界面,显示所有的结果，三种情况，胜利、失败、流局
                this.gameTable.show_allResults(server_message.players);
            };
            /**服务器确认god_player可以打牌了，并不需要啥数据，只是个消息通知 */
            Manager.prototype.server_can_dapai = function (server_message) {
                Laya.god_player.can_dapai = true;
            };
            Manager.prototype.server_liang = function (server_message) {
                console.log("server_liang:", server_message);
                var gameTable = Laya.gameTable;
                var liangPlayer = server_message.liangPlayer;
                //更新本地player数据
                var localPlayer = Laya.room.players.find(function (p) { return p.user_id == liangPlayer.user_id; });
                localPlayer.cloneValuesFrom(liangPlayer);
                console.log("localPlayer:", localPlayer);
                //更新UI中的显示
                gameTable.show_group_shoupai(localPlayer);
                gameTable.show_out(localPlayer);
                //用户亮牌并不需要改变显示方向
            };
            Manager.prototype.server_mingGang = function (server_message) {
                // console.log(server_message)
                // return;
                //哪个人碰了牌，就更新那个人的手牌和打牌
                // let { player } = server_message
                var gameTable = Laya.gameTable;
                var players = server_message.players, gangPlayer_user_id = server_message.gangPlayer_user_id;
                //更新本地player数据
                players.forEach(function (person) {
                    var localPlayer = Laya.room.players.find(function (p) { return p.user_id == person.user_id; });
                    localPlayer.cloneValuesFrom(person);
                });
                var gangPlayer = Laya.room.players.find(function (p) { return p.user_id == gangPlayer_user_id; });
                // console.log(Laya.room.players)
                //更新UI中的显示
                gameTable.show_group_shoupai(Laya.god_player);
                gameTable.show_out(Laya.god_player);
                gameTable.show_group_shoupai(Laya.room.left_player);
                gameTable.show_out(Laya.room.left_player);
                gameTable.show_group_shoupai(Laya.room.right_player);
                gameTable.show_out(Laya.room.right_player);
                //重新计时并改变方向
                gameTable.show_count_down(gangPlayer);
            };
            /** 其他人碰了牌 */
            Manager.prototype.server_peng = function (server_message) {
                // console.log(server_message)
                // return;
                //哪个人碰了牌，就更新那个人的手牌和打牌
                var gameTable = Laya.gameTable;
                var players = server_message.players, pengPlayer_user_id = server_message.pengPlayer_user_id;
                //更新本地player数据
                players.forEach(function (person) {
                    var localPlayer = Laya.room.players.find(function (p) { return p.user_id == person.user_id; });
                    localPlayer.cloneValuesFrom(person);
                });
                var pengPlayer = Laya.room.players.find(function (p) { return p.user_id == pengPlayer_user_id; });
                // console.log(Laya.room.players)
                //更新UI中的显示
                gameTable.show_group_shoupai(Laya.god_player);
                gameTable.show_out(Laya.god_player);
                gameTable.show_group_shoupai(Laya.room.left_player);
                gameTable.show_out(Laya.room.left_player);
                gameTable.show_group_shoupai(Laya.room.right_player);
                gameTable.show_out(Laya.room.right_player);
                //重新计时并改变方向
                gameTable.show_count_down(pengPlayer);
            };
            Manager.prototype.server_can_select = function (server_message) {
                var _a = server_message.select_opt, isShowHu = _a[0], isShowLiang = _a[1], isShowGang = _a[2], isShowPeng = _a[3];
                var canHidePais = server_message.canHidePais;
                this.opt = new OptDialogScene(canHidePais);
                this.opt.showPlayerSelect({
                    isShowHu: isShowHu,
                    isShowLiang: isShowLiang,
                    isShowGang: isShowGang,
                    isShowPeng: isShowPeng
                });
                laya.ui.Dialog.manager.maskLayer.alpha = 0; //全透明，但是不能点击其它地方，只能选择可选操作，杠、胡等
                // this.gameTable.addChild(this.opt);
                this.opt.popup();
            };
            Manager.prototype.server_gameover = function (server_message) {
                console.log("server_gameover");
            };
            Manager.prototype.server_dapai_other = function (server_message) {
                var username = server_message.username, user_id = server_message.user_id, pai_name = server_message.pai_name;
                console.log(username + ", id: " + user_id + " \u6253\u724C" + pai_name);
                var dapaiPlayer = Laya.room.players.find(function (p) { return p.user_id == user_id; });
                //记录下打牌玩家
                Laya.room.dapai_player = dapaiPlayer;
                //还要记录下其它玩家打过啥牌，以便有人碰杠的话删除之
                dapaiPlayer.received_pai = pai_name;
                dapaiPlayer.da_pai(pai_name);
                //牌打出去之后才能显示出来！
                this.gameTable.show_out(dapaiPlayer);
                //还要显示出打牌的大张
                this.gameTable.show_dapai(dapaiPlayer, pai_name);
            };
            Manager.prototype.server_dapai = function (server_message) {
                var pai_name = server_message.pai_name;
                this.gameTable.show_dapai(Laya.god_player, pai_name);
                console.log("\u670D\u52A1\u5668\u786E\u8BA4\u4F60\u5DF2\u6253\u724C " + pai_name);
            };
            Manager.prototype.server_table_fa_pai_other = function (server_message) {
                var user_id = server_message.user_id;
                var player = Laya.room.players.find(function (p) { return p.user_id == user_id; });
                console.log("\u670D\u52A1\u5668\u7ED9\u73A9\u5BB6" + player.username + "\u53D1\u4E86\u5F20\u724C");
                //无清掉所有的计时，再开始新的！
                this.gameTable.show_count_down(player);
            };
            Manager.prototype.server_table_fa_pai = function (server_message) {
                //服务器发牌，感觉这张牌还是应该单独计算吧，都放在手牌里面想要显示是有问题的。
                // console.log(server_message.pai);
                var pai = server_message.pai;
                Laya.god_player.received_pai = pai;
                //显示服务器发过来的牌
                this.gameTable.show_fapai(pai);
            };
            Manager.prototype.server_game_start = function (server_message) {
                // console.log(server_message);
                // return
                var gameTable = this.gameTable;
                //游戏开始了
                //测试下显示牌面的效果，还需要转换一下要显示的东西，服务器发过来的是自己的b2,b3，而ui里面名称则不相同。又得写个表了！
                //客户端也需要保存好当前的牌，以便下一步处理
                Laya.god_player.group_shou_pai = server_message.god_player.group_shou_pai;
                //把group保存到两边玩家的手牌之中。
                var leftPlayer = Laya.room.left_player;
                leftPlayer.group_shou_pai = server_message.left_player.group_shou_pai;
                var rightPlayer = Laya.room.right_player;
                rightPlayer.group_shou_pai = server_message.right_player.group_shou_pai;
                // console.log(server_message);
                gameTable.show_group_shoupai(Laya.god_player);
                gameTable.show_group_shoupai(leftPlayer);
                gameTable.show_group_shoupai(rightPlayer);
            };
            Manager.prototype.openHandler = function (event) {
                if (event === void 0) { event = null; }
                //正确建立连接；
                Laya.socket = this.socket;
            };
            //看来这儿会成为新的调度口了，根据发过来的消息进行各种处理，暂时感觉这样也OK，不过那种socketio的on办法也实在是方便啊。
            // 其实就算是socketio也能使用查表的办法来写，代码还更具有通用性！
            Manager.prototype.messageHandler = function (msg) {
                if (msg === void 0) { msg = null; }
                ///接收到数据触发函数
                var server_message = JSON.parse(msg);
                var canRun_item = this.eventsHandler.find(function (item) { return server_message.type == item[0]; });
                if (canRun_item) {
                    canRun_item[1].call(this, server_message);
                    return;
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
                var username = server_message.username, user_id = server_message.user_id, score = server_message.score;
                console.log("登录成功, 用户名：%s, 用户id: %s, 积分：%s", username, user_id, score);
                Laya.god_player.username = username;
                Laya.god_player.user_id = user_id;
                Laya.god_player.score = score;
                //进入主界面！
                var home = new mj.scene.MainScene(username, user_id);
                Laya.stage.destroyChildren();
                Laya.stage.addChild(home);
            };
            /** 用户创建房间、加入房间后打开gameTable */
            Manager.prototype.open_gameTable = function (server_message) {
                Laya.stage.destroyChildren();
                // let { seat_index, east} = server_message
                //在最需要的时候才去创建对象，比类都还没有实例时创建问题少一些？
                this.gameTable = new GameTableScene();
                var gameTable = this.gameTable;
                Laya.gameTable = gameTable; //给出一个访问的地方，便于调试
                //其它的username, user_id在用户加入房间的时候就已经有了。
                gameTable.hidePlayer(0);
                gameTable.hidePlayer(1);
                gameTable.hidePlayer(2);
                gameTable.hidePlayer(3); //自己的也要先隐藏起来，再显示出需要显示的
                gameTable.userName3.text = Laya.god_player.username;
                gameTable.userId3.text = Laya.god_player.user_id;
                gameTable.zhuang3.visible = Laya.god_player.east; //todo: 应该有一个扔骰子选庄的过程，测试阶段创建房间人就是庄
                gameTable.score3.text = Laya.god_player.score.toString(); //todo: 用户的积分需要数据库配合
                gameTable.userHead3.visible = true;
                // var res: any = Laya.loader.getRes("res/atlas/ui/majiang.json");
                //让按钮有点儿点击的效果！
                LayaUtils.handlerButton(gameTable.settingBtn);
                LayaUtils.handlerButton(gameTable.gameInfoBtn);
                gameTable.roomCheckId.text = "房间号：" + server_message.room_id;
                gameTable.leftGameNums.text = "剩余：" + 99 + "盘"; //todo: 本局剩下盘数
                //剩余张数不显示
                gameTable.leftPaiCountSprite.visible = false;
                //解散房间不显示
                gameTable.waitSprite.visible = false;
                //当前大打牌不显示
                //首先隐藏所有的daPaiSprite
                gameTable.daPaiSprite.visible = true;
                gameTable.daPai0.visible = false;
                gameTable.daPai1.visible = false;
                gameTable.daPai2.visible = false;
                gameTable.daPai3.visible = false;
                //听牌不显示
                gameTable.tingPaiSprite.visible = false;
                gameTable.userHeadOffline3.visible = false;
                //胡口不显示
                gameTable.lb_hukou.visible = false;
                //设置为自动开始
                if (gameTable.isAutoStart.selected) {
                    // console.log('本玩家准备好游戏了。。。');
                    this.socket.sendmsg({ type: g_events.client_player_ready });
                }
                var leftPlayer = Laya.room.left_player;
                // console.log('leftPlayer:', leftPlayer);
                if (leftPlayer) {
                    //显示左玩家的信息
                    gameTable.showHead(gameTable, leftPlayer);
                }
                var rightPlayer = Laya.room.right_player;
                // console.log('rightPlayer:', rightPlayer);
                if (rightPlayer) {
                    //显示右玩家的信息
                    gameTable.showHead(gameTable, rightPlayer);
                }
                //for test
                // Laya.god_player.ui_index = 2
                // Laya.god_player.group_shou_pai = {
                //   // anGang: ["zh"],
                //   anGang: [],
                //   // anGangCount: 0,
                //   mingGang: ["fa"],
                //   peng: [],
                //   selfPeng: [],
                //   // selfPengCount: 1,
                //   shouPai: "t1 t1 t1 b1 b1 b1 b2 b3 t4".split(" ")
                //   // shouPai: [],
                //   // shouPaiCount: 4
                // }
                // gameTable.winnerScene = new WinnerScene()
                // gameTable.winnerScene.show_resultOf(Laya.god_player, "屁胡 清一色")
                // gameTable.addChild(gameTable.winnerScene)
                // this.opt = new OptDialogScene(['t1', 'b1'])
                // gameTable.show_group_shoupai(Laya.god_player)
                // this.opt.showPlayerSelect({
                //   isShowHu: false,
                //   isShowLiang: true,
                //   isShowGang: false,
                //   isShowPeng: false
                // });
                // this.opt.popup()
                //end test
                Laya.stage.addChild(gameTable);
            };
            Manager.prototype.server_other_player_enter_room = function (server_message) {
                var username = server_message.username, user_id = server_message.user_id, seat_index = server_message.seat_index, score = server_message.score;
                //添加其它玩家的信息，还得看顺序如何！根据顺序来显示玩家的牌面，服务器里面保存的位置信息，可惜与layabox里面正好是反的！
                //先看这个玩家是否已经进入过，如果进入过，说明是断线的。
                //不可能有一个玩家进入两次房间，除非是掉线。
                console.log("\u5176\u5B83\u73A9\u5BB6" + username + "\u52A0\u5165\u623F\u95F4, id:" + user_id + ", seat_index:" + seat_index);
                var player = new Player();
                player.username = username;
                player.user_id = user_id;
                player.seat_index = seat_index;
                player.score = score;
                Laya.room.players.push(player);
                var gameTable = this.gameTable;
                //只需要更新其它两个玩家的头像信息，自己的已经显示好了。
                // let otherPlayers = Laya.room.other_players(Laya.god_player)
                // console.log(otherPlayers);
                //todo: 没效率，粗暴的刷新用户头像数据
                var leftPlayer = Laya.room.left_player;
                console.log("leftPlayer:", leftPlayer);
                if (leftPlayer) {
                    //显示左玩家的信息
                    this.gameTable.showHead(gameTable, leftPlayer);
                }
                var rightPlayer = Laya.room.right_player;
                console.log("rightPlayer:", rightPlayer);
                if (rightPlayer) {
                    //显示右玩家的信息
                    this.gameTable.showHead(gameTable, rightPlayer);
                }
            };
            //玩家成功加入房间
            Manager.prototype.server_player_enter_room = function (server_message) {
                var room_id = server_message.room_id, username = server_message.username, user_id = server_message.user_id, east = server_message.east, seat_index = server_message.seat_index, other_players_info = server_message.other_players_info;
                console.log(username + "\u73A9\u5BB6\u8FDB\u5165\u623F\u95F4" + room_id + ", seat_index:" + seat_index);
                //其实这时候就可以使用room来保存玩家信息了，以后只需要用户来个id以及数据就能够更新显示了。
                Laya.god_player.seat_index = seat_index;
                Laya.god_player.east = east;
                other_players_info.forEach(function (person) {
                    var player = new Player();
                    player.username = person.username;
                    player.user_id = person.user_id;
                    player.seat_index = person.seat_index;
                    player.east = person.east;
                    player.score = person.score;
                    Laya.room.players.push(player);
                });
                //玩家进入房间后开始初始化gameTableScene并成为全局变量Laya.gameTable
                this.open_gameTable(server_message);
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
                var closeDialogue = new DialogScene("连接已经关闭，请联系系统管理员");
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