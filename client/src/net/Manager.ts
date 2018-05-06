

module mj.net {
    import GameTableScene = mj.scene.GameTableScene;
    import PaiConverter = mj.utils.PaiConvertor
    import LayaUtils = mj.utils.LayaUtils
    import Sprite = laya.display.Sprite;
    import DialogScene = mj.scene.DialogScene
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
                [events.server_welcome, this.server_welcome],
                [events.server_login, this.server_login],
                [events.server_no_room, this.server_no_room],
                [events.server_no_such_room, this.server_no_such_room],
                [events.server_other_player_enter_room, this.server_other_player_enter_room],
                [events.server_player_enter_room, this.server_player_enter_room],
                [events.server_room_full, this.server_room_full],
                // [events.server_create_room_ok, this.server_create_room_ok],
                [events.server_receive_ready, this.server_receive_ready],
                [events.server_game_start, this.server_game_start],
                [events.server_gameover, this.server_gameover],
                [events.server_table_fa_pai_other, this.server_table_fa_pai_other],
                [events.server_table_fa_pai, this.server_table_fa_pai],
                [events.server_dapai, this.server_dapai],
                [events.server_dapai_other, this.server_dapai_other],

            ]

        }
        private server_gameover() {
            console.log('server_gameover');

        }
        private server_dapai_other(server_message) {
            let { username, user_id, pai_name} = server_message
            console.log(`${username}, id: ${user_id} 打牌${pai_name}`);
            let player = Laya.room.players.find(p => p.user_id == user_id)
            this.show_out(pai_name, player.ui_index)

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
        /** 开始显示倒计时，包括显示方向的调用 */
        private show_count_down(player: Player) {
            console.log(`${player.username}开始倒计时`);
            this.show_direction(player.ui_index)
            //todo: replace this.gameTable.Num0.skin 
            let waitTime = config.MAX_WAIT_TIME
            let showSkinOfCountDown = (twonumber: number) => {
                [this.gameTable.Num1.skin, this.gameTable.Num0.skin] = PaiConverter.CountDownNumSkin(twonumber)
            }
            showSkinOfCountDown(config.MAX_WAIT_TIME)
            let countdownOneSecond = () => {
                waitTime--
                showSkinOfCountDown(waitTime)
                if (0 == waitTime) {
                    Laya.timer.clear(this, countdownOneSecond)
                    //计时结束隐藏方向
                    this.hideDirection(player)
                    //自动打牌只有本玩家才有的功能，其它玩家显示倒计时仅仅是显示而已。
                    if ((player == Laya.god_player) && this.auto_dapai) {
                        this.socket.sendmsg({
                            type: events.client_da_pai,
                            pai: Laya.god_player.table_pai
                        })
                    }
                }
            }
            Laya.timer.loop(1000, this, countdownOneSecond)
        }

        private server_table_fa_pai_other(server_message) {
            let { user_id } = server_message
            let player = Laya.room.players.find(p => p.user_id == user_id)
            console.log(`服务器给玩家${player.username}发了张牌`);
            this.show_count_down(player)
        }
        private server_table_fa_pai(server_message) {
            //服务器发牌，感觉这张牌还是应该单独计算吧，都放在手牌里面想要显示是有问题的。
            // console.log(server_message.pai);
            let pai: string = server_message.pai
            Laya.god_player.table_pai = pai
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
            Laya.god_player.shou_pai = server_message.shou_pai


            // console.log(server_message);
            let { gameTable } = this
            this.show_god_player_shoupai(gameTable, Laya.god_player.shou_pai);
            //test: 显示上一玩家所有的牌
            this.show_left_player_shoupai(gameTable, server_message);
            //显示下一玩家所有牌
            this.show_right_player_shoupai(gameTable, server_message);

        }
        private show_god_player_shoupai(gameTable: GameTableScene, shou_pai: string[]) {
            let {socket} = this
            // let all_pais: Array<string> = shou_pai
            let all_pai_urls = PaiConverter.ToShouArray(shou_pai)
            let one_shou_pai_width = gameTable.shou3.width;
            let posiX = gameTable.shou3.x;
            gameTable.shouPai3.visible = true;
            //隐藏里面的牌，需要的时候才会显示出来
            gameTable.chi3.visible = false;
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
                    if (Laya.god_player.table_pai) {
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
                let daPai = shou_pai[index];
                console.log(`用户选择打牌${daPai}`);
                this.socket.sendmsg({
                    type: events.client_da_pai,
                    pai: daPai
                });
                Laya.god_player.da_pai(daPai)
                this.show_out(daPai)
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
                this.show_god_player_shoupai(this.gameTable, Laya.god_player.shou_pai);
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
        private show_out(dapai: string, table_index: number = config.GOD_INDEX) {
            let outSprite = this.gameTable["out" + table_index] as Sprite
            if (this["isFirstHideOut" + table_index]) {
                //先隐藏所有内部的图
                for (let index = 0; index < outSprite.numChildren; index++) {
                    const oneLine = outSprite.getChildAt(index) as Sprite;
                    for (var l_index = 0; l_index < oneLine.numChildren; l_index++) {
                        var onePai = oneLine.getChildAt(l_index) as Sprite;
                        onePai.visible = false
                    }
                }
                //只需要隐藏一次，下一次就不需要了，不然以前显示的打牌就被隐藏了
                this["isFirstHideOut" + table_index] = false
            }

            outSprite.visible = true
            //找到第一个没用的，其实就是找到第一个 是万的，临时的解决办法。
            let lastValidSprite = null;
            for (let index = 0; index < outSprite.numChildren; index++) {
                const oneLine = outSprite.getChildAt(index) as Sprite;
                for (let l_index = 0; l_index < oneLine.numChildren; l_index++) {
                    var onePai = oneLine.getChildAt(l_index) as Sprite;
                    let paiImgSprite = onePai.getChildAt(0) as Image
                    // console.log(paiImgSprite);

                    //如果是一万的图形, 就换成打牌的图形
                    if ((table_index == 3) && "ui/majiang/zheng_18.png" == paiImgSprite.skin) {
                        onePai.visible = true
                        lastValidSprite = paiImgSprite
                        lastValidSprite.skin = PaiConverter.skinOfZheng(dapai)
                        break;
                    }
                    //如果是其它玩家的牌，就显示成横牌
                    if ("ui/majiang/ce_18.png" == paiImgSprite.skin) {
                        onePai.visible = true
                        lastValidSprite = paiImgSprite
                        lastValidSprite.skin = PaiConverter.skinOfCe(dapai)
                        break;
                    }
                }
                if (lastValidSprite) { break; }
            }

        }

        private show_right_player_shoupai(gameTable: GameTableScene, server_message: any) {
            gameTable.shouPai2.visible = true;
            gameTable.chi2.visible = false;
            gameTable.anGangHide2.visible = false;
            gameTable.mingGang2.visible = false;
            gameTable.anGang2.visible = false;
            gameTable.fa2.visible = false;
            gameTable.shou2.visible = false;
            let right_pai_y = gameTable.test_shoupai2.y;
            let right_pai_height = 60; //gameTable.test_shoupai2_image.height
            let all_right_urls = PaiConverter.ToCeArray(server_message.right_player);
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

        private show_left_player_shoupai(gameTable: GameTableScene, server_message: any) {
            gameTable.shouPai0.visible = true;
            gameTable.chi0.visible = false;
            gameTable.anGangHide0.visible = false;
            gameTable.mingGang0.visible = false;
            gameTable.anGang0.visible = false;
            gameTable.fa0.visible = false;
            gameTable.shou0.visible = false;
            let left_pai_y = gameTable.test_shoupai0.y;
            let left_pai_height = 60; //应该是内部牌的高度，外部的话还有边，按说应该换成真正牌图形的高度
            // let left_data: Array<string> = 
            let all_left_urls = PaiConverter.ToCeArray(server_message.left_player);
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
            //隐藏里面的牌，需要的时候才会显示出来
            gameTable["chi" + index].visible = false;
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
                this.socket.sendmsg({ type: events.client_player_ready })
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
            // gameTable.shouPai3.visible = true
            // this.server_table_fa_pai({pai: 't4'})
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
