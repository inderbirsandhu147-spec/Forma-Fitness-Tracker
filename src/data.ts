export type Muscle = {
  id: string;
  name: string;
  short: string;
  region: string;
  view: 'front' | 'back';
  functions: string;
  description: string;
};
export const muscles: Muscle[] = [
  {
    id: 'chest',
    name: 'Pectoralis major',
    short: 'Chest',
    region: 'Upper body · Chest',
    view: 'front',
    functions: 'Brings the arm across the body, rotates it inward, and assists shoulder flexion.',
    description:
      'The broad, fan-shaped muscle across the front of your chest. Its fibers run from the clavicle and sternum to the upper arm.',
  },
  {
    id: 'delts',
    name: 'Deltoid',
    short: 'Shoulders',
    region: 'Upper body · Shoulder',
    view: 'front',
    functions: 'Raises the arm; the front and rear portions assist forward and backward movement.',
    description: 'The three-part muscle that wraps around the shoulder joint.',
  },
  {
    id: 'biceps',
    name: 'Biceps brachii',
    short: 'Biceps',
    region: 'Upper body · Front arm',
    view: 'front',
    functions: 'Bends the elbow and turns the palm upward.',
    description: 'A two-headed muscle on the front of your upper arm.',
  },
  {
    id: 'triceps',
    name: 'Triceps brachii',
    short: 'Triceps',
    region: 'Upper body · Back arm',
    view: 'back',
    functions: 'Straightens the elbow and assists shoulder extension.',
    description: 'Three heads form the large muscle on the back of your upper arm.',
  },
  {
    id: 'forearms',
    name: 'Forearm muscle group',
    short: 'Forearms',
    region: 'Upper body · Forearm',
    view: 'front',
    functions: 'Flexes and extends the wrist and fingers and supports grip.',
    description: 'A grouped view of the wrist and finger flexors and extensors.',
  },
  {
    id: 'abs',
    name: 'Rectus abdominis',
    short: 'Abdominals',
    region: 'Core · Front trunk',
    view: 'front',
    functions: 'Flexes the trunk and helps control the pelvis.',
    description: 'Paired vertical muscles connected by the midline of the abdomen.',
  },
  {
    id: 'obliques',
    name: 'External oblique',
    short: 'Obliques',
    region: 'Core · Side trunk',
    view: 'front',
    functions: 'Rotates and bends the trunk and compresses the abdomen.',
    description: 'Superficial abdominal muscles that run diagonally along your sides.',
  },
  {
    id: 'serratus',
    name: 'Serratus anterior',
    short: 'Serratus',
    region: 'Upper body · Side ribs',
    view: 'front',
    functions: 'Moves the shoulder blade forward and helps rotate it upward.',
    description: 'Finger-like slips along the upper ribs, partly covered by the pectoral muscles.',
  },
  {
    id: 'quads',
    name: 'Quadriceps femoris',
    short: 'Quadriceps',
    region: 'Lower body · Front thigh',
    view: 'front',
    functions: 'Extends the knee. Rectus femoris also assists hip flexion.',
    description:
      'Four muscles: rectus femoris, vastus lateralis, vastus medialis, and the deeper vastus intermedius.',
  },
  {
    id: 'adductors',
    name: 'Hip adductor group',
    short: 'Adductors',
    region: 'Lower body · Inner thigh',
    view: 'front',
    functions: 'Brings the thigh toward the midline and helps stabilize the hip.',
    description:
      'The inner-thigh muscles, including adductor longus, magnus, brevis, and gracilis.',
  },
  {
    id: 'tibialis',
    name: 'Tibialis anterior',
    short: 'Tibialis',
    region: 'Lower body · Front shin',
    view: 'front',
    functions: 'Lifts the foot toward the shin and turns the sole inward.',
    description: 'Runs alongside the shin bone on the front of the lower leg.',
  },
  {
    id: 'traps',
    name: 'Trapezius',
    short: 'Trapezius',
    region: 'Upper body · Upper back',
    view: 'back',
    functions: 'Elevates, retracts, lowers, and upwardly rotates the shoulder blades.',
    description: 'A broad diamond-shaped muscle spanning the neck and upper back.',
  },
  {
    id: 'lats',
    name: 'Latissimus dorsi',
    short: 'Lats',
    region: 'Upper body · Back',
    view: 'back',
    functions: 'Draws the upper arm down and backward and rotates it inward.',
    description: 'Broad muscles on either side of the middle and lower back.',
  },
  {
    id: 'infraspinatus',
    name: 'Infraspinatus',
    short: 'Rotator cuff',
    region: 'Upper body · Shoulder blade',
    view: 'back',
    functions: 'Rotates the upper arm outward and helps stabilize the shoulder.',
    description: 'One of four rotator cuff muscles, covering the back of the shoulder blade.',
  },
  {
    id: 'erectors',
    name: 'Erector spinae',
    short: 'Spinal erectors',
    region: 'Core · Back',
    view: 'back',
    functions: 'Extends and laterally bends the spine and maintains upright posture.',
    description: 'Long columns of muscles running along either side of the spine.',
  },
  {
    id: 'glutes',
    name: 'Gluteus maximus',
    short: 'Glutes',
    region: 'Lower body · Hip',
    view: 'back',
    functions: 'Extends and externally rotates the hip.',
    description: 'The largest superficial muscle of the buttock, active in hip extension.',
  },
  {
    id: 'gluteMed',
    name: 'Gluteus medius',
    short: 'Side glutes',
    region: 'Lower body · Outer hip',
    view: 'back',
    functions: 'Moves the leg outward and stabilizes the pelvis.',
    description: 'A fan-shaped muscle on the outer hip, partly covered by gluteus maximus.',
  },
  {
    id: 'hamstrings',
    name: 'Hamstring group',
    short: 'Hamstrings',
    region: 'Lower body · Back thigh',
    view: 'back',
    functions: 'Bends the knee and extends the hip.',
    description:
      'Biceps femoris, semitendinosus, and semimembranosus run down the back of the thigh.',
  },
  {
    id: 'calves',
    name: 'Gastrocnemius & soleus',
    short: 'Calves',
    region: 'Lower body · Back lower leg',
    view: 'back',
    functions: 'Points the foot downward; gastrocnemius also assists knee flexion.',
    description: 'Gastrocnemius forms the two visible calf heads, with soleus underneath.',
  },
];
export type Exercise = {
  id: string;
  name: string;
  primary: string[];
  secondary: string[];
  equipment: string;
  level: string;
  type: string;
  place: string;
  sets: number;
  reps: string;
  instructions: string[];
  cue: string;
  metric?: 'duration' | 'distance';
  custom?: boolean;
};
const ex = (
  id: string,
  name: string,
  primary: string[],
  secondary: string[],
  equipment: string,
  level: string,
  type: string,
  place: string,
  instructions: string[],
  cue: string,
  sets = 3,
  reps = '8–12',
  metric?: 'duration' | 'distance',
): Exercise => ({
  id,
  name,
  primary,
  secondary,
  equipment,
  level,
  type,
  place,
  instructions,
  cue,
  sets,
  reps,
  metric,
});
export const exercises: Exercise[] = [
  ex(
    'bench',
    'Barbell bench press',
    ['chest'],
    ['triceps', 'delts'],
    'Barbell',
    'Intermediate',
    'Compound',
    'Gym',
    [
      'Lie on a bench with feet planted. Grip the bar slightly wider than shoulder width.',
      'Unrack with straight arms. Lower the bar under control toward your mid-chest.',
      'Press upward until your elbows straighten.',
    ],
    'Keep wrists stacked above elbows. Use safeties or a spotter.',
    3,
    '6–10',
  ),
  ex(
    'incline',
    'Incline dumbbell press',
    ['chest'],
    ['delts', 'triceps'],
    'Dumbbells',
    'Beginner',
    'Compound',
    'Gym',
    [
      'Set a bench to a low incline and hold dumbbells beside your chest.',
      'Press upward with forearms vertical.',
      'Lower slowly to a comfortable depth.',
    ],
    'Keep shoulders down and feet grounded.',
  ),
  ex(
    'pushup',
    'Push-up',
    ['chest'],
    ['triceps', 'delts', 'abs'],
    'Bodyweight',
    'Beginner',
    'Compound',
    'Home',
    [
      'Place hands just wider than shoulders and step into a plank.',
      'Bend the elbows and lower your chest as one unit.',
      'Press the floor away to return.',
    ],
    'Elevate your hands to make it easier.',
  ),
  ex(
    'fly',
    'Dumbbell floor fly',
    ['chest'],
    [],
    'Dumbbells',
    'Intermediate',
    'Isolation',
    'Home',
    [
      'Lie on the floor with dumbbells above your chest and softly bent elbows.',
      'Open your arms until upper arms gently touch the floor.',
      'Bring the weights together over your chest.',
    ],
    'Use a light load and a steady elbow angle.',
    3,
    '10–15',
  ),
  ex(
    'ohp',
    'Dumbbell shoulder press',
    ['delts'],
    ['triceps'],
    'Dumbbells',
    'Beginner',
    'Compound',
    'Home',
    [
      'Hold dumbbells at shoulder height.',
      'Press overhead within a comfortable range.',
      'Lower with control.',
    ],
    'Keep your ribs from flaring.',
  ),
  ex(
    'lateral',
    'Lateral raise',
    ['delts'],
    [],
    'Dumbbells',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Stand holding light dumbbells beside your hips.',
      'Raise arms out to the sides to shoulder height.',
      'Lower slowly.',
    ],
    'Lead with the elbows and avoid shrugging.',
    3,
    '12–15',
  ),
  ex(
    'curl',
    'Dumbbell curl',
    ['biceps'],
    ['forearms'],
    'Dumbbells',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Stand tall with palms forward.',
      'Bend your elbows to curl the weights.',
      'Lower until the arms are nearly straight.',
    ],
    'Keep upper arms still.',
    3,
    '10–15',
  ),
  ex(
    'triceps',
    'Cable triceps pushdown',
    ['triceps'],
    [],
    'Cable',
    'Beginner',
    'Isolation',
    'Gym',
    [
      'Stand at a high cable with elbows by your ribs.',
      'Extend your elbows to press the handle down.',
      'Return slowly without moving the upper arms.',
    ],
    'Keep shoulders relaxed.',
    3,
    '10–15',
  ),
  ex(
    'diamond',
    'Close-grip push-up',
    ['triceps'],
    ['chest', 'delts'],
    'Bodyweight',
    'Intermediate',
    'Compound',
    'Home',
    [
      'Set hands under your shoulders in a plank.',
      'Lower with elbows close to your torso.',
      'Press back up.',
    ],
    'Use a raised surface to reduce difficulty.',
  ),
  ex(
    'wrist',
    'Wrist curl',
    ['forearms'],
    [],
    'Dumbbells',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Rest forearms on your thighs with palms up and wrists free.',
      'Curl the dumbbells using only the wrists.',
      'Lower slowly.',
    ],
    'Use a controlled range.',
    3,
    '12–20',
  ),
  ex(
    'plank',
    'Forearm plank',
    ['abs'],
    ['obliques', 'serratus'],
    'Bodyweight',
    'Beginner',
    'Isometric',
    'Home',
    [
      'Place elbows beneath shoulders and extend your legs.',
      'Hold a straight line from head to heels.',
      'Breathe steadily and stop when you lose position.',
    ],
    'Brace your abdomen without holding your breath.',
    3,
    '30–45 sec',
    'duration',
  ),
  ex(
    'crunch',
    'Controlled crunch',
    ['abs'],
    [],
    'Bodyweight',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Lie on your back with knees bent.',
      'Curl the rib cage toward the pelvis to lift your shoulder blades.',
      'Lower slowly.',
    ],
    'Leave space between chin and chest.',
    3,
    '12–20',
  ),
  ex(
    'sideplank',
    'Side plank',
    ['obliques'],
    ['gluteMed', 'abs'],
    'Bodyweight',
    'Intermediate',
    'Isometric',
    'Home',
    [
      'Lie on your side with elbow under shoulder.',
      'Lift your hips and hold a straight line.',
      'Repeat on the other side.',
    ],
    'Keep hips stacked.',
    3,
    '20–40 sec',
    'duration',
  ),
  ex(
    'serratus',
    'Scapular push-up',
    ['serratus'],
    ['abs'],
    'Bodyweight',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Begin in a high plank with straight elbows.',
      'Let your chest settle between the shoulders.',
      'Push the floor away to spread the shoulder blades.',
    ],
    'Keep elbows straight.',
    3,
    '10–15',
  ),
  ex(
    'squat',
    'Barbell back squat',
    ['quads', 'glutes'],
    ['adductors', 'erectors'],
    'Barbell',
    'Intermediate',
    'Compound',
    'Gym',
    [
      'Set the bar across your upper back and brace.',
      'Sit down between your hips with knees tracking over toes.',
      'Stand by pushing through the whole foot.',
    ],
    'Use safeties and a depth you can control.',
    3,
    '6–10',
  ),
  ex(
    'goblet',
    'Goblet squat',
    ['quads'],
    ['glutes', 'adductors'],
    'Dumbbells',
    'Beginner',
    'Compound',
    'Home',
    [
      'Hold a dumbbell at your chest.',
      'Lower into a squat with heels grounded.',
      'Stand up smoothly.',
    ],
    'Let knees follow the direction of your toes.',
    3,
    '10–15',
  ),
  ex(
    'lunge',
    'Lateral lunge',
    ['adductors', 'quads'],
    ['glutes'],
    'Bodyweight',
    'Beginner',
    'Compound',
    'Home',
    [
      'Step wide to one side.',
      'Bend the stepping knee and send your hips back.',
      'Push back to center and change sides.',
    ],
    'Keep the other leg long and both feet grounded.',
  ),
  ex(
    'tibraise',
    'Wall tibialis raise',
    ['tibialis'],
    [],
    'Bodyweight',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Lean your back against a wall with feet slightly forward.',
      'Keeping heels down, lift toes toward your shins.',
      'Lower slowly.',
    ],
    'Move farther from the wall to increase difficulty.',
    3,
    '15–20',
  ),
  ex(
    'shrug',
    'Dumbbell shrug',
    ['traps'],
    ['forearms'],
    'Dumbbells',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Stand tall holding weights at your sides.',
      'Lift the shoulders toward the ears.',
      'Lower under control.',
    ],
    'Lift vertically without rolling shoulders.',
    3,
    '10–15',
  ),
  ex(
    'pulldown',
    'Lat pulldown',
    ['lats'],
    ['biceps', 'traps'],
    'Cable',
    'Beginner',
    'Compound',
    'Gym',
    [
      'Sit with thighs secured and grip the bar.',
      'Pull elbows down toward your sides.',
      'Return upward slowly.',
    ],
    'Bring the bar toward the upper chest without swinging.',
  ),
  ex(
    'row',
    'Single-arm dumbbell row',
    ['lats'],
    ['biceps', 'traps', 'infraspinatus'],
    'Dumbbells',
    'Beginner',
    'Compound',
    'Home',
    [
      'Support one hand on a sturdy surface and hinge at the hips.',
      'Pull the dumbbell toward your hip.',
      'Lower fully and repeat on the other side.',
    ],
    'Keep your torso steady.',
  ),
  ex(
    'rotation',
    'Band external rotation',
    ['infraspinatus'],
    [],
    'Resistance band',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Anchor a light band at elbow height.',
      'Keep elbow bent at 90 degrees by your side and rotate the hand outward.',
      'Return slowly.',
    ],
    'Use a comfortable range and keep the elbow still.',
    3,
    '12–15',
  ),
  ex(
    'bird',
    'Bird dog',
    ['erectors'],
    ['abs', 'glutes'],
    'Bodyweight',
    'Beginner',
    'Isometric',
    'Home',
    [
      'Start on hands and knees.',
      'Extend opposite arm and leg with your back level.',
      'Pause, return, and alternate.',
    ],
    'Imagine balancing a glass on your lower back.',
  ),
  ex(
    'rdl',
    'Romanian deadlift',
    ['hamstrings', 'glutes'],
    ['erectors', 'forearms'],
    'Barbell',
    'Intermediate',
    'Compound',
    'Gym',
    [
      'Stand holding a bar at thigh height, knees slightly bent.',
      'Push hips back, keeping the bar close to your legs.',
      'Stand when you reach your controlled hamstring stretch.',
    ],
    'Keep your back position steady.',
    3,
    '8–10',
  ),
  ex(
    'bridge',
    'Glute bridge',
    ['glutes'],
    ['hamstrings'],
    'Bodyweight',
    'Beginner',
    'Compound',
    'Home',
    [
      'Lie on your back with knees bent and feet flat.',
      'Push through your feet to lift your hips.',
      'Pause, then lower.',
    ],
    'Extend hips without arching your lower back.',
    3,
    '12–15',
  ),
  ex(
    'abduction',
    'Side-lying hip abduction',
    ['gluteMed'],
    [],
    'Bodyweight',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Lie on your side with hips stacked.',
      'Lift the upper leg without rolling backward.',
      'Lower slowly and repeat on the other side.',
    ],
    'Keep toes facing forward.',
    3,
    '12–20',
  ),
  ex(
    'legcurl',
    'Sliding leg curl',
    ['hamstrings'],
    ['glutes'],
    'Sliders',
    'Intermediate',
    'Isolation',
    'Home',
    [
      'Lie on your back with heels on sliders and hips lifted.',
      'Slowly extend the knees.',
      'Pull heels back toward you.',
    ],
    'Shorten the range if your hips drop.',
  ),
  ex(
    'calf',
    'Standing calf raise',
    ['calves'],
    [],
    'Bodyweight',
    'Beginner',
    'Isolation',
    'Home',
    [
      'Stand tall with a support nearby.',
      'Rise onto the balls of your feet.',
      'Pause and lower heels slowly.',
    ],
    'Avoid bouncing.',
    3,
    '12–20',
  ),
  ex(
    'walk',
    'Brisk walk',
    ['calves'],
    ['quads', 'glutes'],
    'Bodyweight',
    'Beginner',
    'Cardio',
    'Home',
    [
      'Walk at a comfortable, purposeful pace.',
      'Keep posture relaxed and let arms swing naturally.',
      'Slow down gradually to finish.',
    ],
    'Choose a pace that lets you speak in sentences.',
    1,
    '20–30 min',
    'distance',
  ),
];
export type SetLog = {
  id: string;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
  warmup: boolean;
  done: boolean;
  effort: string;
};
export type Entry = { id: string; exercise: Exercise; sets: SetLog[]; notes: string; rest: number };
export type Workout = {
  id: string;
  name: string;
  date: string;
  entries: Entry[];
  notes: string;
  sample?: boolean;
  started: number;
};
export type Routine = { id: string; name: string; entries: Entry[] };
export type Plan = { id: string; week: number; day: number; routineId: string };
export type Data = {
  workouts: Workout[];
  active: Workout | null;
  routines: Routine[];
  custom: Exercise[];
  plan: Plan[];
  restDays: string[];
};
export const uid = () => Math.random().toString(36).slice(2, 10);
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const newSet = (e: Exercise): SetLog => ({
  id: uid(),
  reps: e.metric ? 0 : Number(e.reps.match(/\d+/)?.[0] || 10),
  weight: 0,
  duration: e.metric ? 30 : 0,
  distance: 0,
  warmup: false,
  done: false,
  effort: '',
});
export const entry = (e: Exercise): Entry => ({
  id: uid(),
  exercise: structuredClone(e),
  sets: Array.from({ length: e.sets }, () => newSet(e)),
  notes: '',
  rest: 90,
});
export const newWorkout = (name = 'Today’s workout', entries: Entry[] = []): Workout => ({
  id: uid(),
  name,
  date: localDate(),
  entries: structuredClone(entries).map((e) => ({
    ...e,
    id: uid(),
    sets: e.sets.map((s) => ({ ...s, id: uid(), done: false })),
  })),
  notes: '',
  started: Date.now(),
});
export function initialData(): Data {
  const today = new Date();
  const workouts = [1, 3, 5, 9, 12, 16, 20].map((ago, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - ago);
    const ids = i % 2 === 0 ? ['bench', 'row', 'ohp', 'curl'] : ['squat', 'rdl', 'calf', 'plank'];
    return {
      ...newWorkout(i % 2 === 0 ? 'Upper body foundations' : 'Lower body & core'),
      date: localDate(date),
      sample: true,
      entries: ids.map((id) => {
        const e = entry(exercises.find((x) => x.id === id)!);
        e.sets = e.sets.map((s) => ({
          ...s,
          done: true,
          weight:
            id === 'bench'
              ? 62 - i * 2
              : id === 'squat'
                ? 60
                : id === 'rdl'
                  ? 50
                  : id === 'row'
                    ? 18
                    : id === 'curl'
                      ? 10
                      : 0,
        }));
        return e;
      }),
    };
  });
  const routines = [
    {
      id: 'upper',
      name: 'Upper body foundations',
      entries: ['bench', 'row', 'ohp', 'curl'].map((id) =>
        entry(exercises.find((e) => e.id === id)!),
      ),
    },
    {
      id: 'lower',
      name: 'Lower body & core',
      entries: ['squat', 'rdl', 'calf', 'plank'].map((id) =>
        entry(exercises.find((e) => e.id === id)!),
      ),
    },
  ];
  return {
    workouts,
    active: null,
    routines,
    custom: [],
    plan: [
      { id: uid(), week: 1, day: 0, routineId: 'upper' },
      { id: uid(), week: 1, day: 2, routineId: 'lower' },
      { id: uid(), week: 1, day: 4, routineId: 'upper' },
    ],
    restDays: ['1-1', '1-3', '1-6'],
  };
}
export function totals(workouts: Workout[]) {
  const out: Record<string, { primary: number; secondary: number; total: number }> = {};
  muscles.forEach((m) => (out[m.id] = { primary: 0, secondary: 0, total: 0 }));
  workouts.forEach((w) =>
    w.entries.forEach((e) => {
      const n = e.sets.filter((s) => s.done && !s.warmup).length;
      e.exercise.primary.forEach((id) => {
        if (out[id]) {
          out[id].primary += n;
          out[id].total += n;
        }
      });
      e.exercise.secondary.forEach((id) => {
        if (out[id] && !e.exercise.primary.includes(id)) {
          out[id].secondary += n;
          out[id].total += n * 0.5;
        }
      });
    }),
  );
  return out;
}
export const heatColor = (n: number) =>
  n === 0 ? '#e1e6e3' : n < 4 ? '#bdd5cb' : n < 8 ? '#83b5a1' : n < 12 ? '#4b917b' : '#226b58';
