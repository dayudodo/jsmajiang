namespace mj.utils
{
    import Node = laya.display.Node;
    import Sprite=laya.display.Sprite;
    import Event = laya.events.Event;
    import Button = laya.ui.Button;
    import Image = laya.ui.Image;

    /**
     * @author dayudodo@gmail.com 2018/4/28.
     */
    export class LayaUtils
    {
        constructor ()
        {
        }

        public static clone(node:Node):Node
        {
            var i: Number;
            if (node instanceof Image)
            {
                // var image:Image = new Image(node);
                var image: Image = node  as Image 

                var distImage:Image = new Image();
                this.copyAttri(distImage, image);

                distImage.skin = image.skin;
                distImage.sizeGrid = image.sizeGrid;

                for (let i = 0; i < image.numChildren; i++)
                {
                    distImage.addChild(this.clone(image.getChildAt(i)));
                }
                return distImage as Node;
            }
            else if (node instanceof Sprite)
            {
                var sprite:Sprite = node as Sprite;
                var distSprite:Sprite = new Sprite();
                this.copyAttri(distSprite, sprite);

                for (let i = 0; i < node.numChildren; i++)
                {
                    distSprite.addChild(this.clone(node.getChildAt(i)));
                }
                return distSprite as Node;
            }
            else
            {
                throw new Error("不支持的类型:" + typeof node);
            }
        }

        private static copyAttri(dist:Sprite|Image, sprite:  Sprite|Image):void
        {
            dist.pos(sprite.x, sprite.y);
            dist.size(sprite.width, sprite.height);
            dist.scale(sprite.scaleX, sprite.scaleY);
            dist.pivot(sprite.pivotX, sprite.pivotY);
            dist.skew(sprite.skewX, sprite.skewY);
            dist.name = sprite.name
        }


        public  static handlerButton(btn:Button):void
        {
            btn.pivot(btn.width / 2, btn.height / 2);
            btn.pos(btn.x + btn.width / 2, btn.y + btn.height / 2);

            btn.on(Event.MOUSE_DOWN, btn, function ():void
            {
                btn.scale(0.85, 0.85);
            });
            btn.on(Event.MOUSE_UP, btn, function ():void
            {
                btn.scale(1, 1);
            });
            btn.on(Event.MOUSE_OUT, btn, function ():void
            {
                btn.scale(1, 1);
            });
        }

        public static random(max:number):number
        {
            return Math.floor(Math.random() * max);
        }
    }
}
