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
    const p=el('p','调查依据（受访者自述，非招聘需求证据）：','survey-source');
    questions.forEach(id=>p.append(link(id+' '+data.questions[qIndex(id)].text,'survey.html#survey-'+id),document.createTextNode('；')));
    p.append(link('团队发现：Survey Findings 第'+(finding+1)+'段','survey.html#finding-1-'+finding));parent.append(p);
  }
  function mount(container,report){
    const section=el('section',undefined,'advice-card survey-advice');section.id='survey-advice';section.append(el('h3','调查提醒：先核实任务和可用支持'));
    if(errors.length){section.append(el('p','调查资料未就绪，本次不展示调查判断；原有市场建议仍可使用。'));container.append(section);return;}
    section.append(el('p',`研究团队提供 · ${data.collected} · ${number('n')}份有效答卷。它反映样本中的经历与看法，不证明你缺乏技能，也不是全国就业预测。`),el('p','适用把握有限：样本集中、没有个人交叉数据；以下学习安排是受调查启发的设计建议，尚未验证对你的效果。'),link('查看全部题目、团队原文、样本范围与口径疑问','survey.html'));
    section.append(el('p',stat('Q13',3)+'；'+stat('Q14',3)+'。均为样本报告的情况，不推定你也缺少政策或资源。'));
    citations(section,['Q13','Q14'],5);
    const label=el('label','目前最需要先确认什么？（选填，只影响下面的学习安排）');label.htmlFor='survey-learning-path';
    const select=el('select');select.id='survey-learning-path';select.setAttribute('aria-describedby','survey-path-note');
    for(const[key,p]of Object.entries(support.paths)){const o=el('option',p.label);o.value=key;select.append(o);}select.value='unknown';
    const hint=el('p','这是你的当前选择，不是从调查推算的结论。不保存、不上传；重新生成时回到“暂不确定”。不影响职业方向排序。');hint.id='survey-path-note';
    const body=el('div');body.setAttribute('aria-live','polite');
    function render(){const p=support.plan(report.profile,select.value);body.replaceChildren();body.append(el('p','你的背景（自述）：'+p.experience),el('h4',p.label),el('p',support.general,'advice-basis'),el('p',p.text),el('p','可验收产出：'+p.deliverable));citations(body,p.questions,p.finding);}
    select.addEventListener('change',render);section.append(label,select,hint,body);render();container.append(section);
  }
  function table(headers,rows){const wrap=el('div',undefined,'survey-table-wrap'),t=el('table'),head=el('thead'),tr=el('tr');headers.forEach(h=>{const th=el('th',h);th.scope='col';tr.append(th);});head.append(tr);const body=el('tbody');rows.forEach(row=>{const tr=el('tr');row.forEach((v,i)=>{const cell=el(i?'td':'th',v);if(!i)cell.scope='row';tr.append(cell);});body.append(tr);});t.append(head,body);wrap.append(t);return wrap;}
  function page(target){
    if(errors.length){target.textContent='调查文件校验失败，停止展示：'+errors.join('；');return;}
    target.replaceChildren();
    const intro=el('section');intro.append(el('h2',data.title),el('p',`${data.source}；收集时间：${data.collected}；有效答卷：${number('n')}。本地文件核对日期：2026-09-26；这不是网络检索访问日期。`),el('p','研究团队内部汇总资料；未提供公开发布URL。可核对随站点提供的两份原始文件。具体省市、抽样方法、回收率和题目交叉数据未提供。'),link('问卷汇总原文件','data/survey-data.js'),document.createTextNode(' · '),link('团队书面发现原文件','data/survey-findings.js'));
    intro.append(el('h3','样本范围与适用限制'),el('p',stat('Q1',2)+'；'+stat('Q3',0)+'；'+stat('Q4',0)+'；'+stat('Q8',4)+'；'+stat('Q6',2)+'。年龄选项见Q1；城市层级不等于具体城市覆盖。'),el('p','这些是本样本边际分布，不表示同一群人同时符合上述条件。不能推广至全体中国劳动者，也不能用它推定学生、待业者、其他年龄或学历群体的能力与机会。没有进行交叉分组、加权、显著性检验或个体预测。'));
    const caveats=el('section');caveats.append(el('h3','读取这些数字前'),el('p','以下人数、比例与均值直接读取原统计值，保留原数值写法，不重新四舍五入或合并选项。'));data.notes.forEach(n=>caveats.append(el('p',n)));
    caveats.append(el('p','Q12与Q24询问相近内容，但分组边界与结果不同，分别展示、不合并。Q25题干要求只由部分受访者回答，但每行valid_n均为49；跳题执行情况未确认，本站不据此估计提效或工作量变化。'),el('p','Q19与Q20是受访者对未来的主观量表均值，不是已验证的失业或获益概率，不能转换成百分比。Q26/Q27分别是重要性变化与自评能力，不能直接相减或断定某用户存在技能缺口。'),el('p','团队原文有合并档位的比例与不同小数写法；本站不把这些重新计算为调查事实，而是展示原数据逐档数值。书面解读与汇总统计有疑问时并列保留，等待团队核实。团队文献引用及缺失的插图未独立核验，不作为本站另行取得的研究证据。'));
    target.append(intro,caveats);
    const changes=el('section');changes.append(el('h3','这份调查怎样改变了网站'),el('p',stat('Q22',5)+'；'+stat('Q22',2)+'；'+stat('Q22',1)+'。这只是本样本的系统偏好。网站因此继续优先显示依据，并增加能核验的任务与资源准备路径，不增加替代概率或工资预测。'));citations(changes,['Q22'],12);target.append(changes);
    const nav=el('nav');nav.setAttribute('aria-label','调查题目');data.questions.forEach(q=>nav.append(link(q.id,'#survey-'+q.id)));target.append(nav);
    data.questions.forEach((q,i)=>{
      const section=el('section',undefined,'survey-question');section.id='survey-'+q.id;section.append(el('h3',q.id+' · '+q.text),el('p','调查样本自述 · '+q.wjx_type+' · 收集：'+data.collected));
      if(q.id==='Q25')section.append(el('p','口径待核实：仅保留原统计，不用于效率结论。','evidence-warning'));
      if(q.mean!==undefined)section.append(el('p','原文件量表均值：'+number('questions.'+i+'.mean')+'；主观看法，不是概率预测。'));
      if(q.options)section.append(table(['原选项','人数','原比例'],q.options.map((o,j)=>[o.label,number(`questions.${i}.options.${j}.count`),number(`questions.${i}.options.${j}.pct`)+'%'])),el('p','原文件valid_n：'+number('questions.'+i+'.valid_n')));
      if(q.items)q.items.forEach((item,j)=>{const detail=el('details');detail.append(el('summary',item.label),table(['原档位','人数','原比例'],Object.entries(item.distribution).map(([k,v])=>[q.column_labels?.[k]||k,number(`questions.${i}.items.${j}.distribution.${k}.count`),number(`questions.${i}.items.${j}.distribution.${k}.pct`)+'%'])),el('p','原文件valid_n：'+number(`questions.${i}.items.${j}.valid_n`)+'；原文件分布计算均值：'+number(`questions.${i}.items.${j}.mean_computed_from_distribution`)+'。'));section.append(detail);});
      section.append(link('原始汇总文件（定位 '+q.id+'）','data/survey-data.js'));target.append(section);
    });
    const headings=['团队原文：调查设计','团队原文：调查发现'];
    findings.sections.forEach((s,i)=>{const section=el('section');section.append(el('h2',headings[i]||s.heading),el('p','下列英文由研究团队提供，按原段保留；是团队解读，不等于全国招聘事实。'));s.paragraphs.forEach((p,j)=>{const detail=el('details');detail.id=`finding-${i}-${j}`;detail.append(el('summary',s.heading+' · 第'+(j+1)+'段'),el('p',p));section.append(detail);});target.append(section);});
  }
  root.SurveyUI=Object.freeze({mount,page,stat,errors});
  const target=document.getElementById('survey-content');if(target)page(target);
})(typeof window!=='undefined'?window:globalThis);
