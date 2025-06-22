let state = 'start';
let buttonStart, buttonBack, buttonNext, buttonBackThird, buttonNextThird, 
    buttonBackFifth, buttonNextFifth, buttonBackSixth, buttonNextSixth, 
    buttonBackSeventh, buttonNextSeventh, buttonBackEighth, buttonNextEighth, 
    buttonStartGame, buttonRestart, buttonBackToStart;
let fade = 0;
let clouds = [];
let tractorX = -100;
let characters = {
  claudir: { x: 300, y: 300, color: [255, 100, 100], action: 'plant', velocity: { x: 0, y: 0 } },
  janete: { x: 300, y: 300, color: [100, 255, 100], action: 'harvest', velocity: { x: 0, y: 0 } },
  maria: { x: 0, y: 300, color: [100, 100, 255], action: 'deliver', speed: 0.8, speedTimer: 0, velocity: { x: 0, y: 0 } }
};
let field = [];
let obstacles = [];
let bonuses = [];
let score = 0;
let timer = 60;
let currentCharacter = null;
// Variáveis para controle de movimentação fluida
let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
const ACCELERATION = 0.15;
const FRICTION = 0.9;
const MAX_SPEED = 1.5;

function setup() {
  try {
    createCanvas(600, 400);
    // Inicializar nuvens
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: random(width),
        y: random(50, 150),
        size: random(60, 120),
        speed: random(0.2, 0.8)
      });
    }
    // Inicializar campo de plantio
    for (let i = 0; i < 10; i++) {
      field.push({
        x: 50 + (i % 5) * 100,
        y: 300 + floor(i / 5) * 50,
        state: 'empty'
      });
    }
    // Inicializar obstáculos
    for (let i = 0; i < 6; i++) {
      obstacles.push({
        x: width + random(50, 200),
        y: random(height - 160, height - 40),
        size: 15,
        speed: random(1.5, 3)
      });
    }
    // Inicializar bônus
    for (let i = 0; i < 2; i++) {
      bonuses.push({
        x: width + random(200, 400),
        y: random(height - 160, height - 40),
        size: 15,
        speed: random(1, 2)
      });
    }
    // Botão Iniciar Jornada
    buttonStart = createButton('Começar');
    buttonStart.position(width / 1.9 - 80, height * 0.70);
    buttonStart.style('padding', '15px 30px');
    buttonStart.style('font-size', '18px');
    buttonStart.style('font-family', 'Georgia, serif');
    buttonStart.style('background', 'linear-gradient(to right, #ff6f61, #ffb88c)');
    buttonStart.style('border', 'none');
    buttonStart.style('border-radius', '25px');
    buttonStart.style('color', '#fff');
    buttonStart.style('cursor', 'pointer');
    buttonStart.style('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.3)');
    buttonStart.mousePressed(() => { console.log("Botão Iniciar Jornada clicado"); startJourney(); });

    // Botão Voltar (narrative)
    buttonBack = createButton('Voltar');
    buttonBack.position(width / 2 - 120, height - 50);
    buttonBack.style('padding', '15px 30px');
    buttonBack.style('font-size', '18px');
    buttonBack.style('font-family', 'Georgia, serif');
    buttonBack.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBack.style('border', 'none');
    buttonBack.style('border-radius', '20px');
    buttonBack.style('color', '#fff');
    buttonBack.style('cursor', 'pointer');
    buttonBack.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonBack.mousePressed(() => { console.log("Botão Voltar (narrative) clicado"); goBack(); });
    buttonBack.hide();

    // Botão Próximo (narrative)
    buttonNext = createButton('Próximo');
    buttonNext.position(width / 2 + 5, height - 50);
    buttonNext.style('padding', '15px 30px');
    buttonNext.style('font-size', '18px');
    buttonNext.style('font-family', 'Georgia, serif');
    buttonNext.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonNext.style('border', 'none');
    buttonNext.style('border-radius', '20px');
    buttonNext.style('color', '#fff');
    buttonNext.style('cursor', 'pointer');
    buttonNext.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonNext.mousePressed(() => { console.log("Botão Próximo (narrative) clicado"); goNext(); });
    buttonNext.hide();

    // Botão Voltar (third)
    buttonBackThird = createButton('Voltar');
    buttonBackThird.position(width / 2 - 120, height - 50);
    buttonBackThird.style('padding', '15px 30px');
    buttonBackThird.style('font-size', '18px');
    buttonBackThird.style('font-family', 'Georgia, serif');
    buttonBackThird.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBackThird.style('border', 'none');
    buttonBackThird.style('border-radius', '20px');
    buttonBackThird.style('color', '#fff');
    buttonBackThird.style('cursor', 'pointer');
    buttonBackThird.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonBackThird.mousePressed(() => { console.log("Botão Voltar (third) clicado"); goBackFromThird(); });
    buttonBackThird.hide();

    // Botão Próximo (third)
    buttonNextThird = createButton('Próximo');
    buttonNextThird.position(width / 2 + 5, height - 50);
    buttonNextThird.style('padding', '15px 30px');
    buttonNextThird.style('font-size', '18px');
    buttonNextThird.style('font-family', 'Georgia, serif');
    buttonNextThird.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonNextThird.style('border', 'none');
    buttonNextThird.style('border-radius', '20px');
    buttonNextThird.style('color', '#fff');
    buttonNextThird.style('cursor', 'pointer');
    buttonNextThird.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonNextThird.mousePressed(() => { console.log("Botão Próximo (third) clicado"); goNextThird(); });
    buttonNextThird.hide();

    // Botão Voltar (fifth)
    buttonBackFifth = createButton('Voltar');
    buttonBackFifth.position(width / 2 - 120, height - 50);
    buttonBackFifth.style('padding', '15px 30px');
    buttonBackFifth.style('font-size', '18px');
    buttonBackFifth.style('font-family', 'Georgia, serif');
    buttonBackFifth.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBackFifth.style('border', 'none');
    buttonBackFifth.style('border-radius', '20px');
    buttonBackFifth.style('color', '#fff');
    buttonBackFifth.style('cursor', 'pointer');
    buttonBackFifth.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonBackFifth.mousePressed(() => { console.log("Botão Voltar (fifth) clicado"); goBackFromFifth(); });
    buttonBackFifth.hide();

    // Botão Próximo (fifth)
    buttonNextFifth = createButton('Próximo');
    buttonNextFifth.position(width / 2 + 5, height - 50);
    buttonNextFifth.style('padding', '15px 30px');
    buttonNextFifth.style('font-size', '18px');
    buttonNextFifth.style('font-family', 'Georgia, serif');
    buttonNextFifth.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonNextFifth.style('border', 'none');
    buttonNextFifth.style('border-radius', '20px');
    buttonNextFifth.style('color', '#fff');
    buttonNextFifth.style('cursor', 'pointer');
    buttonNextFifth.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonNextFifth.mousePressed(() => { console.log("Botão Próximo (fifth) clicado"); goNextFifth(); });
    buttonNextFifth.hide();

    // Botão Voltar (sixth)
    buttonBackSixth = createButton('Voltar');
    buttonBackSixth.position(width / 2 - 120, height - 50);
    buttonBackSixth.style('padding', '15px 30px');
    buttonBackSixth.style('font-size', '18px');
    buttonBackSixth.style('font-family', 'Georgia, serif');
    buttonBackSixth.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBackSixth.style('border', 'none');
    buttonBackSixth.style('border-radius', '20px');
    buttonBackSixth.style('color', '#fff');
    buttonBackSixth.style('cursor', 'pointer');
    buttonBackSixth.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonBackSixth.mousePressed(() => { console.log("Botão Voltar (sixth) clicado"); goBackFromSixth(); });
    buttonBackSixth.hide();

    // Botão Próximo (sixth)
    buttonNextSixth = createButton('Próximo');
    buttonNextSixth.position(width / 2 + 5, height - 50);
    buttonNextSixth.style('padding', '15px 30px');
    buttonNextSixth.style('font-size', '18px');
    buttonNextSixth.style('font-family', 'Georgia, serif');
    buttonNextSixth.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonNextSixth.style('border', 'none');
    buttonNextSixth.style('border-radius', '20px');
    buttonNextSixth.style('color', '#fff');
    buttonNextSixth.style('cursor', 'pointer');
    buttonNextSixth.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonNextSixth.mousePressed(() => { console.log("Botão Próximo (sixth) clicado"); goNextSixth(); });
    buttonNextSixth.hide();

    // Botão Voltar (seventh)
    buttonBackSeventh = createButton('Voltar');
    buttonBackSeventh.position(width / 2 - 120, height - 50);
    buttonBackSeventh.style('padding', '15px 30px');
    buttonBackSeventh.style('font-size', '18px');
    buttonBackSeventh.style('font-family', 'Georgia, serif');
    buttonBackSeventh.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBackSeventh.style('border', 'none');
    buttonBackSeventh.style('border-radius', '20px');
    buttonBackSeventh.style('color', '#fff');
    buttonBackSeventh.style('cursor', 'pointer');
    buttonBackSeventh.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonBackSeventh.mousePressed(() => { console.log("Botão Voltar (seventh) clicado"); goBackFromSeventh(); });
    buttonBackSeventh.hide();

    // Botão Próximo (seventh)
    buttonNextSeventh = createButton('Próximo');
    buttonNextSeventh.position(width / 2 + 5, height - 50);
    buttonNextSeventh.style('padding', '15px 30px');
    buttonNextSeventh.style('font-size', '18px');
    buttonNextSeventh.style('font-family', 'Georgia, serif');
    buttonNextSeventh.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonNextSeventh.style('border', 'none');
    buttonNextSeventh.style('border-radius', '20px');
    buttonNextSeventh.style('color', '#fff');
    buttonNextSeventh.style('cursor', 'pointer');
    buttonNextSeventh.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonNextSeventh.mousePressed(() => { console.log("Botão Próximo (seventh) clicado"); goNextSeventh(); });
    buttonNextSeventh.hide();

    // Botão Voltar (eighth)
    buttonBackEighth = createButton('Voltar');
    buttonBackEighth.position(width / 2 - 120, height - 50);
    buttonBackEighth.style('padding', '15px 30px');
    buttonBackEighth.style('font-size', '18px');
    buttonBackEighth.style('font-family', 'Georgia, serif');
    buttonBackEighth.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBackEighth.style('border', 'none');
    buttonBackEighth.style('border-radius', '20px');
    buttonBackEighth.style('color', '#fff');
    buttonBackEighth.style('cursor', 'pointer');
    buttonBackEighth.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonBackEighth.mousePressed(() => { console.log("Botão Voltar (eighth) clicado"); goBackFromEighth(); });
    buttonBackEighth.hide();

    // Botão Iniciar Jogo (eighth)
    buttonNextEighth = createButton('Iniciar Jogo');
    buttonNextEighth.position(width / 2 + 5, height - 50);
    buttonNextEighth.style('padding', '15px 30px');
    buttonNextEighth.style('font-size', '18px');
    buttonNextEighth.style('font-family', 'Georgia, serif');
    buttonNextEighth.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonNextEighth.style('border', 'none');
    buttonNextEighth.style('border-radius', '20px');
    buttonNextEighth.style('color', '#fff');
    buttonNextEighth.style('cursor', 'pointer');
    buttonNextEighth.style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)');
    buttonNextEighth.mousePressed(() => { console.log("Botão Iniciar Jogo clicado"); goToGameIntro(); });
    buttonNextEighth.hide();

    // Botão Começar Jogo (gameIntro)
    buttonStartGame = createButton('Começar Jogo');
    buttonStartGame.position(width / 2 - 90, height * 0.87);
    buttonStartGame.style('padding', '15px 30px');
    buttonStartGame.style('font-size', '18px');
    buttonStartGame.style('font-family', 'Georgia, serif');
    buttonStartGame.style('background', 'linear-gradient(to right, #ff6f61, #ffb88c)');
    buttonStartGame.style('border', 'none');
    buttonStartGame.style('border-radius', '25px');
    buttonStartGame.style('color', '#fff');
    buttonStartGame.style('cursor', 'pointer');
    buttonStartGame.style('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.3)');
    buttonStartGame.mousePressed(() => { console.log("Botão Começar Jogo clicado"); startGame(); });
    buttonStartGame.hide();

    // Botão Jogar Novamente (gameEnd/gameFail)
    buttonRestart = createButton('Jogar Novamente');
    buttonRestart.position(30, height - 70);
    buttonRestart.style('padding', '15px 30px');
    buttonRestart.style('font-size', '18px');
    buttonRestart.style('font-family', 'Georgia, serif');
    buttonRestart.style('background', 'linear-gradient(to right, #ff6f61, #ffb88c)');
    buttonRestart.style('border', 'none');
    buttonRestart.style('border-radius', '25px');
    buttonRestart.style('color', '#fff');
    buttonRestart.style('cursor', 'pointer');
    buttonRestart.style('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.3)');
    buttonRestart.mousePressed(() => { console.log("Botão Jogar Novamente clicado"); startGame(); });
    buttonRestart.hide();

    // Botão Voltar ao Início (gameEnd/gameFail)
    buttonBackToStart = createButton('Voltar ao Início');
    buttonBackToStart.position(width - 190, height - 70);
    buttonBackToStart.style('padding', '15px 30px');
    buttonBackToStart.style('font-size', '18px');
    buttonBackToStart.style('font-family', 'Georgia, serif');
    buttonBackToStart.style('background', 'linear-gradient(to right, #228B22, #32CD32)');
    buttonBackToStart.style('border', 'none');
    buttonBackToStart.style('border-radius', '25px');
    buttonBackToStart.style('color', '#fff');
    buttonBackToStart.style('cursor', 'pointer');
    buttonBackToStart.style('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.3)');
    buttonBackToStart.mousePressed(() => { console.log("Botão Voltar ao Início clicado"); goBack(); });
    buttonBackToStart.hide();
  } catch (e) {
    console.error("Erro no setup:", e);
  }
}

function draw() {
  try {
    if (state === 'start') {
      drawStartScreen();
    } else if (state === 'narrative') {
      drawNarrativeScreen();
    } else if (state === 'third') {
      drawThirdScreen();
    } else if (state === 'fifth') {
      drawFifthScreen();
    } else if (state === 'sixth') {
      drawSixthScreen();
    } else if (state === 'seventh') {
      drawSeventhScreen();
    } else if (state === 'eighth') {
      drawEighthScreen();
    } else if (state === 'gameIntro') {
      drawGameIntroScreen();
    } else if (state === 'planting') {
      drawPlantingScreen();
    } else if (state === 'harvesting') {
      drawHarvestingScreen();
    } else if (state === 'delivery') {
      drawDeliveryScreen();
    } else if (state === 'gameEnd') {
      drawGameEndScreen();
    } else if (state === 'gameFail') {
      drawGameFailScreen();
    } else {
      console.error("Estado inválido:", state);
    }
  } catch (e) {
    console.error("Erro no draw:", e);
  }
}

// Função para desenhar o fundo (céu, chão, nuvens)
function drawBackground(moveClouds = true) {
  try {
    // Gradiente do céu
    for (let y = 0; y < height; y++) {
      let c = lerpColor(color(135, 206, 235), color(255, 165, 0), y / height);
      stroke(c);
      line(0, y, width, y);
    }
    // Chão verde
    fill(34, 139, 34);
    noStroke();
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x += 10) {
      let y = height - 80 - noise(x * 0.01) * 40;
      vertex(x, y);
    }
    vertex(width, height);
    endShape(CLOSE);
    // Nuvens
    if (moveClouds) {
      fill(255, 230);
      noStroke();
      for (let cloud of clouds) {
        cloud.x += cloud.speed;
        if (cloud.x > width + cloud.size) cloud.x = -cloud.size;
        ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
        ellipse(cloud.x + cloud.size * 0.4, cloud.y - 10, cloud.size * 0.8, cloud.size * 0.5);
      }
    }
  } catch (e) {
    console.error("Erro no drawBackground:", e);
  }
}

// Função para desenhar o fundo do campo (para gameFail)
function drawFieldBackground() {
  try {
    // Céu
    for (let y = 0; y < height; y++) {
      let c = lerpColor(color(135, 206, 235), color(255, 165, 0), y / height);
      stroke(c);
      line(0, y, width, y);
    }
    // Terra
    fill(120, 60, 20);
    beginShape();
    vertex(0, height - 120);
    for (let x = 0; x <= width; x += 10) {
      let y = height - 120 - noise(x * 0.005) * 10;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    // Nuvens
    fill(255, 230);
    noStroke();
    for (let cloud of clouds) {
      cloud.x += cloud.speed;
      if (cloud.x > width + cloud.size) cloud.x = -cloud.size;
      ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
      ellipse(cloud.x + cloud.size * 0.4, cloud.y - 10, cloud.size * 0.8, cloud.size * 0.5);
    }
  } catch (e) {
    console.error("Erro no drawFieldBackground:", e);
  }
}

// Função para desenhar o fundo da cidade (para gameEnd)
function drawCityBackground() {
  try {
    // Céu diurno
    for (let y = 0; y < height; y++) {
      let c = lerpColor(color(135, 206, 235), color(255, 165, 0), y / height);
      stroke(c);
      line(0, y, width, y);
    }
    // Prédios no fundo
    fill(50, 50, 50);
    rect(0, height - 200, 100, 150);
    rect(100, height - 250, 80, 200);
    rect(180, height - 180, 120, 130);
    rect(300, height - 220, 100, 170);
    rect(400, height - 260, 80, 210);
    rect(480, height - 190, 120, 140);
    // Chão urbano
    fill(100, 100, 100);
    rect(0, height - 50, width, 50);
  } catch (e) {
    console.error("Erro no drawCityBackground:", e);
  }
}

// Função para atualizar o fade
function updateFade() {
  try {
    if (fade < 255) fade += 5;
  } catch (e) {
    console.error("Erro no updateFade:", e);
  }
}

// Tela inicial
function drawStartScreen() {
  try {
    hideAllButtons();
    buttonStart.show();
    drawBackground();
    tractorX += 0.8;
    if (tractorX > width + 100) tractorX = -100;
    // Desenhar trator
    fill(200, 0, 0);
    rect(tractorX, height - 110, 60, 30, 5);
    fill(0);
    ellipse(tractorX + 15, height - 80, 20, 20);
    ellipse(tractorX + 45, height - 80, 20, 20);
    fill(100);
    rect(tractorX + 35, height - 125, 20, 15, 5);
    // Título
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(255, 200);
    textFont('Georgia');
    text('Caminho do Campo', width / 2 + 2, height / 3 + 2);
    fill(0);
    text('Caminho do Campo', width / 2, height / 3);
  } catch (e) {
    console.error("Erro no drawStartScreen:", e);
  }
}

// Tela narrativa 1
function drawNarrativeScreen() {
  try {
    hideAllButtons();
    buttonBack.show();
    buttonNext.show();
    drawBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont('Georgia');
    textLeading(30);
    let narrative = "O campo leva diversas oportunidades e benefícios para a cidade, principalmente por meio da produção de alimentos e matérias-primas essenciais para a indústria e o comércio. A agricultura e a pecuária abastecem os centros urbanos com produtos frescos e variados, garantindo a segurança alimentar da população.";
    text(narrative, 40, 40, width - 80, height - 100);
  } catch (e) {
    console.error("Erro no drawNarrativeScreen:", e);
  }
}

// Tela narrativa 2
function drawThirdScreen() {
  try {
    hideAllButtons();
    buttonBackThird.show();
    buttonNextThird.show();
    drawBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont('Georgia');
    textLeading(30);
    let narrative = "Além disso, o campo contribui para a economia das cidades com a geração de empregos diretos e indiretos, movimentando cadeias produtivas, como o transporte, a distribuição e o varejo. Também é no meio rural que se desenvolvem inovações tecnológicas voltadas ao agronegócio, que impactam positivamente a economia urbana. Dessa forma, o campo desempenha um papel fundamental no equilíbrio e no crescimento sustentável das cidades.";
    text(narrative, 40, 40, width - 80, height - 100);
  } catch (e) {
    console.error("Erro no drawThirdScreen:", e);
  }
}

// Tela narrativa 3
function drawFifthScreen() {
  try {
    hideAllButtons();
    buttonBackFifth.show();
    buttonNextFifth.show();
    drawBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont('Georgia');
    textLeading(30);
    let narrative = "Um grande exemplo é a agricultura familiar, que é responsável por grande parte dos alimentos que chegam às feiras e supermercados urbanos, a agricultura familiar fortalece a segurança alimentar e a economia local.";
    text(narrative, 40, 40, width - 80, height - 100);
  } catch (e) {
    console.error("Erro no drawFifthScreen:", e);
  }
}

// Tela narrativa 4
function drawSixthScreen() {
  try {
    hideAllButtons();
    buttonBackSixth.show();
    buttonNextSixth.show();
    drawBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont('Georgia');
    textLeading(30);
    let narrative = "Com práticas sustentáveis e produção diversificada, ela oferece produtos mais frescos e de melhor qualidade, além de impulsionar o consumo consciente e a valorização dos produtores locais. Além disso, a agricultura familiar também contribui para o desenvolvimento regional, promovendo a geração de renda e evitando o êxodo rural.";
    text(narrative, 40, 40, width - 80, height - 100);
  } catch (e) {
    console.error("Erro no drawSixthScreen:", e);
  }
}

// Tela narrativa 5
function drawSeventhScreen() {
  try {
    hideAllButtons();
    buttonBackSeventh.show();
    buttonNextSeventh.show();
    drawBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont('Georgia');
    textLeading(30);
    let narrative = "Isso mantém vivas as comunidades do interior e ajuda a equilibrar a relação entre o campo e a cidade, mostrando que o desenvolvimento urbano também depende da valorização e do fortalecimento das atividades rurais.";
    text(narrative, 40, 40, width - 80, height - 100);
  } catch (e) {
    console.error("Erro no drawSeventhScreen:", e);
  }
}

// Tela narrativa 6 (apresentação da família)
function drawEighthScreen() {
  try {
    hideAllButtons();
    buttonBackEighth.show();
    buttonNextEighth.show();
    drawBackground(false);
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textFont('Arial');
    textAlign(CENTER, TOP);
    textSize(36);
    textLeading(40);
    text("A agricultura familiar", width / 2, 60);
    textAlign(LEFT, TOP);
    textSize(24);
    textLeading(30);
    text("Vamos conhecer a família de Claudir, e como ela contribui para a cidade.", 40, 120, width - 80);
    text("Claudir tem uma esposa chamada Janete, e uma filha, chamada Maria, juntos eles contribuem para a cidade, produzindo alimentos que logo chegaram à cidade, e então, até nossas mesas.", 40, 200, width - 80);
  } catch (e) {
    console.error("Erro no drawEighthScreen:", e);
  }
}

// Tela de introdução ao jogo
function drawGameIntroScreen() {
  try {
    hideAllButtons();
    buttonStartGame.show();
    drawBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    fill(255, fade);
    textAlign(CENTER, TOP);
    textSize(16);
    textFont('Georgia');
    textLeading(24);
    let intro = "Bem-vindo ao Jogo da Agricultura Familiar!\n" +
                "Ajude Claudir, Janete e Maria a produzir alimentos para a cidade.\n\n" +
                "Instruções:\n" +
                "- Use as setas para mover os personagens ou o trator com deslize.\n" +
                "- Pressione ESPAÇO para realizar ações (plantar, colher, entregar).\n" +
                "- Fases:\n" +
                "  1. Plantar: Controle Claudir para plantar sementes (10 pontos cada).\n" +
                "  2. Colher: Controle Janete para colher plantas maduras (20 pontos cada).\n" +
                "  3. Entregar: Controle Maria para levar os produtos à cidade com o trator, desviando de obstáculos e coletando bônus para mais velocidade.\n" +
                "- Objetivo: Complete todas as tarefas em 60 segundos para alcançar a cidade!";
    text(intro, 30, 30, width - 60, 300);
  } catch (e) {
    console.error("Erro no drawGameIntroScreen:", e);
  }
}

// Fase de plantio
function drawPlantingScreen() {
  try {
    hideAllButtons();
    drawBackground();
    drawField();
    updateCharacterMovement(characters.claudir);
    drawCharacter(characters.claudir);
    drawStatus();
    updateTimer();
    if (allPlanted()) {
      console.log("Todas as sementes plantadas, mudando para harvesting");
      state = 'harvesting';
      currentCharacter = characters.janete;
      characters.janete.x = 300;
      characters.janete.y = 300;
      characters.janete.velocity.x = 0;
      characters.janete.velocity.y = 0;
      for (let spot of field) {
        if (spot.state === 'planted') spot.state = 'grown';
      }
    }
  } catch (e) {
    console.error("Erro no drawPlantingScreen:", e);
  }
}

// Fase de colheita
function drawHarvestingScreen() {
  try {
    hideAllButtons();
    drawBackground();
    drawField();
    updateCharacterMovement(characters.janete);
    drawCharacter(characters.janete);
    drawStatus();
    updateTimer();
    if (allHarvested()) {
      console.log("Todas as plantas colhidas, mudando para delivery");
      state = 'delivery';
      currentCharacter = characters.maria;
      characters.maria.x = 0;
      characters.maria.y = height - 110; // Centralizado na estrada
      characters.maria.speed = 0.8;
      characters.maria.speedTimer = 0;
      characters.maria.velocity.x = 0;
      characters.maria.velocity.y = 0;
      // Reiniciar obstáculos e bônus
      for (let obstacle of obstacles) {
        obstacle.x = width + random(50, 200);
        obstacle.y = random(height - 160, height - 40);
        obstacle.speed = random(1.5, 3);
      }
      for (let bonus of bonuses) {
        bonus.x = width + random(200, 400);
        bonus.y = random(height - 160, height - 40);
      }
    }
  } catch (e) {
    console.error("Erro no drawHarvestingScreen:", e);
  }
}

// Fase de entrega
function drawDeliveryScreen() {
  try {
    hideAllButtons();
    drawBackground();
    // Desenhar estrada
    fill(100, 100, 100);
    rect(0, height - 160, width, 120);
    // Desenhar prédio (cidade) com feedback visual
    if (characters.maria.x >= width - 100) {
      fill(100, 255, 100);
      // Aviso centralizado
      fill(0, 200);
      rect(width / 2 - 150, height / 2 - 30, 300, 60, 10);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      textFont('Georgia');
      text("Pressione ESPAÇO para entregar!", width / 2, height / 2);
    } else {
      fill(139, 139, 139);
    }
    rect(width - 60, height - 200, 60, 120);
    // Janelas do prédio
    fill(255, 255, 0);
    for (let x = width - 55; x <= width - 25; x += 15) {
      for (let y = height - 190; y <= height - 100; y += 20) {
        rect(x, y, 10, 10);
      }
    }
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Cidade", width - 30, height - 80);
    // Atualizar temporizador de velocidade do bônus
    if (characters.maria.speedTimer > 0) {
      characters.maria.speedTimer -= 1 / 60;
      if (characters.maria.speedTimer <= 0) {
        characters.maria.speed = 0.8;
      }
    }
    // Atualizar movimentação com deslize
    updateCharacterMovement(characters.maria);
    // Desenhar obstáculos apenas se não estiver no prédio
    if (characters.maria.x < width - 100) {
      for (let obstacle of obstacles) {
        fill(128, 128, 128);
        ellipse(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        obstacle.x -= obstacle.speed;
        if (obstacle.x < -obstacle.size) {
          obstacle.x = width + random(50, 200);
          obstacle.y = random(height - 160, height - 40);
          obstacle.speed = random(1.5, 3);
        }
        // Verificar colisão com obstáculo
        if (dist(characters.maria.x + 30, characters.maria.y + 15, obstacle.x, obstacle.y) < 25) {
          characters.maria.x = 0;
          characters.maria.y = height - 110;
          characters.maria.velocity.x = 0;
          characters.maria.velocity.y = 0;
          score -= 10;
          if (score < 0) score = 0;
        }
      }
    } else {
      // Limpar obstáculos quando no prédio
      for (let obstacle of obstacles) {
        obstacle.x = -obstacle.size;
      }
    }
    // Desenhar bônus
    for (let bonus of bonuses) {
      fill(255, 215, 0);
      star(bonus.x, bonus.y, bonus.size / 2, bonus.size / 4, 5);
      bonus.x -= bonus.speed;
      if (bonus.x < -bonus.size) {
        bonus.x = width + random(200, 400);
        bonus.y = random(height - 160, height - 40);
      }
      // Verificar colisão com bônus
      if (dist(characters.maria.x + 30, characters.maria.y + 15, bonus.x, bonus.y) < 25) {
        characters.maria.speed = 1.5;
        characters.maria.speedTimer = 5;
        bonus.x = width + random(200, 400);
        bonus.y = random(height - 160, height - 40);
      }
    }
    // Desenhar trator
    fill(200, 0, 0);
    rect(characters.maria.x, characters.maria.y, 60, 30, 5);
    fill(0);
    ellipse(characters.maria.x + 15, characters.maria.y + 30, 20, 20);
    ellipse(characters.maria.x + 45, characters.maria.y + 30, 20, 20);
    fill(100);
    rect(characters.maria.x + 35, characters.maria.y - 15, 20, 15, 5);
    fill(characters.maria.color);
    ellipse(characters.maria.x + 30, characters.maria.y - 25, 15, 15);
    fill(0);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text("Maria", characters.maria.x + 30, characters.maria.y - 30);
    drawStatus();
    updateTimer();
  } catch (e) {
    console.error("Erro no drawDeliveryScreen:", e);
  }
}

// Tela de sucesso
function drawGameEndScreen() {
  try {
    hideAllButtons();
    buttonRestart.show();
    buttonBackToStart.show();
    drawCityBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    // Desenhar mercado central
    let marketX = width / 2 - 150;
    let marketY = height / 2 - 75;
    let marketWidth = 300;
    let marketHeight = 150;
    // Fachada do mercado
    stroke(0);
    strokeWeight(2);
    fill(245, 245, 220); // Bege claro
    rect(marketX, marketY, marketWidth, marketHeight, 10);
    // Telhado
    fill(139, 69, 19); // Marrom
    triangle(marketX - 10, marketY, marketX + marketWidth + 10, marketY, marketX + marketWidth / 2, marketY - 40);
    // Porta
    fill(100, 50, 0); // Marrom escuro
    rect(marketX + marketWidth / 2 - 30, marketY + marketHeight - 60, 60, 60, 5);
    // Janelas
    fill(135, 206, 235); // Azul claro
    for (let x = marketX + 30; x < marketX + marketWidth - 30; x += 60) {
      if (x < marketX + marketWidth / 2 - 40 || x > marketX + marketWidth / 2 + 40) {
        rect(x, marketY + 20, 40, 30, 5);
      }
    }
    // Letreiro
    fill(0, 100, 0);
    rect(marketX + 50, marketY - 20, marketWidth - 100, 30, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont('Georgia');
    text("Mercado Central", marketX + marketWidth / 2, marketY - 5);
    // Toldo
    fill(255, 69, 0);
    rect(marketX + marketWidth / 2 - 40, marketY + marketHeight - 70, 80, 10);
    // Mensagem de sucesso
    updateFade();
    fill(255, fade);
    textAlign(CENTER, TOP);
    textSize(20);
    textFont('Georgia');
    textLeading(24);
    text(`Parabéns, você conseguiu ajudar Claudir, Janete e Maria a levarem os alimentos ao mercado!\nPontuação: ${score}`, 20, 270, width - 40, height - 80);
  } catch (e) {
    console.error("Erro no drawGameEndScreen:", e);
  }
}

// Tela de falha
function drawGameFailScreen() {
  try {
    hideAllButtons();
    buttonRestart.show();
    buttonBackToStart.show();
    drawFieldBackground();
    // Fundo preto semitransparente
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    updateFade();
    // Mensagem
    fill(255, fade);
    textAlign(CENTER, TOP);
    textSize(20);
    textFont('Georgia');
    textLeading(24);
    text(`Infelizmente você não conseguiu entregar a tempo!\nPontuação: ${score}`, 40, 40, width - 80, height - 80);
  } catch (e) {
    console.error("Erro no drawGameFailScreen:", e);
  }
}

// Desenhar o campo de plantio
function drawField() {
  try {
    // Terra nivelada
    fill(120, 60, 20);
    noStroke();
    beginShape();
    vertex(0, height - 120);
    for (let x = 0; x <= width; x += 10) {
      let y = height - 120 - noise(x * 0.005) * 10;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    // Pontos de plantio (terra mais clara)
    for (let spot of field) {
      if (spot.state === 'empty' || spot.state === 'planted' || spot.state === 'harvested') {
        fill(165, 99, 49);
        ellipse(spot.x, spot.y, 20, 20);
      }
      if (spot.state === 'planted') {
        // Broto
        fill(139, 69, 19);
        rect(spot.x - 5, spot.y, 10, 5);
        fill(50, 168, 82);
        triangle(spot.x - 5, spot.y, spot.x, spot.y - 10, spot.x + 5, spot.y);
      } else if (spot.state === 'grown') {
        // Trigo (inteiramente amarelo)
        fill(184, 134, 11);
        rect(spot.x - 2, spot.y - 20, 4, 20);
        beginShape();
        vertex(spot.x - 5, spot.y - 20);
        vertex(spot.x, spot.y - 30);
        vertex(spot.x + 5, spot.y - 20);
        vertex(spot.x + 3, spot.y - 20);
        vertex(spot.x, spot.y - 25);
        vertex(spot.x - 3, spot.y - 20);
        endShape(CLOSE);
        beginShape();
        vertex(spot.x - 5, spot.y - 15);
        vertex(spot.x, spot.y - 25);
        vertex(spot.x + 5, spot.y - 15);
        vertex(spot.x + 3, spot.y - 15);
        vertex(spot.x, spot.y - 20);
        vertex(spot.x - 3, spot.y - 15);
        endShape(CLOSE);
      }
    }
  } catch (e) {
    console.error("Erro no drawField:", e);
  }
}

// Desenhar personagem
function drawCharacter(character) {
  try {
    fill(character.color);
    ellipse(character.x, character.y, 20, 20);
    fill(0);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(character.action === 'plant' ? 'Claudir' : character.action === 'harvest' ? 'Janete' : 'Maria', character.x, character.y - 10);
  } catch (e) {
    console.error("Erro no drawCharacter:", e);
  }
}

// Atualizar movimentação com deslize
function updateCharacterMovement(character) {
  try {
    // Aplicar fricção
    character.velocity.x *= FRICTION;
    character.velocity.y *= FRICTION;
    // Limitar velocidade
    let speed = character.speed || 1.5;
    if (movingLeft) character.velocity.x -= ACCELERATION * speed;
    if (movingRight) character.velocity.x += ACCELERATION * speed;
    if (movingUp) character.velocity.y -= ACCELERATION * speed; // Permitir movimento para cima
    if (movingDown) character.velocity.y += ACCELERATION * speed;
    // Limitar velocidade máxima
    let mag = sqrt(character.velocity.x * character.velocity.x + character.velocity.y * character.velocity.y);
    if (mag > MAX_SPEED * speed) {
      character.velocity.x = (character.velocity.x / mag) * MAX_SPEED * speed;
      character.velocity.y = (character.velocity.y / mag) * MAX_SPEED * speed;
    }
    // Atualizar posição
    character.x += character.velocity.x;
    character.y += character.velocity.y;
    // Limitar bordas
    if (state === 'planting' || state === 'harvesting') {
      if (character.x < 0) character.x = 0;
      if (character.x > width) character.x = width;
      if (character.y < height - 120) character.y = height - 120;
      if (character.y > height - 50) character.y = height - 50;
    } else if (state === 'delivery') {
      if (character.x < 0) character.x = 0;
      if (character.x > width - 60) character.x = width - 60;
      // Ajustar limites para manter o trator na estrada
      if (character.y < height - 160 + 15) character.y = height - 160 + 15; // Topo da estrada + margem
      if (character.y > height - 40 - 15) character.y = height - 40 - 15; // Base da estrada - margem
    }
    // Log para depuração
    console.log(`Personagem: ${character.action}, Velocidade: (${character.velocity.x.toFixed(2)}, ${character.velocity.y.toFixed(2)}), Magnitude: ${mag.toFixed(2)}, Speed: ${speed}`);
  } catch (e) {
    console.error("Erro no updateCharacterMovement:", e);
  }
}

// Desenhar status (pontuação, tempo, fase)
function drawStatus() {
  try {
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Pontuação: ${score}`, 10, 10);
    text(`Tempo: ${ceil(timer)}s`, 10, 30);
    textAlign(RIGHT, TOP);
    text(`Fase: ${state === 'planting' ? 'Plantando' : state === 'harvesting' ? 'Colhendo' : 'Entregando'}`, width - 10, 10);
  } catch (e) {
    console.error("Erro no drawStatus:", e);
  }
}

// Atualizar temporizador
function updateTimer() {
  try {
    timer -= 1 / 60;
    if (timer <= 0 && state !== 'gameEnd') {
      console.log(`Tempo esgotado! Estado: ${state}, Timer: ${timer}, Mudando para gameFail`);
      state = 'gameFail';
      fade = 0;
    }
  } catch (e) {
    console.error("Erro no updateTimer:", e);
  }
}

// Verificar se todas as sementes foram plantadas
function allPlanted() {
  try {
    return field.every(spot => spot.state === 'planted' || spot.state === 'grown' || spot.state === 'harvested');
  } catch (e) {
    console.error("Erro no allPlanted:", e);
    return false;
  }
}

// Verificar se todas as plantas foram colhidas
function allHarvested() {
  try {
    return field.every(spot => spot.state === 'harvested');
  } catch (e) {
    console.error("Erro no allHarvested:", e);
    return false;
  }
}

// Função para desenhar uma estrela (usada para bônus)
function star(x, y, radius1, radius2, npoints) {
  try {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
      let sx = x + cos(a) * radius1;
      let sy = y + sin(a) * radius1;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius2;
      sy = y + sin(a + halfAngle) * radius2;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  } catch (e) {
    console.error("Erro no star:", e);
  }
}

// Controle de teclas pressionadas
function keyPressed() {
  try {
    if (state === 'planting' || state === 'harvesting') {
      if (keyCode === 32) { // ESPAÇO
        for (let spot of field) {
          if (dist(currentCharacter.x, currentCharacter.y, spot.x, spot.y) < 30) {
            if (state === 'planting' && spot.state === 'empty') {
              spot.state = 'planted';
              score += 10;
            } else if (state === 'harvesting' && spot.state === 'grown') {
              spot.state = 'harvested';
              score += 20;
            }
          }
        }
      }
    } else if (state === 'delivery') {
      if (keyCode === 32 && characters.maria.x >= width - 100) {
        console.log("Entrega realizada! x =", characters.maria.x);
        state = 'gameEnd';
        score += 50;
      }
    }
    // Controle de movimento
    if (keyCode === LEFT_ARROW) movingLeft = true;
    if (keyCode === RIGHT_ARROW) movingRight = true;
    if (keyCode === UP_ARROW) movingUp = true;
    if (keyCode === DOWN_ARROW) movingDown = true;
  } catch (e) {
    console.error("Erro no keyPressed:", e);
  }
}

// Controle de teclas soltas
function keyReleased() {
  try {
    if (keyCode === LEFT_ARROW) movingLeft = false;
    if (keyCode === RIGHT_ARROW) movingRight = false;
    if (keyCode === UP_ARROW) movingUp = false;
    if (keyCode === DOWN_ARROW) movingDown = false;
  } catch (e) {
    console.error("Erro no keyReleased:", e);
  }
}

// Esconder todos os botões
function hideAllButtons() {
  try {
    buttonStart.hide();
    buttonBack.hide();
    buttonNext.hide();
    buttonBackThird.hide();
    buttonNextThird.hide();
    buttonBackFifth.hide();
    buttonNextFifth.hide();
    buttonBackSixth.hide();
    buttonNextSixth.hide();
    buttonBackSeventh.hide();
    buttonNextSeventh.hide();
    buttonBackEighth.hide();
    buttonNextEighth.hide();
    buttonStartGame.hide();
    buttonRestart.hide();
    buttonBackToStart.hide();
  } catch (e) {
    console.error("Erro no hideAllButtons:", e);
  }
}

// Transições de estado
function startJourney() {
  try {
    console.log("Transição para narrative");
    state = 'narrative';
    fade = 0;
  } catch (e) {
    console.error("Erro no startJourney:", e);
  }
}

function goBack() {
  try {
    console.log("Transição para start");
    state = 'start';
    fade = 0;
    tractorX = -100;
  } catch (e) {
    console.error("Erro no goBack:", e);
  }
}

function goNext() {
  try {
    console.log("Transição para third");
    state = 'third';
    fade = 0;
  } catch (e) {
    console.error("Erro no goNext:", e);
  }
}

function goBackFromThird() {
  try {
    console.log("Transição para narrative");
    state = 'narrative';
    fade = 0;
  } catch (e) {
    console.error("Erro no goBackFromThird:", e);
  }
}

function goNextThird() {
  try {
    console.log("Transição para fifth");
    state = 'fifth';
    fade = 0;
  } catch (e) {
    console.error("Erro no goNextThird:", e);
  }
}

function goBackFromFifth() {
  try {
    console.log("Transição para third");
    state = 'third';
    fade = 0;
  } catch (e) {
    console.error("Erro no goBackFromFifth:", e);
  }
}

function goNextFifth() {
  try {
    console.log("Transição para sixth");
    state = 'sixth';
    fade = 0;
  } catch (e) {
    console.error("Erro no goNextFifth:", e);
  }
}

function goBackFromSixth() {
  try {
    console.log("Transição para fifth");
    state = 'fifth';
    fade = 0;
  } catch (e) {
    console.error("Erro no goBackFromSixth:", e);
  }
}

function goNextSixth() {
  try {
    console.log("Transição para seventh");
    state = 'seventh';
    fade = 0;
  } catch (e) {
    console.error("Erro no goNextSixth:", e);
  }
}

function goBackFromSeventh() {
  try {
    console.log("Transição para sixth");
    state = 'sixth';
    fade = 0;
  } catch (e) {
    console.error("Erro no goBackFromSeventh:", e);
  }
}

function goNextSeventh() {
  try {
    console.log("Transição para eighth");
    state = 'eighth';
    fade = 0;
  } catch (e) {
    console.error("Erro no goNextSeventh:", e);
  }
}

function goBackFromEighth() {
  try {
    console.log("Transição para seventh");
    state = 'seventh';
    fade = 0;
  } catch (e) {
    console.error("Erro no goBackFromEighth:", e);
  }
}

function goToGameIntro() {
  try {
    console.log("Transição para gameIntro");
    state = 'gameIntro';
    fade = 0;
  } catch (e) {
    console.error("Erro no goToGameIntro:", e);
  }
}

function startGame() {
  try {
    console.log("Iniciando jogo, mudando para planting");
    state = 'planting';
    currentCharacter = characters.claudir;
    score = 0;
    timer = 60;
    characters.claudir.x = 300;
    characters.claudir.y = 300;
    characters.claudir.velocity.x = 0;
    characters.claudir.velocity.y = 0;
    for (let spot of field) {
      spot.state = 'empty';
    }
    movingLeft = false;
    movingRight = false;
    movingUp = false;
    movingDown = false;
  } catch (e) {
    console.error("Erro no startGame:", e);
  }
}
