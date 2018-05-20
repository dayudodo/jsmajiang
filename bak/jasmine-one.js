import { MajiangAlgo, checkValidAndReturnArr } from "../../server_build/MajiangAlgo";

var Majiang = new MajiangAlgo()
describe('Base is', function () {
    it("卡五星", function () {
        let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
        let na_pai = "b5";
        let group_shoupai = {
            anGang: [],
            mingGang: [],
            peng: [],
            shouPai: str.split(" ")
        };
        expect(Majiang.HuisKaWuXing(group_shoupai, na_pai)).toBe(false)
    })
})