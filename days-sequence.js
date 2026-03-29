// ============================================================
// GAME: sequence_days — Days of the Week Sequencer
// Theme 1: School Life — Days of the Week
// Mechanic: Tap days in correct Monday→Sunday order
// ============================================================

registerGame('sequence_days', {
  data: {
    title: 'Günleri Sırala',
    difficulty: {
      supporting: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        showHints: true
      },
      standard: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        showHints: false
      },
      expansion: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        showHints: false,
        timed: true,
        timerSeconds: 30
      }
    }
  },

  launch: function(area, config) {
    const days = config.days;
    gameState.correctOrder = [...days];
    gameState.placedDays = [];
    gameState.score = 0;
    gameState.total = days.length;
    gameState.showHints = config.showHints || false;

    const shuffled = shuffle(days);

    let timerHTML = '';
    if (config.timed) {
      gameState.timeLeft = config.timerSeconds;
      timerHTML = `<span class="ge-round" id="seqTimer">⏱️ ${config.timerSeconds}s</span>`;
    }

    area.innerHTML = `
      <div class="ge-container">
        <div class="ge-progress">
          <span class="ge-score">✓ <span id="seqScore">0</span> / ${days.length}</span>
          ${timerHTML}
        </div>
        <div style="text-align:center;margin-bottom:16px;font-weight:700;color:var(--navy-soft)">
          ${gameState.showHints ? '💡 İpucu: Haftanın günlerini pazartesiden başlayarak sırala!' : '📅 Haftanın günlerini doğru sıraya koy!'}
        </div>
        <div class="ge-sequence-slots" id="seqSlots">
          ${days.map((d,i) => `<div class="ge-slot" data-idx="${i}" id="slot${i}">${gameState.showHints ? (i+1) : ''}</div>`).join('')}
        </div>
        <div class="ge-word-bank" id="seqBank">
          ${shuffled.map(d => `<div class="ge-word-chip" onclick="sequenceSelect(this, '${d}')">${d}</div>`).join('')}
        </div>
      </div>`;

    if (config.timed) {
      gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        const el = document.getElementById('seqTimer');
        if (el) el.textContent = `⏱️ ${gameState.timeLeft}s`;
        if (gameState.timeLeft <= 0) {
          clearInterval(gameState.timer);
          gameState.timer = null;
          showEndScreen(gameState.score, gameState.total);
        }
      }, 1000);
    }
  }
});

function sequenceSelect(chip, day) {
  if (chip.classList.contains('used')) return;

  const nextIdx = gameState.placedDays.length;
  if (nextIdx >= gameState.correctOrder.length) return;

  const correct = gameState.correctOrder[nextIdx];
  const slot = document.getElementById(`slot${nextIdx}`);

  if (day === correct) {
    slot.textContent = day;
    slot.classList.add('filled', 'correct-slot');
    chip.classList.add('used');
    gameState.placedDays.push(day);
    gameState.score++;
    document.getElementById('seqScore').textContent = gameState.score;

    if (gameState.placedDays.length === gameState.correctOrder.length) {
      if (gameState.timer) { clearInterval(gameState.timer); gameState.timer = null; }
      setTimeout(() => showEndScreen(gameState.score, gameState.total), 800);
    }
  } else {
    slot.classList.add('wrong-slot');
    chip.style.transform = 'translateX(-4px)';
    setTimeout(() => { slot.classList.remove('wrong-slot'); chip.style.transform = ''; }, 400);
  }
}
