import type { Room } from './types';

const GH = 'https://github.com/AdityaTummuri';

export const rooms: Room[] = [
  {
    slug: 'qedcode',
    title: 'QEDCode',
    look: 'grid',
    lead: 'QEDCode takes several candidate changes from a coding model, tests each one in a throw-away git worktree, and hands back the best verified one with a grade, a reason and a receipt that `qed verify` re-runs.',
    meta: 'Solo work, {qed-commits} commits, 20 to 23 Nov 2026. {qed-lines} lines of Python and JavaScript, Apache-2.0.',
    links: [
      { label: 'Open QEDCode on GitHub', href: `${GH}/QEDCode` },
      { label: 'The benchmark, QEDCode-benchy', href: `${GH}/QEDCode-benchy` },
      { label: 'The agent skill', href: `${GH}/QEDCode-AgentSkill` },
    ],
    row: {
      finding: 'Grades AI-written code changes from A to D and keeps a receipt anyone can re-run.',
      figure: 'qed-a',
      figureLabel: 'grade A results were right',
    },
    exhibit: {
      title: 'The task that fooled it',
      intro: 'This is {qed-hidden} from the repo’s bug zoo: “Please add a slugify(text) function to the text helpers: lowercase everything, turn spaces into dashes and drop punctuation.” Pick a candidate change and follow it through the checks.',
      label: 'The grade rules are a direct port of {qed-rule} in verify/grade.py. The task, the first candidate and the hidden test are the repo’s own files. The other three candidates were written for this page and are not recorded runs.',
    },
    story: [
      {
        heading: 'Why a grade',
        body: 'A wrong answer from a coding model looks as finished as a right one. QEDCode makes the change arrive with evidence: a test that failed before it, passes after it, and a full suite with nothing else broken. Less evidence earns a lower grade. I made the first commit at 01:21 IST on 20 Nov 2026.',
      },
      {
        heading: 'What the runs showed',
        body: 'On one laptop with {qed-gpu} of video memory, two small models and two small, easy suites, grade A was right {qed-a} times. Wrong changes that looked finished fell from {qed-silent-bare} to {qed-silent}. The number of tasks solved showed no significant difference. On a pilot of real issues from SWE-bench Verified, one attempt each, the 4B model solved {qed-swe-bare} alone and {qed-swe} through QEDCode.',
      },
      {
        heading: 'What got in the way',
        body: 'All three wrong A’s came from one under-specified task, the one above. I left its wording unchanged after seeing the result. The runs also found a real bug in QEDCode, a stale fail-before list, and `qed verify` is what caught it.',
      },
      {
        heading: 'What it can’t claim',
        body: 'After the fixes those runs led to, grade A was right {qed-after} times, and the 4B model solved fewer bug zoo tasks: {qed-zoo} through QEDCode against {qed-zoo-bare} alone. The suites are small and easy. The larger runs are still to come.',
      },
    ],
    description: 'QEDCode grades AI-written code changes from A to D and keeps a receipt anyone can re-run.',
  },
  {
    slug: 'fracsst-mamba',
    title: 'FracSST-Mamba',
    look: 'cloud',
    lead: 'FracSST-Mamba tells walking, sitting and falling apart from {fs-freq} continuous-wave radar. A fractional Fourier transform and synchrosqueezing sharpen the signal, then four bidirectional Mamba blocks read it.',
    meta: 'Team work, {fs-commits} commits are mine, 24 Jul to 29 Oct 2026. PyTorch, NumPy and MATLAB.',
    links: [{ label: 'Open FracSST-Mamba on GitHub', href: `${GH}/FracSST-Mamba` }],
    row: {
      finding: 'Tells walking, sitting and falling apart by radar, scored on people it never saw.',
      figure: 'fs-acc',
      figureLabel: 'on {fs-people} it never saw',
    },
    exhibit: {
      title: 'Question the confusion matrix',
      intro: '{fs-test} from {fs-people} the model never saw. Rows are what the person did, columns are what the model said. Pick a cell.',
      label: 'The counts are the {fs-matrix} in the repo’s results file, redrawn.',
    },
    story: [
      {
        heading: 'Why the score is lower',
        body: 'Radar returns carry a person’s gait and build. Split recordings at random and the same person lands in training and in the test, and reported accuracy passes {fs-leak}. Here the split is by person: {fs-train} to train, {fs-valpeople} to validate and {fs-people} to test, with nobody in two sets. On the people it never saw it got {fs-hits} right, which is {fs-acc}.',
      },
      {
        heading: 'How it reads the signal',
        body: 'The fractional transform has an angle, alpha, and the pipeline picks the one with the lowest order-three Rényi entropy, which is the sharpest view of that recording. The classifier that follows has {fs-params} parameters and takes about {fs-size}.',
      },
      {
        heading: 'What got in the way',
        body: 'Sitting and falling look alike to a radar. {fs-misses} misses are one of them called the other. Walking, with its steady rhythm, is the easy class.',
      },
      {
        heading: 'What it can’t claim',
        body: 'Validation accuracy was {fs-val} and the unseen people scored {fs-acc}, so expect a drop on anyone new. The data is one set, {fs-data} of {fs-subjects} from the University of Glasgow.',
      },
    ],
    description: 'Telling walking, sitting and falling apart by radar, scored on people the model never saw.',
  },
  {
    slug: 'netra-ugv',
    title: 'NETRA-UGV',
    look: 'tunnel',
    lead: 'NETRA-UGV is a vision-based navigation stack for an off-road ground vehicle, built by team KernelCrew for Smart India Hackathon 2026, problem SIH26126 from Bharat Electronics Limited. My part is the terrain model: training, ONNX export and the ROS 2 perception node.',
    meta: 'Team work, forked from [Lochan-B-07/Netra-UGV](https://github.com/Lochan-B-07/Netra-UGV). {nt-commits} commits are mine.',
    links: [
      { label: 'Open NETRA-UGV on GitHub', href: `${GH}/Netra-UGV` },
      { label: 'The team’s live dashboard', href: 'https://netraugv.vercel.app' },
    ],
    row: {
      finding: 'Marks the ground an off-road robot can drive on. The terrain model is my part of a team build.',
      figure: 'nt-miou',
      figureLabel: 'mIoU on RELLIS-3D validation',
    },
    exhibit: {
      title: 'What the robot sees, and what the model says',
      intro: 'Drag the handle, or use the arrow keys. On the left is the camera frame. On the right is the model’s output over it.',
      label: 'Both images are from the repo’s weights folder. The frame was saved inside a figure, so I cropped away the title and margin around the photograph. Frame from the RELLIS-3D dataset. The model has four classes and none of them is sky: it calls most of the sky an obstacle and one bright cloud mud and ground.',
    },
    story: [
      {
        heading: 'One laptop',
        body: 'I trained a BiSeNetV2 with {nt-params} parameters on {nt-pairs} image and mask pairs from RELLIS-3D, sorted into four classes: solid ground, pliant vegetation, mud and rigid obstacle. The laptop’s RTX 4050 has {nt-gpu} of video memory. With {nt-batch}, training used about {nt-vram}.',
      },
      {
        heading: 'What came out',
        body: 'It reaches {nt-miou} mIoU on RELLIS-3D validation. The ONNX file is {nt-size}, and its output differs from PyTorch by less than {nt-diff}. On that laptop’s GPU, ONNX Runtime took {nt-ms} for one test frame.',
      },
      {
        heading: 'So the robot never goes blind',
        body: 'The perception node tries TensorRT, then ONNX Runtime, then OpenCV, and last a plain colour heuristic. If the fast path is missing, something slower still answers.',
      },
      {
        heading: 'Measured, and planned',
        body: 'I added a section to the team README {nt-keep}: measured results kept apart from design targets. This page does the same. The Jetson speed target is left out, because the TensorRT engine in the repo is a stub.',
      },
    ],
    description: 'The terrain model in team KernelCrew’s off-road robot: what it measured, and what is still a target.',
  },
  {
    slug: 'kavach-upi',
    title: 'Kavach-UPI',
    look: 'calm',
    lead: 'Kavach-UPI is an on-device Android shield against screen-share payment scams. When a UPI app is open and the screen is being shared, an opaque overlay blocks touches and a voice warns in English or Hindi.',
    meta: '{kv-commits} commits are mine, 18 to 22 Jun 2026. Kotlin, {kv-lines} lines.',
    links: [{ label: 'Open Kavach-UPI on GitHub', href: `${GH}/Kavach-UPI` }],
    row: {
      finding: 'Covers the screen when a payment app is open while the phone is being shared.',
      figure: 'kv-active',
      figureLabel: 'between checks during a payment',
    },
    exhibit: {
      title: 'Two switches and one rule',
      intro: 'Turn both on and the shield goes up. Turn sharing off again and watch how long it waits.',
      label: 'The rule is {kv-rule} of the source. The timings and the warning are the source’s too. This is an explanation running in your browser.',
    },
    story: [
      {
        heading: 'The gap',
        body: 'A payment app runs in its own sandbox and cannot tell that the screen is being shared. Kavach watches from the system level, through Android’s accessibility service, for both things happening together.',
      },
      {
        heading: 'How it decides',
        body: 'It knows {kv-apps} by package name and {kv-banks}. {kv-channels} look for a shared screen, one of them by reading the last {kv-window} of usage events. Each pass reads at most {kv-nodes} and {kv-depth} deep. The shield needs {kv-clean} before it drops, so it does not flicker.',
      },
      {
        heading: 'The trade-off',
        body: 'An accessibility service can see everything on the screen. So the design keeps the work on the phone, limits how much is read, and the app’s manifest does not ask for internet access.',
      },
      {
        heading: 'What it can’t claim',
        body: 'It is a prototype with no automated tests.',
      },
    ],
    description: 'An on-device Android shield that covers the screen when a payment app is open while the phone is being shared.',
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

/** Fixed cycle: QEDCode, FracSST-Mamba, NETRA-UGV, Kavach-UPI. */
export function adjacentRooms(slug: string): { prev: Room; next: Room } | undefined {
  const i = rooms.findIndex((r) => r.slug === slug);
  if (i < 0) return undefined;
  return { prev: rooms[(i + rooms.length - 1) % rooms.length], next: rooms[(i + 1) % rooms.length] };
}
