import { mkdir, writeFile } from 'node:fs/promises';

const owner = 'vishwasaithalz';
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'profile-stats-generator',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${url}: ${await response.text()}`);
  }
  return response.json();
}

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

const [profile, repos] = await Promise.all([
  getJson(`https://api.github.com/users/${owner}`),
  getJson(`https://api.github.com/users/${owner}/repos?per_page=100&type=owner&sort=updated`),
]);
const ownedPublicRepos = repos.filter((repo) => !repo.fork && repo.visibility === 'public');
const languageResults = await Promise.all(
  ownedPublicRepos.map((repo) => getJson(`https://api.github.com/repos/${owner}/${repo.name}/languages`)),
);
const totals = {};
for (const languageMap of languageResults) {
  for (const [language, bytes] of Object.entries(languageMap)) {
    totals[language] = (totals[language] || 0) + bytes;
  }
}
const languages = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 6);
const totalBytes = languages.reduce((sum, [, bytes]) => sum + bytes, 0) ||
  Object.values(totals).reduce((sum, bytes) => sum + bytes, 0);
const colors = {
  TypeScript: '#3178c6', JavaScript: '#d8b52b', Python: '#3776ab',
  HTML: '#e34f26', CSS: '#663399', Shell: '#89e051', Go: '#00add8',
  Java: '#b07219', Rust: '#dea584', PHP: '#4f5d95',
};
const metrics = [
  { label: 'PUBLIC REPOSITORIES', value: profile.public_repos ?? ownedPublicRepos.length },
  { label: 'FOLLOWERS', value: profile.followers ?? 0 },
  { label: 'PUBLIC STARS', value: ownedPublicRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) },
  { label: 'PUBLIC FORKS', value: ownedPublicRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0) },
];
const cards = metrics.map((metric, index) => {
  const x = 24 + index * 244;
  return `<g><rect x="${x}" y="22" width="226" height="86" rx="12" fill="#111827" stroke="#263449"/>
  <text x="${x + 16}" y="48" fill="#91a4bd" font-family="Arial,sans-serif" font-size="10" letter-spacing="1">${metric.label}</text>
  <text x="${x + 16}" y="88" fill="#f4f7fb" font-family="Arial,sans-serif" font-size="31" font-weight="700">${metric.value}</text></g>`;
}).join('');
let cursor = 24;
const barY = 177;
const barWidth = 952;
const bar = languages.map(([language, bytes]) => {
  const width = totalBytes ? (bytes / totalBytes) * barWidth : 0;
  const segment = `<rect x="${cursor.toFixed(2)}" y="${barY}" width="${Math.max(0, width).toFixed(2)}" height="12" fill="${colors[language] || '#8b9bb4'}"/>`;
  cursor += width;
  return segment;
}).join('');
const legend = languages.map(([language, bytes], index) => {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = 26 + col * 320;
  const y = 222 + row * 27;
  const pct = totalBytes ? (bytes / totalBytes * 100).toFixed(1) : '0.0';
  return `<circle cx="${x}" cy="${y - 4}" r="5" fill="${colors[language] || '#8b9bb4'}"/>
  <text x="${x + 13}" y="${y}" fill="#e5edf7" font-family="Arial,sans-serif" font-size="12">${escapeXml(language)}</text>
  <text x="${x + 120}" y="${y}" fill="#91a4bd" font-family="Arial,sans-serif" font-size="11">${pct}%</text>`;
}).join('');
const updated = new Date().toISOString().slice(0, 10);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="286" viewBox="0 0 1000 286" role="img" aria-labelledby="title desc">
<title id="title">Public GitHub profile statistics and language breakdown</title>
<desc id="desc">${metrics.map((m) => `${m.label}: ${m.value}`).join('. ')}. Language percentages are calculated from bytes reported by GitHub for owned public repositories.</desc>
<rect width="1000" height="286" rx="18" fill="#0b1120"/>
<text x="24" y="15" fill="#58d8e8" font-family="Arial,sans-serif" font-size="9" letter-spacing="1.5">PUBLIC PROFILE SNAPSHOT · ${updated}</text>
${cards}
<text x="24" y="145" fill="#f4f7fb" font-family="Arial,sans-serif" font-size="14" font-weight="700">PUBLIC REPOSITORY LANGUAGE BREAKDOWN</text>
<rect x="24" y="${barY}" width="${barWidth}" height="12" rx="6" fill="#263449"/>
<clipPath id="barClip"><rect x="24" y="${barY}" width="${barWidth}" height="12" rx="6"/></clipPath>
<g clip-path="url(#barClip)">${bar}</g>
${legend}
<text x="976" y="274" text-anchor="end" fill="#71839b" font-family="Arial,sans-serif" font-size="9">Source: GitHub REST API · Public repositories only</text>
</svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/github-profile-stats.svg', svg + '\n', 'utf8');
console.log(`Updated public profile metrics for ${ownedPublicRepos.length} repositories and ${languages.length} languages.`);
