const csrfToken = '{{ csrf_token }}';
const jsonData = JSON.parse(document.getElementById('data-script').textContent);
const term = document.getElementById("term");
const userInput = document.querySelector(".input");
const form = document.getElementById("answer-container");
const deckList = document.getElementsByClassName("deck-list");
const quiz = document.querySelector(".quiz");
const results = document.querySelector(".results");
const correctList = document.querySelector(".correct");
const incorrectList = document.querySelector(".incorrect");
let cardList = [];
let correct = [];
let incorrect = [];
jsonData.forEach(card => {
    cardList.push(card);
})

function flipCard(e) {
    target = e.target 
    if (target.classList.contains("flip")) {
        if (target.parentElement.querySelector(".back").style.display === "none") {
            target.parentElement.querySelector(".back").style.display = "inline-block";
            target.parentElement.querySelector(".front").style.display = "none";
        } else {
            target.parentElement.querySelector(".back").style.display = "none";
            target.parentElement.querySelector(".front").style.display = "inline-block";
        }
    }
}

function startQuiz(questions) {
    if (questions.length === 0) {
        // All questions have been answered, exit the loop
        showResults(correct, incorrect);
        return;
    }

    let i = Math.floor(Math.random() * questions.length);
    let question = questions[i];
    term.innerHTML = question.CardFront;
    userInput.focus();

    const handleSubmit = (e) => {
        e.preventDefault();

        let answer = question.CardBack;
        guess = userInput.value;
        if (answer === guess) {
            userInput.style.backgroundColor = "lightgreen";
            questions.splice(i, 1);
            if (!incorrect.includes(question)) {
                correct.push(question);
            }
        } else {
            userInput.style.backgroundColor = 'red';
            if (!incorrect.includes(question)) {
                incorrect.push(question);
            }
        }
        term.innerHTML = question.CardBack
        userInput.disabled = true;
        form.removeEventListener('submit', handleSubmit);
        form.addEventListener('submit', nextQuestion);
        document.addEventListener('keydown', pressEnter);
    }

    const pressEnter = function(event) {
        if (event.key === 'Enter') {
            document.removeEventListener('keydown', pressEnter)
            nextQuestion(event);
        }
    }

    const nextQuestion = (e) => {
        e.preventDefault();
    
        userInput.disabled = false; 
        userInput.style.backgroundColor = "white";
        userInput.value = '';
        form.removeEventListener('submit', nextQuestion);
        document.removeEventListener('keydown', pressEnter);
        startQuiz(cardList);
    }

    form.addEventListener('submit', handleSubmit); 
}

function renderCards(listCards, deckHTML) {
    listCards.forEach(cardname => {
        const row = document.createElement("div");
        row.classList.add("card");
        row.innerHTML = `
            <p class="card-content front">${cardname["CardFront"]}</p>
            <p class="card-content back">${cardname["CardBack"]}</p>
            <button class="flip">Flip</button>
        `
        deckHTML.appendChild(row);
    })
}

function showResults(right, wrong) {
    quiz.style.display = "none";
    results.style.display = "flex";
    document.querySelector(".signout-button").style.display = "inline-block"
    renderCards(right, correctList);
    renderCards(wrong, incorrectList);
}

Array.from(deckList).forEach(deck => {
    deck.addEventListener("click", flipCard);
})

startQuiz(cardList);

