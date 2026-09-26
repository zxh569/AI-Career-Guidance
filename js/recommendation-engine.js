(function (root) {
  'use strict';
  const GENERAL = '一般知识，非当前招聘市场证据';
  const note = (text, basis = ['general'], claimIds = [], fields = []) => ({text,basis,claimIds,fields});
  const degreeRanks = [0,1,1,2,3,4,5,null,null];
  const yearRanges = [[0,0],[0,1],[1,4],[4,8],[8,16],[16,Infinity],null];
  const index = (value, field) => value ? Number(value.slice(field.length + 1)) : null;
  function normalize(input, schema) {
    const values = {};
    const invalid = [];
    const raw = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    for (const [name, def] of Object.entries(schema)) {
      const value = raw[name];
      if (def.type === 'multiple') {
        values[name] = Array.isArray(value) ? [...new Set(value.filter(v => def.options.some(o => o.value === v)))] : [];
        if (value !== undefined && (!Array.isArray(value) || value.length !== values[name].length)) invalid.push(name);
      } else if (def.type === 'select') {
        values[name] = typeof value === 'string' && def.options.some(o => o.value === value) ? value : '';
        if (value !== undefined && value !== '' && !values[name]) invalid.push(name);
      } else {
        values[name] = typeof value === 'string' ? value.slice(0,def.maxLength).trim() : '';
        if (value !== undefined && (typeof value !== 'string' || value.length > def.maxLength)) invalid.push(name);
      }
    }
    return {values,invalid};
  }
  function auditCatalog(catalog, market, schema) {
    const errors=[];
    if (!catalog || catalog.version !== 1 || !Array.isArray(catalog.directions) || catalog.directions.length < 4) return ['方向资料缺失或版本不兼容'];
    const ids=new Set();
    const claims=new Set((market.claims || []).map(c=>c.id));
    for(const d of catalog.directions) {
      if(!d.id || ids.has(d.id)) errors.push('方向ID缺失或重复'); ids.add(d.id);
      for(const key of ['title','industry','function','family','project','deliverable','ai','question']) if(typeof d[key]!=='string'||!d[key].trim()) errors.push(`${d.id} 缺少 ${key}`);
      if(!Array.isArray(d.claims)||!d.claims.length) errors.push(`${d.id} 无市场样本`);
      for(const id of [...(d.claims||[]),...(d.aiClaims||[])]) if(!claims.has(id)) errors.push(`${d.id} 缺少引用 ${id}`);
      for(const field of ['industries','skills']) {
        const name=field==='industries'?'industry':'skills';
        for(const option of d[field]||[]) if(!schema[name].options.some(o=>o.value===option)) errors.push(`${d.id} ${name} 映射失效`);
      }
      if(!Array.isArray(d.skillsToCheck)||!d.skillsToCheck.length)errors.push(`${d.id} 缺少技能验证任务`);
      for(const gap of d.skillsToCheck||[]) {
        if(!Array.isArray(gap)||!gap[0]||!claims.has(gap[2]))errors.push(`${d.id} 技能依据缺失`);
        for(const option of gap[1]||[])if(!schema.skills.options.some(o=>o.value===option))errors.push(`${d.id} 技能标签失效`);
      }
    }
    return errors;
  }
  function build(raw, market, catalog, schema, audit) {
    if(!market || !audit || !schema) return {ok:false,errors:['市场数据、来源检查器或字段映射未加载。']};
    const checked=audit.validate(market);
    if(!checked.valid)return {ok:false,errors:checked.errors};
    const catalogErrors=auditCatalog(catalog,market,schema);
    if(catalogErrors.length)return {ok:false,errors:catalogErrors};
    const {values:p,invalid}=normalize(raw,schema);
    const label=(field,value)=>schema[field].options?.find(o=>o.value===value)?.label || '未填写';
    const selectedSkills=p.skills;
    const degree=degreeRanks[index(p.education,'education')] ?? null;
    const years=yearRanges[index(p.workYears,'workYears')] ?? null;
    const student=p.stage==='stage-0'||p.educationStatus==='educationStatus-0';
    const sourceMap=new Map(market.claims.map(c=>[c.id,c]));
    const filled=Object.values(p).filter(v=>Array.isArray(v)?v.length:v!=='').length;
    const specific=!!(selectedSkills.length || (p.industry && !['industry-0','industry-15','industry-16'].includes(p.industry)));
    const notices=[
      note('以下是四个待验证的探索方向，不是录用判断。次序只反映公开规则的比较顺序，不是职业总分或成功率。'),
      note(`本次使用市场快照 ${market.research.date}，未联网更新；样本公司只用于理解岗位，不保证仍在招聘。`),
      note('一般知识判断与学习任务属于规则设计者的建议，不能代替当前招聘证据；年龄不会用于排序或剔除方向。')
    ];
    if(!specific) notices.push(note('行业或技能信息不足以个性化筛选。这四项是覆盖不同任务的探索起点，不表示你已具备任职条件。', ['profile','general'],[],['industry','skills']));
    if(invalid.length)notices.push(note('部分输入格式不兼容，已按未知处理；没有更改你的原草稿。请检查背景表单。',['profile'],[],invalid));
    const textFields=['major','experience','skillDetails','goalDetails'];
    if(textFields.some(k=>p[k]))notices.push(note('你的自由文本已保留在背景表单，但此规则不自动解读专业名称、经历、证书或意愿，也不会从“不会编程”等句子误判能力。下方列出这些内容需要核实的地方；排序主要使用明确选择的选项。',['profile','general'],[],textFields.filter(k=>p[k])));
    if(p.stage && years && ((p.stage==='stage-1'&&years[1]===0)||(p.goal==='goal-2'&&years[0]>=4)))notices.push(note('当前状态、累计年限与目标可能需要补充解释；可以是转行、兼职或在读工作，并不视为填错。先核对相关经验与当前目标。',['profile'],[],['stage','workYears','goal']));
    const candidates=catalog.directions.filter(d=> !d.campus || (degree!==null&&degree>=4&&(student||p.goal==='goal-2'))).filter(d=>!d.intern||student||p.goal==='goal-1').map((d,order)=>{
      const reasons=[],risks=[],questions=[];
      let conflict=false,uncertain=false;
      const industryHit=d.industries.includes(p.industry);
      const skillHits=selectedSkills.filter(v=>d.skills.includes(v));
      const minimumDegree=d.id==='digital'&&degree!==null&&degree>=4&&student?4:d.minEducation;
      const minimumYears=d.id==='digital'&&degree!==null&&degree>=4&&student?0:d.minYears;
      if(industryHit)reasons.push(note(`你选择的行业是“${label('industry',p.industry)}”；因此把这个相邻任务方向加入比较。同行业经历不自动等于该岗位的相关经验。`,['profile','general'],[],['industry']));
      if(skillHits.length)reasons.push(note(`你勾选了“${skillHits.map(v=>label('skills',v)).join('、')}”。这些是可迁移线索，需要通过本方向的小任务验证，尚不能确认专业熟练度。`,['profile','general'],d.claims,['skills']));
      if(!industryHit&&!skillHits.length)reasons.push(note('没有明确的行业或技能匹配线索；保留此方向用于比较不同工作任务，而不是断言你适合。',['profile','general'],[],['industry','skills']));
      reasons.push(note('所引市场资料存在这个岗位或工作方式样本，所以可以用它核对具体要求；样本本身并不说明需求旺盛。',['market','general'],d.claims));
      if(minimumDegree===null) {uncertain=true;risks.push(note('这个来源没有给出完整学历要求；不能据此说“不限学历”，需核对最新岗位条件。',['market'],d.claims));}
      else if(degree===null) {uncertain=true;risks.push(note('学历未填写、未透露或属于其他路径，无法与样本门槛比较。',['profile','market'],d.claims,['education']));}
      else if(degree<minimumDegree) {conflict=true;risks.push(note('你填写的最高学习阶段低于此样本标明的学历层级；当前只作为了解任务或长期准备方向，不建议按这个样本直接投递。',['profile','market'],d.claims,['education']));}
      else if(d.id==='care'&&p.education==='education-0') {uncertain=true;risks.push(note('“初中及以下”同时包含达到与未达到初中层级的情况；无法据此确认符合样本的初中门槛。',['profile','market'],d.claims,['education']));}
      else if(p.educationStatus!=='educationStatus-1') {uncertain=true;risks.push(note('你填写的是学习阶段，但尚未确认已经毕业；不能把在读、未完成或未知状态当成已获得相应学历。先核对岗位是否接受在读者。',['profile','market'],d.claims,['education','educationStatus']));}
      else reasons.push(note('按自报学习阶段粗略比较，暂未发现低于所引样本学历层级的冲突；专业、证书和其他资格仍未确认。',['profile','market'],d.claims,['education','educationStatus']));
      if(d.id==='cnc'&&p.education==='education-1'){uncertain=true;risks.push(note('你选择普通高中，而此CNC样本写中专/中技；两种路径不能直接等同，需询问原招聘渠道是否认可。',['profile','market'],d.claims,['education']));}
      if(minimumYears>0) {
        if(!years){uncertain=true;risks.push(note('尚未提供可比较的工作年限；相关经验是否达到要求未知。',['profile','market'],d.claims,['workYears']));}
        else if(years[1]<=minimumYears) {conflict=true;risks.push(note('你填写的累计工作年限还不足以覆盖所引样本的经验要求；可先做学习验证，不把它当成立即可投岗位。',['profile','market'],d.claims,['workYears']));}
        else if(years[0]<minimumYears) {uncertain=true;risks.push(note('你的年限区间跨过样本门槛，不能断定达标；需要更具体的相关经历时长。',['profile','market'],d.claims,['workYears','experience']));}
      }
      if(d.relevantExperience){uncertain=true;risks.push(note('累计年限、行业标签和自由文本都不足以自动确认“相关经验”；必须核对具体任务、专业或资格。',['profile','market'],d.claims,['workYears','experience','major','skillDetails']));}
      if(d.campus){uncertain=true;risks.push(note('样本面向特定毕业届别，表单没有毕业年月字段；本方向仅供资格核实，不代表符合应届身份。',['profile','market'],d.claims,['educationStatus','stage']));}
      if(d.intern){uncertain=true;risks.push(note('在读状态不等于可到岗。所引旧岗位的每周天数和持续月数需要与你的实际安排比较；也需找到仍有效的岗位。',['profile','market'],d.claims,['stage','goal']));}
      const old=d.claims.some(id=>sourceMap.get(id).status!=='snapshot');
      if(old){uncertain=true;risks.push(note('这里使用了旧资料或已结束公告，只能据此理解任务与要求；在找到新的有效招聘信息前，不向旧样本投递。',['market'],d.claims));}
      const place=p.targetLocation||(p.mobility==='mobility-0'?p.location:'');
      if(d.location)risks.push(note(`该样本地点为${d.location}；${place?'你已填写地区意向，但规则不自动把自由文本解析为地理范围，需自行核对是否可接受。':'你尚未明确可用的目标地区，不能把该样本当作本地机会。'}`,['profile','market'],d.claims,['targetLocation','location','mobility']));
      else risks.push(note('所引资料未给出足够明确的工作地点信息，不能据此推定可在你所在城市工作。',['market'],d.claims));
      if(p.mobility==='mobility-3'){
        uncertain=true;if(d.onsite)conflict=true;
        risks.push(note(d.onsite?'你优先远程工作，而该方向的服务或设备任务需要先核实现场参与要求；这可能不符合你的地点偏好。':'你优先远程，但资料没有证明该样本支持远程；在核实前不将它作为远程机会。',['profile','market','general'],d.claims,['mobility']));
      }
      if(p.preferences.includes('preferences-3')||p.preferences.includes('preferences-6'))risks.push(note('你重视工作生活平衡或时间灵活性；样本不能证明排班适合你。比较通勤、可到岗时段及实际工作安排后再决定。',['profile','general'],[],['preferences']));
      if(p.preferences.includes('preferences-0')||p.preferences.includes('preferences-1'))risks.push(note('你重视收入或稳定性；现有资料没有足够的可比薪酬、合同和续聘信息，本方向不能被称为高薪或稳定选择。',['profile','general'],[],['preferences']));
      const gaps=d.skillsToCheck.map(([title,skills,claimId])=>{
        const hits=skills.filter(id=>selectedSkills.includes(id));
        return {title,status:hits.length?'有自述线索，仍需验证':'能力信息缺口，不代表不会',
          assessment:note(hits.length?`你勾选了${hits.map(id=>label('skills',id)).join('、')}，但没有可核验的任务产出，需确认能否完成下面的交付。`:'你尚未提供这项能力的明确证据；先验证，再决定是否补学，不把未勾选解释为能力缺失。',['profile','general'],[],['skills','skillDetails']),
          why:note('这项验证对应所引样本的任务。具体测试方案是一般知识建议，不是雇主原题或保证录用的标准。',['market','general'],[claimId]),
          action:note(d.project),acceptance:note(d.deliverable)};
      });
      questions.push(note(d.question,['general'],d.claims));
      const lane=conflict?'先解决已知条件冲突':uncertain?'先核实条件，再决定是否投入':'可先验证任务能力';
      const related=industryHit||skillHits.length>0;
      return {...d,reasons,risks,gaps,questions,lane,conflict,uncertain,industryHit,skillHit:skillHits.length>0,related,order,
        aiAdvice:note(d.ai,d.aiClaims.length?['market','general']:['general'],d.aiClaims),
        aiPreparation:note(p.aiExperience==='aiExperience-0'?'你选择尚未使用AI。先独立完成一次任务并建立核对清单，再学习工具术语；不要求购买服务或调用API。':p.aiExperience&&p.aiExperience!=='aiExperience-5'?'你自述已有AI使用经验。把工具输入、输出、人工校验和失败边界写入复盘，不把工具使用次数当作岗位能力证明。':'AI使用经验尚未明确。先核对任务本身与验证方式，再决定是否需要工具学习。',['profile','general'],[],['aiExperience'])};
    });
    // Ordered categories, not a weighted career score. No age, salary or probabilities.
    const goalHit=d=>p.goal==='goal-1'?!!d.intern:p.goal==='goal-2'&&student?!!d.campus:false;
    candidates.sort((a,b)=>Number(a.conflict)-Number(b.conflict)||Number(goalHit(b))-Number(goalHit(a))||Number(b.related)-Number(a.related)||
      (p.goal==='goal-4'?Number(a.industryHit)-Number(b.industryHit):Number(b.industryHit)-Number(a.industryHit))||
      Number(b.skillHit)-Number(a.skillHit)||Number(a.uncertain)-Number(b.uncertain)||a.order-b.order);
    const selected=[]; const families=new Set();
    for(const conflict of [false,true]) {
      const pool=candidates.filter(d=>d.conflict===conflict);
      for(const candidate of pool)if(!families.has(candidate.family)&&selected.length<4){selected.push(candidate);families.add(candidate.family);}
      for(const candidate of pool)if(!selected.includes(candidate)&&selected.length<4)selected.push(candidate);
    }
    const questions=[
      note('预计毕业年月与已取得学历是什么？这会改变校招、实习及学历门槛的核对结果。',['profile','general'],[],['education','educationStatus','stage']),
      note('相关任务实际做过多久，有哪些可脱敏展示的作品、证书或成果？这会改变技能补学与经验核实的重点。',['profile','general'],[],['experience','skillDetails','workYears']),
      note('最想保留或排除哪些工作任务，能接受哪些地区、通勤和到岗安排？这会改变比较顺序；不用提供地址、雇主或家庭身份信息。',['profile','general'],[],['targetLocation','mobility','preferences','goalDetails'])
    ];
    questions.push(note('专业和目标描述需要你自己与原岗位逐项核对。本版未做自由文本语义分析；如果希望改变方向顺序，请先修正明确的行业、技能和职业目标选项。',['profile','general'],[],['major','goalDetails']));
    if(p.internship)notices.push(note(`你选择的实习状态是“${label('internship',p.internship)}”；实习不自动算入正式相关工作年限，需要补充任务与持续时间。`,['profile','general'],[],['internship','experience']));
    if(p.goal)notices.push(note(`当前目标：${label('goal',p.goal)}。${p.goal==='goal-4'?'比较时将具有可迁移技能的其他行业一并考虑，不要求你留在原行业。':'先用小任务核验方向，再决定是否学习或投递。'}`,['profile','general'],[],['goal']));
    const goalStep=p.goal==='goal-1'||student?'核对学业安排、毕业届别与可实践时段；只联系已核实有效且接受该身份的渠道。':p.goal==='goal-6'?'整理重返职场后的可投入时间与需要更新的任务能力，先核验方向，不用在本站说明离职或家庭原因。':p.goal==='goal-7'?'先核实是否存在可接受的合作方式；雇员岗位样本不能自动视为自由职业机会。':p.goal==='goal-5'?'选择一个当前最欠缺证据的技能，完成验证并记录反馈，再决定是否扩大学习范围。':'找到条件和任务均可核实的有效岗位，再准备真实、脱敏的经历材料；有未满足条件时先准备，不直接投递样本。';
    const plan=[
      {title:'第一步：补齐会改变判断的条件',body:note('先回答下方补充问题；没有把握的项目写“待确认”。不要为通过条件核对而补造经历。'),check:'产出一份已确认／待确认的背景清单。'},
      {title:'第二步：核对原始市场证据',body:note('从四个方向中选两个任务上愿意尝试的方向，打开来源，记录岗位状态、地点、必需条件与优先条件。旧样本必须寻找新的公开证据。',['market','general'],selected.flatMap(d=>d.claims)),check:'每个方向留下一份带URL、核对日期、条件差异的记录；找不到有效岗位就标记证据缺口。'},
      {title:'第三步：完成一个可检验的小任务',body:note('优先选一个方向，按其技能卡的任务和验收方式交付；每次保留来源与修改记录，无法独立完成的环节就是下一轮学习重点。'),check:'交付一份真实可复核的作品或受指导实践记录，不使用虚构业务成绩。'},
      {title:'第四步：用反馈修正选择',body:note('请能判断该任务的人核对产出，记录需要改正的地方。无需向本站提交真实姓名、联系方式或雇主。'),check:'列出修改前后差异，并说明继续、暂停或换方向的原因。'},
      {title:'第五步：按你的目标推进',body:note(goalStep,['profile','general'],[],['goal','stage']),check:'形成下一步可完成的事项及你自行安排的时间；没有证据支持时不承诺找到工作。'}
    ];
    return {ok:true,filled,personalized:specific,profile:p,notices,directions:selected,questions,plan,researchDate:market.research.date,generalLabel:GENERAL};
  }
  root.RecommendationEngine=Object.freeze({build,normalize,auditCatalog});
})(typeof window!=='undefined'?window:globalThis);
