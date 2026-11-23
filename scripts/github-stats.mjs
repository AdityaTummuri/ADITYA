// Refreshes the account figures in content/github.json from GitHub's public API. No token, no dependency.
// The `profile` block (contribution calendar) cannot be read from the API: it is copied through untouched.
import { readFileSync, writeFileSync } from 'node:fs';

const OWNER = 'AdityaTummuri';
const FILE = new URL('../content/github.json', import.meta.url);
const headers = { 'User-Agent': 'portfolio-stats' };

async function get(url) {
  const res = await fetch(url, { headers });
  if (res.status !== 200) {
    console.error(`${url} answered ${res.status}; nothing was written.`);
    process.exit(1);
  }
  return res.json();
}

const user = await get(`https://api.github.com/users/${OWNER}`);
const repos = await get(`https://api.github.com/users/${OWNER}/repos?per_page=100`);
if (repos.length !== user.public_repos) {
  console.error(`The repository list has ${repos.length} entries but the account says ${user.public_repos}; nothing was written.`);
  process.exit(1);
}

const own = repos.filter((r) => !r.fork);
const stars = Object.fromEntries(own.filter((r) => r.stargazers_count > 0).sort((a, b) => b.stargazers_count - a.stargazers_count).map((r) => [r.name, r.stargazers_count]));
const current = JSON.parse(readFileSync(FILE, 'utf8'));
const next = {
  readOn: new Date().toISOString().slice(0, 10),
  account: {
    public_repos: user.public_repos,
    originals: own.length,
    forks: repos.length - own.length,
    originalStars: own.reduce((sum, r) => sum + r.stargazers_count, 0),
    created_at: user.created_at.slice(0, 10),
  },
  stars,
  profile: current.profile,
};
writeFileSync(FILE, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Wrote ${FILE.pathname}: ${next.account.public_repos} public repositories, ${next.account.originals} original, ${next.account.forks} forks, ${next.account.originalStars} stars on the originals.`);
console.log(`profile figures are read by hand, last on ${current.profile.readOn}`);
