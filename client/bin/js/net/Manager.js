var mj;
(function (mj) {
    var net;
    (function (net) {
        var GameTableScene = mj.scene.GameTableScene;
        var PaiConverter = mj.utils.PaiConvertor;
        var LayaUtils = mj.utils.LayaUtils;
        var DialogScene = mj.scene.DialogScene;
        var OptDialogScene = mj.scene.OptDialogScene;
        var Manager = /** @class */ (function () {
            function Manager() {
                /** 方向指向自己的手牌数组，还能添加服务器的发牌 */
                this.clonePaiSpriteArray = [];
                this.offsetY = 40;
                this.offsetX = 10;
                this.prevSelectedPai = null;
                /**是否在计时结束后自动打牌，测试时使用 */
                this.auto_dapai = false;
                this.waitTime = config.MAX_WAIT_TIME;
                // 是否隐藏了打牌所在区域sprite
                this.isFirstHideOut0 = true;
                this.isFirstHideOut1 = true;
                this.isFirstHideOut2 = true;
                this.isFirstHideOut3 = true;
                this.connect();
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
                ];
            };
            Manager.prototype.server_winner = function (server_message) {
                console.log(server_message);
            };
            Manager.prototype.server_liang = function (server_message) {
                // console.log(server_message);
                var liangPlayer = server_message.liangPlayer;
                //更新本地player数据
                var localPlayer = Laya.room.players.find(function (p) { return p.user_id == liangPlayer.user_id; });
                localPlayer.cloneValuesFrom(liangPlayer);
                //更新UI中的显示
                this.show_group_shoupai(localPlayer);
                this.show_out(localPlayer);
                //用户亮牌并不需要改变显示方向
            };
            Manager.prototype.server_mingGang = function (server_message) {
                // console.log(server_message)
                // return;
                //哪个人碰了牌，就更新那个人的手牌和打牌
                // let { player } = server_message
                var players = server_message.players, gangPlayer_user_id = server_message.gangPlayer_user_id;
                //更新本地player数据
                players.forEach(function (person) {
                    var localPlayer = Laya.room.players.find(function (p) { return p.user_id == person.user_id; });
                    localPlayer.cloneValuesFrom(person);
                });
                var gangPlayer = Laya.room.players.find(function (p) { return p.user_id == gangPlayer_user_id; });
                // console.log(Laya.room.players)
                //更新UI中的显示
                this.show_group_shoupai(Laya.god_player);
                this.show_out(Laya.god_player);
                this.show_group_shoupai(Laya.room.left_player);
                this.show_out(Laya.room.left_player);
                this.show_group_shoupai(Laya.room.right_player);
                this.show_out(Laya.room.right_player);
                //重新计时并改变方向
                this.show_count_down(gangPlayer);
            };
            /**UI上显示出玩家的group手牌！ */
            Manager.prototype.show_group_shoupai = function (player) {
                var _this = this;
                //先清除以前显示过的group_shou_pai
                player.ui_clone_arr.forEach(function (clone) {
                    var cloneSpirte = clone;
                    cloneSpirte.destroy();
                });
                player.ui_clone_arr = [];
                //起始的索引也要重新开始！
                player.shouPai_start_index = 0;
                var groupShou = player.group_shou_pai;
                var y_one_pai_height = 60; //todo: 应该改成获取其中一个牌的高度！
                var x_one_pai_width = this.gameTable.shou3.width;
                if (groupShou.anGang.length > 0) {
                    //显示暗杠
                    groupShou.anGang.forEach(function (anGangPai) {
                        var cloneanGangSprite = LayaUtils.clone(_this.gameTable["anGang" + player.ui_index]);
                        //暗杠特殊的是只需要显示一张牌
                        var imgSprite = cloneanGangSprite._childs[3];
                        imgSprite.getChildAt(0).skin = (player.ui_index == 3 ? PaiConverter.skinOfZheng(anGangPai) : PaiConverter.skinOfCe(anGangPai));
                        if (player.ui_index == 3) {
                            cloneanGangSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            cloneanGangSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        cloneanGangSprite.visible = true;
                        cloneanGangSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this.gameTable["shouPai" + player.ui_index].addChild(cloneanGangSprite);
                        player.ui_clone_arr.push(cloneanGangSprite);
                        //只需要移动3位即可，因为暗杠其实点位也只有3张牌！
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
                else {
                    /**有几组暗杠，就显示几组背面，背面图UI中已经有就不再需要赋值了 */
                    for (var i = 0; i < groupShou.anGangCount; i++) {
                        var cloneanGangHideSprite = LayaUtils.clone(this.gameTable["anGangHide" + player.ui_index]);
                        //有anGangCount的肯定就是左右玩家了，不可能会是god player!
                        cloneanGangHideSprite.y = player.shouPai_start_index * y_one_pai_height;
                        cloneanGangHideSprite.visible = true;
                        cloneanGangHideSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        this.gameTable["shouPai" + player.ui_index].addChild(cloneanGangHideSprite);
                        player.ui_clone_arr.push(cloneanGangHideSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    }
                }
                if (groupShou.mingGang.length > 0) {
                    //显示明杠
                    groupShou.mingGang.forEach(function (mingGangPai) {
                        var clonemingGangSprite = LayaUtils.clone(_this.gameTable["mingGang" + player.ui_index]);
                        for (var i = 0; i < clonemingGangSprite.numChildren; i++) {
                            var imgSprite = clonemingGangSprite._childs[i];
                            imgSprite.getChildAt(0).skin = (player.ui_index == 3 ? PaiConverter.skinOfZheng(mingGangPai) : PaiConverter.skinOfCe(mingGangPai));
                        }
                        if (player.ui_index == 3) {
                            clonemingGangSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            clonemingGangSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        clonemingGangSprite.visible = true;
                        clonemingGangSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this.gameTable["shouPai" + player.ui_index].addChild(clonemingGangSprite);
                        player.ui_clone_arr.push(clonemingGangSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
                if (groupShou.peng.length > 0) {
                    //显示碰
                    groupShou.peng.forEach(function (pengPai) {
                        var clonePengSprite = LayaUtils.clone(_this.gameTable["peng" + player.ui_index]);
                        for (var i = 0; i < clonePengSprite.numChildren; i++) {
                            var imgSprite = clonePengSprite._childs[i];
                            imgSprite.getChildAt(0).skin = (player.ui_index == 3 ? PaiConverter.skinOfZheng(pengPai) : PaiConverter.skinOfCe(pengPai));
                        }
                        if (player.ui_index == 3) {
                            clonePengSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            clonePengSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        clonePengSprite.visible = true;
                        clonePengSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this.gameTable["shouPai" + player.ui_index].addChild(clonePengSprite);
                        player.ui_clone_arr.push(clonePengSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
                //显示剩下的shouPai, 如果为空，补齐成空牌！
                if (player.ui_index == 3) {
                    this.show_god_player_shoupai(player);
                }
                else {
                    this.show_side_player_shoupai(player);
                }
            };
            /** 其他人碰了牌 */
            Manager.prototype.server_peng = function (server_message) {
                // console.log(server_message)
                // return;
                //哪个人碰了牌，就更新那个人的手牌和打牌
                // let { player } = server_message
                var players = server_message.players, pengPlayer_user_id = server_message.pengPlayer_user_id;
                //更新本地player数据
                players.forEach(function (person) {
                    var localPlayer = Laya.room.players.find(function (p) { return p.user_id == person.user_id; });
                    localPlayer.cloneValuesFrom(person);
                });
                var pengPlayer = Laya.room.players.find(function (p) { return p.user_id == pengPlayer_user_id; });
                // console.log(Laya.room.players)
                //更新UI中的显示
                this.show_group_shoupai(Laya.god_player);
                this.show_out(Laya.god_player);
                this.show_group_shoupai(Laya.room.left_player);
                this.show_out(Laya.room.left_player);
                this.show_group_shoupai(Laya.room.right_player);
                this.show_out(Laya.room.right_player);
                //重新计时并改变方向
                this.show_count_down(pengPlayer);
            };
            Manager.prototype.server_can_select = function (server_message) {
                var _a = server_message.select_opt, isShowHu = _a[0], isShowLiang = _a[1], isShowGang = _a[2], isShowPeng = _a[3];
                var opt = new OptDialogScene();
                opt.showPlayerSelect({ isShowHu: isShowHu, isShowLiang: isShowLiang, isShowGang: isShowGang, isShowPeng: isShowPeng });
                laya.ui.Dialog.manager.maskLayer.alpha = 0; //全透明，但是不能点击其它地方，只能选择可选操作，杠、胡等
                this.gameTable.addChild(opt);
                opt.popup();
            };
            Manager.prototype.server_gameover = function (server_message) {
                console.log('server_gameover');
            };
            Manager.prototype.server_dapai_other = function (server_message) {
                var username = server_message.username, user_id = server_message.user_id, pai_name = server_message.pai_name;
                console.log(username + ", id: " + user_id + " \u6253\u724C" + pai_name);
                var player = Laya.room.players.find(function (p) { return p.user_id == user_id; });
                //记录下打牌玩家
                Laya.room.dapai_player = player;
                //还要记录下其它玩家打过啥牌，以便有人碰杠的话删除之
                player.received_pai = pai_name;
                player.da_pai(pai_name);
                //牌打出去之后才能显示出来！
                this.show_out(player);
            };
            Manager.prototype.server_dapai = function (server_message) {
                var pai_name = server_message.pai_name;
                console.log("\u670D\u52A1\u5668\u786E\u8BA4\u4F60\u5DF2\u6253\u724C " + pai_name);
            };
            /**显示当前index的方向三角形，UI中的三角形以direction开头 */
            Manager.prototype.show_direction = function (index) {
                if (index === void 0) { index = config.GOD_INDEX; }
                this.gameTable.clock.visible = true;
                this.gameTable["direction" + index].visible = true;
            };
            /**
             * 开始显示倒计时，包括显示方向的调用
             * @param player
             * @param reset 是否重新计时
             */
            Manager.prototype.show_count_down = function (player, reset) {
                var _this = this;
                if (reset === void 0) { reset = true; }
                if (reset) {
                    clearInterval(this.countdownOneSecond);
                    this.waitTime = config.MAX_WAIT_TIME;
                }
                console.log(player.username + "\u5F00\u59CB\u5012\u8BA1\u65F6");
                //先隐藏所有，因为不知道上一次到底显示的是哪个
                Laya.room.players.forEach(function (p) {
                    _this.hideDirection(p);
                });
                this.show_direction(player.ui_index);
                //todo: replace this.gameTable.Num0.skin 
                this.gameTable.showSkinOfCountDown(config.MAX_WAIT_TIME);
                this.countdownOneSecond = setInterval(function () {
                    _this.waitTime--;
                    _this.gameTable.showSkinOfCountDown(_this.waitTime);
                    if (0 == _this.waitTime) {
                        clearInterval(_this.countdownOneSecond);
                        //自动打牌只有本玩家才有的功能，其它玩家显示倒计时仅仅是显示而已。
                        if ((player == Laya.god_player) && _this.auto_dapai) {
                            _this.socket.sendmsg({
                                type: g_events.client_da_pai,
                                pai: Laya.god_player.received_pai
                            });
                        }
                    }
                }, 1000);
            };
            Manager.prototype.server_table_fa_pai_other = function (server_message) {
                var user_id = server_message.user_id;
                var player = Laya.room.players.find(function (p) { return p.user_id == user_id; });
                console.log("\u670D\u52A1\u5668\u7ED9\u73A9\u5BB6" + player.username + "\u53D1\u4E86\u5F20\u724C");
                //无清掉所有的计时，再开始新的！
                this.show_count_down(player);
            };
            Manager.prototype.server_table_fa_pai = function (server_message) {
                var _this = this;
                //服务器发牌，感觉这张牌还是应该单独计算吧，都放在手牌里面想要显示是有问题的。
                // console.log(server_message.pai);
                var pai = server_message.pai;
                Laya.god_player.received_pai = pai;
                var gameTable = this.gameTable;
                //显示服务器发过来的牌
                gameTable.fa3Image.skin = PaiConverter.skinOfShou(pai);
                var newFa3Sprite = LayaUtils.clone(gameTable.fa3);
                newFa3Sprite.visible = true;
                //这张牌也是可以打出去的！与shouPai中的事件处理其实应该是一样的！或者说假装当成是shouPai的一部分？
                newFa3Sprite.on(Laya.Event.CLICK, this, function () {
                    _this.handleClonePaiSpriteClick(newFa3Sprite, [pai], 0, true, 0);
                });
                this.clonePaiSpriteArray.push(newFa3Sprite);
                gameTable.shouPai3.addChild(newFa3Sprite);
                this.show_count_down(Laya.god_player);
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
                this.show_group_shoupai(Laya.god_player);
                this.show_group_shoupai(leftPlayer);
                this.show_group_shoupai(rightPlayer);
            };
            /**显示本玩家的手牌，在位置index处 */
            Manager.prototype.show_god_player_shoupai = function (player) {
                var _this = this;
                //先清除以前的，再显示
                this.destroyAllPaiCloneSprites();
                var _a = this, socket = _a.socket, gameTable = _a.gameTable;
                var group_shou_pai = player.group_shou_pai;
                // let all_pais: Array<string> = shou_pai
                var shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
                var one_shou_pai_width = gameTable.shou3.width;
                var posiX = (one_shou_pai_width * player.shouPai_start_index) + config.X_GAP;
                gameTable.shouPai3.visible = true;
                var _loop_1 = function (index) {
                    var url = shouPai_urls[index];
                    gameTable.skin_shoupai3.skin = "ui/majiang/" + url;
                    gameTable.shou3.x = posiX;
                    var newPaiSprite = LayaUtils.clone(gameTable.shou3);
                    newPaiSprite.visible = true;
                    //为新建的牌sprite创建点击处理函数
                    newPaiSprite.on(Laya.Event.CLICK, this_1, function () {
                        // 如果用户已经打过牌了那么就不能再打，防止出现多次打牌的情况，服务器其实也应该有相应的判断！不然黑死你。
                        // if (Laya.god_player.received_pai) {
                        if (true) {
                            // 如果两次点击同一张牌，应该打出去
                            _this.handleClonePaiSpriteClick(newPaiSprite, group_shou_pai.shouPai, index, false, player.shouPai_start_index);
                        }
                    });
                    this_1.clonePaiSpriteArray.push(newPaiSprite); //通过shouPai3来获取所有生成的牌呢有点儿小麻烦，所以自己保存好！
                    gameTable.shouPai3.addChild(newPaiSprite);
                    posiX += one_shou_pai_width;
                };
                var this_1 = this;
                for (var index = 0; index < shouPai_urls.length; index++) {
                    _loop_1(index);
                }
            };
            Manager.prototype.hideDirection = function (player) {
                this.gameTable["direction" + player.ui_index].visible = false;
            };
            Manager.prototype.handleClonePaiSpriteClick = function (newPaiSprite, shou_pai, index, is_server_faPai, start_index) {
                if (is_server_faPai === void 0) { is_server_faPai = false; }
                var gameTable = this.gameTable;
                var one_shou_pai_width = gameTable.shou3.width;
                // 如果两次点击同一张牌，应该打出去
                if (this.prevSelectedPai === newPaiSprite) {
                    var daPai = shou_pai[index];
                    console.log("\u7528\u6237\u9009\u62E9\u6253\u724C" + daPai);
                    this.socket.sendmsg({
                        type: g_events.client_da_pai,
                        pai: daPai
                    });
                    Laya.god_player.da_pai(daPai);
                    //不仅这牌要记录要玩家那儿，还要记录在当前房间中！表示这张牌已经可以显示出来了。
                    Laya.room.table_dapai = daPai;
                    this.show_out(Laya.god_player);
                    //牌打出后，界面需要更新的不少，方向需要隐藏掉，以便显示其它，感觉倒计时的可能会一直在，毕竟你打牌，别人打牌都是需要等待的！
                    this.hideDirection(Laya.god_player);
                    // console.log(`打过的牌used_pai:${Laya.god_player.used_pai}`);
                    //todo: 这样写肯定变成了一个递归，内存占用会比较大吧，如何写成真正的纯函数？
                    //打出去之后ui做相应的处理，刷新玩家的手牌，打的牌位置还得还原！
                    newPaiSprite.y += this.offsetY;
                    // this.gameTable.shou3.x = this.clonePaiSpriteArray[0].x; //需要还原下，不然一开始的显示位置就是错的，毕竟这个值在不断的变化！
                    gameTable.shou3.x = (one_shou_pai_width * Laya.god_player.shouPai_start_index) + config.X_GAP; //需要还原下，不然一开始的显示位置就是错的，毕竟这个值在不断的变化！
                    this.destroyAllPaiCloneSprites();
                    this.show_god_player_shoupai(Laya.god_player);
                }
                else {
                    //点击了不同的牌，首先把前一个选择的牌降低，回到原来的位置
                    if (this.prevSelectedPai) {
                        this.prevSelectedPai.y = this.prevSelectedPai.y + this.offsetY;
                    }
                    this.prevSelectedPai = newPaiSprite;
                    newPaiSprite.y = newPaiSprite.y - this.offsetY; //将当前牌提高！
                }
            };
            /**删除掉所有剩余shouPai的复制 */
            Manager.prototype.destroyAllPaiCloneSprites = function () {
                this.clonePaiSpriteArray.forEach(function (item, index) {
                    var changePaiSprite = item;
                    changePaiSprite.destroy(true);
                    //真正的牌面是个Image,而且是二级子！
                    // let changeImg = changePai.getChildAt(0).getChildAt(0) as Image
                    // changeImg.skin =  `ui/majiang/${all_pai_urls[index]}` 
                });
                this.clonePaiSpriteArray = [];
            };
            /** 将打牌显示在ui中的out? Sprite之中 */
            Manager.prototype.show_out = function (player) {
                //所有复制的牌都会在show_..._shou_pai的再次调用中被删除
                var outSprite = this.gameTable["out" + player.ui_index];
                //先隐藏所有内部的图，再去全部重新显示
                for (var index = 0; index < outSprite.numChildren; index++) {
                    var oneLine = outSprite.getChildAt(index);
                    for (var l_index = 0; l_index < oneLine.numChildren; l_index++) {
                        var onePai = oneLine.getChildAt(l_index);
                        onePai.visible = false;
                    }
                }
                // let [line, row] = player.last_out_coordinate
                outSprite.visible = true;
                //直接找到行和列替换成真正的打牌
                player.arr_dapai.forEach(function (dapai, index) {
                    var _a = player.coordinateOf(index), line = _a[0], row = _a[1];
                    var lastValidSprite = outSprite.getChildAt(line).getChildAt(row);
                    var paiImgSprite = lastValidSprite.getChildAt(0);
                    if (player.ui_index == 3) {
                        paiImgSprite.skin = PaiConverter.skinOfZheng(dapai);
                    }
                    else {
                        paiImgSprite.skin = PaiConverter.skinOfCe(dapai);
                    }
                    lastValidSprite.visible = true;
                });
            };
            Manager.prototype.show_side_player_shoupai = function (player) {
                var group_shou_pai = player.group_shou_pai;
                var gameTable = this.gameTable;
                gameTable["shouPai" + player.ui_index].visible = true;
                var cePaiHeight = 60; //应该是内部牌的高度，外部的话还有边，按说应该换成真正牌图形的高度
                //手牌显示的起码坐标Y
                var start_posiY = (cePaiHeight * player.shouPai_start_index) + config.Y_GAP;
                var show_oneShou = function (url, posiY) {
                    gameTable["testImageShoupai" + player.ui_index].skin = url;
                    gameTable["test_shoupai" + player.ui_index].y = posiY;
                    var newPai = LayaUtils.clone(gameTable["test_shoupai" + player.ui_index]);
                    newPai.visible = true;
                    gameTable["shouPai" + player.ui_index].addChild(newPai);
                    player.ui_clone_arr.push(newPai);
                };
                //如果有值，就显示此牌，没有值就显示空的。
                if (group_shou_pai.shouPai.length > 0) {
                    for (var index = 0; index < group_shou_pai.shouPai.length; index++) {
                        var url = PaiConverter.skinOfCe(group_shou_pai.shouPai[index]);
                        show_oneShou(url, start_posiY);
                        start_posiY += cePaiHeight;
                    }
                }
                else { //只显示背景！
                    for (var index = 0; index < group_shou_pai.shouPaiCount; index++) {
                        show_oneShou(config.BACK_URL, start_posiY);
                        start_posiY += cePaiHeight;
                    }
                }
            };
            Manager.prototype.openHandler = function (event) {
                if (event === void 0) { event = null; }
                //正确建立连接；
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
            Manager.prototype.hidePlayer = function (index) {
                var gameTable = this.gameTable;
                // 头像不显示
                gameTable["userHead" + index].visible = false;
                // 手牌内部是不显示的, 但是手牌本身需要显示
                gameTable["shouPai" + index].visible = true;
                //隐藏里面的牌，需要的时候才会显示出来, 比如fa会显示服务器发过来的牌，如果shouPai隐藏了那么fa就不会再显示！
                gameTable["peng" + index].visible = false;
                gameTable["anGangHide" + index].visible = false;
                gameTable["mingGang" + index].visible = false;
                gameTable["anGang" + index].visible = false;
                gameTable["shou" + index].visible = false;
                gameTable["fa" + index].visible = false;
                //打过的牌暂不显示
                gameTable["out" + index].visible = false;
                // 用户离线状态不显示
                gameTable["userHeadOffline" + index].visible = false;
                this.gameTable.clock.visible = false;
                this.gameTable.direction0.visible = false;
                this.gameTable.direction1.visible = false;
                this.gameTable.direction2.visible = false;
                this.gameTable.direction3.visible = false;
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
                this.hidePlayer(0);
                this.hidePlayer(1);
                this.hidePlayer(2);
                this.hidePlayer(3); //自己的也要先隐藏起来，再显示出需要显示的
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
                //当前打牌不显示
                gameTable.movieSprite.visible = false;
                //听牌不显示
                gameTable.tingPaiSprite.visible = false;
                gameTable.userHeadOffline3.visible = false;
                //设置为自动开始
                if (gameTable.isAutoStart.selected) {
                    // console.log('本玩家准备好游戏了。。。');
                    this.socket.sendmsg({ type: g_events.client_player_ready });
                }
                var leftPlayer = Laya.room.left_player;
                // console.log('leftPlayer:', leftPlayer);
                if (leftPlayer) {
                    //显示左玩家的信息
                    this.showHead(gameTable, leftPlayer);
                }
                var rightPlayer = Laya.room.right_player;
                // console.log('rightPlayer:', rightPlayer);
                if (rightPlayer) {
                    //显示右玩家的信息
                    this.showHead(gameTable, rightPlayer);
                }
                //for test
                // Laya.god_player.ui_index = 0
                // Laya.god_player.group_shou_pai = {
                //     // anGang: ["zh"],
                //     anGang: [],
                //     anGangCount: 1,
                //     mingGang: ["fa", "zh"],
                //     peng: ["di"],
                //     shouPai: "b1 b2 b3 t4".split(" ")
                //     // shouPai: [],
                //     // shouPaiCount: 4
                // }
                // this.show_group_shoupai(Laya.god_player)
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
                console.log('leftPlayer:', leftPlayer);
                if (leftPlayer) {
                    //显示左玩家的信息
                    this.showHead(gameTable, leftPlayer);
                }
                var rightPlayer = Laya.room.right_player;
                console.log('rightPlayer:', rightPlayer);
                if (rightPlayer) {
                    //显示右玩家的信息
                    this.showHead(gameTable, rightPlayer);
                }
            };
            /**
             * 显示玩家的头像数据，包括用户名,id号,庄家bool，分数值
             * @param gameTable
             * @param p
             * @param index 桌面中用户的序列号，右边的是2，左边的是0，上面的是1（卡五星不用）
             */
            Manager.prototype.showHead = function (gameTable, player) {
                var index = player.ui_index;
                gameTable["userName" + index].text = player.username;
                gameTable["userId" + index].text = player.user_id;
                gameTable["zhuang" + index].visible = player.east;
                gameTable["score" + index].text = player.score.toString(); //todo: 用户的积分需要数据库配合
                gameTable["userHead" + index].visible = true;
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