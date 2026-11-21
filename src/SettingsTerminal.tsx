import {useEffect,useState} from 'react';
import ProfileBackup from './ProfileBackup';
import AboutSupport from './AboutSupport';
import './settings-terminal.css';

type Panel='SYSTEM'|'TRAINING'|'NUTRITION';
type Theme='classic'|'night'|'device';
const THEME_KEY='iron-interface-theme-v1';
const UNIT_KEY='iron-fitness-units-v33';
const readTheme=():Theme=>{const t=localStorage.getItem(THEME_KEY);return t==='night'||t==='device'?t:'classic'};
export function applyIronTheme(theme:Theme){
 const dark=theme==='night'||(theme==='device'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
 document.documentElement.classList.toggle('iron-night-mode',dark);
}
export default function SettingsTerminal(){
 const[panel,setPanel]=useState<Panel>('SYSTEM');
 const[theme,setTheme]=useState<Theme>(readTheme);
 const[units,setUnits]=useState<'imperial'|'metric'>(()=>localStorage.getItem(UNIT_KEY)==='metric'?'metric':'imperial');
 useEffect(()=>{applyIronTheme(theme);localStorage.setItem(THEME_KEY,theme);const media=window.matchMedia('(prefers-color-scheme: dark)');const sync=()=>applyIronTheme(theme);media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync)},[theme]);
 const updateUnits=(next:'imperial'|'metric')=>{setUnits(next);localStorage.setItem(UNIT_KEY,next);window.dispatchEvent(new Event('iron-units-updated'))};
 return <section className="ironSettings" aria-label="IRON OS settings">
  <div className="ironSettingsHeading"><small>SYSTEM TERMINAL / CONFIGURATION</small><h2>SETTINGS</h2><p>Personalize your mission control interface.</p></div>
  <div className="ironSettingsTabs" role="tablist" aria-label="Settings sections">{(['SYSTEM','TRAINING','NUTRITION'] as Panel[]).map(p=><button type="button" key={p} role="tab" aria-selected={panel===p} className={panel===p?'active':''} onClick={()=>setPanel(p)}>{p}</button>)}</div>
  {panel==='SYSTEM'&&<div className="ironSettingsContent">
   <div className="ironSettingsCard"><h3>APPEARANCE</h3><label htmlFor="iron-theme">INTERFACE THEME</label><select id="iron-theme" value={theme} onChange={e=>setTheme(e.target.value as Theme)}><option value="classic">Classic / Cream & Navy</option><option value="night">Night / Navy & Gold</option><option value="device">Follow Device</option></select><p>Night mode uses the existing IRON//OS palette.</p></div>
   <div className="ironSettingsCard"><h3>MEASUREMENT PREFERENCES</h3><label htmlFor="iron-units">WORKOUT & CARDIO UNITS</label><select id="iron-units" value={units} onChange={e=>updateUnits(e.target.value as 'imperial'|'metric')}><option value="imperial">Imperial / lb, mi</option><option value="metric">Metric / kg, km</option></select><p>Changes the shared workout unit preference. Existing records are not rewritten. Personal measurement entries retain the unit recorded with each entry.</p></div>
   <div className="ironSettingsCard"><h3>DATA & PRIVACY</h3><p>Export your profile before uninstalling. Weekly automatic backups are still in development.</p><ProfileBackup/></div>
   <div className="ironSettingsCard"><h3>ABOUT & SUPPORT</h3><AboutSupport/></div>
  </div>}
  {panel==='TRAINING'&&<div className="ironSettingsCard"><h3>TRAINING PREFERENCES</h3><p>Workout and cardio units are managed in System → Measurement Preferences.</p><p>Your workout plans, exercise notes, reminders, and rest-timer controls remain in the Training area.</p></div>}
  {panel==='NUTRITION'&&<div className="ironSettingsCard"><h3>NUTRITION PREFERENCES</h3><p>Nutrition targets, food preferences, and hydration settings remain available in Nutrition while we consolidate their controls.</p></div>}
 </section>
}
