// ============================================================
// GAME: dialogue_greetings — Greeting Dialogue Scenario
// Theme 1: School Life — Greetings & Introductions
// Mechanic: Choose correct response in a conversation
// ============================================================

registerGame('dialogue_greetings', {
  data: {
    title: 'Selamlaşma Diyaloğu',
    difficulty: {
      supporting: {
        rounds: [
          { speaker: '👩‍🏫', says: 'Hello!', prompt: 'Öğretmen sana selam veriyor. Ne dersin?', correct: 'Hello!', options: ['Hello!', 'Goodbye!', 'Sorry!'] },
          { speaker: '👦', says: 'Good morning!', prompt: 'Arkadaşın günaydın diyor. Ne dersin?', correct: 'Good morning!', options: ['Good morning!', 'See you!', 'Thank you!'] },
          { speaker: '👩‍🏫', says: 'How are you?', prompt: 'Öğretmen nasılsın diye soruyor.', correct: "I'm fine, thanks!", options: ["I'm fine, thanks!", 'Goodbye!', "It's Monday."] },
          { speaker: '👧', says: "What's your name?", prompt: 'Yeni bir arkadaş adını soruyor.', correct: "My name is...", options: ["My name is...", "I'm fine!", 'Hello!'] },
          { speaker: '👩‍🏫', says: 'Goodbye!', prompt: 'Ders bitti. Öğretmen veda ediyor.', correct: 'Bye! See you tomorrow!', options: ['Bye! See you tomorrow!', 'Good morning!', "How are you?"] }
        ]
      },
      standard: {
        rounds: [
          { speaker: '👩‍🏫', says: 'Hello!', prompt: 'Öğretmen sana selam veriyor.', correct: 'Hi!', options: ['Hi!', 'Sorry!', 'Goodbye!', "It's Monday."] },
          { speaker: '👦', says: 'Good morning!', prompt: 'Arkadaşın günaydın diyor.', correct: 'Good morning!', options: ['Good morning!', 'See you!', 'Thank you!', 'Bye!'] },
          { speaker: '👩‍🏫', says: 'How are you?', prompt: 'Öğretmen nasılsın diye soruyor.', correct: "I'm fine, thanks! And you?", options: ["I'm fine, thanks! And you?", 'See you tomorrow!', "It's Monday.", 'Nice!'] },
          { speaker: '👧', says: "What's your name?", prompt: 'Yeni bir arkadaş adını soruyor.', correct: "I'm Ali. Nice to meet you!", options: ["I'm Ali. Nice to meet you!", "I'm fine!", 'Hello!', 'Hurray!'] },
          { speaker: '🧑', says: "Who's she?", prompt: 'Birisi öğretmeni soruyor.', correct: "She's Mrs. Hopkins. She's a teacher.", options: ["She's Mrs. Hopkins. She's a teacher.", "It's a classroom.", "He's my friend.", 'Good morning!'] },
          { speaker: '👩‍🏫', says: 'Goodbye, everyone!', prompt: 'Ders bitti. Öğretmen veda ediyor.', correct: 'Goodbye! See you tomorrow!', options: ['Goodbye! See you tomorrow!', 'Good morning!', "How are you?", 'Welcome!'] }
        ]
      },
      expansion: {
        rounds: [
          { speaker: '👩‍🏫', says: 'Good morning, class!', prompt: 'Öğretmen sınıfa günaydın diyor.', correct: 'Good morning, teacher!', options: ['Good morning, teacher!', 'Goodbye!', "It's Monday.", 'Sorry!'] },
          { speaker: '👦', says: 'Hi! How are you?', prompt: 'Arkadaşın hal hatır soruyor.', correct: "I'm fine, thanks! And you?", options: ["I'm fine, thanks! And you?", 'Hello!', 'See you!', "It's Monday."] },
          { speaker: '👧', says: "What's your name?", prompt: 'Yeni bir arkadaş adını soruyor.', correct: "My name is Elif. Nice to meet you!", options: ["My name is Elif. Nice to meet you!", "She's a teacher.", "I'm fine!", 'Welcome!'] },
          { speaker: '🧑', says: "Who's he?", prompt: 'Birisi müdürü soruyor.', correct: "He's Mr. Aras. He's the headmaster.", options: ["He's Mr. Aras. He's the headmaster.", "It's a library.", "She's a pupil.", 'Excuse me!'] },
          { speaker: '👧', says: "Excuse me! Can I sit here?", prompt: 'Yeni öğrenci oturmak istiyor.', correct: "Sure! Welcome!", options: ["Sure! Welcome!", "Goodbye!", "It's Monday.", "I'm fine."] },
          { speaker: '🧒', says: "Where is she?", prompt: 'Arkadaşını arıyor.', correct: "She is in the garden.", options: ["She is in the garden.", "She's a teacher.", "It's Monday.", "Hello!"] },
          { speaker: '👩‍🏫', says: 'See you tomorrow!', prompt: 'Öğretmen yarın görüşürüz diyor.', correct: 'Goodbye! See you tomorrow!', options: ['Goodbye! See you tomorrow!', 'Good morning!', "How are you?", "What's your name?"] }
        ]
      }
    }
  },

  launch: function(area, config) {
    gameState.rounds = shuffle(config.rounds);
    gameState.round = 0;
    gameState.total = gameState.rounds.length;
    gameState.score = 0;
    gameState.locked = false;
    renderDialogueRound(area);
  }
});

function renderDialogueRound(area) {
  const r = gameState.rounds[gameState.round];
  const opts = shuffle(r.options);
  area.innerHTML = `
    <div class="ge-container">
      <div class="ge-progress">
        <span class="ge-score">✓ <span id="dlgScore">${gameState.score}</span> / ${gameState.total}</span>
        <span class="ge-round">Soru ${gameState.round + 1} / ${gameState.total}</span>
      </div>
      <div class="ge-dialogue-scene">
        <div class="ge-character">${r.speaker}</div>
        <div class="ge-speech-bubble">${r.says}</div>
        <div class="ge-prompt-text">${r.prompt}</div>
      </div>
      <div class="ge-options">
        ${opts.map(o => `<div class="ge-option" onclick="dialogueAnswer(this, '${o.replace(/'/g, "\\'")}', '${r.correct.replace(/'/g, "\\'")}')">${o}</div>`).join('')}
      </div>
    </div>`;
}

function dialogueAnswer(el, answer, correct) {
  if (gameState.locked) return;
  gameState.locked = true;

  if (answer === correct) {
    el.classList.add('correct');
    gameState.score++;
    document.getElementById('dlgScore').textContent = gameState.score;
  } else {
    el.classList.add('wrong');
    document.querySelectorAll('.ge-option').forEach(o => {
      if (o.textContent === correct) o.classList.add('correct');
    });
  }

  setTimeout(() => {
    gameState.round++;
    gameState.locked = false;
    if (gameState.round >= gameState.total) {
      showEndScreen(gameState.score, gameState.total);
    } else {
      renderDialogueRound(document.getElementById('gameArea'));
    }
  }, 1200);
}
