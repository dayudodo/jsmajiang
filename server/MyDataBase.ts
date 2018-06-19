import { Player } from "./player";

export class MyDataBase {
  private static instance: MyDataBase;
  constructor() {}
  public static getInstance() {
    if (!this.instance) {
      this.instance = new MyDataBase();
    }
    return this.instance;
  }
/**保存玩家数据到数据库中 */
  save(person: Player) {
    console.log(`todo: 保存玩家${person.username}的得分到数据库中...`);
  }
}
