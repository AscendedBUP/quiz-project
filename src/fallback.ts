const QUESTION_NUMBER = 10
let correctAnswers = []

function setUpQuiz() { 
    const questionTemplate = document.querySelector("#question-template") as HTMLTemplateElement

    for (let i = 0; i < QUESTION_NUMBER; i++) {
        let questionData = questions[rand(0, questions.length)]
        let newQuestion = questionTemplate.content.cloneNode(true) as Element
        
        newQuestion.querySelector("#question").textContent = questionData.question
        newQuestion.querySelector("#answer-1").textContent = questionData.content[0]
        newQuestion.querySelector("#answer-2").textContent = questionData.content[1]
        newQuestion.querySelector("#answer-3").textContent = questionData.content[2]
        newQuestion.querySelector("#answer-4").textContent = questionData.content[3]

        correctAnswers.push(questionData.correct)
        document.appendChild(newQuestion)
    }
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}