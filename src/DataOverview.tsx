import React,{useState} from 'react';
import './nutrition.css';
type Nutrient='protein'|'carbs'|'fat'|'fiber'|'sodium';
const nutrients:Nutrient[]=['protein','carbs','fat','fiber','sodium'];
const read=(k:string):any[]=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return []}};
function Ring({label,value,unit,max,color}:{label:string;value:number;unit:string;max:number;color:string}){const pct=Math.min(100,max>0?value/max*100:0);return <div className="ringCard"><div className="ring" style={{background:`conic-gradient(${color} ${pct}%, #dce2df 0)`}}><div><strong>{Math.round(value*10)/10}</strong><small>{unit}</small></div></div><b>{label}</b><small>{max>0?`${Math.round(pct)}% of optional reference`:'Recorded amount'}</small></div>}
export default function DataOverview(){
 const [refresh,setRefresh]=useState(0);
 const [goals,setGoals]=useState<Record<string,string>>(()=>{try{return JSON.parse(localStorage.getItem('iron-data-goals-v08')||'{}')}catch{return {}}});
 const today=new Date();const day=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 const entries=read('iron-nutrition-v06').filter(x=>x.day===day);
 const totals=entries.reduce((a,e)=>{for(const k of nutrients)a[k]+=(Number(e[k])||0)*(Number(e.servings)||0);return a},{protein:0,carbs:0,fat:0,fiber:0,sodium:0} as Record<Nutrient,number>);
 const loggedCal=entries.reduce((sum,e)=>sum+(Number(e.calories)||0)*(Number(e.servings)||0),0);
 const water=read('iron-water-v06').filter(w=>w.day===day).reduce((a,w)=>a+(Number(w.ml)||0),0);
 const setGoal=(k:string,v:string)=>{const next={...goals,[k]:v};setGoals(next);localStorage.setItem('iron-data-goals-v08',JSON.stringify(next))};
 const macros=[{key:'protein',label:'PROTEIN',color:'#d44735',cal:totals.protein*4},{key:'carbs',label:'CARBS',color:'#e58b2e',cal:totals.carbs*4},{key:'fat',label:'FAT',color:'#397fba',cal:totals.fat*9}];
 const macroCal=macros.reduce((s,m)=>s+m.cal,0);
 let progress=0;const stops=macros.map(m=>{const start=progress;progress+=macroCal?m.cal/macroCal*100:0;return `${m.color} ${start}% ${progress}%`});
 const gradient=macroCal>0?`conic-gradient(${stops.join(',')})`:'conic-gradient(#dce2df 0 100%)';
 return <><div className="sectionHead"><small>MODULE 04 / TELEMETRY</small><h2>NUTRITION & GOALS</h2><p>Today's recorded nutrient breakdown and optional tracking references.</p></div><button onClick={()=>setRefresh(x=>x+1)}>↻ REFRESH DATA</button>
 <section><h3>MACRO ENERGY BREAKDOWN</h3><div className="macroOverview"><div className="macroDonut" style={{background:gradient}} role="img" aria-label="Proportions of logged macro energy"><div><strong>{Math.round(macroCal)}</strong><small>Cal from macros</small></div></div><div className="macroLegend">{macros.map(m=><div key={m.key}><span className="macroSwatch" style={{background:m.color}}/><strong>{m.label}</strong><span>{Math.round(m.cal)} Cal</span><b>{macroCal?Math.round(m.cal/macroCal*100):0}%</b><small>{Math.round(totals[m.key as Nutrient]*10)/10} g</small></div>)}</div></div><p className="dataNote">Percentages show each macro's share of recorded macro energy (protein and carbohydrates: 4 Cal/g; fat: 9 Cal/g). Food-label calories may differ due to rounding, fiber, and other components. Total food-label energy logged: {Math.round(loggedCal)} Cal.</p><p className="dataNote">For general nutrition-label context, 2,000 Cal is a commonly used reference—not an individual daily target.</p></section>
 <section><h3>FIBER & SODIUM</h3><div className="ringGrid"><Ring label="FIBER" value={totals.fiber} unit="g" max={Number(goals.fiber)||0} color="#5a9b78"/><Ring label="SODIUM" value={totals.sodium} unit="mg" max={Number(goals.sodium)||0} color="#b67b48"/><Ring label="WATER" value={water} unit="mL" max={Number(goals.water)||0} color="#579bb2"/></div><p className="dataNote">Other micronutrients are not yet available in the offline food records.</p></section>
 <section><h3>CUSTOMIZABLE NUTRITION REFERENCES</h3><p>Optional personal reference values for comparing your logs; these are not automatically calculated eating requirements.</p><div className="goalInputs">{(['protein','carbs','fat','fiber','sodium','water'] as const).map(k=><label key={k}>{k.toUpperCase()} ({k==='sodium'?'mg':k==='water'?'mL':'g'})<input type="number" min="0" step="any" value={goals[k]||''} placeholder="No reference" onChange={e=>setGoal(k,e.target.value)}/></label>)}</div></section></>;
}
