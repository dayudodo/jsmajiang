
module mj.scene {
    import Sprite = laya.display.Sprite;
    import Image = Laya.Image;
    import ShoupaiConstuctor = mj.model.ShoupaiConstuctor;
    import PaiConverter = mj.utils.PaiConverter;
    import LayaUtils = mj.utils.LayaUtils;
    import WinnerScene = mj.scene.WinnerScene

    export class GameTableScene extends ui.test.GameTableUI {
        public socket: Laya.Socket;
        /**是否在计时结束后自动打牌，测试时使用 */
        public auto_dapai = false;
        /** 方向指向自己的手牌数组，还能添加服务器的发牌 */
        public clonePaiSpriteArray: Sprite[] = [];
        /**玩家手牌点击后上下的偏移量 */
        public ClickOffsetY = 40;
        private prevSelectedPai: Sprite = null;
        public winnerScene: WinnerScene

        constructor() {
            super()
            this.socket = Laya.socket

        }
        show_allResults(players) {
            this.winnerScene = new WinnerScene()

            //更新本地player数据
            players.forEach(person => {
                let localPlayer = Laya.room.players.find(p => p.user_id == person.user_id);
                localPlayer.cloneResultsFrom(person);
            });
            console.log(Laya.room.players);
            
            this.winnerScene.show_all(Laya.room.players)
            this.addChild(this.winnerScene)
        }
        
        show_dapai(player: Player, pai_name: Pai) {
            //首先隐藏所有的dapai
            // this.daPaiSprite.visible = true
            // this.daPai0.visible = false
            // this.daPai1.visible = false
            // this.daPai2.visible = false
            // this.daPai3.visible = false

            let whoDaPai = this["daPai" + player.ui_index]
            whoDaPai.getChildAt(0).getChildAt(0).skin = PaiConverter.skinOfZheng(pai_name)
            whoDaPai.visible = true
            //5秒后消失
            Laya.timer.once(5 * 1000, this, () => {
                this["daPai" + player.ui_index].visible = false
            })

        }
        showSkinOfCountDown(twonumber: number) {
            [this.Num1.skin, this.Num0.skin] = PaiConverter.CountDownNumSkin(twonumber)
        }
        /**UI上显示出玩家的group手牌！ */
        public show_group_shoupai(player: Player) {
            //先清除以前显示过的group_shou_pai
            player.ui_clone_arr.forEach(clone => {
                let cloneSpirte = clone as Sprite;
                cloneSpirte.destroy();
            });
            player.ui_clone_arr = [];
            //起始的索引也要重新开始！
            player.shouPai_start_index = 0;

            let groupShou = player.group_shou_pai;
            let y_one_pai_height = 60; //todo: 应该改成获取其中一个牌的高度！
            let x_one_pai_width = this.shou3.width;

            this.showAnGang(groupShou, player, x_one_pai_width, y_one_pai_height);
            this.showMingGang(groupShou, player, x_one_pai_width, y_one_pai_height);
            this.showPeng(groupShou, player, x_one_pai_width, y_one_pai_height);

            this.showSelfPeng(groupShou, player, x_one_pai_width, y_one_pai_height);
            //显示剩下的shouPai, 如果为空，补齐成空牌！
            if (player.ui_index == 3) {
                this.show_god_player_shoupai(player);
            } else {
                this.show_side_player_shoupai(player);
            }
        }

        public showPeng(
            groupShou: ShoupaiConstuctor,
            player: Player,
            x_one_pai_width: number,
            y_one_pai_height: number,
            container: any = this,
            show_in_win = false
        ) {
            if (groupShou.peng.length > 0) {
                //显示碰
                groupShou.peng.forEach(pengPai => {
                    let clonePengSprite = LayaUtils.clone(
                        container["peng" + player.ui_index]
                    ) as Sprite;
                    for (var i = 0; i < clonePengSprite.numChildren; i++) {
                        var imgSprite = clonePengSprite._childs[i];
                        imgSprite.getChildAt(0).skin =
                            player.ui_index == 3 || show_in_win
                                ? PaiConverter.skinOfZheng(pengPai)
                                : PaiConverter.skinOfCe(pengPai);
                    }
                    if (player.ui_index == 3 || show_in_win) {
                        clonePengSprite.x = player.shouPai_start_index * x_one_pai_width;
                    } else {
                        clonePengSprite.y = player.shouPai_start_index * y_one_pai_height;
                    }
                    clonePengSprite.visible = true;
                    clonePengSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                    container["shouPai" + player.ui_index].addChild(clonePengSprite);
                    player.ui_clone_arr.push(clonePengSprite);
                    player.shouPai_start_index = player.shouPai_start_index + 3;
                });
            }
        }

        /**
         * 显示玩家所有的明杠牌
         * @param groupShou 
         * @param player 
         * @param x_one_pai_width 
         * @param y_one_pai_height 
         * @param container 两种一个是gameTableScene, 一种是winnerScene
         * @param show_in_win 是否是显示在winnerScene中的，如果是，则显示skinOfZheng的图片
         */
        public showMingGang(
            groupShou: ShoupaiConstuctor,
            player: Player,
            x_one_pai_width: number,
            y_one_pai_height: number,
            container: any = this,
            show_in_win = false
        ) {
            if (groupShou.mingGang.length > 0) {
                //显示明杠
                groupShou.mingGang.forEach(mingGangPai => {
                    let clonemingGangSprite = LayaUtils.clone(
                        container["mingGang" + player.ui_index]
                    ) as Sprite;
                    for (var i = 0; i < clonemingGangSprite.numChildren; i++) {
                        var imgSprite = clonemingGangSprite._childs[i];
                        imgSprite.getChildAt(0).skin =
                            player.ui_index == 3 || show_in_win
                                ? PaiConverter.skinOfZheng(mingGangPai)
                                : PaiConverter.skinOfCe(mingGangPai);
                    }
                    if (player.ui_index == 3 || show_in_win) {
                        clonemingGangSprite.x = player.shouPai_start_index * x_one_pai_width;
                    } else {
                        clonemingGangSprite.y = player.shouPai_start_index * y_one_pai_height;
                    }
                    clonemingGangSprite.visible = true;
                    clonemingGangSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                    container["shouPai" + player.ui_index].addChild(clonemingGangSprite);
                    player.ui_clone_arr.push(clonemingGangSprite);
                    player.shouPai_start_index = player.shouPai_start_index + 3;
                });
            }
        }

        public showSelfPeng(
            groupShou: ShoupaiConstuctor,
            player: Player,
            x_one_pai_width: number,
            y_one_pai_height: number,
            container: any = this
        ) {
            if (groupShou.selfPeng.length > 0) {
                //显示自碰牌
                groupShou.selfPeng.forEach(selfPengPai => {
                    let cloneSelfPengSprite = LayaUtils.clone(
                        container["selfPeng" + player.ui_index]
                    ) as Sprite;
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
                    } else {
                        cloneSelfPengSprite.y = player.shouPai_start_index * y_one_pai_height;
                    }
                    cloneSelfPengSprite.visible = true;
                    cloneSelfPengSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                    container["shouPai" + player.ui_index].addChild(cloneSelfPengSprite);
                    player.ui_clone_arr.push(cloneSelfPengSprite);
                    //只需要移动3位即可，因为暗杠其实点位也只有3张牌！
                    player.shouPai_start_index = player.shouPai_start_index + 3;
                });
            } else {
                /**side_player显示其背面，selfPenghide3其实只是为了写批量隐藏时方便，不起作用！*/
                if (player.seat_index != 3) {
                    for (var i = 0; i < groupShou.selfPengCount; i++) {
                        let cloneselfPengHideSprite = LayaUtils.clone(
                            container["selfPengHide" + player.ui_index]
                        ) as Sprite;
                        //有selfPengCount的肯定就是左右玩家了，不可能会是god player!
                        cloneselfPengHideSprite.y = player.shouPai_start_index * y_one_pai_height;
                        cloneselfPengHideSprite.visible = true;
                        cloneselfPengHideSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                        container["shouPai" + player.ui_index].addChild(cloneselfPengHideSprite);
                        player.ui_clone_arr.push(cloneselfPengHideSprite);
                        player.shouPai_start_index = player.shouPai_start_index + 3;
                    }
                }
            }
        }
        /**显示暗杠组 */
        public showAnGang(
            groupShou: ShoupaiConstuctor,
            player: Player,
            x_one_pai_width: number,
            y_one_pai_height: number,
            container: any = this
        ) {
            if (groupShou.anGang.length > 0) {
                //显示暗杠
                groupShou.anGang.forEach(anGangPai => {
                    let cloneanGangSprite = LayaUtils.clone(
                        container["anGang" + player.ui_index]
                    ) as Sprite;
                    //暗杠特殊的是只需要显示一张牌
                    var imgSprite = cloneanGangSprite._childs[3];
                    imgSprite.getChildAt(0).skin =
                        player.ui_index == 3
                            ? PaiConverter.skinOfZheng(anGangPai)
                            : PaiConverter.skinOfCe(anGangPai);
                    if (player.ui_index == 3) {
                        cloneanGangSprite.x = player.shouPai_start_index * x_one_pai_width;
                    } else {
                        cloneanGangSprite.y = player.shouPai_start_index * y_one_pai_height;
                    }
                    cloneanGangSprite.visible = true;
                    cloneanGangSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                    container["shouPai" + player.ui_index].addChild(cloneanGangSprite);
                    player.ui_clone_arr.push(cloneanGangSprite);
                    //只需要移动3位即可，因为暗杠其实点位也只有3张牌！
                    player.shouPai_start_index = player.shouPai_start_index + 3;
                });
            } else {
                /**有几组暗杠，就显示几组背面，背面图UI中已经有就不再需要赋值了 */
                for (var i = 0; i < groupShou.anGangCount; i++) {
                    let cloneanGangHideSprite = LayaUtils.clone(
                        container["anGangHide" + player.ui_index]
                    ) as Sprite;
                    //有anGangCount的肯定就是左右玩家了，不可能会是god player!
                    cloneanGangHideSprite.y = player.shouPai_start_index * y_one_pai_height;
                    cloneanGangHideSprite.visible = true;
                    cloneanGangHideSprite.scale(config.GROUP_RATIO, config.GROUP_RATIO, true);
                    container["shouPai" + player.ui_index].addChild(cloneanGangHideSprite);
                    player.ui_clone_arr.push(cloneanGangHideSprite);
                    player.shouPai_start_index = player.shouPai_start_index + 3;
                }
            }
        }

        /**显示当前index的方向三角形，UI中的三角形以direction开头 */
        private show_direction(index: number = config.GOD_INDEX) {
            this.clock.visible = true;
            this["direction" + index].visible = true;
        }

        private waitTime = config.MAX_WAIT_TIME;
        private countdownOneSecond;
        /**
         * 开始显示倒计时，包括显示方向的调用
         * @param player
         * @param reset 是否重新计时
         */
        public show_count_down(player: Player, reset = true) {
            if (reset) {
                clearInterval(this.countdownOneSecond);
                this.waitTime = config.MAX_WAIT_TIME;
            }
            console.log(`${player.username}开始倒计时`);
            //先隐藏所有，因为不知道上一次到底显示的是哪个
            Laya.room.players.forEach(p => {
                this.hideDirection(p);
            });
            this.show_direction(player.ui_index);
            //todo: replace this.gameTable.Num0.skin

            this.showSkinOfCountDown(config.MAX_WAIT_TIME);
            this.countdownOneSecond = setInterval(() => {
                this.waitTime--;
                this.showSkinOfCountDown(this.waitTime);
                if (0 == this.waitTime) {
                    clearInterval(this.countdownOneSecond);
                    //自动打牌只有本玩家才有的功能，其它玩家显示倒计时仅仅是显示而已。
                    if (player == Laya.god_player && this.auto_dapai) {
                        this.socket.sendmsg({
                            type: g_events.client_da_pai,
                            pai: Laya.god_player.received_pai
                        });
                    }
                }
            }, 1000);
        }

        /**显示本玩家的手牌，在位置index处 */
        private show_god_player_shoupai(player: Player) {
            //先清除以前的，再显示
            this.destroyAllPaiCloneSprites();

            let { socket } = this;
            let { group_shou_pai } = player;
            // let all_pais: Array<string> = shou_pai
            let shouPai_urls = PaiConverter.ToShouArray(group_shou_pai.shouPai);
            let one_shou_pai_width = this.shou3.width;
            let posiX = one_shou_pai_width * player.shouPai_start_index + config.X_GAP;
            this.shouPai3.visible = true;

            for (let index = 0; index < shouPai_urls.length; index++) {
                const url = shouPai_urls[index];
                this.skin_shoupai3.skin = `ui/majiang/${url}`;
                this.shou3.x = posiX;
                let newPaiSprite = LayaUtils.clone(this.shou3) as Sprite;
                newPaiSprite.visible = true;
                //为新建的牌sprite创建点击处理函数
                newPaiSprite.on(Laya.Event.CLICK, this, () => {
                    // 如果用户已经打过牌了那么就不能再打，防止出现多次打牌的情况，服务器其实也应该有相应的判断！不然黑死你。
                    // if (Laya.god_player.can_dapai) {
                    // if (true) {
                    // 如果两次点击同一张牌，应该打出去
                    this.handleClonePaiSpriteClick(
                        newPaiSprite,
                        group_shou_pai.shouPai,
                        index,
                        false,
                        player.shouPai_start_index
                    );
                    // }
                });
                this.clonePaiSpriteArray.push(newPaiSprite); //通过shouPai3来获取所有生成的牌呢有点儿小麻烦，所以自己保存好！
                this.shouPai3.addChild(newPaiSprite);
                posiX += one_shou_pai_width;
            }
        }
        private hideDirection(player: Player) {
            this["direction" + player.ui_index].visible = false;
        }
        private handleClonePaiSpriteClick(
            newPaiSprite: Sprite,
            shou_pai: string[],
            index: number,
            is_server_faPai: boolean = false,
            start_index
        ) {
            if (Laya.god_player.can_dapai) {
                let one_shou_pai_width = this.shou3.width;
                // 如果两次点击同一张牌，应该打出去
                if (this.prevSelectedPai === newPaiSprite) {
                    let daPai: Pai = shou_pai[index];
                    console.log(`用户选择打牌${daPai}`);
                    this.socket.sendmsg({
                        type: g_events.client_da_pai,
                        pai: daPai
                    });
                    Laya.god_player.da_pai(daPai);
                    //打牌之后就不能再打牌了！
                    Laya.god_player.can_dapai = false
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
                } else {
                    //点击了不同的牌，首先把前一个选择的牌降低，回到原来的位置
                    if (this.prevSelectedPai) {
                        this.prevSelectedPai.y = this.prevSelectedPai.y + this.ClickOffsetY;
                    }
                    this.prevSelectedPai = newPaiSprite;
                    newPaiSprite.y = newPaiSprite.y - this.ClickOffsetY; //将当前牌提高！
                }
            }
        }

        /**显示服务器发过来的牌！ */
        public show_fapai(pai: string) {
            this.fa3Image.skin = PaiConverter.skinOfShou(pai);
            let newFa3Sprite = LayaUtils.clone(this.fa3) as Sprite;
            newFa3Sprite.visible = true;
            //这张牌也是可以打出去的！与shouPai中的事件处理其实应该是一样的！或者说假装当成是shouPai的一部分？
            newFa3Sprite.on(Laya.Event.CLICK, this, () => {
                this.handleClonePaiSpriteClick(newFa3Sprite, [pai], 0, true, 0);
            });
            this.clonePaiSpriteArray.push(newFa3Sprite);
            this.shouPai3.addChild(newFa3Sprite);
            this.show_count_down(Laya.god_player);
        }

        // 是否隐藏了打牌所在区域sprite
        private isFirstHideOut0 = true;
        private isFirstHideOut1 = true;
        private isFirstHideOut2 = true;
        private isFirstHideOut3 = true;

        /**删除掉所有剩余shouPai的复制 */
        private destroyAllPaiCloneSprites() {
            this.clonePaiSpriteArray.forEach((item, index) => {
                let changePaiSprite = item as Sprite;
                changePaiSprite.destroy(true);
                //真正的牌面是个Image,而且是二级子！
                // let changeImg = changePai.getChildAt(0).getChildAt(0) as Image
                // changeImg.skin =  `ui/majiang/${all_pai_urls[index]}`
            });
            this.clonePaiSpriteArray = [];
        }

        /** 将打牌显示在ui中的out? Sprite之中 */
        public show_out(player: Player) {
            //所有复制的牌都会在show_..._shou_pai的再次调用中被删除

            let outSprite = this["out" + player.ui_index] as Sprite;
            //先隐藏所有内部的图，再去全部重新显示
            for (let index = 0; index < outSprite.numChildren; index++) {
                const oneLine = outSprite.getChildAt(index) as Sprite;
                for (var l_index = 0; l_index < oneLine.numChildren; l_index++) {
                    var onePai = oneLine.getChildAt(l_index) as Sprite;
                    onePai.visible = false;
                }
            }
            // let [line, row] = player.last_out_coordinate

            outSprite.visible = true;

            //直接找到行和列替换成真正的打牌
            player.arr_dapai.forEach((dapai, index) => {
                let [line, row] = player.coordinateOf(index);
                let lastValidSprite = outSprite.getChildAt(line).getChildAt(row) as Sprite;
                let paiImgSprite = lastValidSprite.getChildAt(0) as Image;
                if (player.ui_index == 3) {
                    paiImgSprite.skin = PaiConverter.skinOfZheng(dapai);
                } else {
                    paiImgSprite.skin = PaiConverter.skinOfCe(dapai);
                }
                lastValidSprite.visible = true;
            });
        }

        public show_side_player_shoupai(player: Player) {
            let { group_shou_pai } = player;
            this["shouPai" + player.ui_index].visible = true;
            let cePaiHeight = 60; //应该是内部牌的高度，外部的话还有边，按说应该换成真正牌图形的高度
            //手牌显示的起码坐标Y
            let start_posiY = cePaiHeight * player.shouPai_start_index + config.Y_GAP;
            let show_oneShou = (url, posiY) => {
                this["testImageShoupai" + player.ui_index].skin = url;
                this["test_shoupai" + player.ui_index].y = posiY;
                let newPai = LayaUtils.clone(
                    this["test_shoupai" + player.ui_index]
                ) as Sprite;
                newPai.visible = true;
                this["shouPai" + player.ui_index].addChild(newPai);
                player.ui_clone_arr.push(newPai);
            };
            //如果有值，就显示此牌，没有值就显示空的。
            if (group_shou_pai.shouPai.length > 0) {
                for (let index = 0; index < group_shou_pai.shouPai.length; index++) {
                    const url = PaiConverter.skinOfCe(group_shou_pai.shouPai[index]);
                    show_oneShou(url, start_posiY);
                    start_posiY += cePaiHeight;
                }
            } else {
                //只显示背景！
                for (let index = 0; index < group_shou_pai.shouPaiCount; index++) {
                    show_oneShou(config.BACK_URL, start_posiY);
                    start_posiY += cePaiHeight;
                }
            }
        }
        public hidePlayer(index: number) {

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
        }

        /**
         * 显示玩家的头像数据，包括用户名,id号,庄家bool，分数值
         * @param gameTable
         * @param p
         * @param index 桌面中用户的序列号，右边的是2，左边的是0，上面的是1（卡五星不用）
         */
        public showHead(gameTable: GameTableScene, player: Player) {
            let index = player.ui_index;
            gameTable["userName" + index].text = player.username;
            gameTable["userId" + index].text = player.user_id;
            gameTable["zhuang" + index].visible = player.east;
            gameTable["score" + index].text = player.score.toString(); //todo: 用户的积分需要数据库配合
            gameTable["userHead" + index].visible = true;
        }



    }
}