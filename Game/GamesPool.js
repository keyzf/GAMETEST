/**
 * Created by chenkuan on 16/3/3.
 */

var Game = require('./Game.js');
function GamePools(){
    return this;
}

GamePools.prototype = {
    /**
     * 创建游戏
     * @returns {number}
     */
    createGame:function(option){
        var self = this;
        if(self.POOLS.length<self.MAX_POOLS_SIZE){

            // 当线程可用时,创建游戏
            var game = new Game(option);
            self.POOLS[option.gameid] = game;
            self.POOLS.length++;

            // 确定游戏的线程号
            game.PoolId =option.gameid;
            // 返回游戏
            return game;
        }else{
            console.log("游戏已满");
        }
    },
    /**
     * 杀掉游戏
     * @param gameId 游戏id
     * @returns {*}
     */
    killGame:function(gameId){
        this.POOLS.remove(gameId);
        this.POOLS.length--;
        return gameId;
    },
    /**
     * 游戏池
     */
    POOLS:{length:0},
    /**
     * 游戏池的最大容量
     */
    MAX_POOLS_SIZE:20
};

module.exports = new GamePools();