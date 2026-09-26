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
  let currentReport=null;
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
  if(!preflight?.ok||!evidenceView){status.textContent='建议资料未就绪，无法生成。请检查市场资料与本地脚本完整性；不会用无来源内容补足方向。';return;}
  button.disabled=false;
  status.textContent='可直接生成，也可先填写背景。表单未填完仍可探索；输入仅在本页处理。';
  const claims=new Map(market.claims.map(c=>[c.id,c]));
  const sources=new Map(market.sources.map(s=>[s.id,s]));
  const basisLabels={profile:'你的背景（自述）',market:'市场来源',general:'一般知识，非当前招聘市场证据'};
  const factState={snapshot:'研究快照，岗位状态未确认',closed:'已结束，仅作条件样本',historical:'历史资料，不作当前在招证明'};
  const urlLink=(text,url)=>{const a=node('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';return a;};
  function explain(item) {
    const block=node('div',undefined,'advice-note');
    const assessment=evidenceView.statement(item,currentReport?.profile);
    block.append(node('p',assessment.type,'evidence-type'),node('p',item.basis.map(t=>basisLabels[t]).join(' ＋ '),'advice-basis'),node('p',item.text),node('p','把握说明：'+assessment.confidence,'evidence-confidence'));
    const unsupported=evidenceView.precision(item.text,item.claimIds,market);
    if(unsupported.length)block.append(node('p','未核实数字：'+unsupported.join('、')+'。没有找到对应的来源数值，请勿据此判断概率、待遇或作出决定。','evidence-warning'));
    if(item.fields.length)block.append(node('p',`涉及背景：${item.fields.map(k=>schema[k]?.label||k).join('、')}`,'advice-fields'));
    // References point to the cited evidence inside this generated report.
    if(item.claimIds.length) {
      const p=node('p','依据定位：','advice-fields');
      [...new Set(item.claimIds)].forEach((id,i)=>{const a=node('a',claims.get(id).title);a.href=`#advice-evidence-${id}`;if(i)p.append(document.createTextNode(' · '));p.append(a);});
      block.append(p);
      const details=node('details',undefined,'evidence-details');details.append(node('summary','展开这条判断的来源时间与地区'));
      [...new Set(item.claimIds)].forEach(id=>{
        const c=claims.get(id),info=evidenceView.fact(c);
        details.append(node('p',c.title+'：'+info.type),node('p','地区：'+info.region+'；数据时期：'+c.period),node('p','证据把握：'+info.confidence),node('p','局限：'+c.caveat));
        c.evidence.forEach(e=>{const s=sources.get(e.sourceId);const p=node('p');p.append(urlLink(s.publisher+'：'+s.title,e.url));details.append(p,node('p','发布：'+s.publishedAt+'；访问：'+e.accessedAt+'；来源适用范围：'+s.scope));});
      });block.append(details);
    }
    return block;
  }
  function evidence(id) {
    const c=claims.get(id);const block=node('article',undefined,'advice-evidence');block.id=`advice-evidence-${id}`;
    const info=evidenceView.fact(c);
    block.append(node('p',info.type,'evidence-type'),node('p','地区：'+info.region),node('p','证据把握：'+info.confidence,'evidence-confidence'));
    block.append(node('h4',c.title),node('p',`${c.kind} · ${factState[c.status]}`,'advice-basis'),node('p',c.text),node('p',`数据时期：${c.period}`,'advice-fields'),node('p',`局限：${c.caveat}`,'advice-caution'));
    c.evidence.forEach(e=>{
      const s=sources.get(e.sourceId);const p=node('p');p.append(urlLink(`${s.publisher}：${s.title}（新窗口）`,e.url));
      block.append(p,node('p',`发布：${s.publishedAt}；访问：${e.accessedAt}；原文定位：${e.locator}`,'advice-fields'),node('p','来源适用范围：'+s.scope,'advice-fields'));
    });return block;
  }
  function group(title,items) {
    const section=node('section',undefined,'advice-block');section.append(node('h4',title));items.forEach(item=>section.append(explain(item)));return section;
  }
  function render(report) {
    result.replaceChildren();
    if(!report.ok){status.textContent=`建议生成失败：${report.errors.join('；')}`;return;}
    currentReport=report;
    const intro=node('div',undefined,'advice-intro');intro.append(node('h3',report.personalized?'从这些任务开始比较':'信息较少：先用四个方向做探索'));
    const guide=node('section',undefined,'evidence-guide');
    guide.append(node('h4','先读依据与不确定性'),node('p','市场研究日期：'+market.research.date+'（记录时区：'+market.research.timezone+'）。生成建议不会刷新资料；研究日、来源发布日期、数据时期和访问日含义不同。'),node('p','招聘市场陈述：带来源的统计、报告或岗位样本；单个岗位不代表趋势。关于你的推断：把自述与样本要求比较，尚未经过实际能力验证。一般知识：任务分析和学习建议，没有专项实证时会明确说明。'),node('p','把握程度针对证据能否支持当前用途，不是个人成功率。低＝信息不足或条件冲突；有限＝有线索但不能充分验证适配；尚未验证＝一般知识推断或学习方案。本站不把引用完整等同于事实可靠。'),node('p','共同局限：资料覆盖不全，平台与地区样本可能偏向特定人群；当前空缺、薪酬和雇主认可未核实。自由文本未作语义分析，自述未验证；不承诺录用、收入或AI替代结果。'));
    const researchLink=node('a','查看研究方法、检索记录与未能取得的信息');researchLink.href='market.html';guide.append(researchLink);guide.append(node('p','研究团队调查另列为样本自述证据，不能代替招聘需求资料，也不会用于行业排序或个人失业概率。'));const surveyLink=node('a','核对劳动者调查：题目、团队发现与适用范围');surveyLink.href='survey.html';guide.append(surveyLink);const interviewLink=node('a','查看定性访谈发现与适用边界');interviewLink.href='interviews.html';guide.append(document.createTextNode(' · '),interviewLink);
    const numericIssues=evidenceView.auditReport(report,market);
    guide.append(node('p',numericIssues.length?'发现未核实数字，已在对应判断旁标记；不要将其当作证据。':'数字出处检查：未发现缺少对应引用的精确数值。检查只比较文本与引用，不能验证原始数据或因果解释。','evidence-confidence'));
    intro.append(guide);report.notices.filter(item=>!item.text.startsWith('本次使用市场快照 ')).forEach(item=>intro.append(explain(item)));result.append(intro);
    const jump=node('nav',undefined,'advice-jump');jump.setAttribute('aria-label','建议内容');
    report.directions.forEach(d=>{const a=node('a',d.title);a.href=`#advice-direction-${d.id}`;jump.append(a);});if(window.FeedbackSection){const a=node('a','评价这份建议');a.href='#result-feedback';jump.append(a);}if(window.InterviewUI){const a=node('a','访谈启发的练习与交付检查');a.href='#interview-advice';jump.append(a);}result.append(jump);
    report.directions.forEach(d=>{
      const card=node('article',undefined,'advice-card');card.id=`advice-direction-${d.id}`;
      card.append(node('p',d.lane,'advice-lane'),node('h3',d.title),node('p',`探索分类：${d.industry} ｜ 职能：${d.function}`),node('p','公司／岗位示例：以下市场摘要仅供理解任务，不能直接当作当前投递清单。','advice-caution'));
      card.append(node('p',evidenceView.direction(d,report),'evidence-confidence'));
      d.claims.forEach(id=>{const c=claims.get(id);const info=evidenceView.fact(c);card.append(node('p',info.type+'；地区：'+info.region,'evidence-type'));const p=node('p',c.text);const a=node('a',`查看来源与访问日期 · ${factState[c.status]}`);a.href=`#advice-evidence-${id}`;card.append(p,a);});
      card.append(group('为什么放入探索清单',d.reasons),group('可能不适合／必须先核实',d.risks));
      const preparation=node('a','调查启发的准备步骤：先核实任务、工具与支持');preparation.href='#survey-advice';if(window.SurveyUI)card.append(preparation);
      const ai=node('section',undefined,'advice-block');ai.append(node('h4','AI可能改变哪些任务'),explain(d.aiAdvice),explain(d.aiPreparation));
      if(!d.aiClaims.length)ai.append(node('p','证据缺口：现有资料没有本方向AI影响的专项实证，以上仅为任务层面的一般知识推断。','advice-caution'));card.append(ai);
      const gaps=node('section',undefined,'advice-block');gaps.append(node('h4','技能差距：先区分不会与尚未确认'));
      d.gaps.forEach(g=>{const part=node('div',undefined,'advice-gap');part.append(node('h5',g.title),node('p',g.status,'advice-basis'),explain(g.assessment),explain(g.why));gaps.append(part);});
      gaps.append(node('h5','把上述能力放进一个可验收任务'),explain(d.gaps[0].action),node('h5','完成后如何核对'),explain(d.gaps[0].acceptance));card.append(gaps,group('补充什么会改变这个方向',d.questions));result.append(card);
    });
    if(window.SurveyUI)window.SurveyUI.mount(result,report);
    else result.append(node('p','调查模块未加载，本次未采用调查建议。'));
    if(window.InterviewUI)window.InterviewUI.mount(result,report);
    else result.append(node('p','访谈模块未加载，本次未采用访谈启发的建议。'));
    const plan=node('section',undefined,'advice-card');plan.append(node('h3','按顺序推进：不预设求职期限'));
    const list=node('ol',undefined,'advice-plan');report.plan.forEach(step=>{const li=node('li');li.append(node('h4',step.title),explain(step.body),explain({text:'验收：'+step.check,basis:['general'],claimIds:[],fields:[]}));list.append(li);});plan.append(list);result.append(plan);
    result.append(group('哪些补充信息最可能改变建议',report.questions));
    const evidenceSection=node('section',undefined,'advice-card');evidenceSection.append(node('h3','本次建议使用的全部市场依据'),node('p','下面保留原始市场摘要及局限。点击来源可核对原文；本页不会自动更新岗位状态。'));
    const used=new Set();
    const visit=value=>{if(!value||typeof value!=='object')return;if(Array.isArray(value.claimIds))value.claimIds.forEach(id=>used.add(id));if(Array.isArray(value.claims))value.claims.forEach(id=>used.add(id));if(Array.isArray(value.aiClaims))value.aiClaims.forEach(id=>used.add(id));Object.values(value).forEach(v=>{if(v&&typeof v==='object')visit(v);});};
    visit({notices:report.notices,directions:report.directions,questions:report.questions,plan:report.plan});
    used.forEach(id=>evidenceSection.append(evidence(id)));result.append(evidenceSection);
    if(window.FeedbackSection)window.FeedbackSection.mount(result,{researchDate:report.researchDate,directions:report.directions.map(d=>({id:d.id,title:d.title}))});
    else result.append(node('p','反馈模块未加载，请检查本地文件。'));
    status.textContent=`已生成${report.directions.length}个探索方向。基于当前表单；修改背景后需重新生成。未调用AI服务，未上传输入。`;
    result.focus();
  }
  button.addEventListener('click',()=>render(engine.build(current(),market,catalog,schema,audit)));
  function invalidate() {
    if(!result.children.length)return;
    result.replaceChildren();status.textContent='背景已修改或草稿状态已变化，旧建议已撤下。请重新生成，确保依据与当前表单一致。';
  }
  form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);form.addEventListener('reset',invalidate);
  window.addEventListener('storage',e=>{if(e.key==='career-guidance.profile.v1'||e.key===null)invalidate();});
})();
