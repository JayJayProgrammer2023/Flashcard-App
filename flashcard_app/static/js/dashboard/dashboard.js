const createBtn = document.getElementById("create-deck");
const createForm = document.getElementById("create-form");
const editForm = document.getElementById("edit-form");
const deck = document.querySelector(".deck-container");
const addCard = document.getElementById("add-cards");
const startQuiz = document.getElementById("start-quiz");
const deckFiller = document.querySelector(".deck-filler");
let selectedRow = null;
let deckList = []
let deletedList = []

function renderDecks(decks) {
    decks.forEach(deckname => {
        const row = document.createElement("div");
        row.classList.add("deck-filler");
        row.innerHTML = `
        <h3 class="deck-name">${deckname["DeckName"]}</h3>
        <h3 class="deck-due">0</h3>
        <h3 class="deck-new">0</h3>
        <button class="button edit">Edit</button>
        <button class="button delete">Delete</button>
        `;
        deck.appendChild(row);
        selectedRow = null;
    })
}

function openCreateForm() {
    createForm.style.display = "flex";
    createBtn.onclick = closeCreateForm;
}

function closeCreateForm() {
    createForm.style.display = "none";
    selectedRow = null;
    createBtn.onclick = openCreateForm;
}

function openEditForm(e) {
    target = e.target 
    if (target.classList.contains("edit")) {
        editForm.style.display = "flex";
    }
    deck.onclick = closeEditForm;
    selectedRow = target.parentElement;
    editForm.addEventListener("submit", editDeckName);
}

function editDeckName(e) {
    e.preventDefault();

    target = e.target
    const firstName = target.parentElement.querySelector(".deck-name").innerHTML;
    let newName = document.querySelector("#name-change").value;
    shouldSkip = false
    deckList.forEach( deck => {
        if (shouldSkip) {
            return;
        }
        console.log(deck["DeckName"]);
        if (firstName === deck["DeckName"]) {
            deck["DeckName"] = newName;
            console.log(deck["DeckName"]);
            shouldSkip = true;
            return;
        }
    })
    selectedRow.children[0].textContent = newName;
    selectedRow = null;
    editForm.style.display = "none";
    sendDataToBackend();
}

function closeEditForm(e) {
    target = e.target
    if (target.classList.contains("edit")) {
        editForm.style.display = "none"
    }
    deck.onclick = openEditForm;
}

function createDeck(e) {
    e.preventDefault();

    deckName = document.querySelector("#deck-name").value;
    if (selectedRow === null) {
        const row = document.createElement("div");
        row.classList.add("deck-filler");
        row.innerHTML = `
            <h3 class="deck-name">${deckName}</h3>
            <h3 class="deck-due">0</h3>
            <h3 class="deck-new">0</h3>
            <button class="button edit">Edit</button>
            <button class="button delete">Delete</button>
        `;
        deckList.push({'DeckName': `${deckName}`})
        console.log(deckList);
        deck.appendChild(row);
        selectedRow = null;
        sendDataToBackend();
    }
    closeCreateForm();
}

function deleteDeck(e) {
    target = e.target;
    if (target.classList.contains("delete")) {
        const deckName = target.parentElement.querySelector(".deck-name").innerHTML;
        deckList.forEach(
            deckObject => {
                if (deckObject['DeckName'] === deckName) {
                    deckList.splice(deckList.indexOf(deckObject), 1);
                    deletedList.push(deckObject)
                    console.log(deletedList);
                }
            }
        )
        target.parentElement.remove();
        sendDataToBackend();
    }

}

function sendDataToBackend() {
    const jsonData = JSON.stringify(deckList);
    fetch('/dashboard/api/send-decks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken 
        },
        body: jsonData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from Django (data) here
        if (data.success) { // Use 'data' instead of 'response'
            console.log("Data sent successfully!"); // Server acknowledged successful submission
        } else {
            console.error('Network response was not ok.');
        }
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addCards() {
    document.querySelector(".add-select").style.display = "flex";
    deck.addEventListener("click", sendToAddCards);
    addCard.removeEventListener("click", addCards);
    addCard.addEventListener("click", closeAddCards);
    document.querySelector(".quiz-select").style.display = "none";
    startQuiz.removeEventListener("click", closeQuizStart);
    startQuiz.addEventListener("click", quizStart);
}

function quizStart() {
    document.querySelector(".quiz-select").style.display = "flex";
    deck.addEventListener("click", sendToQuizStart);
    startQuiz.removeEventListener("click", quizStart);
    startQuiz.addEventListener("click", closeQuizStart);
    document.querySelector(".add-select").style.display = "none";
    addCard.removeEventListener("click", closeAddCards);
    addCard.addEventListener("click", addCards);
}

function closeAddCards() {
    document.querySelector(".add-select").style.display = "none";
    addCard.removeEventListener("click", closeAddCards);
    deck.removeEventListener("click", sendToAddCards);
    addCard.addEventListener("click", addCards);
}

function closeQuizStart() {
    document.querySelector(".quiz-select").style.display = "none";
    deck.removeEventListener("click", sendToQuizStart);
    startQuiz.removeEventListener("click", closeQuizStart);
    startQuiz.addEventListener("click", quizStart)
}

function sendToQuizStart(e) {
    target = e.target;
    deckName = target.innerHTML
    deckList.forEach( deck => {
        if (deck["DeckName"] === deckName) {
            window.location.href = `http://127.0.0.1:8000/dashboard/quiz-start/${deck["DeckID"]}`
        }
    })
}


function sendToAddCards(e) {
    target = e.target;
    deckName = target.innerHTML
    shouldSkip = false;
    deckList.forEach( deck => {
        if (shouldSkip) {
            return;
        }
        if (deck["DeckName"] === deckName) {
            window.location.href = `http://127.0.0.1:8000/dashboard/add-cards/${deck["DeckID"]}`
        }
    })
}

createForm.addEventListener("submit", createDeck);
createBtn.onclick = openCreateForm;
deck.addEventListener("click", deleteDeck);
deck.onclick = openEditForm;
addCard.addEventListener("click", addCards);
startQuiz.addEventListener("click", quizStart);

fetch('api/render-decks/')
    .then(response => response.json())
    .then(data => {
        deckList = data["Decks"];
        console.log(deckList);
        renderDecks(deckList);
    })
    .catch(error => {
        console.error(error);
  });

