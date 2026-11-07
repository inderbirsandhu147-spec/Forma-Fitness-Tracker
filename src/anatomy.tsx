'use client';
import { useRef, useState } from 'react';
import { Plus, Minus, RotateCcw, Move } from 'lucide-react';
import { muscles, heatColor } from './data';
type Region = { id: string; d: string; fibers?: string[] };
const front: Region[] = [
  {
    id: 'delts',
    d: 'M112 112 C94 113 83 124 82 143 L82 158 C94 156 105 144 112 130 Z',
    fibers: ['M108 118 Q92 126 86 147', 'M107 123 Q97 135 91 150', 'M103 119 Q88 132 85 143'],
  },
  {
    id: 'chest',
    d: 'M115 116 C130 110 145 114 158 121 L158 160 C145 171 124 167 111 154 L102 137 Z',
    fibers: [
      'M154 125 Q134 119 113 129',
      'M154 131 Q132 126 108 137',
      'M154 138 Q132 134 110 143',
      'M154 145 Q133 144 115 151',
      'M154 152 Q135 154 122 158',
      'M155 158 Q139 161 130 161',
    ],
  },
  {
    id: 'biceps',
    d: 'M81 157 Q91 156 102 145 Q101 170 95 188 Q90 205 79 214 L72 204 Q72 177 81 157 Z',
    fibers: ['M84 164 Q77 193 80 205', 'M90 160 Q87 191 83 207', 'M96 155 Q95 182 87 201'],
  },
  { id: 'triceps', d: 'M78 158 Q70 171 67 195 L70 212 L76 213 Q69 194 78 158 Z' },
  {
    id: 'forearms',
    d: 'M71 211 Q80 221 83 218 Q79 245 66 268 L57 293 L47 289 Q49 260 55 242 Z',
    fibers: [
      'M68 220 Q60 250 53 281',
      'M74 223 Q65 255 56 282',
      'M79 223 Q68 249 60 271',
      'M59 243 Q53 258 51 273',
    ],
  },
  {
    id: 'serratus',
    d: 'M112 160 L122 171 L119 181 L109 172 Z M109 176 L121 186 L118 197 L107 188 Z M107 192 L119 202 L117 212 L106 204 Z',
  },
  {
    id: 'abs',
    d: 'M133 173 Q146 169 158 172 L158 190 L133 190 Z M133 194 L158 194 L158 212 L132 212 Z M132 216 L158 216 L158 235 L132 234 Z M133 238 L158 239 L158 267 Q142 264 135 252 Z',
    fibers: [
      'M138 176 L138 187',
      'M146 175 L146 187',
      'M153 175 L153 187',
      'M138 198 L138 208',
      'M147 198 L147 208',
      'M139 220 L139 231',
      'M150 220 L150 231',
      'M140 242 L145 258',
      'M150 242 L153 262',
    ],
  },
  {
    id: 'obliques',
    d: 'M106 209 L126 181 Q125 218 130 250 L151 277 Q125 268 111 249 Z',
    fibers: [
      'M108 218 L123 205',
      'M110 228 L125 217',
      'M112 238 L126 228',
      'M116 248 L128 240',
      'M124 257 L133 250',
    ],
  },
  {
    id: 'adductors',
    d: 'M148 285 L158 300 L153 353 L143 403 Q134 372 129 332 Z',
    fibers: ['M147 296 L145 369', 'M152 305 L148 354', 'M139 313 L142 361'],
  },
  {
    id: 'quads',
    d: 'M112 279 Q100 305 102 344 Q104 383 117 416 Q111 377 122 343 Q132 311 112 279 Z M119 281 Q138 283 143 295 Q132 323 129 352 L124 398 Q112 377 116 349 Q131 309 119 281 Z M136 354 Q135 383 128 405 Q124 419 130 431 Q146 420 145 403 Z',
    fibers: [
      'M110 300 Q103 355 114 392',
      'M115 305 Q112 350 116 370',
      'M124 297 Q130 316 122 345 L119 370',
      'M136 369 L130 402',
      'M139 381 L135 407',
    ],
  },
  {
    id: 'tibialis',
    d: 'M114 454 Q121 451 124 459 Q130 499 121 547 L116 595 L108 597 Q106 551 106 513 Q103 477 114 454 Z',
    fibers: ['M114 466 Q111 508 113 549 L112 584', 'M120 471 Q120 513 115 549'],
  },
  { id: 'calves', d: 'M130 455 Q144 472 140 494 Q139 516 127 540 L121 569 Q127 518 128 487 Z' },
];
const back: Region[] = [
  {
    id: 'traps',
    d: 'M144 91 L158 93 L158 220 Q143 200 132 177 L111 139 L97 121 Q127 115 144 91 Z',
    fibers: [
      'M150 105 Q138 127 117 133',
      'M153 120 Q140 138 127 146',
      'M153 138 L136 160',
      'M153 156 L143 178',
      'M153 176 L148 190',
    ],
  },
  {
    id: 'delts',
    d: 'M102 118 Q84 120 80 145 L81 162 Q97 158 111 137 Z',
    fibers: ['M99 124 Q88 139 85 154', 'M103 129 Q97 145 89 153'],
  },
  {
    id: 'infraspinatus',
    d: 'M114 142 L131 174 L113 185 Q103 165 104 151 Z',
    fibers: ['M112 153 L123 173', 'M109 160 L119 177'],
  },
  {
    id: 'lats',
    d: 'M107 180 L134 183 L154 227 L151 267 Q123 257 114 231 Z',
    fibers: ['M113 192 L146 237', 'M113 202 L145 244', 'M116 216 L145 251', 'M124 240 L145 258'],
  },
  {
    id: 'erectors',
    d: 'M148 203 L158 222 L158 287 L149 278 L142 256 Z',
    fibers: ['M151 222 L149 258', 'M154 231 L154 274'],
  },
  {
    id: 'triceps',
    d: 'M81 164 L100 146 Q104 166 94 191 Q84 213 75 213 L70 203 Q72 183 81 164 Z',
    fibers: ['M85 168 L77 200', 'M93 160 Q91 182 82 204', 'M98 165 L88 189'],
  },
  {
    id: 'forearms',
    d: 'M70 213 L82 218 Q80 240 68 262 L57 293 L47 289 Q49 258 58 239 Z',
    fibers: ['M67 223 L52 281', 'M73 226 L57 279', 'M78 225 L64 259'],
  },
  {
    id: 'gluteMed',
    d: 'M114 252 L144 271 L132 282 L108 289 Q106 268 114 252 Z',
    fibers: ['M116 261 L132 276', 'M113 270 L123 281'],
  },
  {
    id: 'glutes',
    d: 'M132 282 Q147 277 158 293 L158 330 Q143 348 118 333 Q108 322 108 293 Z',
    fibers: [
      'M151 291 Q132 287 116 299',
      'M154 300 Q134 295 114 307',
      'M153 310 Q135 302 116 315',
      'M152 320 Q135 313 121 325',
      'M146 330 Q134 322 128 331',
    ],
  },
  {
    id: 'hamstrings',
    d: 'M110 336 Q120 345 129 344 L124 407 L117 441 Q108 416 104 380 Z M133 344 Q149 347 153 334 Q153 377 143 404 L133 442 L128 419 Z',
    fibers: [
      'M112 349 L115 408',
      'M121 350 L118 412',
      'M140 353 Q139 385 132 418',
      'M147 349 Q146 380 139 401',
    ],
  },
  {
    id: 'calves',
    d: 'M118 454 Q126 465 124 491 Q119 521 110 533 Q99 526 101 495 Q104 465 118 454 Z M129 453 Q143 468 143 492 Q142 518 130 532 Q121 516 125 493 Z M109 538 L121 529 L130 539 L118 577 L113 595 L106 594 Z',
    fibers: [
      'M115 467 Q106 500 111 521',
      'M120 478 Q116 506 113 516',
      'M131 468 Q139 493 131 518',
      'M132 480 L130 508',
      'M115 544 L112 579',
      'M122 541 L115 568',
    ],
  },
];
const silhouette =
  'M144 85 Q134 81 132 65 L130 46 Q130 21 148 17 Q160 13 172 17 Q190 21 190 46 L188 65 Q186 81 176 85 L177 99 Q186 108 206 113 Q229 116 238 138 L243 168 Q252 190 252 210 L269 249 L276 280 L284 297 L291 314 Q293 321 288 323 L281 309 L284 332 Q283 338 279 334 L274 314 L275 341 Q272 346 269 340 L266 316 L265 338 Q262 343 260 337 L259 313 L255 324 Q250 327 251 319 L250 297 L240 271 L225 244 L221 221 L214 200 L208 174 L210 210 L206 245 Q216 273 216 304 L220 351 Q222 390 207 435 L209 458 Q220 479 218 510 L207 566 L205 598 L210 616 L218 627 Q220 634 212 635 L184 635 Q176 634 178 625 L179 607 L179 574 L174 532 Q171 495 177 461 L176 442 Q165 409 164 375 L160 328 L156 375 Q155 409 144 442 L143 461 Q149 495 146 532 L141 574 L141 607 L142 625 Q144 634 136 635 L108 635 Q100 634 102 627 L110 616 L115 598 L113 566 L102 510 Q100 479 111 458 L113 435 Q98 390 100 351 L104 304 Q104 273 114 245 L110 210 L112 174 L106 200 L99 221 L95 244 L80 271 L70 297 L69 319 Q70 327 65 324 L61 313 L60 337 Q58 343 55 338 L54 316 L51 340 Q48 346 45 341 L46 314 L41 334 Q37 338 36 332 L39 309 L32 323 Q27 321 29 314 L36 297 L44 280 L51 249 L68 210 Q68 190 77 168 L82 138 Q91 116 114 113 Q134 108 143 99 Z';
export function Body({
  view,
  selected,
  onSelect,
  totals,
  colors,
  heat = true,
  mini = false,
}: {
  view: 'front' | 'back';
  selected: string;
  onSelect: (s: string) => void;
  totals: Record<string, { total: number }>;
  colors?: Record<string, { total: number }>;
  heat?: boolean;
  mini?: boolean;
}) {
  const regions = view === 'front' ? front : back;
  return (
    <svg
      className={'body-svg ' + (mini ? 'mini-body' : '')}
      viewBox="0 0 320 655"
      aria-label={`${view} view of superficial muscles`}
    >
      <defs>
        <pattern
          id={`fiber-${view}`}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(15)"
        >
          <path d="M0 0V5" stroke="#466c5d" strokeWidth=".4" opacity=".14" />
        </pattern>
      </defs>
      <path d={silhouette} fill="#eef0ec" stroke="#c4cec7" strokeWidth="1" />
      <g fill="none" stroke="#c5cec8" strokeWidth=".8">
        <path d="M160 89V115 M144 86L155 111 M176 86L165 111 M136 433Q124 425 116 440L123 450L135 446Z M184 433Q196 425 204 440L197 450L185 446Z M116 603L131 609 M204 603L189 609" />
        {view === 'front' && (
          <path d="M140 60Q147 55 152 60 M168 60Q174 55 181 60 M157 60L154 72L163 73 M151 79Q160 83 169 79 M144 97L146 115 M176 97L174 115 M160 275L159 294 M132 274L155 299 M188 274L165 299" />
        )}
      </g>
      {[false, true].map((mirror) => (
        <g key={String(mirror)} transform={mirror ? 'translate(320 0) scale(-1 1)' : undefined}>
          {regions.map((r, i) => (
            <g
              key={r.id + i}
              className={`muscle ${selected === r.id ? 'selected' : ''}`}
              tabIndex={mini ? -1 : 0}
              role="button"
              aria-label={muscles.find((m) => m.id === r.id)?.name}
              aria-pressed={selected === r.id}
              onClick={() => onSelect(r.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(r.id);
                }
              }}
            >
              <title>
                {muscles.find((m) => m.id === r.id)?.name} · {totals[r.id]?.total || 0} weighted
                sets
              </title>
              <path
                className="muscle-fill"
                d={r.d}
                fill={
                  heat ? heatColor(colors?.[r.id]?.total ?? totals[r.id]?.total ?? 0) : '#d4dfd7'
                }
                stroke={selected === r.id ? '#124d3e' : '#a9bbb0'}
                strokeWidth={selected === r.id ? 1.6 : 0.7}
              />
              <path d={r.d} fill={`url(#fiber-${view})`} pointerEvents="none" />
              {r.fibers?.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={selected === r.id ? '#164c3e' : '#709080'}
                  strokeWidth=".65"
                  opacity=".55"
                  pointerEvents="none"
                />
              ))}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
export default function Anatomy({
  view,
  setView,
  selected,
  onSelect,
  totals,
  colors,
  heat,
}: {
  view: 'front' | 'back';
  setView: (s: 'front' | 'back') => void;
  selected: string;
  onSelect: (s: string) => void;
  totals: Record<string, { total: number }>;
  colors?: Record<string, { total: number }>;
  heat: boolean;
}) {
  const [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  return (
    <div className="anatomy">
      <div className="view-switch segmented">
        <button className={view === 'front' ? 'active' : ''} onClick={() => setView('front')}>
          Front
        </button>
        <button className={view === 'back' ? 'active' : ''} onClick={() => setView('back')}>
          Back
        </button>
      </div>
      <div
        className="body-stage"
        style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }}
        onPointerDown={(e) => {
          if (zoom > 1) {
            drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
          }
        }}
        onPointerMove={(e) => {
          if (
            drag.current &&
            (Math.abs(e.clientX - drag.current.x) > 4 || Math.abs(e.clientY - drag.current.y) > 4)
          ) {
            e.currentTarget.setPointerCapture(e.pointerId);
            setPan({
              x: drag.current.px + e.clientX - drag.current.x,
              y: drag.current.py + e.clientY - drag.current.y,
            });
          }
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <div className="anatomy-axis" />
        <div
          className="body-transform"
          style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}
        >
          <Body
            view={view}
            selected={selected}
            onSelect={onSelect}
            totals={totals}
            colors={colors}
            heat={heat}
          />
        </div>
        <span className="orientation">{view === 'front' ? 'Anterior' : 'Posterior'} view</span>
        {zoom === 1 && selected === 'chest' && view === 'front' && (
          <div className="body-callout">
            <span>Pectoralis major</span>
            <i />
          </div>
        )}
      </div>
      <div className="map-foot">
        <span>
          <Move size={13} />
          {zoom > 1 ? 'Drag to explore' : 'Select a muscle to explore'}
        </span>
        <div className="zoom-tools">
          <button
            aria-label="Zoom out"
            onClick={() => {
              setZoom(Math.max(1, zoom - 0.25));
              setPan({ x: 0, y: 0 });
            }}
            disabled={zoom === 1}
          >
            <Minus size={16} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            aria-label="Zoom in"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom === 3}
          >
            <Plus size={16} />
          </button>
          <button
            aria-label="Reset map view"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
