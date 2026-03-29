// ============================================================
// GAME: body_builder — Body Part Label Builder
// Theme 3: Personal Life — Parts of the Body
// Mechanic: Select label → tap correct zone on character
// Teaches: body part vocabulary through placement interaction
// ============================================================

registerGame('body_builder', {
  data: {
    title: 'Vücut Parçaları',
    difficulty: {
      supporting: {
        parts: [
          { word: 'head', zone: 'head' },
          { word: 'arm', zone: 'arm' },
          { word: 'hand', zone: 'hand' },
          { word: 'leg', zone: 'leg' },
          { word: 'nose', zone: 'nose' }
        ],
        showEmoji: true
      },
      standard: {
        parts: [
          { word: 'head', zone: 'head' },
          { word: 'face', zone: 'face' },
          { word: 'eye', zone: 'eye' },
          { word: 'nose', zone: 'nose' },
          { word: 'mouth', zone: 'mouth' },
          { word: 'ear', zone: 'ear' },
          { word: 'arm', zone: 'arm' },
          { word: 'hand', zone: 'hand' },
          { word: 'leg', zone: 'leg' },
          { word: 'hair', zone: 'hair' }
        ],
        showEmoji: false
      },
      expansion: {
        parts: [
          { word: 'head', zone: 'head' },
          { word: 'face', zone: 'face' },
          { word: 'eye', zone: 'eye' },
          { word: 'nose', zone: 'nose' },
          { word: 'mouth', zone: 'mouth' },
          { word: 'ear', zone: 'ear' },
          { word: 'arm', zone: 'arm' },
          { word: 'hand', zone: 'hand' },
          { word: 'leg', zone: 'leg' },
          { word: 'hair', zone: 'hair' },
          { word: 'body', zone: 'body' }
        ],
        showEmoji: false,
        timed: true,
        timerSeconds: 60
      }
    }
  },

  launch: function(area, config) {
    gameState.parts = config.parts;
    gameState.total = config.parts.length;
    gameState.score = 0;
    gameState.placed = 0;
    gameState.selectedLabel = null;
    gameState.showEmoji = config.showEmoji || false;

    const shuffledLabels = shuffle(config.parts);

    // Emoji hints for supporting mode
    const emojiMap = {
      head: '🗣️', face: '😊', eye: '👁️', nose: '👃', mouth: '👄',
      ear: '👂', arm: '💪', hand: '✋', leg: '🦵', hair: '💇', body: '🧍'
    };

    let timerHTML = '';
    if (config.timed) {
      gameState.timeLeft = config.timerSeconds;
      timerHTML = `<span class="ge-round" id="bodyTimer">⏱️ ${config.timerSeconds}s</span>`;
    }

    // Zone positions (percentages relative to figure container)
    const ZONES = {
      hair:  { top: '2%',  left: '32%', width: '36%', height: '10%' },
      head:  { top: '5%',  left: '30%', width: '40%', height: '14%' },
      face:  { top: '10%', left: '34%', width: '32%', height: '10%' },
      eye:   { top: '12%', left: '34%', width: '32%', height: '5%' },
      ear:   { top: '14%', left: '22%', width: '12%', height: '8%' },
      nose:  { top: '17%', left: '40%', width: '20%', height: '5%' },
      mouth: { top: '22%', left: '36%', width: '28%', height: '5%' },
      body:  { top: '30%', left: '28%', width: '44%', height: '20%' },
      arm:   { top: '32%', left: '10%', width: '18%', height: '22%' },
      hand:  { top: '52%', left: '6%',  width: '16%', height: '10%' },
      leg:   { top: '62%', left: '30%', width: '18%', height: '28%' }
    };

    // Build drop zones for active parts only
    const activeZones = config.parts.map(p => p.zone);
    let zonesHTML = '';
    activeZones.forEach(z => {
      const pos = ZONES[z];
      if (pos) {
        zonesHTML += `<div class="ge-body-dropzone" id="zone_${z}" 
          data-zone="${z}"
          style="top:${pos.top}; left:${pos.left}; width:${pos.width}; height:${pos.height};"
          onclick="bodyZoneTap('${z}')"></div>`;
      }
    });

    area.innerHTML = `
      <div class="ge-container">
        <div class="ge-progress">
          <span class="ge-score">✓ <span id="bodyScore">0</span> / ${config.parts.length}</span>
          ${timerHTML}
        </div>
        <div style="text-align:center;margin-bottom:16px;font-weight:700;color:var(--navy-soft)">
          🧍 Kelimeyi seç, sonra vücutta doğru yere dokun!
        </div>
        <div class="ge-body-area">
          <div class="ge-body-figure">
            <svg viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg">
              <!-- Simple character illustration -->
              <!-- Hair -->
              <ellipse cx="100" cy="42" rx="38" ry="16" fill="#8B6914" opacity="0.8"/>
              <!-- Head -->
              <circle cx="100" cy="55" r="32" fill="#FBBF24" stroke="#1B2A4A" stroke-width="2"/>
              <!-- Eyes -->
              <circle cx="88" cy="50" r="4" fill="#1B2A4A"/>
              <circle cx="112" cy="50" r="4" fill="#1B2A4A"/>
              <!-- Nose -->
              <ellipse cx="100" cy="60" rx="3" ry="4" fill="#F59E0B"/>
              <!-- Mouth -->
              <path d="M90 68 Q100 76 110 68" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>
              <!-- Ears -->
              <ellipse cx="66" cy="55" rx="6" ry="8" fill="#FBBF24" stroke="#1B2A4A" stroke-width="1.5"/>
              <ellipse cx="134" cy="55" rx="6" ry="8" fill="#FBBF24" stroke="#1B2A4A" stroke-width="1.5"/>
              <!-- Body (torso) -->
              <rect x="72" y="88" width="56" height="70" rx="12" fill="#3B82F6" stroke="#1B2A4A" stroke-width="2"/>
              <!-- Arms -->
              <rect x="30" y="92" width="42" height="18" rx="9" fill="#FBBF24" stroke="#1B2A4A" stroke-width="2"/>
              <rect x="128" y="92" width="42" height="18" rx="9" fill="#FBBF24" stroke="#1B2A4A" stroke-width="2"/>
              <!-- Hands -->
              <circle cx="26" cy="118" r="10" fill="#FBBF24" stroke="#1B2A4A" stroke-width="1.5"/>
              <circle cx="174" cy="118" r="10" fill="#FBBF24" stroke="#1B2A4A" stroke-width="1.5"/>
              <!-- Legs -->
              <rect x="76" y="158" width="20" height="70" rx="10" fill="#1B2A4A"/>
              <rect x="104" y="158" width="20" height="70" rx="10" fill="#1B2A4A"/>
              <!-- Feet -->
              <ellipse cx="86" cy="232" rx="14" ry="8" fill="#EF4444"/>
              <ellipse cx="114" cy="232" rx="14" ry="8" fill="#EF4444"/>
            </svg>
            ${zonesHTML}
          </div>
          <div class="ge-body-labels" id="bodyLabels">
            ${shuffledLabels.map(p => `
              <div class="ge-body-label" data-word="${p.word}" data-zone="${p.zone}" onclick="bodyLabelSelect(this)">
                ${gameState.showEmoji ? (emojiMap[p.zone] || '') + ' ' : ''}${p.word}
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;

    if (config.timed) {
      gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        const el = document.getElementById('bodyTimer');
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

function bodyLabelSelect(label) {
  if (label.classList.contains('used')) return;

  // Deselect previous
  document.querySelectorAll('.ge-body-label').forEach(l => l.classList.remove('selected'));
  label.classList.add('selected');
  gameState.selectedLabel = label;
}

function bodyZoneTap(zone) {
  if (!gameState.selectedLabel) return;

  const zoneEl = document.getElementById(`zone_${zone}`);
  const labelZone = gameState.selectedLabel.dataset.zone;

  if (zone === labelZone) {
    // Correct placement
    zoneEl.textContent = gameState.selectedLabel.dataset.word;
    zoneEl.classList.add('filled');
    gameState.selectedLabel.classList.add('used');
    gameState.selectedLabel.classList.remove('selected');
    gameState.score++;
    gameState.placed++;
    document.getElementById('bodyScore').textContent = gameState.score;
    gameState.selectedLabel = null;

    if (gameState.placed === gameState.total) {
      if (gameState.timer) { clearInterval(gameState.timer); gameState.timer = null; }
      setTimeout(() => showEndScreen(gameState.score, gameState.total), 600);
    }
  } else {
    // Wrong placement — shake zone
    zoneEl.classList.add('wrong-zone');
    setTimeout(() => zoneEl.classList.remove('wrong-zone'), 400);
  }
}
