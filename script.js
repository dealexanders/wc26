let DATA;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character]);

const routes = {
  home: renderHome,
  groups: renderGroups,
  games: renderGames,
  table: renderTable
};

function applyTheme(theme) {
  Object.entries(theme).forEach(([name, value]) => {
    if (typeof value === 'string') document.documentElement.style.setProperty(`--${name}`, value);
  });
}

function renderShell() {
  const { site, navigation } = DATA;
  document.documentElement.lang = site.language;
  document.title = site.title;
  $('#brand').innerHTML = `<span class="brandCup">${escapeHtml(site.brandIcon)}</span><span>${escapeHtml(site.title)}</span>`;
  $('#nav').innerHTML = navigation.map(item => `<a data-page="${escapeHtml(item.id)}" href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a>`).join('');
  $('#nav').setAttribute('aria-label', site.navigationLabel);
  $('#footer').textContent = site.footer;
}

function flag(code) {
  const tournamentTeam = DATA.teams[code];
  return tournamentTeam
    ? `<span class="fi fi-${escapeHtml(tournamentTeam.flag)}"></span>`
    : `<span class="flagFallback">${escapeHtml(code)}</span>`;
}

function team(code) {
  const tournamentTeam = DATA.teams[code];
  return tournamentTeam
    ? `<span class="team">${flag(code)}<b>${escapeHtml(tournamentTeam.name)}</b><small>${escapeHtml(code)}</small></span>`
    : `<span class="team placeholder"><b>${escapeHtml(code)}</b></span>`;
}

function go() {
  const requestedPage = location.hash.replace('#', '') || 'home';
  const page = routes[requestedPage] ? requestedPage : 'home';
  $$('.nav a').forEach(link => link.classList.toggle('active', link.dataset.page === page));
  routes[page]();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function groupCards(className) {
  const groupLabel = DATA.content.groups.groupLabel;
  return Object.entries(DATA.groups).map(([group, teamCodes]) => `
    <article class="${className}" style="--group-accent:${escapeHtml(DATA.theme.groupColors[group])}">
      ${className === 'groupCard' ? `<div class="groupBadge">${escapeHtml(group)}</div>` : ''}
      <h3>${escapeHtml(groupLabel)} ${escapeHtml(group)}</h3>
      ${teamCodes.map(team).join('')}
    </article>`).join('');
}

function renderHome() {
  const home = DATA.content.home;
  $('#app').innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">${escapeHtml(home.eyebrow)}</p>
        <h1>${escapeHtml(home.heading)}</h1>
        <div class="stats">${home.stats.map(stat => `<span>${escapeHtml(stat)}</span>`).join('')}</div>
      </div>
      <div class="trophy" aria-label="${escapeHtml(home.trophyLabel)}">
        <div class="globe">${escapeHtml(home.trophyIcon)}</div>
        <div class="base">${escapeHtml(home.trophyBase)}</div>
      </div>
    </section>
    <section class="groupList">${groupCards('groupMini')}</section>`;
}

function renderGroups() {
  const groups = DATA.content.groups;
  $('#app').innerHTML = `<h2>${escapeHtml(groups.heading)}</h2><p class="sub">${escapeHtml(groups.description)}</p><div class="groupsGrid">${groupCards('groupCard')}</div>`;
}

function renderGames() {
  const games = DATA.content.games;
  $('#app').innerHTML = `
    <h2>${escapeHtml(games.heading)}</h2>
    <p class="sub">${escapeHtml(games.description)}</p>
    <div class="filters">
      <input id="q" placeholder="${escapeHtml(games.searchPlaceholder)}">
      <select id="groupFilter">
        <option value="">${escapeHtml(games.allFilterLabel)}</option>
        ${Object.keys(DATA.groups).map(group => `<option>${escapeHtml(group)}</option>`).join('')}
        <option>${escapeHtml(games.knockoutFilterLabel)}</option>
      </select>
    </div>
    <div id="gameGrid" class="gameGrid"></div>`;

  const draw = () => {
    const query = $('#q').value.toLowerCase();
    const groupFilter = $('#groupFilter').value;
    const list = DATA.matches.filter(match => {
      const teamNames = [match.team1, match.team2].map(code => DATA.teams[code]?.name || code);
      const searchableText = [...Object.values(match), ...teamNames].join(' ').toLowerCase();
      const matchesGroup = !groupFilter || match.group === groupFilter || (groupFilter === games.knockoutFilterLabel && !match.group);
      return (!query || searchableText.includes(query)) && matchesGroup;
    });
    $('#gameGrid').innerHTML = list.map(matchCard).join('');
  };

  $('#q').addEventListener('input', draw);
  $('#groupFilter').addEventListener('change', draw);
  draw();
}

function score(match) {
  if (match.score1 === null || match.score2 === null) return DATA.content.games.versusLabel;
  return `${escapeHtml(match.score1)}–${escapeHtml(match.score2)}`;
}

function matchCard(match) {
  const games = DATA.content.games;
  return `<article class="matchCard">
    <div class="matchMeta"><span>#${escapeHtml(match.no || games.unknownMatchNumber)}</span><span>${escapeHtml(match.stage)}</span><span>${match.group ? `${escapeHtml(DATA.content.groups.groupLabel)} ${escapeHtml(match.group)}` : ''}</span></div>
    <div class="versus">${team(match.team1)}<strong>${score(match)}</strong>${team(match.team2)}</div>
    <div class="where"><span>${escapeHtml(match.date)}</span><span>${escapeHtml(match.time)} ${escapeHtml(DATA.content.timeZoneLabel)}</span><span>${escapeHtml(match.venue || games.venueTbc)}</span></div>
  </article>`;
}

function renderTable() {
  const table = DATA.content.table;
  $('#app').innerHTML = `
    <h2>${escapeHtml(table.heading)}</h2>
    <p class="sub">${escapeHtml(table.description)}</p>
    <div class="tableWrap"><table>
      <thead><tr>${table.columns.map(column => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead>
      <tbody>${DATA.matches.map(match => `<tr><td>${escapeHtml(match.no)}</td><td>${escapeHtml(match.date)}</td><td>${escapeHtml(match.time)}</td><td>${escapeHtml(match.venue)}</td><td>${escapeHtml(match.stage)}</td><td>${escapeHtml(match.group)}</td><td>${team(match.team1)} <b class="v">${score(match)}</b> ${team(match.team2)}</td></tr>`).join('')}</tbody>
    </table></div>`;
}

async function initialize() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    DATA = await response.json();
    applyTheme(DATA.theme);
    renderShell();
    window.addEventListener('hashchange', go);
    go();
  } catch (error) {
    console.error('Unable to load data.json:', error);
    $('#app').innerHTML = '<p class="loadError">Tournament data could not be loaded. Serve the project with a local web server and check data.json.</p>';
  }
}

initialize();
