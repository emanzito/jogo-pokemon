function setBattle(worldState) {
    const questions = [
        { question: "She walked ______ the street", answer: "across" },
        { question: "The cat is sitting ______ the chair", answer: "on" },
        { question: "The book is ______ the shelf", answer: "on" },
        { question: "He drove ______ the tunnel.", answer: "through" },
        { question: "We went _______ the park.", answer: "to" },
        { question: "She put the groceries _______ the fridge.", answer: "in" },
        { question: "The plane flew _______ the clouds.", answer: "through" },
        { question: "The ball rolled _______ the hill.", answer: "down" },
        { question: "He climbed _______ the ladder.", answer: "up" },
        { question: "_____ you ask him to turn the sound down?", answer: "Could" },
        { question: "_____ I ______ come in?", answer: "Am / allowed to" },
        { question: "She _____ be late for school", answer: "may" },
        { question: "English is a _______ language.", answer: "global" },
        { question: "What is the capital of England?", answer: "London" },
        { question: "Who wrote Romeo and Julieta?", answer: "William Shakespeare" },
    ];

    let unansweredQuestions = [...questions]; // Armazenar perguntas não respondidas

    add([
        sprite('battle-background'),
        scale(1.3),
        pos(0, 0)
    ]);

    const enemyMon = add([
        sprite(worldState.enemyName + '-mon'),
        scale(5),
        pos(1300, 100),
        opacity(1),
        {
            fainted: false
        }
    ]);
    enemyMon.flipX = true;

    tween(
        enemyMon.pos.x,
        1000,
        0.3,
        (val) => enemyMon.pos.x = val,
        easings.easeInSine
    );

    const playerMon = add([
        sprite('player-custom'),
        scale(12),
        pos(-100, 300),
        opacity(1),
        {
            fainted: false
        }
    ]);

    tween(
        playerMon.pos.x,
        300,
        0.3,
        (val) => playerMon.pos.x = val,
        easings.easeInSine
    );

    const playerMonHealthBox = add([
        rect(400, 100),
        outline(4),
        pos(1000, 400)
    ]);

    playerMonHealthBox.add([
        text('VADIM', { size: 32 }),
        color(10, 10, 10),
        pos(10, 10)
    ]);

    playerMonHealthBox.add([
        rect(370, 10),
        color(200, 200, 200),
        pos(15, 50)
    ]);

    const playerMonHealthBar = playerMonHealthBox.add([
        rect(370, 10),
        color(0, 200, 0),
        pos(15, 50)
    ]);

    tween(playerMonHealthBox.pos.x, 850, 0.3, (val) => playerMonHealthBox.pos.x = val, easings.easeInSine);

    const enemyMonHealthBox = add([
        rect(400, 100),
        outline(4),
        pos(-100, 50)
    ]);

    enemyMonHealthBox.add([
        text(worldState.enemyName.toUpperCase(), { size: 32 }),
        color(10, 10, 10),
        pos(10, 10)
    ]);

    enemyMonHealthBox.add([
        rect(370, 10),
        color(200, 200, 200),
        pos(15, 50)
    ]);

    const enemyMonHealthBar = enemyMonHealthBox.add([
        rect(370, 10),
        color(0, 200, 0),
        pos(15, 50)
    ]);

    tween(enemyMonHealthBox.pos.x, 100, 0.3, (val) => enemyMonHealthBox.pos.x = val, easings.easeInSine);

    const box = add([
        rect(1300, 300),
        outline(4),
        pos(-2, 530)
    ]);

    const content = box.add([
        text('Are you ready to battle?', { size: 42 }),
        color(10, 10, 10),
        pos(20, 20)
    ]);

    function reduceHealth(healthBar, damageDealt) {
        tween(
            healthBar.width,
            healthBar.width - damageDealt,
            0.5,
            (val) => healthBar.width = val,
            easings.easeInSine
        );
    }

    function makeMonFlash(mon) {
        tween(
            mon.opacity,
            0,
            0.3,
            (val) => {
                mon.opacity = val;
                if (mon.opacity === 0) {
                    mon.opacity = 1;
                }
            },
            easings.easeInBounce
        );
    }

    function getRandomQuestion() {
        if (unansweredQuestions.length === 0) {
            // Se todas as perguntas foram respondidas, reinicie o registro
            unansweredQuestions = [...questions];
        }
        
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        return unansweredQuestions.splice(randomIndex, 1)[0];
    }

    let phase = 'player-selection';
    onKeyPress('space', () => {
        if (playerMon.fainted || enemyMon.fainted) return;

        if (phase === 'player-selection') {
            if (enemyMonHealthBar.width <= 0) {
                phase = 'battle-over';
                return;
            }

            if (unansweredQuestions.length > 0) {
                currentQuestion = getRandomQuestion();
                phase = 'player-turn';
            } else {
                phase = 'enemy-turn';
                content.text = worldState.enemyName.toUpperCase() + ' attacks!';
                const damageDealt = Math.random() * 230;

                if (damageDealt > 150) {
                    content.text = "It's a critical hit!";
                }

                reduceHealth(playerMonHealthBar, damageDealt);
                makeMonFlash(playerMon);

                setTimeout(() => {
                    phase = 'player-selection';
                }, 2000);
            }
            return;
        }

        if (phase === 'player-turn') {
            if (unansweredQuestions.length > 0) {
                content.text = currentQuestion.question;
                phase = 'waiting-for-answer';
            } else {
                phase = 'enemy-turn';
                content.text = worldState.enemyName.toUpperCase() + ' attacks!';
                const damageDealt = Math.random() * 230;

                if (damageDealt > 150) {
                    content.text = "It's a critical hit!";
                }

                reduceHealth(playerMonHealthBar, damageDealt);
                makeMonFlash(playerMon);

                setTimeout(() => {
                    phase = 'player-selection';
                }, 2000);
            }
            return;
        }

        if (phase === 'waiting-for-answer') {
            const playerAnswer = prompt("Answer:");
            if (playerAnswer && playerAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
                const damageDealt = Math.random() * 230;
                reduceHealth(enemyMonHealthBar, damageDealt);
                makeMonFlash(enemyMon);
                content.text = 'Correct answer!';
                phase = 'player-selection';
            } else {
                const damageDealt = Math.random() * 230;
                reduceHealth(playerMonHealthBar, damageDealt);
                makeMonFlash(playerMon);
                content.text = 'Wrong answer!';
                phase = 'player-turn';
            }
            return;
        }

        if (phase === 'enemy-turn') {
            if (enemyMonHealthBar.width <= 0) {
                phase = 'battle-over';
                return;
            }

            content.text = worldState.enemyName.toUpperCase() + ' attacks!';
            const damageDealt = Math.random() * 230;

            if (damageDealt > 150) {
                content.text = "It's a critical hit!";
            }

            reduceHealth(playerMonHealthBar, damageDealt);
            makeMonFlash(playerMon);

            phase = 'player-selection';
            return;
        }

        if (phase === 'battle-over') {
            if (enemyMonHealthBar.width <= 0) {
                content.text = worldState.enemyName.toUpperCase() + ' fainted! VADIM won the battle!';
                setTimeout(() => {
                    worldState.faintedMons.push(worldState.enemyName);
                    go('world', worldState);
                }, 2000);
            } else {
                content.text = 'VADIM fainted! You rush to get VADIM healed!';
                setTimeout(() => {
                    worldState.playerPos = vec2(500, 700);
                    go('world', worldState);
                }, 2000);
            }
            return;
        }
    });
}

setBattle(/* Your World State Object */);

