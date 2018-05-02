var laText = Laya.Text;
var Stage = Laya.Stage;
var Loader = Laya.Loader;
var LoginScene = mj.scene.LoginScene;
var DialogScene = mj.scene.DialogScene;
var scene = mj.scene;
var Client = mj.net.Manager;
var Player = mj.model.Player;
var LoadingUI = ui.test.LoadingUI;
var LoginUI = ui.test.LoginUI;
var MainUI = ui.test.MainUI;
var test = ui.test;
class GameMain {
    constructor() {
        Laya.init(1920, 1080);
        Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
        Laya.stage.alignH = Stage.ALIGN_CENTER;
        Laya.stage.alignV = Stage.ALIGN_MIDDLE;
        Laya.stage.screenMode = Stage.SCREEN_NONE;
        Laya.client = new Client();
        this.all_players = new Array();
        Laya.god_player = new Player();
        this.all_players.push(Laya.god_player);
        // var mm:Laya.Sprite = new Laya.Sprite();
        // mm.loadImage("images/mm.png",0,0,0,0, Laya.Handler.create(this, this.onloaded,[mm]))
        //只是加载进内存而已，还没有开始使用！
        var assets = this.makeAssets();
        Laya.loader.load(assets, Laya.Handler.create(this, this.onLoaderComplete), Laya.Handler.create(this, this.onProgress));
        this.testloading = new LoadingUI();
        Laya.stage.addChild(this.testloading);
    }
    onProgress(value) {
        // console.log("progress:", value);
        this.testloading.progressBar.value = value;
        this.testloading.progressBarLabel.text = "载入中 " + Math.ceil(value * 100) + "%";
    }
    onLoaderComplete() {
        console.log(`loader complete`);
        // console.log(window.client);
        Laya.stage.removeChild(this.testloading);
        // var res: any = Laya.loader.getRes("res/atlas/base.atlas");
        // res = Laya.loader.getRes("res/atlas/ui/home.atlas")
        // res = Laya.loader.getRes("res/atlas/ui/game.atlas")
        // res = Laya.loader.getRes("res/atlas/ui/majiang.atlas")
        this.testLogin = new LoginScene();
        // this.testui = new test.MainUI()
        Laya.stage.addChild(this.testLogin);
    }
    onloaded(obj) {
        // Laya.stage.addChild(obj)
    }
    makeAssets() {
        var assets = [];
        assets.push({
            url: "res/atlas/base.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/ui/home.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/ui/game.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/base/number/lost.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/base/number/time.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/base/number/win.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/movie/shazi.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/ui/majiang.atlas",
            type: Loader.ATLAS
        });
        assets.push({
            url: "res/atlas/movie/wait.atlas",
            type: Loader.ATLAS
        });
        return assets;
    }
}
//最后还需要新建一个对象才能跑起来。
new GameMain();
//# sourceMappingURL=Main.js.map