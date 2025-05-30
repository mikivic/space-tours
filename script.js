// 待ち時間とトリビアの取得
   function loadData() {
     fetch('data.json')
       .then(res => res.json())
       .then(data => {
         document.getElementById('wait-time').textContent = `現在の待ち時間: ${data.waitTime}分`;
       })
       .catch(err => {
         document.getElementById('wait-time').textContent = 'データ取得エラー';
       });

     const trivia = [
       "地球から月までは約384,400km！",
       "太陽は約46億歳！",
       "宇宙には1000億以上の銀河がある！"
     ];
     document.getElementById('trivia').textContent = `宇宙トリビア: ${trivia[Math.floor(Math.random() * trivia.length)]}`;
   }

   // p5.js ミニゲーム（隕石よけ）
   let playerX = 200;
   let meteors = [];
   function setup() {
     let canvas = createCanvas(400, 400);
     canvas.parent('game');
     meteors.push({ x: random(400), y: 0 });
   }
   function draw() {
     background(0);
     fill(255);
     rect(playerX, 350, 20, 20); // プレイヤー（宇宙船）
     if (keyIsDown(LEFT_ARROW)) playerX -= 5;
     if (keyIsDown(RIGHT_ARROW)) playerX += 5;
     playerX = constrain(playerX, 0, 380);
     for (let m of meteors) {
       m.y += 3;
       fill(255, 100, 100);
       ellipse(m.x, m.y, 10, 10); // 隕石
       if (m.y > 400) meteors.push({ x: random(400), y: 0 });
     }
     meteors = meteors.filter(m => m.y <= 400);
   }

   // ページ読み込み時にデータ取得
   window.onload = loadData;