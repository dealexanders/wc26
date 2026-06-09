const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const API_BASE =
  'https://api.wc26.example.com/api/v1';

const initData = tg.initData;

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
  const [
    matchesResponse,
    votesResponse,
  ] = await Promise.all([
    fetch(
      `${API_BASE}/matches.php`
    ).then(response => response.json()),

    telegramFetch('my-votes.php'),
  ]);

  const votesByMatch = new Map(
    votesResponse.votes.map(vote => [
      Number(vote.match_id),
      vote.prediction,
    ])
  );

  renderVotingMatches(
    matchesResponse.matches,
    votesByMatch
  );
}

function renderVotingMatches(
  matches,
  votesByMatch
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
      const selected =
        votesByMatch.get(
          Number(match.id)
        );

      const homeName =
        match.home_team_name;

      const awayName =
        match.away_team_name;

      return `
        <article
          class="vote-card"
          data-match-id="${match.id}"
        >
          <div class="vote-meta">
            Match ${match.match_number}
          </div>

          <h2>
            ${escapeHtml(homeName)}
            <span>vs</span>
            ${escapeHtml(awayName)}
          </h2>

          <div class="vote-actions">
            ${voteButton(
              match.id,
              'HOME_WIN',
              `${homeName} wins`,
              selected
            )}

            ${voteButton(
              match.id,
              'DRAW',
              'Draw',
              selected
            )}

            ${voteButton(
              match.id,
              'AWAY_WIN',
              `${awayName} wins`,
              selected
            )}
          </div>

          <p
            class="vote-message"
            aria-live="polite"
          ></p>
        </article>
      `;
    })
    .join('');
}

function voteButton(
  matchId,
  prediction,
  label,
  selected
) {
  const active =
    selected === prediction
      ? ' active'
      : '';

  return `
    <button
      type="button"
      class="vote-button${active}"
      data-match-id="${matchId}"
      data-prediction="${prediction}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

document.addEventListener(
  'click',
  async event => {
    const button = event.target.closest(
      '.vote-button'
    );

    if (!button) return;

    const card = button.closest(
      '.vote-card'
    );

    const message = card.querySelector(
      '.vote-message'
    );

    const matchId = Number(
      button.dataset.matchId
    );

    const prediction =
      button.dataset.prediction;

    card
      .querySelectorAll('.vote-button')
      .forEach(item => {
        item.disabled = true;
      });

    message.textContent =
      'Saving prediction…';

    try {
      await telegramFetch(
        'vote.php',
        {
          method: 'POST',
          body: JSON.stringify({
            match_id: matchId,
            prediction,
          }),
        }
      );

      card
        .querySelectorAll('.vote-button')
        .forEach(item => {
          item.classList.toggle(
            'active',
            item.dataset.prediction
              === prediction
          );
        });

      message.textContent =
        'Prediction saved';

      tg.HapticFeedback
        ?.notificationOccurred(
          'success'
        );
    } catch (error) {
      message.textContent =
        error.message;

      tg.HapticFeedback
        ?.notificationOccurred(
          'error'
        );
    } finally {
      card
        .querySelectorAll('.vote-button')
        .forEach(item => {
          item.disabled = false;
        });
    }
  }
);

loadVotingData().catch(error => {
  console.error('Mini App loading failed:', error);

  document.querySelector('#matches').innerHTML = `
    <p class="error-message">
      Mini App loading failed:<br>
      ${escapeHtml(error?.message || String(error))}
    </p>
  `;
});
