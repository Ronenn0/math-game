let currentScore = 0, maxStreak;
const currentScoreSpan = document.getElementById("currentScore"),
currentMathSyntax = document.getElementById('syntax'),
secondsSpan = document.getElementById('seconds'),
currentStreakSpan = document.getElementById('currentStreak'),
currentQuestionSpan = document.getElementById('currentQuestion'),
tryAgainButton = document.getElementById('tryAgainButton'),
mainScoreDiv = document.getElementById('popOutDiv'), containerGame = document .getElementById('game'),
maxStreakSpan = document.getElementById('maxStreak'), timeSpan = document.getElementById('time');
let answerSpans, dontDoChanges;
let regularMaxNumber = 50, divisionMaxNumber = 25,
takeOutMaxNumber = 200;

let num1, num2, operation, rightAnswer, rightAnswerIndex, dontCheck = false, started = false;
let maxDifference, questionNumber = 1, secondsLeft, currentStreak;
const secondsForEachQuestion = 5,  questionsAmount = 22, gameOpacityTime =1.3;
let timeWidth = this.innerWidth / 2;
let timeDiv = document.getElementById('timeDiv'),
mainTime = document.getElementById('main');
/* ---------------------- */
addEventListeners();
function start() {
  setup();
}
/* ---------------------- */

async function setup() {
  time = 0;
  showTime();
  maxStreak = 0;
  currentScore = 0;
  dontDoChanges = false;
  questionNumber = 1;
  currentStreak = 0;
  timeDiv.style.width = timeWidth + 'px';
  mainTime.style.width = timeWidth + 'px';
  getAnswerIds();
  timer();
  makeMathSyntax();
  draw();
}
async function timer() {
  if(dontDoChanges) return;
  await sleep(10);
  time+=0.01;
  showTime();
  timer();
}
function showTime() {
  timeSpan.textContent = time.toString().substr(0, 4) + 's';
}
async function draw() {
  if (dontDoChanges) {
    return;
  }
  if (secondsLeft <= 0) {
    if (questionNumber > questionsAmount) {
      await popIn();
      //currentQuestionSpan.textContent = questionNumber +'/' + questionsAmount;
      return;
    }
    if (!dontCheck) {
      makeMathSyntax();
      console.log('aaa');
      draw();
      return;
    }
  }
  //secondsSpan.textContent = secondsLeft;
  //secondsLeft-= 0.1;

  for (let i = 0; i < 10; i++) {

    // if(mainScoreDiv.style.webkitAnimationPlayState == 'running') {
    //     //mainScoreDiv.style.webkitAnimationPlayState = 'paused';
    //     break;
    // }
    await sleep(10);
    changeTimeWidth();
    secondsLeft -= 0.01;
  }
  draw();
}

// answerSpans[0].textContent = '00';


function getAnswerIds() {
  answerSpans = [];
  for (let i = 1; i <= 4; i++) {
    answerSpans.push(document.getElementById('answer' + i));
    answerSpans[answerSpans.length - 1].addEventListener("click", async()=> {
      if (!dontCheck) {
        await checkAnswer(i - 1);
      }
    });
  }
}

function makeMathSyntax() {

  currentQuestionSpan.textContent = questionNumber +'/' + questionsAmount;
  dontCheck = false;
  secondsLeft = secondsForEachQuestion;
  //secondsSpan.textContent = secondsLeft;

  let operations = ['+',
    '-',
    '*',
    '/'];
  let randomIndex = random(operations.length);
  operation = operations[randomIndex];
  //operation = '-';
  if (operation == '/') {
    num2 = random(1, divisionMaxNumber);
    num1 = num2 * random(1, divisionMaxNumber);
    rightAnswer = num1 / num2;
    maxDifference = 5;
  } else if (operation == '-') {
    num1 = random(5, takeOutMaxNumber);
    num2 = random(1, takeOutMaxNumber);
    let helper;
    if (num1 < num2) {
      helper = num1;
      num1 = num2;
      num2 = helper;
    }
    rightAnswer = num1 - num2;
    maxDifference = Math.max(Math.floor(num1 / 10), 4);
  } else {
    num1 = random(1, regularMaxNumber);
    num2 = random(1, regularMaxNumber);
    if (operation == '+') {
      rightAnswer = num1 + num2;
      maxDifference = 12;
    } else if (operation == '*') {
      rightAnswer = num1 * num2;
      maxDifference = Math.floor(Math.pow(rightAnswer, 0.5));
    }
  }
  let wrongAnswers = [];
  for (let i = rightAnswer + 1; i < rightAnswer + maxDifference + 1; i++) {
    wrongAnswers.push(i);
  }
  if (rightAnswer - maxDifference >= 0) {
    for (let i = rightAnswer - 1; i > rightAnswer - maxDifference; i--) {
      wrongAnswers.push(i);
    }
  }
  rightAnswerIndex = random(4);
  for (let i = 0; i < answerSpans.length; i++) {
    let answerSpan = answerSpans[i];
    if (i == rightAnswerIndex) {
      answerSpan.textContent = rightAnswer;
    } else {
      let index = random(wrongAnswers.length);
      answerSpan.textContent = wrongAnswers[index];
      wrongAnswers.splice(index, 1);
    }
  }
  currentMathSyntax.textContent = num1 + operation + num2;
  questionNumber++;
}

async function checkAnswer(index) {
  if (dontCheck) {
    return;
  }
  dontCheck = true;
  let rightAnswerSpan = answerSpans[rightAnswerIndex]
  if (index == rightAnswerIndex) {
    currentStreak++;
    console.log('right');
    currentScore++;
    //currentScoreSpan.textContent = currentScore;
    rightAnswerSpan.style.backgroundColor = 'var(--green)';
    await sleep(400);
  } else {
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
    currentStreak = 0;
    answerSpans[index].style.backgroundColor = 'var(--red)';
    await sleep(400);
  }
  currentStreakSpan.textContent = currentStreak;
  reAddHover(answerSpans[index]);
  if (questionNumber > questionsAmount) {
    //currentQuestionSpan.textContent = questionNumber +'/' + questionsAmount;
    await popIn();
    return;
  }

  console.log(questionNumber);

  makeMathSyntax();


}

function reAddHover(span) {
  span.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
  span.addEventListener('mouseover', ()=> {
    span.style.backgroundColor = 'rgba(0, 119, 255, 0.7)';
  });
  span.addEventListener('mouseout', ()=> {
    span.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
  });
}
function changeTimeWidth() {
  mainTime.style.width = timeWidth*secondsLeft/secondsForEachQuestion + 'px';
}

async function popIn() {
  dontDoChanges = true;
  document.getElementById('closedTime').textContent = timeSpan.textContent;
  containerGame.style.animation = 'makeDark ' + gameOpacityTime + 's ease-out';
  setTimeout(function() {
    containerGame.style.opacity = 0.1;
  }, gameOpacityTime * 1000);
  containerGame.style.pointerEvents = 'none';
  if(currentStreak > maxStreak) {
    maxStreak = currentStreak;
  }
  maxStreakSpan.textContent = maxStreak;
  mainScoreDiv.style.animation = 'popIn 1.5s ease-in';
  let scoreSpan = document.getElementById('score');
  let mark = Math.round(currentScore / questionsAmount * 100);
  scoreSpan.textContent = mark + '/100';
  if (mark <= 60) {
    scoreSpan.style.color = 'var(--red)';
  } else if (mark <= 80) {
    scoreSpan.style.color = 'var(--orange)';
  } else {
    scoreSpan.style.color = 'var(--green)';
  }


  await sleep(1500);
  questionNumber = 1;
  mainScoreDiv.style.opacity = '1';
  mainScoreDiv.style.pointerEvents = 'all';
}
async function popOut() {
  questionNumber = 1;
  mainScoreDiv.style.animation = 'popOut 1s ease-out';
containerGame.style.animation = 'makeRegularOpacity ' + gameOpacityTime + 's ease-in';
 setTimeout(function() {
    containerGame.style.opacity = 1;
  }, gameOpacityTime * 1000);
  mainScoreDiv.style.pointerEvents = 'none';
  await sleep(1000);
  containerGame.style.pointerEvents = 'all';
  setup();
  mainScoreDiv.style.opacity = '0';
  mainScoreDiv.style.pointerEvents = 'none';
  //mainScoreDiv.style.animationPlayState = 'paused';
  dontDoChanges = false;
}

function addEventListeners() {
  tryAgainButton.addEventListener('click', async()=> {
    await popOut();
    //await sleep(2000);
  });
  this.addEventListener('resize', ()=> {
    timeWidth = this.innerWidth / 2;
    timeDiv.style.width = timeWidth + 'px';
    changeTimeWidth();
  });
  const startButton = document.getElementById('start'),
    startDiv =document.getElementById('startDiv');
  startButton.addEventListener('click', async()=> {
    if(started) return;
    const gameDiv = document.getElementById('game');
    started = true;
    startDiv.style.animation = 'popOut 3s ease-out';
    startDiv.style.pointerEvents = 'none';
    await sleep(2000);
    game.style.animation = 'popInGameDiv 3s ease-in';
    await sleep(1000);
    startDiv.style.display = 'none';
    startDiv.style.opacity = 0;
    await sleep(200);
    game.style.opacity = 1;
    game.style.pointerEvents = 'all';
    start();
  });
}