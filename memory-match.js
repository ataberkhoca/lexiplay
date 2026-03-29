// ============================================================
// GAME: memory_match — Configurable Memory Match (Pelmanism)
// Cross-theme: Registers per-theme instances with different content
// Mechanic: Card-flip memory matching — find emoji↔word pairs
// ============================================================

// --- Shared memory match engine ---
function launchMemoryMatch(area, config) {
  const pairs = shuffle(config.pairs);
  gameState.total = pairs.length;
  gameState.matched = 0;
  gameState.flipped = [];
  gameState.locked = false;
  gameState.attempts = 0;

  // Build card deck: each pair creates 2 cards (one emoji, one word)
  const cards = [];
  pairs.forEach((p, i) => {
    cards.push({ id: i, type: 'emoji', display: p.emoji, pairId: i });
    cards.push({ id: i, type: 'word', display: p.word, pairId: i });
  });
  const shuffledCards = shuffle(cards);

  // Determine grid columns based on card count
  const totalCards = shuffledCards.length;
  let cols = totalCards <= 8 ? 4 : totalCards <= 12 ? 4 : totalCards <= 16 ? 4 : 5;

  area.innerHTML = `
    <div class="ge-container">
      <div class="ge-progress">
        <span class="ge-score">✓ <span id="memScore">0</span> / ${pairs.length}</span>
        <span class="ge-round">Hamle: <span id="memAttempts">0</span></span>
      </div>
      <div style="text-align:center;margin-bottom:16px;font-weight:700;color:var(--navy-soft)">
        🧩 Eşleşen resim ve kelimeyi bul!
      </div>
      <div class="ge-memory-grid" id="memGrid" style="grid-template-columns: repeat(${cols}, 1fr); max-width: ${cols * 100}px; margin: 0 auto;">
        ${shuffledCards.map((c, idx) => `
          <div class="ge-memory-card" data-idx="${idx}" data-pair="${c.pairId}" data-type="${c.type}" onclick="memoryFlip(this)">
            <div class="card-face">
              ${c.type === 'emoji' ? `<span class="mem-emoji">${c.display}</span>` : `<span class="mem-word">${c.display}</span>`}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function memoryFlip(card) {
  if (gameState.locked) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  gameState.flipped.push(card);

  if (gameState.flipped.length === 2) {
    gameState.locked = true;
    gameState.attempts++;
    document.getElementById('memAttempts').textContent = gameState.attempts;

    const [a, b] = gameState.flipped;
    const match = a.dataset.pair === b.dataset.pair && a.dataset.type !== b.dataset.type;

    if (match) {
      setTimeout(() => {
        a.classList.add('matched');
        b.classList.add('matched');
        gameState.matched++;
        gameState.score = gameState.matched;
        document.getElementById('memScore').textContent = gameState.matched;
        gameState.flipped = [];
        gameState.locked = false;

        if (gameState.matched === gameState.total) {
          setTimeout(() => showEndScreen(gameState.score, gameState.total), 600);
        }
      }, 400);
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        gameState.flipped = [];
        gameState.locked = false;
      }, 800);
    }
  }
}

// --- Theme 1: School Life memory content ---
registerGame('memory_t1_school', {
  data: {
    title: 'Hafıza Kartları — Okul',
    difficulty: {
      supporting: {
        pairs: [
          { emoji: '👩‍🏫', word: 'teacher' },
          { emoji: '👦', word: 'pupil' },
          { emoji: '🏫', word: 'classroom' },
          { emoji: '📚', word: 'library' }
        ]
      },
      standard: {
        pairs: [
          { emoji: '👩‍🏫', word: 'teacher' },
          { emoji: '👦', word: 'pupil' },
          { emoji: '👧', word: 'girl' },
          { emoji: '👦🏻', word: 'boy' },
          { emoji: '🏫', word: 'classroom' },
          { emoji: '📚', word: 'library' },
          { emoji: '🌳', word: 'garden' },
          { emoji: '🛝', word: 'playground' }
        ]
      },
      expansion: {
        pairs: [
          { emoji: '👩‍🏫', word: 'teacher' },
          { emoji: '👦', word: 'pupil' },
          { emoji: '👧', word: 'girl' },
          { emoji: '👦🏻', word: 'boy' },
          { emoji: '🧒', word: 'kid' },
          { emoji: '👫', word: 'friend' },
          { emoji: '🏫', word: 'classroom' },
          { emoji: '📚', word: 'library' },
          { emoji: '🍽️', word: 'lunch hall' },
          { emoji: '🌳', word: 'garden' },
          { emoji: '⛹️', word: 'sports hall' },
          { emoji: '🛝', word: 'playground' }
        ]
      }
    }
  },
  launch: launchMemoryMatch
});

// --- Theme 2: Classroom Life memory content ---
registerGame('memory_t2_classroom', {
  data: {
    title: 'Hafıza Kartları — Sınıf',
    difficulty: {
      supporting: {
        pairs: [
          { emoji: '✏️', word: 'pencil' },
          { emoji: '📖', word: 'book' },
          { emoji: '📓', word: 'notebook' },
          { emoji: '🪑', word: 'chair' }
        ]
      },
      standard: {
        pairs: [
          { emoji: '✏️', word: 'pencil' },
          { emoji: '📖', word: 'book' },
          { emoji: '📓', word: 'notebook' },
          { emoji: '🪑', word: 'chair' },
          { emoji: '🖥️', word: 'computer' },
          { emoji: '🕐', word: 'clock' },
          { emoji: '🚪', word: 'door' },
          { emoji: '🪟', word: 'window' }
        ]
      },
      expansion: {
        pairs: [
          { emoji: '✏️', word: 'pencil' },
          { emoji: '📖', word: 'book' },
          { emoji: '📓', word: 'notebook' },
          { emoji: '🪑', word: 'chair' },
          { emoji: '🖥️', word: 'computer' },
          { emoji: '🕐', word: 'clock' },
          { emoji: '🚪', word: 'door' },
          { emoji: '🪟', word: 'window' },
          { emoji: '✂️', word: 'scissors' },
          { emoji: '🖍️', word: 'crayon' },
          { emoji: '📎', word: 'rubber' },
          { emoji: '🗄️', word: 'desk' }
        ]
      }
    }
  },
  launch: launchMemoryMatch
});

// --- Theme 3: Clothes memory content ---
registerGame('memory_t3_clothes', {
  data: {
    title: 'Hafıza Kartları — Kıyafetler',
    difficulty: {
      supporting: {
        pairs: [
          { emoji: '👕', word: 'T-shirt' },
          { emoji: '👗', word: 'dress' },
          { emoji: '👟', word: 'shoes' },
          { emoji: '🧥', word: 'coat' }
        ]
      },
      standard: {
        pairs: [
          { emoji: '👕', word: 'T-shirt' },
          { emoji: '👔', word: 'shirt' },
          { emoji: '👗', word: 'dress' },
          { emoji: '👖', word: 'trousers' },
          { emoji: '🧥', word: 'coat' },
          { emoji: '👟', word: 'shoes' },
          { emoji: '🎩', word: 'hat' },
          { emoji: '🧣', word: 'scarf' }
        ]
      },
      expansion: {
        pairs: [
          { emoji: '👕', word: 'T-shirt' },
          { emoji: '👔', word: 'shirt' },
          { emoji: '👗', word: 'dress' },
          { emoji: '👖', word: 'trousers' },
          { emoji: '🧥', word: 'coat' },
          { emoji: '👟', word: 'shoes' },
          { emoji: '🎩', word: 'hat' },
          { emoji: '🧣', word: 'scarf' },
          { emoji: '👓', word: 'glasses' },
          { emoji: '🧤', word: 'gloves' },
          { emoji: '☂️', word: 'umbrella' }
        ]
      }
    }
  },
  launch: launchMemoryMatch
});
