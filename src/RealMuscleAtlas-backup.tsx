import {useMemo, useEffect} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import type {ThreeEvent} from '@react-three/fiber';
import muscleMap from './muscle-map.json';

type Muscle='chest'|'shoulders'|'biceps'|'triceps'|'forearms'|'upper_back'|'lats'|'abs'|'obliques'|'glutes'|'quads'|'hamstrings'|'calves';

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

const NEUTRAL='#88938d', ACTIVE='#ce6335';
export default function RealMuscleAtlas({selected,onPick,onInspect,onStats,view}:{selected:Muscle|null;onPick:(m:Muscle|null)=>void;onInspect?:(name:string)=>void;onStats?:(stats:Record<string,number>)=>void;view:'front'|'back'|'free'}){
 const {scene}=useGLTF('/models/iron-muscles.glb');
 const {model,center,scale}=useMemo(()=>{
  const model=scene.clone(true);
  const counts:Record<string,number>={};
  let unmapped=0;
  model.traverse(o=>{
   if(!(o instanceof THREE.Mesh))return;
   o.material=new THREE.MeshStandardMaterial({color:NEUTRAL,roughness:0.79,metalness:0.04,side:THREE.DoubleSide});
   const group=findRegion(o);
   o.userData.muscleRegion=group;
   if(group)counts[group]=(counts[group]||0)+1;
   else unmapped++;
  });
  console.info('IRON//OS mapped geometry per group:',counts,'unmapped:',unmapped);
  model.userData.atlasCounts=counts;
  const bounds=new THREE.Box3().setFromObject(model);
  const size=bounds.getSize(new THREE.Vector3());
  const center=bounds.getCenter(new THREE.Vector3());
  const scale=4.6/Math.max(size.x,size.y,size.z,0.001);
  return {model,center,scale};
 },[scene]);
 useEffect(()=>{onStats?.(model.userData.atlasCounts || {});},[model,onStats]);
 useEffect(()=>{
  model.traverse(o=>{
   if(!(o instanceof THREE.Mesh))return;
   const group=o.userData.muscleRegion as Muscle|null;
   const active=!!selected && group===selected;
   const material=o.material as THREE.MeshStandardMaterial;
   material.color.set(active?ACTIVE:group?NEUTRAL:'#56615d');
   material.emissive.set(active?'#351306':'#000000');
   // A selected muscle may be covered by other muscle layers in this atlas.
   // Make those layers translucent while retaining normal depth on selected meshes.
   material.opacity=selected?(active?1:0.10):(group?1:0.66);
   material.transparent=selected?!active:!group;
   material.depthWrite=active || (!selected && !!group);
   // The source GLB has overlapping muscle layers. Render a selected
   // anatomical mesh visibly without modifying or replacing its geometry.
   // This is an atlas highlight overlay, not a claim of surface visibility.
   material.depthTest=!active;
   o.renderOrder=active?100:0;
   material.needsUpdate=true;
  });
 },[model,selected]);
 const handlePick=(event:ThreeEvent<MouseEvent>)=>{
  event.stopPropagation();
  const mesh=event.object;
  onInspect?.(mesh.name || mesh.parent?.name || 'Unnamed geometry');
  const group=(mesh.userData.muscleRegion as Muscle|null) || findRegion(mesh);
  onPick(group);
 };
 return <group rotation={[0,view==='back'?Math.PI:0,0]}>
  <group scale={scale}><group position={[-center.x,-center.y,-center.z]} onClick={handlePick}><primitive object={model}/></group></group>
 </group>;
}
useGLTF.preload('/models/iron-muscles.glb');
