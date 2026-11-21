import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import './mission-widgets.css';

type WidgetId='calories'|'water'|'volumeToday'|'volumeWeek'|'workouts'|'nextWorkout'|'protein'|'carbs'|'fat'|'foodEntries'|'setsToday'|'waterOz';
const OPTIONS:{id:WidgetId;title:string;detail:string}[]=[
 {id:'calories',title:'FOOD ENERGY',detail:'Calories logged today'},
 {id:'water',title:'HYDRATION',detail:'Water logged today'},
 {id:'volumeToday',title:'WEIGHT MOVED',detail:'Today'},
 {id:'volumeWeek',title:'WEEKLY VOLUME',detail:'This week'},
 {id:'workouts',title:'WORKOUTS COMPLETED',detail:'This week'},
 {id:'nextWorkout',title:'TRAINING SCHEDULE',detail:'Today’s planned session'},
 {id:'protein',title:'PROTEIN LOGGED',detail:'Today'},
 {id:'carbs',title:'CARBS LOGGED',detail:'Today'},
 {id:'fat',title:'FAT LOGGED',detail:'Today'},
 {id:'foodEntries',title:'FOOD ENTRIES',detail:'Items logged today'},
 {id:'setsToday',title:'SETS COMPLETED',detail:'Today’s finished workout sets'},
 {id:'waterOz',title:'HYDRATION / FL OZ',detail:'Water logged today'},
];
const STORAGE='iron-home-widgets-v37';
const DEFAULT:WidgetId[]=['calories','water','volumeToday','volumeWeek'];
const valid=(x:unknown):x is WidgetId=>typeof x==='string'&&OPTIONS.some(o=>o.id===x);
function read<T,>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
const localDay=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const number=(n:unknown)=>{const v=Number(n);return Number.isFinite(v)&&v>0?v:0};
const kgToLb=2.2046226218;
type Session={finishedAt?:string;items?:{sets?:{done?:boolean;weight?:string;reps?:string}[]}[]};
function getStats(plan:Record<string,string[]>,planNames:Record<string,string>){
 const now=new Date(),today=localDay(now),start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-(start.getDay()+6)%7);
 const inWeek=(d:Date)=>!Number.isNaN(d.getTime())&&d>=start&&d<=now;
 const nutrition=read<{day:string;calories:number;protein?:number;carbs?:number;fat?:number;servings:number}[]>('iron-nutrition-v06',[]);
 const todaysFood=nutrition.filter(x=>x.day===today);
 const nutrient=(key:'protein'|'carbs'|'fat')=>Math.round(todaysFood.reduce((a,x)=>a+number(x[key])*number(x.servings),0)).toLocaleString();
 const water=read<{day:string;ml:number}[]>('iron-water-v06',[]);
 const sessions=read<Session[]>('iron-workout-sessions-v32',[]);
 const legacy=read<{at:string;weight:number;reps:number}[]>('iron-sets',[]);
 const sessionVolume=(s:Session)=> (s.items||[]).reduce((sum,item)=>sum+(item.sets||[]).reduce((total,set)=>total+(set.done?number(set.weight)*number(set.reps):0),0),0);
 const done=sessions.filter(s=>s.finishedAt&&inWeek(new Date(s.finishedAt)));
 const todaySessions=done.filter(s=>localDay(new Date(s.finishedAt!))===today);
 const setsToday=todaySessions.reduce((sum,s)=>sum+(s.items||[]).reduce((n,item)=>n+(item.sets||[]).filter(x=>x.done).length,0),0);
 const legacyToday=legacy.filter(s=>s.at&&localDay(new Date(s.at))===today);
 const legacyWeek=legacy.filter(s=>s.at&&inWeek(new Date(s.at)));
 const imperial=localStorage.getItem('iron-fitness-units-v33')==='imperial';
 const volumeToday=(todaySessions.reduce((a,s)=>a+sessionVolume(s),0)+legacyToday.reduce((a,s)=>a+number(s.weight)*number(s.reps),0))*(imperial?kgToLb:1);
 const volumeWeek=(done.reduce((a,s)=>a+sessionVolume(s),0)+legacyWeek.reduce((a,s)=>a+number(s.weight)*number(s.reps),0))*(imperial?kgToLb:1);
 const dayName=now.toLocaleDateString('en-US',{weekday:'long'});
 const planned=plan[dayName]||[];
 return {
  calories:{value:Math.round(nutrition.filter(x=>x.day===today).reduce((a,x)=>a+number(x.calories)*number(x.servings),0)).toLocaleString(),unit:'Cal'},
  water:{value:(water.filter(x=>x.day===today).reduce((a,x)=>a+number(x.ml),0)/1000).toLocaleString(undefined,{maximumFractionDigits:2}),unit:'L'},
  volumeToday:{value:Math.round(volumeToday).toLocaleString(),unit:imperial?'lb':'kg'},
  volumeWeek:{value:Math.round(volumeWeek).toLocaleString(),unit:imperial?'lb':'kg'},
  workouts:{value:String(done.length),unit:'sessions'},
  nextWorkout:{value:planNames[dayName]|| (planned.length?'WORKOUT':'REST DAY'),unit:planned.length?`${planned.length} exercises`:'No exercises scheduled'},
  protein:{value:nutrient('protein'),unit:'g'},
  carbs:{value:nutrient('carbs'),unit:'g'},
  fat:{value:nutrient('fat'),unit:'g'},
  foodEntries:{value:String(todaysFood.length),unit:'entries'},
  setsToday:{value:String(setsToday),unit:'sets'},
  waterOz:{value:(water.filter(x=>x.day===today).reduce((a,x)=>a+number(x.ml),0)/29.5735295625).toLocaleString(undefined,{maximumFractionDigits:1}),unit:'fl oz'},
 };
}
export default function MissionWidgets({plan,planNames}:{plan:Record<string,string[]>;planNames:Record<string,string>}){
 const [items,setItems]=useState<WidgetId[]>(()=>{const saved=read<unknown>(STORAGE,DEFAULT);return Array.isArray(saved)?Array.from(new Set(saved.filter(valid))):DEFAULT});
 const [editing,setEditing]=useState(false);
 const [revision,setRevision]=useState(0);
 useEffect(()=>localStorage.setItem(STORAGE,JSON.stringify(items)),[items]);
 useEffect(()=>{const refresh=()=>setRevision(n=>n+1);window.addEventListener('focus',refresh);window.addEventListener('storage',refresh);document.addEventListener('visibilitychange',refresh);const timer=window.setInterval(refresh,15000);return()=>{window.removeEventListener('focus',refresh);window.removeEventListener('storage',refresh);document.removeEventListener('visibilitychange',refresh);window.clearInterval(timer)}},[]);
 const stats=getStats(plan,planNames);void revision;
 const toggle=(id:WidgetId)=>setItems(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
 const gridRef=useRef<HTMLDivElement>(null);
 const pressRef=useRef<{timer:number|null;pointerId:number;id:WidgetId;startX:number;startY:number;active:boolean;ghost:HTMLElement|null;source:HTMLElement|null}|null>(null);
 const previousRects=useRef<Map<string,DOMRect>>(new Map());
 const animations=useRef<Map<string,Animation>>(new Map());
 const lastReorder=useRef(0);
 const snapshot=()=>{previousRects.current=new Map(Array.from(gridRef.current?.querySelectorAll<HTMLElement>('[data-widget-id]')||[]).map(el=>[el.dataset.widgetId!,el.getBoundingClientRect()]));};
 useLayoutEffect(()=>{for(const el of Array.from(gridRef.current?.querySelectorAll<HTMLElement>('[data-widget-id]')||[])){const old=previousRects.current.get(el.dataset.widgetId!);if(!old)continue;const now=el.getBoundingClientRect();const dx=old.left-now.left,dy=old.top-now.top;if(Math.abs(dx)+Math.abs(dy)>2){animations.current.get(el.dataset.widgetId!)?.cancel();const anim=el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:210,easing:'ease-out'});animations.current.set(el.dataset.widgetId!,anim);anim.onfinish=()=>{if(animations.current.get(el.dataset.widgetId!)===anim)animations.current.delete(el.dataset.widgetId!)}}}previousRects.current.clear()},[items]);
 const cleanup=()=>{lastReorder.current=0;const p=pressRef.current;if(!p)return;if(p.timer!==null)window.clearTimeout(p.timer);p.ghost?.remove();p.source?.classList.remove('missionWidgetDragging');pressRef.current=null;document.body.classList.remove('missionWidgetsReordering')};
 useEffect(()=>()=>cleanup(),[]);
 const pointerDown=(e:React.PointerEvent<HTMLElement>,id:WidgetId)=>{
  if(e.button!==0||pressRef.current)return;
  const source=e.currentTarget;
  const p={timer:null as number|null,pointerId:e.pointerId,id,startX:e.clientX,startY:e.clientY,active:false,ghost:null as HTMLElement|null,source};
  pressRef.current=p;
  p.timer=window.setTimeout(()=>{if(pressRef.current!==p)return;p.active=true;setEditing(true);source.classList.add('missionWidgetDragging');document.body.classList.add('missionWidgetsReordering');const rect=source.getBoundingClientRect();const ghost=source.cloneNode(true) as HTMLElement;ghost.classList.add('missionWidgetGhost');ghost.style.width=`${rect.width}px`;ghost.style.height=`${rect.height}px`;ghost.style.left=`${rect.left}px`;ghost.style.top=`${rect.top}px`;ghost.querySelector('.missionWidgetRemove')?.remove();document.body.appendChild(ghost);p.ghost=ghost;try{source.setPointerCapture(p.pointerId)}catch{}},380);
 };
 const pointerMove=(e:React.PointerEvent<HTMLElement>)=>{
  const p=pressRef.current;if(!p||p.pointerId!==e.pointerId)return;
  const dx=e.clientX-p.startX,dy=e.clientY-p.startY;
  if(!p.active){if(Math.hypot(dx,dy)>9)cleanup();return}
  e.preventDefault();if(p.ghost)p.ghost.style.transform=`translate3d(${dx}px,${dy}px,0)`;
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-widget-id]');
  const targetId=target?.dataset.widgetId as WidgetId|undefined;
  if(targetId&&targetId!==p.id&&performance.now()-lastReorder.current>180){const r=target!.getBoundingClientRect();const centerX=r.left+r.width/2,centerY=r.top+r.height/2;if(Math.abs(e.clientX-centerX)>r.width*.32||Math.abs(e.clientY-centerY)>r.height*.32)return;lastReorder.current=performance.now();snapshot();setItems(a=>{const from=a.indexOf(p.id),to=a.indexOf(targetId);if(from<0||to<0||from===to)return a;const next=[...a];next.splice(from,1);next.splice(to,0,p.id);return next})}
 };
 const pointerEnd=(e:React.PointerEvent<HTMLElement>)=>{if(pressRef.current?.pointerId===e.pointerId)cleanup()};
 return <section className={`missionWidgets ${editing?"missionWidgetsEditMode":""}`}><div className="missionWidgetsHeader"><div><small>MISSION CONTROL / PERSONAL DISPLAY</small><h3>YOUR DASHBOARD</h3></div><button type="button" onClick={()=>setEditing(x=>!x)}>{editing?'DONE':'CUSTOMIZE'}</button></div>
 {editing&&<div className="missionWidgetEditor"><small>SELECT INSTRUMENTS / HOLD A CARD TO REARRANGE</small><div className="missionWidgetOptions">{OPTIONS.map(o=><button type="button" key={o.id} className={items.includes(o.id)?'selected':''} aria-pressed={items.includes(o.id)} onClick={()=>toggle(o.id)}>{items.includes(o.id)?'☑':'□'} {o.title}</button>)}</div><button type="button" onClick={()=>setItems(DEFAULT)}>RESTORE DEFAULT LAYOUT</button></div>}
 <div className="missionWidgetGrid" ref={gridRef}>{items.map(id=>{const opt=OPTIONS.find(x=>x.id===id)!;const metric=stats[id];return <article className="missionWidget" data-widget-id={id} key={id} onPointerDown={e=>pointerDown(e,id)} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}><small>{opt.title}</small><strong>{metric.value}</strong><span>{metric.unit}</span><p>{opt.detail}</p>{editing&&<button type="button" className="missionWidgetRemove" onPointerDown={e=>e.stopPropagation()} onClick={()=>toggle(id)} aria-label={`Remove ${opt.title}`}>REMOVE</button>}</article>})}</div>
 {!items.length&&<p className="missionWidgetEmpty">No dashboard instruments selected. Choose CUSTOMIZE to add one.</p>}
 </section>;
}
