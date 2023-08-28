const flipBtn = document.querySelector(".flip");
const form = document.querySelector(".card-info");
const cards = document.getElementsByClassName("card");
const deckTitle = document.querySelector(".deck-title")
const deckList = document.querySelector(".deck-list");
const submitBtn = document.querySelector(".submit-button");
const textArea = document.getElementsByClassName("info");
let cardList = []

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

function deleteCard(e) {
    target = e.target 
    if (target.classList.contains("delete")) {
        target.parentElement.remove();
        front = target.parentElement.querySelector(".front").innerHTML;
        back = target.parentElement.querySelector(".back").innerHTML; 
        cardItem = {'CardFront': front, 'CardBack': back}
        cardList.forEach(card => {
            if (card["Front"] === front && card["Back"] === back) {
                console.log("Match");
                cardList.splice(cardList.indexOf(card), 1);
                console.log(cardList);
            }
        })
        sendDataToBackend();
    }
}

function createCard(e) {
    e.preventDefault();

    let front = form.querySelector("#front-info").value;
    let back = form.querySelector("#back-info").value;
    const row = document.createElement("div");
    row.classList.add("card");
    row.innerHTML = `
        <button class="flip">Flip</button>
        <p class="card-content front">${front}</p>
        <p class="card-content back">${back}</p>
        <button class="delete">Delete</button>
    `
    deckList.appendChild(row);
    cardList.push({"DeckName": deckTitle.innerHTML, 'Front': front, 'Back': back, "NotEmpty": true})
    form.reset();
    console.log(cardList)
    sendDataToBackend();
}

function sendDataToBackend() {
    let jsonData
    if (cardList.length !== 0) {
        jsonData = JSON.stringify(cardList);
    } else {
        cardList.push({"DeckName": deckTitle.innerHTML, "NotEmpty": false})
        jsonData = JSON.stringify(cardList)
    }
    fetch(apiUrl, {
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
            console.log(data);
        } else {
            console.error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

deckList.addEventListener("click", flipCard);
deckList.addEventListener("click", deleteCard);
form.addEventListener("submit", createCard);

console.log(cards);

if (cards) {
    Array.from(cards).forEach( card => {
        cardList.push({"DeckName": deckTitle.innerHTML, "Front": card.querySelector(".front").innerHTML, "Back": card.querySelector(".back").innerHTML, "NotEmpty": true}) 
    })
}
console.log(cardList);



