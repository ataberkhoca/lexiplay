// ============================================================
// GAME: match_people_places — Picture-Word Matching
// Theme 1: School Life — People & Places at School
// Mechanic: Two-column matching (emoji ↔ word)
// ============================================================

registerGame('match_people_places', {
  data: {
    title: 'Resim-Kelime Eşleştirme',
    difficulty: {
      supporting: {
        pairs: [
          { emoji: '👩‍🏫', word: 'a teacher' },
          { emoji: '👦', word: 'a pupil' },
          { emoji: '🏫', word: 'a classroom' },
          { emoji: '📚', word: 'a library' },
          { emoji: '👧', word: 'a girl' }
        ]
      },
      standard: {
        pairs: [
          { emoji: '👩‍🏫', word: 'a teacher' },
          { emoji: '👦', word: 'a pupil' },
          { emoji: '👧', word: 'a girl' },
          { emoji: '👦🏻', word: 'a boy' },
          { emoji: '🏫', word: 'a classroom' },
          { emoji: '📚', word: 'a library' },
          { emoji: '🍽️', word: 'a lunch hall' },
          { emoji: '🌳', word: 'a garden' }
        ]
      },
      expansion: {
        pairs: [
          { emoji: '👩‍🏫', word: 'a teacher' },
          { emoji: '👦', word: 'a pupil' },
          { emoji: '👧', word: 'a girl' },
          { emoji: '👦🏻', word: 'a boy' },
          { emoji: '🧒', word: 'a kid' },
          { emoji: '👫', word: 'a friend' },
          { emoji: '🏫', word: 'a classroom' },
          { emoji: '📚', word: 'a library' },
          { emoji: '🍽️', word: 'a lunch hall' },
          { emoji: '🌳', word: 'a garden' },
          { emoji: '⛹️', word: 'a sports hall' },
          { emoji: '🛝', word: 'a playground' }
        ]
      }
    }
  },

  launch: function(area, config) {
    const pairs = shuffle(config.pairs);
    const emojis = shuffle(pairs);
    const words = shuffle(pairs);
    gameState.total = pairs.length;
    gameState.matched = 0;
    gameState.selectedLeft = null;
    gameState.selectedRight = null;

    area.innerHTML = `
      <div class="ge-container">
        <div class="ge-progress">
          <span class="ge-score">✓ <span id="matchScore">0</span> / ${pairs.length}</span>
          <span class="ge-round">Eşleştir!</span>
        </div>
        <div class="ge-match-grid">
          <div>
            <div class="ge-match-col-title">🖼️ Resimler</div>
            <div class="ge-match-items" id="matchLeft">
              ${emojis.map(p => `<div class="ge-card" data-word="${p.word}" onclick="matchSelect(this,'left')"><span class="card-emoji">${p.emoji}</span></div>`).join('')}
            </div>
          </div>
          <div>
            <div class="ge-match-col-title">📝 Kelimeler</div>
            <div class="ge-match-items" id="matchRight">
              ${words.map(p => `<div class="ge-card" data-word="${p.word}" onclick="matchSelect(this,'right')">${p.word}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }
});

// --- Matching interaction handlers (global scope for onclick) ---
function matchSelect(card, side) {
  if (card.classList.contains('matched')) return;

  if (side === 'left') {
    if (gameState.selectedLeft) gameState.selectedLeft.classList.remove('selected');
    gameState.selectedLeft = card;
    card.classList.add('selected');
  } else {
    if (gameState.selectedRight) gameState.selectedRight.classList.remove('selected');
    gameState.selectedRight = card;
    card.classList.add('selected');
  }

  if (gameState.selectedLeft && gameState.selectedRight) {
    const match = gameState.selectedLeft.dataset.word === gameState.selectedRight.dataset.word;
    if (match) {
      gameState.selectedLeft.classList.add('correct', 'matched');
      gameState.selectedRight.classList.add('correct', 'matched');
      gameState.matched++;
      gameState.score = gameState.matched;
      document.getElementById('matchScore').textContent = gameState.matched;

      if (gameState.matched === gameState.total) {
        setTimeout(() => showEndScreen(gameState.score, gameState.total), 600);
      }
    } else {
      gameState.selectedLeft.classList.add('wrong');
      gameState.selectedRight.classList.add('wrong');
      const l = gameState.selectedLeft, r = gameState.selectedRight;
      setTimeout(() => { l.classList.remove('wrong', 'selected'); r.classList.remove('wrong', 'selected'); }, 600);
    }
    gameState.selectedLeft = null;
    gameState.selectedRight = null;
  }
}
