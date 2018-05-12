

module mj.net {

    import GameTableScene = mj.scene.GameTableScene;
    import PaiConverter = mj.utils.PaiConvertor
    import LayaUtils = mj.utils.LayaUtils
    import Sprite = laya.display.Sprite;
    import DialogScene = mj.scene.DialogScene
    import OptDialogScene = mj.scene.OptDialogScene
    import GameSoundObserver = mj.manager.GameSoundObserver
    import Image = Laya.Image

    export class Manager {
        public socket: Laya.Socket;
        public byte: Laya.Byte;
        public eventsHandler: Array<any>
        public gameTable: GameTableScene
        /** 方向指向自己的手牌数组，还能添加服务器的发牌 */
        private clonePaiSpriteArray: Sprite[] = []

        private offsetY = 40;
        private offsetX = 10;
        private prevSelectedPai: Sprite = null;
        /**是否在计时结束后自动打牌，测试时使用 */
        private auto_dapai = false;

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
            this.socket.on(Laya.Event.OPEN, this, this.openHandler);
            this.socket.on(Laya.Event.MESSAGE, this, this.messageHandler);
            this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
            this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
            //建立连接, 如果想在手机上使用，需要用物理地址，只是浏览器测试，用localhost!
            // this.socket.connectByUrl("ws://192.168.2.200:3333");
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

            ]

        }
        /**更新UI，out牌中删除掉打牌 */
        private out_remove(player: Player, dapai): Pai {
            //player打出的牌保存在used_pai中，也就是打出来的序号了，还是需要计算出在第几行第几个
            // 小于12的第一排，大于12的依次排列！这样增加删除都会比较方便！
            let [line, row] = player.last_out_coordinate
            let outSprite = this.gameTable["out" + player.ui_index] as Sprite
            let lastValidSprite = outSprite.getChildAt(line).getChildAt(row) as Sprite
            let paiImgSprite = lastValidSprite.getChildAt(0) as Image

            if (player.ui_index == 3) {
                paiImgSprite.skin = PaiConverter.skinOfZheng(dapai)
            } else {
                paiImgSprite.skin = PaiConverter.skinOfCe(dapai)
            }
            lastValidSprite.visible = false
            return dapai
        }
        /**UI上显示出group手牌，每次都会重绘！ */
        public show_group_shoupai(player: Player) {
            let groupShou = player.group_shou_pai
            let index = 0
            let y_one_pai_height = 60 //todo: 应该改成获取其中一个牌的高度！
            let x_one_pai_width = this.gameTable.shou3.width;

            if (groupShou.anGang.length > 0) {
                //显示暗杠
                // groupShou.anGang.forEach(gangPai => {
                //     let clonePengSprite = LayaUtils.clone(this.gameTable["anGang" + player.ui_index])
                //     for (var i = 0; i < clonePengSprite.numChildren; i++) {
                //         var imgSprite = clonePengSprite[i];
                //         imgSprite.getChildAt(0).skin = (player.ui_index == 3 ? PaiConverter.skinOfShou(gangPai) : PaiConverter.skinOfCe(gangPai))

                //     }
                //     index = index + 4
                // });
            }
            if (groupShou.mingGang.length > 0) {
                //显示明杠
            }
            if (groupShou.peng.length > 0) {
                //显示碰
                groupShou.peng.forEach(pengPai => {
                    let clonePengSprite = LayaUtils.clone(this.gameTable["peng" + player.ui_index]) as Sprite
                    for (var i = 0; i < clonePengSprite.numChildren; i++) {
                        var imgSprite = clonePengSprite[i];
                        imgSprite.getChildAt(0).skin = (player.ui_index == 3 ? PaiConverter.skinOfShou(pengPai) : PaiConverter.skinOfCe(pengPai))

                    }
                    if (player.ui_index == 3) {
                        clonePengSprite.x = index * x_one_pai_width
                    } else {
                        clonePengSprite.y = index * y_one_pai_height
                    }
                    clonePengSprite.visible = true
                    index = index + 3
                });
            }
            //显示剩下的shouPai, 如果为空，补齐成空牌！

        }
        /** 其他人碰了牌 */
        public server_peng(server_message) {
            console.log(server_message)
            return;
            let { player } = server_message
            let pengPlayer = Laya.room.players.find(p => p.user_id == player.user_id)
            let pengPai = player.pengPai
            // let dapaiPlayer = Laya.room.players.find(p => p.user_id == dapai_player_id)
            //删除掉这张打牌，不再属于player, 而是归pengPlayer所有！
            let dapai: Pai = Laya.room.dapai_player.arr_dapai.pop()
            if (pengPai != dapai) {
                throw new Error('碰的牌就是刚刚打出来的牌，检查代码！')
            }
            //更新UI中的显示
            this.out_remove(Laya.room.dapai_player, dapai)
            //碰牌的过程就是你打出来的牌消失，跑到player的手牌中
            //而碰玩家要显示出这三张碰牌！
            // pengPlayer.group_shou_pai.peng.push(pengPai)
            pengPlayer.confirm_peng(pengPai)
            this.show_group_shoupai(pengPlayer)

        }
        public server_can_select(server_message) {
            let [isShowHu, isShowLiang, isShowGang, isShowPeng] = server_message.select_opt
            let opt = new OptDialogScene()
            opt.showPlayerSelect({ isShowHu: isShowHu, isShowLiang: isShowLiang, isShowGang: isShowGang, isShowPeng: isShowPeng })
            laya.ui.Dialog.manager.maskLayer.alpha = 0; //全透明，但是不能点击其它地方，只能选择可选操作，杠、胡等
            this.gameTable.addChild(opt)
            opt.popup()

        }
        private server_gameover(server_message) {
            console.log('server_gameover');

        }
        private server_dapai_other(server_message) {
            let { username, user_id, pai_name} = server_message
            console.log(`${username}, id: ${user_id} 打牌${pai_name}`);
            let player = Laya.room.players.find(p => p.user_id == user_id)
            //记录下打牌玩家
            Laya.room.dapai_player = player
            //还要记录下其它玩家打过啥牌，以便有人碰杠的话删除之
            player.received_pai = pai_name
            player.da_pai(pai_name)
            //牌打出去之后才能显示出来！
            this.show_out(player, pai_name)

        }
        private server_dapai(server_message) {
            let {pai_name} = server_message
            console.log(`服务器确认你已打牌 ${pai_name}`);
        }
        /**显示当前index的方向三角形，UI中的三角形以direction开头 */
        private show_direction(index: number = config.GOD_INDEX) {
            this.gameTable.clock.visible = true
            this.gameTable["direction" + index].visible = true
        }

        private waitTime = config.MAX_WAIT_TIME
        private countdownOneSecond
        /** 开始显示倒计时，包括显示方向的调用 */
        private show_count_down(player: Player, reset = true) {
            if (reset) {
                clearInterval(this.countdownOneSecond);
                this.waitTime = config.MAX_WAIT_TIME
            }
            console.log(`${player.username}开始倒计时`);
            //先隐藏所有，因为不知道上一次到底显示的是哪个
            Laya.room.players.forEach(p => {
                this.hideDirection(p)
            })
            this.show_direction(player.ui_index)
            //todo: replace this.gameTable.Num0.skin 

            this.gameTable.showSkinOfCountDown(config.MAX_WAIT_TIME)
            this.countdownOneSecond = setInterval(() => {
                this.waitTime--
                this.gameTable.showSkinOfCountDown(this.waitTime)
                if (0 == this.waitTime) {
                    clearInterval(this.countdownOneSecond)
                    //自动打牌只有本玩家才有的功能，其它玩家显示倒计时仅仅是显示而已。
                    if ((player == Laya.god_player) && this.auto_dapai) {
                        this.socket.sendmsg({
                            type: g_events.client_da_pai,
                            pai: Laya.god_player.received_pai
                        })
                    }
                }
            }, 1000)
        }

        private server_table_fa_pai_other(server_message) {
            let { user_id } = server_message
            let player = Laya.room.players.find(p => p.user_id == user_id)
            console.log(`服务器给玩家${player.username}发了张牌`);
            //无清掉所有的计时，再开始新的！
            this.show_count_down(player)
        }
        private server_table_fa_pai(server_message) {
            //服务器发牌，感觉这张牌还是应该单独计算吧，都放在手牌里面想要显示是有问题的。
            // console.log(server_message.pai);
            let pai: string = server_message.pai
            Laya.god_player.received_pai = pai
            let {gameTable } = this
            //显示服务器发过来的牌
            gameTable.fa3Image.skin = PaiConverter.skinOfShou(pai)
            let newFa3Sprite = LayaUtils.clone(gameTable.fa3) as Sprite
            newFa3Sprite.visible = true
            //这张牌也是可以打出去的！与shouPai中的事件处理其实应该是一样的！或者说假装当成是shouPai的一部分？
            newFa3Sprite.on(Laya.Event.CLICK, this, () => {
                this.handleClonePaiSpriteClick(newFa3Sprite, [pai], 0, true)
            })
            this.clonePaiSpriteArray.push(newFa3Sprite)
            gameTable.shouPai3.addChild(newFa3Sprite);
            this.show_count_down(Laya.god_player)
        }

        private server_game_start(server_message) {
            //游戏开始了
            //测试下显示牌面的效果，还需要转换一下要显示的东西，服务器发过来的是自己的b2,b3，而ui里面名称则不相同。又得写个表了！

            //客户端也需要保存好当前的牌，以便下一步处理
            Laya.god_player.flat_shou_pai = server_message.flat_shou_pai

            // console.log(server_message);
            let { gameTable } = this
            this.show_god_player_shoupai(gameTable, Laya.god_player.flat_shou_pai);
            //test: 显示上一玩家所有的牌
            this.show_left_player_shoupai(gameTable, server_message.left_player);
            //显示下一玩家所有牌
            this.show_right_player_shoupai(gameTable, server_message.right_player);

        }
        private show_god_player_shoupai(gameTable: GameTableScene, shou_pai: string[]) {
            let {socket} = this
            // let all_pais: Array<string> = shou_pai
            let all_pai_urls = PaiConverter.ToShouArray(shou_pai)
            let one_shou_pai_width = gameTable.shou3.width;
            let posiX = gameTable.shou3.x;
            gameTable.shouPai3.visible = true;
            //隐藏里面的牌，需要的时候才会显示出来
            gameTable.peng3.visible = false;
            gameTable.anGangHide3.visible = false;
            gameTable.mingGang3.visible = false;
            gameTable.anGang3.visible = false;
            gameTable.fa3.visible = false;
            gameTable.shou3.visible = false;
            // gameTable.shou3.visible = true
            for (let index = 0; index < all_pai_urls.length; index++) {
                const url = all_pai_urls[index];
                gameTable.skin_shoupai3.skin = `ui/majiang/${url}`;
                gameTable.shou3.x = posiX;
                let newPaiSprite = LayaUtils.clone(gameTable.shou3) as Sprite;
                newPaiSprite.visible = true;
                //为新建的牌sprite创建点击处理函数
                newPaiSprite.on(Laya.Event.CLICK, this, () => {
                    // 如果用户已经打过牌了那么就不能再打，防止出现多次打牌的情况，服务器其实也应该有相应的判断！不然黑死你。
                    if (Laya.god_player.received_pai) {
                        // 如果两次点击同一张牌，应该打出去
                        this.handleClonePaiSpriteClick(newPaiSprite, shou_pai, index);
                    }
                });
                this.clonePaiSpriteArray.push(newPaiSprite) //通过shouPai3来获取所有生成的牌呢有点儿小麻烦，所以自己保存好！
                gameTable.shouPai3.addChild(newPaiSprite);
                posiX += one_shou_pai_width;
            }
        }
        private hideDirection(player: Player) {
            this.gameTable["direction" + player.ui_index].visible = false
        }
        private handleClonePaiSpriteClick(newPaiSprite: Sprite, shou_pai: string[], index: number, is_server_faPai: boolean = false) {
            // 如果两次点击同一张牌，应该打出去
            if (this.prevSelectedPai === newPaiSprite) {
                let daPai: Pai = shou_pai[index];
                console.log(`用户选择打牌${daPai}`);
                this.socket.sendmsg({
                    type: g_events.client_da_pai,
                    pai: daPai
                });
                Laya.god_player.da_pai(daPai)
                //不仅这牌要记录要玩家那儿，还要记录在当前房间中！表示这张牌已经可以显示出来了。
                Laya.room.table_dapai = daPai

                this.show_out(Laya.god_player, daPai)
                //牌打出后，界面需要更新的不少，方向需要隐藏掉，以便显示其它，感觉倒计时的可能会一直在，毕竟你打牌，别人打牌都是需要等待的！
                this.hideDirection(Laya.god_player)
                // console.log(`打过的牌used_pai:${Laya.god_player.used_pai}`);
                //todo: 这样写肯定变成了一个递归，内存占用会比较大吧，如何写成真正的纯函数？
                //打出去之后ui做相应的处理，刷新玩家的手牌，打的牌位置还得还原！
                newPaiSprite.y += this.offsetY;
                this.gameTable.shou3.x = this.clonePaiSpriteArray[0].x; //需要还原下，不然一开始的显示位置就是错的，毕竟这个值在不断的变化！
                this.clonePaiSpriteArray.forEach((item, index) => {
                    let changePaiSprite = item as Sprite;
                    changePaiSprite.destroy(true);
                    //真正的牌面是个Image,而且是二级子！
                    // let changeImg = changePai.getChildAt(0).getChildAt(0) as Image
                    // changeImg.skin =  `ui/majiang/${all_pai_urls[index]}` 
                });
                this.clonePaiSpriteArray = [];
                this.show_god_player_shoupai(this.gameTable, Laya.god_player.flat_shou_pai);
            }
            else {
                //点击了不同的牌，首先把前一个选择的牌降低，回到原来的位置
                if (this.prevSelectedPai) {
                    this.prevSelectedPai.y = this.prevSelectedPai.y + this.offsetY;
                }
                this.prevSelectedPai = newPaiSprite;
                newPaiSprite.y = newPaiSprite.y - this.offsetY; //将当前牌提高！
            }
        }

        // 是否隐藏了打牌所在区域sprite
        private isFirstHideOut0 = true
        private isFirstHideOut1 = true
        private isFirstHideOut2 = true
        private isFirstHideOut3 = true

        /** 将打牌显示在ui中的out3 sprite之中 */
        private show_out(player: Player, dapai: Pai) {
            let outSprite = this.gameTable["out" + player.ui_index] as Sprite
            if (this["isFirstHideOut" + player.ui_index]) {
                //先隐藏所有内部的图
                for (let index = 0; index < outSprite.numChildren; index++) {
                    const oneLine = outSprite.getChildAt(index) as Sprite;
                    for (var l_index = 0; l_index < oneLine.numChildren; l_index++) {
                        var onePai = oneLine.getChildAt(l_index) as Sprite;
                        onePai.visible = false
                    }
                }
                //只需要隐藏一次，下一次就不需要了，不然以前显示的打牌就被隐藏了
                this["isFirstHideOut" + player.ui_index] = false
            }
            let [line, row] = player.last_out_coordinate

            outSprite.visible = true

            //找到第一个没用的，其实就是找到第一个 是万的，临时的解决办法。
            let lastValidSprite = outSprite.getChildAt(line).getChildAt(row) as Sprite
            let paiImgSprite = lastValidSprite.getChildAt(0) as Image
            if (player.ui_index == 3) {
                paiImgSprite.skin = PaiConverter.skinOfZheng(dapai)

            } else {
                paiImgSprite.skin = PaiConverter.skinOfCe(dapai)
            }
            lastValidSprite.visible = true
        }

        private show_right_player_shoupai(gameTable: GameTableScene, right_player: Player) {
            gameTable.shouPai2.visible = true;
            gameTable.peng2.visible = false;
            gameTable.anGangHide2.visible = false;
            gameTable.mingGang2.visible = false;
            gameTable.anGang2.visible = false;
            gameTable.fa2.visible = false;
            gameTable.shou2.visible = false;
            let right_pai_y = gameTable.test_shoupai2.y;
            let right_pai_height = 60; //gameTable.test_shoupai2_image.height
            let all_right_urls = PaiConverter.ToCeArray(right_player.flat_shou_pai);
            for (let index = 0; index < all_right_urls.length; index++) {
                const url = all_right_urls[index];
                gameTable.test_shoupai2_image.skin = `ui/majiang/${url}`;
                gameTable.test_shoupai2.y = right_pai_y;
                let newPai = LayaUtils.clone(gameTable.test_shoupai2) as Sprite;
                newPai.visible = true;
                gameTable.shouPai2.addChild(newPai);
                right_pai_y = right_pai_y + right_pai_height;
            }
        }

        private show_left_player_shoupai(gameTable: GameTableScene, left_player: any) {
            gameTable.shouPai0.visible = true;
            gameTable.peng0.visible = false;
            gameTable.anGangHide0.visible = false;
            gameTable.mingGang0.visible = false;
            gameTable.anGang0.visible = false;
            gameTable.fa0.visible = false;
            gameTable.shou0.visible = false;
            let left_pai_y = gameTable.test_shoupai0.y;
            let left_pai_height = 60; //应该是内部牌的高度，外部的话还有边，按说应该换成真正牌图形的高度
            // let left_data: Array<string> = 
            let all_left_urls = PaiConverter.ToCeArray(left_player.flat_shou_pai);
            for (let index = 0; index < all_left_urls.length; index++) {
                const url = all_left_urls[index];
                gameTable.test_shoupai0_image.skin = `ui/majiang/${url}`;
                gameTable.test_shoupai0.y = left_pai_y;
                let newPai = LayaUtils.clone(gameTable.test_shoupai0) as Sprite;
                newPai.visible = true;
                gameTable.shouPai0.addChild(newPai);
                left_pai_y = left_pai_y + left_pai_height;
            }
        }

        public openHandler(event: any = null): void {
            //正确建立连接；
        }
        //看来这儿会成为新的调度口了，根据发过来的消息进行各种处理，暂时感觉这样也OK，不过那种socketio的on办法也实在是方便啊。
        // 其实就算是socketio也能使用查表的办法来写，代码还更具有通用性！
        public messageHandler(msg: any = null): void {
            ///接收到数据触发函数
            let server_message = JSON.parse(msg);
            let canRun_item = this.eventsHandler.find(item => server_message.type == item[0])
            if (canRun_item) {
                canRun_item[1].call(this, server_message)
                return;
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
            let { username, user_id, score } = server_message;
            console.log("登录成功, 用户名：%s, 用户id: %s, 积分：%s", username, user_id, score);
            Laya.god_player.username = username;
            Laya.god_player.user_id = user_id;
            Laya.god_player.score = score;
            //进入主界面！
            let home = new scene.MainScene(username, user_id);
            Laya.stage.destroyChildren();
            Laya.stage.addChild(home);
        }

        private hidePlayer(index: number) {
            let { gameTable } = this
            // 头像不显示
            gameTable["userHead" + index].visible = false
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
            gameTable["out" + index].visible = false
            // 用户离线状态不显示
            gameTable["userHeadOffline" + index].visible = false

            this.gameTable.clock.visible = false
            this.gameTable.direction0.visible = false
            this.gameTable.direction1.visible = false
            this.gameTable.direction2.visible = false
            this.gameTable.direction3.visible = false
        }
        /** 用户创建房间、加入房间后打开gameTable */
        private open_gameTable(server_message: any) {
            Laya.stage.destroyChildren();
            // let { seat_index, east} = server_message

            //在最需要的时候才去创建对象，比类都还没有实例时创建问题少一些？
            this.gameTable = new GameTableScene();
            let { gameTable } = this
            Laya.gameTable = gameTable //给出一个访问的地方，便于调试
            //其它的username, user_id在用户加入房间的时候就已经有了。
            this.hidePlayer(0)
            this.hidePlayer(1)
            this.hidePlayer(2)
            this.hidePlayer(3) //自己的也要先隐藏起来，再显示出需要显示的
            gameTable.userName3.text = Laya.god_player.username;
            gameTable.userId3.text = Laya.god_player.user_id;
            gameTable.zhuang3.visible = Laya.god_player.east; //todo: 应该有一个扔骰子选庄的过程，测试阶段创建房间人就是庄
            gameTable.score3.text = Laya.god_player.score.toString(); //todo: 用户的积分需要数据库配合
            gameTable.userHead3.visible = true
            // var res: any = Laya.loader.getRes("res/atlas/ui/majiang.json");

            //让按钮有点儿点击的效果！
            LayaUtils.handlerButton(gameTable.settingBtn)
            LayaUtils.handlerButton(gameTable.gameInfoBtn)

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
                this.socket.sendmsg({ type: g_events.client_player_ready })
            }
            let leftPlayer = Laya.room.left_player(Laya.god_player)
            // console.log('leftPlayer:', leftPlayer);
            if (leftPlayer) {
                //显示左玩家的信息
                this.showHead(gameTable, leftPlayer, 0)
            }
            let rightPlayer = Laya.room.right_player(Laya.god_player)
            // console.log('rightPlayer:', rightPlayer);
            if (rightPlayer) {
                //显示右玩家的信息
                this.showHead(gameTable, rightPlayer, 2);
            }
            //for test
            // Laya.god_player.received_pai = 't2'
            // Laya.god_player.da_pai('t2')
            // this.show_out(Laya.god_player, 't2')

            // Laya.god_player.received_pai = 'b2'
            // Laya.god_player.da_pai('b2')
            // this.show_out(Laya.god_player, 'b2')
            // Laya.timer.once(2000, this, () => {
            //     this.out_remove(Laya.god_player)

            // })

            //end test
            Laya.stage.addChild(gameTable);
        }

        private server_other_player_enter_room(server_message: any) {
            let { username, user_id, seat_index, score } = server_message;
            //添加其它玩家的信息，还得看顺序如何！根据顺序来显示玩家的牌面，服务器里面保存的位置信息，可惜与layabox里面正好是反的！
            //先看这个玩家是否已经进入过，如果进入过，说明是断线的。
            //不可能有一个玩家进入两次房间，除非是掉线。
            console.log(`其它玩家${username}加入房间, id:${user_id}, seat_index:${seat_index}`);
            let player = new Player()
            player.username = username
            player.user_id = user_id
            player.seat_index = seat_index
            player.score = score
            Laya.room.players.push(player)

            let {gameTable} = this
            //只需要更新其它两个玩家的头像信息，自己的已经显示好了。
            // let otherPlayers = Laya.room.other_players(Laya.god_player)
            // console.log(otherPlayers);

            //todo: 没效率，粗暴的刷新用户头像数据
            let leftPlayer = Laya.room.left_player(Laya.god_player)
            console.log('leftPlayer:', leftPlayer);
            if (leftPlayer) {
                //显示左玩家的信息
                this.showHead(gameTable, leftPlayer, 0)
            }
            let rightPlayer = Laya.room.right_player(Laya.god_player)
            console.log('rightPlayer:', rightPlayer);
            if (rightPlayer) {
                //显示右玩家的信息
                this.showHead(gameTable, rightPlayer, 2);
            }
        }
        /**
         * 显示玩家的头像数据，包括用户名,id号,庄家bool，分数值
         * @param gameTable 
         * @param p 
         * @param index 桌面中用户的序列号，右边的是2，左边的是0，上面的是1（卡五星不用）
         */
        private showHead(gameTable: GameTableScene, p: Player, index: number) {
            gameTable["userName" + index].text = p.username;
            gameTable["userId" + index].text = p.user_id;
            gameTable["zhuang" + index].visible = p.east;
            gameTable["score" + index].text = p.score.toString(); //todo: 用户的积分需要数据库配合
            gameTable["userHead" + index].visible = true;
        }

        //玩家成功加入房间
        private server_player_enter_room(server_message: any) {
            let { room_id, username, user_id, east, seat_index, other_players_info } = server_message;
            console.log(`${username}玩家进入房间${room_id}, seat_index:${seat_index}`)
            //其实这时候就可以使用room来保存玩家信息了，以后只需要用户来个id以及数据就能够更新显示了。
            Laya.god_player.seat_index = seat_index
            Laya.god_player.east = east

            other_players_info.forEach(person => {
                let player = new Player()
                player.username = person.username
                player.user_id = person.user_id
                player.seat_index = person.seat_index
                player.east = person.east
                player.score = person.score
                Laya.room.players.push(player)
            });
            this.open_gameTable(server_message)
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
            let closeDialogue = new DialogScene("连接已经关闭，请联系系统管理员");
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
