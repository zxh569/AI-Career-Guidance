(function(root){
  'use strict';
  const data=root.SURVEY_DATA,findings=root.SURVEY_FINDINGS,numbers=root.SURVEY_NUMBER_TEXT,support=root.SurveySupport;
  const errors=support?support.validate(data,findings,numbers):['调查展示脚本未加载'];
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  const link=(text,href)=>{const a=el('a',text);a.href=href;return a;};
  const qIndex=id=>data.questions.findIndex(q=>q.id===id);
  const number=path=>numbers[path];
  function stat(id,index){
    const i=qIndex(id),q=data.questions[i],o=q.options[index];
    return `${id}「${o.label}」：${number('questions.'+i+'.options.'+index+'.count')}人（${number('questions.'+i+'.options.'+index+'.pct')}%）`;
  }
  function citations(parent,questions,finding){
    const p=el('p','参考：','survey-source');
    questions.forEach(id=>p.append(link(id+' '+data.questions[qIndex(id)].text,'survey.html#survey-'+id),document.createTextNode('；')));
    p.append(link('问卷结论第'+(finding+1)+'段','survey.html#finding-1-'+finding));parent.append(p);
  }
  function mount(container,report){
    const section=el('section',undefined,'advice-card survey-advice');section.id='survey-advice';section.append(el('h3','学习准备'));
    if(errors.length){section.append(el('p','问卷资料没有加载成功（未就绪），这部分暂不显示。'));container.append(section);return;}
    section.append(el('p',`这部分参考了我们在${data.collected}做的劳动者问卷（${number('n')}份有效答卷）。受访者以二线城市、制造业为主，结果只作参考。`),link('查看问卷详情','survey.html'));
    const count=(id,k)=>{const i=qIndex(id);return number('questions.'+i+'.options.'+k+'.count')+'人（'+number('questions.'+i+'.options.'+k+'.pct')+'%）';};section.append(el('p','受访者里，单位对员工用 AI “没有明确政策或不清楚”的有'+count('Q13',3)+'；付费工具、AI 培训、内部数据一样都没有的有'+count('Q14',3)+'。所以下面的建议不默认你有单位支持。'));
    citations(section,['Q13','Q14'],5);
    const label=el('label','你现在的情况更接近哪一种？（选填）');label.htmlFor='survey-learning-path';
    const select=el('select');select.id='survey-learning-path';select.setAttribute('aria-describedby','survey-path-note');
    for(const[key,p]of Object.entries(support.paths)){const o=el('option',p.label);o.value=key;select.append(o);}select.value='unknown';
    const hint=el('p','只影响下面的学习建议，不影响推荐的方向，也不会保存。','advice-meta');hint.id='survey-path-note';
    const body=el('div');body.setAttribute('aria-live','polite');
    function render(){const p=support.plan(report.profile,select.value);body.replaceChildren();body.append(el('p',p.experience,'advice-meta'),el('h4',p.label),el('span',support.general,'advice-chip advice-chip-general'),el('p',p.text),el('p','完成标志：'+p.deliverable));citations(body,p.questions,p.finding);}
    select.addEventListener('change',render);section.append(label,select,hint,body);render();container.append(section);
  }
  function table(headers,rows){const wrap=el('div',undefined,'survey-table-wrap'),t=el('table'),head=el('thead'),tr=el('tr');headers.forEach(h=>{const th=el('th',h);th.scope='col';tr.append(th);});head.append(tr);const body=el('tbody');rows.forEach(row=>{const tr=el('tr');row.forEach((v,i)=>{const cell=el(i?'td':'th',v);if(!i)cell.scope='row';tr.append(cell);});body.append(tr);});t.append(head,body);wrap.append(t);return wrap;}
  function page(target){
    if(errors.length){target.textContent='调查文件校验失败，停止展示：'+errors.join('；');return;}
    target.replaceChildren();
    const intro=el('section');intro.append(el('h2',data.title),el('p',`${data.source}，${data.collected}收集，有效答卷${number('n')}份。`),el('p','这是研究团队的内部资料，没有公开发布。下面两个链接是原始文件，可以直接核对。'),link('问卷汇总原文件','data/survey-data.js'),document.createTextNode(' · '),link('团队书面发现原文件','data/survey-findings.js'));
    intro.append(el('h3','受访者是谁'),el('p',stat('Q1',2)+'；'+stat('Q3',0)+'；'+stat('Q4',0)+'；'+stat('Q8',4)+'；'+stat('Q6',2)+'。'),el('p','样本比较集中，不能代表全国劳动者，也不能用来推断学生、求职者或其他年龄、学历人群的情况。'));
    const caveats=el('section');caveats.append(el('h3','看数字前请注意'),el('p','下面的人数、比例和平均分都是问卷星的原始统计，没有重新计算。'));caveats.append(el('p','多选题的比例按49人计算，加起来可能超过100%。矩阵题的平均分按1–5分计算，选“不涉及”的不算在内。Q19、Q20 是0–10分，0表示“不可能”，10表示“极有可能”。'));
    caveats.append(el('p','Q12 和 Q24 问的内容相近，但分组不同，分开展示。Q25 题干写着只由部分人回答，但每行有效人数都是49，网站没有用它推断效率变化。'),el('p','Q19、Q20 是受访者对未来的主观打分，不是失业或获益的概率。Q26 是能力重要性的变化，Q27 是自评能力，两者不能相减，也不能用来判断某个人缺什么技能。'),el('p','团队文字里有些比例是把两档加在一起算的，写法和下面逐档的数字不同，以原始统计为准。团队引用的文献没有另外核对。'));
    target.append(intro,caveats);
    const changes=el('section');changes.append(el('h3','这份问卷对网站的影响'),el('p','受访者最希望这类工具提供什么（Q22）：'+stat('Q22',5)+'；'+stat('Q22',2)+'；'+stat('Q22',1)+'。所以网站把依据摆在前面，并加入了“学习准备”；不提供被替代的概率或工资预测。'));citations(changes,['Q22'],12);target.append(changes);
    const nav=el('nav');nav.setAttribute('aria-label','调查题目');data.questions.forEach(q=>nav.append(link(q.id,'#survey-'+q.id)));target.append(nav);
    data.questions.forEach((q,i)=>{
      const section=el('section',undefined,'survey-question');section.id='survey-'+q.id;section.append(el('h3',q.id+' · '+q.text),el('p',q.wjx_type,'advice-meta'));
      if(q.id==='Q25')section.append(el('p','这道题只展示原始统计，没有用于推荐。','advice-meta'));
      if(q.mean!==undefined)section.append(el('p','平均分：'+number('questions.'+i+'.mean')+'（主观打分，不是概率）'));
      if(q.options)section.append(table(['选项','人数','比例'],q.options.map((o,j)=>[o.label,number(`questions.${i}.options.${j}.count`),number(`questions.${i}.options.${j}.pct`)+'%'])),el('p','有效人数：'+number('questions.'+i+'.valid_n'),'advice-meta'));
      if(q.items)q.items.forEach((item,j)=>{const detail=el('details');detail.append(el('summary',item.label),table(['分值','人数','比例'],Object.entries(item.distribution).map(([k,v])=>[q.column_labels?.[k]||k,number(`questions.${i}.items.${j}.distribution.${k}.count`),number(`questions.${i}.items.${j}.distribution.${k}.pct`)+'%'])),el('p','有效人数：'+number(`questions.${i}.items.${j}.valid_n`)+'；平均分：'+number(`questions.${i}.items.${j}.mean_computed_from_distribution`)+'。'));section.append(detail);});
      section.append(link('原始汇总文件（定位 '+q.id+'）','data/survey-data.js'));target.append(section);
    });
    const headings=['团队原文：调查设计','团队原文：调查发现'];
    findings.sections.forEach((s,i)=>{const section=el('section');section.append(el('h2',headings[i]||s.heading),el('p','以下是研究团队的原文（英文），代表团队的解读。','advice-meta'));s.paragraphs.forEach((p,j)=>{const detail=el('details');detail.id=`finding-${i}-${j}`;detail.append(el('summary',s.heading+' · 第'+(j+1)+'段'),el('p',p));section.append(detail);});target.append(section);});
  }
  root.SurveyUI=Object.freeze({mount,page,stat,errors});
  const target=document.getElementById('survey-content');if(target)page(target);
})(typeof window!=='undefined'?window:globalThis);
