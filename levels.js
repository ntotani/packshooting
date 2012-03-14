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

EnemySeq = Class.create(Sprite, {
    initialize:function(x, y, seq, init) {
        Sprite.call(this, 32, 32);
        this.image = game.assets["chara1.gif"];
        this.frame = 1;
        if(seq.length <= 1) this.frame = 5;
        this.scaleX = -1;
        this.x = x;
        this.y = y;
        var anime = this.animation;
        var setSequence = function() {
            if(seq.length > 0) {
                seq.forEach(function(e){anime.pushTween(e);});
                anime.looped = true;
            }
        }
        if(arguments.length > 3) {
            anime.pushTween(init).then(function(){
                anime.clear();
                setSequence();
            });
        } else {
            setSequence();
        }
    }
});

EnemySeqRand = Class.create(EnemySeq, {
    initialize:function() {
        var seqNum = (Math.random() * 3 | 0) + 3;
        var prev = {time:30,x:Math.random()*288,y:Math.random()*288};
        var seq = [prev];
        var i;
        for(i=0; i<seqNum; i+=1) {
            var next = {time:30,x:Math.random()*288,y:Math.random()*288};
            if(Math.abs(prev.x - next.x) > Math.abs(prev.y - next.y)) {
                next.y = prev.y;
            } else {
                next.x = prev.x;
            }
            seq.push(next);
            prev = next;
        }
        var first = seq[0];
        var last = seq[seq.length - 1];
        seq.push({time:30, x:last.x, y:first.y});
        var init = [{x:-32,y:first.y},{x:320,y:first.y},{x:first.x,y:-32},{x:first.x,y:320}].sort(function(a, b) {
            return (Math.abs(first.x - a.x) + Math.abs(first.y - a.y)) - (Math.abs(first.x - b.x) + Math.abs(first.y - b.y));
        })[0];
        EnemySeq.call(this, init.x, init.y, seq);
    }
});

EnemyAim = Class.create(Sprite, {
    initialize:function(x, y, init) {
        Sprite.call(this, 32, 32);
        this.image = game.assets["chara1.gif"];
        this.frame = 11;
        this.scaleX = -1;
        this.x = x;
        this.y = y;
        var that = this;
        var anime = this.animation;
        if(arguments.length > 2) {
            anime.pushTween(init);
        }
        var update = function() {
            var x = that.x;
            var y = that.y;
            var time = 90;
            if(Math.abs(player.x - x) > Math.abs(player.y - y)) {
                time = time * Math.abs(player.x - x) / 160;
                x = player.x;
            } else {
                time = time * Math.abs(player.y - y) / 160;
                y = player.y;
            }
            anime.pushTween({time:time, x:x, y:y}).then(update);
        }
        update();
    }
});

Level = enchant.Class.create({
    initialize: function() {
        this.nextFrame = 30;
        this.nextEnemies = [new Enemy(144)];//createPattern1();
        var pat1 = {
            0:{
                enemies:[
                    new EnemySeq(320, 64, [{time:30,x:256,y:64},{time:30,x:64,y:64},{time:30,x:64,y:256},{time:30,x:256,y:256}]),
                    new EnemySeq(320, 256, [{time:30,x:256,y:256},{time:30,x:64,y:256},{time:30,x:64,y:64},{time:30,x:256,y:64}]),
                ],
            },
            30:{
                enemies:[
                    new EnemySeq(320, 64, [{time:30,x:256,y:64},{time:30,x:64,y:64},{time:30,x:64,y:256},{time:30,x:256,y:256}]),
                    new EnemySeq(320, 256, [{time:30,x:256,y:256},{time:30,x:64,y:256},{time:30,x:64,y:64},{time:30,x:256,y:64}]),
                ],
            },
            60:{
                enemies:[
                    new EnemySeq(320, 64, [{time:30,x:256,y:64},{time:30,x:64,y:64},{time:30,x:64,y:256},{time:30,x:256,y:256}]),
                    new EnemySeq(320, 256, [{time:30,x:256,y:256},{time:30,x:64,y:256},{time:30,x:64,y:64},{time:30,x:256,y:64}]),
                ],
            },
            90:{
                enemies:[
                    new EnemySeq(320, 64, [{time:30,x:256,y:64},{time:30,x:64,y:64},{time:30,x:64,y:256},{time:30,x:256,y:256}]),
                    new EnemySeq(320, 256, [{time:30,x:256,y:256},{time:30,x:64,y:256},{time:30,x:64,y:64},{time:30,x:256,y:64}]),
                ],
            },
            120:{
                bullets:[new Bullet(320, 152)],
            },
            200:{
                guns:[new Gun(320, 152)],
            },
        };
        var pat2 = {
            0:{
                enemies:[
                    new EnemySeq(320, 64, [{time:30,x:256,y:64},{time:30,x:64,y:64},{time:30,x:64,y:256},{time:30,x:256,y:256}]),
                    new EnemySeq(320, 256, [{time:30,x:256,y:256},{time:30,x:64,y:256},{time:30,x:64,y:64},{time:30,x:256,y:64}]),
                ],
            },
            30:{
                enemies:[
                    new EnemySeq(320, 112, [{time:90,x:256,y:112},{time:90,x:64,y:112}], {time:30,x:256,y:112})
                ],
            },
            60:{
                enemies:[
                    new EnemySeq(320, 176, [{time:90,x:256,y:176},{time:90,x:64,y:176}], {time:30,x:256,y:176})
                ],
            },
            120:{
                bullets:[new Bullet(320, 32), new Bullet(320, 276)],
            },
            280:{
                guns:[new Gun(320, 152)],
            }
        };
        var pat3 = {
            0:{
                enemies:[new EnemySeq(320, 144, [], {time:60,x:64,y:144})],
            },
            15:{
                enemies:[new EnemySeq(320, 144, [], {time:60,x:128,y:144})],
            },
            30:{
                enemies:[new EnemySeq(320, 144, [], {time:60,x:192,y:144})],
            },
            60:{
                enemies:[
                    new EnemySeq(320, 64, [{time:60,x:96,y:64},{time:60,x:96,y:256}], {time:30,x:96,y:64}),
                    new EnemySeq(320, 256, [{time:60,x:160,y:256},{time:60,x:160,y:64}], {time:30,x:160,y:256})
                ],
            },
            150:{
                bullets:[new Bullet(320, 256)],
            },
            310:{
                guns:[new Gun(320, 64)],
            }
        };
        var pat4 = {
            0:{enemies:[new EnemySeq(320, 64, [], {time:30,x:256,y:64})]},
            15:{enemies:[new EnemySeq(320, 128, [], {time:30,x:256,y:128})]},
            30:{enemies:[new EnemySeq(320, 192, [], {time:30,x:256,y:192})]},
            45:{enemies:[new EnemySeq(320, 256, [], {time:30,x:256,y:256})]},
            60:{enemies:[new EnemySeq(-32, 64, [], {time:30,x:64,y:64})]},
            75:{enemies:[new EnemySeq(-32, 128, [], {time:30,x:64,y:128})]},
            90:{enemies:[new EnemySeq(-32, 192, [], {time:30,x:64,y:192})]},
            105:{enemies:[new EnemySeq(-32, 256, [], {time:30,x:64,y:256})]},
            120:{
                enemies:[new EnemySeq(144, -32, [{time:120,x:144,y:256}, {time:120,x:144,y:64}])],
                bullets:[new Bullet(320, 256)],
            },
            150:{bullets:[new Bullet(320, 128)]},
            280:{guns:[new Gun(320, 64)]},
        };
        var pat5 = {
            0:{enemies:[new EnemySeq(64, -32, [], {time:30,x:64,y:64})]},
            15:{enemies:[new EnemySeq(128, -32, [], {time:30,x:128,y:64})]},
            30:{enemies:[new EnemySeq(192, -32, [], {time:30,x:192,y:64})]},
            45:{enemies:[new EnemySeq(256, -32, [], {time:30,x:256,y:64})]},
            60:{enemies:[new EnemySeq(256, 320, [], {time:30,x:256,y:256})]},
            75:{enemies:[new EnemySeq(192, 320, [], {time:30,x:192,y:256})]},
            90:{enemies:[new EnemySeq(128, 320, [], {time:30,x:128,y:256})]},
            105:{enemies:[new EnemySeq(64, 320, [], {time:30,x:64,y:256})]},
            120:{enemies:[new EnemyAim(320, 144, {time:60,x:256,y:144})]},
            280:{bullets:[new Bullet(320, 32)]},
            340:{bullets:[new Bullet(320, 32)]},
            400:{bullets:[new Bullet(320, 32)]},
            460:{guns:[new Gun(320, 152)]},
        };
        var pat6 = {
            0:{enemies:[new EnemyAim(320, 144, {time:60, x:256, y:144})]},
            30:{enemies:[new EnemyAim(144, 320, {time:60, x:144, y:256})]},
            60:{enemies:[new EnemyAim(-32, 144, {time:60, x:64, y:144})]},
            90:{enemies:[new EnemyAim(144, -32, {time:60, x:144, y:64})]},
            180:{bullets:[new Bullet(320, 64)]},
            240:{bullets:[new Bullet(320, 64)]},
            300:{bullets:[new Bullet(320, 64)]},
            360:{bullets:[new Bullet(320, 64)], guns:[new Gun(320, 256)]},
        };
        var pat7 = {
            0:{enemies:[new EnemySeq(320, 32, [{time:30,x:32,y:32},{time:30,x:32,y:256},{time:30,x:256,y:256},{time:30,x:256,y:32}])]},
            30:{enemies:[new EnemySeq(-32, 64, [{time:30,x:224,y:64},{time:30,x:224,y:224},{time:30,x:64,y:224},{time:30,x:64,y:64}])]},
            90:{enemies:[
                new EnemySeq(320, 32, [{time:300, x:0, y:32}]),
                new EnemySeq(320, 64, [{time:300, x:0, y:64}]),
                new EnemySeq(320, 96, [{time:300, x:0, y:96}]),
                new EnemySeq(320, 128, [{time:300, x:0, y:128}]),
                new EnemySeq(320, 160, [{time:300, x:0, y:160}]),
                new EnemySeq(320, 192, [{time:300, x:0, y:192}]),
                new EnemySeq(320, 224, [{time:300, x:0, y:224}]),
                new EnemySeq(320, 256, [{time:300, x:0, y:256}]),
            ]},
            120:{bullets:[new Bullet(320, 64), new Bullet(320, 256)]},
            150:{bullets:[new Bullet(320, 128), new Bullet(320, 192)]},
            180:{guns:[new Gun(320, 152)]},
            181:{fin:true}
        };
        var pat8 = {
            0:{enemies:[new EnemySeqRand()]}
        };
        var patJoin = function(patterns) {
            var pat = {}
            var prev = 0;
            patterns.forEach(function(e) {
                var diff = e.diff;
                var i;
                var last = prev;
                for(i in e.pattern) {
                    if(e.pattern.hasOwnProperty(i)) {
                        last = prev + diff + parseInt(i);
                        pat[last] = e.pattern[i];
                    }
                }
                prev = last;
            });
            return pat;
        }
        this.frame2entities = patJoin([
                {diff:0,pattern:pat1},
                {diff:240,pattern:pat2},
                {diff:240,pattern:pat3},
                {diff:180,pattern:pat4},
                {diff:240,pattern:pat5},
                {diff:240,pattern:pat6},
                {diff:240,pattern:pat7},
                ]);
        //this.frame2entities = pat7;
    },
    onframe: function(frame) {
        var enemies = [];
        var bullets = [];
        var guns = [];
        /*if(frame >= this.nextFrame) {
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
        }*/
        var entities = this.frame2entities[frame];
        if(entities) {
            if(entities.enemies)
                enemies = entities.enemies;
            if(entities.bullets)
                bullets = entities.bullets;
            if(entities.guns)
                guns = entities.guns;
            if(entities.fin)
                this.fin = true;
        }
        if(this.fin) {
            if(frame % 60 === 0) enemies.push(new EnemySeqRand());
            if(frame % 60 === 30) bullets.push(new Bullet(320, Math.random() * 320));
            if(frame % 690 === 0) guns.push(new Gun(320, Math.random() * 320));
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
