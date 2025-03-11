let select = document.querySelector("select");
let questionFile = "html";

// setting
let curren_question = 0;
let numberOfCorrectAnswer = 0;
let nextQuestion = false;
let setCountDown;
let countDownDiv = document.querySelector(".countdown");
let submit = document.querySelector(".submit-button");
let quiz_area = document.querySelector(".quiz-area h3");
let answer_area = document.querySelector(".answer-area");
let Get_data = () => {
  let http = new XMLHttpRequest();

  http.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let objectRespones = JSON.parse(this.responseText);
      let randomFields = getRandomFields(objectRespones, 20);
      let questionCount = objectRespones.length;
      console.log(randomFields);
      createBullet(20);
      createQuestion(randomFields[curren_question], questionCount, curren_question);
      countDown(60, 20);
      // when click on submit
      submit.addEventListener("click", () => {
        let correctAnswer = randomFields[curren_question]["correct_answer"];
        checkanswer(correctAnswer, questionCount);
        if (nextQuestion) {
          curren_question++;
          if (curren_question == 20) {
            quiz_area.innerHTML = "the quiz is finish , thank you .";
            answer_area.remove();
            submit.remove();
            bulletSpan.remove();
            let res = document.querySelector(".results");
            let resSpan = document.querySelector(".results span");

            resSpan.innerText = `${numberOfCorrectAnswer} / 20 = ${(numberOfCorrectAnswer * 100) / 20} %`;
            res.style.display = "block";
            setTimeout(() => {
              window.location.reload();
            }, 5000)
          }
          else {
            quiz_area.innerHTML = "";
            answer_area.innerHTML = "";
            createQuestion(randomFields[curren_question], questionCount);
            handleBullet();
            clearInterval(setCountDown);
            countDown(60, 20);
          }
        }

      });
    }
  }
  // let filePath = language === "html" ? "./data/html.json" : "./data/css.json";

  http.open("GET", "./data/html.json", true);
  http.send();
}
// document.getElementById('languageSelect').addEventListener('change', function () {
//   clearInterval(setCountDown);
//   let selectedLanguage = this.value; // الحصول على القيمة المختارة (html أو css)
//   Get_data(selectedLanguage); // استدعاء دالة Get_data مع اللغة المختارة
// });
function getRandomFields(data, count) {
  let randomFields = [];

  // تكرار لعدد العناصر التي نريد اختيارها
  while (randomFields.length < count) {
    let randomIndex = Math.floor(Math.random() * data.length);
    // console.log(data[randomIndex]);
    if (!randomFields.includes(data[randomIndex])) {
      randomFields.push(data[randomIndex]);
    }
  }

  return randomFields;
}
Get_data();
let bulletSpan = document.querySelector(".bullets .spans");
let createBullet = (num) => {
  for (let i = 1; i <= num; i++) {
    //create span
    let span = document.createElement("span");
    span.innerText = i;
    if (i == 1) {
      span.classList = "active";
    }
    bulletSpan.append(span);
  }
}


const createQuestion = (question, count, curren_ques) => {
  quiz_area.innerText = question["question"];
  for (let i = 1; i <= 4; i++) {
    let answer = document.createElement("div");
    answer.classList = "answer";
    let input = document.createElement("input");
    input.name = "questions";
    input.type = "radio";
    input.id = `answer_${i}`;
    if(i==1){
      input.checked=true
    }
    input.value = question[`answer_${i}`];
    answer.append(input);
    let label = document.createElement("label");
    label.setAttribute("for", `answer_${i}`);
    label.innerText = question[`answer_${i}`];
    answer.append(label);
    answer_area.append(answer);
  }
}

const checkanswer = (rAnswer, count) => {
  nextQuestion = false;
  let myChosing = "";
  let checkInput = document.getElementsByName("questions");
  for (let i = 0; i < checkInput.length; i++) {
    if (checkInput[i].checked) {
      myChosing = checkInput[i].value;
      nextQuestion = true;
    }
  }
  if (myChosing == "") {
    console.log("mychosin "+myChosing);
    
   }
  if (myChosing === rAnswer) {
    numberOfCorrectAnswer++;
  }

}
const handleBullet = () => {
  let currentSpan = document.querySelectorAll(".bullets .spans span");
  let span = Array.from(currentSpan);
  span.forEach((item, index) => {
    if (curren_question === index) {
      item.classList.add("active");
    }
  })

}
const countDown = (duration, count) => {
  if (curren_question < count) {
    let min, sec;
    setCountDown = setInterval(() => {
      min = parseInt(duration / 60);  
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      countDownDiv.innerHTML = `${min}:${sec}`;
      // console.log(min + ":" + sec);
      duration--;
      if (duration < 0) {
        clearInterval(setCountDown);
        countDownDiv.style.color = "black";
        nextQuestion = true;
        submit.click();
      }
      if (min <= 0 && sec < 30) {
        countDownDiv.style.color = "red";
      }
      else{
        countDownDiv.style.color = "black";
      }
    }, 1000);
  }
}
