import React from "react";
import ReactDOM from "react-dom";
import Images from "./Images";

export default class Rules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: ["b1", "b2"]
    };
  }
  render() {
    return (
      <div>
        <h2>牌型</h2>
        筒条两门和中发白，无东南西北风，共84张牌。
        <h2>出牌规则</h2>
        <li>
          不能吃牌，只能碰牌或者杠牌；听牌后如果没要求1番不能胡的话就可以逮炮，如果要求1番不能胡的话就只能自摸或者亮倒了；
        </li>
        <li>没有玩家胡牌，84张牌全部摸完； </li>
        <li>每个玩家摸起来的最后一张牌必须打出去； </li>
        <li>
          如果玩家开杠为最后一张牌，即使桌子上面还剩余一张牌，玩家都可以开杠；玩家抓了最后一张牌，有杠不许杠；
        </li>
        <li>最后打出去的一张牌，其他人可以胡这张牌，但是，不可以吃碰杠。</li>
        <h2>庄家</h2>
        <li>第一局随机确定庄家； </li>
        <li>
          亮倒荒庄的时候，一个玩家亮倒，亮倒的那个玩家要赔两个没有亮倒的玩家每人1个；亮倒玩家为下局庄家；
        </li>
        <li>一炮双响的时候，放炮玩家为下局庄家。</li>
        <h1>名词解释</h1>
        <h2>将</h2>
        任何一对牌就是一对将，比如：
        <Images results={["b1", "b1"]} /> <Images results={["fa", "fa"]} />
        <Images results={["t9", "t9"]} />
        <h2>杠</h2>
        <ol>
          <li>
            补杠：碰3条后又抓来一个3条，必须当时就杠 ，否则，不能再杠。二家各出1
            。{" "}
          </li>
          <li>
            暗杠：手上有暗刻时，必须直接杠或者选择不杠，不能碰后再杠。二家各出2
            。{" "}
          </li>
          <li>
            直杠：手上有三个3条，其他玩家打出一个3条。点杠者出双份；另外一家不出。{" "}
          </li>
          <li>
            玩家开杠为最后一张牌；只要桌子上还有一张牌，玩家都一样可以开杠。{" "}
          </li>
          <li>
            摸到最后一张牌，有杠（不管是什么杠）不可以开杠！因为桌子上面没有牌了！
            同时，打出去的这张牌（也是最后打出去的一张牌）其他人只可以胡这张牌，不可以吃碰杠。{" "}
          </li>
          <li>
            杠上杠：玩家开杠后打出的牌被别人杠或者自己继续杠，叫做“杠上杠”。
            杠上杠的要翻倍（第一杠不翻倍），如果杠完之后又被人杠或者自己杠，就再翻一倍，以此类推；每杠的钱都要算，不是只算最后一杠。
          </li>
        </ol>
        <h2>一句话</h2>
        三个或者四个牌的重复，或者连续的三张牌为一句话，如下：
        <Images results={["b1", "b2", "b3"]} />
        <Images results={["fa", "fa", "fa"]} />
        <Images results={["zh", "zh", "zh", "zh"]} />
        <h2>
          亮倒
        </h2>听牌后，可以选择把手中的牌亮出来给所有人看着打。亮倒后胡牌积分翻番；但喜钱不翻番。
        如果有玩家点炮，那么，点炮者出双份。
        亮倒后不可以换手中的牌，只能自摸胡牌；
        但是，可以进行：（1）补杠（2）暗杠（3）直杠。
        注意：玩家开暗杠和直杠必须在不影响听牌牌型的情况下进行。
        即暗杠和直杠的3张牌是独立的一句牌，不再和上下牌组合成其他牌型。
        如：在没有亮倒的情况下，玩家是23334567
        的牌型，抓到或者其他玩家出3，可以杠3，杠3后，不再是听牌牌型，是可以的。
        但是，在亮倒的情况下，23334567
        就不再可以杠3，因为杠3后就不再是听牌牌型了。
        <h2>
          包胡
        </h2>A已经报听亮倒牌，B打出了A亮倒后要赢的牌，那么，B放炮且包胡，B要按照A的糊牌大小赔2倍给A。C不出。
        <h2>荒庄</h2>84张牌全部摸完后依然没人胡牌为荒庄。荒庄不下庄、荒庄不荒杠—就是喜钱有效（杠牌后的喜钱）。
        <h2>杠</h2>开杠得喜钱，暗杠：×2番，明杠：×1；擦炮：×1　（碰的三张牌之后又自己摸了一张）
        包
        胡：A已经报听亮倒牌，B打出了A亮倒后要赢的牌，那么，B放炮且包胡，B要按照A的糊牌大小赔2倍给A。C不出。
        <h2>算番</h2>
        <table className="table table-strip">
          <thead>
            <tr>
              <th>胡牌类型　</th>
              <th>倍数</th>
              <th>输赢</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>碰碰胡</td>
              <td>×2</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>明四归一</td>
              <td>×2</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>暗四归一</td>
              <td>×4</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>七对</td>
              <td>×4</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>龙七对</td>
              <td>×8</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>双龙七对</td>
              <td>×16</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>大三元</td>
              <td>×8</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>小三元</td>
              <td>×4</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>杠上开花</td>
              <td>×2</td>
              <td>自摸2人出</td>
            </tr>
            <tr>
              <td>杠上炮</td>
              <td>×2</td>
              <td>放炮一人出</td>
            </tr>
            <tr>
              <td>抢杠胡</td>
              <td>×2</td>
              <td>放炮一人出</td>
            </tr>
            <tr>
              <td>清一色</td>
              <td>×4</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>手抓一</td>
              <td>×4</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>海底捞月</td>
              <td>×2</td>
              <td>自摸2人出</td>
            </tr>
            <tr>
              <td>亮倒</td>
              <td>×2</td>
              <td>自摸2人出 放炮一人出 。</td>
            </tr>
            <tr>
              <td>卡五星</td>
              <td>×2</td>
              <td>自摸2人出 放炮一人出</td>
            </tr>
            <tr>
              <td>直杠</td>
              <td>×2</td>
              <td>点杠者出双份 另外一家不出</td>
            </tr>
            <tr>
              <td>补杠(擦炮）</td>
              <td>×1</td>
              <td>二家都要出</td>
            </tr>
            <tr>
              <td>暗杠</td>
              <td>×2</td>
              <td>二家都要出</td>
            </tr>
          </tbody>
        </table>
        龙七对和双龙七对不再计算暗四归的番数。 以上各种胡牌类型之间番数相乘。
        例如： （1）清一色加七对就是：4×4=16番。
        （2）碰了的四对牌中有中发白3副刻子（杠），最后手中只剩一张牌且胡牌，那么就是：
        大三元+碰碰胡+手抓一：8×2×4=64番。如果有开杠，还需再加上喜钱番数。
      </div>
    );
  }
}