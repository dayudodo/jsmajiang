var mj;
(function (mj) {
    var manager;
    (function (manager) {
        var Handler = laya.utils.Handler;
        var SoundManager = laya.media.SoundManager;
        var LayaUtils = mj.utils.LayaUtils;
        var AudioManager = /** @class */ (function () {
            function AudioManager() {
            }
            AudioManager.prototype.AudioManager = function () {
            };
            AudioManager.prototype.playStartBgm = function () {
                var bgmSoundChannel = this.bgmSoundChannel;
                if (bgmSoundChannel) {
                    bgmSoundChannel.stop();
                }
                bgmSoundChannel = SoundManager.playMusic("audio/bgm2" + AudioManager.TYPE, 0);
            };
            AudioManager.prototype.playGame = function () {
                var bgmSoundChannel = this.bgmSoundChannel;
                if (bgmSoundChannel) {
                    bgmSoundChannel.stop();
                }
                bgmSoundChannel = SoundManager.playMusic("audio/bgm1" + AudioManager.TYPE, 0);
            };
            AudioManager.getYinxiaoVolume = function () {
                return SoundManager.soundVolume;
            };
            AudioManager.getMusicVolume = function () {
                return SoundManager.musicVolume;
            };
            AudioManager.changeSoundEffect = function (number) {
                SoundManager.soundMuted = true;
                SoundManager.soundVolume = number;
                SoundManager.soundMuted = false;
            };
            AudioManager.changeMusic = function (number) {
                SoundManager.musicMuted = true;
                SoundManager.musicVolume = number;
                SoundManager.musicMuted = false;
            };
            AudioManager.changeSoundEffectMuted = function (selected) {
                SoundManager.soundMuted = selected;
            };
            AudioManager.changeMusicMuted = function (selected) {
                SoundManager.musicMuted = selected;
            };
            AudioManager.getSoundEffectMuted = function () {
                return SoundManager.soundMuted;
            };
            AudioManager.getMusicMuted = function () {
                return SoundManager.musicMuted;
            };
            /**
             * 0:女生,1:男生,2:未知
             */
            AudioManager.paiOut = function (sex, pai) {
                var sexStr = sex == 0 ? "woman" : "man";
                this.play("audio/pu_" + sexStr + "/pai_" + pai);
                this.play("audio/common/card_out");
            };
            /**
             * 点击牌时的声音
             */
            AudioManager.paiClick = function () {
                this.play("audio/common/card_click");
            };
            /**
             * 处理牌
             */
            AudioManager.dealCard = function () {
                this.play("audio/common/deal_card");
            };
            /**
             * enter
             */
            AudioManager.enter = function () {
                this.play("audio/common/enter");
            };
            AudioManager.win = function (sex, fangPaoIndex, fan) {
                this.play("audio/common/win");
                var sexStr = sex == 0 ? "woman" : "man";
                if (fan == 1) {
                    this.play("audio/pu_" + sexStr + "/hu_xiaohu");
                }
                else if (fan > 8) {
                    this.play("audio/pu_" + sexStr + "/hu_da" + (LayaUtils.random(2) + 1));
                }
                else if (fangPaoIndex != -1) {
                    this.play("audio/pu_" + sexStr + "/hu_pao" + (LayaUtils.random(3) + 1));
                }
                else if (fan > 1 && fangPaoIndex == -1) {
                    this.play("audio/pu_" + sexStr + "/hu_zimo" + (LayaUtils.random(2) + 1));
                }
                else {
                    this.play("audio/pu_" + sexStr + "/hu_" + (LayaUtils.random(3) + 1));
                }
            };
            /**
             * 流局声音
             */
            AudioManager.liuJu = function () {
                this.play("audio/common/liuju");
            };
            /**
             * 失败声音
             */
            AudioManager.lose = function () {
                this.play("audio/common/lose");
            };
            /**
             * 停止计时警告
             */
            AudioManager.stopTimeupAlarm = function () {
                var isTimeupAlarmSoundChannel = this.isTimeupAlarmSoundChannel;
                if (isTimeupAlarmSoundChannel) {
                    isTimeupAlarmSoundChannel.stop();
                    isTimeupAlarmSoundChannel = null;
                }
            };
            /**
             * 时间不够了
             */
            AudioManager.timeupAlarm = function () {
                var isTimeupAlarmSoundChannel = this.isTimeupAlarmSoundChannel;
                if (isTimeupAlarmSoundChannel) {
                    return;
                }
                isTimeupAlarmSoundChannel = this.play("audio/common/timeup_alarm", Handler.create(null, function () {
                    isTimeupAlarmSoundChannel = null;
                }));
            };
            AudioManager.buttonClick = function () {
                this.play("audio/common/button_click");
            };
            AudioManager.play = function (url, complete) {
                if (complete === void 0) { complete = null; }
                return SoundManager.playSound(url + AudioManager.TYPE, 1, complete);
            };
            AudioManager.gang = function (sex) {
                this.playOpt("gang", sex, 3);
            };
            AudioManager.peng = function (sex) {
                this.playOpt("peng", sex, 5);
            };
            AudioManager.chi = function (sex) {
                this.playOpt("chi", sex, 4);
            };
            AudioManager.playOpt = function (type, sex, nums) {
                var sexStr = sex == 0 ? "woman" : "man";
                this.play("audio/pu_" + sexStr + "/" + type + (LayaUtils.random(nums) + 1));
            };
            AudioManager.TYPE = ".mp3";
            AudioManager.instance = new AudioManager();
            return AudioManager;
        }());
        manager.AudioManager = AudioManager;
    })(manager = mj.manager || (mj.manager = {}));
})(mj || (mj = {}));
//# sourceMappingURL=AudioManager.js.map