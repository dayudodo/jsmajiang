/**房间类，所有本房间玩家的通信、算法均在此管理 */
declare class Room {
  static make():void
  /** 将person加入到内部数组this.players中*/
  static join_player(person: Player):void
  static player_enter_room(socket: WebSocket):void

  
}