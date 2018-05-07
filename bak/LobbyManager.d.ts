/**大厅类 */
declare class LobbyManager{
  /**根据socket返回其对应的房间号 */
  static find_room_by_socket(socket: WebSocket): Room
}
