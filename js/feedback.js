// Feedback at the end of the results. Only in beta mode (after consent): a link to the questionnaire carrying the result code.
// The site itself sends nothing; the code is passed only when the tester opens the questionnaire.
(function(root){
  'use strict';
  const QUESTIONNAIRE='https://v.wjx.cn/vm/wFzAUBw.aspx';
  function link(code){return QUESTIONNAIRE+'?sojumpparm='+encodeURIComponent(code);}
  function mount(container,context){
    const beta=root.BetaMode;
    if(!beta||!beta.active||!beta.consented()||!context||!context.resultCode)return null;
    const node=(tag,text,cls)=>{const e=root.document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
    const section=node('section',undefined,'advice-card feedback-section');section.id='result-feedback';section.setAttribute('aria-labelledby','feedback-title');
    const heading=node('h3','请填写反馈问卷（约 2–3 分钟）');heading.id='feedback-title';
    const open=node('a','打开反馈问卷','feedback-open');open.href=link(context.resultCode);open.target='_blank';open.rel='noopener noreferrer';open.referrerPolicy='no-referrer';
    const codeRow=node('p',undefined,'feedback-code');const code=node('code',context.resultCode);
    const copy=node('button','复制编号','profile-secondary');copy.type='button';
    const status=node('span','','advice-meta');status.setAttribute('role','status');
    copy.addEventListener('click',()=>{
      const done=()=>{status.textContent='已复制';};
      try{root.navigator.clipboard.writeText(context.resultCode).then(done,()=>{status.textContent='复制失败，请手动选中编号复制';});}
      catch(_){status.textContent='复制失败，请手动选中编号复制';}
    });
    codeRow.append('你的结果编号：',code,' ',copy,' ',status);
    section.append(heading,
      open,codeRow,
      node('p','请不要在问卷里填写姓名、电话等个人信息。','advice-meta'));
    container.append(section);return section;
  }
  root.FeedbackSection=Object.freeze({mount,link,QUESTIONNAIRE});
})(typeof window!=='undefined'?window:globalThis);
