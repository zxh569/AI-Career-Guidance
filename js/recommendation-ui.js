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
  status.textContent='可以直接生成，也可以先填背景。填写的内容只在你的浏览器里处理。';
  const claims=new Map(market.claims.map(c=>[c.id,c]));
  const sources=new Map(market.sources.map(s=>[s.id,s]));
  // Every statement keeps a visible basis label; general knowledge is always marked.
  const basisLabels={profile:'你的情况',market:'招聘资料',general:'通用建议'};
  const factState={snapshot:'调研时查到，现在是否还在招请自行确认',closed:'已截止，仅供参考',historical:'旧资料，仅供参考'};
  const urlLink=(text,url)=>{const a=node('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';return a;};
  let sourcesPanel=null;
  const sourceJump=(id,text)=>{const a=node('a',text,'advice-source-link');a.href=`#advice-evidence-${id}`;a.addEventListener('click',()=>{if(sourcesPanel)sourcesPanel.open=true;});return a;};
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
  function more(title,id,open=false){const d=node('details',undefined,'advice-more');if(id)d.id=id;d.open=open;d.append(node('summary',title));return d;}
  function evidence(id) {
    const c=claims.get(id);const item=node('article',undefined,'advice-evidence');item.id=`advice-evidence-${id}`;
    const info=evidenceView.fact(c);
    item.append(node('h4',c.title),node('p',c.text),node('p',`${info.type} · ${factState[c.status]} · 地区：${info.region} · 时间：${c.period}`,'advice-meta'),node('p','注意：'+c.caveat,'advice-meta'));
    c.evidence.forEach(e=>{
      const s=sources.get(e.sourceId);const p=node('p');p.append(urlLink(`${s.publisher}：${s.title}`,e.url));
      item.append(p,node('p',`发布日期：${s.publishedAt} · 访问日期：${e.accessedAt} · 原文位置：${e.locator}`,'advice-meta'),node('p','适用范围：'+s.scope,'advice-meta'));
    });return item;
  }
  function directionPanel(d,report){
    const panel=node('article',undefined,'advice-card advice-panel');panel.id=`advice-direction-${d.id}`;
    panel.append(node('p',d.lane,'advice-lane'),node('h3',d.title),node('p',`${d.industry} · ${d.function}`,'advice-meta'),node('p',evidenceView.direction(d,report),'advice-fit'));
    const sample=node('div');
    d.claims.forEach(id=>{const c=claims.get(id);const box=node('div',undefined,'advice-sample');box.append(node('p',c.text),node('p',evidenceView.fact(c).type+' · '+factState[c.status],'advice-meta'));const p=node('p',undefined,'advice-meta');c.evidence.forEach((e,i)=>{const s=sources.get(e.sourceId);if(i)p.append(document.createTextNode(' · '));p.append(urlLink('原文：'+s.publisher,e.url));});p.append(document.createTextNode(' · '),sourceJump(id,'来源详情'));box.append(p);sample.append(box);});
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
  function tabs(report){
    const wrap=node('div',undefined,'advice-tabs-wrap');
    const bar=node('div',undefined,'advice-tabs');bar.setAttribute('role','tablist');bar.setAttribute('aria-label','推荐方向');
    const buttons=[],panels=[];
    const select=i=>{buttons.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;b.className='advice-tab'+(i===j?' is-active':'');panels[j].hidden=i!==j;});};
    report.directions.forEach((d,i)=>{
      const b=node('button',undefined,'advice-tab');b.type='button';b.id=`advice-tab-${d.id}`;b.setAttribute('role','tab');b.setAttribute('aria-controls',`advice-direction-${d.id}`);
      b.append(node('span',`方向${'一二三四五'[i]}`,'advice-tab-index'),node('span',d.title,'advice-tab-title'),node('span',d.lane,'advice-tab-lane'));
      b.addEventListener('click',()=>select(i));
      b.addEventListener('keydown',e=>{const k=e.key;if(k!=='ArrowRight'&&k!=='ArrowLeft')return;e.preventDefault();const n=(i+(k==='ArrowRight'?1:-1)+buttons.length)%buttons.length;select(n);buttons[n].focus();});
      const panel=directionPanel(d,report);panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',b.id);
      buttons.push(b);panels.push(panel);bar.append(b);
    });
    wrap.append(bar,...panels);select(0);return wrap;
  }
  function render(report) {
    result.replaceChildren();sourcesPanel=null;
    if(!report.ok){status.textContent=`生成失败：${report.errors.join('；')}`;return;}
    const intro=node('div',undefined,'advice-intro');
    intro.append(node('h3',report.personalized?'根据你的情况，先看这四个方向':'信息不多，先看看这四类工作'));
    intro.append(node('p',`每条理由前面标了依据：你的情况、招聘资料或通用建议。招聘资料截至 ${market.research.date}，点“原文”可以看出处。建议仅供参考，不保证录用或收入。`,'advice-lead'));
    const notes=report.notices.filter(item=>!item.text.startsWith('本次使用市场快照 '));
    if(notes.length)intro.append(list(notes));
    if(evidenceView.auditReport(report,market).length)intro.append(node('p','有数字没找到对应来源，已在旁边标出，请不要据此做判断。','evidence-warning'));
    result.append(intro,tabs(report));
    const plan=node('section',undefined,'advice-card');plan.append(node('h3','接下来怎么做'));
    const steps=node('ol',undefined,'advice-plan');report.plan.forEach(step=>{const li=node('li');li.append(node('h4',step.title),explain(step.body,'div'),node('p','完成标志：'+step.check,'advice-meta'));steps.append(li);});plan.append(steps);result.append(plan);
    if(window.SurveyUI){const d=more('学习准备：先看看你手头有什么条件（参考劳动者问卷）');window.SurveyUI.mount(d,report);result.append(d);}
    if(window.InterviewUI){const d=more('练习与工作量：来自劳动者访谈的提醒');window.InterviewUI.mount(d,report);result.append(d);}
    const ask=more('补充这些信息，建议会更准');ask.append(list(report.questions));result.append(ask);
    const used=new Set();
    const visit=value=>{if(!value||typeof value!=='object')return;if(Array.isArray(value.claimIds))value.claimIds.forEach(id=>used.add(id));if(Array.isArray(value.claims))value.claims.forEach(id=>used.add(id));if(Array.isArray(value.aiClaims))value.aiClaims.forEach(id=>used.add(id));Object.values(value).forEach(v=>{if(v&&typeof v==='object')visit(v);});};
    visit({notices:report.notices,directions:report.directions,questions:report.questions,plan:report.plan});
    sourcesPanel=more(`本次用到的招聘资料（${used.size}条）`,'advice-sources');
    const note=node('p',`资料截至 ${market.research.date}，不会自动更新。更多检索记录见`,'advice-meta');const research=node('a','市场信息页');research.href='market.html';note.append(research,document.createTextNode('。'));sourcesPanel.append(note);
    used.forEach(id=>sourcesPanel.append(evidence(id)));result.append(sourcesPanel);
    if(window.FeedbackSection)window.FeedbackSection.mount(result,{researchDate:report.researchDate,directions:report.directions.map(d=>({id:d.id,title:d.title}))});
    else result.append(node('p','反馈模块没有加载。'));
    status.textContent=`已生成${report.directions.length}个方向。改了背景需要重新生成。`;
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
