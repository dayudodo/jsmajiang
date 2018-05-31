var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mj;
(function (mj) {
    var scene;
    (function (scene) {
        var PaiConverter = mj.utils.PaiConverter;
        var LayaUtils = mj.utils.LayaUtils;
        var GameTableScene = /** @class */ (function (_super) {
            __extends(GameTableScene, _super);
            /**是否在计时结束后自动打牌，测试时使用 */
            function GameTableScene() {
                var _this = _super.call(this) || this;
                _this.auto_dapai = false;
                /** 方向指向自己的手牌数组，还能添加服务器的发牌 */
                _this.clonePaiSpriteArray = [];
                /**玩家手牌点击后上下的偏移量 */
                _this.ClickOffsetY = 40;
                _this.prevSelectedPai = null;
                _this.waitTime = config.MAX_WAIT_TIME;
                // 是否隐藏了打牌所在区域sprite
                _this.isFirstHideOut0 = true;
                _this.isFirstHideOut1 = true;
                _this.isFirstHideOut2 = true;
                _this.isFirstHideOut3 = true;
                _this.socket = Laya.socket;
                return _this;
            }
            GameTableScene.prototype.show_winner = function (server_message) {
            };
            GameTableScene.prototype.show_dapai = function (player, pai_name) {
                //首先隐藏所有的dapai
                // this.daPaiSprite.visible = true
                // this.daPai0.visible = false
                // this.daPai1.visible = false
                // this.daPai2.visible = false
                // this.daPai3.visible = false
                var _this = this;
                var whoDaPai = this["daPai" + player.ui_index];
                whoDaPai.getChildAt(0).getChildAt(0).skin = PaiConverter.skinOfZheng(pai_name);
                whoDaPai.visible = true;
                //5秒后消失
                Laya.timer.once(5 * 1000, this, function () {
                    _this["daPai" + player.ui_index].visible = false;
                });
            };
            GameTableScene.prototype.showSkinOfCountDown = function (twonumber) {
                _a = PaiConverter.CountDownNumSkin(twonumber), this.Num1.skin = _a[0], this.Num0.skin = _a[1];
                var _a;
            };
            /**UI上显示出玩家的group手牌！ */
            GameTableScene.prototype.show_group_shoupai = function (player) {
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
                var x_one_pai_width = this.shou3.width;
                this.showAnGang(groupShou, player, x_one_pai_width, y_one_pai_height);
                this.showMingGang(groupShou, player, x_one_pai_width, y_one_pai_height);
                this.showPeng(groupShou, player, x_one_pai_width, y_one_pai_height);
                this.showSelfPeng(groupShou, player, x_one_pai_width, y_one_pai_height);
                //显示剩下的shouPai, 如果为空，补齐成空牌！
                if (player.ui_index == 3) {
                    this.show_god_player_shoupai(player);
                }
                else {
                    this.show_side_player_shoupai(player);
                }
            };
            GameTableScene.prototype.showPeng = function (groupShou, player, x_one_pai_width, y_one_pai_height) {
                var _this = this;
                if (groupShou.peng.length > 0) {
                    //显示碰
                    groupShou.peng.forEach(function (pengPai) {
                        var clonePengSprite = LayaUtils.clone(_this["peng" + player.ui_index]);
                        for (var i = 0; i < clonePengSprite.numChildren; i++) {
                            var imgSprite = clonePengSprite._childs[i];
                            imgSprite.getChildAt(0).skin =
                                player.ui_index == 3
                                    ? PaiConverter.skinOfZheng(pengPai)
                                    : PaiConverter.skinOfCe(pengPai);
                        }
                        if (player.ui_index == 3) {
                            clonePengSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            clonePengSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        clonePengSprite.visible = true;
                        clonePengSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this["shouPai" + player.ui_index].addChild(clonePengSprite);
                        player.ui_clone_arr.push(clonePengSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
            };
            GameTableScene.prototype.showMingGang = function (groupShou, player, x_one_pai_width, y_one_pai_height) {
                var _this = this;
                if (groupShou.mingGang.length > 0) {
                    //显示明杠
                    groupShou.mingGang.forEach(function (mingGangPai) {
                        var clonemingGangSprite = LayaUtils.clone(_this["mingGang" + player.ui_index]);
                        for (var i = 0; i < clonemingGangSprite.numChildren; i++) {
                            var imgSprite = clonemingGangSprite._childs[i];
                            imgSprite.getChildAt(0).skin =
                                player.ui_index == 3
                                    ? PaiConverter.skinOfZheng(mingGangPai)
                                    : PaiConverter.skinOfCe(mingGangPai);
                        }
                        if (player.ui_index == 3) {
                            clonemingGangSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            clonemingGangSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        clonemingGangSprite.visible = true;
                        clonemingGangSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this["shouPai" + player.ui_index].addChild(clonemingGangSprite);
                        player.ui_clone_arr.push(clonemingGangSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
            };
            GameTableScene.prototype.showSelfPeng = function (groupShou, player, x_one_pai_width, y_one_pai_height) {
                var _this = this;
                if (groupShou.selfPeng.length > 0) {
                    //显示自碰牌
                    groupShou.selfPeng.forEach(function (selfPengPai) {
                        var cloneSelfPengSprite = LayaUtils.clone(_this["selfPeng" + player.ui_index]);
                        //自碰牌呢在godplayer这儿显示的其实是手牌的图！其它玩家显示的是ce的图
                        for (var i = 0; i < cloneSelfPengSprite.numChildren; i++) {
                            var imgSprite = cloneSelfPengSprite._childs[i];
                            imgSprite.getChildAt(0).skin =
                                player.ui_index == 3
                                    ? PaiConverter.skinOfShou(selfPengPai)
                                    : PaiConverter.skinOfCe(selfPengPai);
                        }
                        if (player.ui_index == 3) {
                            cloneSelfPengSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            cloneSelfPengSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        cloneSelfPengSprite.visible = true;
                        cloneSelfPengSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this["shouPai" + player.ui_index].addChild(cloneSelfPengSprite);
                        player.ui_clone_arr.push(cloneSelfPengSprite);
                        //只需要移动3位即可，因为暗杠其实点位也只有3张牌！
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
                else {
                    /**side_player显示其背面，selfPenghide3其实只是为了写批量隐藏时方便，不起作用！*/
                    if (player.seat_index != 3) {
                        for (var i = 0; i < groupShou.selfPengCount; i++) {
                            var cloneselfPengHideSprite = LayaUtils.clone(this["selfPengHide" + player.ui_index]);
                            //有selfPengCount的肯定就是左右玩家了，不可能会是god player!
                            cloneselfPengHideSprite.y = player.shouPai_start_index * y_one_pai_height;
                            cloneselfPengHideSprite.visible = true;
                            cloneselfPengHideSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                            this["shouPai" + player.ui_index].addChild(cloneselfPengHideSprite);
                            player.ui_clone_arr.push(cloneselfPengHideSprite);
                            player.shouPai_start_index = player.shouPai_start_index + 3;
                        }
                    }
                }
            };
            /**显示暗杠组 */
            GameTableScene.prototype.showAnGang = function (groupShou, player, x_one_pai_width, y_one_pai_height) {
                var _this = this;
                if (groupShou.anGang.length > 0) {
                    //显示暗杠
                    groupShou.anGang.forEach(function (anGangPai) {
                        var cloneanGangSprite = LayaUtils.clone(_this["anGang" + player.ui_index]);
                        //暗杠特殊的是只需要显示一张牌
                        var imgSprite = cloneanGangSprite._childs[3];
                        imgSprite.getChildAt(0).skin =
                            player.ui_index == 3
                                ? PaiConverter.skinOfZheng(anGangPai)
                                : PaiConverter.skinOfCe(anGangPai);
                        if (player.ui_index == 3) {
                            cloneanGangSprite.x = player.shouPai_start_index * x_one_pai_width;
                        }
                        else {
                            cloneanGangSprite.y = player.shouPai_start_index * y_one_pai_height;
                        }
                        cloneanGangSprite.visible = true;
                        cloneanGangSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        _this["shouPai" + player.ui_index].addChild(cloneanGangSprite);
                        player.ui_clone_arr.push(cloneanGangSprite);
                        //只需要移动3位即可，因为暗杠其实点位也只有3张牌！
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    });
                }
                else {
                    /**有几组暗杠，就显示几组背面，背面图UI中已经有就不再需要赋值了 */
                    for (var i = 0; i < groupShou.anGangCount; i++) {
                        var cloneanGangHideSprite = LayaUtils.clone(this["anGangHide" + player.ui_index]);
                        //有anGangCount的肯定就是左右玩家了，不可能会是god player!
                        cloneanGangHideSprite.y = player.shouPai_start_index * y_one_pai_height;
                        cloneanGangHideSprite.visible = true;
                        cloneanGangHideSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        this["shouPai" + player.ui_index].addChild(cloneanGangHideSprite);
                        player.ui_clone_arr.push(cloneanGangHideSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    }
                }
            };
            /**显示当前index的方向三角形，UI中的三角形以direction开头 */
            GameTableScene.prototype.show_direction = function (index) {
                if (index === void 0) { index = config.GOD_INDEX; }
                this.clock.visible = true;
                this["direction" + index].visible = true;
            };
            /**
             * 开始显示倒计时，包括显示方向的调用
             * @param player
             * @param reset 是否重新计时
             */
            GameTableScene.prototype.show_count_down = function (player, reset) {
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
                this.showSkinOfCountDown(config.MAX_WAIT_TIME);
                this.countdownOneSecond = setInterval(function () {
                    _this.waitTime--;
                    _this.showSkinOfCountDown(_this.waitTime);
                    if (0 == _this.waitTime) {
                        clearInterval(_this.countdownOneSecond);
                        //自动打牌只有本玩家才有的功能，其它玩家显示倒计时仅仅是显示而已。
                        if (player == Laya.god_player && _this.auto_dapai) {
                            _this.socket.sendmsg({
                                type: g_events.client_da_pai,
                                pai: Laya.god_player.received_pai
                            });
                        }
                    }
                }, 1000);
            };
            /**显示本玩家的手牌，在位置index处 */
            GameTableScene.prototype.show_god_player_shoupai = function (player) {
                var _this = this;
                //先清除以前的，再显示
                this.destroyAllPaiCloneSprites();
                var socket = this.socket;
                var group_shou_pai = player.group_shou_pai;
                // let all_pais: Array<string> = shou_pai
                var shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
                var one_shou_pai_width = this.shou3.width;
                var posiX = one_shou_pai_width * player.shouPai_start_index + config.X_GAP;
                this.shouPai3.visible = true;
                var _loop_1 = function (index) {
                    var url = shouPai_urls[index];
                    this_1.skin_shoupai3.skin = "ui/majiang/" + url;
                    this_1.shou3.x = posiX;
                    var newPaiSprite = LayaUtils.clone(this_1.shou3);
                    newPaiSprite.visible = true;
                    //为新建的牌sprite创建点击处理函数
                    newPaiSprite.on(Laya.Event.CLICK, this_1, function () {
                        // 如果用户已经打过牌了那么就不能再打，防止出现多次打牌的情况，服务器其实也应该有相应的判断！不然黑死你。
                        // if (Laya.god_player.can_dapai) {
                        // if (true) {
                        // 如果两次点击同一张牌，应该打出去
                        _this.handleClonePaiSpriteClick(newPaiSprite, group_shou_pai.shouPai, index, false, player.shouPai_start_index);
                        // }
                    });
                    this_1.clonePaiSpriteArray.push(newPaiSprite); //通过shouPai3来获取所有生成的牌呢有点儿小麻烦，所以自己保存好！
                    this_1.shouPai3.addChild(newPaiSprite);
                    posiX += one_shou_pai_width;
                };
                var this_1 = this;
                for (var index = 0; index < shouPai_urls.length; index++) {
                    _loop_1(index);
                }
            };
            GameTableScene.prototype.hideDirection = function (player) {
                this["direction" + player.ui_index].visible = false;
            };
            GameTableScene.prototype.handleClonePaiSpriteClick = function (newPaiSprite, shou_pai, index, is_server_faPai, start_index) {
                if (is_server_faPai === void 0) { is_server_faPai = false; }
                if (Laya.god_player.can_dapai) {
                    var one_shou_pai_width = this.shou3.width;
                    // 如果两次点击同一张牌，应该打出去
                    if (this.prevSelectedPai === newPaiSprite) {
                        var daPai = shou_pai[index];
                        console.log("\u7528\u6237\u9009\u62E9\u6253\u724C" + daPai);
                        this.socket.sendmsg({
                            type: g_events.client_da_pai,
                            pai: daPai
                        });
                        Laya.god_player.da_pai(daPai);
                        //打牌之后就不能再打牌了！
                        Laya.god_player.can_dapai = false;
                        //不仅这牌要记录要玩家那儿，还要记录在当前房间中！表示这张牌已经可以显示出来了。
                        Laya.room.table_dapai = daPai;
                        this.show_out(Laya.god_player);
                        //牌打出后，界面需要更新的不少，方向需要隐藏掉，以便显示其它，感觉倒计时的可能会一直在，毕竟你打牌，别人打牌都是需要等待的！
                        this.hideDirection(Laya.god_player);
                        // console.log(`打过的牌used_pai:${Laya.god_player.used_pai}`);
                        //todo: 这样写肯定变成了一个递归，内存占用会比较大吧，如何写成真正的纯函数？
                        //打出去之后ui做相应的处理，刷新玩家的手牌，打的牌位置还得还原！
                        newPaiSprite.y += this.ClickOffsetY;
                        // this.gameTable.shou3.x = this.clonePaiSpriteArray[0].x; //需要还原下，不然一开始的显示位置就是错的，毕竟这个值在不断的变化！
                        this.shou3.x =
                            one_shou_pai_width * Laya.god_player.shouPai_start_index + config.X_GAP; //需要还原下，不然一开始的显示位置就是错的，毕竟这个值在不断的变化！
                        this.destroyAllPaiCloneSprites();
                        this.show_god_player_shoupai(Laya.god_player);
                    }
                    else {
                        //点击了不同的牌，首先把前一个选择的牌降低，回到原来的位置
                        if (this.prevSelectedPai) {
                            this.prevSelectedPai.y = this.prevSelectedPai.y + this.ClickOffsetY;
                        }
                        this.prevSelectedPai = newPaiSprite;
                        newPaiSprite.y = newPaiSprite.y - this.ClickOffsetY; //将当前牌提高！
                    }
                }
            };
            /**显示服务器发过来的牌！ */
            GameTableScene.prototype.show_fapai = function (pai) {
                var _this = this;
                this.fa3Image.skin = PaiConverter.skinOfShou(pai);
                var newFa3Sprite = LayaUtils.clone(this.fa3);
                newFa3Sprite.visible = true;
                //这张牌也是可以打出去的！与shouPai中的事件处理其实应该是一样的！或者说假装当成是shouPai的一部分？
                newFa3Sprite.on(Laya.Event.CLICK, this, function () {
                    _this.handleClonePaiSpriteClick(newFa3Sprite, [pai], 0, true, 0);
                });
                this.clonePaiSpriteArray.push(newFa3Sprite);
                this.shouPai3.addChild(newFa3Sprite);
                this.show_count_down(Laya.god_player);
            };
            /**删除掉所有剩余shouPai的复制 */
            GameTableScene.prototype.destroyAllPaiCloneSprites = function () {
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
            GameTableScene.prototype.show_out = function (player) {
                //所有复制的牌都会在show_..._shou_pai的再次调用中被删除
                var outSprite = this["out" + player.ui_index];
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
            GameTableScene.prototype.show_side_player_shoupai = function (player) {
                var _this = this;
                var group_shou_pai = player.group_shou_pai;
                this["shouPai" + player.ui_index].visible = true;
                var cePaiHeight = 60; //应该是内部牌的高度，外部的话还有边，按说应该换成真正牌图形的高度
                //手牌显示的起码坐标Y
                var start_posiY = cePaiHeight * player.shouPai_start_index + config.Y_GAP;
                var show_oneShou = function (url, posiY) {
                    _this["testImageShoupai" + player.ui_index].skin = url;
                    _this["test_shoupai" + player.ui_index].y = posiY;
                    var newPai = LayaUtils.clone(_this["test_shoupai" + player.ui_index]);
                    newPai.visible = true;
                    _this["shouPai" + player.ui_index].addChild(newPai);
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
                else {
                    //只显示背景！
                    for (var index = 0; index < group_shou_pai.shouPaiCount; index++) {
                        show_oneShou(config.BACK_URL, start_posiY);
                        start_posiY += cePaiHeight;
                    }
                }
            };
            GameTableScene.prototype.hidePlayer = function (index) {
                // 头像不显示
                this["userHead" + index].visible = false;
                // 手牌内部是不显示的, 但是手牌本身需要显示
                this["shouPai" + index].visible = true;
                //隐藏里面的牌，需要的时候才会显示出来, 比如fa会显示服务器发过来的牌，如果shouPai隐藏了那么fa就不会再显示！
                this["anGangHide" + index].visible = false;
                this["mingGang" + index].visible = false;
                this["anGang" + index].visible = false;
                this["peng" + index].visible = false;
                this["selfPeng" + index].visible = false;
                this["selfPengHide" + index].visible = false;
                this["shou" + index].visible = false;
                this["fa" + index].visible = false;
                //打过的牌暂不显示
                this["out" + index].visible = false;
                // 用户离线状态不显示
                this["userHeadOffline" + index].visible = false;
                this.clock.visible = false;
                this.direction0.visible = false;
                this.direction1.visible = false;
                this.direction2.visible = false;
                this.direction3.visible = false;
            };
            /**
             * 显示玩家的头像数据，包括用户名,id号,庄家bool，分数值
             * @param gameTable
             * @param p
             * @param index 桌面中用户的序列号，右边的是2，左边的是0，上面的是1（卡五星不用）
             */
            GameTableScene.prototype.showHead = function (gameTable, player) {
                var index = player.ui_index;
                gameTable["userName" + index].text = player.username;
                gameTable["userId" + index].text = player.user_id;
                gameTable["zhuang" + index].visible = player.east;
                gameTable["score" + index].text = player.score.toString(); //todo: 用户的积分需要数据库配合
                gameTable["userHead" + index].visible = true;
            };
            return GameTableScene;
        }(ui.test.GameTableUI));
        scene.GameTableScene = GameTableScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=GameTableScene.js.map