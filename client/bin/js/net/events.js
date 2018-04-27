var events;
(function (events) {
    events.client_testlogin = "client_testlogin";
    events.client_create_room = "client_create_room";
    events.client_join_room = "client_join_room";
    events.client_player_ready = "client_player_ready";
    events.client_unknown = "client_unknown";
    events.server_login = "server_login";
    events.server_welcome = "server_welcome";
    events.server_no_room = "server_no_room";
    events.server_room_full = "server_room_full";
    events.server_no_such_room = "server_no_such_room";
    events.server_create_room_ok = "server_create_room_ok";
    events.server_player_enter_room = "server_player_enter_room";
    events.server_other_player_enter_room = "server_other_player_enter_room";
    events.server_receive_ready = "server_receive_ready";
    events.server_game_start = "server_game_start";
    events.server_table_fa_pai = "server_table_fa_pai";
})(events || (events = {}));
//# sourceMappingURL=events.js.map