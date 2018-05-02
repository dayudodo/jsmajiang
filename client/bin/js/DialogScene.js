var mj;
(function (mj) {
    var scene;
    (function (scene) {
        class DialogScene extends ui.test.DialogUI {
            constructor(message, confirmClicked) {
                super();
                this.contentText.wordWrap = true;
                this.contentText.text = message;
                this.cancelBtn.on(Laya.Event.CLICK, this, this.close);
                this.confirmBtn.on(Laya.Event.CLICK, this, confirmClicked && this.reconnect);
            }
            reconnect() {
                window.location.reload();
            }
        }
        scene.DialogScene = DialogScene;
    })(scene = mj.scene || (mj.scene = {}));
})(mj || (mj = {}));
//# sourceMappingURL=DialogScene.js.map