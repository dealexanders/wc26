const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const API_BASE =
  'https://serwer2687458.hosting-home.pl/wc26-api/public/api/v1';

const initData = tg.initData;
const saveTimers = new Map();

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

function scoreSelector(
  matchId,
  side,
  value
) {
  return `
    <div
      class="score-selector"
      data-match-id="${matchId}"
      data-side="${side}"
    >
      <button
        type="button"
        class="score-step score-up"
        aria-label="Increase score"
      >
        ▲
      </button>

      <output
        class="score-value"
        aria-live="polite"
      >
        ${value}
      </output>

      <button
        type="button"
        class="score-step score-down"
        aria-label="Decrease score"
      >
        ▼
      </button>
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
          data-has-saved-forecast="${
            existing ? 'true' : 'false'
          }"
        >
          <div class="vote-meta">
            Match ${match.match_number}
          </div>

          <div class="score-matchup">
            <div class="score-team">
              <h2>
                ${escapeHtml(
                  match.home_team_name
                )}
              </h2>

              ${scoreSelector(
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
                ${escapeHtml(
                  match.away_team_name
                )}
              </h2>

              ${scoreSelector(
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

          <p
            class="vote-message"
            aria-live="polite"
          >
            ${
              existing
                ? 'Forecast saved'
                : 'Adjust a score to submit'
            }
          </p>
        </article>
      `;
    })
    .join('');
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
      '[data-side="home"] .score-value'
    ).textContent
  );

  const awayScore = Number(
    card.querySelector(
      '[data-side="away"] .score-value'
    ).textContent
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

  const outcome =
    calculateDisplayedOutcome(
      homeScore,
      awayScore
    );

  const matchId = Number(
    card.dataset.matchId
  );

  const match = currentMatches.find(
    item => Number(item.id) === matchId
  );

  card.querySelector(
    '.forecast-outcome'
  ).textContent = formatOutcome(
    outcome,
    match.home_team_name,
    match.away_team_name
  );
}

function scheduleForecastSave(card) {
  const matchId = Number(
    card.dataset.matchId
  );

  const previousTimer =
    saveTimers.get(matchId);

  if (previousTimer) {
    clearTimeout(previousTimer);
  }

  const message = card.querySelector(
    '.vote-message'
  );

  message.textContent =
    'Forecast changed…';

  const timer = setTimeout(
    () => saveForecast(card),
    700
  );

  saveTimers.set(matchId, timer);
}

async function saveForecast(card) {
  const matchId = Number(
    card.dataset.matchId
  );

  const {
    homeScore,
    awayScore,
  } = getCardScores(card);

  const message = card.querySelector(
    '.vote-message'
  );

  card
    .querySelectorAll('.score-step')
    .forEach(button => {
      button.disabled = true;
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
    card
      .querySelectorAll('.score-step')
      .forEach(button => {
        button.disabled = false;
      });

    saveTimers.delete(matchId);
  }
}

document.addEventListener(
  'click',
  event => {
    const stepButton = event.target.closest(
      '.score-step'
    );

    if (!stepButton) {
      return;
    }

    const selector = stepButton.closest(
      '.score-selector'
    );

    const card = selector.closest(
      '.vote-card'
    );

    const output = selector.querySelector(
      '.score-value'
    );

    let value = Number(output.textContent);

    if (
      stepButton.classList.contains(
        'score-up'
      )
    ) {
      value = Math.min(value + 1, 20);
    } else {
      value = Math.max(value - 1, 0);
    }

    output.textContent = String(value);

    updateCardOutcome(card);
    scheduleForecastSave(card);
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
