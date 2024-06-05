let playerName = "";
let playerPhoto = "";
let score = 0;
let words = ["ordinateur", "javascript", "internet", "developpeur", "logiciel"];
let currentWord = "";
let hiddenWord = "";
let attempts = 3;
let successStreak = 0;
let totalAttempts = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();
});

function showRegister() {
    document.getElementById("register").style.display = "block";
    document.getElementById("login").style.display = "none";
}

function showLogin() {
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function register() {
    const name = document.getElementById("registerName").value;
    const password = document.getElementById("registerPassword").value;
    const photoInput = document.getElementById("registerPhoto");
    const reader = new FileReader();

    reader.onload = function (event) {
        const photo = event.target.result;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(user => user.name === name);

        if (userExists) {
            alert("Ce nom est déjà pris. Veuillez choisir un autre nom.");
        } else {
            users.push({ name, password, photo });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Inscription réussie. Vous pouvez maintenant vous connecter.");
            showLogin();
        }
    };

    if (photoInput.files[0]) {
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        alert("Veuillez sélectionner une photo.");
    }
}

function login() {
    const name = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.name === name && user.password === password);

    if (user) {
        playerName = user.name;
        playerPhoto = user.photo;
        document.getElementById("profileName").textContent = playerName;
        document.getElementById("profilePhoto").src = playerPhoto;
        document.getElementById("auth").style.display = "none";
        document.getElementById("game").style.display = "block";
        document.getElementById("leaderboard").style.display = "block";
        startGame();
    } else {
        alert("Nom ou mot de passe incorrect.");
    }
}

function startGame() {
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("attemptsCount").textContent = `Tentatives restantes: ${attempts}`;
    nextWord();
}

function nextWord() {
    if (words.length === 0) {
        alert("Bravo ! Vous avez deviné tous les mots.");
        endGame();
        return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    hiddenWord = currentWord.split("").map((char, index) => (index >= Math.floor(currentWord.length / 3) && index < Math.ceil(2 * currentWord.length / 3)) ? char : "_").join("");
    document.getElementById("hiddenWord").textContent = hiddenWord;
}

function makeGuess() {
    const guess = document.getElementById("guess").value.toLowerCase();
    const feedback = document.getElementById("feedback");

    if (guess === currentWord) {
        if (successStreak >= 5) {
            score += successStreak >= 10 ? 20 : 10;
        } else {
            score += 1;
        }
        successStreak++;
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
    } else {
        successStreak = 0;
        feedback.textContent = `Incorrect! Le mot était: ${currentWord}`;
        feedback.style.color = "red";
    }

    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("guess").value = "";

    totalAttempts++;
    if (totalAttempts % 3 === 0 && successStreak < 5) {
        attempts--;
        document.getElementById("attemptsCount").textContent = `Tentatives restantes: ${attempts}`;
    }

    if (attempts === 0) {
        alert("Vous avez échoué 3 fois de suite. Fin du jeu.");
        endGame();
    } else {
        words.splice(words.indexOf(currentWord), 1);
        nextWord();
    }
}

function skipWord() {
    nextWord();
}

function restartGame() {
    score = 0;
    attempts = 3;
    successStreak = 0;
    totalAttempts = 0;
    words = ["ordinateur", "javascript", "internet", "developpeur", "logiciel"];
    startGame();
}

function saveGame() {
    const savedGame = {
        playerName,
        playerPhoto,
        score,
        attempts,
        successStreak,
        totalAttempts,
        words
    };
    localStorage.setItem("savedGame", JSON.stringify(savedGame));
    alert("Jeu sauvegardé.");
}

function loadSavedGame() {
    const savedGame = JSON.parse(localStorage.getItem("savedGame"));
    if (savedGame) {
        playerName = savedGame.playerName;
        playerPhoto = savedGame.playerPhoto;
        score = savedGame.score;
        attempts = savedGame.attempts;
        successStreak = savedGame.successStreak;
        totalAttempts = savedGame.totalAttempts;
        words = savedGame.words;
        document.getElementById("profileName").textContent = playerName;
        document.getElementById("profilePhoto").src = playerPhoto;
        document.getElementById("auth").style.display = "none";
        document.getElementById("game").style.display = "block";
        document.getElementById("leaderboard").style.display = "block";
        startGame();
    }
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = leaderboard
        .sort((a, b) => b.score - a.score)
        .map(player => `<li>${player.name}: ${player.score}</li>`)
        .join("");
}

function endGame() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    loadLeaderboard();
    alert(`Jeu terminé! Votre score est ${score}.`);
    document.getElementById("auth").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";
}
