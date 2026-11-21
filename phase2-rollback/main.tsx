import AboutSupport from './AboutSupport';
import MissionAnalytics from './MissionAnalytics';
import WorkoutSessions from './WorkoutSessions';
import {addedExercises} from './exerciseAdditions';
import exerciseCatalog from './exerciseCatalog.json';
import React,{useState,useEffect} from 'react';
import{createRoot}from'react-dom/client';
import{Canvas}from'@react-three/fiber';
import{OrbitControls}from'@react-three/drei';
import RealMuscleAtlas from './RealMuscleAtlas';
import './style.css';
import './v35.css';
import './v351.css';
import './v352.css';
import './phase1.css';
import Nutrition from './Nutrition';
import DataOverview from './DataOverview';
import LoadoutCalculator from './LoadoutCalculator';
import MissionWidgets from './MissionWidgets';
type Muscle='chest'|'shoulders'|'biceps'|'triceps'|'forearms'|'upper_back'|'lats'|'abs'|'obliques'|'glutes'|'quads'|'hamstrings'|'calves'|'adductors'|'hip_flexors'|'shins'|'abductors';
type Exercise={id:string;name:string;primary:Muscle;secondary:Muscle[]};
const exerciseList:Exercise[]=[
{id:'bench',name:'Barbell bench press',primary:'chest',secondary:['shoulders','triceps']},
{id:'row',name:'Bent-over row',primary:'upper_back',secondary:['lats','biceps']},
{id:'squat',name:'Bodyweight squat',primary:'quads',secondary:['glutes','abs']},
{id:'press',name:'Overhead press',primary:'shoulders',secondary:['triceps','abs']},
{id:'curl',name:'Dumbbell curl',primary:'biceps',secondary:['forearms']},
{id:'plank',name:'Plank',primary:'abs',secondary:['obliques','shoulders']},
{id:'pulldown',name:'Lat pulldown',primary:'lats',secondary:['biceps','upper_back']},
{id:'pushdown',name:'Cable triceps pushdown',primary:'triceps',secondary:[]},
{id:'rdl',name:'Romanian deadlift',primary:'hamstrings',secondary:['glutes','upper_back']},
{id:'calfraise',name:'Standing calf raise',primary:'calves',secondary:[]},
{id:'lunge',name:'Reverse lunge',primary:'quads',secondary:['glutes','hamstrings']},
{id:'lateralraise',name:'Dumbbell lateral raise',primary:'shoulders',secondary:[]},
{id:'crunch',name:'Abdominal crunch',primary:'abs',secondary:[]},
{id:'sideplank',name:'Side plank',primary:'obliques',secondary:['abs','shoulders']},
{id:'wristcurl',name:'Wrist curl',primary:'forearms',secondary:[]},
{id:'hipthrust',name:'Hip thrust',primary:'glutes',secondary:['hamstrings']}
,
{id:'inclinepress',name:'Incline dumbbell press',primary:'chest',secondary:['shoulders','triceps']},
{id:'pushup',name:'Push-up',primary:'chest',secondary:['triceps','shoulders']},
{id:'cablefly',name:'Cable chest fly',primary:'chest',secondary:['shoulders']},
{id:'pullup',name:'Pull-up',primary:'lats',secondary:['biceps','upper_back']},
{id:'seatedrow',name:'Seated cable row',primary:'upper_back',secondary:['lats','biceps']},
{id:'facepull',name:'Cable face pull',primary:'upper_back',secondary:['shoulders']},
{id:'rearraise',name:'Rear delt fly',primary:'shoulders',secondary:['upper_back']},
{id:'hammer',name:'Hammer curl',primary:'biceps',secondary:['forearms']},
{id:'overheadtri',name:'Overhead triceps extension',primary:'triceps',secondary:[]},
{id:'gobletsquat',name:'Goblet squat',primary:'quads',secondary:['glutes','abs']},
{id:'legpress',name:'Leg press',primary:'quads',secondary:['glutes']},
{id:'legextension',name:'Leg extension',primary:'quads',secondary:[]},
{id:'legcurl',name:'Seated leg curl',primary:'hamstrings',secondary:[]},
{id:'stepup',name:'Step-up',primary:'quads',secondary:['glutes','hamstrings']},
{id:'glutebridge',name:'Glute bridge',primary:'glutes',secondary:['hamstrings']},
{id:'seatedcalf',name:'Seated calf raise',primary:'calves',secondary:[]},
{id:'deadbug',name:'Dead bug',primary:'abs',secondary:['obliques']},
{id:'birdog',name:'Bird dog',primary:'abs',secondary:['glutes','upper_back']},
{id:'pallof',name:'Pallof press',primary:'obliques',secondary:['abs','shoulders']},
{id:'farmer',name:'Farmer carry',primary:'forearms',secondary:['upper_back','abs']},
...addedExercises.map(({id,name,primary,secondary})=>({id,name,primary,secondary})),
...exerciseCatalog.map(({id,name,primary,secondary})=>({id,name,primary:primary as Muscle,secondary:secondary as Muscle[]}))
];
const exercises:Exercise[]=[...exerciseList].sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base',numeric:true}));
const muscleNames:Record<Muscle,string>={chest:'Pectorals',shoulders:'Deltoids',biceps:'Biceps',triceps:'Triceps',forearms:'Forearms',upper_back:'Upper back / trapezius',lats:'Latissimus dorsi',abs:'Rectus abdominis',obliques:'Obliques',glutes:'Gluteals',quads:'Quadriceps',hamstrings:'Hamstrings',calves:'Calves',adductors:'Hip adductors / inner thigh',hip_flexors:'Hip flexors',shins:'Tibialis anterior / shins',abductors:'Hip abductors / outer hip'};
// Original IRON//OS descriptions. No third-party database text or media bundled.
const exerciseDetails:Record<string,{equipment:string;steps:string[]}>={
bench:{equipment:'Barbell / bench',steps:['Set your feet firmly and position your eyes beneath the bar.','Lower the bar in control toward your mid-chest.','Press upward without bouncing or losing your stable position.']},
row:{equipment:'Barbell',steps:['Hinge at the hips with a neutral back and soft knees.','Draw the bar toward your lower ribs, keeping your torso steady.','Lower slowly without rounding your back.']},
squat:{equipment:'Bodyweight',steps:['Stand with feet at a comfortable width.','Bend at hips and knees, keeping your feet planted.','Stand tall with controlled movement.']},
press:{equipment:'Dumbbells / barbell',steps:['Start with the weight near shoulder height.','Press overhead while keeping ribs stacked over hips.','Return with control.']},
curl:{equipment:'Dumbbells',steps:['Keep upper arms close to your sides.','Bend your elbows to raise the weights.','Lower slowly without swinging.']},
plank:{equipment:'Bodyweight',steps:['Set elbows beneath shoulders and extend your legs.','Keep head, hips, and heels aligned.','Breathe normally while holding a stable position.']},
pulldown:{equipment:'Cable machine',steps:['Sit securely and grasp the bar.','Pull toward your upper chest while keeping shoulders down.','Let your arms extend under control.']},
pushdown:{equipment:'Cable machine',steps:['Keep elbows near your sides.','Extend elbows to move the handle down.','Return slowly without moving your shoulders.']},
rdl:{equipment:'Barbell / dumbbells',steps:['Stand tall with a slight bend in the knees.','Push hips backward while keeping weights close to legs.','Stand by driving hips forward without rounding your back.']},
calfraise:{equipment:'Bodyweight / machine',steps:['Stand on a stable surface.','Rise onto the balls of your feet.','Lower heels slowly.']},
lunge:{equipment:'Bodyweight / dumbbells',steps:['Step backward into a comfortable split stance.','Bend both knees while keeping your front foot grounded.','Push through the front leg to return.']},
lateralraise:{equipment:'Dumbbells',steps:['Stand tall with light weights at your sides.','Raise arms out to the sides to about shoulder level.','Lower without shrugging.']},
crunch:{equipment:'Mat',steps:['Lie on your back with knees bent.','Curl your upper torso slightly while keeping your neck relaxed.','Lower with control.']},
sideplank:{equipment:'Mat',steps:['Place your elbow below your shoulder.','Lift your hips to form a straight line.','Breathe steadily and lower with control.']},
wristcurl:{equipment:'Dumbbell',steps:['Rest forearm on a stable surface with wrist free.','Curl the weight using your wrist.','Return slowly.']},
hipthrust:{equipment:'Bench / weight optional',steps:['Support your upper back on a stable bench.','Drive through your feet to lift hips.','Pause briefly and lower in control.']},
}
const extraDetails:Record<string,[string,string,string,string]>={
inclinepress:['Dumbbells / incline bench','Set the bench to a moderate incline and position weights beside your upper chest.','Press upward without flaring elbows excessively.','Lower with control.'],
pushup:['Bodyweight','Place hands beneath or slightly wider than shoulders.','Lower your body as one line to a comfortable depth.','Push the floor away to return.'],
cablefly:['Cable machine','Stand between cable handles with a staggered stance.','Bring hands together in front of your chest with soft elbows.','Return slowly without overstretching.'],
pullup:['Pull-up bar','Hang with a comfortable grip and shoulders engaged.','Pull your chest upward without swinging.','Lower with control.'],
seatedrow:['Cable machine','Sit tall with feet braced and reach for the handle.','Pull toward your torso while drawing elbows backward.','Extend arms slowly without rounding.'],
facepull:['Cable machine','Set the rope around face height.','Pull toward your face with elbows traveling outward.','Return slowly, keeping shoulders comfortable.'],
rearraise:['Dumbbells','Hinge forward slightly with a neutral back.','Raise arms outward with soft elbows.','Lower slowly.'],
hammer:['Dumbbells','Hold dumbbells with palms facing inward.','Curl weights without swinging upper arms.','Lower slowly.'],
overheadtri:['Dumbbell / cable','Hold weight securely overhead with elbows bent.','Extend elbows while keeping upper arms steady.','Lower in control.'],
gobletsquat:['Dumbbell / kettlebell','Hold weight close to your chest.','Sit down between your hips while keeping feet planted.','Stand up smoothly.'],
legpress:['Leg press machine','Adjust the seat for a comfortable knee bend.','Push the platform away without locking knees forcefully.','Return slowly within a comfortable range.'],
legextension:['Leg extension machine','Adjust the machine so knees align with its pivot.','Extend legs smoothly.','Lower without dropping the weight.'],
legcurl:['Leg curl machine','Align knees with the machine pivot and secure pads.','Bend knees to draw the pad toward you.','Return slowly.'],
stepup:['Stable step / bench','Place one foot fully on a stable low platform.','Press through that foot to stand on the platform.','Step down under control.'],
glutebridge:['Mat','Lie on your back with knees bent and feet planted.','Lift hips by pressing through your feet.','Lower slowly.'],
seatedcalf:['Seated calf machine','Sit with balls of feet on the platform.','Raise heels by pressing through the feet.','Lower slowly.'],
deadbug:['Mat','Lie on your back with arms up and knees bent above hips.','Extend opposite arm and leg slowly while keeping trunk steady.','Return and alternate sides.'],
birdog:['Mat','Begin on hands and knees with a neutral spine.','Reach opposite arm and leg outward without twisting.','Return and switch sides.'],
pallof:['Cable / resistance band','Stand sideways to the anchor and hold handle at chest.','Press hands forward without letting your torso rotate.','Return slowly and repeat on both sides.'],
farmer:['Dumbbells / kettlebells','Hold weights securely at your sides.','Walk with steady steps and an upright posture.','Set weights down with control.']
};
for(const [id,entry] of Object.entries(extraDetails))exerciseDetails[id]={equipment:entry[0],steps:entry.slice(1)};
for(const entry of addedExercises)exerciseDetails[entry.id]={equipment:entry.equipment,steps:entry.steps};
for(const entry of exerciseCatalog)exerciseDetails[entry.id]={equipment:entry.equipment,steps:entry.steps};
type SetEntry={id:number;exerciseId:string;reps:number;weight:number;at:string};
function loadSets():SetEntry[]{try{return JSON.parse(localStorage.getItem('iron-sets')||'[]')}catch{return []}}
const colors:Record<Muscle,string>={chest:'#d67a4c',shoulders:'#d8a05b',biceps:'#bc8066',triceps:'#a76b55',forearms:'#b8a083',upper_back:'#7fa18d',lats:'#608e86',abs:'#d7ad69',obliques:'#b9a77d',glutes:'#b68172',quads:'#cba07b',hamstrings:'#a98372',calves:'#a9b7a3',adductors:'#a7a18a',hip_flexors:'#c1a27b',shins:'#8da7a1',abductors:'#a88893'};
function Part({position,scale,muscle,selected,onPick,rotation}:{position:[number,number,number];scale:[number,number,number];muscle:Muscle;selected:Muscle|null;onPick:(m:Muscle)=>void;rotation?:[number,number,number]}){return <mesh position={position} scale={scale} rotation={rotation||[0,0,0]} onClick={e=>{e.stopPropagation();onPick(muscle)}}><sphereGeometry args={[1,20,14]}/><meshStandardMaterial color={selected===muscle?'#ffb24d':colors[muscle]} roughness={0.7} metalness={0.08} emissive={selected===muscle?'#633000':'#000000'}/></mesh>}
function Body({selected,onPick}:{selected:Muscle|null;onPick:(m:Muscle)=>void}){
const part=(m:Muscle,p:[number,number,number],sc:[number,number,number],key:string,rot?:[number,number,number])=><Part key={key} position={p} scale={sc} rotation={rot} muscle={m} selected={selected} onPick={onPick}/>;
const base=(p:[number,number,number],sc:[number,number,number],key:string)=><mesh key={key} position={p} scale={sc}><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color="#c4b5a4" roughness={.87}/></mesh>;
return <group>
{base([0,2.57,0],[.28,.35,.25],'skull')}{base([0,2.11,0],[.15,.22,.14],'neck')}
{base([0,1.35,-.015],[.52,.75,.29],'ribcage')}{base([0,.45,-.015],[.39,.37,.29],'pelvis')}
{([-1,1] as const).map(side=><React.Fragment key={side}>
{base([side*.98,.17,0],[.115,.18,.12],`hand${side}`)}{base([side*.29,-2.16,.12],[.18,.12,.34],`foot${side}`)}
{part('chest',[side*.29,1.72,.24],[.30,.23,.16],`pec${side}`,[0,0,side*-.13])}
{part('shoulders',[side*.67,1.81,0],[.26,.28,.27],`delt${side}`)}
{part('biceps',[side*.81,1.31,.14],[.145,.34,.15],`bic${side}`,[0,0,side*-.10])}
{part('triceps',[side*.82,1.32,-.14],[.15,.36,.14],`tri${side}`)}
{part('forearms',[side*.94,.70,.015],[.14,.38,.14],`fore${side}`)}
{part('upper_back',[side*.25,1.76,-.235],[.30,.33,.14],`trap${side}`)}
{part('lats',[side*.35,1.20,-.20],[.22,.41,.15],`lat${side}`,[0,0,side*-.13])}
{part('obliques',[side*.40,.86,.11],[.13,.38,.16],`ob${side}`)}
{part('glutes',[side*.24,.30,-.22],[.24,.29,.20],`glute${side}`)}
{part('quads',[side*.27,-.55,.13],[.22,.66,.22],`quad${side}`)}
{part('hamstrings',[side*.27,-.56,-.17],[.20,.64,.18],`ham${side}`)}
{part('calves',[side*.28,-1.54,-.09],[.16,.51,.18],`calf${side}`)}
{[0,1,2,3].map(i=>part('abs',[side*.13,1.26-i*.20,.265],[.125,.085,.075],`abs${side}-${i}`))}
</React.Fragment>)}
</group>}
function Atlas({selected,onPick,onInspect,onStats,view,secondary,modelSex,isolateFemale}:{selected:Muscle|null;onPick:(m:Muscle|null)=>void;onInspect?:(name:string)=>void;onStats?:(stats:Record<string,number>)=>void;view:'front'|'back'|'free';secondary?:Muscle[];modelSex:'male'|'female';isolateFemale?:boolean}){
return <div className="viewer"><Canvas camera={{position:[0,0,7.5],fov:40}} dpr={[1,1.75]} gl={{antialias:true}}><color attach="background" args={['#192427']}/><ambientLight intensity={1.8}/><directionalLight position={[3,5,5]} intensity={2.5}/><directionalLight position={[-3,2,-5]} intensity={1.6}/><RealMuscleAtlas modelSex={modelSex} isolateFemale={isolateFemale} secondary={secondary} selected={selected} onPick={onPick} onInspect={onInspect} onStats={onStats} view={view}/><OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={12} enableDamping dampingFactor={0.08}/></Canvas><span className="viewerLabel">{modelSex==='female'?'CHERA / MIRRORED STUDY MODEL':'Z-ANATOMY / MUSCULAR SYSTEM'} · PINCH TO ZOOM</span></div>}
function TabIcon({name}:{name:string}){const common={fill:"none",stroke:"currentColor",strokeWidth:2.2,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};return <svg className="retroTabIcon" viewBox="0 0 32 32" aria-hidden="true" {...common}>{name==='HOME'?<><path d="M4 15 16 5l12 10v12H4z"/><path d="M12 27v-9h8v9"/><circle cx="16" cy="11" r="1.5" fill="currentColor" stroke="none"/></>:name==='TRAIN'?<><path d="M3 12v8m4-12v16m4-13v10m10-10v10m4-13v16m4-12v8M7 16h18"/></>:name==='ATLAS'?<><circle cx="16" cy="7" r="4"/><path d="M9 14 5 22m18-8 4 8M11 14l5 4 5-4M16 18v10m0-10-5 10m5-10 5 10"/></>:name==='FOOD'?<><path d="M8 4v11m-4-11v9c0 4 8 4 8 0V4M8 15v13M22 4c-5 3-6 10-6 15h8V4zM22 19v9"/></>:<><rect x="5" y="5" width="22" height="22" rx="3"/><path d="M10 21V15m6 6V10m6 11v-8M9 24h14"/></>}</svg>}
function App(){const[tab,setTab]=useState('HOME');const[modelSex,setModelSex]=useState<'male'|'female'>(()=>localStorage.getItem('iron-atlas-model')==='female'?'female':'male');const[selected,setSelected]=useState<Muscle|null>(null);const[inspectedMesh,setInspectedMesh]=useState('Tap a muscle to identify its original mesh');const[atlasStats,setAtlasStats]=useState<Record<string,number>>({});const[isolateFemale,setIsolateFemale]=useState(false);const[query,setQuery]=useState('');const[libraryOpen,setLibraryOpen]=useState(false);const[trainQuery,setTrainQuery]=useState('');const[weeklyPlan,setWeeklyPlan]=useState<Record<string,string[]>>(()=>{try{return JSON.parse(localStorage.getItem('iron-weekly-plan-v11')||'{}')}catch{return {}}});const[planEdit,setPlanEdit]=useState(false);const[weeklyOpen,setWeeklyOpen]=useState(true);const[equipmentFilter,setEquipmentFilter]=useState('ALL');const[expanded,setExpanded]=useState<string|null>(null);const[atlasExercise,setAtlasExercise]=useState<string>('');const[showSecondary,setShowSecondary]=useState(false);const[planPickerExercise,setPlanPickerExercise]=useState<string|null>(null);const[planSearch,setPlanSearch]=useState<Record<string,string>>({});const[planNames,setPlanNames]=useState<Record<string,string>>(()=>{try{return JSON.parse(localStorage.getItem('iron-plan-names-v35')||'{}')}catch{return {}}});const[atlasView,setAtlasView]=useState<'front'|'back'|'free'>('front');const[sets,setSets]=useState<SetEntry[]>(loadSets);const[exercise,setExercise]=useState('bench');const[reps,setReps]=useState('8');const[weight,setWeight]=useState('0');const[food,setFood]=useState('');const[foods,setFoods]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('iron-foods')||'[]')}catch{return []}});useEffect(()=>localStorage.setItem('iron-atlas-model',modelSex),[modelSex]);useEffect(()=>localStorage.setItem('iron-sets',JSON.stringify(sets)),[sets]);useEffect(()=>localStorage.setItem('iron-foods',JSON.stringify(foods)),[foods]);useEffect(()=>localStorage.setItem('iron-weekly-plan-v11',JSON.stringify(weeklyPlan)),[weeklyPlan]);useEffect(()=>localStorage.setItem('iron-plan-names-v35',JSON.stringify(planNames)),[planNames]);const todayKey=(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})();const todaySets=sets.filter(x=>x.at.slice(0,10)===todayKey);const todayMeals=(()=>{try{return (JSON.parse(localStorage.getItem('iron-nutrition-v06')||'[]') as {day:string;calories:number;servings:number}[]).filter(x=>x.day===todayKey).reduce((sum,x)=>sum+(Number(x.calories)||0)*(Number(x.servings)||0),0)}catch{return 0}})();const weekdays=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];const templates=[
 ['bench','inclinepress','press','lateralraise','pushdown','overheadtri'],
 ['pullup','row','seatedrow','facepull','curl','hammer'],
 ['squat','legpress','rdl','legcurl','calfraise','lunge'],
 ['inclinepress','pushup','cablefly','press','lateralraise','pushdown'],
 ['pulldown','seatedrow','rearraise','row','hammer','curl'],
 ['gobletsquat','hipthrust','plank','sideplank','deadbug','pallof'],
 []];const defaultNames=['Push A','Pull A','Legs A','Push B','Pull B','Legs + Core','Rest'];const createPlan=()=>{if(Object.keys(weeklyPlan).length&&!window.confirm('Replace your existing weekly plan with the Push/Pull/Legs template?'))return;setWeeklyPlan(Object.fromEntries(weekdays.map((d,i)=>[d,templates[i]])));setPlanNames(Object.fromEntries(weekdays.map((d,i)=>[d,defaultNames[i]])));setPlanEdit(true)};const chosen=exercises.find(e=>e.id===exercise)!;const related=exercises.filter(e=>(!selected||e.primary===selected||e.secondary.includes(selected))&&e.name.toLowerCase().includes(query.toLowerCase())&&(equipmentFilter==='ALL'||exerciseDetails[e.id]?.equipment.toLowerCase().includes(equipmentFilter.toLowerCase())));function logSet(){const r=Number(reps),w=Number(weight);if(!Number.isFinite(r)||!Number.isFinite(w)||r<0||w<0||r>1000)return;setSets(s=>[{id:Date.now(),exerciseId:exercise,reps:r,weight:w,at:new Date().toISOString()},...s])}return <div className="app"><header><div><small>PERSONAL FITNESS COMPUTER // 1987</small><h1>IRON<span>//</span>OS</h1></div><div className="serial">SYS ONLINE<br/>REV 3.3</div></header><div className="stripe"/><main>{tab==='HOME'&&<><section className="hero"><small>MISSION CONTROL / STATUS</small><h2>TRAINING SYSTEM<br/>READY.</h2><p>Offline operation enabled. All records stay on this device.</p><button onClick={()=>{if(!Object.keys(weeklyPlan).length)createPlan();setTab('TRAIN')}}>OPEN WEEKLY WORKOUT PLAN →</button></section><MissionWidgets plan={weeklyPlan} planNames={planNames}/><section><h3>THIS WEEK'S TRAINING</h3><p>{Object.keys(weeklyPlan).length?'Your weekly plan is ready to review and edit.':'Create an editable weekly template based on a mix of exercise groups.'}</p><button className="wide" onClick={()=>{if(!Object.keys(weeklyPlan).length)createPlan();setTab('TRAIN')}}>VIEW / EDIT WEEKLY PLAN →</button></section></>}{tab==='ATLAS'&&<><div className="moduleHero moduleAtlas"><small>MODULE 02 / ANATOMY LAB</small><h2>MUSCLE ATLAS</h2><p>Interactive anatomy · Targeted training</p></div><div className="sectionHead"><small>MODULE 02 / BIOMECHANICS</small><h2>MUSCLE ATLAS</h2><p>Rotate the body and tap a muscle region to see related exercises.</p></div><div className="atlasToolbar"><button className={modelSex==='male'?'active':''} onClick={()=>{setModelSex('male');setSelected(null);setAtlasStats({})}}>MALE ATLAS</button><button className={modelSex==='female'?'active':''} onClick={()=>{setModelSex('female');setSelected(null);setAtlasStats({})}}>FEMALE ATLAS</button></div><div className="atlasToolbar"><button className={atlasView==='front'?'active':''} onClick={()=>setAtlasView('front')}>FRONT</button><button className={atlasView==='back'?'active':''} onClick={()=>setAtlasView('back')}>BACK</button><button className={atlasView==='free'?'active':''} onClick={()=>setAtlasView('free')}>FREE ROTATE</button><button onClick={()=>{setSelected(null);setAtlasExercise('');setShowSecondary(false)}}>CLEAR</button></div><Atlas modelSex={modelSex} isolateFemale={isolateFemale} selected={selected} onPick={m=>{setSelected(m);setAtlasExercise('');setShowSecondary(false)}} onInspect={setInspectedMesh} onStats={setAtlasStats} view={atlasView} secondary={exercises.find(e=>e.id===atlasExercise)?.secondary||[]}/>{modelSex==='female'&&<div className="atlasToolbar"><button type="button" className={isolateFemale?'active':''} aria-pressed={isolateFemale} onClick={()=>setIsolateFemale(v=>!v)}>{isolateFemale?'SHOW FULL ANATOMY':'ISOLATE SELECTED MUSCLES'}</button></div>}<div className="atlasReadout"><small>ANATOMY DIAGNOSTIC · SOURCE MESH</small><div style={{fontSize:12,overflowWrap:"anywhere",marginBottom:8}}>{inspectedMesh}</div><small>SELECTED MUSCLE</small><div style={{fontSize:11,marginBottom:5}}>MAPPED GEOMETRY: {selected?(atlasStats[selected]??0):"—"} MESHES</div><strong>{selected?muscleNames[selected]:'Tap a muscle or choose a region below'}</strong><small>{selected?`${related.length} RELATED EXERCISES`:'ROTATE / ZOOM / INSPECT'}</small></div><div className="chips">{(Object.keys(colors) as Muscle[]).map(m=><button key={m} className={selected===m?'active':''} disabled={false} title={modelSex==='female' && (atlasStats[m]??0)===0?'No mapped mesh detected in the loaded model; selection remains available for diagnosis':muscleNames[m]} onClick={()=>{setSelected(selected===m?null:m);setAtlasExercise('');setShowSecondary(false)}}>{muscleNames[m].toUpperCase()}{modelSex==='female' && (atlasStats[m]??0)===0?' · 0 MESHES':''}</button>)}</div><section><button className="libraryDisclosure" aria-expanded={libraryOpen} onClick={()=>setLibraryOpen(v=>!v)}>{libraryOpen?'▾':'▸'} {selected?muscleNames[selected].toUpperCase()+' / EXERCISES':'OFFLINE EXERCISE LIBRARY'} ({related.length})</button>{libraryOpen&&<><label>SEARCH EXERCISES<input placeholder="Search by name" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>EQUIPMENT<select value={equipmentFilter} onChange={e=>setEquipmentFilter(e.target.value)}>{['ALL','Bodyweight','Dumbbell','Barbell','Cable','Machine','Mat'].map(x=><option key={x}>{x}</option>)}</select></label><small>{related.length} EXERCISES MATCH · NO NETWORK REQUIRED</small>{related.slice(0,150).map(e=><div className="line" key={e.id}><span>{e.name}<small>{exerciseDetails[e.id]?.equipment} · {e.primary.toUpperCase()}</small><button className="detailToggle" onClick={()=>setExpanded(expanded===e.id?null:e.id)}>{expanded===e.id?'HIDE':'INSTRUCTIONS'} ↓</button>{expanded===e.id&&<ol className="instructions">{exerciseDetails[e.id]?.steps.map((step,i)=><li key={i}>{step}</li>)}</ol>}</span><div className="v35Actions"><button onClick={()=>{setAtlasExercise(e.id);setSelected(e.primary)}}>SHOW MUSCLES</button><button onClick={()=>setPlanPickerExercise(e.id)}>+ PLAN DAY</button><button onClick={()=>{setExercise(e.id);setTab('TRAIN')}}>LOG →</button></div></div>)}</>}</section>{planPickerExercise&&<div className="v351Overlay" role="presentation" onClick={()=>setPlanPickerExercise(null)}><div className="v351Dialog" role="dialog" aria-modal="true" aria-label="Choose planned workout day" onClick={ev=>ev.stopPropagation()}><div className="v351DialogHead"><div><small>MISSION PLANNER / ASSIGN EXERCISE</small><h3>SELECT WORKOUT DAY</h3></div><button type="button" onClick={()=>setPlanPickerExercise(null)}>CLOSE ✕</button></div><p>{exercises.find(e=>e.id===planPickerExercise)?.name}</p><div className="v351DayScroll">{weekdays.map(d=><button key={d} type="button" onClick={()=>{setWeeklyPlan(p=>({...p,[d]:[...(p[d]||[]),planPickerExercise]}));setPlanPickerExercise(null)}}><strong>{d.toUpperCase()}</strong><span>{planNames[d]||'Workout'} · {(weeklyPlan[d]||[]).length} exercises</span><b>＋</b></button>)}</div></div></div>}</>}{tab==='TRAIN'&&<><div className="moduleHero moduleTrain"><small>MODULE 01 / TRAINING BAY</small><h2>WORKOUT LOG</h2><p>Weekly plan · Exercise library · Session records</p></div><section><button type="button" className="weeklyToggle" aria-expanded={weeklyOpen} onClick={()=>setWeeklyOpen(x=>!x)}><span>WEEKLY WORKOUT PLAN</span><span>{weeklyOpen?"▴":"▾"}</span></button>{weeklyOpen&&<div className="weeklyBody"><datalist id="v35-exercises">{exercises.map(e=><option key={e.id} value={e.name}/>)}</datalist><div className="planActions"><button onClick={createPlan}>GENERATE TEMPLATE</button><button onClick={()=>setPlanEdit(x=>!x)}>{planEdit?'FINISH EDITING':'EDIT PLAN'}</button></div>{weekdays.map(d=>{const items=weeklyPlan[d]||[];const exerciseRows=items.map((id,i)=><div className="planExercise" key={d+i}>{planEdit?<><input list="v35-exercises" aria-label={`Exercise ${i+1} on ${d}`} value={exercises.find(x=>x.id===id)?.name||id} onChange={e=>{const found=exercises.find(x=>x.name.toLowerCase()===e.target.value.toLowerCase());if(found)setWeeklyPlan(a=>({...a,[d]:a[d].map((x,j)=>j===i?found.id:x)}))}}/></>:<span>{exercises.find(x=>x.id===id)?.name||id}</span>}{planEdit&&<button onClick={()=>setWeeklyPlan(a=>({...a,[d]:a[d].filter((_,j)=>j!==i)}))}>REMOVE</button>}</div>);return <div className="planDay" key={d}>{planEdit?<><strong>{d.toUpperCase()}</strong><input aria-label={`${d} workout name`} placeholder="Workout name" value={planNames[d]||""} onChange={e=>setPlanNames(a=>({...a,[d]:e.target.value}))}/>{exerciseRows}{!items.length&&<small>Rest / open day</small>}<input list="v35-exercises" placeholder="Search to add an exercise..." aria-label={`Add exercise to ${d}`} value={planSearch[d]||''} onChange={e=>{const value=e.target.value;setPlanSearch(p=>({...p,[d]:value}));const found=exercises.find(x=>x.name.toLowerCase()===value.toLowerCase());if(found){setWeeklyPlan(a=>({...a,[d]:[...(a[d]||[]),found.id]}));setPlanSearch(p=>({...p,[d]:''}))}}}/></>:items.length?<details className="planDisclosure"><summary><strong>{d.toUpperCase()} · {planNames[d]||"WORKOUT"}</strong><span className="planCount">{items.length} {items.length===1?'EXERCISE':'EXERCISES'}</span><span className="planChevron" aria-hidden="true">⌄</span></summary><div className="planContents">{exerciseRows}</div></details>:<><strong>{d.toUpperCase()}</strong><small>Rest / open day</small></>}</div>})}</div>}</section><WorkoutSessions exercises={exercises} plan={weeklyPlan} planNames={planNames}/><section className="v351LoadoutSection"><LoadoutCalculator/></section></>}{tab==='FOOD'&&<><div className="moduleHero moduleFood"><small>MODULE 03 / FUEL STATION</small><h2>NUTRITION</h2><p>Food records · Hydration · Recipes</p></div><Nutrition/></>}{tab==='DATA'&&<><div className="moduleHero moduleData"><small>MODULE 04 / DATA TERMINAL</small><h2>PROGRESS</h2><p>Trends · Logs · Insights</p></div><MissionAnalytics exercises={exercises}/><details className="dataAboutSection"><summary>ABOUT IRON//OS · SOURCES & SUPPORT</summary><AboutSupport/></details></>}</main><nav>{['HOME','TRAIN','ATLAS','FOOD','DATA'].map(t=><button key={t} className={tab===t?'selected':''} onClick={()=>setTab(t)}>{<TabIcon name={t}/>}<span className="navText">{t}</span></button>)}</nav></div>}
createRoot(document.getElementById('root')!).render(<App/>);
