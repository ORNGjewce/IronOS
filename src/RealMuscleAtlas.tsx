import {useMemo, useEffect} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import type {ThreeEvent} from '@react-three/fiber';
import muscleMap from './muscle-map.json';
import femaleMuscleMap from './female-muscle-map.json';

type Muscle='chest'|'shoulders'|'biceps'|'triceps'|'forearms'|'upper_back'|'lats'|'abs'|'obliques'|'glutes'|'quads'|'hamstrings'|'calves'|'adductors'|'hip_flexors'|'shins'|'abductors';

// Match against the actual GLTFLoader object names, not only Blender node names.
// Z-Anatomy has left/right nodes which share a side-less mesh definition.
// Three.js also sanitizes punctuation, sometimes joining the final .l/.r to the name.
const normalize=(value:string):string=>value.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const muscleMapEntries=Object.entries(muscleMap as Record<string,Muscle>);
const lookup=new Map<string,Muscle>();
const ambiguous=new Set<string>();
function register(key:string,region:Muscle){
 if(!key || ambiguous.has(key))return;
 const prior=lookup.get(key);
 if(prior && prior!==region){lookup.delete(key);ambiguous.add(key);return;}
 lookup.set(key,region);
}
for(const [sourceName,region] of muscleMapEntries){
 const key=normalize(sourceName);
 register(key,region);
 // The two side-specific Blender nodes point to the same side-less mesh.
 if(/_[lr]$/.test(key))register(key.slice(0,-2),region);
 // Some GLTFLoader versions collapse the dot before the side identifier.
 if(/_[lr]$/.test(key))register(key.slice(0,-2)+key.slice(-1),region);
}
function candidateNames(name:string):string[]{
 const raw=normalize(name);
 const result=new Set<string>([raw]);
 // Remove an export-generated unique six-digit suffix only when present.
 const noExport=raw.replace(/_[0-9a-f]{6}$/,'');
 result.add(noExport);
 // Handle GLTFLoader duplicate-node numeric suffixes.
 result.add(noExport.replace(/_\d+$/,''));
 for(const value of [...result]){
  if(/_[lr]$/.test(value))result.add(value.slice(0,-2));
  // In the runtime some names end in "musclel" or "muscler".
  if(/muscle[lr]$/.test(value))result.add(value.slice(0,-1));
 }
 return [...result];
}
function findRegion(object:THREE.Object3D):Muscle|null{
 let current:THREE.Object3D|null=object;
 while(current){
  for(const key of candidateNames(current.name)){
   const match=lookup.get(key);
   if(match)return match;
  }
  current=current.parent;
 }
 return null;
}

const femaleLookup=new Map(Object.entries(femaleMuscleMap as Record<string,Muscle>));
const validMuscles=new Set<Muscle>(['chest','shoulders','biceps','triceps','forearms','upper_back','lats','abs','obliques','glutes','quads','hamstrings','calves','adductors','hip_flexors','shins','abductors']);
const asMuscle=(value:unknown):Muscle|null=>typeof value==='string'&&validMuscles.has(value as Muscle)?value as Muscle:null;
function femaleMeshGroup(mesh:THREE.Mesh):Muscle|null{
 // GLB v2 stores each identifier on BOTH its node and glTF mesh definition.
 // glTFLoader copies mesh extras into mesh.userData, but some loaders drop node extras.
 const geometryData=(mesh.geometry as THREE.BufferGeometry).userData as Record<string,unknown> | undefined;
 let current:THREE.Object3D|null=mesh;
 while(current){
  const value=asMuscle(current.userData?.ironOsMuscleRegion);
  if(value)return value;
  current=current.parent;
 }
 return asMuscle(geometryData?.ironOsMuscleRegion)||femaleRegion(mesh.name);
}

// Keep the original Russian source IDs for provenance, but never display them.
const femaleEnglish:Record<Muscle,string>={
 chest:'Pectoral muscles',shoulders:'Deltoid muscles',biceps:'Biceps',triceps:'Triceps',
 forearms:'Forearm muscles',upper_back:'Upper back muscles',lats:'Latissimus dorsi',
 abs:'Abdominal muscles',obliques:'Oblique muscles',glutes:'Gluteal muscles',
 quads:'Quadriceps',hamstrings:'Hamstrings',calves:'Calf muscles',
 adductors:'Hip adductors',hip_flexors:'Hip flexors',shins:'Shin muscles',abductors:'Hip abductors'
};
function femaleRegion(name:string):Muscle|null{
 const direct=femaleLookup.get(name);
 if(direct)return direct;
 // glTFLoader can sanitize punctuation and append a duplicate-node suffix.
 const clean=(v:string)=>v.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'_').replace(/^_+|_+$/g,'');
 const normalized=clean(name).replace(/_\d+$/,'');
 for(const [source,region] of femaleLookup){
  const key=clean(source);
  if(key===clean(name)||key===normalized)return region;
 }
 return null;
}
const NEUTRAL='#88938d', ACTIVE='#ce6335';
export default function RealMuscleAtlas({selected,onPick,onInspect,onStats,view,secondary=[],modelSex='male',isolateFemale=false}:{selected:Muscle|null;onPick:(m:Muscle|null)=>void;onInspect?:(name:string)=>void;onStats?:(stats:Record<string,number>)=>void;view:'front'|'back'|'free';secondary?:Muscle[];modelSex?:'male'|'female';isolateFemale?:boolean}){
 const {scene}=useGLTF(modelSex==='female'?'/models/iron-muscles-female-v2.glb':'/models/iron-muscles.glb');
 const {model,center,scale}=useMemo(()=>{
  const model=scene.clone(true);
  const counts:Record<string,number>={};
  let unmapped=0;
  model.traverse(o=>{
   if(!(o instanceof THREE.Mesh))return;
   o.material=new THREE.MeshStandardMaterial({color:NEUTRAL,roughness:0.79,metalness:0.04,side:THREE.DoubleSide});
   const group=modelSex==='female'?femaleMeshGroup(o):findRegion(o);
   o.userData.muscleRegion=group;
   if(group)counts[group]=(counts[group]||0)+1;
   else unmapped++;
   // Keep original anatomical context visible; only recognized muscles respond to selection.
   // Preserve the full female model; non-training geometry stays visible as context.
   o.visible=true;
  });
  console.info('IRON//OS mapped geometry per group:',counts,'unmapped:',unmapped);
  // Female-only display alias: Abs shares the available oblique geometry.
  // This does not represent a separately modeled rectus abdominis.
  if(modelSex==='female')counts.abs=counts.obliques||0;
  model.userData.atlasCounts=counts;
  const bounds=new THREE.Box3().setFromObject(model);
  const size=bounds.getSize(new THREE.Vector3());
  const center=bounds.getCenter(new THREE.Vector3());
  const scale=4.6/Math.max(size.x,size.y,size.z,0.001);
  return {model,center,scale};
 },[scene,modelSex]);
 useEffect(()=>{onStats?.(model.userData.atlasCounts || {});},[model,onStats]);
 useEffect(()=>{
  model.traverse(o=>{
   if(!(o instanceof THREE.Mesh))return;
   const group=o.userData.muscleRegion as Muscle|null;
   const active=!!selected && (group===selected || (modelSex==='female' && selected==='abs' && group==='obliques'));
   const secondaryActive=!!group && (secondary.includes(group) || (modelSex==='female' && group==='obliques' && secondary.includes('abs')));
   // Diagnostic only: show the actual selected female mesh geometry without context occlusion.
   // Normal view remains opaque and unchanged.
   o.visible=!(modelSex==='female' && isolateFemale && selected && (model.userData.atlasCounts?.[selected]??0)>0 && !active);
   const material=o.material as THREE.MeshStandardMaterial;
   material.color.set(active?ACTIVE:secondaryActive?'#3178b8':group?NEUTRAL:'#56615d');
   material.emissive.set(active?'#351306':secondaryActive?'#102a48':'#000000');
   // Match the male atlas: mapped inactive muscle meshes remain neutral grey.
   // Unmapped source anatomy stays visible as darker neutral context.
   // Keep the entire anatomical model opaque when a group is selected.
   // Normal depth testing preserves realistic surface occlusion.
   material.opacity=1;
   material.transparent=false;
   material.depthWrite=true;
   // Display selected muscles through surrounding opaque anatomy in BOTH atlases.
   // Nonselected muscles and anatomical context keep normal depth testing.
   material.depthTest=!active;
   o.renderOrder=active?2:0;
   material.needsUpdate=true;
  });
 },[model,selected,secondary,modelSex,isolateFemale]);
 const handlePick=(event:ThreeEvent<MouseEvent>)=>{
  event.stopPropagation();
  const mesh=event.object;
  let group=(mesh.userData.muscleRegion as Muscle|null) || (modelSex==='female'?femaleMeshGroup(mesh as THREE.Mesh):findRegion(mesh));
  // Some CheRa mapped muscles lie behind skin, fascia, or bone context.
  // If the frontmost hit is context, look for the closest actual mapped muscle
  // along the same ray rather than treating every tap as unmapped.
  if(modelSex==='female' && !group){
   const raycaster=new THREE.Raycaster();
   raycaster.ray.copy(event.ray);
   const hits:THREE.Intersection<THREE.Object3D>[] = raycaster.intersectObject(model,true);
   const mapped=hits.find(hit=>{const obj=hit.object as THREE.Mesh;return !!obj.userData.muscleRegion;});
   if(mapped)group=(mapped.object.userData.muscleRegion as Muscle);
  }
  onInspect?.(modelSex==='female'?(group?femaleEnglish[group]:'Unmapped anatomical structure'):(mesh.name || mesh.parent?.name || 'Unnamed geometry'));
  onPick(group);
 };
 return <group rotation={[0,view==='back'?Math.PI:0,0]}>
  <group scale={scale}><group position={[-center.x,-center.y,-center.z]} onClick={handlePick}><primitive object={model}/></group></group>
 </group>;
}
useGLTF.preload('/models/iron-muscles.glb');

useGLTF.preload('/models/iron-muscles-female-v2.glb');
