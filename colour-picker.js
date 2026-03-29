// ============================================================
// GAME: colour_picker — Colour Picker
// Theme 2: Classroom Life — Colours + Objects
// Mechanic: See object → tap correct colour swatch
// Teaches: "What colour is the [object]? The [object] is [colour]."
// ============================================================

const COLOUR_HEX = {
  red: '#EF4444', blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308',
  orange: '#F97316', purple: '#8B5CF6', pink: '#EC4899', brown: '#92400E',
  black: '#1F2937', white: '#F9FAFB'
};

registerGame('colour_picker', {
  data: {
    title: 'Renk Seçici',
    difficulty: {
      supporting: {
        rounds: [
          { emoji: '✏️', object: 'pencil', colour: 'yellow' },
          { emoji: '📖', object: 'book', colour: 'red' },
          { emoji: '🪑', object: 'chair', colour: 'brown' },
          { emoji: '🚪', object: 'door', colour: 'white' },
          { emoji: '🖍️', object: 'crayon', colour: 'blue' }
        ],
        colours: ['red', 'blue', 'yellow', 'brown', 'white']
      },
      standard: {
        rounds: [
          { emoji: '✏️', object: 'pencil', colour: 'yellow' },
          { emoji: '📖', object: 'book', colour: 'red' },
          { emoji: '🪑', object: 'chair', colour: 'brown' },
          { emoji: '🖥️', object: 'computer', colour: 'black' },
          { emoji: '🖍️', object: 'crayon', colour: 'green' },
          { emoji: '🎒', object: 'pencil case', colour: 'blue' },
          { emoji: '📓', object: 'notebook', colour: 'pink' },
          { emoji: '🧤', object: 'rubber', colour: 'white' }
        ],
        colours: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white']
      },
      expansion: {
        rounds: [
          { emoji: '✏️', object: 'pencil', colour: 'yellow' },
          { emoji: '📖', object: 'book', colour: 'red' },
          { emoji: '🪑', object: 'chair', colour: 'brown' },
          { emoji: '🖥️', object: 'computer', colour: 'black' },
          { emoji: '🖍️', object: 'crayon', colour: 'green' },
          { emoji: '🎒', object: 'pencil case', colour: 'blue' },
          { emoji: '📓', object: 'notebook', colour: 'pink' },
          { emoji: '🧤', object: 'rubber', colour: 'white' },
          { emoji: '🚪', object: 'door', colour: 'orange' },
          { emoji: '✂️', object: 'scissors', colour: 'purple' }
        ],
        colours: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'],
        timed: true,
        timerSeconds: 45
      }
    }
  },

  launch: function(area, config) {
    gameState.rounds = shuffle(config.rounds);
    gameState.colours = config.colours;
    gameState.round = 0;
    gameState.total = gameState.rounds.length;
    gameState.score = 0;
    gameState.locked = false;

    if (config.timed) {
      gameState.timeLeft = config.timerSeconds;
    }

    renderColourRound(area, config);
  }
});

function renderColourRound(area, config) {
  const r = gameState.rounds[gameState.round];
  const colours = gameState.colours;

  let timerHTML = '';
  if (config && config.timed && gameState.round === 0) {
    timerHTML = `<span class="ge-round" id="colourTimer">⏱️ ${gameState.timeLeft}s</span>`;
  } else if (gameState.timeLeft !== undefined) {
    timerHTML = `<span class="ge-round" id="colourTimer">⏱️ ${gameState.timeLeft}s</span>`;
  }

  area.innerHTML = `
    <div class="ge-container">
      <div class="ge-progress">
        <span class="ge-score">✓ <span id="colourScore">${gameState.score}</span> / ${gameState.total}</span>
        <span class="ge-round">Soru ${gameState.round + 1} / ${gameState.total}</span>
        ${timerHTML}
      </div>
      <div class="ge-colour-stage">
        <div class="ge-colour-object">${r.emoji}</div>
        <div class="ge-colour-question">What colour is the ${r.object}?</div>
        <div class="ge-colour-prompt">The ${r.object} is ___.</div>
      </div>
      <div class="ge-colour-palette">
        ${colours.map(c => `
          <div class="ge-colour-swatch"
               style="background: ${COLOUR_HEX[c]}; ${c === 'white' ? 'color: #1B2A4A; text-shadow: none; border-color: #D1D5DB;' : ''}"
               data-colour="${c}"
               onclick="colourPick(this, '${c}', '${r.colour}')">
            ${c}
          </div>
        `).join('')}
      </div>
      <div class="ge-colour-feedback" id="colourFeedback"></div>
    </div>`;

  // Start timer on first round only
  if (config && config.timed && gameState.round === 0) {
    gameState.timer = setInterval(() => {
      gameState.timeLeft--;
      const el = document.getElementById('colourTimer');
      if (el) el.textContent = `⏱️ ${gameState.timeLeft}s`;
      if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timer);
        gameState.timer = null;
        showEndScreen(gameState.score, gameState.total);
      }
    }, 1000);
  }
}

function colourPick(swatch, picked, correct) {
  if (gameState.locked) return;
  gameState.locked = true;

  const feedback = document.getElementById('colourFeedback');

  if (picked === correct) {
    swatch.classList.add('correct');
    gameState.score++;
    document.getElementById('colourScore').textContent = gameState.score;
    const r = gameState.rounds[gameState.round];
    feedback.innerHTML = `<span style="color:var(--correct)">✓ The ${r.object} is ${correct}!</span>`;
  } else {
    swatch.classList.add('wrong');
    // Highlight correct
    document.querySelectorAll('.ge-colour-swatch').forEach(s => {
      if (s.dataset.colour === correct) s.classList.add('correct');
    });
    const r = gameState.rounds[gameState.round];
    feedback.innerHTML = `<span style="color:var(--wrong)">✗ The ${r.object} is ${correct}.</span>`;
  }

  setTimeout(() => {
    gameState.round++;
    gameState.locked = false;
    if (gameState.round >= gameState.total) {
      if (gameState.timer) { clearInterval(gameState.timer); gameState.timer = null; }
      showEndScreen(gameState.score, gameState.total);
    } else {
      // Preserve timer state — don't pass config to avoid restarting timer
      renderColourRound(document.getElementById('gameArea'), null);
    }
  }, 1200);
}
