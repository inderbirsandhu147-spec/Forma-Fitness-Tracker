'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import {
  X,
  Plus,
  Search,
  Dumbbell,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Timer,
} from 'lucide-react';
import { Body } from './anatomy';
import { Exercise, Entry, Workout, Routine, SetLog, muscles, newSet, uid, localDate } from './data';
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => {
      d?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={wide ? 'modal wide' : 'modal'}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-content">{children}</div>
    </dialog>
  );
}
export function ExerciseRow({
  exercise,
  onOpen,
  onAdd,
}: {
  exercise: Exercise;
  onOpen: (e: Exercise) => void;
  onAdd: (e: Exercise) => void;
}) {
  return (
    <div className="exercise-row">
      <button className="exercise-title" onClick={() => onOpen(exercise)}>
        <span className="exercise-glyph">
          <Dumbbell size={22} strokeWidth={1.3} />
        </span>
        <span>
          <strong>{exercise.name}</strong>
          <small>
            {exercise.equipment} <i>·</i> {exercise.level}
          </small>
        </span>
      </button>
      <button
        className="add-round"
        aria-label={`Add ${exercise.name} to workout`}
        onClick={() => onAdd(exercise)}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
export function Library({
  exercises,
  muscle,
  onOpen,
  onAdd,
  onCustom,
}: {
  exercises: Exercise[];
  muscle?: string;
  onOpen: (e: Exercise) => void;
  onAdd: (e: Exercise) => void;
  onCustom: () => void;
}) {
  const [search, setSearch] = useState(''),
    [place, setPlace] = useState('All'),
    [equipment, setEquipment] = useState('All'),
    [level, setLevel] = useState('All'),
    [type, setType] = useState('All'),
    [target, setTarget] = useState(muscle || 'All');
  const filtered = exercises.filter(
    (e) =>
      (target === 'All' || e.primary.includes(target) || e.secondary.includes(target)) &&
      e.name.toLowerCase().includes(search.toLowerCase()) &&
      (place === 'All' || e.place === place) &&
      (equipment === 'All' || e.equipment === equipment) &&
      (level === 'All' || e.level === level) &&
      (type === 'All' || e.type === type),
  );
  return (
    <>
      <div className="search-field">
        <Search size={17} />
        <input
          aria-label="Search exercises"
          placeholder="Find an exercise…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="filter-row">
        <select
          aria-label="Muscle filter"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="All">All muscles</option>
          {muscles.map((m) => (
            <option key={m.id} value={m.id}>
              {m.short}
            </option>
          ))}
        </select>
        <select
          aria-label="Training location"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        >
          {['All', 'Gym', 'Home'].map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'Gym & home' : v}
            </option>
          ))}
        </select>
        <select
          aria-label="Equipment filter"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
        >
          <option value="All">All equipment</option>
          {Array.from(new Set(exercises.map((e) => e.equipment))).map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          aria-label="Difficulty filter"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'All levels' : v}
            </option>
          ))}
        </select>
        <select
          aria-label="Exercise type filter"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {['All', 'Compound', 'Isolation', 'Isometric', 'Cardio'].map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'All types' : v}
            </option>
          ))}
        </select>
      </div>
      <div className="list-heading">
        <span>{filtered.length} exercises</span>
        <button className="text-button" onClick={onCustom}>
          <Plus size={15} />
          Create custom
        </button>
      </div>
      {filtered.map((e) => (
        <ExerciseRow key={e.id} exercise={e} onOpen={onOpen} onAdd={onAdd} />
      ))}
      {!filtered.length && (
        <div className="empty">
          <Search />
          <h3>No exercises match</h3>
          <p>Try another muscle or clear a filter.</p>
        </div>
      )}
    </>
  );
}
export function ExerciseDetail({
  exercise,
  routines,
  onAdd,
  onRoutine,
  buttonLabel = 'Add to today’s workout',
}: {
  exercise: Exercise;
  routines: Routine[];
  buttonLabel?: string;
  onAdd: (e: Exercise) => void;
  onRoutine: (id: string, e: Exercise) => void;
}) {
  const [sets, setSets] = useState(exercise.sets),
    [reps, setReps] = useState(exercise.reps),
    [routine, setRoutine] = useState(routines[0]?.id || '');
  const chosen = { ...exercise, sets, reps };
  const m = muscles.find((m) => m.id === exercise.primary[0]);
  const muscleTotals = Object.fromEntries(
    muscles.map((m) => [
      m.id,
      { total: exercise.primary.includes(m.id) ? 12 : exercise.secondary.includes(m.id) ? 4 : 0 },
    ]),
  );
  return (
    <>
      <div className="exercise-demo">
        <Body
          view={m?.view || 'front'}
          selected=""
          onSelect={() => {}}
          totals={muscleTotals}
          mini
        />
        <div>
          <span className="eyebrow">Muscle focus</span>
          <h3>{exercise.name}</h3>
          <p>Static anatomical illustration</p>
          <span className="tag">{exercise.type}</span>
          <span className="tag">{exercise.level}</span>
        </div>
      </div>
      <div className="detail-grid">
        <div>
          <small>Primary muscles</small>
          <p>{exercise.primary.map((id) => muscles.find((m) => m.id === id)?.name).join(', ')}</p>
        </div>
        <div>
          <small>Secondary muscles</small>
          <p>
            {exercise.secondary.map((id) => muscles.find((m) => m.id === id)?.short).join(', ') ||
              'None assigned'}
          </p>
        </div>
        <div>
          <small>Equipment</small>
          <p>{exercise.equipment}</p>
        </div>
        <div>
          <small>Location</small>
          <p>{exercise.place}</p>
        </div>
      </div>
      <h3>How to perform</h3>
      <ol className="instructions">
        {exercise.instructions.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ol>
      <div className="cue">
        <span>Technique cue</span>
        <p>{exercise.cue}</p>
      </div>
      <h3>Your starting point</h3>
      <p className="muted">Adjust to your experience and available load.</p>
      <div className="fields">
        <label>
          Sets
          <input
            type="number"
            min="1"
            max="20"
            value={sets}
            onChange={(e) => setSets(Math.max(1, Math.min(20, Number(e.target.value))))}
          />
        </label>
        <label>
          {exercise.metric ? 'Time / distance target' : 'Repetition range'}
          <input value={reps} onChange={(e) => setReps(e.target.value)} />
        </label>
      </div>
      <button className="primary full" onClick={() => onAdd(chosen)}>
        <Plus size={17} /> {buttonLabel}
      </button>
      <div className="inline-form">
        <select
          aria-label="Saved routine"
          value={routine}
          onChange={(e) => setRoutine(e.target.value)}
        >
          <option value="">Choose a routine</option>
          {routines.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button
          className="secondary"
          disabled={!routine}
          onClick={() => onRoutine(routine, chosen)}
        >
          Add to routine
        </button>
      </div>
    </>
  );
}
export function CustomExercise({ onSave }: { onSave: (e: Exercise) => void }) {
  const [primary, setPrimary] = useState<string[]>([]),
    [secondary, setSecondary] = useState<string[]>([]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (!primary.length) return;
        onSave({
          id: uid(),
          name: String(f.get('name')).trim(),
          primary,
          secondary: secondary.filter((id) => !primary.includes(id)),
          equipment: String(f.get('equipment')),
          level: String(f.get('level')),
          type: String(f.get('type')),
          place: String(f.get('place')),
          sets: Number(f.get('sets')),
          reps: String(f.get('reps')),
          instructions: String(f.get('instructions')).split('\n').filter(Boolean),
          cue: String(f.get('cue')),
          custom: true,
          metric: (String(f.get('metric')) || undefined) as Exercise['metric'],
        });
      }}
    >
      <label>
        Name
        <input name="name" required maxLength={90} placeholder="e.g. Banded chest press" />
      </label>
      <div className="fields">
        <label>
          Equipment
          <input name="equipment" required defaultValue="Bodyweight" />
        </label>
        <label>
          Location
          <select name="place">
            <option>Home</option>
            <option>Gym</option>
          </select>
        </label>
      </div>
      <div className="fields">
        <label>
          Difficulty
          <select name="level">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Type
          <select name="type">
            <option>Compound</option>
            <option>Isolation</option>
            <option>Isometric</option>
            <option>Cardio</option>
          </select>
        </label>
        <label>
          Track
          <select name="metric">
            <option value="">Reps & weight</option>
            <option value="duration">Duration</option>
            <option value="distance">Duration & distance</option>
          </select>
        </label>
      </div>
      <label>
        Primary muscles <small>(choose at least one)</small>
      </label>
      <div className="muscle-chips">
        {muscles.map((m) => (
          <button
            type="button"
            key={m.id}
            aria-pressed={primary.includes(m.id)}
            className={primary.includes(m.id) ? 'chosen' : ''}
            onClick={() =>
              setPrimary((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))
            }
          >
            {m.short}
          </button>
        ))}
      </div>
      <label>Secondary muscles</label>
      <div className="muscle-chips">
        {muscles
          .filter((m) => !primary.includes(m.id))
          .map((m) => (
            <button
              type="button"
              key={m.id}
              aria-pressed={secondary.includes(m.id)}
              className={secondary.includes(m.id) ? 'chosen' : ''}
              onClick={() =>
                setSecondary((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))
              }
            >
              {m.short}
            </button>
          ))}
      </div>
      <div className="fields">
        <label>
          Starting sets
          <input name="sets" type="number" min="1" max="20" defaultValue="3" required />
        </label>
        <label>
          Rep / time range
          <input name="reps" defaultValue="8–12" required />
        </label>
      </div>
      <label>
        Instructions <small>(one step per line)</small>
        <textarea name="instructions" rows={4} required />
      </label>
      <label>
        Technique cue
        <input name="cue" required />
      </label>
      <button className="primary full" disabled={!primary.length}>
        Save custom exercise <Check size={17} />
      </button>
    </form>
  );
}
export function EntryEditor({
  item,
  index,
  count,
  onChange,
  onRemove,
  onMove,
  onReplace,
  onRest,
  previous,
  plan = false,
}: {
  item: Entry;
  index: number;
  count: number;
  onChange: (e: Entry) => void;
  onRemove: () => void;
  onMove: (delta: number) => void;
  onReplace: () => void;
  onRest: (seconds: number) => void;
  previous?: Entry;
  plan?: boolean;
}) {
  const update = (id: string, p: Partial<SetLog>) =>
    onChange({ ...item, sets: item.sets.map((s) => (s.id === id ? { ...s, ...p } : s)) });
  return (
    <section className="log-exercise">
      <div className="log-exercise-head">
        <span className="index">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>{item.exercise.name}</h3>
          <small>
            {item.exercise.equipment} · {item.exercise.reps}
            {!item.exercise.metric ? ' reps' : ''}
          </small>
        </div>
        <div className="row-tools">
          <button
            title="Move up"
            aria-label={`Move ${item.exercise.name} up`}
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ArrowUp size={15} />
          </button>
          <button
            title="Move down"
            aria-label={`Move ${item.exercise.name} down`}
            disabled={index === count - 1}
            onClick={() => onMove(1)}
          >
            <ArrowDown size={15} />
          </button>
          <button
            title="Replace exercise"
            aria-label={`Replace ${item.exercise.name}`}
            onClick={onReplace}
          >
            <RefreshCw size={15} />
          </button>
          <button
            title="Remove exercise"
            aria-label={`Remove ${item.exercise.name}`}
            onClick={onRemove}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {plan && (
        <label className="prescription">
          Target rep / time range
          <input
            value={item.exercise.reps}
            onChange={(e) =>
              onChange({ ...item, exercise: { ...item.exercise, reps: e.target.value } })
            }
          />
        </label>
      )}
      <div className="set-table-wrap">
        <table className="set-table">
          <thead>
            <tr>
              <th>Set</th>
              <th>Type</th>
              {!plan && <th>Previous</th>}
              {item.exercise.metric ? (
                <>
                  <th>Seconds</th>
                  {item.exercise.metric === 'distance' && <th>Km</th>}
                </>
              ) : (
                <>
                  <th>Kg</th>
                  <th>Reps</th>
                </>
              )}
              <th>Effort /10</th>
              {!plan && <th>Done</th>}
              <th />
            </tr>
          </thead>
          <tbody>
            {item.sets.map((s, i) => (
              <tr key={s.id} className={s.done && !plan ? 'complete' : ''}>
                <td>{i + 1}</td>
                <td>
                  <select
                    aria-label={`Set ${i + 1} type`}
                    value={s.warmup ? 'warmup' : 'working'}
                    onChange={(e) => update(s.id, { warmup: e.target.value === 'warmup' })}
                  >
                    <option value="working">Working</option>
                    <option value="warmup">Warm-up</option>
                  </select>
                </td>
                {!plan && (
                  <td className="previous">
                    {previous?.sets[i]
                      ? item.exercise.metric
                        ? `${previous.sets[i].duration}s${item.exercise.metric === 'distance' ? ' / ' + previous.sets[i].distance + 'km' : ''}`
                        : `${previous.sets[i].weight} × ${previous.sets[i].reps}`
                      : '—'}
                  </td>
                )}
                {(item.exercise.metric
                  ? item.exercise.metric === 'distance'
                    ? ['duration', 'distance']
                    : ['duration']
                  : ['weight', 'reps']
                ).map((k) => (
                  <td key={k}>
                    <input
                      aria-label={`Set ${i + 1} ${k}`}
                      type="number"
                      min="0"
                      max={k === 'reps' ? 1000 : 100000}
                      step={k === 'weight' || k === 'distance' ? '0.1' : '1'}
                      value={s[k as keyof SetLog] as number}
                      onChange={(e) => update(s.id, { [k]: Math.max(0, Number(e.target.value)) })}
                    />
                  </td>
                ))}
                <td>
                  <select
                    aria-label={`Set ${i + 1} effort`}
                    value={s.effort}
                    onChange={(e) => update(s.id, { effort: e.target.value })}
                  >
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </td>
                {!plan && (
                  <td>
                    <button
                      className={'set-check ' + (s.done ? 'checked' : '')}
                      aria-label={`Mark set ${i + 1} ${s.done ? 'incomplete' : 'complete'}`}
                      aria-pressed={s.done}
                      onClick={() => {
                        update(s.id, { done: !s.done });
                        if (!s.done) onRest(item.rest);
                      }}
                    >
                      <Check size={17} />
                    </button>
                  </td>
                )}
                <td>
                  <button
                    className="row-delete"
                    aria-label={`Remove set ${i + 1}`}
                    onClick={() =>
                      onChange({ ...item, sets: item.sets.filter((x) => x.id !== s.id) })
                    }
                  >
                    <X size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="set-footer">
        <button
          className="text-button"
          onClick={() =>
            onChange({
              ...item,
              sets: [
                ...item.sets,
                { ...(item.sets.at(-1) || newSet(item.exercise)), id: uid(), done: false },
              ],
            })
          }
        >
          <Plus size={14} /> Add set
        </button>
        <label>
          <Timer size={14} /> Rest{' '}
          <select
            aria-label={`${item.exercise.name} rest duration`}
            value={item.rest}
            onChange={(e) => onChange({ ...item, rest: Number(e.target.value) })}
          >
            {[0, 30, 60, 90, 120, 180].map((n) => (
              <option key={n} value={n}>
                {n}s
              </option>
            ))}
          </select>
        </label>
      </div>
      <input
        className="notes-input"
        aria-label={`${item.exercise.name} notes`}
        placeholder="Add a technique or set note…"
        value={item.notes}
        onChange={(e) => onChange({ ...item, notes: e.target.value })}
      />
    </section>
  );
}
export function SessionEditor({
  workout,
  onChange,
  history,
  onLibrary,
  onRest,
  plan = false,
  onReplace,
}: {
  workout: Workout;
  onChange: (w: Workout) => void;
  history: Workout[];
  onLibrary: () => void;
  onRest: (n: number) => void;
  plan?: boolean;
  onReplace: (id: string) => void;
}) {
  return (
    <>
      <div className="session-name">
        <label>
          {plan ? 'Routine name' : 'Workout name'}
          <input
            value={workout.name}
            onChange={(e) => onChange({ ...workout, name: e.target.value })}
          />
        </label>
        {!plan && (
          <label>
            Date
            <input
              aria-label="Workout date"
              type="date"
              max={localDate()}
              value={workout.date}
              onChange={(e) => onChange({ ...workout, date: e.target.value })}
            />
          </label>
        )}
      </div>
      {!workout.entries.length && (
        <div className="empty">
          <Dumbbell size={34} />
          <h3>A fresh start</h3>
          <p>Choose an exercise from the body map or library.</p>
        </div>
      )}
      {workout.entries.map((item, i) => (
        <EntryEditor
          key={item.id}
          item={item}
          index={i}
          count={workout.entries.length}
          plan={plan}
          onChange={(e) =>
            onChange({ ...workout, entries: workout.entries.map((x) => (x.id === e.id ? e : x)) })
          }
          onRemove={() =>
            onChange({ ...workout, entries: workout.entries.filter((x) => x.id !== item.id) })
          }
          onMove={(delta) => {
            const entries = [...workout.entries];
            [entries[i], entries[i + delta]] = [entries[i + delta], entries[i]];
            onChange({ ...workout, entries });
          }}
          onReplace={() => onReplace(item.id)}
          onRest={onRest}
          previous={[...history]
            .filter((w) => w.id !== workout.id && w.date <= workout.date)
            .sort((a, b) => b.date.localeCompare(a.date))
            .flatMap((w) => w.entries)
            .find((e) => e.exercise.id === item.exercise.id)}
        />
      ))}
      <button className="secondary full add-exercise" onClick={onLibrary}>
        <Plus size={17} />
        Add exercise
      </button>
      {!plan && (
        <label className="session-notes">
          Session notes
          <textarea
            placeholder="How did the session feel?"
            value={workout.notes}
            onChange={(e) => onChange({ ...workout, notes: e.target.value })}
          />
        </label>
      )}
    </>
  );
}
