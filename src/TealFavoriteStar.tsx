import type {CSSProperties} from 'react';

/** Four-point teal favorite marker, shared by food and progress-photo controls. */
export default function TealFavoriteStar({active,size=23}:{active:boolean;size?:number}){
 const style:CSSProperties={width:size,height:size,display:'inline-block',flexShrink:0,filter:active?'drop-shadow(0 0 4px rgba(46,220,210,.8))':'none'};
 return <svg style={style} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <path d="M16 1.5 L20.1 11.9 L30.5 16 L20.1 20.1 L16 30.5 L11.9 20.1 L1.5 16 L11.9 11.9 Z" fill={active?'#40d6d1':'transparent'} stroke={active?'#167f89':'#6c9b9e'} strokeWidth="1.7" strokeLinejoin="round"/>
  {active&&<path d="M16 7 L18.3 13.7 L25 16 L18.3 18.3 L16 25 L13.7 18.3 L7 16 L13.7 13.7 Z" fill="#9af4e9" opacity=".75"/>}
 </svg>;
}
