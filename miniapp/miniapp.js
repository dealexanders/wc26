const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const API_BASE =
  'https://serwer2687458.hosting-home.pl/wc26-api/public/api/v1';

const initData = tg.initData;

const SCORE_MIN = 0;
const SCORE_MAX = 20;
const SCORE_ITEM_HEIGHT = 44;
const MATCH_DATE_TIME_ZONE = 'America/New_York';

let currentMatches = [];
let currentForecastsByMatch = new Map();
let selectedDateKey = null;

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

function getMatchDateKey(match) {
  const date = new Date(`${match.kickoff_at_utc}Z`);

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MATCH_DATE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(part => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function formatDateTitle(dateKey) {
  const [year, month, day] = dateKey
    .split('-')
    .map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function formatMatchTime(match) {
  const date = new Date(`${match.kickoff_at_utc}Z`);

  return new Intl.DateTimeFormat('en', {
    timeZone: MATCH_DATE_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function groupMatchesByDate(matches) {
  const map = new Map();

  for (const match of matches) {
    const dateKey = getMatchDateKey(match);

    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }

    map.get(dateKey).push(match);
  }

  for (const dayMatches of map.values()) {
    dayMatches.sort((a, b) => {
      const timeA = new Date(`${a.kickoff_at_utc}Z`).getTime();
      const timeB = new Date(`${b.kickoff_at_utc}Z`).getTime();

      return timeA - timeB;
    });
  }

  return map;
}

function getMonthsBetween(firstDateKey, lastDateKey) {
  const [firstYear, firstMonth] = firstDateKey
    .split('-')
    .map(Number);

  const [lastYear, lastMonth] = lastDateKey
    .split('-')
    .map(Number);

  const months = [];
  let year = firstYear;
  let month = firstMonth;

  while (
    year < lastYear ||
    (year === lastYear && month <= lastMonth)
  ) {
    months.push({ year, month });
    month += 1;

    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return months;
}

function renderCalendarMonth(monthInfo, matchesByDate) {
  const { year, month } = monthInfo;
  const monthDate = new Date(Date.UTC(year, month - 1, 1));
  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(monthDate);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const mondayBasedOffset = firstDay === 0 ? 6 : firstDay - 1;
  const blanks = Array.from(
    { length: mondayBasedOffset },
    () => '<div class="calendar-empty"></div>'
  );

  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateKey = [
      year,
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join('-');
    const dayMatches = matchesByDate.get(dateKey) || [];
    const hasMatches = dayMatches.length > 0;
    const isSelected = selectedDateKey === dateKey;

    if (!hasMatches) {
      return `
        <button type="button" class="calendar-day" disabled>
          ${day}
        </button>
      `;
    }

    return `
      <button
        type="button"
        class="calendar-day has-matches ${isSelected ? 'selected' : ''}"
        data-date-key="${dateKey}"
        aria-label="${dayMatches.length} matches on ${formatDateTitle(dateKey)}"
      >
        <span class="soccer-date-bg"></span>
        <span class="calendar-day-number">${day}</span>
        <span class="calendar-match-count">${dayMatches.length}</span>
      </button>
    `;
  });

  return `
    <section class="calendar-month">
      <h3>${escapeHtml(monthLabel)}</h3>
      <div class="calendar-weekdays">
        <span>M</span><span>T</span><span>W</span><span>T</span>
        <span>F</span><span>S</span><span>S</span>
      </div>
      <div class="calendar-grid">
        ${blanks.join('')}
        ${days.join('')}
      </div>
    </section>
  `;
}

function renderMatchCalendar(matches) {
  const calendar = document.querySelector('#matchCalendar');
  const matchesByDate = groupMatchesByDate(matches);
  const dateKeys = [...matchesByDate.keys()].sort();

  if (!dateKeys.length) {
    calendar.innerHTML = '<p class="empty-state">No matches available.</p>';
    return;
  }

  const months = getMonthsBetween(dateKeys[0], dateKeys[dateKeys.length - 1]);

  calendar.innerHTML = months
    .map(month => renderCalendarMonth(month, matchesByDate))
    .join('');
}

function getNextMatchDateKey(matches) {
  const now = Date.now();
  const futureMatches = matches
    .filter(match => new Date(`${match.kickoff_at_utc}Z`).getTime() >= now)
    .sort((a, b) => (
      new Date(`${a.kickoff_at_utc}Z`).getTime() -
      new Date(`${b.kickoff_at_utc}Z`).getTime()
    ));

  if (futureMatches.length) {
    return getMatchDateKey(futureMatches[0]);
  }

  const sorted = [...matches].sort((a, b) => (
    new Date(`${a.kickoff_at_utc}Z`).getTime() -
    new Date(`${b.kickoff_at_utc}Z`).getTime()
  ));

  return sorted.length ? getMatchDateKey(sorted[0]) : null;
}

function isForecastOpen(match) {
  const closesAt = new Date(`${match.voting_closes_at_utc}Z`).getTime();

  return (
    match.status === 'SCHEDULED' &&
    Number(match.voting_enabled) === 1 &&
    closesAt > Date.now() &&
    match.home_team_id &&
    match.away_team_id
  );
}

async function telegramFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('X-Telegram-Init-Data', initData);

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  let response;

  try {
    response = await fetch(`${API_BASE}/${path}`, { ...options, headers });
  } catch (error) {
    throw new Error(`Network request failed for ${path}: ${error.message}`);
  }

  const rawBody = await response.text();
  let body;

  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw new Error(`${path} returned invalid JSON: ${rawBody.slice(0, 150)}`);
  }

  if (!response.ok) {
    throw new Error(body?.error?.message || `${path} failed with HTTP ${response.status}`);
  }

  return body;
}

async function fetchMatches() {
  const response = await fetch(`${API_BASE}/matches.php`);
  const rawBody = await response.text();
  let body;

  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw new Error(`matches.php returned invalid JSON: ${rawBody.slice(0, 150)}`);
  }

  if (!response.ok) {
    throw new Error(body?.error?.message || `matches.php failed with HTTP ${response.status}`);
  }

  return body;
}

async function loadVotingData() {
  const [matchesResponse, votesResponse] = await Promise.all([
    fetchMatches(),
    telegramFetch('my-votes.php'),
  ]);

  currentMatches = matchesResponse.matches || [];
  currentForecastsByMatch = new Map(
    (votesResponse.votes || []).map(forecast => [
      Number(forecast.match_id),
      {
        homeScore: Number(forecast.predicted_home_score),
        awayScore: Number(forecast.predicted_away_score),
        outcome: forecast.outcome,
      },
    ])
  );
  renderMatchCalendar(currentMatches);
  showCalendarView();
}

function scoreWheel(matchId, side, value, enabled = true) {
  const numbers = Array.from(
    { length: SCORE_MAX - SCORE_MIN + 1 },
    (_, index) => SCORE_MIN + index
  );
  const disabledAttribute = enabled ? '' : 'disabled';

  return `
    <div class="score-wheel" data-match-id="${matchId}" data-side="${side}" data-value="${value}">
      <div
        class="score-wheel-window"
        tabindex="${enabled ? '0' : '-1'}"
        role="spinbutton"
        aria-valuemin="${SCORE_MIN}"
        aria-valuemax="${SCORE_MAX}"
        aria-valuenow="${value}"
        aria-label="${side === 'home' ? 'First team score' : 'Second team score'}"
        aria-disabled="${enabled ? 'false' : 'true'}"
      >
        <div class="score-wheel-list">
          ${numbers.map(number => `
            <button
              type="button"
              class="score-wheel-item ${number === value ? 'active' : ''}"
              data-score="${number}"
              tabindex="-1"
              ${disabledAttribute}
            >
              ${number}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderForecastCard(match) {
  const existing = currentForecastsByMatch.get(Number(match.id));
  const homeScore = existing?.homeScore ?? 0;
  const awayScore = existing?.awayScore ?? 0;
  const outcome = calculateDisplayedOutcome(homeScore, awayScore);
  const forecastOpen = isForecastOpen(match);

  return `
    <article
      class="vote-card ${forecastOpen ? '' : 'vote-card-passed'}"
      data-match-id="${match.id}"
      data-dirty="false"
      data-forecast-open="${forecastOpen ? 'true' : 'false'}"
      data-has-saved-forecast="${existing ? 'true' : 'false'}"
    >
      <div class="vote-meta">
        Match ${escapeHtml(match.match_number)} · ${escapeHtml(formatMatchTime(match))}
      </div>
      <div class="score-matchup">
        <div class="score-team">
          <h2>${escapeHtml(match.home_team_name)}</h2>
          ${scoreWheel(match.id, 'home', homeScore, forecastOpen)}
        </div>
        <div class="versus-label">VS</div>
        <div class="score-team">
          <h2>${escapeHtml(match.away_team_name)}</h2>
          ${scoreWheel(match.id, 'away', awayScore, forecastOpen)}
        </div>
      </div>
      <p class="forecast-outcome">
        ${escapeHtml(formatOutcome(outcome, match.home_team_name, match.away_team_name))}
      </p>
      <button
        type="button"
        class="forecast-save-button"
        data-match-id="${match.id}"
        aria-label="Save forecast"
        ${forecastOpen ? '' : 'disabled'}
      >
        ✓
      </button>
      <p class="vote-message" aria-live="polite">
        ${forecastOpen
          ? existing
            ? `Saved: ${homeScore}–${awayScore}`
            : 'Select score and tap ✓ to save'
          : 'Forecasting is closed'}
      </p>
      ${forecastOpen ? '' : `
        <div class="passed-overlay" aria-hidden="true">
          <span>PASSED</span>
        </div>
      `}
    </article>
  `;
}

function renderSelectedDateMatches() {
  const container = document.querySelector('#matches');
  const title = document.querySelector('#selectedDayTitle');

  if (!selectedDateKey) return;

  title.textContent = formatDateTitle(selectedDateKey);
  const selectedMatches = currentMatches
    .filter(match => getMatchDateKey(match) === selectedDateKey)
    .sort((a, b) => (
      new Date(`${a.kickoff_at_utc}Z`).getTime() -
      new Date(`${b.kickoff_at_utc}Z`).getTime()
    ));

  if (!selectedMatches.length) {
    container.innerHTML = '<p class="empty-state">No matches on this date.</p>';
    return;
  }

  container.innerHTML = selectedMatches.map(renderForecastCard).join('');
  initializeScoreWheels(container);
}

function showCalendarView() {
  selectedDateKey = null;
  document.querySelector('.calendar-section').hidden = false;
  document.querySelector('.selected-day-section').hidden = true;
}

function showDateList(dateKey) {
  if (!dateKey) return;

  selectedDateKey = dateKey;
  renderSelectedDateMatches();
  document.querySelector('.calendar-section').hidden = true;
  document.querySelector('.selected-day-section').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateDisplayedOutcome(homeScore, awayScore) {
  if (homeScore > awayScore) return 'HOME_WIN';
  if (homeScore < awayScore) return 'AWAY_WIN';
  return 'DRAW';
}

function formatOutcome(outcome, homeName, awayName) {
  if (outcome === 'HOME_WIN') return `${homeName} win`;
  if (outcome === 'AWAY_WIN') return `${awayName} win`;
  return 'Draw';
}

function getCardScores(card) {
  return {
    homeScore: Number(card.querySelector('.score-wheel[data-side="home"]').dataset.value),
    awayScore: Number(card.querySelector('.score-wheel[data-side="away"]').dataset.value),
  };
}

function updateCardOutcome(card) {
  const { homeScore, awayScore } = getCardScores(card);
  const match = currentMatches.find(item => Number(item.id) === Number(card.dataset.matchId));
  const outcome = calculateDisplayedOutcome(homeScore, awayScore);

  card.querySelector('.forecast-outcome').textContent = formatOutcome(
    outcome,
    match.home_team_name,
    match.away_team_name
  );
}

function initializeScoreWheels(root = document) {
  root.querySelectorAll('.score-wheel').forEach(wheel => {
    const windowElement = wheel.querySelector('.score-wheel-window');
    windowElement.scrollTop = Number(wheel.dataset.value) * SCORE_ITEM_HEIGHT;
    updateWheelSelection(wheel);
  });
}

function updateWheelSelection(wheel) {
  const windowElement = wheel.querySelector('.score-wheel-window');
  const items = [...wheel.querySelectorAll('.score-wheel-item')];
  const selectedScore = Math.round(windowElement.scrollTop / SCORE_ITEM_HEIGHT);
  const safeScore = Math.min(SCORE_MAX, Math.max(SCORE_MIN, selectedScore));

  wheel.dataset.value = String(safeScore);
  windowElement.setAttribute('aria-valuenow', String(safeScore));
  items.forEach(item => item.classList.toggle('active', Number(item.dataset.score) === safeScore));

  const expectedScrollTop = safeScore * SCORE_ITEM_HEIGHT;

  if (Math.abs(windowElement.scrollTop - expectedScrollTop) > 1) {
    windowElement.scrollTo({ top: expectedScrollTop, behavior: 'smooth' });
  }
}

function markCardChanged(card) {
  if (card.dataset.forecastOpen !== 'true') return;

  card.dataset.dirty = 'true';
  updateCardOutcome(card);
  card.querySelector('.vote-message').textContent = 'Forecast changed. Tap ✓ to save.';
}

document.addEventListener('click', event => {
  const dayButton = event.target.closest('.calendar-day.has-matches');

  if (!dayButton) return;

  showDateList(dayButton.dataset.dateKey);
});

document.querySelector('#showTodayMatches').addEventListener('click', () => {
  showDateList(getNextMatchDateKey(currentMatches));
});

document.querySelector('#backToCalendar').addEventListener('click', () => {
  showCalendarView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('scroll', event => {
  const windowElement = event.target.closest?.('.score-wheel-window');

  if (!windowElement) return;

  const wheel = windowElement.closest('.score-wheel');
  const card = wheel.closest('.vote-card');

  if (card.dataset.forecastOpen !== 'true') return;

  clearTimeout(windowElement.dataset.scrollTimerId);
  const timerId = setTimeout(() => {
    updateWheelSelection(wheel);
    markCardChanged(card);
  }, 120);

  windowElement.dataset.scrollTimerId = String(timerId);
}, true);

document.addEventListener('click', event => {
  const item = event.target.closest('.score-wheel-item');

  if (!item) return;

  const card = item.closest('.vote-card');

  if (card.dataset.forecastOpen !== 'true') return;

  const wheel = item.closest('.score-wheel');
  const windowElement = wheel.querySelector('.score-wheel-window');
  const score = Number(item.dataset.score);

  windowElement.scrollTo({ top: score * SCORE_ITEM_HEIGHT, behavior: 'smooth' });
  wheel.dataset.value = String(score);
  updateWheelSelection(wheel);
  markCardChanged(card);
});

document.addEventListener('keydown', event => {
  const windowElement = event.target.closest('.score-wheel-window');

  if (!windowElement || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;

  const card = windowElement.closest('.vote-card');

  if (card.dataset.forecastOpen !== 'true') return;

  event.preventDefault();
  const wheel = windowElement.closest('.score-wheel');
  const currentValue = Number(wheel.dataset.value);
  const nextValue = event.key === 'ArrowUp'
    ? Math.max(SCORE_MIN, currentValue - 1)
    : Math.min(SCORE_MAX, currentValue + 1);

  windowElement.scrollTo({ top: nextValue * SCORE_ITEM_HEIGHT, behavior: 'smooth' });
  wheel.dataset.value = String(nextValue);
  updateWheelSelection(wheel);
  markCardChanged(card);
});

document.addEventListener('click', async event => {
  const saveButton = event.target.closest('.forecast-save-button');

  if (!saveButton) return;

  const card = saveButton.closest('.vote-card');

  if (card.dataset.forecastOpen !== 'true') return;

  const matchId = Number(card.dataset.matchId);
  const { homeScore, awayScore } = getCardScores(card);
  const message = card.querySelector('.vote-message');

  saveButton.disabled = true;
  card.querySelectorAll('.score-wheel-window').forEach(item => {
    item.setAttribute('aria-disabled', 'true');
  });
  message.textContent = 'Saving forecast…';

  try {
    const response = await telegramFetch('vote.php', {
      method: 'POST',
      body: JSON.stringify({
        match_id: matchId,
        home_score: homeScore,
        away_score: awayScore,
      }),
    });

    currentForecastsByMatch.set(matchId, {
      homeScore,
      awayScore,
      outcome: response.forecast.outcome,
    });
    card.dataset.dirty = 'false';
    card.dataset.hasSavedForecast = 'true';
    message.textContent = `Saved: ${homeScore}–${awayScore}`;
    tg.HapticFeedback?.notificationOccurred('success');
  } catch (error) {
    message.textContent = error.message;
    tg.HapticFeedback?.notificationOccurred('error');
  } finally {
    saveButton.disabled = false;
    card.querySelectorAll('.score-wheel-window').forEach(item => {
      item.setAttribute('aria-disabled', 'false');
    });
  }
});

loadVotingData().catch(error => {
  console.error('Mini App loading failed:', error);
  showCalendarView();
  document.querySelector('#matchCalendar').innerHTML = `
    <p class="error-message">
      Mini App loading failed:<br>
      ${escapeHtml(error.message)}
    </p>
  `;
});
