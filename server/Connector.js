//管理所有的连接和与其相关的用户信息及其房间信息
//所有的一切其实都与连接有关系？但是连接建立的时候，貌似还没有用户信息过来！只用户加入游戏之后才会有相关的信息
import _ from "lodash";

//room也添加进来，是为了方便添加用户或者删除，其实有点儿冗余，因为player里面包含有room信息
export class Connector {
  constructor() {
    this.conn_array = [];
  }
  new_connect(socket) {
    this.conn_array.push({
      socket_id: socket.id,
      player: null,
      room: null
    });
  }
  dis_connect(socket) {
    let player = this.get_player(socket);
    let room = this.get_player(socket);
    if (player && room) {
      //todo:如果用户已经进入房间，还需要在房间里面断开连接，告诉其它人此用户已经掉线
    }
    let dc = _.remove(this.conn_array, item => item.socket_id == socket.id);
    // console.dir(this.conn_array);
    // console.dir(dc),dc其实是个数组，里面包含了你删除的那几个元素，找不到会返回个空数组
    return dc;
  }
  find_conn_by(socket) {
    return this.conn_array.find(item => item.socket_id == socket.id);
  }
  find_conn_by_username(name){
    return this.conn_array.find(item=>{
      if (item.player) {
        return item.player.username == name
      }else{
        return false
      }
    })
  }
  get_player(socket) {
    return this.find_conn_by(socket).player;
  }
  //通过socket_id找到玩家所在的房间
  get_room(socket) {
    return this.find_conn_by(socket).room;
  }
  get clients_count() {
    return this.conn_array.length;
  }
  get player_names(){
      return this.conn_array.reduce((result, item)=>{
          if (item.player) {
              result.push(item.player.username)
          }
          return result
      },[])
  }
}
