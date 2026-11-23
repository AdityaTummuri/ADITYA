import github from './github.json' with { type: 'json' };
import { formatDay, OWNER, PROFILE_URL } from './receipt-links.ts';
import type { ApiReceipt, ComputedReceipt, CountedReceipt, QuotedReceipt, ReadReceipt, Receipt } from './types';

const q = (id: string, value: string, claim: string, repo: string, path: string, quote: string): QuotedReceipt => ({ id, kind: 'quoted', value, claim, repo, path, quote });
const n = (id: string, value: string, claim: string, repo: string, command: string, path?: string): CountedReceipt => ({ id, kind: 'counted', value, claim, repo, command, ...(path ? { path } : {}) });

const RESULTS = 'docs/results.md';
const BARE = '11 of 108 for the bare models, 4 of 108 with QEDCode';
const ZOO = '(21/30 through QEDCode vs 28/30 bare)';
const SWE = '0/10 bare, 2/10 through';
const FS_ACC = '| **Accuracy** | **93.18%** | **80.49%** (66 / 82) |';
const FS_TEST = '82 samples across 9 unseen subjects';
const FS_DATA = '583 radar recordings across 60 human subjects';
const FS_PARAMS = '421,795 (~1.6 MB memory footprint)';
const KV = 'app/src/main/kotlin/com/kavach/upi';
const EVAL = `${KV}/service/ThreatStateEvaluator.kt`;
const SERVICE = `${KV}/service/KavachAccessibilityService.kt`;
const VERIFIER = `${KV}/detection/PaymentScreenVerifier.kt`;
const REGISTRY = `${KV}/detection/UpiTargetRegistry.kt`;
const IDLE = 'val interval = if (isActiveContext) 1000L else 3000L';
const NT_REPORT = 'docs/WORK_COMPLETION_REPORT_TERRAIN_AI.md';
const NT_VRAM = 'Batch size `4` utilizing ~2.5 GB of VRAM';
const COMMITS_CLAIM = 'Commits by Aditya, of all commits on the default branch. The name appears as Aditya, AdityaTummuri, Aditya-Tummuri and ADITYA-TUMMURI.';
const SHORTLOG = 'git shortlog -sn HEAD';
const TEST_FUNCS = 'Test functions in the repository';
const GREP_TESTS = "git grep -hE '^\\s*(async )?def test_' | wc -l";

const list: Receipt[] = [
  // QEDCode
  q('qed-a', '86 of 89', 'Results QEDCode graded A that were right', 'QEDCode', RESULTS, '86 of 89 grade A results were right'),
  q('qed-silent-bare', '11 of 108', 'Wrong changes that looked finished, model alone', 'QEDCode', RESULTS, BARE),
  q('qed-silent', '4 of 108', 'Wrong changes that looked finished, through QEDCode', 'QEDCode', RESULTS, BARE),
  q('qed-after', '62 of 65', 'Grade A results that were right after the later fixes', 'QEDCode', RESULTS, 'grade A right **62 of 65**'),
  q('qed-zoo', '21 of 30', 'Bug zoo tasks solved by the small model through QEDCode, after the fixes', 'QEDCode', RESULTS, ZOO),
  q('qed-zoo-bare', '28 of 30', 'Bug zoo tasks solved by the same model alone', 'QEDCode', RESULTS, ZOO),
  q('qed-swe', '2 of 10', 'SWE-bench Verified pilot issues solved through QEDCode', 'QEDCode', RESULTS, SWE),
  q('qed-swe-bare', '0 of 10', 'The same issues, model alone', 'QEDCode', RESULTS, SWE),
  q('qed-gpu', '6 GB', 'Video memory of the laptop the runs used', 'QEDCode', RESULTS, 'RTX 4050 Laptop GPU (6 GB)'),
  q('qed-hidden', 'task 008', 'The hidden test the wrong A’s failed', 'QEDCode', 'bugzoo/008_slugify_feature/hidden/test_hidden.py', 'assert slugify("Already-slugged") == "already-slugged"'),
  q('qed-rule', 'one function', 'Where every grade is decided', 'QEDCode', 'src/qedcode/verify/grade.py', 'g = Grade.A if passed(c, "fbpa") and c.full_suite_ran else Grade.B'),
  n('qed-commits', '84 of 84', COMMITS_CLAIM, 'QEDCode', SHORTLOG),
  n('qed-lines', '40,454', 'Lines in the repository’s Python and JavaScript files', 'QEDCode', "git ls-files -z '*.py' '*.js' | xargs -0 cat | wc -l"),
  // FracSST-Mamba
  q('fs-acc', '80.49%', 'Test accuracy', 'FracSST-Mamba', 'README.md', FS_ACC),
  q('fs-hits', '66 of 82', 'Test recordings classified correctly', 'FracSST-Mamba', 'README.md', FS_ACC),
  q('fs-val', '93.18%', 'Validation accuracy', 'FracSST-Mamba', 'README.md', FS_ACC),
  q('fs-test', '82 recordings', 'Test set size', 'FracSST-Mamba', 'README.md', FS_TEST),
  q('fs-people', '9 people', 'People in the test set, none seen in training', 'FracSST-Mamba', 'README.md', FS_TEST),
  q('fs-train', '42', 'People in the training set', 'FracSST-Mamba', 'README.md', '413 samples across 42 subjects'),
  q('fs-valpeople', '9', 'People in the validation set', 'FracSST-Mamba', 'README.md', '88 samples across 9 subjects'),
  q('fs-data', '583 recordings', 'Recordings in the Glasgow set', 'FracSST-Mamba', 'README.md', FS_DATA),
  q('fs-subjects', '60 people', 'People in the Glasgow set', 'FracSST-Mamba', 'README.md', FS_DATA),
  q('fs-leak', '98%', 'What models report when people leak between splits', 'FracSST-Mamba', 'README.md', 'artificially inflated accuracy (>98%)'),
  q('fs-matrix', 'confusion matrix', 'Every test recording, true class against predicted class', 'FracSST-Mamba', 'results/test_evaluation_results.json', '"confusion_matrix":[[26,1,1],[1,20,6],[0,7,20]]'),
  q('fs-f1-walk', '0.9455', 'F1 for walking', 'FracSST-Mamba', 'README.md', '| **Walk** | 96.30% | 92.86% | **0.9455** | 28 |'),
  q('fs-f1-sit', '0.7273', 'F1 for sitting', 'FracSST-Mamba', 'README.md', '| **Sit** | 71.43% | 74.07% | **0.7273** | 27 |'),
  q('fs-f1-fall', '0.7407', 'F1 for falling', 'FracSST-Mamba', 'README.md', '| **Fall** | 74.07% | 74.07% | **0.7407** | 27 |'),
  q('fs-params', '421,795', 'Trainable parameters', 'FracSST-Mamba', 'README.md', FS_PARAMS),
  q('fs-size', '1.6 MB', 'Model size', 'FracSST-Mamba', 'README.md', FS_PARAMS),
  q('fs-freq', '5.8 GHz', 'Radar carrier frequency', 'FracSST-Mamba', 'README.md', '5.8 GHz Continuous-Wave Radar Activity Dataset'),
  n('fs-commits', '14 of 21', COMMITS_CLAIM, 'FracSST-Mamba', SHORTLOG),
  {
    id: 'fs-misses', kind: 'computed', value: '13 of the 16', claim: 'Misses that were sitting and falling mistaken for each other', repo: 'FracSST-Mamba',
    from: ['fs-matrix'], working: '6 sits called falls plus 7 falls called sits is 13. 82 recordings minus 66 correct is 16.',
  } satisfies ComputedReceipt,
  // NETRA-UGV
  q('nt-miou', '76.25%', 'Validation mIoU over the four terrain classes', 'Netra-UGV', 'weights/README.md', '**76.25% mIoU** across all 4 tactical classes'),
  q('nt-ms', '14.06 ms', 'Inference time for one test frame', 'Netra-UGV', NT_REPORT, '**14.06 ms** per frame'),
  q('nt-size', '8.79 MB', 'Size of the ONNX file', 'Netra-UGV', 'weights/README.md', '| **`bisenetv2_rellis.onnx`** | 8.79 MB |'),
  q('nt-params', '2.31M', 'Model parameters', 'Netra-UGV', 'weights/README.md', '~2.31M parameters'),
  q('nt-pairs', '5,957', 'Image and mask pairs in the training data', 'Netra-UGV', 'weights/README.md', '5,957 keyframe image-mask pairs'),
  q('nt-diff', '1e-4', 'Largest difference between PyTorch and ONNX output', 'Netra-UGV', 'weights/README.md', '(`< 1e-4` max difference)'),
  q('nt-vram', '2.5 GB', 'Video memory used in training', 'Netra-UGV', NT_REPORT, NT_VRAM),
  q('nt-batch', 'batches of 4', 'Training batch size', 'Netra-UGV', NT_REPORT, NT_VRAM),
  q('nt-gpu', '6 GB', 'Video memory of the training laptop', 'Netra-UGV', 'docs/WEIGHTS_AND_MODELS_TRAINING.md', 'RTX 4050 Laptop GPU (6GB VRAM)'),
  q('nt-keep', 'asking for exactly that', 'The line in the team README', 'Netra-UGV', 'README.md', 'Keep measured results separate from design targets'),
  n('nt-commits', '6 of 40', COMMITS_CLAIM, 'Netra-UGV', SHORTLOG),
  // Kavach-UPI
  q('kv-rule', 'one line', 'The rule that raises the shield', 'Kavach-UPI', EVAL, 'val shouldBeActive = upiOpen && screenShareActive'),
  q('kv-channels', 'four channels', 'Independent ways of noticing a shared screen', 'Kavach-UPI', EVAL, '// Four independent detection channels'),
  q('kv-idle', '3,000 ms', 'Time between checks when idle', 'Kavach-UPI', SERVICE, IDLE),
  q('kv-active', '1,000 ms', 'Time between checks during a payment', 'Kavach-UPI', SERVICE, IDLE),
  q('kv-clean', 'two clean checks', 'Checks needed before the shield drops', 'Kavach-UPI', SERVICE, 'if (consecutiveCleanChecks >= 2) {'),
  q('kv-depth', '15 levels', 'Deepest the screen is read', 'Kavach-UPI', VERIFIER, 'private const val MAX_DEPTH = 15'),
  q('kv-nodes', '200 nodes', 'Most screen elements read in one pass', 'Kavach-UPI', VERIFIER, 'private const val MAX_NODE_LIMIT = 200'),
  q('kv-window', '10 seconds', 'How far back usage events are read', 'Kavach-UPI', `${KV}/detection/MediaProjectionDetector.kt`, 'val startTime = currentTime - 10000'),
  q('kv-warning', 'warning text', 'What the voice says', 'Kavach-UPI', `${KV}/audio/WarningAudioPlayer.kt`, 'Attention! Kavach security shield is active.'),
  n('kv-commits', '11 of 12', COMMITS_CLAIM, 'Kavach-UPI', SHORTLOG),
  n('kv-lines', '1,822', 'Lines in the repository’s Kotlin files', 'Kavach-UPI', "git ls-files -z '*.kt' | xargs -0 cat | wc -l"),
  n('kv-apps', '7 payment apps', 'Payment apps it knows by package name', 'Kavach-UPI', 'Count the entries in upiPackages.', REGISTRY),
  n('kv-banks', '4 bank prefixes', 'Bank package prefixes it knows', 'Kavach-UPI', 'Count the entries in bankPackagePrefixes.', REGISTRY),
  // The archive
  q('ar-saans-rule', 'rejects any text containing a digit', 'The rule in the Saans README', 'Saans', 'README.md', 'The server rejects any text containing a raw digit'),
  q('ar-benchy', '143 tasks', 'SWE-bench Verified tasks in the standard suite', 'QEDCode-benchy', 'README.md', '| `swebench-verified-py` 1.0.0 | 143 |'),
  q('ar-companion', '17 tests', 'Attendance engine tests', 'companion.AI', 'README.md', '(17 tests)'),
  q('ar-fifa-ahead', '15 minutes', 'How far ahead the design forecasts', 'FIFA_NexusMatrix', 'README.md', '15 minutes in advance'),
  q('ar-sudo', '128 rays', 'Rays cast per frame', 'SUDO_SHOOT', 'README.md', 'casts **128 parallel rays**'),
  n('ar-saans', '167 tests', TEST_FUNCS, 'Saans', GREP_TESTS),
  n('ar-occasio', '111 tests', TEST_FUNCS, 'Occasio', GREP_TESTS),
  n('ar-fifa', '30 tests', TEST_FUNCS, 'FIFA_NexusMatrix', `${GREP_TESTS} (24) plus grep -hE 'it\\(|test\\(' frontend/src/__tests__/*.tsx | wc -l (6)`),
  n('ar-vocal', '18 tests', TEST_FUNCS, 'vocal-biomarker-edge', "git grep -hE '^\\s*(it|test)\\(' -- tests | wc -l"),
  n('ar-vocal-commits', '6 of 10', COMMITS_CLAIM, 'vocal-biomarker-edge', SHORTLOG),
  n('ar-omen', '510 lines', 'Lines in the fan control script and the installer', 'Hp-OMEN-cpu-fan-control', 'cat fancontrol.py install.sh | wc -l'),
  n('ar-terminal', '6 test scripts', 'Test scripts in the repository', 'MY_TERMINAL', 'ls tests/*.sh | wc -l'),
  n('ar-moneyball', '466 players', 'Players in the data file', 'MoneyBall-2.0', 'tail -n +2 players_data.csv | wc -l'),
  n('ar-ventoy', '24 icons', 'Icons in the theme', 'cool_ventoy', "git ls-files 'ventoy/theme/multiboot-toolkit/icons/*.png' | wc -l"),
  n('ar-agentskill', '10 of 10', COMMITS_CLAIM, 'QEDCode-AgentSkill', SHORTLOG),
  n('ar-leaselens', '14 of 14', COMMITS_CLAIM, 'LeaseLens', SHORTLOG),
  n('ar-trapsight', '11 of 22', COMMITS_CLAIM, 'TrapSight', SHORTLOG),
  n('ar-scopecreep', '14 of 25', COMMITS_CLAIM, 'ScopeCreep.ai', SHORTLOG),
  n('ar-roster', '8 of 8', COMMITS_CLAIM, 'RosterResilience', SHORTLOG),
  n('ar-silverlink', '9 of 13', COMMITS_CLAIM, 'silverlink', SHORTLOG),
  n('ar-guardian', '6 of 11', COMMITS_CLAIM, 'guardian_link', SHORTLOG),
  n('ar-aqua', '10 of 24', COMMITS_CLAIM, 'aqua-pulse', SHORTLOG),
  n('ar-vayu', '5 of 33', COMMITS_CLAIM, 'VayuGrid', SHORTLOG),
  n('ar-specrag', '6 of 17', COMMITS_CLAIM, 'specRAG', SHORTLOG),
  n('ar-goat', '17 of 51', COMMITS_CLAIM, 'ideation-goat', SHORTLOG),
];

const USER = `https://api.github.com/users/${OWNER}`;
const REPOS = `${USER}/repos?per_page=100`;
const { account, stars, profile } = github;

const api: ApiReceipt[] = [
  { id: 'gh-repos', kind: 'api', value: `${account.public_repos} public repositories`, claim: 'Public repositories on the account', repo: '', url: USER, field: 'public_repos' },
  { id: 'gh-originals', kind: 'api', value: `${account.originals}`, claim: 'Repositories I created, not forked', repo: '', url: REPOS, field: 'originals' },
  { id: 'gh-forks', kind: 'api', value: `${account.forks}`, claim: 'Repositories that are forks', repo: '', url: REPOS, field: 'forks' },
  { id: 'gh-stars', kind: 'api', value: `${account.originalStars} stars`, claim: 'Stars on the original repositories', repo: '', url: REPOS, field: 'originalStars' },
  { id: 'ar-ghostos', kind: 'api', value: `${stars['ghostos-x']} stars`, claim: 'Stars on GhostOS X', repo: 'ghostos-x', url: `https://api.github.com/repos/${OWNER}/ghostos-x`, field: 'stargazers_count' },
];

const NOTE = `Read from GitHub’s contribution calendar on ${formatDay(profile.readOn)}. The calendar moves every day and counts private work, so your browser cannot re-run this one.`;
const read = (id: string, value: string, claim: string): ReadReceipt => ({ id, kind: 'read', value, claim, repo: '', url: PROFILE_URL, note: NOTE });
const reads: ReadReceipt[] = [
  read('gh-contrib', `${profile.contributions} contributions`, 'Contributions in the last twelve months'),
  read('gh-private', `${profile.private}`, 'Of those, contributions to private repositories'),
  read('gh-days', `${profile.activeDays} days`, 'Days with at least one contribution'),
  read('gh-best', `${profile.bestDay}`, 'Contributions on the busiest day'),
];

/** Every number on the site, by id. */
export const receipts: Record<string, Receipt> = Object.fromEntries([...list, ...api, ...reads].map((r) => [r.id, r]));

export type ReceiptGroup = 'QEDCode' | 'FracSST-Mamba' | 'NETRA-UGV' | 'Kavach-UPI' | 'The archive' | 'My GitHub account';
export const RECEIPT_GROUPS: ReceiptGroup[] = ['QEDCode', 'FracSST-Mamba', 'NETRA-UGV', 'Kavach-UPI', 'The archive', 'My GitHub account'];

export function receiptGroup(r: Receipt): ReceiptGroup {
  const p = r.id.split('-')[0];
  return p === 'qed' ? 'QEDCode' : p === 'fs' ? 'FracSST-Mamba' : p === 'nt' ? 'NETRA-UGV' : p === 'kv' ? 'Kavach-UPI' : p === 'ar' ? 'The archive' : 'My GitHub account';
}

export const KIND_WORDS: Record<Receipt['kind'], string> = {
  quoted: 'Quoted from a file',
  counted: 'Counted by a command',
  computed: 'Worked out',
  api: 'Read from the GitHub API',
  read: 'Read by hand',
};
