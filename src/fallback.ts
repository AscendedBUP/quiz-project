const QUESTIONS_NUMBER = 10
const TIME_ALLOWED = 10 * 60 * 1000
const QUIZ_START_TIME = Date.now()

const timerElement = document.querySelector("#timer-display") as HTMLHeadingElement

let correctAnswers : {[questionNumber: number]: number} = {}
let points = 0

function setUpQuiz() {
    const questionsElement = document.querySelector("#questions")
    const questionTemplate = document.querySelector("#question-template") as HTMLTemplateElement
    const burnedQuestions : number[] = []

    for (let i = 0; i < QUESTIONS_NUMBER; i++) {
        let questionId : number = rand(0, questions.length)
        while (burnedQuestions.includes(questionId)) { questionId = rand(0, questions.length)}
        burnedQuestions.push(questionId)

        let questionData = questions[questionId]
        let newQuestion = questionTemplate.content.cloneNode(true) as Element

        newQuestion.querySelectorAll(`input[type="radio"]`).forEach((radio: HTMLInputElement) => radio.name = `${i}`)
        newQuestion.querySelector(".question").textContent = `${i+1}. ${questionData.question}`
        newQuestion.querySelector(".answers").setAttribute("question-number", `${i}`)

        newQuestion.querySelector(".answer-0 div").textContent = questionData.content[0];
        (newQuestion.querySelector(".answer-0 input") as HTMLInputElement).value = `0`;
        newQuestion.querySelector(".answer-1 div").textContent = questionData.content[1];
        (newQuestion.querySelector(".answer-1 input") as HTMLInputElement).value = `1`;
        newQuestion.querySelector(".answer-2 div").textContent = questionData.content[2];
        (newQuestion.querySelector(".answer-2 input") as HTMLInputElement).value = `2`;
        newQuestion.querySelector(".answer-3 div").textContent = questionData.content[3];
        (newQuestion.querySelector(".answer-3 input") as HTMLInputElement).value = `3`;

        correctAnswers[i] = questionData.correct
        questionsElement.appendChild(newQuestion)
    }
}

function checkQuestions() {
    clearInterval(interval);

    (document.querySelector("#check") as HTMLButtonElement).disabled = true;
    (document.querySelector("#reset") as HTMLButtonElement).disabled = true;

    document.querySelectorAll("input").forEach((input : HTMLInputElement) => input.disabled = true)
    document.querySelectorAll(".answers").forEach((answers) => {
        let questionNumber = Number(answers.getAttribute("question-number"))
        let correctAnswer = correctAnswers[questionNumber]
        let selectedRadio = answers.querySelector(`input:checked`) as HTMLInputElement

        answers.querySelector(`.answer-${correctAnswer}`).classList.add("bg-success")

        if (selectedRadio == null) {
            return
        }

        let answer = Number(selectedRadio.value)

        if (answer == correctAnswer) {
            points++;
            return
        }

        selectedRadio.parentElement.classList.add("bg-danger")
    })

    let percentageResult = points / QUESTIONS_NUMBER * 100
    let timeLeft = getTimeLeft()

    document.querySelector("#result-display").textContent = `${percentageResult}% (${points}/${QUESTIONS_NUMBER})`
    document.querySelector("#time-left").textContent = `${timeLeft.minutes}:${timeLeft.seconds}`
    document.querySelector('#results').classList.remove("d-none")
}

function resetQuestions() {
    document.querySelectorAll("input").forEach((input : HTMLInputElement) => input.checked = false)
}

function updateTimer() {
    let timeLeft = getTimeLeft()
    timerElement.innerText = `Time Remaining ${timeLeft.minutes}:${timeLeft.seconds}`

    if (timeLeft.timeLeft <= 0) {
        checkQuestions()
    }    
}

function getTimeLeft(): {minutes: number, seconds: number, timeLeft: number} {
    let timeLeft = TIME_ALLOWED - (Date.now() - QUIZ_START_TIME)

    if (timeLeft < 0) {
        return {minutes: 0, seconds: 0, timeLeft: 0}
    }

    let minutesLeft = Math.floor(timeLeft / (1000 * 60))
    let secondsLeft = Math.floor((timeLeft - (minutesLeft * 60 * 1000)) / 1000)

    return {minutes: minutesLeft, seconds: secondsLeft, timeLeft: timeLeft}
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

let interval = 0
clearInterval(interval)
interval = setInterval(updateTimer, 250)

setUpQuiz()