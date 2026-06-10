let DATA;

const API_BASE =
  'https://serwer2687458.hosting-home.pl/wc26-api/public/api/v1';

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

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

const routes = {
  home: renderHome,
  games: renderGames,
  table: renderTable
};

const matchNumber = match =>
  Number.parseInt(match.no, 10) ||
  Number.MAX_SAFE_INTEGER;

const matchesByNumber = matches =>
  [...matches].sort(
    (a, b) =>
      matchNumber(a) - matchNumber(b)
  );

async function fetchJson(path, options = {}) {
  const response = await fetch(
    API_BASE + '/' + path,
    options
  );

  let body;

  try {
    body = await response.json();
  } catch (error) {
    throw new Error(
      'Invalid JSON response from ' + path
    );
  }

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
      'HTTP ' + response.status
    );
  }

  return body;
}
function parseUtcDate(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value)
    .replace(' ', 'T')
    .replace(/Z$/, '');

  const date = new Date(`${normalized}Z`);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatMatchDate(value) {
  const date = parseUtcDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      timeZone: 'America/New_York',
      day: 'numeric',
      month: 'long'
    }
  ).format(date);
}

function formatMatchTime(value) {
  const date = parseUtcDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  ).format(date);
}

function formatStage(stage = '') {
  const labels = {
    GROUP_STAGE: 'Group Stage',
    ROUND_OF_32: 'Round of 32',
    ROUND_OF_16: 'Round of 16',
    QUARTER_FINAL: 'Quarter-final',
    SEMI_FINAL: 'Semi-final',
    BRONZE_FINAL: 'Bronze Final',
    FINAL: 'Final'
  };

  return labels[stage] || stage;
}

function normalizeApiData(
  bootstrap,
  apiMatches
) {
  const teams = {};

  for (const item of bootstrap.teams || []) {
    teams[item.code] = {
      id: Number(item.id),
      name: item.name,
      flag: item.flag_code
    };
  }

  const groups = {};

  for (const item of bootstrap.groups || []) {
    const groupCode = item.group_code;

    if (!groups[groupCode]) {
      groups[groupCode] = [];
    }

    groups[groupCode].push(
      item.team_code
    );
  }

  const matches = (apiMatches || []).map(
    match => {
      const kickoffAtUtc =
        match.kickoff_at_utc || '';

      return {
        id: Number(match.id),

        no: String(
          match.match_number ?? ''
        ),

        stage: formatStage(
          match.stage
        ),

        group:
          match.group_code || '',

        kickoffAtUtc,

        date: formatMatchDate(
          kickoffAtUtc
        ),

        time: formatMatchTime(
          kickoffAtUtc
        ),

        team1:
          match.home_team_code ||
          match.home_placeholder ||
          'TBC',

        team2:
          match.away_team_code ||
          match.away_placeholder ||
          'TBC',

        venue:
          match.venue_name ||
          match.venue_city ||
          'TBC',

        status:
          match.status || 'SCHEDULED',

        score1:
          match.home_score === null ||
          match.home_score === undefined
            ? null
            : Number(match.home_score),

        score2:
          match.away_score === null ||
          match.away_score === undefined
            ? null
            : Number(match.away_score),

        totalVotes: Number(
          match.total_votes || 0
        ),

        voteResults: {
          homeWin: Number(
            match.home_win_votes || 0
          ),

          draw: Number(
            match.draw_votes || 0
          ),

          awayWin: Number(
            match.away_win_votes || 0
          )
        }
      };
    }
  );

  return {
    site: bootstrap.site || {},
    navigation:
      bootstrap.navigation || [],
    content: bootstrap.content || {},
    theme: bootstrap.theme || {},
    teams,
    groups,
    matches
  };
}

function applyTheme(theme = {}) {
  Object.entries(theme).forEach(
    ([name, value]) => {
      if (typeof value === 'string') {
        document.documentElement.style
          .setProperty(
            `--${name}`,
            value
          );
      }
    }
  );
}

function renderShell() {
  const { site, navigation } = DATA;

  const visibleNavigation =
    navigation.filter(
      item => item.id !== 'groups'
    );

  document.documentElement.lang =
    site.language || 'en';

  document.title =
    site.title || 'Mundial 2026';

  $('#brand').innerHTML = `
    <span class="brandCup">
      ${escapeHtml(site.brandIcon || '🏆')}
    </span>

    <span>
      ${escapeHtml(site.title || 'Mundial 2026')}
    </span>
  `;

  $('#nav').innerHTML =
    visibleNavigation
      .map(item => `
        <a
          data-page="${escapeHtml(item.id)}"
          href="#${escapeHtml(item.id)}"
        >
          ${escapeHtml(item.label)}
        </a>
      `)
      .join('');

  $('#nav').setAttribute(
    'aria-label',
    site.navigationLabel ||
    'Primary navigation'
  );

  $('#footer').textContent =
    site.footer || '';
}

function flag(code) {
  const tournamentTeam =
    DATA.teams[code];

  return tournamentTeam?.flag
    ? `
      <span
        class="fi fi-${escapeHtml(
          tournamentTeam.flag
        )}"
      ></span>
    `
    : `
      <span class="flagFallback">
        ${escapeHtml(code)}
      </span>
    `;
}

function team(code) {
  const tournamentTeam =
    DATA.teams[code];

  return tournamentTeam
    ? `
      <span class="team">
        ${flag(code)}

        <b>
          ${escapeHtml(
            tournamentTeam.name
          )}
        </b>

        <small>
          ${escapeHtml(code)}
        </small>
      </span>
    `
    : `
      <span class="team placeholder">
        <b>
          ${escapeHtml(code || 'TBC')}
        </b>
      </span>
    `;
}

function go() {
  const requestedPage =
    location.hash.replace('#', '') ||
    'home';

  const page = routes[requestedPage]
    ? requestedPage
    : 'home';

  $$('.nav a').forEach(link => {
    link.classList.toggle(
      'active',
      link.dataset.page === page
    );
  });

  routes[page]();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function groupCards(className) {
  const groupLabel =
    DATA.content.groups?.groupLabel ||
    'Group';

  return Object.entries(DATA.groups)
    .map(([group, teamCodes]) => `
      <article
        class="${className}"
        style="--group-accent:${escapeHtml(
          DATA.theme.groupColors?.[group] ||
          DATA.theme.line ||
          '#272b38'
        )}"
      >
        ${
          className === 'groupCard'
            ? `
              <div class="groupBadge">
                ${escapeHtml(group)}
              </div>
            `
            : ''
        }

        <h3>
          ${escapeHtml(groupLabel)}
          ${escapeHtml(group)}
        </h3>

        ${teamCodes
          .map(team)
          .join('')}
      </article>
    `)
    .join('');
}

function renderHome() {
  const home =
    DATA.content.home || {};

  $('#app').innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">
          ${escapeHtml(home.eyebrow)}
        </p>

        <h1>
          ${escapeHtml(
            home.heading ||
            DATA.site.title
          )}
        </h1>

        <div class="stats">
          ${(home.stats || [])
            .map(stat => `
              <span>
                ${escapeHtml(stat)}
              </span>
            `)
            .join('')}
        </div>
      </div>

      <div
        class="trophy"
        aria-label="${escapeHtml(
          home.trophyLabel || 'trophy'
        )}"
      >
        <div class="globe">
          ${escapeHtml(
            home.trophyIcon || '🏆'
          )}
        </div>

        <div class="base">
          ${escapeHtml(
            home.trophyBase || '26'
          )}
        </div>
      </div>
    </section>

    <section class="groupList">
      ${groupCards('groupMini')}
    </section>
  `;
}

function renderGames() {
  const games =
    DATA.content.games || {};

  $('#app').innerHTML = `
    <h2>
      ${escapeHtml(
        games.heading || 'Games'
      )}
    </h2>

    <p class="sub">
      ${escapeHtml(games.description)}
    </p>

    <div class="filters">
      <input
        id="q"
        placeholder="${escapeHtml(
          games.searchPlaceholder ||
          'Search team, city, date...'
        )}"
      >

      <select id="groupFilter">
        <option value="">
          ${escapeHtml(
            games.allFilterLabel ||
            'All groups/stages'
          )}
        </option>

        ${Object.keys(DATA.groups)
          .map(group => `
            <option value="${escapeHtml(group)}">
              ${escapeHtml(group)}
            </option>
          `)
          .join('')}

        <option value="knockout">
          ${escapeHtml(
            games.knockoutFilterLabel ||
            'Knockout'
          )}
        </option>
      </select>
    </div>

    <div
      id="gameGrid"
      class="gameGrid"
    ></div>
  `;

  const draw = () => {
    const query =
      $('#q').value
        .trim()
        .toLowerCase();

    const groupFilter =
      $('#groupFilter').value;

    const filteredMatches =
      DATA.matches.filter(match => {
        const teamNames = [
          match.team1,
          match.team2
        ].map(
          code =>
            DATA.teams[code]?.name ||
            code
        );

        const searchableText = [
          match.no,
          match.stage,
          match.group,
          match.date,
          match.time,
          match.venue,
          ...teamNames
        ]
          .join(' ')
          .toLowerCase();

        const isKnockout =
          !match.group;

        const matchesGroup =
          !groupFilter ||
          match.group === groupFilter ||
          (
            groupFilter === 'knockout' &&
            isKnockout
          );

        return (
          (
            !query ||
            searchableText.includes(query)
          ) &&
          matchesGroup
        );
      });

    const sortedMatches =
      matchesByNumber(
        filteredMatches
      );

    $('#gameGrid').innerHTML =
      sortedMatches
        .map(matchCard)
        .join('');
  };

  $('#q').addEventListener(
    'input',
    draw
  );

  $('#groupFilter').addEventListener(
    'change',
    draw
  );

  draw();
}

function score(match) {
  if (
    match.score1 === null ||
    match.score2 === null
  ) {
    return (
      DATA.content.games?.versusLabel ||
      'v'
    );
  }

  return `
    ${escapeHtml(match.score1)}
    –
    ${escapeHtml(match.score2)}
  `;
}

function matchCard(match) {
  const games =
    DATA.content.games || {};

  const groupLabel =
    DATA.content.groups?.groupLabel ||
    'Group';

  return `
    <article
      class="matchCard"
      data-match-id="${match.id}"
      tabindex="0"
      role="button"
      aria-label="Open forecast details for match ${escapeHtml(match.no)}"
    >
      <div class="matchMeta">
        <span>
          #${escapeHtml(
            match.no ||
            games.unknownMatchNumber ||
            '—'
          )}
        </span>

        <span>
          ${escapeHtml(match.stage)}
        </span>

        <span>
          ${
            match.group
              ? `
                ${escapeHtml(groupLabel)}
                ${escapeHtml(match.group)}
              `
              : ''
          }
        </span>
      </div>

      <div class="forecastPreview">
        <span
          title="${escapeHtml(
            `${DATA.teams[match.team1]?.name || match.team1} win`
          )}"
        >
          ← ${escapeHtml(
            match.voteResults.homeWin
          )}
        </span>

        <span title="Draw">
          ↕ ${escapeHtml(
            match.voteResults.draw
          )}
        </span>

        <span
          title="${escapeHtml(
            `${DATA.teams[match.team2]?.name || match.team2} win`
          )}"
        >
          ${escapeHtml(
            match.voteResults.awayWin
          )} →
        </span>
      </div>

      <div class="versus">
        ${team(match.team1)}

        <strong>
          ${score(match)}
        </strong>

        ${team(match.team2)}
      </div>

      <div class="where">
        <span>
          ${escapeHtml(match.date)}
        </span>

        <span>
          ${escapeHtml(match.time)}
          ${escapeHtml(
            DATA.content.timeZoneLabel ||
            'ET'
          )}
        </span>

        <span>
          ${escapeHtml(
            match.venue ||
            games.venueTbc ||
            'TBC'
          )}
        </span>
      </div>
    </article>
  `;
}

function renderTable() {
  const table =
    DATA.content.table || {};

  const sortedMatches =
    matchesByNumber(DATA.matches);

  const columns =
    table.columns || [
      '#',
      'Date',
      'Time',
      'Location',
      'Stage',
      'Group',
      'Game'
    ];

  $('#app').innerHTML = `
    <h2>
      ${escapeHtml(
        table.heading ||
        'Schedule table'
      )}
    </h2>

    <p class="sub">
      ${escapeHtml(table.description)}
    </p>

    <div class="tableWrap">
      <table>
        <thead>
          <tr>
            ${columns
              .map(column => `
                <th>
                  ${escapeHtml(column)}
                </th>
              `)
              .join('')}
          </tr>
        </thead>

        <tbody>
          ${sortedMatches
            .map(match => `
              <tr>
                <td>
                  ${escapeHtml(match.no)}
                </td>

                <td>
                  ${escapeHtml(match.date)}
                </td>

                <td>
                  ${escapeHtml(match.time)}
                </td>

                <td>
                  ${escapeHtml(match.venue)}
                </td>

                <td>
                  ${escapeHtml(match.stage)}
                </td>

                <td>
                  ${escapeHtml(match.group)}
                </td>

                <td>
                  ${team(match.team1)}

                  <b class="v">
                    ${score(match)}
                  </b>

                  ${team(match.team2)}
                </td>
              </tr>
            `)
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function openForecastDetails(
  matchId
) {
  const dialog =
    $('#forecastDialog');

  const body =
    $('#forecastDialogBody');

  const match = DATA.matches.find(
    item => item.id === matchId
  );

  if (!match) {
    return;
  }

  $('#forecastDialogTitle').textContent =
    `Match ${match.no}: ${
      DATA.teams[match.team1]?.name
      || match.team1
    } vs ${
      DATA.teams[match.team2]?.name
      || match.team2
    }`;

  body.innerHTML = `
    <p>Loading forecasts…</p>
  `;

  dialog.showModal();

  try {
    const response = await fetchJson(
      `forecast-details.php?match_id=${encodeURIComponent(
        matchId
      )}`
    );

    renderForecastDetails(
      body,
      response.forecasts || [],
      match
    );
  } catch (error) {
    body.innerHTML = `
      <p class="loadError">
        ${escapeHtml(error.message)}
      </p>
    `;
  }
}

function renderForecastDetails(
  container,
  forecasts,
  match
) {
  if (!forecasts.length) {
    container.innerHTML = `
      <p>No forecasts yet.</p>
    `;

    return;
  }

  const homeName =
    DATA.teams[match.team1]?.name
    || match.team1;

  const awayName =
    DATA.teams[match.team2]?.name
    || match.team2;

  container.innerHTML = `
    <div class="forecastDetailList">
      ${forecasts.map(forecast => `
        <article class="forecastDetailRow">
          <strong>
            ${escapeHtml(
              forecast.voter_name
            )}
          </strong>

          <span class="forecastDetailScore">
            ${escapeHtml(
              forecast.home_score
            )}
            –
            ${escapeHtml(
              forecast.away_score
            )}
          </span>

          <span>
            ${escapeHtml(
              formatPublicOutcome(
                forecast.outcome,
                homeName,
                awayName
              )
            )}
          </span>
        </article>
      `).join('')}
    </div>
  `;
}

function formatPublicOutcome(
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

document.addEventListener(
  'click',
  event => {
    const card = event.target.closest(
      '.matchCard[data-match-id]'
    );

    if (!card) {
      return;
    }

    openForecastDetails(
      Number(card.dataset.matchId)
    );
  }
);

document.addEventListener(
  'keydown',
  event => {
    if (
      event.key !== 'Enter'
      && event.key !== ' '
    ) {
      return;
    }

    const card = event.target.closest(
      '.matchCard[data-match-id]'
    );

    if (!card) {
      return;
    }

    event.preventDefault();

    openForecastDetails(
      Number(card.dataset.matchId)
    );
  }
);

$('#closeForecastDialog')
  .addEventListener(
    'click',
    () => {
      $('#forecastDialog').close();
    }
  );

async function initialize() {
  try {
    const [
      bootstrap,
      matchesResponse
    ] = await Promise.all([
      fetchJson('bootstrap.php'),
      fetchJson('matches.php')
    ]);

    DATA = normalizeApiData(
      bootstrap,
      matchesResponse.matches
    );

    applyTheme(DATA.theme);
    renderShell();

    window.addEventListener(
      'hashchange',
      go
    );

    go();
  } catch (error) {
    console.error(
      'Unable to load tournament data:',
      error
    );

    $('#app').innerHTML = `
      <p class="loadError">
        Tournament data could not be loaded.
      </p>
    `;
  }
}

initialize();
