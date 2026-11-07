'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Info,
  Layers,
  Plus,
  Search,
  Settings2,
  Timer,
  Trash2,
  X,
  Download,
  Upload,
  Play,
  RotateCcw,
} from 'lucide-react';
import Anatomy from './anatomy';
import {
  Data,
  Exercise,
  Workout,
  Routine,
  Entry,
  muscles,
  exercises,
  initialData,
  totals,
  heatColor,
  entry,
  newWorkout,
  localDate,
  uid,
} from './data';
import { useCloudSync } from './sync';
import {
  Modal,
  Library,
  ExerciseRow,
  ExerciseDetail,
  CustomExercise,
  SessionEditor,
} from './components';
const KEY = 'forma.training.v1';
const dateLabel = (s: string) =>
  new Date(s + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' });
const countSets = (w: Workout) =>
  w.entries.reduce((n, e) => n + e.sets.filter((s) => s.done && !s.warmup).length, 0);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
type Tab = 'Atlas' | 'Workouts' | 'Routines' | 'Progress';
export default function Forma() {
  const [data, setData] = useState<Data | null>(null),
    [tab, setTab] = useState<Tab>('Atlas'),
    [selected, setSelected] = useState('chest'),
    [view, setView] = useState<'front' | 'back'>('front'),
    [period, setPeriod] = useState('week'),
    [mode, setMode] = useState('cumulative'),
    [heat, setHeat] = useState(true),
    [rangeStart, setRangeStart] = useState(localDate()),
    [rangeEnd, setRangeEnd] = useState(localDate()),
    [search, setSearch] = useState(''),
    [place, setPlace] = useState('All'),
    [panelTab, setPanelTab] = useState('Exercises'),
    [modal, setModal] = useState(''),
    [detail, setDetail] = useState<Exercise | null>(null),
    [toast, setToast] = useState(''),
    [storageError, setStorageError] = useState(''),
    [draft, setDraft] = useState<Workout | null>(null),
    [draftKind, setDraftKind] = useState<'routine' | 'history'>('history'),
    [addTarget, setAddTarget] = useState<'active' | 'draft'>('active'),
    [replaceId, setReplaceId] = useState<string | null>(null),
    [historySearch, setHistorySearch] = useState(''),
    [historyDate, setHistoryDate] = useState(''),
    [month, setMonth] = useState(new Date().getMonth()),
    [year, setYear] = useState(new Date().getFullYear()),
    [progressExercise, setProgressExercise] = useState('bench'),
    [week, setWeek] = useState(1),
    [restEnd, setRestEnd] = useState<number | null>(null),
    [clock, setClock] = useState(Date.now());
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      const parsed = saved ? JSON.parse(saved) : initialData();
      if (!validBackup(parsed)) throw new Error('Invalid saved data');
      setData(parsed);
    } catch {
      setStorageError('Saved data could not be read. Export your current data before refreshing.');
      setData(initialData());
    }
    const end = localStorage.getItem(KEY + '.timer');
    if (end) setRestEnd(Number(end));
  }, []);
  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch {
        setStorageError(
          'Browser storage is unavailable or full. Export a backup to keep your changes.',
        );
      }
    }
  }, [data]);
  const sync = useCloudSync(data, (d) => setData(d), validBackup);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (restEnd === null) {
      localStorage.removeItem(KEY + '.timer');
      return;
    }
    localStorage.setItem(KEY + '.timer', String(restEnd));
    const t = setInterval(() => {
      setClock(Date.now());
      if (Date.now() >= restEnd) {
        setRestEnd(null);
        setToast('Rest complete. Ready for your next set.');
      }
    }, 500);
    return () => clearInterval(t);
  }, [restEnd]);
  const allExercises = useMemo(() => [...exercises, ...(data?.custom || [])], [data?.custom]);
  const filteredWorkouts = useMemo(() => {
    if (!data) return [];
    const today = new Date(),
      start = new Date(today);
    start.setHours(0, 0, 0, 0);
    if (period === 'week') start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    else if (period === 'month') start.setDate(1);
    const startS = period === 'custom' ? rangeStart : localDate(start),
      endS = period === 'custom' ? rangeEnd : localDate(today);
    return data.workouts.filter((w) => w.date >= startS && w.date <= endS);
  }, [data, period, rangeStart, rangeEnd]);
  const activity = totals(filteredWorkouts),
    recentTotals = Object.fromEntries(
      muscles.map((m) => {
        const dates = filteredWorkouts
          .filter((w) =>
            w.entries.some(
              (e) =>
                (e.exercise.primary.includes(m.id) || e.exercise.secondary.includes(m.id)) &&
                e.sets.some((s) => s.done && !s.warmup),
            ),
          )
          .map((w) => w.date)
          .sort();
        const last = dates.at(-1);
        const age = last
          ? Math.floor(
              (new Date(localDate() + 'T12:00:00').getTime() -
                new Date(last + 'T12:00:00').getTime()) /
                86400000,
            )
          : 999;
        return [m.id, { total: age <= 1 ? 12 : age <= 3 ? 8 : age <= 7 ? 4 : age < 999 ? 1 : 0 }];
      }),
    );
  if (!data)
    return (
      <div className="loading">
        <span className="brand">
          forma<span>®</span>
        </span>
        <p>Opening your training atlas…</p>
      </div>
    );
  const update = (fn: (d: Data) => Data) => setData((d) => (d ? fn(d) : d));
  const muscle = muscles.find((m) => m.id === selected)!;
  const selectedTotal = activity[selected];
  const chooseMuscle = (id: string) => {
    setSelected(id);
    const m = muscles.find((m) => m.id === id);
    if (m) setView(m.view);
    setSearch('');
  };
  const notify = (text: string) => setToast(text);
  const startWorkout = (routine?: Routine) => {
    if (data.active) {
      setTab('Workouts');
      notify('Your active workout is ready to continue.');
      return;
    }
    update((d) => ({ ...d, active: newWorkout(routine?.name, routine?.entries) }));
    setTab('Workouts');
  };
  const addExercise = (e: Exercise, target = addTarget) => {
    const added = entry(e);
    if (target === 'draft' && draft) {
      setDraft({
        ...draft,
        entries: replaceId
          ? draft.entries.map((x) => (x.id === replaceId ? added : x))
          : [...draft.entries, added],
      });
      setModal('edit');
    } else {
      update((d) => {
        const active = d.active || newWorkout();
        return {
          ...d,
          active: {
            ...active,
            entries: replaceId
              ? active.entries.map((x) => (x.id === replaceId ? added : x))
              : [...active.entries, added],
          },
        };
      });
      if (replaceId) setModal('');
      notify(`${e.name} added to your workout`);
    }
    setReplaceId(null);
  };
  const openLibrary = (target: 'active' | 'draft' = 'active', replace: string | null = null) => {
    setAddTarget(target);
    setReplaceId(replace);
    setModal('library');
  };
  const openDetail = (e: Exercise) => {
    setDetail(e);
    setModal('exercise');
  };
  const startRest = (seconds: number) => {
    if (seconds) {
      setClock(Date.now());
      setRestEnd(Date.now() + seconds * 1000);
    }
  };
  const saveDraft = () => {
    if (!draft || !draft.name.trim() || !draft.entries.length) return;
    if (draftKind === 'history' && (!draft.date || draft.date > localDate())) {
      notify('Choose today or an earlier workout date.');
      return;
    }
    if (draftKind === 'routine') {
      update((d) => ({
        ...d,
        routines: d.routines.some((r) => r.id === draft.id)
          ? d.routines.map((r) =>
              r.id === draft.id
                ? { id: draft.id, name: draft.name, entries: structuredClone(draft.entries) }
                : r,
            )
          : [
              ...d.routines,
              { id: draft.id, name: draft.name, entries: structuredClone(draft.entries) },
            ],
      }));
      notify('Routine saved. Previous workouts are unchanged.');
    } else {
      update((d) => ({
        ...d,
        workouts: d.workouts.map((w) => (w.id === draft.id ? { ...draft, sample: false } : w)),
      }));
      notify('Workout updated. Your training map is up to date.');
    }
    setModal('');
    setDraft(null);
  };
  const editRoutine = (r?: Routine) => {
    setDraft(
      r
        ? { ...newWorkout(r.name), id: r.id, entries: structuredClone(r.entries) }
        : newWorkout('Untitled routine'),
    );
    setDraftKind('routine');
    setModal('edit');
  };
  const finishWorkout = () => {
    if (!data.active) return;
    if (!data.active.date || data.active.date > localDate()) {
      notify('Choose today or an earlier date for a completed workout.');
      return;
    }
    if (!data.active.entries.some((e) => e.sets.some((s) => s.done))) {
      notify('Complete at least one set before saving this workout.');
      return;
    }
    update((d) => ({
      ...d,
      workouts: [{ ...d.active!, name: d.active!.name.trim() || 'Workout' }, ...d.workouts],
      active: null,
    }));
    setRestEnd(null);
    setTab('Atlas');
    setPeriod('week');
    notify('Workout saved. Your body map has been updated.');
  };
  const selectedExercises = allExercises.filter(
    (e) => e.primary.includes(selected) && (place === 'All' || e.place === place),
  );
  const recent = filteredWorkouts
    .filter((w) =>
      w.entries.some(
        (e) => e.exercise.primary.includes(selected) || e.exercise.secondary.includes(selected),
      ),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const workingSets = filteredWorkouts.reduce((sum, w) => sum + countSets(w), 0),
    trained = Object.values(activity).filter((a) => a.total > 0).length;
  const progressE = allExercises.find((e) => e.id === progressExercise) || allExercises[0];
  const progressRows = [...data.workouts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((w) =>
      w.entries
        .filter((e) => e.exercise.id === progressE.id)
        .map((e) => ({
          date: w.date,
          sets: e.sets.filter((s) => s.done && !s.warmup),
          sample: w.sample,
        })),
    )
    .filter((r) => r.sets.length);
  const progressUnit =
    progressE.metric === 'distance'
      ? 'km'
      : progressE.metric === 'duration'
        ? 'sec'
        : progressRows.some((r) => r.sets.some((s) => s.weight > 0))
          ? 'kg'
          : 'reps';
  const progressValue = (row: (typeof progressRows)[number]) =>
    Math.max(
      0,
      ...row.sets.map((s) =>
        progressE.metric === 'distance'
          ? s.distance
          : progressE.metric === 'duration'
            ? s.duration
            : progressUnit === 'kg'
              ? s.weight
              : s.reps,
      ),
    );
  const progressMax = Math.max(1, ...progressRows.map(progressValue));
  const history = [...data.workouts]
    .filter(
      (w) =>
        (!historyDate || w.date === historyDate) &&
        `${w.name} ${w.entries.map((e) => e.exercise.name).join(' ')}`
          .toLowerCase()
          .includes(historySearch.toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const monthFirst = new Date(year, month, 1),
    monthDays = new Date(year, month + 1, 0).getDate(),
    monthOffset = (monthFirst.getDay() + 6) % 7;
  const sampleCount = data.workouts.filter((w) => w.sample).length;
  const closeModal = () => {
    setModal('');
    setReplaceId(null);
  };
  return (
    <div className="app-shell">
      <header className="header">
        <button className="brand" onClick={() => setTab('Atlas')} aria-label="Forma home">
          <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
            <path d="M5 26L16 5L27 26M10 19H22" stroke="currentColor" strokeWidth="2.3" />
            <path d="M13 26L21 11" stroke="currentColor" strokeWidth="2.3" />
          </svg>
          forma<span>®</span>
        </button>
        <nav aria-label="Main navigation">
          {(['Atlas', 'Workouts', 'Routines', 'Progress'] as Tab[]).map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
              {t === 'Workouts' && data.active && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Data and settings"
            onClick={() => setModal('settings')}
          >
            <Settings2 size={19} />
          </button>
          <button className="primary" onClick={() => startWorkout()}>
            <Plus size={17} />
            <span>{data.active ? 'Continue workout' : 'Start workout'}</span>
          </button>
        </div>
      </header>
      {storageError && (
        <div className="error-banner" role="alert">
          {storageError}
        </div>
      )}
      <main>
        {tab === 'Atlas' && (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">The training atlas</div>
                <h1>Your body. Your training.</h1>
                <p>Explore a muscle. Find your movement. Make it count.</p>
              </div>
              <div className="search-wrap">
                <div className="search-field">
                  <Search size={17} />
                  <input
                    aria-label="Search muscles"
                    placeholder="Find a muscle…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <kbd>⌕</kbd>
                </div>
                {search && (
                  <div className="search-results">
                    {muscles
                      .filter((m) =>
                        (m.name + ' ' + m.short).toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((m) => (
                        <button key={m.id} onClick={() => chooseMuscle(m.id)}>
                          <span>
                            {m.name}
                            <small>{m.region}</small>
                          </span>
                          <ArrowUpRight size={16} />
                        </button>
                      ))}
                    {!muscles.some((m) =>
                      (m.name + ' ' + m.short).toLowerCase().includes(search.toLowerCase()),
                    ) && <p>No muscles found.</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="atlas-toolbar">
              <div className="toolbar-title">
                <Activity size={17} />
                <strong>Training activity</strong>
                <button
                  className={'switch ' + (heat ? 'on' : '')}
                  aria-label="Show training heatmap"
                  aria-pressed={heat}
                  onClick={() => setHeat(!heat)}
                >
                  <i />
                </button>
              </div>
              <div className="toolbar-controls">
                <select
                  aria-label="Training period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="custom">Custom range</option>
                </select>
                <span className="control-divider" />
                <div className="segmented small">
                  <button
                    className={mode === 'cumulative' ? 'active' : ''}
                    onClick={() => setMode('cumulative')}
                  >
                    Cumulative
                  </button>
                  <button
                    className={mode === 'recent' ? 'active' : ''}
                    onClick={() => setMode('recent')}
                  >
                    Recent activity
                  </button>
                </div>
              </div>
            </div>
            <div className="compact-legend">
              <div>
                <span>
                  {mode === 'cumulative' ? 'Weighted working sets' : 'Days since training'}
                </span>
                <div className="compact-scale">
                  {[0, 1, 4, 8, 12].map((n, i) => (
                    <span key={n}>
                      <i style={{ background: heatColor(n) }} />
                      {
                        (mode === 'cumulative'
                          ? ['0', '<4', '<8', '<12', '12+']
                          : ['None', '8+', '4–7', '2–3', '0–1'])[i]
                      }
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="icon-button"
                aria-label="How the map works"
                onClick={() => setModal('calculation')}
              >
                <Info size={18} />
              </button>
              {sampleCount > 0 && (
                <button className="text-button" onClick={() => setModal('clear-sample')}>
                  Sample data · clear
                </button>
              )}
            </div>
            {period === 'custom' && (
              <div className="range-controls">
                <label>
                  From
                  <input
                    type="date"
                    value={rangeStart}
                    max={rangeEnd}
                    onChange={(e) => setRangeStart(e.target.value)}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={rangeEnd}
                    min={rangeStart}
                    onChange={(e) => setRangeEnd(e.target.value)}
                  />
                </label>
                {rangeStart > rangeEnd && <span>Choose an end date after the start date.</span>}
              </div>
            )}
            <div className="atlas-layout">
              <aside className="overview">
                <div className="eyebrow">
                  {period === 'week'
                    ? 'Your week'
                    : period === 'month'
                      ? 'Your month'
                      : 'Selected period'}
                </div>
                <div className="summary-stat">
                  <strong>{filteredWorkouts.length.toString().padStart(2, '0')}</strong>
                  <span>workouts logged</span>
                </div>
                <div className="mini-stat">
                  <span>Working sets</span>
                  <strong>{workingSets}</strong>
                </div>
                <div className="mini-stat">
                  <span>Muscles trained</span>
                  <strong>
                    {trained}
                    <small> / {muscles.length}</small>
                  </strong>
                </div>
                <div className="week-strip">
                  {days.map((d, i) => {
                    const dt = new Date();
                    dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7) + i);
                    const n = data.workouts.filter((w) => w.date === localDate(dt)).length;
                    return (
                      <div key={d}>
                        <span>{d[0]}</span>
                        <button
                          aria-label={`View workouts on ${localDate(dt)}`}
                          className={n ? 'has-workout' : ''}
                          onClick={() => {
                            setHistoryDate(localDate(dt));
                            setTab('Progress');
                          }}
                        >
                          {n ? <Check size={13} /> : <i />}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="overview-note">
                  <span className="small-line" />
                  <h3>Build with intention.</h3>
                  <p>Your map tells the story of the work you’ve recorded.</p>
                </div>
                <div className="map-legend">
                  <strong>
                    {mode === 'cumulative' ? 'Weighted working sets' : 'Most recent training'}
                  </strong>
                  <div className="legend-swatches">
                    {[0, 1, 4, 8, 12].map((n) => (
                      <span key={n} style={{ background: heatColor(n) }} />
                    ))}
                  </div>
                  <div className="legend-labels">
                    <span>{mode === 'cumulative' ? '0' : 'None'}</span>
                    <span>{mode === 'cumulative' ? '1–3' : '8+ d'}</span>
                    <span>{mode === 'cumulative' ? '4–7' : '4–7 d'}</span>
                    <span>{mode === 'cumulative' ? '8–11' : '2–3 d'}</span>
                    <span>{mode === 'cumulative' ? '12+' : '0–1 d'}</span>
                  </div>
                  <button className="text-button muted" onClick={() => setModal('calculation')}>
                    <Info size={13} />
                    How the map works
                  </button>
                </div>
                {sampleCount > 0 && (
                  <div className="sample-note">
                    <span className="sample-dot" />
                    Includes sample workouts
                    <button onClick={() => setModal('clear-sample')}>Clear sample data</button>
                  </div>
                )}
              </aside>
              <Anatomy
                view={view}
                setView={setView}
                selected={selected}
                onSelect={setSelected}
                totals={activity}
                colors={mode === 'recent' ? recentTotals : undefined}
                heat={heat}
              />
              <aside className="inspector">
                <div className="inspector-label">
                  <span className="selected-dot" />
                  Muscle in focus
                  <Layers size={15} />
                </div>
                <h2>{muscle.name}</h2>
                <span className="region">{muscle.region}</span>
                <p className="description">{muscle.description}</p>
                <details className="function-details">
                  <summary>Main functions</summary>
                  <p>{muscle.functions}</p>
                </details>
                <div className="muscle-total">
                  <div>
                    <strong>{selectedTotal.total}</strong>
                    <span>weighted sets</span>
                  </div>
                  <span>
                    {period === 'week'
                      ? 'This week'
                      : period === 'month'
                        ? 'This month'
                        : 'Selected dates'}
                    <small>
                      {selectedTotal.primary} primary + {selectedTotal.secondary} × ½ secondary
                    </small>
                  </span>
                </div>
                <div className="panel-tabs">
                  {['Exercises', 'Activity'].map((t) => (
                    <button
                      key={t}
                      className={panelTab === t ? 'active' : ''}
                      onClick={() => setPanelTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {panelTab === 'Exercises' ? (
                  <>
                    <div className="inspector-filters">
                      <div className="segmented small">
                        {['All', 'Gym', 'Home'].map((p) => (
                          <button
                            key={p}
                            className={place === p ? 'active' : ''}
                            onClick={() => setPlace(p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <button
                        className="icon-button"
                        aria-label="Filter exercises"
                        onClick={() => {
                          setAddTarget('active');
                          setModal('muscle-library');
                        }}
                      >
                        <Settings2 size={16} />
                      </button>
                    </div>
                    {selectedExercises.slice(0, 3).map((e) => (
                      <ExerciseRow
                        key={e.id}
                        exercise={e}
                        onOpen={(e) => {
                          setAddTarget('active');
                          setReplaceId(null);
                          openDetail(e);
                        }}
                        onAdd={(e) => addExercise(e, 'active')}
                      />
                    ))}
                    {!selectedExercises.length && (
                      <p className="empty-small">
                        No {place.toLowerCase()} exercises for this muscle yet. Add a custom
                        movement.
                      </p>
                    )}
                    <button
                      className="text-button browse"
                      onClick={() => {
                        setAddTarget('active');
                        setModal('muscle-library');
                      }}
                    >
                      Explore all exercises <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="list-heading">Recent sessions</div>
                    {recent.slice(0, 4).map((w) => (
                      <button
                        className="recent-row"
                        key={w.id}
                        onClick={() => {
                          setDraft(structuredClone(w));
                          setDraftKind('history');
                          setModal('edit');
                        }}
                      >
                        <span>
                          {w.name}
                          <small>
                            {dateLabel(w.date)}
                            {w.sample ? ' · Sample' : ''}
                          </small>
                        </span>
                        <ArrowUpRight size={15} />
                      </button>
                    ))}
                    {!recent.length && (
                      <p className="empty-small">
                        No recorded activity in this period. Add an exercise and complete a set to
                        begin.
                      </p>
                    )}
                    <button
                      className="text-button browse"
                      onClick={() => {
                        const e = allExercises.find((e) => e.primary.includes(selected));
                        if (e) setProgressExercise(e.id);
                        setTab('Progress');
                      }}
                    >
                      View exercise progress
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </aside>
            </div>
            <footer className="atlas-footer">
              <span>
                <span className="live-dot" />
                {storageError ? 'Changes not saved' : 'Saved on this device'}
              </span>
              <span>A little more aware. A little stronger.</span>
              <a
                href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-2-naming-skeletal-muscles"
                target="_blank"
                rel="noreferrer"
              >
                Anatomy reference <ArrowUpRight size={12} />
              </a>
            </footer>
          </>
        )}
        {tab === 'Workouts' && (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">One set at a time</div>
                <h1>{data.active ? 'Today’s session' : 'Ready when you are.'}</h1>
                <p>
                  {data.active
                    ? 'Your workout saves automatically as you go.'
                    : 'Start a fresh session or pick up a saved routine.'}
                </p>
              </div>
              {data.active && (
                <button className="primary" onClick={finishWorkout}>
                  Finish workout
                  <Check size={17} />
                </button>
              )}
            </div>
            {data.active ? (
              <div className="workout-layout">
                <div className="workout-main">
                  <SessionEditor
                    workout={data.active}
                    onChange={(w) => update((d) => ({ ...d, active: w }))}
                    history={data.workouts}
                    onLibrary={() => openLibrary()}
                    onReplace={(id) => openLibrary('active', id)}
                    onRest={startRest}
                  />
                  <div className="session-actions">
                    <button className="text-button danger" onClick={() => setModal('discard')}>
                      Discard session
                    </button>
                    <button
                      className="secondary"
                      onClick={() => {
                        const r = {
                          id: uid(),
                          name: data.active!.name,
                          entries: structuredClone(data.active!.entries).map((e) => ({
                            ...e,
                            sets: e.sets.map((s) => ({ ...s, done: false })),
                          })),
                        };
                        update((d) => ({ ...d, routines: [...d.routines, r] }));
                        notify('Session saved as a reusable routine');
                      }}
                    >
                      Save as routine
                    </button>
                  </div>
                </div>
                <aside className="session-aside">
                  <Timer size={25} strokeWidth={1.2} />
                  <h3>Make room for rest.</h3>
                  <p>A rest timer starts when you complete a set. Adjust it per exercise.</p>
                  <div className="mini-stat">
                    <span>Exercises</span>
                    <strong>{data.active.entries.length}</strong>
                  </div>
                  <div className="mini-stat">
                    <span>Completed working sets</span>
                    <strong>{countSets(data.active)}</strong>
                  </div>
                  <p className="muted small-copy">
                    Only checked working sets contribute to the map once you finish the session.
                  </p>
                </aside>
              </div>
            ) : (
              <div className="start-layout">
                <div className="start-session">
                  <Dumbbell size={42} strokeWidth={1} />
                  <h2>A blank page. A new session.</h2>
                  <p>Build your workout around how you want to move today.</p>
                  <button className="primary" onClick={() => startWorkout()}>
                    <Plus size={17} />
                    Start empty workout
                  </button>
                </div>
                <div>
                  <h3>From your routines</h3>
                  {data.routines.map((r) => (
                    <button className="routine-start" key={r.id} onClick={() => startWorkout(r)}>
                      <span>
                        {r.name}
                        <small>{r.entries.length} exercises</small>
                      </span>
                      <ArrowRight size={20} />
                    </button>
                  ))}
                  {!data.routines.length && <p>Create your first routine in the Routines tab.</p>}
                </div>
              </div>
            )}
          </>
        )}
        {tab === 'Routines' && (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">A little structure</div>
                <h1>A rhythm that works for you.</h1>
                <p>Reusable sessions, with space for life in between.</p>
              </div>
              <button className="primary" onClick={() => editRoutine()}>
                <Plus size={17} />
                New routine
              </button>
            </div>
            <div className="routines-list">
              {data.routines.map((r, i) => (
                <article key={r.id} className="routine-card">
                  <span className="routine-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{r.name}</h2>
                    <p>
                      {r.entries.length} exercises ·{' '}
                      {r.entries.reduce((n, e) => n + e.sets.length, 0)} planned sets
                    </p>
                    <div className="routine-muscles">
                      {Array.from(new Set(r.entries.flatMap((e) => e.exercise.primary)))
                        .slice(0, 5)
                        .map((id) => (
                          <span className="tag" key={id}>
                            {muscles.find((m) => m.id === id)?.short}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="routine-actions">
                    <button className="primary" onClick={() => startWorkout(r)}>
                      <Play size={15} />
                      Start
                    </button>
                    <button className="secondary" onClick={() => editRoutine(r)}>
                      Edit
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Delete ${r.name}`}
                      onClick={() => {
                        setDraft({ ...newWorkout(r.name), id: r.id });
                        setModal('delete-routine');
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
              {!data.routines.length && (
                <div className="empty">
                  <BookOpen />
                  <h3>Your first routine starts here</h3>
                  <p>Add exercises and set a repeatable starting point.</p>
                </div>
              )}
            </div>
            <div className="section-heading">
              <div>
                <h2>Your training plan</h2>
                <p>Planned sessions stay separate from completed history.</p>
              </div>
              <select
                aria-label="Plan week"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
              </select>
            </div>
            <div className="plan-grid">
              {days.map((day, i) => {
                const p = data.plan.find((p) => p.week === week && p.day === i),
                  r = data.routines.find((r) => r.id === p?.routineId),
                  isRest = data.restDays.includes(`${week}-${i}`);
                return (
                  <div className="plan-day" key={day}>
                    <span>{day}</span>
                    <select
                      aria-label={`Week ${week} ${day} plan`}
                      value={r?.id || (isRest ? 'rest' : '')}
                      onChange={(e) => {
                        const v = e.target.value;
                        update((d) => ({
                          ...d,
                          plan: [
                            ...d.plan.filter((p) => !(p.week === week && p.day === i)),
                            ...(v && v !== 'rest'
                              ? [{ id: uid(), week, day: i, routineId: v }]
                              : []),
                          ],
                          restDays: [
                            ...d.restDays.filter((x) => x !== `${week}-${i}`),
                            ...(v === 'rest' ? [`${week}-${i}`] : []),
                          ],
                        }));
                      }}
                    >
                      <option value="">Unplanned</option>
                      <option value="rest">Rest day</option>
                      {data.routines.map((r) => (
                        <option value={r.id} key={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    {r ? (
                      <>
                        <small>{r.entries.length} exercises</small>
                        <button className="text-button" onClick={() => startWorkout(r)}>
                          Start session
                          <ArrowRight size={13} />
                        </button>
                      </>
                    ) : (
                      <p>{isRest ? 'Space to reset.' : 'An open day.'}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {tab === 'Progress' && (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">The work adds up</div>
                <h1>Your training, over time.</h1>
                <p>A record of your effort, one session at a time.</p>
              </div>
              <span className="history-total">{data.workouts.length} recorded sessions</span>
            </div>
            <div className="progress-layout">
              <section className="progress-chart">
                <div className="section-heading">
                  <div>
                    <h2>Exercise progress</h2>
                    <p>
                      Best{' '}
                      {progressE.metric === 'distance'
                        ? 'distance (km)'
                        : progressE.metric === 'duration'
                          ? 'duration (seconds)'
                          : progressUnit === 'kg'
                            ? 'working-set weight (kg)'
                            : 'working-set reps'}{' '}
                      per session
                    </p>
                  </div>
                  <select
                    aria-label="Progress exercise"
                    value={progressExercise}
                    onChange={(e) => setProgressExercise(e.target.value)}
                  >
                    {allExercises.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                {progressRows.length ? (
                  <>
                    <div className="chart-record">
                      <strong>
                        {Math.max(...progressRows.map(progressValue))}
                        <small>{progressUnit}</small>
                      </strong>
                      <span>
                        Personal best
                        {progressRows.some((r) => r.sample) ? ' · includes sample history' : ''}
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 640 185"
                      className="line-chart"
                      role="img"
                      aria-label={`Progress for ${progressE.name}: ${progressRows.map((r) => `${dateLabel(r.date)} ${progressValue(r)}`).join(', ')}`}
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <g key={n}>
                          <line
                            x1="35"
                            x2="620"
                            y1={20 + n * 45}
                            y2={20 + n * 45}
                            stroke="#e3e7e1"
                          />
                          <text x="0" y={24 + n * 45}>
                            {Math.round(progressMax * (1 - n / 3))}
                          </text>
                        </g>
                      ))}
                      <polyline
                        points={progressRows
                          .map(
                            (r, i) =>
                              `${45 + i * (560 / Math.max(1, progressRows.length - 1))},${155 - (progressValue(r) / progressMax) * 135}`,
                          )
                          .join(' ')}
                        fill="none"
                        stroke="#3c8069"
                        strokeWidth="2.5"
                      />
                      {progressRows.map((r, i) => (
                        <g key={i}>
                          <circle
                            cx={45 + i * (560 / Math.max(1, progressRows.length - 1))}
                            cy={155 - (progressValue(r) / progressMax) * 135}
                            r="4"
                            fill="#3c8069"
                          >
                            <title>
                              {dateLabel(r.date)} · {progressValue(r)}
                            </title>
                          </circle>
                          {(i === 0 || i === progressRows.length - 1) && (
                            <text
                              x={45 + i * (560 / Math.max(1, progressRows.length - 1))}
                              y="181"
                              textAnchor="middle"
                            >
                              {dateLabel(r.date)}
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                    <details>
                      <summary>View progress data</summary>
                      <table className="progress-data">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Best value</th>
                            <th>Working sets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progressRows.map((r, i) => (
                            <tr key={i}>
                              <td>
                                {dateLabel(r.date)}
                                {r.sample ? ' · Sample' : ''}
                              </td>
                              <td>{progressValue(r)}</td>
                              <td>{r.sets.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </details>
                  </>
                ) : (
                  <div className="empty">
                    <Activity />
                    <h3>Your progress starts with a session</h3>
                    <p>Complete and save a workout containing this exercise.</p>
                  </div>
                )}
              </section>
              <section className="muscle-summary">
                <h2>Muscle activity</h2>
                <p>All-time weighted working sets</p>
                {Object.entries(totals(data.workouts))
                  .sort((a, b) => b[1].total - a[1].total)
                  .filter(([, v]) => v.total > 0)
                  .slice(0, 7)
                  .map(([id, value]) => (
                    <button
                      key={id}
                      className="muscle-bar-row"
                      onClick={() => {
                        chooseMuscle(id);
                        setPanelTab('Activity');
                        setTab('Atlas');
                        setPeriod('custom');
                        setRangeStart(
                          [...data.workouts].map((w) => w.date).sort()[0] || localDate(),
                        );
                        setRangeEnd(localDate());
                      }}
                    >
                      <span>{muscles.find((m) => m.id === id)?.short}</span>
                      <div>
                        <i
                          style={{
                            width: `${Math.min(100, (value.total / Math.max(...Object.values(totals(data.workouts)).map((v) => v.total))) * 100)}%`,
                          }}
                        />
                      </div>
                      <strong>{value.total}</strong>
                    </button>
                  ))}
                {!data.workouts.length && <p>No recorded training yet.</p>}
              </section>
            </div>
            <div className="history-layout">
              <aside className="calendar">
                <div className="calendar-head">
                  <button
                    className="icon-button"
                    aria-label="Previous month"
                    onClick={() => {
                      const d = new Date(year, month - 1);
                      setMonth(d.getMonth());
                      setYear(d.getFullYear());
                    }}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <strong>
                    {monthFirst.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </strong>
                  <button
                    className="icon-button"
                    aria-label="Next month"
                    onClick={() => {
                      const d = new Date(year, month + 1);
                      setMonth(d.getMonth());
                      setYear(d.getFullYear());
                    }}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
                <div className="calendar-grid">
                  {days.map((d) => (
                    <span key={d}>{d[0]}</span>
                  ))}
                  {Array.from({ length: monthOffset }, (_, i) => (
                    <i key={'blank' + i} />
                  ))}
                  {Array.from({ length: monthDays }, (_, i) => {
                    const date = localDate(new Date(year, month, i + 1)),
                      has = data.workouts.some((w) => w.date === date);
                    return (
                      <button
                        key={i}
                        aria-label={`${date}${has ? ', workout logged' : ''}`}
                        className={`${has ? 'logged' : ''} ${historyDate === date ? 'chosen' : ''}`}
                        onClick={() => setHistoryDate(historyDate === date ? '' : date)}
                      >
                        {i + 1}
                        {has && <i />}
                      </button>
                    );
                  })}
                </div>
                <p>
                  <span className="live-dot" />
                  Workout logged
                </p>
                {historyDate && (
                  <button className="text-button" onClick={() => setHistoryDate('')}>
                    Clear date filter
                    <X size={14} />
                  </button>
                )}
              </aside>
              <section className="history-list">
                <div className="section-heading">
                  <h2>Workout history</h2>
                  <div className="search-field">
                    <Search size={16} />
                    <input
                      aria-label="Search workout history"
                      placeholder="Search sessions or exercises…"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                    />
                  </div>
                </div>
                {history.map((w) => (
                  <article key={w.id} className="history-row">
                    <div className="history-date">
                      <strong>{new Date(w.date + 'T12:00:00').getDate()}</strong>
                      <span>
                        {new Date(w.date + 'T12:00:00').toLocaleDateString('en', {
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div>
                      <h3>
                        {w.name}
                        {w.sample && <span className="sample-badge">Sample</span>}
                      </h3>
                      <p>
                        {w.entries.length} exercises · {countSets(w)} working sets
                      </p>
                    </div>
                    <div className="history-actions">
                      <button
                        className="text-button"
                        onClick={() => {
                          setDraft(structuredClone(w));
                          setDraftKind('history');
                          setModal('edit');
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Duplicate ${w.name}`}
                        onClick={() => {
                          if (data.active) {
                            setTab('Workouts');
                            notify(
                              'Finish or discard your active workout before duplicating a session.',
                            );
                            return;
                          }
                          update((d) => ({ ...d, active: newWorkout(w.name, w.entries) }));
                          setTab('Workouts');
                          notify('Copied as a new session. Check each set as you complete it.');
                        }}
                      >
                        <RotateCcw size={17} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Delete workout ${w.name}`}
                        onClick={() => {
                          setDraft(structuredClone(w));
                          setModal('delete-workout');
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
                {!history.length && (
                  <div className="empty">
                    <CalendarDays />
                    <h3>No sessions found</h3>
                    <p>Try a different search or log your first workout.</p>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
      {data.active && tab !== 'Workouts' && (
        <button className="active-workout" onClick={() => setTab('Workouts')}>
          <span className="live-dot" />
          <span>
            Workout in progress
            <small>{data.active.entries.length} exercises · saved automatically</small>
          </span>
          <ArrowRight size={19} />
        </button>
      )}
      {restEnd && (
        <div className="rest-toast" role="status">
          <Timer size={20} />
          <div>
            <small>Rest timer</small>
            <strong>
              {Math.floor(Math.max(0, restEnd - clock) / 60000)}:
              {String(Math.floor(Math.max(0, (restEnd - clock) % 60000) / 1000)).padStart(2, '0')}
            </strong>
          </div>
          <button className="text-button" onClick={() => setRestEnd(restEnd + 30000)}>
            +30s
          </button>
          <button
            className="icon-button"
            aria-label="Stop rest timer"
            onClick={() => setRestEnd(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
      {modal && (
        <Modal
          title={
            modal === 'exercise'
              ? detail?.name || 'Exercise'
              : modal === 'library' || modal === 'muscle-library'
                ? replaceId
                  ? 'Replace exercise'
                  : 'Exercise library'
                : modal === 'custom'
                  ? 'Create an exercise'
                  : modal === 'edit'
                    ? draftKind === 'routine'
                      ? 'Edit routine'
                      : 'Edit workout'
                    : modal === 'settings'
                      ? 'Your data & preferences'
                      : modal === 'calculation'
                        ? 'A transparent training map'
                        : modal === 'clear-sample'
                          ? 'Clear sample workouts?'
                          : modal === 'discard'
                            ? 'Discard this session?'
                            : modal === 'delete-routine'
                              ? 'Delete this routine?'
                              : 'Delete this workout?'
          }
          onClose={closeModal}
          wide={['library', 'muscle-library', 'edit'].includes(modal)}
        >
          {(modal === 'library' || modal === 'muscle-library') && (
            <Library
              exercises={allExercises}
              muscle={modal === 'muscle-library' ? selected : undefined}
              onOpen={openDetail}
              onAdd={(e) => addExercise(e)}
              onCustom={() => setModal('custom')}
            />
          )}
          {modal === 'exercise' && detail && (
            <ExerciseDetail
              key={detail.id}
              exercise={detail}
              routines={data.routines}
              buttonLabel={
                addTarget === 'draft'
                  ? 'Add to this ' + (draftKind === 'routine' ? 'routine' : 'workout')
                  : replaceId
                    ? 'Replace exercise'
                    : 'Add to today’s workout'
              }
              onAdd={(e) => addExercise(e)}
              onRoutine={(id, e) => {
                update((d) => ({
                  ...d,
                  routines: d.routines.map((r) =>
                    r.id === id ? { ...r, entries: [...r.entries, entry(e)] } : r,
                  ),
                }));
                notify('Exercise added to routine');
              }}
            />
          )}
          {modal === 'custom' && (
            <CustomExercise
              onSave={(e) => {
                update((d) => ({ ...d, custom: [...d.custom, e] }));
                notify('Custom exercise saved to your library.');
                setModal('library');
              }}
            />
          )}
          {modal === 'edit' && draft && (
            <>
              <SessionEditor
                workout={draft}
                onChange={setDraft}
                history={data.workouts}
                plan={draftKind === 'routine'}
                onLibrary={() => openLibrary('draft')}
                onReplace={(id) => openLibrary('draft', id)}
                onRest={() => {}}
              />
              <button
                className="primary full"
                disabled={!draft.name.trim() || !draft.entries.length || !draft.date}
                onClick={saveDraft}
              >
                Save {draftKind === 'routine' ? 'routine' : 'changes'}
                <Check size={17} />
              </button>
            </>
          )}
          {modal === 'calculation' && (
            <div className="calculation">
              <p>
                The map shows <strong>recorded training activity</strong>. It does not measure
                growth, readiness, or recovery.
              </p>
              <h3>Cumulative training</h3>
              <p>
                Each completed working set contributes{' '}
                <strong>1 set to every primary muscle</strong> and{' '}
                <strong>0.5 to every secondary muscle</strong>. Warm-ups and unchecked sets
                contribute zero. Planned and active workouts are excluded until saved as completed
                sessions.
              </p>
              <p>
                The same fixed thresholds apply to every muscle, regardless of period: 0, 1–3.5,
                4–7.5, 8–11.5, and 12+ weighted sets. Fractional totals fall in the corresponding
                interval.
              </p>
              <h3>Recent activity</h3>
              <p>
                Colors show the age of each muscle’s latest logged working set within the selected
                period: today or yesterday, 2–3 days, 4–7 days, or 8+ days. Untrained muscles stay
                gray. Exact cumulative totals remain in the inspector.
              </p>
              <h3>Anatomy</h3>
              <p>
                The map is a simplified superficial anatomical atlas. Paired sides and some related
                muscles are grouped. Zoom in for smaller regions such as serratus anterior,
                infraspinatus, and tibialis anterior. It is not a clinical or deep-layer anatomy
                model.
              </p>
              <a
                href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-2-naming-skeletal-muscles"
                target="_blank"
                rel="noreferrer"
              >
                Anatomy reference: OpenStax, Anatomy & Physiology 2e ↗
              </a>
            </div>
          )}
          {modal === 'settings' && (
            <>
              <h3>Your training belongs to you.</h3>
              <p>
                Workouts, routines, plans, and custom exercises are stored in this browser on this
                device. They stay on this device unless you sign in to cloud sync below. Export a
                backup before clearing browser data.
              </p>
              <div className="settings-actions">
                {sync.user ? (
                  <button className="secondary" onClick={() => void sync.signOut()}>
                    Sign out of cloud sync
                  </button>
                ) : (
                  <button
                    className="secondary"
                    disabled={!sync.authReady}
                    onClick={() => void sync.signIn()}
                  >
                    Sign in with Google to sync
                  </button>
                )}
              </div>
              <p className="small-copy muted">
                {sync.user
                  ? `Signed in as ${sync.user.email ?? 'your account'}. ${
                      sync.status === 'synced'
                        ? 'Synced.'
                        : sync.status === 'syncing'
                          ? 'Syncing…'
                          : ''
                    }`
                  : 'Sign in on each device with the same Google account to share your data.'}
                {sync.message ? ` ${sync.message}` : ''}
              </p>
              <div className="settings-actions">
                <button
                  className="secondary"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ version: 1, data }, null, 2)], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `forma-backup-${localDate()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    notify('Backup exported');
                  }}
                >
                  <Download size={16} />
                  Export backup
                </button>
                <label className="secondary import-label">
                  <Upload size={16} />
                  Import backup
                  <input
                    type="file"
                    accept="application/json"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const imported = JSON.parse(await file.text());
                        if (imported.version !== 1 || !validBackup(imported.data))
                          throw new Error();
                        const d = imported.data as Data;
                        update((current) => ({
                          ...current,
                          workouts: [
                            ...current.workouts,
                            ...d.workouts.filter(
                              (w) => !current.workouts.some((x) => x.id === w.id),
                            ),
                          ],
                          routines: [
                            ...current.routines,
                            ...d.routines.filter(
                              (w) => !current.routines.some((x) => x.id === w.id),
                            ),
                          ],
                          custom: [
                            ...current.custom,
                            ...d.custom.filter((w) => !current.custom.some((x) => x.id === w.id)),
                          ],
                          plan: [
                            ...current.plan,
                            ...d.plan.filter(
                              (p) =>
                                !current.plan.some((x) => x.week === p.week && x.day === p.day),
                            ),
                          ],
                          restDays: Array.from(new Set([...current.restDays, ...d.restDays])),
                          active: current.active || d.active,
                        }));
                        notify('Backup merged. Existing records were preserved.');
                      } catch {
                        notify('This file is not a valid Forma backup. No data was changed.');
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
              <p className="small-copy muted">
                Imports add records with new IDs and preserve existing records. An active session is
                restored only when none is currently open.
              </p>
              {sampleCount > 0 && (
                <button className="text-button danger" onClick={() => setModal('clear-sample')}>
                  Clear {sampleCount} sample workouts
                </button>
              )}
              <hr />
              <p className="small-copy">
                Units: kilograms, kilometers, and seconds. Anatomy illustrations are static;
                exercise videos are not included.
              </p>
            </>
          )}
          {['clear-sample', 'discard', 'delete-routine', 'delete-workout'].includes(modal) && (
            <>
              <p>
                {modal === 'clear-sample'
                  ? 'The example workout history will be removed. Your own workouts, active session, routines, and plan will stay.'
                  : modal === 'discard'
                    ? 'The current active workout will be removed. Your completed workout history will stay.'
                    : modal === 'delete-routine'
                      ? 'This routine and its planned sessions will be removed. Completed workout records will stay.'
                      : 'This workout will be removed from history and muscle activity totals.'}
              </p>
              <div className="confirm-actions">
                <button className="secondary" onClick={closeModal}>
                  Keep it
                </button>
                <button
                  className="primary danger-button"
                  onClick={() => {
                    if (modal === 'clear-sample')
                      update((d) => ({ ...d, workouts: d.workouts.filter((w) => !w.sample) }));
                    else if (modal === 'discard') {
                      update((d) => ({ ...d, active: null }));
                      setRestEnd(null);
                    } else if (modal === 'delete-routine')
                      update((d) => ({
                        ...d,
                        routines: d.routines.filter((r) => r.id !== draft?.id),
                        plan: d.plan.filter((p) => p.routineId !== draft?.id),
                      }));
                    else
                      update((d) => ({
                        ...d,
                        workouts: d.workouts.filter((w) => w.id !== draft?.id),
                      }));
                    closeModal();
                    notify('Removed. Your training data is up to date.');
                  }}
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
function validBackup(d: unknown): boolean {
  if (!d || typeof d !== 'object') return false;
  const x = d as Data;
  const str = (v: unknown) => typeof v === 'string';
  const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  const ex = (e: Exercise) =>
    e &&
    str(e.id) &&
    str(e.name) &&
    str(e.equipment) &&
    str(e.level) &&
    str(e.type) &&
    str(e.place) &&
    str(e.reps) &&
    str(e.cue) &&
    num(e.sets) &&
    Array.isArray(e.primary) &&
    e.primary.every((id) => muscles.some((m) => m.id === id)) &&
    Array.isArray(e.secondary) &&
    e.secondary.every((id) => muscles.some((m) => m.id === id)) &&
    Array.isArray(e.instructions) &&
    e.instructions.every(str);
  const entries = (es: Entry[]) =>
    Array.isArray(es) &&
    es.every(
      (e) =>
        str(e.id) &&
        ex(e.exercise) &&
        str(e.notes) &&
        num(e.rest) &&
        Array.isArray(e.sets) &&
        e.sets.every(
          (s) =>
            str(s.id) &&
            ['reps', 'weight', 'duration', 'distance'].every((k) => num(s[k as keyof typeof s])) &&
            typeof s.done === 'boolean' &&
            typeof s.warmup === 'boolean' &&
            str(s.effort),
        ),
    );
  const workout = (w: Workout) =>
    w &&
    str(w.id) &&
    str(w.name) &&
    str(w.date) &&
    /^\d{4}-\d{2}-\d{2}$/.test(w.date) &&
    num(w.started) &&
    str(w.notes) &&
    entries(w.entries);
  return (
    Array.isArray(x.workouts) &&
    x.workouts.every(workout) &&
    (!x.active || workout(x.active)) &&
    Array.isArray(x.routines) &&
    x.routines.every((r) => str(r.id) && str(r.name) && entries(r.entries)) &&
    Array.isArray(x.custom) &&
    x.custom.every(ex) &&
    Array.isArray(x.plan) &&
    x.plan.every((p) => str(p.id) && str(p.routineId) && num(p.week) && num(p.day) && p.day <= 6) &&
    Array.isArray(x.restDays) &&
    x.restDays.every(str)
  );
}
