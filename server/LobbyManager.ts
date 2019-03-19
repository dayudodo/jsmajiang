//管理所有的连接和与其相关的用户信息及其房间信息
//所有的一切其实都与连接有关系？但是连接建立的时候，貌似还没有用户信息过来！只用户加入游戏之后才会有相关的信息
import * as _ from "lodash";
import { Player } from "./player";
import { Room } from "./room";

interface ConnInterface {
  socket_id: number,
  player: Player,
  room: Room
}
//room也添加进来，是为了方便添加用户或者删除，其实有点儿冗余，因为player里面包含有room信息
export class LobbyManager {
  public conn_array: Array<ConnInterface>
  public _id_seed: number
  public _user_id_seed: number;

  constructor() {
    this.conn_array = [];
    this._id_seed = 0
    this._user_id_seed = 100
  }
  generate_socket_id() {
    return ++this._id_seed
  }
  //其实这个方法应该放在Player中的，不过为了方便还是用大厅来制造唯一，道理也能说通，大厅是第一道关口
  generate_user_id() {
    return ++this._user_id_seed
  }
  new_connect(socket) {
    this.conn_array.push({
      socket_id: socket.id,
      player: null,
      room: null
    });
  }
  dis_connect(socket): ConnInterface[] {
    let player = this.find_player_by(socket);
    let room = this.find_room_by(socket);
    if (player && room) {
      //todo:如果用户已经进入房间，还需要在房间里面断开连接，告诉其它人此用户已经掉线
    }
    let dc = _.remove(this.conn_array, item => item.socket_id == socket.id);
    // console.dir(this.conn_array);
    // console.dir(dc),dc其实是个数组，里面包含了你删除的那几个元素，找不到会返回个空数组
    socket.disconnect()
    return dc;
  }
  find_conn_by(socket): ConnInterface {
    return this.conn_array.find(item => item.socket_id == socket.id);
  }
  find_conn_by_username(name) {
    return this.conn_array.find(item => {
      if (item.player) {
        return item.player.username == name;
      } else {
        return false;
      }
    });
  }
  /**通过socket找到玩家所在的房间*/
  find_room_by(socket) {
    return this.find_conn_by(socket).room;
  }
  /**通过room_id查找存在的房间*/
  find_room_by_id(room_id) {
    let conn = this.conn_array.find(item => {
      if (item.room) {
        return item.room.id == room_id;
      } else {
        return false;
      }
    });
    return conn ? conn.room : null;
  }
  /**通过socket找到玩家 */
  find_player_by(socket): Player {
    return this.find_conn_by(socket).player;
  }
  /**所有连接计数 */
  get clients_count() {
    return this.conn_array.length;
  }
  /**所有玩家的姓名 */
  get player_names() {
    return this.conn_array.reduce((result, item) => {
      if (item.player) {
        result.push(item.player.username);
      }
      return result;
    }, []);
  }
}
