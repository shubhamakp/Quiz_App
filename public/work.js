const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const h1 = document.getElementById('text');
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var para1 = document.getElementsByClassName("para")[0];
var para2 = document.getElementsByClassName("para")[1];
let crrct = 0;

let shuffledQuestions, currentQuestionIndex;

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  crrct=0;
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
     
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  
  console.log(correct);
  if(correct)
  crrct++;
  console.log(crrct);
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
    // h1.classList.add('hide');
  } else {
    // h1.classList.remove('hide');
    var crrc = (crrct*100)/total;
    var performance = '\n Performance : ';
    if(crrc<25)
    performance += 'Below Average';
    else if(crrct<50)
    performance +='Average';
    else if(crrct<75)
    performance += 'Very Good';
    else
    performance += 'Brilliant';

    var text = "you got " + crrct + " correct out of " + total+ "\n";
    para1.textContent = text;
    para2.textContent = performance;
    modal.style.display = "block";
    

    span.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}


var ques = document.getElementsByClassName("yy");
var items = Array.from(ques, el => el.innerText);


var ans = document.getElementsByClassName("ans");
var ansitem = Array.from(ans, el => el.innerText);
var i = 0;
// for (let item of ansitem) {
//   if (i % 2 != 0)
//     console.log(item);
//   i++;
// }
let total = ques.length;
var correct = document.getElementsByClassName("corr");
var correctitem = Array.from(correct, el => el.innerText);
// for (let i = 0; i < correctitem.length; i++) { 
//   console.log(correctitem[i]); 
// } 


const questions = [];
let val = 1;
let idx = 0;
for (let item of items) {

  const quess = {};
  quess['question'] = item;
  let answers = [];
  let count = 1;
  for (let i = val; i < ansitem.length && count <= 4; i += 2, count++) {
    var options = {};
    options['text'] = ansitem[i];
    // console.log(correctitem[idx] + '.')
    // console.log(ansitem[i - 1])
    if (correctitem[idx] + '.' === ansitem[i - 1])
      options['correct'] = true;
    else
      options['correct'] = false;
    answers.push(options);
  }
  val += 8;
  quess['answers'] = answers;
  idx++;
  questions.push(quess);

}
// console.log(questions);

// const questions = [
//   {
//     question: 'What is 2 + 2?',
//     answers: [
//       { text: '4', correct: true },
//       { text: '22', correct: false }
//     ]
//   },
//   {
//     question: 'Who is the best YouTuber?',
//     answers: [
//       { text: 'Web Dev Simplified', correct: true },
//       { text: 'Traversy Media', correct: true },
//       { text: 'Dev Ed', correct: true },
//       { text: 'Fun Fun Function', correct: true }
//     ]
//   },
//   {
//     question: 'Is web development fun?',
//     answers: [
//       { text: 'Kinda', correct: false },
//       { text: 'YES!!!', correct: true },
//       { text: 'Um no', correct: false },
//       { text: 'IDK', correct: false }
//     ]
//   },
//   {
//     question: 'What is 4 * 2?',
//     answers: [
//       { text: '6', correct: false },
//       { text: '8', correct: true }
//     ]
//   }
// ]
