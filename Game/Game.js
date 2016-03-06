/**
 * Created by chenkuan on 16/3/3.
 */

var Msg = require('./Msg.js');
var CardsPool = require('./CardsPool.js');
var Player = require('./Player.js');
/**
 * 游戏类
 * @param option
 * @constructor
 */
function Game(option){
    var game = this;
    game.round = 1;// 回合数
    game.roundOwner = 1; // 出牌的玩家位置号
    game.stage = 1;//0.回合结束 1.摸牌阶段,2朝议阶段,3钻营阶段,4票拟阶段,5披红阶段,6结算阶段
    game.maxPlayers = 6;
    game.currentStage = 0; //当前阶段的游戏进度 0-100
    game.stageStartTime = Date.now(); //当前阶段开始时间
    game.PoolId = 0; // 游戏所属线程号
    game.isAlive=true; // 游戏是否活着
    game.actived=false; // 游戏是否正在运行

    game.stack_action=[];// 钻营牌+言官牌堆
    game.stack_zouzhang=[];// 奏章牌堆
    game.stack_guanzhi = []; //官职牌堆
    game.stack_guansheng = []; //官声牌堆
    game.discard = [];// 弃牌堆

    game.handLimit =5;// 每位玩家的手牌上限
    game.lucky = 5; // 国势 2-10
    game.over = function(){
        game.isAlive=false;
    };
    game.players = [];
    /**
     * 添加玩家
     */
    game.addPlayer = function (player) {
        game.players.push(player);// 将玩家加入游戏
        player.gameid = game.PoolId; // 将玩家的所属游戏设置为当前游戏,不能直接游戏对象,因为游戏对象需要引用玩家对象,会导致循环引用
        return player;
    };
    /**
     * 开始游戏
     * @returns {Msg|exports}
     */
    game.start = function(){
        if(game.actived)return new Msg("游戏正在运行请勿重复启动");
        if(game.players.length<4)return new Msg("玩家人数不足4人,请加入玩家");
        // 0.新建牌组,并洗牌
        game.stack_action = new CardsPool.actions();
        game.stack_zouzhang = new CardsPool.zouzhang();
        game.stack_guanzhi = new CardsPool.GuanZhi();
        game.stack_guansheng = new CardsPool.GuanSheng();

        // 洗牌
        game.stack_action.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        game.stack_zouzhang.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        game.stack_guanzhi.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        game.stack_guansheng.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        // 1.分配玩家座位
        for(var i=0;i<game.players.length;i++){
            game.players[i].setOrder = i;
            if(!game.players[i]){
                return new Msg("人数不足 "+i+" 号位 没人");
            }
        }
        // 2.设置游戏参数
        game.actived=true;
        // 2.1确定国势
        game.lucky = Math.round(Math.random()*10)||5;

        // 3.发牌
        for(i=0;i<game.players.length;i++){
            var player = game.players[i];
            // 先发官职和官声牌
            player.guanzhi = game.stack_guanzhi.shift();
            player.guansheng = game.stack_guansheng.shift();
            for(var j=0;j<game.handLimit;j++){
                // 先发钻营牌,每人5长
                player.handPile.push(game.stack_action.shift());
            }
        }
        // 4.开始游戏
        var _timer = setInterval(function () {
            if(!game.actived)clearInterval(_timer);// 游戏生命周期检查
            var player = game.players[game.roundOwner-1];
            player.play(game);
        },13);

        return new Msg("游戏运行中...");
    };

}

var game = new Game({player:6});
game.addPlayer(new Player({uid:2,avt:99}));
game.addPlayer(new Player({uid:2,avt:99}));
game.addPlayer(new Player({uid:2,avt:99}));
game.addPlayer(new Player({uid:2,avt:99}));
game.start();
console.log(game);
module.exports = Game;