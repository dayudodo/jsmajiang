module mj.scene {
    import Sprite = laya.display.Sprite;
    export class LianSelectScene extends ui.test.LiangSelectUI {
        /**可以隐藏的牌 */
        public canHidePais: Array<Pai>
        /**点击数组，用于判断哪些已经选中 */
        public clickedPais = {}
        /**玩家选择了哪些牌隐藏 */
        public selectedPais

        constructor(canHidePais) {
            super()
            this.canHidePais = canHidePais
            this.show_liang()
            this.okBtn.on(Laya.Event.CLICK, this, () => {
                this.selectedPais = Object.keys(this.clickedPais)
                // console.log(this.selectedPais);
                Laya.socket.sendmsg({
                    type: g_events.client_confirm_liang,
                    selectedPais: this.selectedPais
                })
            })
        }
        public show_liang() {
            laya.ui.Dialog.manager.maskLayer.alpha = 0.5
            //弹出隐藏牌的对话框

            //改变的肯定是god_player的手牌显示
            let gameTable = Laya.gameTable
            //重新计时
            Laya.gameTable.show_count_down(Laya.god_player, true)
            gameTable.selfPeng3.visible = false
            //但是需要把三个相同的给标记出来，让用户选择到底哪些不需要亮牌！也就是选择需要隐藏的牌
            //可能有多个，因为玩家是碰碰胡，而碰碰胡是可以杠的。
            //取消所有的按钮事件！
            gameTable.clonePaiSpriteArray.forEach(paiSprite => {
                // 所有手牌事件不再响应，因为亮牌之后这些牌都不需要点击了！
                paiSprite.offAll(Laya.Event.CLICK)
                //然后再决定把哪三个绑定为一体，再去添加新的点击事件处理。这些可以选择的牌应该由服务器来告诉我，在发送你可以亮的时候计算出来！
            })
            //能够隐藏的牌由服务器传递过来参数canHidePais
            this.canHidePais.forEach(pai => {
                //新建sprite，将三个添加进来。
                let newSelfPengSprite = new Sprite()
                //找到
                let {shouPai} = Laya.god_player.group_shou_pai
                let index = shouPai.indexOf(pai)
                //调整这个克隆3A的显示位置。gameTable.clonePaiSpriteArray[index]为第一个找到的需要隐藏牌的位置
                newSelfPengSprite.x = gameTable.clonePaiSpriteArray[index].x
                for (var i = 0; i < 3; i++) {
                    let hidePai = gameTable.clonePaiSpriteArray[index + i]
                    //newSelfPengSprite位置正常了，但是添加进来之后里面的三张要变成相对坐标了！
                    hidePai.x = hidePai.x - newSelfPengSprite.x

                    //添加到精灵中，以便实现上一级的点击处理
                    newSelfPengSprite.addChild(hidePai)

                }


                newSelfPengSprite.visible = true
                this.shouPai3.addChild(newSelfPengSprite)

                //给这个Sprite添加点击事件，这样三个可以一起改变显示效果
                newSelfPengSprite.on(Laya.Event.CLICK, this, () => {
                    console.log(`cloneSelfPengSprite clicked`);

                    for (var key in this.clickedPais) {
                        //有值说明已经点击过了
                        if (this.clickedPais[key] == newSelfPengSprite) {
                            //改变三张牌的显示为原始
                            // newSelfPengSprite._childs.forEach(imgSprite => {
                            //     imgSprite.getChildAt(0).getChildAt(0).skin = PaiConverter.skinOfShou(pai)
                            // })
                            delete this.clickedPais[key]
                            //还是上下移来的方便
                            newSelfPengSprite.y += gameTable.ClickOffsetY
                            return;
                        }
                    }
                    //for内部没有执行到，那么就开始添加
                    this.clickedPais[pai] = newSelfPengSprite
                    console.log(newSelfPengSprite)
                    //向上移动，如同选中！
                    newSelfPengSprite.y -= gameTable.ClickOffsetY

                })
            })
        }

    }
}