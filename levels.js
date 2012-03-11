Enemy = enchant.Class.create(enchant.animation.Sprite, {
    initialize:function(start) {
        enchant.animation.Sprite.call(this, 32, 32);
        this.image = game.assets["chara1.gif"];
        this.frame = (Math.random() * 5 | 0) + 1;
        this.scaleX = -1;
        this.x = 320;
        if(arguments.length === 0) this.y = (Math.random() * 10 | 0) * 32;
        else this.y = start;
        this.onenterframe = function() {
            this.x += this.dx;
            this.y += this.dy;
            this.frameCount -= 1;
            if(this.frameCount <= 0) {
                this.x = this.target.x;
                this.y = this.target.y;
                this.update();
            }
        }
        this.update();
    },
    update:function() {
        this.target = {x:this.x, y:this.y}
        if(Math.random() > 0.5) this.target.x = (Math.random() * 10 | 0) * 32;
        else this.target.y = (Math.random() * 10 | 0) * 32;
        var len = Math.abs(this.target.x - this.x) + Math.abs(this.target.y - this.y);
        this.frameCount = 180 * len / 320;
        this.dx = (this.target.x - this.x) / this.frameCount;
        this.dy = (this.target.y - this.y) / this.frameCount;
    }
});

EnemyAim = enchant.Class.create(enchant.animation.Sprite, {
    initialize:function(player, start) {
        enchant.animation.Sprite.call(this, 32, 32);
        this.backgroundColor = "red";
        this.x = 320;
        if(arguments.length < 1) this.y = (Math.random() * 10 | 0) * 32;
        else this.y = start;
        this.player = player;
        this.onenterframe = function() {
            this.x += this.dx;
            this.y += this.dy;
            this.frameCount -= 1;
            if(this.frameCount <= 0) {
                this.x = this.target.x;
                this.y = this.target.y;
                this.update();
            }
        }
        this.update();
    },
    update:function() {
        this.target = {x:this.x, y:this.y}
        var dx = Math.abs(this.player.x - this.x);
        var dy = Math.abs(this.player.y - this.y);
        if(dx > dy) this.target.x = this.player.x;
        else this.target.y = this.player.y;
        var len = Math.abs(this.target.x - this.x) + Math.abs(this.target.y - this.y);
        this.frameCount = 180 * len / 320;
        this.dx = (this.target.x - this.x) / this.frameCount;
        this.dy = (this.target.y - this.y) / this.frameCount;
    }
});

EnemyZig = enchant.Class.create(enchant.animation.Sprite, {
    initialize:function(start, end) {
        enchant.animation.Sprite.call(this, 32, 32);
        this.backgroundColor = "red";
        this.x = 320;
        this.y = start;
        var that = this;
        var center = (320 - this.width) / 2;
        this.animation.pushTween({
            time:30,x:center,y:start
        }).pushTween({
            time:30,x:center,y:end
        }).pushTween({
            time:30,x:-64,y:end
        }).then(function(){
            that.scene.removeChild(that);
        });
    }
});

EnemyBack = enchant.Class.create(enchant.animation.Sprite, {
    initialize:function(start) {
        enchant.animation.Sprite.call(this, 32, 32);
        this.backgroundColor = 'red';
        this.x = 320;
        this.y = start;
        var that = this;
        this.animation.pushTween({
            time:30, x:64, y:start
        }).pushTween({
            time:30, x:192, y:start
        }).pushTween({
            time:30, x:-64, y:start
        }).then(function() {
            that.scene.removeChild(that);
        });
    }
});

EnemyStop = enchant.Class.create(enchant.animation.Sprite, {
    initialize:function(start) {
        enchant.animation.Sprite.call(this, 32, 32);
        this.backgroundColor = 'red';
        this.x = 320;
        this.y = start;
        var that = this;
        this.animation.pushTween({
            time:9, x:256, y:start
        }).delay(9).pushTween({
            time:9, x:192, y:start
        }).delay(9).pushTween({
            time:9, x:128, y:start
        }).delay(9).pushTween({
            time:9, x:64, y:start
        }).delay(9).pushTween({
            time:9, x:0, y:start
        }).delay(9).pushTween({
            time:9, x:-64, y:start
        }).then(function() {
            that.scene.removeChild(that);
        });
    }
});

Level = enchant.Class.create({
    initialize: function() {
        this.nextFrame = 30;
        this.nextEnemies = [new Enemy(144)];//createPattern1();
    },
    onframe: function(frame, player) {
        var enemies = [];
        var bullets = [];
        var guns = [];
        if(frame >= this.nextFrame) {
            enemies = this.nextEnemies;
            this.updateEnemies(frame, player);
        }
        if(frame % 60 === 59){
            bullets.push(new Bullet);
        }
        if(frame % 690 === 449) {
            var gun = new Gun();
            gun.y = (320 - gun.height) / 2;
            guns.push(gun);
        }
        return {enemy:enemies, bullet:bullets, gun:guns, fin:false}
    },
    updateEnemies: function(frame, player) {
        this.nextEnemies = [];
        if(frame >= 900) {
            this.nextFrame = frame + 60;
            this.nextEnemies = [new Enemy, new Enemy, new Enemy];
        } else if(frame >= 450) {
            this.nextFrame = frame + 60;
            this.nextEnemies = [new Enemy, new Enemy];
        } else {
            this.nextFrame = frame + 60;
            this.nextEnemies = [new Enemy];
        }
    }
});

Level.patterns = [
    [
        function(){return [new Enemy(64), new Enemy(128), new Enemy(192)]},
        function(){return [new EnemyZig(64, 192)]},
        function(){return [new EnemyZig(192, 64)]},
        function(){return [new EnemyBack((Math.random()*5|0)*64)]},
    ],
];
