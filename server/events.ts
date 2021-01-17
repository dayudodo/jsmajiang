//所有的事件均在此，分为server,client两大类

  export const client_testlogin = "client_testlogin";
  export const client_create_room = "client_create_room"
  export const client_join_room = "client_join_room"
  export const client_player_ready = "client_player_ready"
  export const client_unknown = "client_unknown"
  export const client_da_pai = "client_da_pai"
  export const client_restart_game = "client_restart_game"

  export const client_confirm_hu = "client_confirm_hu"
  export const client_confirm_ting = "client_confirm_ting"
  export const client_confirm_liang = "client_confirm_liang"
  export const client_confirm_gang = "client_confirm_gang"
  export const client_confirm_peng = "client_confirm_peng"
  export const client_confirm_guo = "client_confirm_guo"
  export const clientCreatorDissolve = "clientCreatorDissolve"

  export const server_login = "server_login";
  export const server_welcome = "server_welcome";
  export const server_no_room = "server_no_room";
  export const server_room_full = "server_room_full";
  export const server_no_such_room = "server_no_such_room";
  export const server_create_room_ok = "server_create_room_ok";
  export const server_player_enter_room = "server_player_enter_room";
  export const server_other_player_enter_room = "server_other_player_enter_room";
  export const server_receive_ready = "server_receive_ready";
  export const server_game_start = "server_game_start";
  export const server_table_fa_pai = "server_table_fa_pai";
  export const server_table_fa_pai_other = "server_table_fa_pai_other";
  export const server_dapai = "server_dapai";
  export const server_dapai_other = "server_dapai_other";
  export const server_dissolve = "server_dissolve";
  export const server_ping = "server_ping";
  /**当有玩家碰、杠的时候，打牌玩家的牌会消失 */
  export const server_dapai_disappear = "server_dapai_disappear";
  //表明服务器里面已经处理好了玩家的操作。
  export const server_peng = "server_peng";
  export const server_mingGang = "server_mingGang";
  export const server_liang = "server_liang";
  export const server_gameover = "server_gameover";
  export const server_winner = "server_winner";

  export const server_can_select = "server_can_select";
  export const server_can_dapai = "server_can_dapai";

