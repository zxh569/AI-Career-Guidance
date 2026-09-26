// Beta test mode: opened with ?beta=1. Shows informed consent before the tool can be used.
// Nothing is sent from this site; the questionnaire link at the end carries only the result code.
(function(root){
  'use strict';
  const doc=root.document;
  const KEY='career-guidance.beta',CONSENT='career-guidance.beta-consent';
  const store={get:k=>{try{return root.sessionStorage.getItem(k);}catch(_){return null;}},set:(k,v)=>{try{root.sessionStorage.setItem(k,v);}catch(_){}}};
  const fromUrl=new URLSearchParams(root.location.search).get('beta')==='1';
  if(fromUrl)store.set(KEY,'1');
  const active=fromUrl||store.get(KEY)==='1';
  let consented=active&&store.get(CONSENT)==='yes';
  root.BetaMode=Object.freeze({active,consented:()=>consented});
  if(!active||consented||!doc)return;
  const el=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  const overlay=el('div',undefined,'beta-consent');overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','beta-consent-title');
  const box=el('div',undefined,'beta-consent-box');
  const title=el('h2','参与试用前，请先阅读');title.id='beta-consent-title';
  box.append(title,
    el('p','这次试用用于研究 AI 职业建议的实际帮助和改进方向。用完之后，请点页面最后的“填写反馈问卷”，大约需要 2–3 分钟。'),
    el('p','研究会匿名记录：你在表单里选择的选项（不包括你写的文字）、网站给出的建议，以及你在问卷里的反馈，只用于研究。'),
    el('p','请不要在网站或问卷里填写姓名、电话等能识别身份的信息。问卷平台可能记录 IP 等技术信息，这些不纳入研究分析。'),
    el('p','参与完全自愿。如果不同意，请直接关闭页面，不会收集你的任何信息。'));
  const actions=el('div',undefined,'beta-consent-actions');
  const yes=el('button','我同意，开始使用');yes.type='button';
  const no=el('button','不同意','profile-secondary');no.type='button';
  actions.append(yes,no);box.append(actions);overlay.append(box);
  yes.addEventListener('click',()=>{consented=true;store.set(CONSENT,'yes');overlay.remove();doc.body.classList.remove('beta-locked');});
  no.addEventListener('click',()=>{box.replaceChildren(el('h2','感谢你的时间'),el('p','你可以直接关闭这个页面，本网站不会记录任何信息。'));});
  const mount=()=>{doc.body.classList.add('beta-locked');doc.body.append(overlay);yes.focus();};
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',mount);else mount();
})(typeof window!=='undefined'?window:globalThis);
