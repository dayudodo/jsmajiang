module mj.scene {
    import Sprite = laya.display.Sprite;
    export class GangSelectScene extends ui.test.GangSelectUI {
        /**可以选择的牌 */
        public canSelectPais: Array<Pai>
        /**点击数组，用于判断哪个杠已经选中 */
        public clickedGangPai = {}
       

        constructor(canSelectPais) {
            super()
            this.canSelectPais = canSelectPais

        }
        /**对象是否为空 */
        public isEmpty(obj) {
            return Object.keys(obj).length === 0
        }

        public decidePopup() {
            if (this.canSelectPais && this.canSelectPais.length > 0) {
                this.show_gangSelect()
                this.okBtn.on(Laya.Event.CLICK, this, () => {
                    this.sendSelectedPai()
                    this.close()
                    // this.removeSelf();
                })
                this.popup()
            } else {
                this.sendSelectedPai()
            }
        }
         /**玩家选择了个杠牌 */
        get selectedPai(){
            let keys = Object.keys(this.clickedGangPai)
            if (keys && keys.length > 1) { throw new Error(`你只能选择一个杠牌！`) }
            return keys && keys[0]
        }
        public sendSelectedPai() {

            // console.log(this.selectedPais);
            Laya.socket.sendmsg({
                type: g_events.client_confirm_mingGang,
                selectedPai: this.selectedPai
            })
        }

        /**显示godPlayer中亮牌选择 */
        public show_gangSelect() {
            //设定半透明的遮罩效果。
            laya.ui.Dialog.manager.maskLayer.alpha = 0.5
            //弹出隐藏牌的对话框

            //改变的肯定是god_player的手牌显示
            let gameTable = Laya.gameTable
            //重新计时
            Laya.gameTable.show_count_down(Laya.god_player, true)
            gameTable.selfPeng3.visible = false
            //但是需要把三个相同的给标记出来，让用户选择到底哪些不需要亮牌！也就是选择需要隐藏的牌
            //可能有多个，因为玩家是碰碰胡，而碰碰胡是可以杠的。
            //能够隐藏的牌由服务器传递过来参数canHidePais
            this.canSelectPais.forEach(pai => {
                //新建sprite，将N个添加进来。
                let newGangSprite = new Sprite()
                //克隆几次，如果是在peng, selfPeng里面，则只需要克隆一次即可！手牌里面自然就是4次
                let cloneCount = 0
                if (Laya.god_player.group_shou_pai.peng.indexOf(pai) > -1 || Laya.god_player.group_shou_pai.selfPeng.indexOf(pai) > -1) {
                    cloneCount = 1
                } else {
                    let {shouPai} =  Laya.god_player.group_shou_pai
                    cloneCount = shouPai.filter(pai_name=> pai_name == pai).length
                }
                //在shouPai里面找到此牌
                let {shouPai} = Laya.god_player.group_shou_pai
                let index = shouPai.indexOf(pai)
                //调整这个克隆NA的显示位置。gameTable.clonePaiSpriteArray[index]为第一个找到的需要隐藏牌的位置
                newGangSprite.x = gameTable.clonePaiSpriteArray[index].x
                for (var i = 0; i < cloneCount; i++) {
                    let gangPai = gameTable.clonePaiSpriteArray[index + i]
                    //newSelfPengSprite位置正常了，但是添加进来之后里面的三张要变成相对坐标了！
                    gangPai.x = gangPai.x - newGangSprite.x

                    //添加到精灵中，以便实现上一级的点击处理
                    newGangSprite.addChild(gangPai)
                }
                newGangSprite.visible = true
                this.shouPai3.addChild(newGangSprite)

                //给这个Sprite添加点击事件，这样三个可以一起改变显示效果
                newGangSprite.on(Laya.Event.CLICK, this, () => {
                    // console.log(`newGangSprite clicked， ${pai}, ${cloneCount}`);

                    //只会有一个杠牌！
                    //有值说明已经点击过了,取消此项杠牌
                    if (this.isEmpty(this.clickedGangPai)) {
                        this.clickedGangPai[pai] = newGangSprite
                        //向上移动，如同选中！
                        newGangSprite.y -= gameTable.ClickOffsetY
                    }
                    else {
                        if (this.clickedGangPai[pai] == newGangSprite) {
                            //如果是同一个点击，则取消，下移
                            delete this.clickedGangPai[pai]
                            //还是上下移来的方便
                            newGangSprite.y += gameTable.ClickOffsetY
                        } else {
                            //有值但是不相同，那么也是需要先移动的，表明已经取消这个选择了！
                            let key = Object.keys(this.clickedGangPai)[0]
                            this.clickedGangPai[key].y += gameTable.ClickOffsetY
                            this.clickedGangPai = {}
                            this.clickedGangPai[pai] = newGangSprite
                            //向上移动，如同选中！
                            newGangSprite.y -= gameTable.ClickOffsetY
                        }
                    }

                    // console.log(newGangSprite)

                })
            })
        }

    }
}