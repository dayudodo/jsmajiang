  function processGang(player, pai_name) {  //room.prototype
    let _canNormal = false; //是否能够正常发牌，需要返回
    console.log(
      `房间${this.id}内发现玩家${player.username}可以杠牌${pai_name}`
    );
    player.socket.emit("server_canGang", pai_name, answer => {
      //1是想杠，2是想碰
      switch (answer) {
        case config.WANT_PENG:
          console.log(`玩家${player.username}能杠，但决定碰牌:${pai_name}`);
          player.receive_pai(pai_name); //碰之后此牌就属于本玩家了,前后台都需要添加!
          //当前玩家顺序改变
          this.current_player = player;
          //再打牌后就能够正常发牌了
          _canNormal = true;
          break;
        case config.WANT_GANG:
          console.log(`玩家${player.username}能杠决定杠牌:${pai_name}`);
          player.receive_pai(pai_name); //碰之后此牌就属于本玩家了,前后台都需要添加!
          //当前玩家顺序改变，且杠之后还要从最后拿张牌发给他
          // this.current_player = p;
          this.gang_fa_pai(player);
          //再打牌后就能够正常发牌了
          _canNormal = true;
          break;
        default:
          //不是这两个值，就是放弃了
          console.log(`玩家${player.username}放弃杠牌:${pai_name}`);
          _canNormal = true; //正常发牌
          this.fa_pai(this.next_player);
          break;
      }
    });
    return _canNormal;
  }