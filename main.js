enchant(); // ライブラリーの初期化

window.onload = function () {
    //box2dのための変数の追加
    var world;
    var gty = 9.8 / 10;

    var game = new Game(240, 320); // 240×320画面(Canvas)を作成
    game.fps = 30; // フレームレートの設定。30fpsに設定
    game.preload("images/magnet.png", "images/ball.png"); // 画像データをあらかじめ読み込ませる
    game.rootScene.backgroundColor = "#000033"; // ゲームの背景色を青色に設定
    game.score = 0; // スコアを入れる変数を用意する
    // スコアを表示するラベルを作成
    var scoreLabel = new Label("gathered : 0");
    scoreLabel.font = "12px consolas";
    scoreLabel.color = "white";
    scoreLabel.x = 10; // X座標
    scoreLabel.y = 5; // Y座標
    game.rootScene.addChild(scoreLabel);

    alert("TamaAtsume game ～球あつめゲーム～\n左上から降ってくる球を集めましょう。画面下のほうにある磁石を動かします。\nLet's collect the balls coming down from the upper left. Move the magnet at the bottom of the screen.");
    alert("磁石の右か左に球を当てます。上に当たるとはね返るので注意してください(^.^)\nApply a sphere to the right or left of the magnet. Be careful as the ball rebounds when it hits the magnet :)");

    var Ball = Class.create(PhyCircleSprite, {
        initialize: function (x, y) {
            PhyCircleSprite.call(this, 8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 1.0, 0.99, true);
            this.x = x;
            this.y = y;
            game.rootScene.addChild(this);
            this.image = game.assets["images/ball.png"];
            this.x = 0; //X座標
            this.y = 0; //Y座標
            this.applyImpulse(new b2Vec2(gty * 0.2 * Math.random(), 0));
            //ball.dx=1.5;//X方向の移動量
            //ball.dy=2.5;//Y方向の移動量
            this.addEventListener(Event.ENTER_FRAME, function () {
                //world.step(game.fps);
                if (this.y > game.height) {
                    game.stop();
                    clearInterval(makeBox);
                    if (game.score === 0) {
                        alert("玉は一つも集まりませんでした。もう一度プレイしてみましょう。\nNo balls gathered. Let's try again.");
                        retryA();
                    } else {
                        alert("result: " + game.score + "個集まりました。\n" + game.score + " balls gathered.");
                        retryB();
                    }
                }
            });
            game.rootScene.addChild(this);
        }
    });

    var Pad = Class.create(PhyBoxSprite, {
        initialize: function () {
            PhyBoxSprite.call(this, 32, 16, enchant.box2d.STATIC_SPRITE, 1.0, 1.0, 0.99, true);
            //Sprite.call(this);
            this.image = game.assets["images/magnet.png"];
            //this.backgroundColor = "red";
            this.x = /*game.width/2*/ 120; //X座標
            this.y = /*game.height-40*/ 280; //Y座標
            game.rootScene.addChild(this);
            this.addEventListener('touchstart', function (e) {
                this.x = e.x - 16;
            });
        }
    });

    var count = 0;
    var countup = function () {
        var position = Math.round(Math.random() * 310) + 5;
        var boxes = new Ball(position, 10);
        console.log(count++, position);
    }
    var makeBox = setInterval(countup, 1000);

    function retryA() {
        if (window.confirm('OKを押すとゲームを開始します。キャンセルを押すとツイートできます。\nPress OK to start the game. You can tweet by pressing Cancel.')) {
            location.href = "index.html";
        } else {
            //location.href = "https://www.iniad.org";
            //var twContents = "球は" + game.score + "個集まりません。"
            var twContents = "球は集まりませんでした Orz";
            //console.log(twContents + typeof twContents);
            var url = "https://www.iniad.org"
            //window.open().location.href = ("https://twitter.com/share?url=" + url + "&text=" + twContents + "&count=none&lang=ja");
            //window.open("https://twitter.com/share?url=" + url + "&text=" + twContents, 'width=800,height=600');
            window.open("https://twitter.com/share?url=" + url + "&text=" + twContents, '_blank', 'width=800,height=600');
        }
    }

    function retryB() {
        if (window.confirm('OKを押すとゲームを開始します。キャンセルを押すとスコアをツイートできます。\nPress OK to start the game. You can tweet the score by pressing Cancel.')) {
            location.href = "index.html";
        } else {
            //location.href = "https://www.iniad.org";
            var twContents = "球は" + game.score + "個集まりました。";
            //console.log(twContents + typeof twContents);
            var url = "https://www.iniad.org"
            //window.open().location.href = ("https://twitter.com/share?url=" + url + "&text=" + twContents + "&count=none&lang=ja");
            window.open("https://twitter.com/share?url=" + url + "&text=" + twContents, '_blank', 'width=800,height=600');
        }
    }

    // 傾きを表示するラベルを作成
    var sensorLabel = new Label("0");
    sensorLabel.font = "9px consolas";
    sensorLabel.color = "white";
    sensorLabel.x = 200; // X座標
    sensorLabel.y = 5; // Y座標
    game.rootScene.addChild(sensorLabel);
    // データの読み込みが完了したら処理
    game.onload = function () {
        //box2dの世界の生成
        world = new PhysicsWorld(0, gty);

        // ボールの設定
        //box2dオブジェクトに変更
        //var ball = new Sprite(16, 16);
        //var ball = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 1.0, 0.99, true);

        /*ball.image = game.assets["images/ball.png"];
        ball.x = 0; // X座標
        ball.y = 0; // Y座標
        ball.applyImpulse(new b2Vec2(gty * 0.2 * Math.random(), 0));
        //    ball.dx = 1.5; // X方向の移動量
        //    ball.dy = 2.5; // Y方向の移動量
        game.rootScene.addChild(ball);*/

        // パドルの設定
        //box2dオブジェクトに変更
        //var pad1 = new Sprite(32, 16);
        //var pad1 = new PhyBoxSprite(32, 16, enchant.box2d.STATIC_SPRITE, 1.0, 1.0, 0.99, true);
        //pad1.image = game.assets["images/magnet.png"];
        //pad1.x = /*game.width/2*/ 120; // X座標
        //pad1.y = /*game.height - 40*/ 280; // Y座標
        /*game.rootScene.addEventListener('touchstart', function (e) {
            pad1.x = e.x - 16;
        });*/
        game.rootScene.addEventListener('touchmove', function (e) {
            pad1.x = e.x - 16;
        });
        //game.rootScene.addChild(pad1);
        var pad1 = new Pad();

        //box2d用に壁の作成
        {
            var floor = new PhyBoxSprite(6, game.height, enchant.box2d.STATIC_SPRITE, 0, 0.2, 1.0, false);
            floor.backgroundColor = "#00519a";
            floor.position = {
                x: game.width,
                y: game.height / 2
            }
            game.rootScene.addChild(floor);
            var floor = new PhyBoxSprite(6, game.height, enchant.box2d.STATIC_SPRITE, 0, 0.2, 1.0, false);
            floor.backgroundColor = "#00519a";
            floor.position = {
                x: 0,
                y: game.height / 2
            }
            game.rootScene.addChild(floor);
            var floor = new PhyBoxSprite(game.width, 6, enchant.box2d.STATIC_SPRITE, 0, 0.2, 1.0, false);
            floor.backgroundColor = "#00519a";
            floor.position = {
                x: game.width / 2,
                y: 0
            }
            game.rootScene.addChild(floor);
        }

        // フレームイベントが発生したら処理
        game.rootScene.addEventListener(Event.ENTER_FRAME, function () {
            world.step(game.fps);
            /*ballの移動はbox2dに任せる。
                  ball.x = ball.x + ball.dx; // X方向の移動量を加算
                  ball.y = ball.y + ball.dy; // Y方向の移動量を加算
            */
            /*壁を作ったので画面外判定は不要
                  // 画面外かどうか調べる
                  if ((ball.x < 0) || (ball.x > (game.width-ball.width))){ ball.dx = -ball.dx; }
                  if (ball.y < 0){ ball.dy = -ball.dy; }
            */
            // ボールが下まで行ったらゲームオーバー
            /*if (ball.y > game.height) {
                game.stop();
                alert("スコアは" + game.score + "点でした");
            }*/
            // パドルを移動させる
            var n = game.input.analogX / 4;
            if (!isNaN(n)) {
                pad1.x = pad1.x + n; // パドルを移動
                if (pad1.x < 0) {
                    pad1.x = 0;
                } // 左端かどうか調べる
                if (pad1.x > (game.width - pad1.width)) {
                    pad1.x = game.width - pad1.width;
                } // 右端かどうか調べる
            }
            // パドルとボールの接触判定
            /*if (pad1.within(ball)) {
                ball.dy = -ball.dy; // 接触した場合はボールのY方向の移動量を逆にする
                game.score = game.score + 10; // スコアを加算(10点)
                scoreLabel.text = "SCORE : " + game.score;
            }*/
            Ball.intersect(Pad).forEach(function (pair) {
                game.rootScene.removeChild(pair[0]);
                game.score = game.score + 1; // スコアを加算(1点)
                scoreLabel.text = "gathered : " + game.score;
                console.log("集まった" + game.score);
            })
        });
    }
    // 傾きセンサーを設定
    if (!window.DeviceOrientationEvent) {
        alert("NoOrientationDevice");
    }
    window.addEventListener("deviceorientation", function (evt) {
        var x = evt.gamma; // 横方向の傾斜角度
        game.input.analogX = x;
        sensorLabel.text = game.input.analogX;
    }, false);
    // ゲーム処理開始
    game.start();
}