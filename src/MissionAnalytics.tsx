import DataOverview from './DataOverview';
import {useMemo,useState} from 'react';

type Exercise={id:string;name:string;primary?:string;secondary?:string[]};
type Session={id:string;name:string;startedAt:string;finishedAt?:string;items:{id:string;sets:{reps:string;weight:string;done:boolean}[]}[]};
type Point={day:string;value:number};
const read=(key:string):any[]=>{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch{return []}};
const dayOf=(s:string)=>{const d=new Date(s);return Number.isNaN(d.getTime())?'':`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const dateLabel=(d:string)=>{const [y,m,day]=d.split('-').map(Number);return new Date(y,m-1,day).toLocaleDateString(undefined,{month:'short',day:'numeric'})};
const vol=(s:Session)=>s.items.reduce((a,i)=>a+i.sets.reduce((b,x)=>b+(x.done?Math.max(0,Number(x.weight)||0)*Math.max(0,Number(x.reps)||0):0),0),0);
const completed=(s:Session)=>s.items.some(i=>i.sets.some(x=>x.done));
function Line({points,unit}:{points:Point[];unit:string}){
 if(!points.length)return <p className="dataNote">No completed records for this selection yet.</p>;
 const w=640,h=235,pad=42,values=points.map(p=>p.value),lo=Math.min(0,...values),hi=Math.max(...values),range=hi-lo||1;
 const x=(i:number)=>pad+(points.length===1?.5:i/(points.length-1))*(w-pad*2);
 const y=(v:number)=>h-pad-(v-lo)/range*(h-pad*2);
 return <div className="missionChart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Line chart, ${points.length} entries, latest ${points.at(-1)?.value.toFixed(1)} ${unit}`}>
 {[0,.25,.5,.75,1].map(t=><g key={t}><line x1={pad} x2={w-pad} y1={pad+t*(h-pad*2)} y2={pad+t*(h-pad*2)} stroke="#a9b8b5" strokeOpacity=".35"/><text x="4" y={pad+t*(h-pad*2)+4} fill="currentColor" fontSize="12">{(hi-t*range).toFixed(0)}</text></g>)}
 <polyline fill="none" stroke="#d86a38" strokeWidth="3.5" strokeLinejoin="round" points={points.map((p,i)=>`${x(i)},${y(p.value)}`).join(' ')}/>
 {points.map((p,i)=><circle key={i} cx={x(i)} cy={y(p.value)} r="5" fill="#e6b34b" stroke="#17344e" strokeWidth="2"><title>{dateLabel(p.day)}: {p.value.toFixed(1)} {unit}</title></circle>)}
 <text x={pad} y={h-6} fill="currentColor" fontSize="13">{dateLabel(points[0].day)}</text><text x={w-pad} y={h-6} textAnchor="end" fill="currentColor" fontSize="13">{dateLabel(points.at(-1)!.day)}</text></svg>
 <div className="missionChartRows">{points.slice(-12).map((p,i)=><span key={i}>{dateLabel(p.day)} · <b>{p.value.toLocaleString(undefined,{maximumFractionDigits:1})} {unit}</b></span>)}</div></div>
}
export default function MissionAnalytics({exercises}:{exercises:Exercise[]}){
 const [refresh,setRefresh]=useState(0);
 const [section,setSection]=useState<'fitness'|'nutrition'>('fitness');
 const [units,setUnits]=useState<'metric'|'imperial'>(()=>localStorage.getItem('iron-fitness-units-v33')==='imperial'?'imperial':'metric');
 const [foodUnits,setFoodUnits]=useState<'metric'|'us'>(()=>localStorage.getItem('iron-nutrition-units-v33')==='us'?'us':'metric');
 const [metric,setMetric]=useState<'weight'|'reps'|'volume'>('weight');
 const [period,setPeriod]=useState<'week'|'month'|'year'>('month');
 const [exerciseId,setExerciseId]=useState('');
 const [selectedDay,setSelectedDay]=useState('');
 const sessions=useMemo(()=>read('iron-workout-sessions-v32') as Session[],[refresh]);
 const nutrition=useMemo(()=>read('iron-nutrition-v06'),[refresh]);
 const water=useMemo(()=>read('iron-water-v06'),[refresh]);
 const factor=units==='imperial'?2.2046226218:1,unit=units==='imperial'?'lb':'kg';
 const today=dayOf(new Date().toISOString());
 const days=period==='week'?7:period==='month'?30:365;
 const cutoff=new Date();cutoff.setHours(0,0,0,0);cutoff.setDate(cutoff.getDate()-(days-1));
 const inRange=(day:string)=>{if(!day)return false;const d=new Date(day+'T00:00:00');return d>=cutoff&&d<=new Date()};
 const doneSessions=sessions.filter(s=>s.finishedAt&&completed(s));
 const usedIds=[...new Set(doneSessions.flatMap(s=>s.items.filter(i=>i.sets.some(x=>x.done)).map(i=>i.id)))];
 const chosen=usedIds.includes(exerciseId)?exerciseId:usedIds[0]||'';
 const byDay=new Map<string,Session[]>();doneSessions.forEach(s=>{const d=dayOf(s.finishedAt||s.startedAt);byDay.set(d,[...(byDay.get(d)||[]),s])});
 const exerciseRows=doneSessions.flatMap(s=>s.items.filter(i=>i.id===chosen).map(i=>({day:dayOf(s.finishedAt||s.startedAt),sets:i.sets.filter(x=>x.done)}))).filter(r=>inRange(r.day)&&r.sets.length);
 const exercisePoints=exerciseRows.reduce((m,r)=>{const v=metric==='weight'?Math.max(...r.sets.map(x=>Number(x.weight)||0))*factor:metric==='reps'?Math.max(...r.sets.map(x=>Number(x.reps)||0)):r.sets.reduce((a,x)=>a+(Number(x.weight)||0)*(Number(x.reps)||0),0)*factor;const old=m.get(r.day);m.set(r.day,old===undefined?v:metric==='volume'?old+v:Math.max(old,v));return m},new Map<string,number>());
 const points=[...exercisePoints].sort(([a],[b])=>a.localeCompare(b)).map(([day,value])=>({day,value}));
 const volumePoints=[...byDay].filter(([d])=>inRange(d)).sort(([a],[b])=>a.localeCompare(b)).map(([day,ss])=>({day,value:ss.reduce((a,s)=>a+vol(s),0)*factor}));
 const allExerciseRows=doneSessions.flatMap(s=>s.items.map(i=>({id:i.id,sets:i.sets.filter(x=>x.done)})));
 const chosenRows=allExerciseRows.filter(r=>r.id===chosen);
 const recordWeight=Math.max(0,...chosenRows.flatMap(r=>r.sets.map(x=>Number(x.weight)||0)))*factor;
 const recordReps=Math.max(0,...chosenRows.flatMap(r=>r.sets.map(x=>Number(x.reps)||0)));
 const recordVolume=Math.max(0,...doneSessions.map(s=>s.items.filter(i=>i.id===chosen).reduce((a,i)=>a+i.sets.reduce((b,x)=>b+(x.done?(Number(x.weight)||0)*(Number(x.reps)||0):0),0),0)))*factor;
 const muscleCounts=new Map<string,number>();doneSessions.filter(s=>inRange(dayOf(s.finishedAt||s.startedAt))).forEach(s=>{const groups=new Set<string>();s.items.filter(i=>i.sets.some(x=>x.done)).forEach(i=>{const ex=exercises.find(e=>e.id===i.id);if(ex?.primary)groups.add(ex.primary)});groups.forEach(g=>muscleCounts.set(g,(muscleCounts.get(g)||0)+1))});
 const nutritionPoints=new Map<string,{cal:number;protein:number;carbs:number;fat:number}>();nutrition.forEach(e=>{if(!inRange(e.day))return;const r=nutritionPoints.get(e.day)||{cal:0,protein:0,carbs:0,fat:0};const n=Number(e.servings)||0;r.cal+=(Number(e.calories)||0)*n;r.protein+=(Number(e.protein)||0)*n;r.carbs+=(Number(e.carbs)||0)*n;r.fat+=(Number(e.fat)||0)*n;nutritionPoints.set(e.day,r)});
 const [nutrient,setNutrient]=useState<'cal'|'protein'|'carbs'|'fat'|'water'>('cal');
 const waterPoints=new Map<string,number>();water.forEach(e=>{if(inRange(e.day))waterPoints.set(e.day,(waterPoints.get(e.day)||0)+(Number(e.ml)||0))});
 const nutritionDays=[...new Set([...nutritionPoints.keys(),...waterPoints.keys()])].sort();
 const nutritionLine=nutritionDays.filter(d=>nutrient==='water'?waterPoints.has(d):nutritionPoints.has(d)).map(day=>({day,value:nutrient==='water'?(waterPoints.get(day)||0)*(foodUnits==='us'?1/29.5735295625:1):(nutritionPoints.get(day)?.[nutrient]||0)}));
 const selected=selectedDay?byDay.get(selectedDay)||[]:[];
 return <div className="missionAnalytics"><div className="sectionHead"><small>MODULE 04 / MISSION ANALYTICS</small><h2>PERFORMANCE DATA</h2><p>Charts use completed saved workouts and recorded nutrition entries only.</p></div>
 <div className="missionSwitch"><button className={section==='fitness'?'active':''} onClick={()=>setSection('fitness')}>FITNESS</button><button className={section==='nutrition'?'active':''} onClick={()=>setSection('nutrition')}>NUTRITION</button><button onClick={()=>setRefresh(v=>v+1)}>↻ REFRESH</button></div>
 <section><h3>MEASUREMENT PREFERENCES</h3><label>FITNESS UNITS <select value={units} onChange={e=>{const v=e.target.value as 'metric'|'imperial';setUnits(v);localStorage.setItem('iron-fitness-units-v33',v)}}><option value="metric">Metric (kg, cm)</option><option value="imperial">Imperial (lb, ft/in)</option></select></label><label>FOOD & DRINK UNITS <select value={foodUnits} onChange={e=>{const v=e.target.value as 'metric'|'us';setFoodUnits(v);localStorage.setItem('iron-nutrition-units-v33',v)}}><option value="metric">Metric (g, mL)</option><option value="us">US (oz, cups, fl oz)</option></select></label><p className="dataNote">These preferences control analytics display. Existing workout and food entry forms retain their labeled input units; recorded values are never rewritten.</p></section>
 <div className="missionSwitch">{(['week','month','year'] as const).map(p=><button key={p} className={period===p?'active':''} onClick={()=>setPeriod(p)}>{p.toUpperCase()}</button>)}</div>
 {section==='fitness'?<><section><h3>EXERCISE PROGRESS</h3>{usedIds.length?<><label>EXERCISE<select value={chosen} onChange={e=>setExerciseId(e.target.value)}>{usedIds.map(id=><option key={id} value={id}>{exercises.find(e=>e.id===id)?.name||id}</option>)}</select></label><div className="missionSwitch">{(['weight','reps','volume'] as const).map(m=><button key={m} className={metric===m?'active':''} onClick={()=>setMetric(m)}>{m.toUpperCase()}</button>)}</div><Line points={points} unit={metric==='reps'?'reps':unit}/><div className="missionRecords"><div><small>HEAVIEST SET</small><strong>{recordWeight.toFixed(1)} {unit}</strong></div><div><small>MOST REPS</small><strong>{recordReps}</strong></div><div><small>TOP SESSION VOLUME</small><strong>{recordVolume.toFixed(1)} {unit}</strong></div></div></>:<p className="dataNote">Finish a workout with completed sets to begin tracking exercise progress.</p>}</section>
 <section><h3>OVERALL TRAINING VOLUME</h3><Line points={volumePoints} unit={unit}/><p className="dataNote">Volume is completed weight × reps, grouped by workout completion date. Days without workouts are not treated as zero.</p></section>
 <section><h3>WORKOUT HISTORY BY DATE</h3><label>SELECT DATE <input type="date" value={selectedDay||today} onChange={e=>setSelectedDay(e.target.value)}/></label>{selected.length?selected.map(s=><details className="missionHistory" key={s.id}><summary><strong>{s.name}</strong><small>{new Date(s.finishedAt||s.startedAt).toLocaleString()}</small></summary>{s.items.filter(i=>i.sets.some(x=>x.done)).map((i,j)=><p key={j}><b>{exercises.find(e=>e.id===i.id)?.name||i.id}</b>: {i.sets.filter(x=>x.done).map(x=>`${x.weight} kg × ${x.reps}`).join(' · ')}</p>)}<b>Volume: {(vol(s)*factor).toFixed(1)} {unit}</b></details>):<p className="dataNote">No completed workout on {dateLabel(selectedDay||today)}. Select a recorded date below.</p>}<div className="missionDateList">{[...byDay.keys()].sort().reverse().slice(0,45).map(d=><button key={d} onClick={()=>setSelectedDay(d)}>{dateLabel(d)} ({byDay.get(d)?.length})</button>)}</div></section>
 <section><h3>MUSCLE GROUP FREQUENCY</h3><p className="dataNote">Number of completed workouts involving each primary muscle group in the selected period.</p>{[...muscleCounts].sort((a,b)=>b[1]-a[1]).map(([g,n])=><div className="missionMuscle" key={g}><span>{g.replace(/_/g,' ').toUpperCase()}</span><div><i style={{width:`${100*n/Math.max(...muscleCounts.values())}%`}}/></div><b>{n}</b></div>)}{!muscleCounts.size&&<p>No completed workouts in this period.</p>}</section></>:<><section><h3>NUTRITION & HYDRATION HISTORY</h3><div className="missionSwitch">{(['cal','protein','carbs','fat','water'] as const).map(n=><button key={n} className={nutrient===n?'active':''} onClick={()=>setNutrient(n)}>{n==='cal'?'CALORIES':n.toUpperCase()}</button>)}</div><Line points={nutritionLine} unit={nutrient==='cal'?'Cal':nutrient==='water'?(foodUnits==='us'?'fl oz':'mL'):'g'}/><p className="dataNote">Nutrition entries are displayed using their recorded nutrient values. Cups and grams require ingredient-specific conversion and are not interchangeable.</p></section><DataOverview/></>}
 </div>
}
