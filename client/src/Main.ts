



    import laText = Laya.Text
    import Stage = Laya.Stage
    import Loader = Laya.Loader
    import LoginScene = mj.scene.LoginScene
    import DialogScene = mj.scene.DialogScene
    import scene = mj.scene
    import Client = mj.net.Manager
    import Player = mj.model.Player

    import LoadingUI = ui.test.LoadingUI
    import LoginUI = ui.test.LoginUI
    import MainUI = ui.test.MainUI
    import test = ui.test

     class GameMain {
        public testloading: LoadingUI
        public testLogin: LoginUI
        public testMain: MainUI
        public testui: test.MainUI
        public all_players: Array<Player>

        constructor() {
            Laya.init(1920, 1080);
            Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
            Laya.stage.alignH = Stage.ALIGN_CENTER
            Laya.stage.alignV = Stage.ALIGN_MIDDLE;
            Laya.stage.screenMode = Stage.SCREEN_NONE

            Laya.client = new Client()
            this.all_players = new Array<Player>()
            Laya.god_player = new Player()

            this.all_players.push(Laya.god_player)
            // var mm:Laya.Sprite = new Laya.Sprite();
            // mm.loadImage("images/mm.png",0,0,0,0, Laya.Handler.create(this, this.onloaded,[mm]))
            //只是加载进内存而已，还没有开始使用！
            var assets = this.makeAssets()
            Laya.loader.load(assets,
                Laya.Handler.create(this, this.onLoaderComplete),
                Laya.Handler.create(this, this.onProgress))

            this.testloading = new LoadingUI()


            Laya.stage.addChild(this.testloading)
        }

        onProgress(value: number): void {
            // console.log("progress:", value);
            this.testloading.progressBar.value = value
            this.testloading.progressBarLabel.text = "载入中 " + Math.ceil(value * 100) + "%";

        }
        onLoaderComplete(): void {
            console.log(`loader complete`);
            // console.log(window.client);


            Laya.stage.removeChild(this.testloading)
            var res: any = Laya.loader.getRes("res/atlas/base.json");
            res = Laya.loader.getRes("res/atlas/ui/home.json")
            this.testLogin = new LoginScene()
            // this.testui = new test.MainUI()
            Laya.stage.addChild(this.testLogin)
        }

        onloaded(obj: Laya.Sprite): void {
            // Laya.stage.addChild(obj)
        }

        makeAssets(): Array<any> {
            var assets: any = [];
            assets.push({
                url: "res/atlas/base.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/ui/home.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/ui/game.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/base/number/lost.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/base/number/time.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/base/number/win.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/movie/shazi.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/ui/majiang.json",
                type: Loader.ATLAS
            });
            assets.push({
                url: "res/atlas/movie/wait.json",
                type: Loader.ATLAS
            });
            return assets
        }
    }

//最后还需要新建一个对象才能跑起来。
new GameMain()