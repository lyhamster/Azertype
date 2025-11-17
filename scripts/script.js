"use strict";
// This file owns all functions necessary to make this game playable//

/**
 * This function display the result of the user
 * @param {*} score : user's score
 * @param {*} nbMotsProposes : number of words showed to the user to type
 */
function afficherResultat(score, nbMotsProposes) {
    document.querySelector(".score span").innerHTML = `${score} /${nbMotsProposes}`;
}

/**
 * This function display a words or sentences according what the user has picked. 
 * In the zone "display-generatedtext"
 * @param {*} proposition : the words or sentenced displayed
 */
function displayGeneratedWords(proposition) {
    document.querySelector(".display-generatedtext").innerText = proposition;
}

/**
 * This function build and display the email
 * @param {string} yourName  : user name
 * @param {string} yourEmail : email of the person with whom the user want to share the score.
 * @param {number} score
 */
function openMailBox(yourName, yourEmail, score) {
    const subject = `Partage du score Azertype que Lyly a codé elle même`;
    const body = `Yo bg, c'est ${yourName} et je viens de réaliser le score de ${score}, c kdo`;

    let mailto=`mailto:${yourEmail}?subject=${subject}&body=${body}`;    
    window.location.href = mailto;
}

/**
 * This function check if the name put in the form has at least two letters.
 * @param {*} firstName : user name
 * @returns 
 */
function verifyName(firstName) {
    return firstName.value.length > 2;
}

/**
 * This function check if the email is valid
 * @param {string} mail 
 */
function verifyEmail(mail) {
    const isEmailValid = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z]{2,}$", "i");
    // if (!isEmailValid.test(mail))
    //     // throw new Error ("The email is not valid");
    return isEmailValid.test(mail);
}

/**
 * This function enables the user to pick between words or sentences before starting typings game
 * @returns select both radios buttons
 */
function selectAllRadio() {
    return document.querySelectorAll(".zoneProposition input");
}


function lancerJeu() {
    initAddEventListenerPopup();
    let i = 0;
    let score = 0;
    let nbMotsProposes = 0;
    let propositionList = listeMots;
    let gameFinished = false;
   
    selectAllRadio().forEach(radio => {
        radio.addEventListener("change", (event) => {
            console.log(event.target.value);
            if (event.target.value === "mots") {
                propositionList = listeMots;
            } else {
                propositionList = listePhrases;
            }
            displayGeneratedWords(propositionList[i]);
        });
    });

    displayGeneratedWords("fais ton choix bitch");
    const inputUserTypings = document.getElementById("usertypings");
    const validateButton = document.getElementById("submitButton");
    validateButton.addEventListener("click", () => {
        if (inputUserTypings.value === propositionList[i]) {
            score++;
            nbMotsProposes=propositionList.length;
        }

        i++;
        displayGeneratedWords(propositionList[i]);
        console.log(inputUserTypings.value);
        inputUserTypings.value = "";

        if (i >= propositionList.length) {
            displayGeneratedWords("fin du game pétasse");
            validateButton.disabled = true;
            gameFinished = true;
            const gameResultToShare = `${score}/${nbMotsProposes}`
            manageForm(gameResultToShare);
            afficherResultat(score, nbMotsProposes);
        }
    }); 
  
    selectAllRadio().forEach((radio) => {
        radio.addEventListener("click", () => {
            if (gameFinished){
                resetGame();
            }
        });
    });
}
  
function resetGame() {
   window.location.reload()
}

function manageForm(shareScore) {
    const sentForm = document.getElementById("shareForm");
    sentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById("user-name");
        const nameValue = nameInput.value;
        const email = document.getElementById("email");
        const emailValue = email.value;
        
        try {
            const errorsMessage = []
            const isNameValid = verifyName(nameInput);
            if (!isNameValid) {
                errorsMessage.push("Le nom n'est pas valide ");
            }
            const isEmailValid = verifyEmail(emailValue);
            if (!isEmailValid) {
                errorsMessage.push("L'email n'est pas valide.");
            }

            if (isNameValid !== true || isEmailValid !== true) {
                throw new Error("erreur", {cause: errorsMessage});
            }
            verifyName(nameInput);
            // openMailBox(nameValue,email,shareScore);
            showErrorMessage();
        } catch (error) {
            console.log(error.cause); 
            showErrorMessage(error.cause);
        }
    })
}

function showErrorMessage(error){

    const spanNameBlock = document.querySelector(".spanNameBlock");
    const popUP = document.querySelector(".overlay-popup");

    const spanEmailBlock = document.querySelector(".spanEmailBlock")
    
    if (!spanNameBlock && !spanEmailBlock) {  
        const newNameSpanBlock = document.createElement("span"); 
        popUP.insertAdjacentElement("beforeend", newNameSpanBlock);
        newNameSpanBlock.classList.add("spanNameBlock");
        newNameSpanBlock.textContent = error[0];

        const newEmailSpanBlock = document.createElement("span"); 
        popUP.insertAdjacentElement("beforeend", newEmailSpanBlock);
        newEmailSpanBlock.classList.add("spanEmailBlock");
        newEmailSpanBlock.textContent = error[1];
    } else if (!error) { 
        spanNameBlock.remove();
        spanEmailBlock.remove();
    } else if (spanNameBlock && spanEmailBlock) {
        spanNameBlock.textContent = error[0];
        spanEmailBlock.textContent = error[1];
    }
}