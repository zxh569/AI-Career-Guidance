// Result code for the beta test: links a questionnaire response to the options a tester chose and the direction shown.
// Only form options are encoded (never free text); the same options always give the same code, so it is not a personal ID.
(function(root){
  'use strict';
  const VERSION='v3.4';
  const SELECTS=['stage','age','education','educationStatus','workYears','internship','industry','aiExperience','mobility','goal'];
  const MULTI=['skills','preferences'];
  const index=value=>{const m=/-(\d+)$/.exec(value||'');return m?Number(m[1]):null;};
  function encode(profile,schema,directionId){
    const p=profile||{};
    const sel=SELECTS.map(f=>{const i=index(p[f]);return i===null?'x':i.toString(36);}).join('');
    const bits=MULTI.map(f=>{const chosen=Array.isArray(p[f])?p[f]:[];const opts=schema[f].options;let mask=0;opts.forEach((o,i)=>{if(chosen.includes(o.value))mask|=1<<i;});return mask.toString(16).padStart(Math.ceil(opts.length/4),'0');});
    return ['V'+VERSION.replace(/\D/g,''),sel,...bits,directionId||'none'].join('-');
  }
  function decode(code,schema){
    const parts=String(code||'').trim().split('-');
    if(parts.length!==5||!/^V\d+$/.test(parts[0])||parts[1].length!==SELECTS.length)return null;
    const profile={};
    SELECTS.forEach((f,i)=>{const c=parts[1][i];if(c!=='x'){const v=`${f}-${parseInt(c,36)}`;if(schema[f].options.some(o=>o.value===v))profile[f]=v;}});
    MULTI.forEach((f,k)=>{const mask=parseInt(parts[2+k],16);profile[f]=schema[f].options.filter((o,i)=>mask&(1<<i)).map(o=>o.value);});
    return {version:parts[0],profile,directionId:parts[4]};
  }
  root.ResultCode=Object.freeze({VERSION,encode,decode});
})(typeof window!=='undefined'?window:globalThis);
