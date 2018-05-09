
module mj.scene {
    import PaiConverter = mj.utils.PaiConvertor

    export class GameTableScene extends ui.test.GameTableUI {
        constructor(){
            super()
            
        }
        showSkinOfCountDown  (twonumber: number) {
                [this.Num1.skin, this.Num0.skin] = PaiConverter.CountDownNumSkin(twonumber)
            }
     }
}