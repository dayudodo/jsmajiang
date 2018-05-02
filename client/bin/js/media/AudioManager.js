var mj;
(function (mj) {
    var manager;
    (function (manager) {
        var Handler = laya.utils.Handler;
        var SoundManager = laya.media.SoundManager;
        var LayaUtils = mj.utils.LayaUtils;
        class AudioManager {
            AudioManager() {
            }
            playStartBgm() {
                let { bgmSoundChannel } = this;
                if (bgmSoundChannel) {
                    bgmSoundChannel.stop();
                }
                bgmSoundChannel = SoundManager.playMusic("audio/bgm2" + AudioManager.TYPE, 0);
            }
            playGame() {
                let { bgmSoundChannel } = this;
                if (bgmSoundChannel) {
                    bgmSoundChannel.stop();
                }
                bgmSoundChannel = SoundManager.playMusic("audio/bgm1" + AudioManager.TYPE, 0);
            }
            static getYinxiaoVolume() {
                return SoundManager.soundVolume;
            }
            static getMusicVolume() {
                return SoundManager.musicVolume;
            }
            static changeSoundEffect(number) {
                SoundManager.soundMuted = true;
                SoundManager.soundVolume = number;
                SoundManager.soundMuted = false;
            }
            static changeMusic(number) {
                SoundManager.musicMuted = true;
                SoundManager.musicVolume = number;
                SoundManager.musicMuted = false;
            }
            static changeSoundEffectMuted(selected) {
                SoundManager.soundMuted = selected;
            }
            static changeMusicMuted(selected) {
                SoundManager.musicMuted = selected;
            }
            static getSoundEffectMuted() {
                return SoundManager.soundMuted;
            }
            static getMusicMuted() {
                return SoundManager.musicMuted;
            }
            /**
             * 0:女生,1:男生,2:未知
             */
            static paiOut(sex, pai) {
                var sexStr = sex == 0 ? "woman" : "man";
                this.play("audio/pu_" + sexStr + "/pai_" + pai);
                this.play("audio/common/card_out");
            }
            /**
             * 点击牌时的声音
             */
            static paiClick() {
                this.play("audio/common/card_click");
            }
            /**
             * 处理牌
             */
            static dealCard() {
                this.play("audio/common/deal_card");
            }
            /**
             * enter
             */
            static enter() {
                this.play("audio/common/enter");
            }
            static win(sex, fangPaoIndex, fan) {
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
            }
            /**
             * 流局声音
             */
            static liuJu() {
                this.play("audio/common/liuju");
            }
            /**
             * 失败声音
             */
            static lose() {
                this.play("audio/common/lose");
            }
            /**
             * 停止计时警告
             */
            static stopTimeupAlarm() {
                let { isTimeupAlarmSoundChannel } = this;
                if (isTimeupAlarmSoundChannel) {
                    isTimeupAlarmSoundChannel.stop();
                    isTimeupAlarmSoundChannel = null;
                }
            }
            /**
             * 时间不够了
             */
            static timeupAlarm() {
                let { isTimeupAlarmSoundChannel } = this;
                if (isTimeupAlarmSoundChannel) {
                    return;
                }
                isTimeupAlarmSoundChannel = this.play("audio/common/timeup_alarm", Handler.create(null, () => {
                    isTimeupAlarmSoundChannel = null;
                }));
            }
            static buttonClick() {
                this.play("audio/common/button_click");
            }
            static play(url, complete = null) {
                return SoundManager.playSound(url + AudioManager.TYPE, 1, complete);
            }
            static gang(sex) {
                this.playOpt("gang", sex, 3);
            }
            static peng(sex) {
                this.playOpt("peng", sex, 5);
            }
            static chi(sex) {
                this.playOpt("chi", sex, 4);
            }
            static playOpt(type, sex, nums) {
                var sexStr = sex == 0 ? "woman" : "man";
                this.play("audio/pu_" + sexStr + "/" + type + (LayaUtils.random(nums) + 1));
            }
        }
        AudioManager.TYPE = ".mp3";
        AudioManager.instance = new AudioManager();
        manager.AudioManager = AudioManager;
    })(manager = mj.manager || (mj.manager = {}));
})(mj || (mj = {}));
//# sourceMappingURL=AudioManager.js.map