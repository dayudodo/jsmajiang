module mj.scene {
    export class DialogScene extends ui.test.DialogUI{
        constructor(message: string,  confirmClicked?: Function){
            super()
            this.contentText.wordWrap = true
            this.contentText.text=message
            this.cancelBtn.on(Laya.Event.CLICK, this, this.close)
            this.confirmBtn.on(Laya.Event.CLICK, this, confirmClicked )
        }
        //重新连接
        reconnect(){
            window.location.reload()
        }
    }
}