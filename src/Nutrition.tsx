import TealFavoriteStar from './TealFavoriteStar';
import React,{useEffect,useMemo,useState} from 'react';
import {offlineFoods,usdaOfflineFoods,usdaBrandedOfflineFoods,commonFoodFallback,type Food} from './foodDatabase';
import './nutrition.css';
import './nutrition-v36.css';
import NutritionGoals from './NutritionGoals';
type Meal='Breakfast'|'Lunch'|'Dinner'|'Snacks';
type Entry={id:number;day:string;meal:Meal;name:string;servings:number;calories:number;protein:number;carbs:number;fat:number;fiber:number;sodium:number};
type Water={day:string;ml:number;id?:number};
type Unit='mL'|'fl oz'|'cups'|'L';
const KEY='iron-nutrition-v06';
const DAY=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function read<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
const meals:Meal[]=['Breakfast','Lunch','Dinner','Snacks'];
const fields=['calories','protein','carbs','fat','fiber','sodium'] as const;
type Nutrient=typeof fields[number];
const empty=()=>({calories:'0',protein:'0',carbs:'0',fat:'0',fiber:'0',sodium:'0'});
const round=(v:number)=>Math.round(v*10)/10;
const normalizeBarcode=(code:string)=>code.replace(/\D/g,'').replace(/^0+(?=\d{12}$)/,'');
const measureGrams:Record<string,number>={g:1,oz:28.349523125,lb:453.59237,kg:1000};
function packageGrams(portion:string):number|null{const m=portion.match(/(\d+(?:\.\d+)?)\s*(g|kg|oz|lb)\b/i);return m?Number(m[1])*measureGrams[m[2].toLowerCase()]:null}

const unitFactors:Record<Unit,number>={'mL':1,'fl oz':29.5735295625,'cups':236.5882365,'L':1000};
const displayWater=(ml:number,u:Unit)=>round(ml/unitFactors[u]);
const REFERENCE_KEY='iron-nutrition-references-v14';
type NutritionReferences={calories:number;fiber:number;sodium:number;waterMl:number};
const DEFAULT_REFERENCES:NutritionReferences={calories:2000,fiber:28,sodium:2300,waterMl:8*unitFactors.cups};
const referenceFields=[['calories','ENERGY','Cal'],['fiber','FIBER','g'],['sodium','SODIUM','mg']] as const;
function validReference(value:unknown,fallback:number){const n=Number(value);return Number.isFinite(n)&&n>0&&n<=100000?n:fallback}

function productFood(p:any,code:string):Food{
 const n=p.nutriments||{};
 const get=(key:string)=>{const v=Number(n[key]);return Number.isFinite(v)&&v>=0?v:null};
 const label=String(p.serving_size||'').trim();
 const weightMatch=label.match(/(\d+(?:\.\d+)?)\s*(g|kg|oz|lb)\b/i);
 const grams=weightMatch?Number(weightMatch[1])*measureGrams[weightMatch[2].toLowerCase()]:null;
 const servingCal=get('energy-kcal_serving');
 const per100Cal=get('energy-kcal_100g');
 // Prefer manufacturer-provided per-serving nutrients. Never assume a unitless package is 100 g.
 const useServing=servingCal!==null || get('proteins_serving')!==null || get('carbohydrates_serving')!==null || get('fat_serving')!==null;
 const value=(base:string)=>{
  const perServing=get(base+'_serving');
  const per100=get(base+'_100g');
  if(perServing!==null)return perServing;
  if(per100!==null && grams!==null)return per100*grams/100;
  return per100??0;
 };
 const energy=servingCal!==null?servingCal:per100Cal!==null&&grams!==null?per100Cal*grams/100:per100Cal??0;
 return {id:`off-${code}`,name:String(p.product_name||p.product_name_en||'Unnamed product'),brand:String(p.brands||'').trim(),barcode:String(p.code||code),countries:Array.isArray(p.countries_tags)?p.countries_tags.map(String):[],source:'Open Food Facts',servingVerified:grams!==null,
  portion:label||(useServing?'1 serving (weight unavailable)':'100 g (package serving unavailable)'),calories:round(energy),protein:round(value('proteins')),
  carbs:round(value('carbohydrates')),fat:round(value('fat')),fiber:round(value('fiber')),
  sodium:round(value('sodium')*1000)};
}

// Display-only normalization: never alter stored food identifiers or nutrient values.
function readableFoodName(raw:string):string{
 let name=raw.trim().replace(/\s+/g,' ').replace(/\s*,\s*/g,', ');
 name=name.replace(/^(?:FOOD,?\s*)/i,'');
 if(name.length>3 && name===name.toUpperCase())name=name.toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase());
 return name;
}
function BarcodeCamera({onFound,onClose}:{onFound:(value:string)=>void;onClose:()=>void}){
 const video=React.useRef<HTMLVideoElement>(null);
 const [status,setStatus]=useState('Starting camera…');
 useEffect(()=>{
  let active=true;let stream:MediaStream|null=null;let frame=0;
  const stop=()=>{active=false;cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());if(video.current)video.current.srcObject=null};
  (async()=>{
   try{
    const Detector=(window as any).BarcodeDetector;
    if(!Detector){setStatus('Camera barcode detection is unavailable on this Android WebView. Enter the barcode manually.');return}
    if(!navigator.mediaDevices?.getUserMedia){setStatus('Camera access is unavailable. Enter the barcode manually.');return}
    const detector=new Detector({formats:['ean_13','ean_8','upc_a','upc_e','code_128']});
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
    if(!active){stream.getTracks().forEach(t=>t.stop());return}
    const v=video.current;if(!v)return;
    v.srcObject=stream;await v.play();setStatus('Point the camera at a product barcode.');
    let busy=false;
    const scan=async()=>{
     if(!active)return;
     if(!busy&&v.readyState>=2){busy=true;try{const found=await detector.detect(v);const code=String(found?.[0]?.rawValue||'').replace(/\D/g,'');if(/^\d{8,14}$/.test(code)){stop();onFound(code);return}}catch{}finally{busy=false}}
     if(active)frame=requestAnimationFrame(scan);
    };frame=requestAnimationFrame(scan);
   }catch(e){if(active)setStatus('Camera unavailable or permission denied. Use manual barcode entry.');stream?.getTracks().forEach(t=>t.stop())}
  })();return stop;
 },[onFound]);
 return <div className="foodScanner"><div className="foodScannerHeader"><strong>SCAN PRODUCT BARCODE</strong><button type="button" onClick={onClose}>CLOSE CAMERA</button></div><video ref={video} muted playsInline autoPlay aria-label="Barcode camera preview"/><small role="status">{status}</small></div>;
}

export default function Nutrition(){
 const [day,setDay]=useState(DAY);
 const [entries,setEntries]=useState<Entry[]>(()=>read(KEY,[]));
 const [water,setWater]=useState<Water[]>(()=>read('iron-water-v06',[]));
 const [unit,setUnit]=useState<Unit>(()=>read('iron-water-unit','cups'));
 const [meal,setMeal]=useState<Meal>('Breakfast');
 const [picker,setPicker]=useState(false);
 const [editingId,setEditingId]=useState<number|null>(null);
 const [search,setSearch]=useState('');
 const [customFoods,setCustomFoods]=useState<Food[]>(()=>read('iron-custom-foods-v07',[]));
 const [selectedFood,setSelectedFood]=useState<Food|null>(null);
 const [favorites,setFavorites]=useState<string[]>(()=>read('iron-food-favorites-v36',[]));
 const [recentFoods,setRecentFoods]=useState<string[]>(()=>read('iron-food-recent-v36',[]));
 useEffect(()=>localStorage.setItem('iron-food-favorites-v36',JSON.stringify(favorites)),[favorites]);
 useEffect(()=>localStorage.setItem('iron-food-recent-v36',JSON.stringify(recentFoods)),[recentFoods]);
 const [customMode,setCustomMode]=useState(false);
 const [name,setName]=useState('');
 const [portion,setPortion]=useState('1 serving');
 const [servings,setServings]=useState('1');
 const [foodMeasure,setFoodMeasure]=useState('serving');
 const [foodQuantity,setFoodQuantity]=useState('1');
 const [nutrients,setNutrients]=useState<Record<Nutrient,string>>(empty);
 const [waterAmount,setWaterAmount]=useState('1');
 const [barcode,setBarcode]=useState('');
 const [barcodeMode,setBarcodeMode]=useState(false);
 const [cameraOpen,setCameraOpen]=useState(false);
 const [onlineToolsOpen,setOnlineToolsOpen]=useState(false);
 const [onlineFoods,setOnlineFoods]=useState<Food[]>(()=>read('iron-product-cache-v08',[]));
 useEffect(()=>localStorage.setItem('iron-product-cache-v08',JSON.stringify(onlineFoods.slice(0,200))),[onlineFoods]);
 const [lookupState,setLookupState]=useState('');
 const [barcodeCorrections,setBarcodeCorrections]=useState<Record<string,Food>>(()=>read('iron-barcode-corrections-v1',{}));
 useEffect(()=>localStorage.setItem('iron-barcode-corrections-v1',JSON.stringify(barcodeCorrections)),[barcodeCorrections]);
 const [servingEdit,setServingEdit]=useState(false);
 const [servingDraft,setServingDraft]=useState('');
 const [usOnly,setUsOnly]=useState<boolean>(()=>read('iron-us-products-only-v13',true));
 useEffect(()=>localStorage.setItem('iron-us-products-only-v13',JSON.stringify(usOnly)),[usOnly]);
 const [recipeMode,setRecipeMode]=useState(false);
 const [recipeName,setRecipeName]=useState('');
 const [recipeParts,setRecipeParts]=useState<{food:Food;quantity:number}[]>([]);
 const [recipeQuantity,setRecipeQuantity]=useState('1');
 const [references,setReferences]=useState<NutritionReferences>(()=>{const saved=read<Partial<NutritionReferences>>(REFERENCE_KEY,{});return {calories:validReference(saved.calories,DEFAULT_REFERENCES.calories),fiber:validReference(saved.fiber,DEFAULT_REFERENCES.fiber),sodium:validReference(saved.sodium,DEFAULT_REFERENCES.sodium),waterMl:validReference(saved.waterMl,DEFAULT_REFERENCES.waterMl)}});
 const [editReferences,setEditReferences]=useState(false);
 const [referenceDraft,setReferenceDraft]=useState({calories:'2000',fiber:'28',sodium:'2300',water:'8'});
 useEffect(()=>localStorage.setItem(REFERENCE_KEY,JSON.stringify(references)),[references]);
 const startEditReferences=()=>{setReferenceDraft({calories:String(references.calories),fiber:String(references.fiber),sodium:String(references.sodium),water:String(round(references.waterMl/unitFactors[unit]))});setEditReferences(true)};
 const saveReferences=()=>{const next={calories:Number(referenceDraft.calories),fiber:Number(referenceDraft.fiber),sodium:Number(referenceDraft.sodium),waterMl:Number(referenceDraft.water)*unitFactors[unit]};if(Object.values(next).some(n=>!Number.isFinite(n)||n<=0||n>100000))return;setReferences(next);setEditReferences(false)};
 const resetReferences=()=>{setReferences({...DEFAULT_REFERENCES});setReferenceDraft({calories:'2000',fiber:'28',sodium:'2300',water:String(round(DEFAULT_REFERENCES.waterMl/unitFactors[unit]))})};
 const [waterGoal,setWaterGoal]=useState<number>(()=>read('iron-water-goal-ml',0));
 useEffect(()=>localStorage.setItem('iron-water-goal-ml',JSON.stringify(waterGoal)),[waterGoal]);
 useEffect(()=>{if(!picker)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old}},[picker]);
 const fetchBarcode=async(overrideCode?:string)=>{
  const code=(overrideCode??barcode).trim();
  if(!/^\d{8,14}$/.test(code)){setLookupState('Enter a valid 8–14 digit barcode.');return}
  const key=normalizeBarcode(code);
  const corrected=barcodeCorrections[key];
  if(corrected){setBarcode('');chooseFood(corrected);setLookupState('Using your saved package-label correction (offline).');return}
  const local=usdaBrandedOfflineFoods.find(f=>f.barcode&&normalizeBarcode(f.barcode)===key);
  setLookupState(local?'Checking online record against USDA…':'Looking up product…');
  try{
   const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`);
   if(!r.ok)throw Error('Network error');
   const j=await r.json();
   const off=j.status===1&&j.product?productFood(j.product,code):null;
   const chosen=local?.servingVerified&&packageGrams(local.portion)!==null?local:(off?.servingVerified?off:(local||off));
   if(!chosen){setLookupState('Product not found. You can add a custom food from the package label.');return}
   setOnlineFoods(a=>[chosen,...a.filter(x=>x.id!==chosen.id)].slice(0,200));setBarcode('');chooseFood(chosen);
   setLookupState(chosen===local?'USDA branded record selected. Compare the package label.': 'Product found. Check the package serving before logging.');
  }catch{
   if(local){setBarcode('');chooseFood(local);setLookupState('Offline USDA branded record. Compare the package label.')}else setLookupState('Online lookup unavailable. Enter the package label manually or retry online.');
  }
 };
 const fetchOnline=async()=>{
  const q=search.trim();if(q.length<2)return;
  setLookupState('Searching Open Food Facts…');
  try{
   // Fetch broad results, then enforce the US country tag locally. Country tags
   // describe market availability, not the country where the food was produced.
   const params=new URLSearchParams({search_terms:q,search_simple:'1',action:'process',json:'1',page_size:'100',fields:'code,product_name,product_name_en,brands,serving_size,nutriments,countries_tags,quantity'});
   const r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`);
   if(!r.ok)throw Error('Network error');
   const j=await r.json();
   const products=(Array.isArray(j.products)?j.products:[]).filter((p:any)=>p.product_name||p.product_name_en);
   const selected=usOnly?products.filter((p:any)=>Array.isArray(p.countries_tags)&&p.countries_tags.includes('en:united-states')):products;
   const fs:Food[]=selected.map((p:any,i:number)=>productFood(p,String(p.code||`search-${i}`)));
   setOnlineFoods(a=>[...fs,...a.filter(x=>!fs.some(f=>f.id===x.id))].slice(0,300));
   setLookupState(`${fs.length} ${usOnly?'US-market':'international'} products found${usOnly&&products.length>fs.length?` (${products.length-fs.length} excluded without a US-market tag)`:''}. Check the package label for accuracy.`);
  }catch{setLookupState('Online search unavailable. Offline foods still work.')}
 };
 const recipeTotals=fields.reduce((a,k)=>({...a,[k]:round(recipeParts.reduce((sum,p)=>sum+(p.food[k]||0)*p.quantity,0))}),{} as Record<Nutrient,number>);
 const saveRecipe=()=>{if(!recipeName.trim()||!recipeParts.length)return;const f:Food={id:`custom-recipe-${Date.now()}`,name:recipeName.trim(),portion:'1 recipe',...recipeTotals};setCustomFoods(a=>[f,...a]);setRecipeMode(false);setRecipeParts([]);chooseFood(f)};

 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(entries)),[entries]);
 useEffect(()=>localStorage.setItem('iron-water-v06',JSON.stringify(water)),[water]);
 useEffect(()=>localStorage.setItem('iron-water-unit',JSON.stringify(unit)),[unit]);
 useEffect(()=>localStorage.setItem('iron-custom-foods-v07',JSON.stringify(customFoods)),[customFoods]);
 const current=entries.filter(e=>e.day===day);
 const totals=useMemo(()=>current.reduce((a,e)=>{for(const k of fields)a[k]+=(Number(e[k])||0)*e.servings;return a},{calories:0,protein:0,carbs:0,fat:0,fiber:0,sodium:0}),[entries,day]);
 const waterTotal=water.filter(w=>w.day===day).reduce((a,w)=>a+w.ml,0);
 const allFoods=useMemo(()=>[...Object.values(barcodeCorrections),...customFoods,...usdaOfflineFoods,...usdaBrandedOfflineFoods,...commonFoodFallback,...offlineFoods,...onlineFoods.filter(f=>!usOnly||f.countries?.includes('en:united-states'))],[barcodeCorrections,customFoods,onlineFoods,usOnly]);
 const foodById=useMemo(()=>new Map(allFoods.map(f=>[f.id,f])),[allFoods]);
 const favoriteFoods=useMemo(()=>favorites.map(id=>foodById.get(id)).filter((f):f is Food=>Boolean(f)),[favorites,foodById]);
 const recentFoodItems=useMemo(()=>recentFoods.map(id=>foodById.get(id)).filter((f):f is Food=>Boolean(f)),[recentFoods,foodById]);
 const toggleFavorite=(id:string)=>setFavorites(a=>a.includes(id)?a.filter(x=>x!==id):[id,...a]);
 const matches=useMemo(()=>{
  const q=search.trim().toLowerCase();
  const terms=q.split(/\s+/).filter(Boolean);
  const ranked=allFoods.filter(f=>!q||terms.every(t=>`${f.name} ${f.brand||''} ${f.barcode||''} ${f.portion}`.toLowerCase().includes(t)));
  const seen=new Set<string>();
  const score=(f:Food)=>{
   const n=f.name.toLowerCase(), b=(f.brand||'').toLowerCase();
   return (q&&n===q?100:0)+(q&&n.startsWith(q)?40:0)+(q&&b.includes(q)?10:0)+(f.servingVerified?25:0)+(f.barcode?5:0)+(f.source==='USDA FoodData Central'?15:0)-(f.portion.includes('100 g (package serving unavailable)')?50:0);
  };
  return ranked.sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name)).filter(f=>{const key=[readableFoodName(f.name).toLowerCase(),(f.brand||'').toLowerCase(),f.portion.toLowerCase(),f.calories,f.protein,f.carbs,f.fat].join('|');if(seen.has(key))return false;seen.add(key);return true}).slice(0,70);
 },[allFoods,search]);
 const changeDay=(n:number)=>{const [y,m,d]=day.split('-').map(Number);const dt=new Date(y,m-1,d+n);setDay(`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`)};
 const openPicker=(m:Meal)=>{setEditingId(null);setMeal(m);setPicker(true);setCustomMode(false);setSelectedFood(null);setSearch('');setServings('1');setFoodMeasure('serving');setFoodQuantity('1');setRecipeMode(false);setBarcodeMode(false);setCameraOpen(false);setOnlineToolsOpen(false);setBarcode('');setLookupState('')};
 const chooseFood=(f:Food)=>{setServingEdit(false);setServingDraft(f.portion);setRecentFoods(a=>[f.id,...a.filter(x=>x!==f.id)].slice(0,30));setSelectedFood(f);setCustomMode(false);setName(f.name);setPortion(f.portion);setServings('1');setFoodMeasure('serving');setFoodQuantity('1');setNutrients(Object.fromEntries(fields.map(k=>[k,String(f[k])])) as Record<Nutrient,string>)};
 const editEntry=(e:Entry)=>{setEditingId(e.id);setMeal(e.meal);setPicker(true);setSelectedFood(null);setCustomMode(true);setRecipeMode(false);setName(e.name);setPortion('1 serving');setServings(String(e.servings));setFoodMeasure('serving');setNutrients(Object.fromEntries(fields.map(k=>[k,String(e[k])])) as Record<Nutrient,string>)};
 const createCustom=()=>{setCustomMode(true);setSelectedFood(null);setName('');setPortion('1 serving');setServings('1');setFoodMeasure('serving');setFoodQuantity('1');setNutrients(empty())};
 const servingWeight=packageGrams(portion);
 const applyServingCorrection=()=>{
  if(!selectedFood?.barcode)return;
  const next=servingDraft.trim();const oldWeight=packageGrams(selectedFood.portion);const newWeight=packageGrams(next);
  if(!next||newWeight===null||newWeight<=0||newWeight>10000)return;
  // Only rescale when the existing nutrient values have a known weight basis.
  // A missing package weight is not evidence that the existing values are per 100 g.
  const fallback=selectedFood.portion.includes('100 g (package serving unavailable)');
  if(oldWeight===null&&!fallback){setLookupState('Cannot automatically rescale unknown serving nutrition. Enter label nutrients below and save the correction.');return}
  const factor=newWeight/(oldWeight||100);
  const corrected:Food={...selectedFood,portion:next,servingVerified:true,source:'Package label correction',...Object.fromEntries(fields.map(k=>[k,round(selectedFood[k]*factor)]))};
  setSelectedFood(corrected);setPortion(next);setNutrients(Object.fromEntries(fields.map(k=>[k,String(corrected[k])])) as Record<Nutrient,string>);setServingEdit(false);
 };
 const saveBarcodeCorrection=()=>{
  if(!selectedFood?.barcode)return;
  const values=Object.fromEntries(fields.map(k=>[k,Number(nutrients[k])])) as Record<Nutrient,number>;
  if(Object.values(values).some(v=>!Number.isFinite(v)||v<0||v>100000)||!portion.trim())return;
  const corrected:Food={...selectedFood,portion:portion.trim(),...values,servingVerified:packageGrams(portion)!==null,source:'Package label correction'};
  setBarcodeCorrections(prev=>({...prev,[normalizeBarcode(selectedFood.barcode!)]:corrected}));
  setSelectedFood(corrected);setLookupState('Package label correction saved for this barcode.');
 };
 const selectedFactor=foodMeasure==='serving'?Number(servings):(servingWeight?Number(foodQuantity)*measureGrams[foodMeasure]/servingWeight:NaN);
 const liveTotals=Object.fromEntries(fields.map(k=>[k,round((Number(nutrients[k])||0)*(Number.isFinite(selectedFactor)&&selectedFactor>=0?selectedFactor:0))])) as Record<Nutrient,number>;
 const save=()=>{const s=selectedFactor;if(!name.trim()||!Number.isFinite(s)||s<=0||s>1000)return;const values=Object.fromEntries(fields.map(k=>[k,Number(nutrients[k])])) as Record<Nutrient,number>;if(Object.values(values).some(v=>!Number.isFinite(v)||v<0||v>100000))return;setEntries(a=>[...a.filter(e=>e.id!==editingId),{id:editingId??Date.now()+Math.random(),day,meal,name:name.trim(),servings:s,...values}]);if(customMode&&editingId===null){const food:Food={id:`custom-${Date.now()}`,name:name.trim(),portion:portion.trim()||'1 serving',...values};setCustomFoods(a=>[food,...a.filter(f=>f.name.toLowerCase()!==food.name.toLowerCase())])}setPicker(false);setSelectedFood(null);setCustomMode(false);setEditingId(null)};
 const setWaterUnit=(next:Unit)=>{const ml=Number(waterAmount)*unitFactors[unit];setUnit(next);setWaterAmount(String(round(ml/unitFactors[next])))};
 return <div className="nutrition">
  <div className="sectionHead"><small>MODULE 03 / NUTRITION</small><h2>FOOD TERMINAL</h2><p>Offline food search, meal records, and nutrient summaries. No premium features.</p></div>
  <div className="nutritionDate"><button onClick={()=>changeDay(-1)}>◀</button><strong>{day}</strong><button onClick={()=>changeDay(1)}>▶</button><button onClick={()=>setDay(DAY())}>TODAY</button></div>
  <section className="caloriePanel"><small>DAILY ENERGY / LOGGED</small><div className="calorieNumber"><strong>{Math.round(totals.calories)}</strong><span>Cal</span></div><p>Recorded energy compared with your editable reference, not a prescribed eating limit.</p><div className="energyTrack"><div style={{width:`${Math.min(100,totals.calories/references.calories*100)}%`}}/></div><small>{Math.round(totals.calories)} Cal logged / {references.calories.toLocaleString()} Cal reference</small></section>
  <section className="nutritionReferences"><div className="nutritionReferencesTitle"><div><small>PERSONALIZE / DATA REFERENCES</small><h3>CUSTOMIZABLE NUTRITION REFERENCES</h3></div><button onClick={()=>editReferences?setEditReferences(false):startEditReferences()}>{editReferences?'CANCEL':'EDIT'}</button></div><p className="dataNote">Starting references are informational comparisons, not personalized requirements. Editing or resetting them does not change your food or water history.</p>{editReferences?<><div className="referenceInputs">{referenceFields.map(([key,title,u])=><label key={key}>{title} ({u})<input type="number" min="0.01" step="any" value={referenceDraft[key]} onChange={e=>setReferenceDraft(d=>({...d,[key]:e.target.value}))}/></label>)}<label>WATER ({unit})<input type="number" min="0.01" step="any" value={referenceDraft.water} onChange={e=>setReferenceDraft(d=>({...d,water:e.target.value}))}/></label></div><div className="referenceActions"><button onClick={saveReferences}>SAVE REFERENCES</button><button onClick={resetReferences}>RESET TO DEFAULTS</button></div></>:<><div className="referenceValues"><div><strong>{references.calories.toLocaleString()}</strong><small>Cal / ENERGY</small></div><div><strong>{round(references.fiber)}</strong><small>g / FIBER</small></div><div><strong>{round(references.sodium)}</strong><small>mg / SODIUM</small></div><div><strong>{displayWater(references.waterMl,unit)}</strong><small>{unit} / WATER</small></div></div><div className="referenceActions"><button onClick={resetReferences}>RESET TO DEFAULTS</button></div></>}<NutritionGoals onApply={calories=>setReferences(old=>({...old,calories}))}/></section>
  <section><h3>DAILY NUTRIENTS</h3><div className="nutritionGrid">{([['protein','PROTEIN','g'],['carbs','CARBS','g'],['fat','FAT','g'],['fiber','FIBER','g'],['sodium','SODIUM','mg']] as const).map(([key,title,u])=><div className="nutritionMetric" key={key}><small>{title}</small><strong>{round(totals[key])}</strong><small>{u}</small></div>)}</div><small>Values are estimates per serving. Check product labels when accuracy matters.</small></section>
  <section className="referenceProgress"><h3>REFERENCE COMPARISONS</h3>{([['fiber','FIBER','g'],['sodium','SODIUM','mg']] as const).map(([key,label,u])=><div key={key}><div className="referenceProgressLabel"><span>{label}</span><span>{round(totals[key])} / {round(references[key])} {u}</span></div><div className="energyTrack"><div style={{width:`${Math.min(100,totals[key]/references[key]*100)}%`}}/></div></div>)}<div><div className="referenceProgressLabel"><span>WATER</span><span>{displayWater(waterTotal,unit)} / {displayWater(references.waterMl,unit)} {unit}</span></div><div className="energyTrack"><div style={{width:`${Math.min(100,waterTotal/references.waterMl*100)}%`}}/></div></div></section>
  <section><h3>WATER INTAKE</h3><div className="waterControls"><strong>{displayWater(waterTotal,unit)} {unit}</strong><label>UNIT<select value={unit} onChange={e=>setWaterUnit(e.target.value as Unit)}>{(Object.keys(unitFactors) as Unit[]).map(u=><option key={u}>{u}</option>)}</select></label><label>AMOUNT<input type="number" min="0.01" step="any" value={waterAmount} onChange={e=>setWaterAmount(e.target.value)}/></label><button onClick={()=>{const ml=Number(waterAmount)*unitFactors[unit];if(Number.isFinite(ml)&&ml>0&&ml<=10000)setWater(w=>[...w,{day,ml,id:Date.now()+Math.random()}])}}>+ LOG WATER</button></div><small>Stored in mL internally; changing units preserves existing entries.</small>
  <div className="waterHistory"><strong>WATER ENTRIES / {day}</strong>{water.filter(w=>w.day===day).length===0?<p>No water logged.</p>:water.map((w,i)=>({...w,index:i})).filter(w=>w.day===day).map(w=><div className="waterEntry" key={w.id??w.index}><span>+ {displayWater(w.ml,unit)} {unit}</span><button onClick={()=>setWater(a=>a.filter((_,i)=>i!==w.index))}>UNDO / REMOVE</button></div>)}</div></section>
  {meals.map(m=><section key={m}><div className="nutritionMealTitle"><h3>{m.toUpperCase()}</h3><button onClick={()=>openPicker(m)}>+ ADD FOOD</button></div>{current.filter(e=>e.meal===m).length===0?<p>No foods logged.</p>:current.filter(e=>e.meal===m).map(e=><div className="line" key={e.id}><span>{e.name}<small>{e.servings} serving(s) · {Math.round((e.calories||0)*e.servings)} Cal · P {round(e.protein*e.servings)}g · C {round(e.carbs*e.servings)}g · F {round(e.fat*e.servings)}g</small></span><div className="entryActions"><button onClick={()=>editEntry(e)}>EDIT</button><button onClick={()=>setEntries(a=>a.filter(x=>x.id!==e.id))}>REMOVE</button></div></div>)}</section>)}
  <section><h3>7-DAY OVERVIEW</h3><div className="nutritionWeek">{Array.from({length:7},(_,i)=>{const [y,m,d]=day.split('-').map(Number);const dt=new Date(y,m-1,d-(6-i));const key=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;const energy=entries.filter(e=>e.day===key).reduce((sum,e)=>sum+e.calories*e.servings,0);return <div key={key}><strong>{dt.toLocaleDateString('en-US',{weekday:'short'})}</strong><div className="nutritionWeekBar" style={{height:`${Math.max(6,Math.min(75,energy/references.calories*75))}px`}}/><small>{Math.round(energy)} Cal</small></div>})}</div><small>Daily logged energy (Cal); the full bar represents your editable energy reference, not a personal limit.</small></section>
  {picker&&<div className="foodModalBackdrop" role="presentation"><div className="foodModal" role="dialog" aria-modal="true" aria-label="Food database"><div className="foodModalHeader"><div><small>OFFLINE DATABASE / {meal.toUpperCase()}</small><h2>{editingId!==null?'EDIT FOOD':customMode?'CUSTOM FOOD':selectedFood?'ADD FOOD':'SELECT FOOD'}</h2></div><button onClick={()=>setPicker(false)} aria-label="Close food database">✕</button></div>{!selectedFood&&!customMode&&!recipeMode?<><div className="foodLookupTop"><button type="button" aria-expanded={onlineToolsOpen} onClick={()=>{setOnlineToolsOpen(x=>!x);setBarcodeMode(false)}}>SEARCH ONLINE</button><button type="button" aria-expanded={barcodeMode} onClick={()=>{setBarcodeMode(x=>!x);setOnlineToolsOpen(false);setBarcode('');setLookupState('')}}>BARCODE LOOKUP</button></div>{(onlineToolsOpen||barcodeMode)&&<div className="onlineLookup foodLookupCompact">{onlineToolsOpen&&<><label className="usMarketToggle"><input type="checkbox" checked={usOnly} onChange={e=>setUsOnly(e.target.checked)}/> US PRODUCTS ONLY</label><button type="button" onClick={fetchOnline} disabled={search.trim().length<2}>SEARCH STORE PRODUCTS ONLINE</button></>}{barcodeMode&&<><label>BARCODE NUMBER<input inputMode="numeric" value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="Enter 8–14 digits"/></label><div className="foodLookupActions"><button type="button" onClick={()=>void fetchBarcode()}>FIND BARCODE</button><button type="button" onClick={()=>{setBarcode('');setCameraOpen(true)}}>SCAN WITH CAMERA</button></div></>}{lookupState&&<small role="status">{lookupState}</small>}<details className="foodLookupInfo"><summary>DATABASE INFORMATION</summary><small>{allFoods.length.toLocaleString()} foods available locally. Online results are community-submitted. Confirm the serving against the package label; 100 g may be a reference rather than a package serving.</small></details></div>}<label>SEARCH FOODS<input autoFocus placeholder="Try eggs, rice, chicken, banana…" value={search} onChange={e=>setSearch(e.target.value)}/></label>{cameraOpen&&<div className="foodScannerBackdrop" role="presentation" onClick={()=>setCameraOpen(false)}><div className="foodScannerDialog" role="dialog" aria-modal="true" aria-label="Scan product barcode" onClick={e=>e.stopPropagation()}><BarcodeCamera onFound={code=>{setCameraOpen(false);setBarcode('');void fetchBarcode(code)}} onClose={()=>setCameraOpen(false)}/></div></div>}{!search.trim()&&<div className="foodQuickLists">{favoriteFoods.length>0&&<><h3><TealFavoriteStar active size={19}/> FAVORITES</h3><div className="foodQuickRow">{favoriteFoods.slice(0,12).map(f=><button key={f.id} onClick={()=>chooseFood(f)}>{readableFoodName(f.name)}</button>)}</div></>}{recentFoodItems.length>0&&<><h3>RECENT FOODS</h3><div className="foodQuickRow">{recentFoodItems.slice(0,10).map(f=><button key={f.id} onClick={()=>chooseFood(f)}>{readableFoodName(f.name)}</button>)}</div></>}</div>}<div className="foodResults">{matches.map(f=><div key={f.id} className="foodResultWrap"><button className="foodResult" onClick={()=>chooseFood(f)}><span><strong>{readableFoodName(f.name)}</strong><small>{f.brand?`${f.brand} · `:''}{f.portion}{f.source?' · '+f.source:''}{f.id.startsWith('custom-')?' · CUSTOM':''}</small>{f.barcode&&<small>BARCODE {f.barcode} · {f.source==='Package label correction'?'LOCALLY CORRECTED':f.servingVerified?'SERVING WEIGHT AVAILABLE':'REFERENCE / UNVERIFIED'}</small>}</span><b>{f.calories} Cal</b></button><button className="foodFavorite" onClick={()=>toggleFavorite(f.id)} aria-label={favorites.includes(f.id)?'Remove from favorites':'Add to favorites'}><TealFavoriteStar active={favorites.includes(f.id)}/></button></div>)}{matches.length===0&&<p>No matching foods. Create a custom entry below.</p>}</div><button className="foodCreate" onClick={createCustom}>+ CREATE CUSTOM FOOD</button><button className="foodCreate" onClick={()=>{setRecipeMode(true);setRecipeParts([]);setRecipeName('');setSearch('')}}>+ BUILD SAVED RECIPE / MEAL</button></>:recipeMode?<><button className="foodBack" onClick={()=>setRecipeMode(false)}>← BACK TO FOODS</button><label>RECIPE NAME<input value={recipeName} onChange={e=>setRecipeName(e.target.value)} placeholder="My sandwich"/></label><label>FIND INGREDIENT<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bread, cheese, turkey…"/></label><label>SERVINGS OF INGREDIENT<input type="number" min="0.01" step="any" value={recipeQuantity} onChange={e=>setRecipeQuantity(e.target.value)}/></label><div className="recipeChoices">{matches.slice(0,25).map(f=><button key={f.id} onClick={()=>{const q=Number(recipeQuantity);if(q>0&&q<=100)setRecipeParts(a=>[...a,{food:f,quantity:q}])}}>{readableFoodName(f.name)} · {f.portion} +</button>)}</div><h3>INGREDIENTS</h3>{recipeParts.map((p,i)=><div className="waterEntry" key={i}><span>{p.quantity} × {p.food.name}</span><button onClick={()=>setRecipeParts(a=>a.filter((_,j)=>j!==i))}>REMOVE</button></div>)}<p>Recipe total: {recipeTotals.calories||0} Cal · Protein {recipeTotals.protein||0} g · Carbs {recipeTotals.carbs||0} g</p><button className="foodCreate" onClick={saveRecipe}>SAVE RECIPE AND ADD TO MEAL</button></>:<><button className="foodBack" onClick={()=>{setSelectedFood(null);setCustomMode(false)}}>← BACK TO DATABASE</button><label>FOOD NAME<input value={name} readOnly={!customMode} onChange={e=>setName(e.target.value)}/></label><label>MEASURE BY<select value={foodMeasure} onChange={e=>setFoodMeasure(e.target.value)}><option value="serving">Package serving</option>{servingWeight!==null?<option value="g">Grams (g)</option>:null}{servingWeight!==null?<option value="oz">Ounces (oz)</option>:null}{servingWeight!==null?<option value="lb">Pounds (lb)</option>:null}{servingWeight!==null?<option value="kg">Kilograms (kg)</option>:null}</select></label>{foodMeasure==='serving'?<label>NUMBER OF SERVINGS<input type="number" min="0.1" step="0.1" value={servings} onChange={e=>setServings(e.target.value)}/></label>:<label>QUANTITY ({foodMeasure})<input type="number" min="0.01" step="any" value={foodQuantity} onChange={e=>setFoodQuantity(e.target.value)}/><small>Calculated from the serving weight available in the product record.</small></label>}<div className="foodLiveTotals"><small>LIVE NUTRIENT TOTAL / SELECTED QUANTITY</small><div className="foodLiveGrid">{fields.map(k=><div key={k}><strong>{liveTotals[k]}</strong><small>{k.toUpperCase()}{k==='calories'?' Cal':k==='sodium'?' mg':' g'}</small></div>)}</div>{!Number.isFinite(selectedFactor)&&<small>Weight conversion unavailable for this serving. Use package servings.</small>}</div>{selectedFood?.barcode&&<button type="button" className="foodScannedFavorite" onClick={()=>toggleFavorite(selectedFood.id)}><TealFavoriteStar active={favorites.includes(selectedFood.id)}/>{favorites.includes(selectedFood.id)?'STARRED FOOD · REMOVE FAVORITE':'STAR THIS SCANNED FOOD'}</button>}{selectedFood?.barcode&&<div className="foodServingCorrection"><h3>PACKAGE LABEL / SERVING</h3><p>Current serving: <strong>{portion}</strong> · {selectedFood.source||'Database record'}. Check the physical package. The 100 g reference is not necessarily a serving.</p><button type="button" onClick={()=>{setServingDraft(portion);setServingEdit(x=>!x)}}>{servingEdit?'CANCEL':'CORRECT SERVING SIZE'}</button>{servingEdit&&<><label>PACKAGE SERVING (e.g. 1 tortilla (90 g))<input value={servingDraft} onChange={e=>setServingDraft(e.target.value)}/></label><button type="button" onClick={applyServingCorrection}>APPLY SERVING WEIGHT</button><small>Scales existing nutrition from its known weight basis. Check the label values below before saving.</small></>}<button type="button" onClick={saveBarcodeCorrection}>SAVE PACKAGE LABEL CORRECTION</button><small>Saves serving and nutrient values for this barcode on your device. You can edit the nutrients below first.</small></div>}<h3>NUTRIENTS PER SERVING</h3><div className="nutritionInputs">{fields.map(k=><label key={k}>{k.toUpperCase()} ({k==='calories'?'Cal':k==='sodium'?'mg':'g'})<input type="number" min="0" step="any" value={nutrients[k]} onChange={e=>setNutrients(a=>({...a,[k]:e.target.value}))}/></label>)}</div><button className="foodCreate" onClick={save}>{editingId!==null?'SAVE CHANGES':'SAVE TO '+meal.toUpperCase()}</button></>}</div></div>}
 </div>
}
