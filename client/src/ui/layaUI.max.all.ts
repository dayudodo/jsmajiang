
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.test {
    export class ChapterResultUI extends View {
		public mainSprite:Laya.Sprite;
		public shouPai3:Laya.Sprite;
		public chi3:Laya.Sprite;
		public anGangHide3:Laya.Sprite;
		public mingGang3:Laya.Sprite;
		public anGang3:Laya.Sprite;
		public shou3:Laya.Sprite;
		public fa3:Laya.Sprite;
		public winSprite:Laya.Sprite;
		public winScore:Laya.Label;
		public winName:Laya.Label;
		public winFan:Laya.Label;
		public winFanString:laya.display.Text;
		public zaMaSprite:Laya.Sprite;
		public maPaiSprite:Laya.Sprite;
		public maPai:Laya.Image;
		public yiMaType:Laya.Label;
		public yiMaScore:Laya.Label;
		public yiMaWu:Laya.Label;
		public otherScore:Laya.Sprite;
		public name0:Laya.Label;
		public score0:Laya.Label;
		public name1:Laya.Label;
		public score1:Laya.Label;
		public name2:Laya.Label;
		public score2:Laya.Label;
		public liuju:Laya.Label;
		public title:Laya.Image;
		public titleIcon:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":1285,"text":"-100","height":774},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":1285,"var":"mainSprite","height":774},"child":[{"type":"Sprite","props":{"y":24.999999999999996,"x":27.000000000000167,"width":1227,"var":"shouPai3","scaleY":1,"scaleX":1,"height":172},"child":[{"type":"Sprite","props":{"y":26,"x":0,"width":250,"var":"chi3","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":84,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_32.png"}}]},{"type":"Image","props":{"y":0,"x":168,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":26,"x":508,"width":250,"var":"anGangHide3","height":128},"child":[{"type":"Image","props":{"y":0,"x":84,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":-28,"x":84,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":168,"skin":"ui/majiang/zheng_an.png"}}]},{"type":"Sprite","props":{"y":26,"x":760,"width":248,"var":"mingGang3","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":166,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-31,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":26,"x":254,"width":250,"var":"anGang3","height":128},"child":[{"type":"Image","props":{"y":0,"x":84,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":168,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":-28,"x":84,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":0,"x":1031,"width":82,"var":"shou3","pivotY":-26,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/shou_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/shou_32.png"}}]}]},{"type":"Sprite","props":{"y":0,"x":1144,"width":82,"var":"fa3","pivotY":-26,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"width":82,"skin":"ui/majiang/shou_bg.png","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/shou_0.png"}}]}]}]},{"type":"Sprite","props":{"y":196,"x":29,"width":1230,"var":"winSprite","height":286},"child":[{"type":"Label","props":{"y":45,"x":1056,"width":174,"var":"winScore","text":"+100","overflow":"hidden","height":54,"fontSize":50,"color":"#cd5216","bold":true,"align":"right"}},{"type":"Label","props":{"y":44.5,"x":29,"width":300,"var":"winName","text":"小草小草小草小草小草","overflow":"hidden","height":54,"fontSize":50,"color":"#cd5216","bold":true}},{"type":"Sprite","props":{"y":28,"x":396,"width":585,"height":95},"child":[{"type":"Label","props":{"y":47,"x":-52,"width":749,"var":"winFan","text":"(40番)","overflow":"hidden","height":37,"fontSize":30,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Text","props":{"y":-3,"x":-52,"wordWrap":false,"width":749,"var":"winFanString","text":"杠上花  清一色 一条龙","height":39,"fontSize":"40","color":"#cd5216","bold":true,"align":"center"}}]},{"type":"Sprite","props":{"y":160,"x":-1,"width":1242,"var":"zaMaSprite","height":126},"child":[{"type":"Sprite","props":{"y":-1,"x":355,"var":"maPaiSprite","height":119},"child":[{"type":"Image","props":{"y":-1.1368683772161603e-13,"x":5.684341886080802e-14,"width":82,"var":"maPai","skin":"ui/majiang/zheng_bg.png","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Label","props":{"y":28,"x":-1,"width":300,"var":"yiMaType","text":"一码全中","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true,"align":"left"}},{"type":"Label","props":{"y":31,"x":1054,"width":174,"var":"yiMaScore","text":"+100","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true,"align":"right"}},{"type":"Label","props":{"y":33,"x":377,"width":629,"var":"yiMaWu","text":"全部未中","overflow":"hidden","height":50,"fontSize":50,"color":"#573a1e","bold":true,"align":"center"}}]}]},{"type":"Sprite","props":{"y":536.9999999999998,"x":28.000000000000252,"var":"otherScore"},"child":[{"type":"Sprite","props":{"y":1.1368683772161603e-13,"x":0,"width":1230.9999999999998,"height":54},"child":[{"type":"Label","props":{"y":0,"x":31,"width":349,"var":"name0","text":"小草小草小草小草小草","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true}},{"type":"Label","props":{"y":0,"x":905,"width":325,"var":"score0","text":"-100","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true,"align":"right"}}]},{"type":"Sprite","props":{"y":76.00000000000023,"x":0,"width":1230.9999999999998,"height":54},"child":[{"type":"Label","props":{"y":0,"x":31,"width":349,"var":"name1","text":"小草小草小草小草小草","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true}},{"type":"Label","props":{"y":0,"x":902,"width":328,"var":"score1","text":"-100","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true,"align":"right"}}]},{"type":"Sprite","props":{"y":152.0000000000001,"x":0,"width":1230.9999999999998,"height":54},"child":[{"type":"Label","props":{"y":0,"x":31,"width":349,"var":"name2","text":"小草小草小草小草小草","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true}},{"type":"Label","props":{"y":0,"x":906,"width":325,"var":"score2","text":"-100","overflow":"hidden","height":54,"fontSize":50,"color":"#573a1e","bold":true,"align":"right"}}]}]},{"type":"Label","props":{"y":188,"x":60,"width":1159,"var":"liuju","text":"流局","overflow":"hidden","height":119,"fontSize":120,"color":"#1c1c1c","bold":true,"align":"center"},"child":[{"type":"Label","props":{"y":-4,"x":-2,"width":1159,"text":"流局","overflow":"hidden","height":119,"fontSize":120,"color":"#cd5216","bold":true,"align":"center"}}]}]},{"type":"Image","props":{"y":837,"x":1,"var":"title","skin":"ui/game/result_title_bg.png"},"child":[{"type":"Image","props":{"y":-12,"x":107.5,"var":"titleIcon","skin":"ui/game/result_title_win.png"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.ChapterResultUI.uiView);
        }
    }
}

module ui.test {
    export class CreateOptUI extends View {
		public content:Laya.Sprite;
		public tabContent:Laya.Sprite;
		public typeRadio:Laya.RadioGroup;
		public chapterMaxRadio:Laya.RadioGroup;
		public maiMaRadio:Laya.RadioGroup;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":1520,"labelSize":42,"height":608},"child":[{"type":"Sprite","props":{"y":3,"x":0,"width":1520,"var":"content","height":608},"child":[{"type":"Sprite","props":{"y":23,"x":29,"width":1207,"var":"tabContent","scaleY":1.2,"scaleX":1.2,"height":477},"child":[{"type":"Sprite","props":{"y":14,"x":12,"width":1185,"height":62},"child":[{"type":"Label","props":{"y":5,"x":0,"width":167,"text":"类型:","height":46,"fontSize":44,"color":"#000000"}},{"type":"RadioGroup","props":{"y":-6,"x":177,"width":807,"var":"typeRadio","space":40,"skin":"base/radio.png","selectedIndex":0,"labels":"推倒胡,红中变,白板变,单鬼,双鬼","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","height":68,"direction":"horizontal"}}]},{"type":"Sprite","props":{"y":128,"x":12},"child":[{"type":"Label","props":{"y":5,"x":0,"width":167,"text":"局数:","height":46,"fontSize":44,"color":"#000000"}},{"type":"RadioGroup","props":{"y":-6,"x":177,"width":643,"var":"chapterMaxRadio","space":40,"skin":"base/radio.png","selectedIndex":0,"labels":"8局(1房卡),16局(2房卡)","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","height":68,"direction":"horizontal"}}]},{"type":"Sprite","props":{"y":224,"x":12,"width":1087,"height":139},"child":[{"type":"Label","props":{"y":7.000000000000114,"x":0,"width":167,"text":"马牌:","height":46,"fontSize":44,"color":"#000000"}},{"type":"RadioGroup","props":{"y":2,"x":177,"var":"maiMaRadio","selectedIndex":1},"child":[{"type":"Radio","props":{"skin":"base/radio.png","name":"item0","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","label":"无马"}},{"type":"Radio","props":{"x":167,"skin":"base/radio.png","name":"item1","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","label":"一马全中"}},{"type":"Radio","props":{"x":420,"skin":"base/radio.png","name":"item2","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","label":"买2马"}},{"type":"Radio","props":{"x":614,"skin":"base/radio.png","name":"item3","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","label":"买4马"}},{"type":"Radio","props":{"y":72,"skin":"base/radio.png","name":"item4","labelSize":42,"labelPadding":"7,0,0,0","labelColors":"#000000","label":"买6马"}}]}]}]},{"type":"Image","props":{"y":122,"x":1147,"width":3,"skin":"base/line_vertical.png","rotation":90,"height":1100}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.CreateOptUI.uiView);
        }
    }
}

module ui.test {
    export class DialogUI extends Dialog {
		public mainSprite:Laya.Sprite;
		public bg:Laya.Image;
		public icon1:Laya.Image;
		public icon2:Laya.Image;
		public contentSprite:Laya.Sprite;
		public contentText:laya.display.Text;
		public buttonSprite:Laya.Sprite;
		public cancelBtn:Laya.Button;
		public confirmBtn:Laya.Button;

        public static  uiView:any ={"type":"Dialog","props":{"width":702,"text":"提示信息111","labelPadding":"0,0,5,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":true,"label":"确定","height":543},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":702,"var":"mainSprite","height":543},"child":[{"type":"Image","props":{"y":0,"x":0,"width":702,"var":"bg","skin":"base/dialog_bg.png","height":543}},{"type":"Image","props":{"y":27,"x":96.00000000000004,"var":"icon1","skin":"base/dialog_icon.png","mouseEnabled":true}},{"type":"Image","props":{"y":28,"x":611,"var":"icon2","skin":"base/dialog_icon.png","scaleX":-1,"mouseEnabled":true}},{"type":"Sprite","props":{"y":96,"x":90,"width":525,"var":"contentSprite","height":307},"child":[{"type":"Text","props":{"y":-1,"x":-7,"width":530,"var":"contentText","text":"提示信息","height":294,"fontSize":"48","align":"center"}}]},{"type":"Sprite","props":{"y":417,"x":0,"width":702,"var":"buttonSprite","height":89},"child":[{"type":"Button","props":{"y":0,"x":27,"width":300,"var":"cancelBtn","skin":"base/btn_normal.png","labelSize":40,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":"true","label":"取消","height":95}},{"type":"Button","props":{"y":0,"x":373,"width":300,"var":"confirmBtn","skin":"base/btn_danger.png","labelSize":40,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":"true","label":"确定","height":95}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.DialogUI.uiView);
        }
    }
}

module ui.test {
    export class GameTableUI extends View {
		public bg:Laya.Sprite;
		public bgImage:Laya.Image;
		public roomCheckId:Laya.Label;
		public leftGameNums:Laya.Label;
		public heads:Laya.Sprite;
		public userHead3:Laya.Sprite;
		public userHeadMask3:Laya.Image;
		public userHeadIconOut3:Laya.Sprite;
		public userHeadIcon3:Laya.Image;
		public userHeadOffline3:Laya.Image;
		public userId3:laya.display.Text;
		public goldBg3:Laya.Image;
		public goldIcon3:Laya.Image;
		public gold3:laya.display.Text;
		public userName3:laya.display.Text;
		public zhuang3:Laya.Image;
		public userHead0:Laya.Sprite;
		public userHeadMask0:Laya.Image;
		public userHeadIconOut0:Laya.Sprite;
		public userHeadIcon0:Laya.Image;
		public userHeadOffline0:Laya.Image;
		public userId0:laya.display.Text;
		public goldBg0:Laya.Image;
		public goldIcon0:Laya.Image;
		public gold0:laya.display.Text;
		public userName0:laya.display.Text;
		public zhuang0:Laya.Image;
		public userHead2:Laya.Sprite;
		public userHeadMask2:Laya.Image;
		public userHeadIconOut2:Laya.Sprite;
		public userHeadIcon2:Laya.Image;
		public userHeadOffline2:Laya.Image;
		public userId2:laya.display.Text;
		public goldBg2:Laya.Image;
		public goldIcon2:Laya.Image;
		public gold2:laya.display.Text;
		public userName2:laya.display.Text;
		public zhuang2:Laya.Image;
		public sbSourceBian0:Laya.Image;
		public sbSourceBian1:Laya.Image;
		public userHead1:Laya.Sprite;
		public userHeadMask1:Laya.Image;
		public userHeadIconOut1:Laya.Sprite;
		public userHeadIcon1:Laya.Image;
		public userHeadOffline1:Laya.Image;
		public userId1:laya.display.Text;
		public goldBg1:Laya.Image;
		public goldIcon1:Laya.Image;
		public gold1:laya.display.Text;
		public userName1:laya.display.Text;
		public zhuang1:Laya.Image;
		public buttons:Laya.Box;
		public settingBtn:Laya.Button;
		public gameInfoBtn:Laya.Button;
		public gameSprite:Laya.Sprite;
		public turntable:Laya.Image;
		public turntableCenter:Laya.Sprite;
		public turntable1:Laya.Image;
		public turntable2:Laya.Image;
		public turntable3:Laya.Image;
		public turntable0:Laya.Image;
		public turntableNum1:Laya.Image;
		public turntableNum0:Laya.Image;
		public leftPaiCountSprite:Laya.Sprite;
		public freePayLength:laya.display.Text;
		public juName:laya.display.Text;
		public shouPai0:Laya.Sprite;
		public chi0:Laya.Sprite;
		public anGangHide0:Laya.Sprite;
		public anGang0:Laya.Sprite;
		public mingGang0:Laya.Sprite;
		public shou0:Laya.Image;
		public fa0:Laya.Image;
		public shouPai1:Laya.Sprite;
		public chi1:Laya.Sprite;
		public anGang1:Laya.Sprite;
		public anGangHide1:Laya.Sprite;
		public mingGang1:Laya.Sprite;
		public shou1:Laya.Image;
		public fa1:Laya.Image;
		public shouPai2:Laya.Sprite;
		public chi2:Laya.Sprite;
		public anGangHide2:Laya.Sprite;
		public anGang2:Laya.Sprite;
		public mingGang2:Laya.Sprite;
		public shou2:Laya.Image;
		public fa2:Laya.Image;
		public out0:Laya.Sprite;
		public outPai2:Laya.Image;
		public out3:Laya.Sprite;
		public outPai3:Laya.Image;
		public out2:Laya.Sprite;
		public outPai0:Laya.Image;
		public out1:Laya.Sprite;
		public outPai1:Laya.Image;
		public shouPai3:Laya.Sprite;
		public chi3:Laya.Sprite;
		public anGangHide3:Laya.Sprite;
		public mingGang3:Laya.Sprite;
		public anGang3:Laya.Sprite;
		public shou3:Laya.Sprite;
		public fa3:Laya.Sprite;
		public tingPaiSprite:Laya.Sprite;
		public tingPaiBg:Laya.Image;
		public tingPaiPaiSprite:Laya.Sprite;
		public tingPaiPai:Laya.Image;
		public waitSprite:Laya.Sprite;
		public inviteBtn:Laya.Button;
		public delRoomBtn:Laya.Button;
		public isAutoStart:Laya.CheckBox;
		public movieSprite:Laya.Sprite;
		public outPaiMovie3:Laya.Sprite;
		public outPaiMovie2:Laya.Sprite;
		public outPaiMovie1:Laya.Sprite;
		public outPaiMovie0:Laya.Sprite;
		public bianMove:Laya.Sprite;
		public sourcePai:Laya.Image;
		public sourceBian0:Laya.Image;
		public sourceBian1:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":1920,"text":"剩余：7盘","sizeGrid":"70,70,70,70,1","height":1080},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":1920,"var":"bg","height":1080},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1920,"var":"bgImage","skin":"ui/game/bg.png","sizeGrid":"150,150,150,150,1","height":1080}},{"type":"Image","props":{"y":0,"x":0,"width":327,"skin":"ui/game/room_info_bg.png","scaleY":1,"scaleX":1,"height":83},"child":[{"type":"Label","props":{"y":13,"x":5,"width":304,"var":"roomCheckId","text":"房间号: 0000000","height":39,"fontSize":38,"color":"#ffffff","align":"center"}}]},{"type":"Label","props":{"y":92.4,"x":4.799999999999993,"width":164,"var":"leftGameNums","text":"剩余：7盘","height":42,"fontSize":34,"color":"#ffffff","align":"center"}}]},{"type":"Sprite","props":{"y":0,"x":3,"var":"heads"},"child":[{"type":"Sprite","props":{"y":589,"x":0,"width":153,"var":"userHead3","scaleY":1.3,"scaleX":1.3,"height":217},"child":[{"type":"Image","props":{"y":57,"x":7,"width":133,"skin":"ui/game/user_head_bg.png","height":133},"child":[{"type":"Image","props":{"y":0,"x":0,"width":133,"var":"userHeadMask3","skin":"ui/game/user_head_mask.png","height":133}},{"type":"Sprite","props":{"y":0,"x":0,"width":133,"var":"userHeadIconOut3","height":133},"child":[{"type":"Image","props":{"y":4,"x":6.999999999999886,"width":119,"var":"userHeadIcon3","skin":"ui/game/user_head_default.png","pivotY":0,"pivotX":0,"height":115}},{"type":"Image","props":{"y":0,"x":0,"var":"userHeadOffline3","skin":"ui/game/user_head_offline.png"}}]}]},{"type":"Text","props":{"y":32,"x":7,"width":127,"var":"userId3","text":"ID:7777777","height":19,"fontSize":20,"color":"#f8f8f8","align":"center"}},{"type":"Image","props":{"y":185,"x":-5,"width":193,"var":"goldBg3","skin":"ui/game/gold_bg.png","sizeGrid":"18,19,19,29","scaleY":0.8,"scaleX":0.8,"height":38},"child":[{"type":"Image","props":{"y":-1,"x":1,"var":"goldIcon3","skin":"ui/game/icon_gold.png"}},{"type":"Text","props":{"y":4,"x":42,"width":140,"var":"gold3","text":888888,"height":35,"fontSize":28,"color":"#ffcc01","align":"center"}}]},{"type":"Text","props":{"y":0,"x":-2,"width":147,"var":"userName3","text":"用户名称","height":31,"fontSize":28,"color":"#ffcc01","align":"center"}},{"type":"Image","props":{"y":39,"x":-7,"var":"zhuang3","skin":"ui/game/zhangjia.png"}}]},{"type":"Sprite","props":{"y":261,"x":0,"width":147,"var":"userHead0","scaleY":1.3,"scaleX":1.3,"height":216},"child":[{"type":"Image","props":{"y":55,"x":7,"width":133,"skin":"ui/game/user_head_bg.png","height":133},"child":[{"type":"Image","props":{"y":0,"x":0,"width":133,"var":"userHeadMask0","skin":"ui/game/user_head_mask.png","height":133}},{"type":"Sprite","props":{"y":0,"x":0,"width":133,"var":"userHeadIconOut0","height":133},"child":[{"type":"Image","props":{"y":4,"x":7,"width":119,"var":"userHeadIcon0","skin":"ui/game/user_head_default.png","pivotY":0,"pivotX":0,"height":115}},{"type":"Image","props":{"y":0,"x":0,"var":"userHeadOffline0","skin":"ui/game/user_head_offline.png"}}]}]},{"type":"Text","props":{"y":30,"x":8,"width":127,"var":"userId0","text":"ID:7777777","height":22,"fontSize":20,"color":"#f8f8f8","align":"center"}},{"type":"Image","props":{"y":183,"x":-5,"width":193,"var":"goldBg0","skin":"ui/game/gold_bg.png","sizeGrid":"18,19,19,29","scaleY":0.8,"scaleX":0.8,"height":38},"child":[{"type":"Image","props":{"y":-1,"x":1,"var":"goldIcon0","skin":"ui/game/icon_gold.png"}},{"type":"Text","props":{"y":4,"x":42,"width":140,"var":"gold0","text":888888,"height":35,"fontSize":28,"color":"#ffcc01","align":"center"}}]},{"type":"Text","props":{"y":1,"x":1,"width":142,"var":"userName0","text":"用户名称","height":31,"fontSize":28,"color":"#ffcc01","align":"center"}},{"type":"Image","props":{"y":37,"x":-7,"var":"zhuang0","skin":"ui/game/zhangjia.png"}}]},{"type":"Sprite","props":{"y":365,"x":1693,"width":172,"var":"userHead2","scaleY":1.3,"scaleX":1.3,"height":220},"child":[{"type":"Image","props":{"y":57,"x":14,"width":133,"skin":"ui/game/user_head_bg.png","height":133},"child":[{"type":"Image","props":{"y":0,"x":0,"width":133,"var":"userHeadMask2","skin":"ui/game/user_head_mask.png","height":133}},{"type":"Sprite","props":{"y":0,"x":0,"width":133,"var":"userHeadIconOut2","height":133},"child":[{"type":"Image","props":{"y":4,"x":7,"width":119,"var":"userHeadIcon2","skin":"ui/game/user_head_default.png","pivotY":0,"pivotX":0,"height":115}},{"type":"Image","props":{"y":0,"x":0,"var":"userHeadOffline2","skin":"ui/game/user_head_offline.png"}}]}]},{"type":"Text","props":{"y":31,"x":15,"width":127,"var":"userId2","text":"ID:7777777","height":19,"fontSize":20,"color":"#f8f8f8","align":"center"}},{"type":"Image","props":{"y":185,"x":3,"width":193,"var":"goldBg2","skin":"ui/game/gold_bg.png","sizeGrid":"18,19,19,29","scaleY":0.8,"scaleX":0.8,"height":38},"child":[{"type":"Image","props":{"y":-1,"x":1,"var":"goldIcon2","skin":"ui/game/icon_gold.png"}},{"type":"Text","props":{"y":3,"x":42,"width":140,"var":"gold2","text":888888,"height":35,"fontSize":28,"color":"#ffcc01","align":"center"}}]},{"type":"Text","props":{"y":0,"x":9,"width":141,"var":"userName2","text":"用户名称","height":31,"fontSize":28,"color":"#ffcc01","align":"center"}},{"type":"Image","props":{"y":39,"x":0,"var":"zhuang2","skin":"ui/game/zhangjia.png"}},{"type":"Image","props":{"y":228,"x":34,"var":"sbSourceBian0","skin":"ui/majiang/zheng_bg.png","scaleY":0.6,"scaleX":0.6},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":228,"x":93,"var":"sbSourceBian1","skin":"ui/majiang/zheng_bg.png","scaleY":0.6,"scaleX":0.6},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":5,"x":383,"width":169,"var":"userHead1","scaleY":1.3,"scaleX":1.3,"height":212},"child":[{"type":"Image","props":{"y":56,"x":14,"width":133,"skin":"ui/game/user_head_bg.png","height":133},"child":[{"type":"Image","props":{"y":0,"x":0,"width":133,"var":"userHeadMask1","skin":"ui/game/user_head_mask.png","height":133}},{"type":"Sprite","props":{"y":0,"x":0,"width":133,"var":"userHeadIconOut1","height":133},"child":[{"type":"Image","props":{"y":4,"x":7,"width":119,"var":"userHeadIcon1","skin":"ui/game/user_head_default.png","pivotY":0,"pivotX":0,"height":115}},{"type":"Image","props":{"y":0,"x":0,"var":"userHeadOffline1","skin":"ui/game/user_head_offline.png"}}]}]},{"type":"Text","props":{"y":29,"x":15,"width":127,"var":"userId1","text":"ID:7777777","height":19,"fontSize":20,"color":"#f8f8f8","align":"center"}},{"type":"Image","props":{"y":184,"x":4,"width":193,"var":"goldBg1","skin":"ui/game/gold_bg.png","sizeGrid":"18,19,19,29","scaleY":0.8,"scaleX":0.8,"height":38},"child":[{"type":"Image","props":{"y":-1,"x":1,"var":"goldIcon1","skin":"ui/game/icon_gold.png"}},{"type":"Text","props":{"y":3,"x":42,"width":140,"var":"gold1","text":888888,"height":35,"fontSize":28,"color":"#ffcc01","align":"center"}}]},{"type":"Text","props":{"y":0,"x":5,"width":146,"var":"userName1","text":"用户名称","height":31,"fontSize":28,"color":"#ffcc01","align":"center"}},{"type":"Image","props":{"y":38,"x":0,"var":"zhuang1","skin":"ui/game/zhangjia.png"}}]},{"type":"Box","props":{"y":1.9999999999999811,"x":1720.9999999999998,"width":240,"var":"buttons","scaleY":0.7,"scaleX":0.7,"height":150},"child":[{"type":"Button","props":{"y":0,"x":0,"width":120,"var":"settingBtn","stateNum":"1","skin":"base/shezhi.png","sizeGrid":"121,0,0,0","labelSize":40,"labelPadding":"50,0,0,0","labelColors":"#ffffff","label":"设置","height":150}},{"type":"Button","props":{"y":0,"x":120,"width":120,"var":"gameInfoBtn","stateNum":"1","skin":"base/history.png","sizeGrid":"121,0,0,0","labelSize":40,"labelPadding":"50,0,0,0","labelColors":"#ffffff","label":"玩法","height":150}}]}]},{"type":"Sprite","props":{"y":0,"x":0,"width":1920,"var":"gameSprite","height":1080},"child":[{"type":"Image","props":{"y":344,"x":861,"width":130,"var":"turntable","scaleY":2,"scaleX":2,"height":130},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":130,"var":"turntableCenter","height":130},"child":[{"type":"Image","props":{"skin":"ui/game/frame.png"}},{"type":"Image","props":{"y":0,"x":0,"var":"turntable1","skin":"ui/game/right.png"}},{"type":"Image","props":{"y":0,"x":0,"var":"turntable2","skin":"ui/game/up.png"}},{"type":"Image","props":{"y":0,"x":0,"var":"turntable3","skin":"ui/game/left.png"}},{"type":"Image","props":{"y":0,"x":0,"var":"turntable0","skin":"ui/game/down.png"}}]},{"type":"Image","props":{"y":47,"x":36,"width":30,"var":"turntableNum1","skin":"ui/game/0.png","height":40}},{"type":"Image","props":{"y":47,"x":64,"var":"turntableNum0","skin":"ui/game/0.png"}},{"type":"Sprite","props":{"y":112,"x":-49,"var":"leftPaiCountSprite","scaleY":0.75,"scaleX":0.75},"child":[{"type":"Text","props":{"y":21.5,"x":143,"width":180,"text":"剩余        张","fontSize":"32","color":"#45d482","align":"center"}},{"type":"Text","props":{"y":21.5,"x":207,"width":83,"var":"freePayLength","text":83,"fontSize":"32","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":21.5,"x":-31,"width":180,"var":"juName","text":"东风东局","fontSize":"32","color":"#45d482","align":"center"}}]}]},{"type":"Sprite","props":{"y":93,"x":192,"width":104,"var":"shouPai0","scaleY":0.65,"scaleX":0.65,"height":1102},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":104,"var":"chi0","height":212.00000000000006},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":60,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_33.png"}}]},{"type":"Image","props":{"y":120,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]}]},{"type":"Sprite","props":{"y":412,"x":0,"width":104,"var":"anGangHide0","height":207},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":33,"x":0,"skin":"ui/majiang/ce_an.png"}}]},{"type":"Sprite","props":{"y":208,"x":0,"width":104,"var":"anGang0","height":207},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":32,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]}]},{"type":"Sprite","props":{"y":616,"x":0,"width":104,"var":"mingGang0","height":212},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]},{"type":"Image","props":{"y":60,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]},{"type":"Image","props":{"y":120,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]},{"type":"Image","props":{"y":33,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]}]},{"type":"Image","props":{"y":828,"x":0,"width":53,"var":"shou0","skin":"ui/majiang/ce_li.png","height":132}},{"type":"Image","props":{"y":970,"x":0,"width":53,"var":"fa0","skin":"ui/majiang/ce_li.png","height":132}}]},{"type":"Sprite","props":{"y":0,"x":618,"width":1227,"var":"shouPai1","scaleY":0.8,"scaleX":0.8,"height":194},"child":[{"type":"Sprite","props":{"y":72,"x":0,"width":248,"var":"chi1","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":166,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":72,"x":255,"width":248,"var":"anGang1","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":83,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":166,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":-28,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":73.00000000000004,"x":511,"width":248,"var":"anGangHide1","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":83,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":166,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":-29,"x":83,"skin":"ui/majiang/zheng_an.png"}}]},{"type":"Sprite","props":{"y":72,"x":766.9999999999998,"width":248,"var":"mingGang1","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":166,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-31,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Image","props":{"y":72,"x":1028,"width":85,"var":"shou1","skin":"ui/majiang/zheng_li.png","height":125}},{"type":"Image","props":{"y":72,"x":1142,"width":85,"var":"fa1","skin":"ui/majiang/zheng_li.png","height":125}}]},{"type":"Sprite","props":{"y":100,"x":1721,"width":104,"var":"shouPai2","scaleY":0.65,"scaleX":-0.65,"height":1102},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":104,"var":"chi2","height":212},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":60,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_33.png"}}]},{"type":"Image","props":{"y":120,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]}]},{"type":"Sprite","props":{"y":412,"x":0,"width":104,"var":"anGangHide2","height":207},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":33,"x":0,"skin":"ui/majiang/ce_an.png"}}]},{"type":"Sprite","props":{"y":208,"x":0,"width":104,"var":"anGang2","height":207},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_an.png"}},{"type":"Image","props":{"y":32,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]}]},{"type":"Sprite","props":{"y":616,"x":0,"width":104,"var":"mingGang2","height":212},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]},{"type":"Image","props":{"y":60,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]},{"type":"Image","props":{"y":120,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]},{"type":"Image","props":{"y":33,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_0.png"}}]}]},{"type":"Image","props":{"y":828,"x":0,"width":53,"var":"shou2","skin":"ui/majiang/ce_li.png","height":132}},{"type":"Image","props":{"y":970,"x":0,"width":53,"var":"fa2","skin":"ui/majiang/ce_li.png","height":132}}]},{"type":"Sprite","props":{"y":287,"x":260,"width":177,"var":"out0","height":477},"child":[{"type":"Sprite","props":{"y":0,"x":36,"scaleY":0.65,"scaleX":0.65},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":175,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":234,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":293,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":351,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":409,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":467,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":526,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":584,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":642,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Sprite","props":{}}]},{"type":"Sprite","props":{"y":0,"x":106,"scaleY":0.65,"scaleX":0.65},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"outPai2","skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":175,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":234,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":293,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":351,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":409,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":467,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":526,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":584,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":642,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Sprite","props":{}}]}]},{"type":"Sprite","props":{"y":650,"x":607.5,"width":705,"var":"out3","height":185},"child":[{"type":"Sprite","props":{"y":0,"x":0,"scaleY":0.7,"scaleX":0.7},"child":[{"type":"Image","props":{"y":0,"x":169,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":85,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-8.12048840868686e-14,"x":0.9999999999999797,"var":"outPai3","skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":421,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":337,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":253,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":673,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":589,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":505,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":925,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":841,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":757,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":71,"x":0,"scaleY":0.7,"scaleX":0.7},"child":[{"type":"Image","props":{"y":0,"x":169,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":85,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-8.12048840868686e-14,"x":0.9999999999999797,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":421,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":337,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":253,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":673,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":589,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":505,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":925,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":841,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":757,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]}]},{"type":"Sprite","props":{"y":262,"x":1653,"width":176,"var":"out2","scaleX":-1,"height":477},"child":[{"type":"Sprite","props":{"y":0,"x":38,"scaleY":0.65,"scaleX":0.65},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":175,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":234,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":293,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":351,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":409,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":467,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":526,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":584,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":642,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Sprite","props":{}}]},{"type":"Sprite","props":{"y":0,"x":108,"scaleY":0.65,"scaleX":0.65},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":59,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":117,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":175,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":234,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":293,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":351,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":409,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":467,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":526,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":584,"x":0,"skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Image","props":{"y":642,"x":0,"var":"outPai0","skin":"ui/majiang/ce_bg.png"},"child":[{"type":"Image","props":{"y":7.105427357601002e-14,"x":0,"skin":"ui/majiang/ce_18.png"}}]},{"type":"Sprite","props":{}}]}]},{"type":"Sprite","props":{"y":176,"x":607.55,"width":704.9,"var":"out1","height":189.6},"child":[{"type":"Sprite","props":{"y":28,"x":0,"scaleY":0.7,"scaleX":0.7},"child":[{"type":"Image","props":{"y":0,"x":169,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":85,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-8.12048840868686e-14,"x":0.9999999999999797,"var":"outPai1","skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":421,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":337,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":253,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":673,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":589,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":505,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":925,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":841,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":757,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":100,"x":0,"scaleY":0.7,"scaleX":0.7},"child":[{"type":"Image","props":{"y":0,"x":169,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":85,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-8.12048840868686e-14,"x":0.9999999999999797,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":421,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":337,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":253,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":673,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":589,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":505,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":925,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":841,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":757,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]}]},{"type":"Sprite","props":{"y":839,"x":54.99999999999999,"width":1227,"var":"shouPai3","scaleY":1.4,"scaleX":1.4,"height":172},"child":[{"type":"Sprite","props":{"y":26,"x":0,"width":250,"var":"chi3","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":84,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_32.png"}}]},{"type":"Image","props":{"y":0,"x":168,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":26,"x":508,"width":250,"var":"anGangHide3","height":128},"child":[{"type":"Image","props":{"y":0,"x":84,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":-28,"x":84,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":168,"skin":"ui/majiang/zheng_an.png"}}]},{"type":"Sprite","props":{"y":26,"x":760,"width":248,"var":"mingGang3","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":166,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":-31,"x":83,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":26,"x":254,"width":250,"var":"anGang3","height":128},"child":[{"type":"Image","props":{"y":0,"x":84,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":0,"x":168,"skin":"ui/majiang/zheng_an.png"}},{"type":"Image","props":{"y":-28,"x":84,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":0,"x":1031,"width":82,"var":"shou3","pivotY":-26,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/shou_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/shou_32.png"}}]}]},{"type":"Sprite","props":{"y":0,"x":1144,"width":82,"var":"fa3","pivotY":-26,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"width":82,"skin":"ui/majiang/shou_bg.png","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/shou_0.png"}}]}]}]},{"type":"Sprite","props":{"y":939.9999999999999,"x":39.00000000000005,"var":"tingPaiSprite"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":87,"var":"tingPaiBg","skin":"ui/game/user_head_bg.png","sizeGrid":"26,26,26,26","scaleY":2,"scaleX":2,"height":72,"alpha":0.8}},{"type":"Text","props":{"y":58,"x":25,"text":"牌","fontSize":"38","color":"#cd5216"}},{"type":"Text","props":{"y":19,"x":25,"text":"听","fontSize":"38","color":"#cd5216"}},{"type":"Sprite","props":{"y":19.999999999999773,"x":73.00000000000009,"width":82,"var":"tingPaiPaiSprite","scaleY":0.7,"scaleX":0.7,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"width":82,"var":"tingPaiPai","skin":"ui/majiang/zheng_bg.png","height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]}]}]},{"type":"Sprite","props":{"y":3,"x":0,"width":1920,"var":"waitSprite","height":1080},"child":[{"type":"Button","props":{"y":512,"x":984,"width":393,"var":"inviteBtn","skin":"base/btn_normal.png","labelSize":60,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","label":"邀请好友","height":133}},{"type":"Button","props":{"y":511,"x":508,"width":403,"var":"delRoomBtn","skin":"base/btn_danger.png","labelSize":60,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","label":"解散房间","height":133}},{"type":"CheckBox","props":{"y":712,"x":726,"width":390,"var":"isAutoStart","skin":"base/checkbox.png","selected":true,"scaleY":1.2,"scaleX":1.2,"labelSize":52,"labelColors":"#cd5216","label":"人满自动开始","height":70}}]},{"type":"Sprite","props":{"var":"movieSprite","mouseEnabled":false},"child":[{"type":"Sprite","props":{"y":547,"x":888,"width":82,"var":"outPaiMovie3","scaleY":1.6,"scaleX":1.6,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":418,"x":1225,"width":82,"var":"outPaiMovie2","scaleY":1.6,"scaleX":1.6,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":290,"x":885,"width":82,"var":"outPaiMovie1","scaleY":1.6,"scaleX":1.6,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":418,"x":568,"width":82,"var":"outPaiMovie0","scaleY":1.6,"scaleX":1.6,"height":128},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Sprite","props":{"y":441,"x":659,"width":412,"var":"bianMove","scaleY":1.6,"scaleX":1.6,"height":129},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"sourcePai","skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":330,"var":"sourceBian0","skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":0,"x":239,"var":"sourceBian1","skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Text","props":{"y":15,"x":123,"width":85,"text":"变","height":83,"fontSize":"80","color":"#cd5216"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.GameTableUI.uiView);
        }
    }
}

module ui.test {
    export class JoinRoomUI extends View {
		public mainSprite:Laya.Sprite;
		public inputShow:Laya.Sprite;
		public inputSprite:Laya.Sprite;

        public static  uiView:any ={"type":"View","props":{"x":0,"width":930,"height":640},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":861,"var":"mainSprite","height":529},"child":[{"type":"Sprite","props":{"y":35,"x":2,"var":"inputShow"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":110,"skin":"base/number_bg.png","height":110},"child":[{"type":"Image","props":{"y":9,"x":26,"skin":"base/number/win/0.png"}}]},{"type":"Image","props":{"y":0,"x":148,"width":110,"skin":"base/number_bg.png","height":110},"child":[{"type":"Image","props":{"y":9,"x":26,"skin":"base/number/win/0.png"}}]},{"type":"Image","props":{"y":0,"x":295,"width":110,"skin":"base/number_bg.png","height":110},"child":[{"type":"Image","props":{"y":9,"x":26,"skin":"base/number/win/0.png"}}]},{"type":"Image","props":{"y":0,"x":443,"width":110,"skin":"base/number_bg.png","height":110},"child":[{"type":"Image","props":{"y":9,"x":26,"skin":"base/number/win/0.png"}}]},{"type":"Image","props":{"y":0,"x":590,"width":110,"skin":"base/number_bg.png","height":110},"child":[{"type":"Image","props":{"y":9,"x":26,"skin":"base/number/win/0.png"}}]},{"type":"Image","props":{"y":0,"x":738,"width":110,"skin":"base/number_bg.png","height":110},"child":[{"type":"Image","props":{"y":9,"x":26,"skin":"base/number/win/0.png"}}]}]},{"type":"Sprite","props":{"y":174,"x":0,"var":"inputSprite"},"child":[{"type":"Button","props":{"y":180,"x":719,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/0.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":0,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":29,"x":51,"skin":"base/number/win/1.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":180,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/2.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":360,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/3.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":540,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/4.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":715,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/5.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":180,"x":0,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/6.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":180,"x":180,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/7.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":180,"x":360,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/8.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":180,"x":540,"width":140,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":28,"x":42,"skin":"base/number/win/9.png","mouseEnabled":false}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.JoinRoomUI.uiView);
        }
    }
}

module ui.test {
    export class LoadingUI extends View {
		public bg:Laya.Image;
		public progressBar:Laya.ProgressBar;
		public progressBarLabel:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":1080},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1920,"var":"bg","skin":"ui/loading/bg.jpg","height":"1080"}},{"type":"ProgressBar","props":{"y":999,"x":346,"var":"progressBar","skin":"ui/loading/progress.png","sizeGrid":"11,7,12,7"}},{"type":"Label","props":{"y":1002,"x":346,"width":252,"var":"progressBarLabel","text":"加载中 100%","height":38,"fontSize":24,"color":"#ffffff","align":"center"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.LoadingUI.uiView);
        }
    }
}

module ui.test {
    export class LoginUI extends View {
		public bg:Laya.Sprite;
		public mainBg:Laya.Image;
		public mainSprite:Laya.Sprite;
		public buttonsSprite:Laya.Sprite;
		public testLoginBtn:Laya.Button;
		public weixinLoginBtn:Laya.Button;
		public agreeCheck:Laya.CheckBox;
		public agreeLink:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"text":"ID:3213124"},"child":[{"type":"Sprite","props":{"y":0,"x":0,"var":"bg"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1920,"var":"mainBg","skin":"ui/home/bg.jpg","height":1080}},{"type":"Image","props":{"y":216,"x":161,"width":419,"skin":"ui/home/mm.png","height":865}}]},{"type":"Sprite","props":{"width":1920,"var":"mainSprite","height":1080},"child":[{"type":"Sprite","props":{"y":255.5,"x":688,"width":544,"var":"buttonsSprite","height":569},"child":[{"type":"Button","props":{"y":315,"x":0,"width":272,"var":"testLoginBtn","skin":"base/btn_normal.png","scaleY":2,"scaleX":2,"labelSize":38,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":false,"label":"测试登录","height":71}},{"type":"Button","props":{"y":0,"x":0,"width":272,"visible":false,"var":"weixinLoginBtn","skin":"base/btn_normal.png","scaleY":2,"scaleX":2,"labelSize":38,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":false,"label":"微信登录","height":71}},{"type":"CheckBox","props":{"y":488,"x":76,"var":"agreeCheck","skin":"base/checkbox.png","labelSize":48,"labelColors":"#ffffff","labelBold":true,"label":" 同意"}},{"type":"Label","props":{"y":491,"x":272,"width":189,"var":"agreeLink","underlineColor":"#ff0300","underline":true,"text":"用户协议","height":53,"fontSize":48,"color":"#ffffff","bold":true}}]},{"type":"Text","props":{"y":1025.5,"x":0,"wordWrap":true,"width":1920,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防上当受骗。","fontSize":38,"color":"#ffffff","alpha":0.5,"align":"center"}},{"type":"Text","props":{"y":978.4999999999999,"x":0,"wordWrap":true,"width":1920,"text":"适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","fontSize":38,"color":"#ffffff","alpha":0.5,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.LoginUI.uiView);
        }
    }
}

module ui.test {
    export class MainUI extends View {
		public bg:Laya.Sprite;
		public mainBg:Laya.Image;
		public mainSprite:Laya.Sprite;
		public userHead:Laya.Sprite;
		public userHeadOut:Laya.Sprite;
		public userHeadMask:Laya.Image;
		public userHeadIconOut:Laya.Sprite;
		public userHeadIcon:Laya.Image;
		public addFangkaSprite:Laya.Sprite;
		public userId:laya.display.Text;
		public gold:laya.display.Text;
		public userName:laya.display.Text;
		public addBtn:Laya.Button;
		public notice:Laya.Sprite;
		public noticeBg:Laya.Image;
		public noticeLabel:Laya.Label;
		public createBtn:Laya.Button;
		public joinBtn:Laya.Button;
		public quitBtn:Laya.Button;
		public settingBtn:Laya.Button;
		public historyBtn:Laya.Button;
		public newNoticeSprite:Laya.Sprite;
		public newNotice:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"text":"ID:3213124"},"child":[{"type":"Sprite","props":{"y":0,"x":3,"width":1920,"var":"bg","height":1080},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"mainBg","skin":"ui/home/bg.jpg"}},{"type":"Image","props":{"y":217,"x":96,"width":419,"skin":"ui/home/mm.png","height":865}}]},{"type":"Sprite","props":{"y":0,"x":3,"width":1920,"var":"mainSprite","height":1080},"child":[{"type":"Sprite","props":{"y":9,"x":126,"width":370,"var":"userHead","scaleY":1.3,"scaleX":1.3,"height":168},"child":[{"type":"Sprite","props":{"y":12,"x":14,"width":530,"var":"userHeadOut","scaleY":0.25,"scaleX":0.25,"height":534},"child":[{"type":"Image","props":{"y":2,"x":-2,"width":133,"skin":"ui/game/user_head_bg.png","scaleY":4,"scaleX":4,"height":133},"child":[{"type":"Image","props":{"y":0,"x":0,"width":133,"var":"userHeadMask","skin":"ui/game/user_head_mask.png","height":133}},{"type":"Sprite","props":{"y":0,"x":0,"width":133,"var":"userHeadIconOut","height":133},"child":[{"type":"Image","props":{"y":4,"x":7,"width":119,"var":"userHeadIcon","skin":"ui/game/user_head_default.png","pivotY":0,"pivotX":0,"height":115}}]}]}]},{"type":"Sprite","props":{"y":19.00000000000002,"x":145.00000000000006,"width":219.99999999999983,"var":"addFangkaSprite","mouseThrough":false,"mouseEnabled":true,"height":121.99999999999997},"child":[{"type":"Text","props":{"y":46.000000000000036,"x":-1.0000000000000568,"width":204,"var":"userId","text":"ID:7777777","height":35,"fontSize":30,"color":"#ffcc01","align":"center"}},{"type":"Image","props":{"y":80.99999999999994,"x":5,"skin":"ui/game/gold_bg.png"}},{"type":"Text","props":{"y":84,"x":3,"width":183,"var":"gold","text":"房卡:888888","height":35,"fontSize":28,"color":"#ffcc01","align":"center"}},{"type":"Text","props":{"y":0,"x":0,"width":195,"var":"userName","text":"用户名称","height":46,"fontSize":40,"color":"#ffcc01","align":"center"}},{"type":"Button","props":{"y":76.99999999999997,"x":174.99999999999983,"var":"addBtn","skin":"ui/home/btn_add_gold.png"}}]}]},{"type":"Sprite","props":{"y":215.00000000000003,"x":476.99999999999983,"var":"notice"},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"noticeBg","skin":"ui/home/notice_bg.png"}},{"type":"Image","props":{"y":5,"x":3,"skin":"ui/home/notice_icon.png"}},{"type":"Label","props":{"y":12,"x":111,"width":897,"var":"noticeLabel","text":"我是跑马灯我是跑马灯我是跑马灯我是跑马灯我是跑马灯我是跑马灯我是跑马灯我是跑马灯","overflow":"hidden","height":40,"fontSize":40,"color":"#ffcc01","bold":false,"align":"left"}}]},{"type":"Sprite","props":{"y":352.25,"x":726},"child":[{"type":"Button","props":{"y":0,"x":0,"width":531,"var":"createBtn","skin":"ui/home/btn_create.png","height":595}},{"type":"Button","props":{"y":0,"x":554.0000000000002,"width":531,"var":"joinBtn","skin":"ui/home/btn_join.png","height":595}}]},{"type":"Button","props":{"y":16,"x":1384,"width":120,"var":"quitBtn","stateNum":"1","skin":"base/quit.png","sizeGrid":"121,0,0,0","labelSize":40,"labelPadding":"50,0,0,0","labelColors":"#ffffff","label":"退出","height":150}},{"type":"Button","props":{"y":13,"x":1523,"width":120,"var":"settingBtn","stateNum":"1","skin":"base/shezhi.png","sizeGrid":"121,0,0,0","labelSize":40,"labelPadding":"50,0,0,0","labelColors":"#ffffff","label":"设置","height":150}},{"type":"Button","props":{"y":16,"x":1662,"width":120,"var":"historyBtn","stateNum":"1","skin":"base/history.png","sizeGrid":"121,0,0,0","labelSize":40,"labelPadding":"50,0,0,0","labelColors":"#ffffff","label":"战绩","height":150}},{"type":"Sprite","props":{"y":316,"x":104,"var":"newNoticeSprite"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":373,"skin":"base/dialog_bg.png","scaleY":1.5,"scaleX":1.5,"height":445,"alpha":0.7}},{"type":"Text","props":{"y":56,"x":133,"width":278,"text":"健康游戏公告","height":56,"fontSize":"50","color":"#ffffff","alpha":0.8}},{"type":"Text","props":{"y":149,"x":72,"wordWrap":true,"width":414,"var":"newNotice","text":"健康游戏公告","height":442,"fontSize":"50","color":"#000000","alpha":0.8}}]},{"type":"Text","props":{"y":1035,"x":7,"wordWrap":true,"width":1920,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防上当受骗。","fontSize":"35","color":"#ffffff","alpha":0.5,"align":"center"}},{"type":"Text","props":{"y":988,"x":7,"wordWrap":true,"width":1920,"text":"适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","fontSize":"35","color":"#ffffff","alpha":0.5,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.MainUI.uiView);
        }
    }
}

module ui.test {
    export class OptDialogUI extends Dialog {
		public hu:Laya.Image;
		public peng:Laya.Image;
		public guo:Laya.Image;
		public gang:Laya.Image;
		public chi:Laya.Image;

        public static  uiView:any ={"type":"Dialog","props":{"width":1920,"height":1080},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"hu","skin":"ui/game/operat_hu.png"}},{"type":"Image","props":{"y":0,"x":560,"var":"peng","skin":"ui/game/operat_peng.png"},"child":[{"type":"Image","props":{"y":28,"x":162,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Image","props":{"y":0,"x":1188,"var":"guo","skin":"ui/game/operat_guo.png"}},{"type":"Image","props":{"y":0,"x":273,"var":"gang","skin":"ui/game/operat_gang.png"},"child":[{"type":"Image","props":{"y":28,"x":157,"skin":"ui/majiang/zheng_bg.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]},{"type":"Image","props":{"y":0,"x":881,"var":"chi","skin":"ui/game/operat_chi.png"},"child":[{"type":"Image","props":{"y":66,"x":154,"skin":"ui/majiang/zheng_bg.png","scaleY":0.5,"scaleX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":66,"x":199,"skin":"ui/majiang/zheng_bg.png","scaleY":0.5,"scaleX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]},{"type":"Image","props":{"y":66,"x":243,"skin":"ui/majiang/zheng_bg.png","scaleY":0.5,"scaleX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui/majiang/zheng_19.png"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.OptDialogUI.uiView);
        }
    }
}

module ui.test {
    export class PhoneDialogUI extends View {
		public mainSprite:Laya.Sprite;
		public oneStep:Laya.Sprite;
		public phoneInput:Laya.Label;
		public twoStep:Laya.Sprite;
		public codeBtn:Laya.Button;
		public codeInput:Laya.Label;
		public inputSprite:Laya.Sprite;
		public nextBtn:Laya.Button;
		public resumeBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":1435,"text":"手机号：","label":"下一步","height":650},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":1255,"var":"mainSprite","height":642},"child":[{"type":"Sprite","props":{"y":0,"x":151,"width":953,"var":"oneStep","height":167},"child":[{"type":"Label","props":{"y":50,"x":65,"width":230,"text":"手机号：","height":71,"fontSize":64,"color":"#c95a46","bold":true,"align":"center"}},{"type":"TextInput","props":{"y":34,"x":314,"width":581,"type":"text","skin":"base/number_bg.png","sizeGrid":"11,12,11,12","maxChars":13,"height":102,"fontSize":64,"editable":false,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":52,"x":334,"width":539,"var":"phoneInput","text":"00000000000000","height":64,"fontSize":64,"color":"#ffffff","align":"center"}}]},{"type":"Sprite","props":{"y":0,"x":107.5,"width":1040,"var":"twoStep","height":167},"child":[{"type":"TextInput","props":{"y":33,"x":300,"width":472,"type":"text","skin":"base/number_bg.png","sizeGrid":"11,12,11,12","height":102,"fontSize":64,"editable":false,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":54,"x":50,"width":232,"text":"验证码：","height":63,"fontSize":64,"color":"#c95a46","bold":true,"align":"center"}},{"type":"Button","props":{"y":37,"x":797,"width":198,"var":"codeBtn","skin":"base/btn_basic.png","labelSize":40,"labelPadding":"0,0,3,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":true,"label":"重新获取","height":95}},{"type":"Label","props":{"y":50,"x":317,"width":443,"var":"codeInput","text":"0000","height":67,"fontSize":64,"color":"#000000","align":"center"}}]},{"type":"Sprite","props":{"y":171,"x":21,"var":"inputSprite"},"child":[{"type":"Button","props":{"y":149,"x":982,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":85,"skin":"base/number/win/0.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":0,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":97,"skin":"base/number/win/1.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":246,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":87,"skin":"base/number/win/2.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":491,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":86,"skin":"base/number/win/3.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":735,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":84,"skin":"base/number/win/4.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":0,"x":983,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":87,"skin":"base/number/win/5.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":149,"x":0,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":86,"skin":"base/number/win/6.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":149,"x":247,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":86,"skin":"base/number/win/7.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":149,"x":491,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":86,"skin":"base/number/win/8.png","mouseEnabled":false}}]},{"type":"Button","props":{"y":149,"x":736,"width":230,"skin":"base/btn_basic.png","height":140},"child":[{"type":"Image","props":{"y":25,"x":86,"skin":"base/number/win/9.png","mouseEnabled":false}}]}]},{"type":"Button","props":{"y":498,"x":253,"width":300,"var":"nextBtn","skin":"base/btn_danger.png","scaleY":1.2,"scaleX":1.2,"labelSize":40,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":"true","label":"下一步","height":95}},{"type":"Button","props":{"y":498,"x":647,"width":300,"var":"resumeBtn","skin":"base/btn_normal.png","scaleY":1.2,"scaleX":1.2,"labelSize":40,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":"true","label":"重新输入","height":95}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.PhoneDialogUI.uiView);
        }
    }
}

module ui.test {
    export class RoomHistoryListUI extends View {
		public mainSprite:Laya.Sprite;
		public row:Laya.Sprite;
		public list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":1285,"text":"6盘","height":484},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":1285,"var":"mainSprite","height":484},"child":[{"type":"Sprite","props":{"y":1,"x":26,"width":907,"height":64},"child":[{"type":"Label","props":{"y":15,"x":-3,"width":390,"text":"房间号&日期","overflow":"hidden","height":52,"fontSize":48,"color":"#573a1e","bold":true,"align":"center"}},{"type":"Label","props":{"y":13,"x":431,"width":369,"text":"玩家","overflow":"hidden","height":54,"fontSize":48,"color":"#573a1e","bold":true,"align":"center"}},{"type":"Label","props":{"y":14,"x":729,"width":489,"text":"得分","overflow":"hidden","height":52,"fontSize":48,"color":"#573a1e","bold":true,"align":"center"}}]},{"type":"Sprite","props":{"y":81,"x":0,"width":1255.0000000803848,"var":"row","height":180.99999999999997},"child":[{"type":"Image","props":{"y":2,"x":1255,"width":3,"skin":"base/line_vertical.png","rotation":90,"height":1230}},{"type":"Label","props":{"y":136,"x":32,"width":368,"text":"（6盘）","overflow":"hidden","name":"chapterNums","height":28,"fontSize":30,"color":"#573a1e","bold":false,"align":"center"}},{"type":"Label","props":{"y":37,"x":32,"width":368,"text":"房间号:666666","overflow":"hidden","name":"roomId","height":46,"fontSize":38,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":96,"x":32,"width":368,"text":"2015年05月4日 18:44:23","overflow":"hidden","name":"date","height":28,"fontSize":30,"color":"#573a1e","bold":false,"align":"center"}},{"type":"Sprite","props":{"y":15.499999999999972,"x":491,"name":"names"},"child":[{"type":"Label","props":{"y":0,"x":0,"width":302,"text":"小草","overflow":"hidden","name":"user0","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":42.00000000000003,"x":0,"width":302,"text":"13401039814","overflow":"hidden","name":"user1","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":84.00000000000003,"x":0,"width":302,"text":"13401039814","overflow":"hidden","name":"user2","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":126.00000000000003,"x":0,"width":302,"text":"13401039814","overflow":"hidden","name":"user3","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}}]},{"type":"Sprite","props":{"y":14,"x":882,"name":"scores"},"child":[{"type":"Label","props":{"y":0,"x":0,"width":230,"text":"-1","overflow":"hidden","name":"score0","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":43.00000000000003,"x":0,"width":230,"text":"-2","overflow":"hidden","name":"score1","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":86.00000000000003,"x":0,"width":230,"text":"99","overflow":"hidden","name":"score2","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}},{"type":"Label","props":{"y":128.99999999999997,"x":0,"width":230,"text":"999","overflow":"hidden","name":"score3","height":38,"fontSize":34,"color":"#cd5216","bold":true,"align":"center"}}]}]},{"type":"List","props":{"y":81,"x":0,"width":1287,"var":"list","height":405}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.RoomHistoryListUI.uiView);
        }
    }
}

module ui.test {
    export class SettingDialogUI extends View {
		public mainSprite:Laya.Sprite;
		public yinxiaoSlider:Laya.HSlider;
		public yinyueSlider:Laya.HSlider;
		public yinxiaoCheckbox:Laya.CheckBox;
		public yinyueCheckbox:Laya.CheckBox;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":896,"text":"手机号：","label":"下一步","height":241},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":896,"var":"mainSprite","height":241},"child":[{"type":"Sprite","props":{"y":0,"x":0,"scaleY":1.2,"scaleX":1.2},"child":[{"type":"HSlider","props":{"y":23.999999999999982,"x":166.99999999999997,"var":"yinxiaoSlider","value":50,"skin":"base/hslider.png","scaleY":1.5,"scaleX":1.5}},{"type":"HSlider","props":{"y":113.00000000000001,"x":166.99999999999997,"var":"yinyueSlider","value":50,"skin":"base/hslider.png","scaleY":1.5,"scaleX":1.5}},{"type":"Text","props":{"y":30.999999999999996,"x":44.00000000000001,"width":91,"text":"音效","fontSize":"48","color":"#cd5216","bold":true}},{"type":"CheckBox","props":{"y":19.000000000000004,"x":626,"var":"yinxiaoCheckbox","stateNum":"2","skin":"base/volume.png","scaleY":1.5,"scaleX":1.5}},{"type":"CheckBox","props":{"y":103,"x":626,"var":"yinyueCheckbox","stateNum":"2","skin":"base/volume.png","scaleY":1.5,"scaleX":1.5}},{"type":"Text","props":{"y":125,"x":46.00000000000004,"width":91,"text":"音乐","fontSize":"48","color":"#cd5216","bold":true}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.SettingDialogUI.uiView);
        }
    }
}

module ui.test {
    export class TestLoginUI extends View {
		public input:Laya.TextInput;
		public confirmBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"TextInput","props":{"y":138,"x":116,"width":291,"var":"input","text":"a","height":62,"fontSize":40,"color":"#ffffff","borderColor":"#ffffff"}},{"type":"Button","props":{"y":260,"x":131,"width":300,"var":"confirmBtn","skin":"base/btn_danger.png","labelSize":40,"labelPadding":"0,0,6,0","labelColors":"#FFFFFF,#FFFFFF,#FFFFFF","labelBold":"true","label":"确定","height":95}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.test.TestLoginUI.uiView);
        }
    }
}

module ui.test {
    export class UserDialogUI extends View {
		public mainSprite:Laya.Sprite;
		public userHead:Laya.Sprite;
		public userHeadMask:Laya.Image;
		public userHeadIconOut:Laya.Sprite;
		public userHeadIcon:Laya.Image;
		public userId:laya.display.Text;
		public userName:laya.display.Text;
		public ip:laya.display.Text;
		public userInfo0:Laya.Box;
		public userInfo1:Laya.Box;
		public userInfo2:Laya.Box;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":731,"text":"距你：10公里","label":"下一步","height":650},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":731,"var":"mainSprite","height":674},"child":[{"type":"Sprite","props":{"y":66,"x":154.5,"width":422,"var":"userHead","height":168},"child":[{"type":"Sprite","props":{"y":-30,"x":-20,"scaleY":0.4,"scaleX":0.4},"child":[{"type":"Image","props":{"y":2,"x":-2,"width":133,"skin":"ui/game/user_head_bg.png","scaleY":4,"scaleX":4,"height":133},"child":[{"type":"Image","props":{"y":0,"x":0,"width":133,"var":"userHeadMask","skin":"ui/game/user_head_mask.png","height":133}},{"type":"Sprite","props":{"y":0,"x":0,"width":133,"var":"userHeadIconOut","height":133},"child":[{"type":"Image","props":{"y":4,"x":7,"width":119,"var":"userHeadIcon","skin":"ui/game/user_head_default.png","pivotY":0,"pivotX":0,"height":115}}]}]},{"type":"Sprite","props":{"y":38,"x":550,"scaleY":3,"scaleX":3},"child":[{"type":"Text","props":{"y":65.15384615384613,"width":208,"var":"userId","text":"ID:7777777","height":35,"fontSize":30,"color":"#573a1e","align":"center"}},{"type":"Text","props":{"y":1.1538461538460965,"width":208,"var":"userName","text":"用户名称","height":46,"fontSize":40,"color":"#573a1e","align":"center"}},{"type":"Text","props":{"y":117.15384615384616,"width":208,"var":"ip","text":"IP:192.168.3.2","height":35,"fontSize":30,"color":"#573a1e","align":"center"}}]}]}]},{"type":"Box","props":{"y":289,"x":54,"width":623,"var":"userInfo0","height":120},"child":[{"type":"Image","props":{"y":0,"x":618,"width":3,"skin":"base/line_vertical.png","rotation":90,"height":620}},{"type":"Text","props":{"y":31.5,"x":6,"width":246,"text":"小草：","name":"name","height":57,"fontSize":"50","color":"#000000","align":"left"}},{"type":"Text","props":{"y":62,"x":214,"width":433,"text":"距你：10公里","name":"distance","fontSize":"42","color":"#cd5216","align":"center"}},{"type":"Text","props":{"y":11,"x":216,"width":433,"text":"IP:192.168.3.2","name":"ip","fontSize":"42","color":"#cd5216","align":"center"}}]},{"type":"Box","props":{"y":415,"x":54,"width":623,"var":"userInfo1","height":120},"child":[{"type":"Image","props":{"y":0,"x":618,"width":3,"skin":"base/line_vertical.png","rotation":90,"height":620}},{"type":"Text","props":{"y":31.5,"x":6,"width":246,"text":"小草：","name":"name","height":57,"fontSize":"50","color":"#000000","align":"left"}},{"type":"Text","props":{"y":62,"x":214,"width":433,"text":"距你：10公里","name":"distance","fontSize":"42","color":"#cd5216","align":"center"}},{"type":"Text","props":{"y":11,"x":216,"width":433,"text":"IP:192.168.3.2","name":"ip","fontSize":"42","color":"#cd5216","align":"center"}}]},{"type":"Box","props":{"y":541,"x":54,"width":623,"var":"userInfo2","height":120},"child":[{"type":"Image","props":{"y":0,"x":618,"width":3,"skin":"base/line_vertical.png","rotation":90,"height":620}},{"type":"Text","props":{"y":31.5,"x":6,"width":246,"text":"小草：","name":"name","height":57,"fontSize":"50","color":"#000000","align":"left"}},{"type":"Text","props":{"y":62,"x":214,"width":433,"text":"距你：10公里","name":"distance","fontSize":"42","color":"#cd5216","align":"center"}},{"type":"Text","props":{"y":11,"x":216,"width":433,"text":"IP:192.168.3.2","name":"ip","fontSize":"42","color":"#cd5216","align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.UserDialogUI.uiView);
        }
    }
}

module ui.test {
    export class WaitUI extends Dialog {
		public main:Laya.Image;
		public text:laya.display.Text;

        public static  uiView:any ={"type":"Dialog","props":{"width":314,"height":263},"child":[{"type":"Image","props":{"y":0,"x":0,"width":314,"var":"main","skin":"base/wait_bg.png","height":263,"alpha":1},"child":[{"type":"Text","props":{"y":204,"x":17,"width":281,"var":"text","text":"正在加载","height":33,"fontSize":"30","color":"#ffffff","align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.test.WaitUI.uiView);
        }
    }
}
