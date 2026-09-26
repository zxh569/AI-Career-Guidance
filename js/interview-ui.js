(function(root){
  'use strict';
  const data=root.INTERVIEW_FINDINGS,support=root.InterviewSupport;
  const errors=support?support.validate(data):['访谈展示脚本未加载'];
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  const link=(text,href)=>{const a=el('a',text);a.href=href;return a;};
  function refs(parent,items){const p=el('p','参考：','advice-meta');items.forEach(([s,i])=>{p.append(link(support.titles[s]+' · 第'+(i+1)+'段','interviews.html#interview-'+s+'-'+i),document.createTextNode('；'));});parent.append(p);}
  function mount(container,report){
    const section=el('section',undefined,'advice-card interview-advice');section.id='interview-advice';section.append(el('h3','来自访谈的提醒'));
    if(errors.length){section.append(el('p','访谈资料没有加载成功（未就绪），这部分暂不显示。'));container.append(section);return;}
    section.append(el('p','这部分参考了我们对几位劳动者的访谈，是一些值得注意的做法，不是统计结论。'),link('查看访谈详情','interviews.html'));
    const p=support.plan(report.profile);
    p.blocks.forEach(b=>{const detail=el('details',undefined,'interview-task');detail.open=b.id==='learning';detail.append(el('summary',b.title),el('p',b.basis,'advice-meta'),el('span',support.general,'advice-chip advice-chip-general'),el('p',b.action),el('p','完成标志：'+b.deliverable));refs(detail,b.refs);section.append(detail);});container.append(section);
  }
  function page(target){
    if(errors.length){target.textContent='访谈资料校验失败，停止展示：'+errors.join('；');return;}
    target.replaceChildren();
    target.append(el('p','研究团队整理的访谈发现，共6位受访者，不是有代表性的全国样本。访谈的具体日期、城市和逐字稿没有提供。'),el('p','每一节先有一句中文概括，下面是团队的英文原文。团队引用的文献没有另外核对。'),link('访谈原始文件','data/interview-findings.js'),el('h2','怎么看这些发现'),el('p','这些是个别人的经历，不能换算成比例，也不能用来预测收入或判断哪个职业更安全。团队文中提到的问卷比例来自问卷，不是访谈统计。'),link('查看问卷','survey.html'));
    const nav=el('nav');nav.setAttribute('aria-label','访谈发现');support.titles.forEach((t,i)=>nav.append(link(t,'#interview-section-'+i)));target.append(nav);
    data.sections.forEach((s,i)=>{const section=el('section',undefined,'interview-source');section.id='interview-section-'+i;section.append(el('h2',support.titles[i]),el('p',support.summaries[i]),el('p','原文章节：'+s.heading,'advice-meta'));
      if(i===5)section.append(el('p','第1段引用了问卷数据（Q14、Q13），可以到问卷页核对。'),link('调查Q14','survey.html#survey-Q14'),document.createTextNode(' · '),link('调查Q13','survey.html#survey-Q13'));
      s.paragraphs.forEach((paragraph,j)=>{const detail=el('details');detail.id='interview-'+i+'-'+j;detail.append(el('summary','原文第'+(j+1)+'段'),el('p',paragraph));section.append(detail);});target.append(section);
    });
  }
  root.InterviewUI=Object.freeze({mount,page,errors});const target=document.getElementById('interview-content');if(target)page(target);
})(typeof window!=='undefined'?window:globalThis);
