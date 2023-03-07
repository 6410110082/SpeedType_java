const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
tryAgainBtn = document.querySelector(".content button"),

timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span");
// Update the result values in the popup modal
mistakePopup = document.querySelector('#popup-modal .mistake span');
wpmTagPopup = document.querySelector('#popup-modal .wpm span');
cpmTagPopup = document.querySelector('#popup-modal .cpm span');
accuracyTagPopup = document.querySelector('#popup-modal .acc span');


let timer,
maxTime = 1,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;


const timerBar = document.querySelector(".timer-bar-progress");

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let correctChars = charIndex - mistakes;
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
        
    } else {
        clearInterval(timer);
        if (timeLeft == 0) {
            setTimeout(showPopupModal, 1000); 
        } else {
            inpField.value = "";
            showPopupModal();
        }
    }   
}
const popupModal = document.getElementById("popup-modal");
const tryAgainPopupBtn = document.querySelector(".try-again-btn");

function showPopupModal() {
    let correctChars = charIndex - mistakeTag.innerText;;
    let accuracy = Math.round((correctChars / charIndex) * 100);
    popupModal.style.display = "block";
    tryAgainPopupBtn.addEventListener("click", resetGame);
    wpmTagPopup.innerText = wpmTag.innerText;
    mistakePopup.innerText = mistakeTag.innerText;
    cpmTagPopup.innerText = charIndex - mistakes;
    accuracyTagPopup.innerText = accuracy;

}


function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
        
        const progress = (timeLeft / maxTime) * 100;
        timerBar.style.width = `${progress}%`;
    } 
    else {
        clearInterval(timer);
        showPopupModal();
        
    }
}

function resetGame() {
    timerBar.style.width = "100%";

    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    popupModal.style.display = "none"; // Hide the popup modal

}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);

