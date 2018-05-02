module mj.manager
{
    import Handler=laya.utils.Handler;
    import SoundChannel=laya.media.SoundChannel;
    import SoundManager=laya.media.SoundManager;

    import LayaUtils = mj.utils.LayaUtils;

    export class AudioManager
    {
        private static TYPE:string = ".mp3";

        public static instance:AudioManager = new AudioManager();

        public  AudioManager()
        {
        }

        private  bgmSoundChannel:SoundChannel;

        public  playStartBgm():void
        {
            let {bgmSoundChannel} = this
            if (bgmSoundChannel)
            {
                bgmSoundChannel.stop();
            }
            bgmSoundChannel = SoundManager.playMusic("audio/bgm2" + AudioManager.TYPE, 0);
        }

        public  playGame():void
        {
            let {bgmSoundChannel} = this
            if (bgmSoundChannel)
            {
                bgmSoundChannel.stop();
            }
            bgmSoundChannel = SoundManager.playMusic("audio/bgm1" + AudioManager.TYPE, 0);
        }


        public static  getYinxiaoVolume():number
        {
            return SoundManager.soundVolume;
        }

        public static  getMusicVolume():number
        {
            return SoundManager.musicVolume;
        }


        public static  changeSoundEffect(number:number):void
        {

            SoundManager.soundMuted = true;
            SoundManager.soundVolume = number;
            SoundManager.soundMuted = false;
        }

        public static  changeMusic(number:number):void
        {
            SoundManager.musicMuted = true;
            SoundManager.musicVolume = number;
            SoundManager.musicMuted = false;
        }

        public static  changeSoundEffectMuted(selected:boolean):void
        {
            SoundManager.soundMuted = selected;
        }

        public static  changeMusicMuted(selected:boolean):void
        {
            SoundManager.musicMuted = selected;
        }



        public static  getSoundEffectMuted():boolean
        {
            return SoundManager.soundMuted;
        }

        public static  getMusicMuted():boolean
        {
            return SoundManager.musicMuted;
        }
        /**
         * 0:女生,1:男生,2:未知
         */
        public static  paiOut(sex:number, pai:number):void
        {
            var sexStr:string = sex == 0 ? "woman" : "man";
            this.play("audio/pu_" + sexStr + "/pai_" + pai);
            this.play("audio/common/card_out");
        }
        /**
         * 点击牌时的声音
         */
        public static  paiClick():void
        {
            this.play("audio/common/card_click");
        }

        /**
         * 处理牌
         */
        public static  dealCard():void
        {
            this.play("audio/common/deal_card");
        }

        /**
         * enter
         */
        public static  enter():void
        {
            this.play("audio/common/enter");
        }

        public static  win(sex:number, fangPaoIndex:number, fan:number):void
        {
            this.play("audio/common/win");

            var sexStr:string = sex == 0 ? "woman" : "man";
            if (fan == 1)
            {
                this.play("audio/pu_" + sexStr + "/hu_xiaohu");
            }
            else if (fan > 8)
            {
                this.play("audio/pu_" + sexStr + "/hu_da" + (LayaUtils.random(2) + 1));
            }
            else if (fangPaoIndex != -1)
            {
                this.play("audio/pu_" + sexStr + "/hu_pao" + (LayaUtils.random(3) + 1));
            }
            else if (fan > 1 && fangPaoIndex == -1)
            {
                this.play("audio/pu_" + sexStr + "/hu_zimo" + (LayaUtils.random(2) + 1));
            }
            else
            {
                this.play("audio/pu_" + sexStr + "/hu_" + (LayaUtils.random(3) + 1));
            }
        }
        /**
         * 流局声音
         */
        public static  liuJu():void
        {
            this.play("audio/common/liuju");
        }
        /**
         * 失败声音
         */
        public static  lose():void
        {
            this.play("audio/common/lose");
        }

        private static isTimeupAlarmSoundChannel:SoundChannel;
        /**
         * 停止计时警告
         */
        public static  stopTimeupAlarm():void
        {
            let { isTimeupAlarmSoundChannel} = this
            if (isTimeupAlarmSoundChannel)
            {
                isTimeupAlarmSoundChannel.stop();
                isTimeupAlarmSoundChannel = null;
            }
        }

        /**
         * 时间不够了
         */
        public static  timeupAlarm():void
        {
            let { isTimeupAlarmSoundChannel} = this   
            if (isTimeupAlarmSoundChannel)
            {
                return;
            }
            isTimeupAlarmSoundChannel = this.play("audio/common/timeup_alarm", Handler.create(null,  ()=>
            {
                isTimeupAlarmSoundChannel = null;
            }));
        }

        public static  buttonClick():void
        {
            this.play("audio/common/button_click");
        }


        private static  play(url:string, complete:Handler = null):SoundChannel
        {
            return SoundManager.playSound(url + AudioManager.TYPE, 1, complete);
        }

        public static  gang(sex:number):void
        {

            this.playOpt("gang", sex, 3);
        }

        public static  peng(sex:number):void
        {
            this.playOpt("peng", sex, 5);
        }

        public static  chi(sex:number):void
        {
            this.playOpt("chi", sex, 4);
        }

        private static  playOpt(type:string, sex:number, nums:number):void
        {
            var sexStr:string = sex == 0 ? "woman" : "man";
            this.play("audio/pu_" + sexStr + "/" + type + (LayaUtils.random(nums) + 1));
        }


    }
}
