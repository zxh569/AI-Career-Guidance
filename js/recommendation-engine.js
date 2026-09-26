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
    const notices=[];
    if(!specific) notices.push(note('你填的行业和技能信息不足，暂时没法按你的情况筛选。下面四个方向是几类不同的工作，可以先看看对哪类感兴趣。', ['profile','general'],[],['industry','skills']));
    if(invalid.length)notices.push(note('有几项填写的格式不对，这次先按没填处理，你填的内容没有被改动。',['profile'],[],invalid));
    const textFields=['major','experience','skillDetails','goalDetails'];
    if(textFields.some(k=>p[k]))notices.push(note('你写的文字说明会保留在表单里，但网站目前只根据选项推荐，不会去理解文字内容。',['profile','general'],[],textFields.filter(k=>p[k])));
    if(p.stage && years && ((p.stage==='stage-1'&&years[1]===0)||(p.goal==='goal-2'&&years[0]>=4)))notices.push(note('你的状态、工作年限和目标看起来不太一致（比如转行、兼职或边读书边工作），这不算填错，看建议时留意一下。',['profile'],[],['stage','workYears','goal']));
    const candidates=catalog.directions.filter(d=> !d.campus || (degree!==null&&degree>=4&&(student||p.goal==='goal-2'))).filter(d=>!d.intern||student||p.goal==='goal-1').map((d,order)=>{
      const reasons=[],risks=[],questions=[];
      let conflict=false,uncertain=false;
      const industryHit=d.industries.includes(p.industry);
      const skillHits=selectedSkills.filter(v=>d.skills.includes(v));
      const minimumDegree=d.id==='digital'&&degree!==null&&degree>=4&&student?4:d.minEducation;
      const minimumYears=d.id==='digital'&&degree!==null&&degree>=4&&student?0:d.minYears;
      if(industryHit)reasons.push(note(`你目前在“${label('industry',p.industry)}”，这个方向和你的行业相关。不过同一行业不等于做过这类工作。`,['profile','general'],[],['industry']));
      if(skillHits.length)reasons.push(note(`你勾选的“${skillHits.map(v=>label('skills',v)).join('、')}”在这个方向用得上。可以先做下面的练手任务，看看是否真的顺手。`,['profile','general'],d.claims,['skills']));
      if(!industryHit&&!skillHits.length)reasons.push(note('你的行业和技能跟这个方向没有明显交集，放在这里是让你看看不同类型的工作。',['profile','general'],[],['industry','skills']));
      reasons.push(note('我们找到了这类岗位的真实招聘信息，可以照着核对具体要求。不过一条招聘不代表这行在大量招人。',['market','general'],d.claims));
      if(minimumDegree===null) {uncertain=true;risks.push(note('这条招聘没写清楚学历要求，不代表不限学历，投之前再确认一下。',['market'],d.claims));}
      else if(degree===null) {uncertain=true;risks.push(note('你没填学历（或选了其他），暂时没法和招聘要求对比。',['profile','market'],d.claims,['education']));}
      else if(degree<minimumDegree) {conflict=true;risks.push(note('这条招聘要求的学历比你目前高，可以先了解这类工作、当作长期目标，暂时不建议直接投这个岗位。',['profile','market'],d.claims,['education']));}
      else if(d.id==='care'&&p.education==='education-0') {uncertain=true;risks.push(note('“初中及以下”同时包含读完和没读完初中的情况，这条招聘要求初中及以上，需要确认一下。',['profile','market'],d.claims,['education']));}
      else if(p.educationStatus!=='educationStatus-1') {uncertain=true;risks.push(note('你还没毕业（或没说明是否毕业），投之前先确认岗位是否接受在读学生。',['profile','market'],d.claims,['education','educationStatus']));}
      else reasons.push(note('按你填的学历，基本达到这条招聘的学历要求；专业和证书还要再看。',['profile','market'],d.claims,['education','educationStatus']));
      if(d.id==='cnc'&&p.education==='education-1'){uncertain=true;risks.push(note('这条招聘写的是中专/中技，你是普通高中，建议问问招聘方是否认可。',['profile','market'],d.claims,['education']));}
      if(minimumYears>0) {
        if(!years){uncertain=true;risks.push(note('你没填工作年限，暂时不知道经验够不够。',['profile','market'],d.claims,['workYears']));}
        else if(years[1]<=minimumYears) {conflict=true;risks.push(note('这条招聘要求的工作经验比你现在多，可以先练手积累，暂时不建议直接投。',['profile','market'],d.claims,['workYears']));}
        else if(years[0]<minimumYears) {uncertain=true;risks.push(note('你选的年限区间跨过了招聘要求，够不够要看具体做了多久相关工作。',['profile','market'],d.claims,['workYears','experience']));}
      }
      if(d.relevantExperience){uncertain=true;risks.push(note('招聘要的是“相关经验”，光看年限和行业看不出来，要看你具体做过什么、学过什么。',['profile','market'],d.claims,['workYears','experience','major','skillDetails']));}
      if(d.campus){uncertain=true;risks.push(note('这个项目只招特定届别的毕业生，先确认你的毕业时间是否符合。',['profile','market'],d.claims,['educationStatus','stage']));}
      if(d.intern){uncertain=true;risks.push(note('实习一般要求每周固定到岗几天、连续几个月，先看看时间能不能对上。这条是旧岗位，需要另找正在招的。',['profile','market'],d.claims,['stage','goal']));}
      const old=d.claims.some(id=>sourceMap.get(id).status!=='snapshot');
      if(old){uncertain=true;risks.push(note('这条资料是旧的或已经截止，只能用来了解岗位要求，不能直接投。',['market'],d.claims));}
      const place=p.targetLocation||(p.mobility==='mobility-0'?p.location:'');
      if(d.location)risks.push(note(`这条招聘在${d.location}。${place?'你填了想去的地方，网站不会自动判断远近，请自己看看能不能接受。':'你还没填想在哪里工作，先别把它当成身边的机会。'}`,['profile','market'],d.claims,['targetLocation','location','mobility']));
      else risks.push(note('资料里没写清楚工作地点，要自己再确认。',['market'],d.claims));
      if(p.mobility==='mobility-3'){
        uncertain=true;if(d.onsite)conflict=true;
        risks.push(note(d.onsite?'你更想远程工作，但这类工作大多要到现场，可能不太合适。':'你更想远程工作，这条招聘没说能不能远程，要先问清楚。',['profile','market','general'],d.claims,['mobility']));
      }
      if(p.preferences.includes('preferences-3')||p.preferences.includes('preferences-6'))risks.push(note('你看重工作和生活的平衡或时间灵活，这里没有排班信息，入职前要问清班次和通勤。',['profile','general'],[],['preferences']));
      if(p.preferences.includes('preferences-0')||p.preferences.includes('preferences-1'))risks.push(note('你看重收入或稳定，但我们没找到这类岗位可比较的薪资和合同信息，说不好它收入高不高、稳不稳。',['profile','general'],[],['preferences']));
      const gaps=d.skillsToCheck.map(([title,skills,claimId])=>{
        const hits=skills.filter(id=>selectedSkills.includes(id));
        return {title,status:hits.length?'你勾选过，做一次就知道':'还不确定，可以先试试',
          assessment:note(hits.length?`你勾选了${hits.map(id=>label('skills',id)).join('、')}，用下面的任务检验一下是否真的能做好。`:'你还没提到这方面的经验，不代表不会，先试一次再决定要不要学。',['profile','general'],[],['skills','skillDetails']),
          why:note('招聘信息里提到了这项要求。下面的任务是我们建议的练法，不是招聘方的考题。',['market','general'],[claimId]),
          action:note(d.project),acceptance:note(d.deliverable)};
      });
      questions.push(note(d.question,['general'],d.claims));
      const lane=conflict?'条件还有差距':uncertain?'先确认条件':'可以先试试';
      const related=industryHit||skillHits.length>0;
      return {...d,reasons,risks,gaps,questions,lane,conflict,uncertain,industryHit,skillHit:skillHits.length>0,related,order,
        aiAdvice:note(d.ai,d.aiClaims.length?['market','general']:['general'],d.aiClaims),
        aiPreparation:note(p.aiExperience==='aiExperience-0'?'你还没用过 AI，可以先不用它，自己把任务做一遍，之后再考虑要不要学。':p.aiExperience&&p.aiExperience!=='aiExperience-5'?'你用过 AI。做任务时记下哪部分是 AI 做的、你怎么检查的、哪里出过错——会用工具不等于能胜任这份工作。':'先把任务本身弄清楚，再决定需不需要学 AI 工具。',['profile','general'],[],['aiExperience'])};
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
      note('你什么时候毕业？已经拿到哪个学历？这会影响校招、实习和学历要求的判断。',['profile','general'],[],['education','educationStatus','stage']),
      note('相关的工作实际做过多久？有没有能拿出来的作品、证书或成果？',['profile','general'],[],['experience','skillDetails','workYears']),
      note('你最想做、最不想做哪类工作？能接受去哪里工作、怎样的通勤和上班时间？',['profile','general'],[],['targetLocation','mobility','preferences','goalDetails'])
    ];
    questions.push(note('网站不会读你写的文字说明。想让推荐更贴近你，可以调整行业、技能和职业目标这几个选项。',['profile','general'],[],['major','goalDetails']));
    if(p.internship)notices.push(note(`实习经历：${label('internship',p.internship)}。实习一般不算正式工作年限，面试时可以具体说说做过什么、做了多久。`,['profile','general'],[],['internship','experience']));
    if(p.goal)notices.push(note(`你的目标：${label('goal',p.goal)}。${p.goal==='goal-4'?'除了原来的行业，也会看你的技能能用上的其他行业。':'建议先做个小任务试试方向，再决定要不要学或投简历。'}`,['profile','general'],[],['goal']));
    const goalStep=p.goal==='goal-1'||student?'先确认毕业时间和能实习的时段，只投确认在招、并且接受在校生的岗位。':p.goal==='goal-6'?'想清楚回到职场后能投入多少时间、哪些技能需要更新，先试一试方向。':p.goal==='goal-7'?'先确认这类工作有没有外包或自由职业的做法，招聘岗位不等于自由职业机会。':p.goal==='goal-5'?'挑一项你最没把握的技能，先练一次、听听反馈，再决定要不要系统学。':'找到确认在招、条件也对得上的岗位，再准备真实的经历材料；条件还差一些的，先补再投。';
    const plan=[
      {title:'第一步：把关键信息补齐',body:note('先回答“补充这些信息”里的问题，拿不准的写“待确认”。不用为了符合条件去编经历。'),check:'列一张清单：哪些已确认、哪些待确认。'},
      {title:'第二步：去看真实招聘',body:note('从四个方向里挑两个你愿意试的，打开原文看看，记下地点、硬性要求和加分项。资料是旧的，就去找最新的招聘。',['market','general'],selected.flatMap(d=>d.claims)),check:'每个方向记一份：链接、查看日期、和你的差距。找不到在招的岗位也记下来。'},
      {title:'第三步：做一个练手任务',body:note('选一个方向，照着“可以先练练的能力”里的任务做一遍，保留参考资料和修改记录。卡住的地方，就是接下来要学的。'),check:'做出一份真实的作品或实践记录，不编造成绩。'},
      {title:'第四步：找人看看，再调整',body:note('请懂这类工作的人看看你的成果，记下要改的地方。'),check:'写下改了什么，以及接下来是继续、暂停还是换方向。'},
      {title:'第五步：按你的目标往前走',body:note(goalStep,['profile','general'],[],['goal','stage']),check:'列出下一步要做的事，时间自己定。'}
    ];
    return {ok:true,filled,personalized:specific,profile:p,notices,directions:selected,questions,plan,researchDate:market.research.date,generalLabel:GENERAL};
  }
  root.RecommendationEngine=Object.freeze({build,normalize,auditCatalog});
})(typeof window!=='undefined'?window:globalThis);
