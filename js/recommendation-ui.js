(() => {
  'use strict';
  const form=document.getElementById('profile-form');
  const button=document.getElementById('generate-advice');
  const status=document.getElementById('advice-status');
  const result=document.getElementById('advice-result');
  if(!form||!button||!status||!result)return;
  const market=window.MARKET_SNAPSHOT;
  const engine=window.RecommendationEngine;
  const schema=window.RECOMMENDATION_PROFILE_SCHEMA;
  const catalog=window.RECOMMENDATION_CATALOG;
  const audit=window.MarketAudit;
  const evidenceView=window.ResultEvidence;
  const node=(tag,text,className)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;};
  const current=()=>{
    const values={};
    for(const control of form.querySelectorAll('input[name], select[name], textarea[name]')) {
      if(control.type==='checkbox') {values[control.name]??=[];if(control.checked)values[control.name].push(control.value);}
      else values[control.name]=control.value;
    }
    return values;
  };
  const preflight=engine?.build({},market,catalog,schema,audit);
  if(!preflight?.ok||!evidenceView){status.textContent='资料检查没有通过，暂时无法生成建议。';return;}
  button.disabled=false;
  const claims=new Map(market.claims.map(c=>[c.id,c]));
  const sources=new Map(market.sources.map(s=>[s.id,s]));
  // Every statement keeps a visible basis label; general knowledge is always marked.
  const basisLabels={profile:'你的情况',market:'招聘资料',general:'通用建议'};
  const factState={snapshot:'调研时查到，现在是否还在招请自行确认',closed:'已截止，仅供参考',historical:'旧资料，仅供参考'};
  const urlLink=(text,url)=>{const a=node('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';return a;};
  function chips(basis){const row=node('span',undefined,'advice-chips');basis.forEach(t=>row.append(node('span',basisLabels[t],'advice-chip advice-chip-'+t)));return row;}
  function explain(item,tag='li') {
    const block=node(tag,undefined,'advice-note');
    block.append(chips(item.basis),node('span',item.text,'advice-text'));
    const unsupported=evidenceView.precision(item.text,item.claimIds,market);
    if(unsupported.length)block.append(node('p','未核实数字：'+unsupported.join('、')+'。没有找到对应的来源，请不要据此做判断。','evidence-warning'));
    return block;
  }
  function list(items){const ul=node('ul',undefined,'advice-list');items.forEach(item=>ul.append(explain(item)));return ul;}
  function block(title,...children){const section=node('section',undefined,'advice-block');section.append(node('h4',title),...children);return section;}
  function directionPanel(d,report,badge){
    const panel=node('article',undefined,'advice-card advice-panel');panel.id=`advice-direction-${d.id}`;
    if(badge)panel.append(node('span',badge,'advice-tab-badge'));
    panel.append(node('p',d.lane,'advice-lane'),node('h3',d.title),node('p',`${d.industry} · ${d.function}`,'advice-meta'),node('p',evidenceView.direction(d,report),'advice-fit'));
    const sample=node('div');
    d.claims.forEach(id=>{const c=claims.get(id);const box=node('div',undefined,'advice-sample');const info=evidenceView.fact(c);box.append(node('p',c.text),node('p',`${info.type} · 地区：${info.region} · 时间：${c.period} · ${factState[c.status]}`,'advice-meta'));const p=node('p',undefined,'advice-meta');c.evidence.forEach((e,i)=>{const s=sources.get(e.sourceId);if(i)p.append(document.createTextNode(' · '));p.append(urlLink('原文：'+s.publisher,e.url),document.createTextNode(`（发布日期：${s.publishedAt}）`));});box.append(p);sample.append(box);});
    panel.append(block('招聘信息里怎么写',sample));
    panel.append(block('为什么推荐',list(d.reasons)),block('需要注意',list(d.risks)));
    const ai=block('AI 会怎么影响这类工作',list([d.aiAdvice,d.aiPreparation]));
    if(!d.aiClaims.length)ai.append(node('p','目前没找到专门讲这类岗位 AI 影响的资料，上面是一般判断。','advice-meta'));
    panel.append(ai);
    const gaps=node('div');
    d.gaps.forEach(g=>{const part=node('div',undefined,'advice-gap');part.append(node('h5',g.title),node('p',g.status,'advice-meta'),list([g.assessment,g.why]));gaps.append(part);});
    const task=node('div',undefined,'advice-task');task.append(node('h5','练手任务'),explain(d.gaps[0].action,'div'),node('h5','怎样算完成'),explain(d.gaps[0].acceptance,'div'));
    panel.append(block('可以先练练的能力',gaps,task),block('想让这个方向更准，可以补充',list(d.questions)));
    return panel;
  }
  function render(report) {
    result.replaceChildren();
    if(!report.ok){status.textContent=`生成失败：${report.errors.join('；')}`;return;}
    const intro=node('div',undefined,'advice-intro');
    const top=report.directions[0];
    intro.append(node('h3',top.strength===2&&!top.conflict?'最适合你的方向':top.strength>0?'和你背景最相关的方向':report.personalized?'暂时没有和你背景特别吻合的方向，可以先看看这个':'可以先从这个方向看起'));
    if(!report.personalized)intro.append(node('p','多填一些行业和技能，推荐会更贴近你。','advice-meta'));
    if(evidenceView.auditReport(report,market).length)intro.append(node('p','有数字没找到对应来源，已在旁边标出，请不要据此做判断。','evidence-warning'));
    const panel=directionPanel(top,report,top.strength===2&&!top.conflict?'最匹配你':'');
    result.append(intro,panel);
    const plan=node('section',undefined,'advice-card');plan.append(node('h3','接下来怎么做'));
    const steps=node('ol',undefined,'advice-plan');report.plan.forEach(step=>{const li=node('li');li.append(node('h4',step.title),explain(step.body,'div'),node('p','完成标志：'+step.check,'advice-meta'));steps.append(li);});plan.append(steps);result.append(plan);
    const resultCode=window.ResultCode?window.ResultCode.encode(report.profile,schema,top.id):'';
    if(window.FeedbackSection)window.FeedbackSection.mount(result,{researchDate:report.researchDate,directions:[{id:top.id,title:top.title}],resultCode});
    status.textContent='';
    result.focus();
  }
  button.addEventListener('click',()=>render(engine.build(current(),market,catalog,schema,audit)));
  function invalidate() {
    if(!result.children.length)return;
    result.replaceChildren();status.textContent='背景改过了，请重新生成建议。';
  }
  form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);form.addEventListener('reset',invalidate);
  window.addEventListener('storage',e=>{if(e.key==='career-guidance.profile.v1'||e.key===null)invalidate();});
})();
