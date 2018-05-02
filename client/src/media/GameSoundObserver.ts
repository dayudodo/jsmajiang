module mj.manager
{
    import AudioManager = mj.manager.AudioManager;

    export class GameSoundObserver
    {
        constructor(){}

        public  onPaiOut(sex:number, pai:number):void
        {
            AudioManager.paiOut(sex, pai);
        }

        public  onPaiClick(pai:number):void
        {
            AudioManager.paiClick();
        }

        public  onGang(sex:number):void
        {
            AudioManager.gang(sex);
        }

        public  onPeng(sex:number):void
        {
            AudioManager.peng(sex);
        }

        public  onChi(sex:number):void
        {
            AudioManager.chi(sex);
        }

        public  onDealCard():void
        {
            AudioManager.dealCard();
        }

        public  onButtonClick():void
        {
            AudioManager.buttonClick();
        }

        public  onTimeupAlarm():void
        {
            AudioManager.timeupAlarm();
        }

        public  onStopTimeupAlarm():void
        {
            AudioManager.stopTimeupAlarm();
        }

        public  onEnter():void
        {
            AudioManager.enter();
        }
    }
}
