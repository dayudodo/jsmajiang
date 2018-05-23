import test from "ava";
import _ from "lodash"
import { TablePaiManager } from "../server_build/server/TablePaiManager.js";

var pais = TablePaiManager.zhuang_mopai_gang().sort()
console.log('====================================');
console.log(_.chunk(pais, 4));
console.log('====================================');