const startExperience = () => {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    document.body.appendChild(messageDiv);

    const firstMessage = document.createElement("p");
    firstMessage.textContent = "Oi bub, psst, i love you....";
    firstMessage.classList.add("fade-in");
    messageDiv.appendChild(firstMessage);

    setTimeout(() => {
        const secondMessage = document.createElement("p");
        secondMessage.textContent = "Here is something special from me to you. It'll be a short one though...";
        secondMessage.classList.add("fade-in");
        messageDiv.appendChild(secondMessage);

        setTimeout(() => {
            const proceedButton = document.createElement("button");
            proceedButton.textContent = "Proceed 💖";
            proceedButton.classList.add("proceed-btn");
            proceedButton.onclick = startPoem;
            messageDiv.appendChild(proceedButton);
        }, 2000);
    }, 2000);
};

const poemLines = [
    "i heard no music", 
    "until the music was you",
    "i stole the above two lines from a haiku",
    "because i didn't think much through",
    "let's start here, as i think of you",
    "pretty lips, beautiful eyes",
    "is all i can think of",
    "when i rise",
    "we will be together, for eternity",
    "this i want happens, with certainty",
    "the page is about to end",
    "so i say this to you",
    "i heard no music",
    "until the music was you",
];

const startPoem = () => {
    const messageDiv = document.querySelector(".message");
    messageDiv.innerHTML = "";

    let index = 0;

    const displayNextLine = () => {
        if (index < poemLines.length) {
            const poemLine = document.createElement("p");
            poemLine.textContent = poemLines[index];
            poemLine.classList.add("fade-in");
            messageDiv.appendChild(poemLine);
            index++;
            setTimeout(displayNextLine, 2000);
        } else {
            setTimeout(() => {
                const proceedButton = document.createElement("button");
                proceedButton.textContent = "Proceed 💖";
                proceedButton.classList.add("proceed-btn");
                proceedButton.onclick = startGameIntro;
                messageDiv.appendChild(proceedButton);
            }, 2000);
        }
    };

    displayNextLine();
};

const startGameIntro = () => {
    const messageDiv = document.querySelector(".message");
    messageDiv.innerHTML = "";

    const gameMessage = document.createElement("p");
    gameMessage.innerHTML = "Before the final thing, you have to finish a game, the rules are simple:<br>Catch the balls in a basket that fall, the green balls give you 1 point, the blue balls give you 50 points, and the red balls give you 100 points.<br><br>To win you have to score exactly 811 points, no more no less<br>811, because of course, '0811'";
    gameMessage.classList.add("fade-in");
    messageDiv.appendChild(gameMessage);

    setTimeout(() => {
        const startButton = document.createElement("button");
        startButton.textContent = "Start Game 💖";
        startButton.classList.add("proceed-btn");
        startButton.onclick = startGame;
        messageDiv.appendChild(startButton);
    }, 2000);
};

const startGame = () => {
    const messageDiv = document.querySelector(".message");
    messageDiv.innerHTML = "";

    // Responsive canvas sizing
    const canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    const aspectRatio = 4 / 3; // Width-to-height ratio (adjustable)
    const maxWidth = Math.min(window.innerWidth * 0.9, 800);
    const maxHeight = Math.min(window.innerHeight * 0.7, 600);
    canvas.width = maxWidth;
    canvas.height = Math.min(maxWidth / aspectRatio, maxHeight);
    messageDiv.appendChild(canvas);

    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "score";
    scoreDisplay.textContent = "Score: 0";
    messageDiv.appendChild(scoreDisplay);

    const ctx = canvas.getContext("2d");
    let score = 0;
    const targetScore = 811;

    // Scale game elements based on canvas size
    const scale = canvas.width / 800; // Base design on 800px width
    const basket = {
        x: canvas.width / 2 - 25 * scale,
        y: canvas.height - 50 * scale,
        width: 50 * scale,
        height: 30 * scale
    };
    const heartSize = 20 * scale;

    // Hearts
    const hearts = [];
    const heartTypes = [
        { color: "green", points: 1 },
        { color: "blue", points: 50 },
        { color: "red", points: 100 }
    ];

    // Movement controls
    function moveBasket(x) {
        basket.x = x - basket.width / 2;
        if (basket.x < 0) basket.x = 0;
        if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
    }

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        moveBasket(e.clientX - rect.left);
    });

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        moveBasket(touch.clientX - rect.left);
    }, { passive: false });

    canvas.addEventListener("touchstart", (e) => {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        moveBasket(touch.clientX - rect.left);
    }, { passive: false });

    // Spawn hearts
    function spawnHeart() {
        const type = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        hearts.push({
            x: Math.random() * (canvas.width - heartSize),
            y: -heartSize,
            width: heartSize,
            height: heartSize,
            color: type.color,
            points: type.points,
            speed: (2 + Math.random() * 2) * scale // Scale speed
        });
    }

    // Game loop
    let lastTime = 0;
    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw basket
        ctx.fillStyle = "#ff6b81";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

        // Update and draw hearts
        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];
            heart.y += heart.speed;

            // Draw heart
            ctx.fillStyle = heart.color;
            ctx.beginPath();
            ctx.moveTo(heart.x + heart.width / 2, heart.y);
            ctx.bezierCurveTo(
                heart.x + heart.width, heart.y,
                heart.x + heart.width, heart.y + heart.height,
                heart.x + heart.width / 2, heart.y + heart.height
            );
            ctx.bezierCurveTo(
                heart.x, heart.y + heart.height,
                heart.x, heart.y,
                heart.x + heart.width / 2, heart.y
            );
            ctx.fill();

            // Check collision
            if (
                heart.y + heart.height > basket.y &&
                heart.y < basket.y + basket.height &&
                heart.x + heart.width > basket.x &&
                heart.x < basket.x + basket.width
            ) {
                score += heart.points;
                hearts.splice(i, 1);
                scoreDisplay.textContent = `Score: ${score}`;

                if (score === targetScore) {
                    finalSurprise();
                    return;
                } else if (score > targetScore) {
                    scoreDisplay.textContent = `Score: ${score} - Too much! Try again later 💖`;
                    setTimeout(startGame, 2000);
                    return;
                }
            }

            if (heart.y > canvas.height) {
                hearts.splice(i, 1);
            }
        }

        if (Math.random() < 0.02) spawnHeart();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
};

const finalSurprise = () => {
    const messageDiv = document.querySelector(".message");
    messageDiv.innerHTML = "";

    const finalText = document.createElement("p");
    finalText.textContent = "HAPPY BIRTHDAY BUBUUUU, i love you so much 😘";
    finalText.classList.add("fade-in");
    messageDiv.appendChild(finalText);

    document.body.classList.add("final-bg");

    const image = document.createElement("img");
    image.src = "./images/PXL_20230512_083515040.jpg";
    image.classList.add("fade-in");
    messageDiv.appendChild(image);
};