const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const API_BASE =
  'https://serwer2687458.hosting-home.pl/wc26-api/public/api/v1';

const initData = tg.initData;

const SCORE_MIN = 0;
const SCORE_MAX = 20;
const SCORE_ITEM_HEIGHT = 44;

let currentMatches = [];

if (!initData) {
  document.body.innerHTML = `
    <p>
      Open this application through Telegram.
    </p>
  `;

  throw new Error(
    'Telegram initData is unavailable'
  );
}

// initDataUnsafe is only used for display. The backend authenticates initData.
const visibleUser =
  tg.initDataUnsafe?.user;

document.querySelector(
  '#userGreeting'
).textContent =
  visibleUser?.first_name
    ? `Hello, ${visibleUser.first_name}`
    : 'Choose your predictions';

const escapeHtml = (value = '') =>
  String(value).replace(
    /[&<>'"]/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[character]
  );

async function telegramFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});

  headers.set(
    'X-Telegram-Init-Data',
    initData
  );

  if (options.body) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  const url = `${API_BASE}/${path}`;

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Network request failed for ${path}: ${error.message}`
    );
  }

  const rawBody = await response.text();

  let body;

  try {
    body = rawBody
      ? JSON.parse(rawBody)
      : {};
  } catch {
    throw new Error(
      `${path} returned invalid JSON: ${rawBody.slice(0, 150)}`
    );
  }

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
      `${path} failed with HTTP ${response.status}`
    );
  }

  return body;
}

async function loadVotingData() {
  let matchesResponse;

  try {
    const response = await fetch(
      `${API_BASE}/matches.php`
    );

    const text = await response.text();

    try {
      matchesResponse = JSON.parse(text);
    } catch {
      throw new Error(
        `matches.php returned invalid JSON: ${text.slice(0, 120)}`
      );
    }

    if (!response.ok) {
      throw new Error(
        matchesResponse?.error?.message ||
        `matches.php HTTP ${response.status}`
      );
    }
  } catch (error) {
    throw new Error(
      `MATCHES REQUEST FAILED: ${error.message}`
    );
  }

  let votesResponse;

  try {
    votesResponse = await telegramFetch(
      'my-votes.php'
    );
  } catch (error) {
    throw new Error(
      `MY-VOTES REQUEST FAILED: ${error.message}`
    );
  }

  currentMatches =
    matchesResponse.matches || [];

  const forecastsByMatch = new Map(
    (votesResponse.votes || []).map(
      forecast => [
        Number(forecast.match_id),
        {
          homeScore: Number(
            forecast.predicted_home_score
          ),
          awayScore: Number(
            forecast.predicted_away_score
          ),
          outcome: forecast.outcome,
        }
      ]
    )
  );

  renderForecastMatches(
    currentMatches,
    forecastsByMatch
  );
}

function scoreWheel(matchId, side, value) {
  const numbers = Array.from(
    { length: SCORE_MAX - SCORE_MIN + 1 },
    (_, index) => SCORE_MIN + index
  );

  return `
    <div
      class="score-wheel"
      data-match-id="${matchId}"
      data-side="${side}"
      data-value="${value}"
    >
      <div
        class="score-wheel-window"
        tabindex="0"
        role="spinbutton"
        aria-valuemin="${SCORE_MIN}"
        aria-valuemax="${SCORE_MAX}"
        aria-valuenow="${value}"
        aria-label="${side === 'home' ? 'First team score' : 'Second team score'}"
      >
        <div class="score-wheel-list">
          ${numbers.map(number => `
            <button
              type="button"
              class="score-wheel-item ${number === value ? 'active' : ''}"
              data-score="${number}"
              tabindex="-1"
            >
              ${number}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderForecastMatches(
  matches,
  forecastsByMatch
) {
  const container =
    document.querySelector('#matches');

  const now = Date.now();

  const upcoming = matches.filter(match => {
    const closesAt = new Date(
      `${match.voting_closes_at_utc}Z`
    ).getTime();

    return (
      match.status === 'SCHEDULED'
      && Number(match.voting_enabled) === 1
      && closesAt > now
      && match.home_team_id
      && match.away_team_id
    );
  });

  container.innerHTML = upcoming
    .map(match => {
      const existing =
        forecastsByMatch.get(Number(match.id));

      const homeScore =
        existing?.homeScore ?? 0;

      const awayScore =
        existing?.awayScore ?? 0;

      const outcome =
        calculateDisplayedOutcome(
          homeScore,
          awayScore
        );

      return `
        <article
          class="vote-card"
          data-match-id="${match.id}"
          data-dirty="false"
          data-has-saved-forecast="${existing ? 'true' : 'false'}"
        >
          <div class="vote-meta">
            Match ${escapeHtml(match.match_number)}
          </div>

          <div class="score-matchup">
            <div class="score-team">
              <h2>
                ${escapeHtml(match.home_team_name)}
              </h2>

              ${scoreWheel(
                match.id,
                'home',
                homeScore
              )}
            </div>

            <div class="versus-label">
              VS
            </div>

            <div class="score-team">
              <h2>
                ${escapeHtml(match.away_team_name)}
              </h2>

              ${scoreWheel(
                match.id,
                'away',
                awayScore
              )}
            </div>
          </div>

          <p class="forecast-outcome">
            ${escapeHtml(
              formatOutcome(
                outcome,
                match.home_team_name,
                match.away_team_name
              )
            )}
          </p>

          <button
            type="button"
            class="forecast-save-button"
            data-match-id="${match.id}"
            aria-label="Save forecast"
          >
            ✓
          </button>

          <p
            class="vote-message"
            aria-live="polite"
          >
            ${
              existing
                ? `Saved: ${homeScore}–${awayScore}`
                : 'Select score and tap ✓ to save'
            }
          </p>
        </article>
      `;
    })
    .join('');

  initializeScoreWheels(container);
}

function calculateDisplayedOutcome(
  homeScore,
  awayScore
) {
  if (homeScore > awayScore) {
    return 'HOME_WIN';
  }

  if (homeScore < awayScore) {
    return 'AWAY_WIN';
  }

  return 'DRAW';
}

function formatOutcome(
  outcome,
  homeName,
  awayName
) {
  if (outcome === 'HOME_WIN') {
    return `${homeName} win`;
  }

  if (outcome === 'AWAY_WIN') {
    return `${awayName} win`;
  }

  return 'Draw';
}

function getCardScores(card) {
  const homeScore = Number(
    card.querySelector(
      '.score-wheel[data-side="home"]'
    ).dataset.value
  );

  const awayScore = Number(
    card.querySelector(
      '.score-wheel[data-side="away"]'
    ).dataset.value
  );

  return {
    homeScore,
    awayScore,
  };
}

function updateCardOutcome(card) {
  const {
    homeScore,
    awayScore,
  } = getCardScores(card);

  const matchId =
    Number(card.dataset.matchId);

  const match =
    currentMatches.find(item =>
      Number(item.id) === matchId
    );

  const outcome =
    calculateDisplayedOutcome(
      homeScore,
      awayScore
    );

  card.querySelector(
    '.forecast-outcome'
  ).textContent = formatOutcome(
    outcome,
    match.home_team_name,
    match.away_team_name
  );
}

function initializeScoreWheels(root = document) {
  root
    .querySelectorAll('.score-wheel')
    .forEach(wheel => {
      const value =
        Number(wheel.dataset.value);

      const windowElement =
        wheel.querySelector('.score-wheel-window');

      windowElement.scrollTop =
        value * SCORE_ITEM_HEIGHT;

      updateWheelSelection(wheel);
    });
}

function updateWheelSelection(wheel) {
  const windowElement =
    wheel.querySelector('.score-wheel-window');

  const items =
    [...wheel.querySelectorAll('.score-wheel-item')];

  const selectedScore =
    Math.round(
      windowElement.scrollTop / SCORE_ITEM_HEIGHT
    );

  const safeScore =
    Math.min(
      SCORE_MAX,
      Math.max(SCORE_MIN, selectedScore)
    );

  wheel.dataset.value =
    String(safeScore);

  windowElement.setAttribute(
    'aria-valuenow',
    String(safeScore)
  );

  items.forEach(item => {
    item.classList.toggle(
      'active',
      Number(item.dataset.score) === safeScore
    );
  });

  const expectedScrollTop =
    safeScore * SCORE_ITEM_HEIGHT;

  if (
    Math.abs(
      windowElement.scrollTop - expectedScrollTop
    ) > 1
  ) {
    windowElement.scrollTo({
      top: expectedScrollTop,
      behavior: 'smooth',
    });
  }
}

document.addEventListener(
  'scroll',
  event => {
    const windowElement =
      event.target.closest?.('.score-wheel-window');

    if (!windowElement) {
      return;
    }

    const wheel =
      windowElement.closest('.score-wheel');

    clearTimeout(
      windowElement.dataset.scrollTimerId
    );

    const timerId = setTimeout(() => {
      updateWheelSelection(wheel);

      const card =
        wheel.closest('.vote-card');

      card.dataset.dirty = 'true';

      updateCardOutcome(card);

      card.querySelector('.vote-message').textContent =
        'Forecast changed. Tap ✓ to save.';
    }, 120);

    windowElement.dataset.scrollTimerId =
      String(timerId);
  },
  true
);

document.addEventListener(
  'click',
  event => {
    const item =
      event.target.closest('.score-wheel-item');

    if (!item) {
      return;
    }

    const wheel =
      item.closest('.score-wheel');

    const windowElement =
      wheel.querySelector('.score-wheel-window');

    const score =
      Number(item.dataset.score);

    windowElement.scrollTo({
      top: score * SCORE_ITEM_HEIGHT,
      behavior: 'smooth',
    });

    wheel.dataset.value =
      String(score);

    updateWheelSelection(wheel);

    const card =
      wheel.closest('.vote-card');

    card.dataset.dirty = 'true';

    updateCardOutcome(card);

    card.querySelector('.vote-message').textContent =
      'Forecast changed. Tap ✓ to save.';
  }
);

document.addEventListener(
  'keydown',
  event => {
    const windowElement =
      event.target.closest('.score-wheel-window');

    if (!windowElement) {
      return;
    }

    if (
      event.key !== 'ArrowUp'
      && event.key !== 'ArrowDown'
    ) {
      return;
    }

    event.preventDefault();

    const wheel =
      windowElement.closest('.score-wheel');

    const currentValue =
      Number(wheel.dataset.value);

    const nextValue =
      event.key === 'ArrowUp'
        ? Math.max(SCORE_MIN, currentValue - 1)
        : Math.min(SCORE_MAX, currentValue + 1);

    windowElement.scrollTo({
      top: nextValue * SCORE_ITEM_HEIGHT,
      behavior: 'smooth',
    });

    wheel.dataset.value =
      String(nextValue);

    updateWheelSelection(wheel);

    const card =
      wheel.closest('.vote-card');

    card.dataset.dirty = 'true';

    updateCardOutcome(card);

    card.querySelector('.vote-message').textContent =
      'Forecast changed. Tap ✓ to save.';
  }
);

document.addEventListener(
  'click',
  async event => {
    const saveButton =
      event.target.closest('.forecast-save-button');

    if (!saveButton) {
      return;
    }

    const card =
      saveButton.closest('.vote-card');

    const matchId =
      Number(card.dataset.matchId);

    const {
      homeScore,
      awayScore,
    } = getCardScores(card);

    const message =
      card.querySelector('.vote-message');

    saveButton.disabled = true;

    card
      .querySelectorAll('.score-wheel-window')
      .forEach(item => {
        item.setAttribute('aria-disabled', 'true');
      });

    message.textContent =
      'Saving forecast…';

    try {
      const response = await telegramFetch(
        'vote.php',
        {
          method: 'POST',
          body: JSON.stringify({
            match_id: matchId,
            home_score: homeScore,
            away_score: awayScore,
          }),
        }
      );

      card.dataset.dirty = 'false';
      card.dataset.hasSavedForecast = 'true';

      message.textContent =
        `Saved: ${homeScore}–${awayScore}`;

      tg.HapticFeedback
        ?.notificationOccurred('success');

      console.log(
        'Forecast saved:',
        response.forecast
      );
    } catch (error) {
      message.textContent =
        error.message;

      tg.HapticFeedback
        ?.notificationOccurred('error');
    } finally {
      saveButton.disabled = false;

      card
        .querySelectorAll('.score-wheel-window')
        .forEach(item => {
          item.removeAttribute('aria-disabled');
        });
    }
  }
);

loadVotingData().catch(error => {
  console.error('Mini App loading failed:', error);

  document.querySelector('#matches').innerHTML = `
    <p class="error-message">
      Mini App loading failed:<br>
      ${escapeHtml(error.message)}
    </p>
  `;
});
