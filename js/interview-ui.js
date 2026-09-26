(function(root){
  'use strict';
  const data=root.INTERVIEW_FINDINGS,support=root.InterviewSupport;
  const errors=support?support.validate(data):['访谈展示脚本未加载'];
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  const link=(text,href)=>{const a=el('a',text);a.href=href;return a;};
  function refs(parent,items){const p=el('p','访谈启发的依据：','advice-fields');items.forEach(([s,i])=>{p.append(link(support.titles[s]+' · 第'+(i+1)+'段','interviews.html#interview-'+s+'-'+i),document.createTextNode('；'));});parent.append(p);}
  function mount(container,report){
    const section=el('section',undefined,'advice-card interview-advice');section.id='interview-advice';section.append(el('h3','访谈提醒：把练习、工作量与交付责任补齐'));
    if(errors.length){section.append(el('p','访谈资料未就绪，暂不显示访谈启发的建议；其他建议仍可使用。'));container.append(section);return;}
    section.append(el('p','依据研究团队的定性访谈发现，以下是待验证的行动建议，不是招聘趋势、个人能力判定或对雇主的预测。把握有限：经历来自特定参与者，无法据此推断发生比例。'),link('核对访谈发现、团队原文和适用限制','interviews.html'));
    const p=support.plan(report.profile);
    p.blocks.forEach(b=>{const detail=el('details',undefined,'interview-task');detail.open=b.id==='learning';detail.append(el('summary',b.title),el('p',b.basis,'advice-basis'),el('p',support.general,'advice-basis'),el('p',b.action),el('p','可验收产出：'+b.deliverable));refs(detail,b.refs);section.append(detail);});container.append(section);
  }
  function page(target){
    if(errors.length){target.textContent='访谈资料校验失败，停止展示：'+errors.join('；');return;}
    target.replaceChildren();
    target.append(el('p','研究团队提供的书面定性发现，涉及6位参与者（访谈设计说明）。不是全国代表性样本。访谈实际开展日期、具体城市、招募方法与逐字稿未提供；设计中的时长不等于实际访谈时长。本地文件核对日期：2026-09-26。'),el('p','内部资料未提供公开发布URL；以下为中文阅读提示及团队原文定位。中文提示是本站概括，英文是团队提供的发现；两者均不构成独立验证。未核实团队引用的外部文献，不将其当作本站已取得的证据。'),link('核对原始访谈文件','data/interview-findings.js'),el('h2','怎样使用这些发现'),el('p','个案中的提速、方案数量、入门岗位变化和支付意愿不能转成普遍比例、待遇预测或职业安全排名。团队提到的问卷比例是对调查的转引，不是访谈统计，也不构成另一组独立验证。'),link('核对问卷题目与统计口径','survey.html'));
    const nav=el('nav');nav.setAttribute('aria-label','访谈发现');support.titles.forEach((t,i)=>nav.append(link(t,'#interview-section-'+i)));target.append(nav);
    data.sections.forEach((s,i)=>{const section=el('section',undefined,'interview-source');section.id='interview-section-'+i;section.append(el('h2',support.titles[i]),el('p',support.summaries[i]),el('p','来源定位：'+s.heading+'；下列段落按原序编号。'));
      if(i===5)section.append(el('p','第1段转引问卷：对应Q14和Q13，请回到调查数据核对；不把问卷比例称作访谈比例。'),link('调查Q14','survey.html#survey-Q14'),document.createTextNode(' · '),link('调查Q13','survey.html#survey-Q13'));
      s.paragraphs.forEach((paragraph,j)=>{const detail=el('details');detail.id='interview-'+i+'-'+j;detail.append(el('summary','团队英文原文 · 第'+(j+1)+'段'),el('p',paragraph));section.append(detail);});target.append(section);
    });
  }
  root.InterviewUI=Object.freeze({mount,page,errors});const target=document.getElementById('interview-content');if(target)page(target);
})(typeof window!=='undefined'?window:globalThis);
