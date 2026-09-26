(function(root){
  'use strict';
  const general='通用建议';
  function validate(data,findings,numbers){
    const errors=[];
    if(!data||!Array.isArray(data.questions)||!findings?.sections||!numbers)return ['调查文件或数值展示映射缺失'];
    if(data.n!==49||data.collected!=='2026年9月')errors.push('调查版本发生变化，需重新核对');
    const ids=new Set();
    const walk=(v,path)=>{if(typeof v==='number'){if(typeof numbers[path]!=='string'||Number(numbers[path])!==v)errors.push('数值映射不一致：'+path);}else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>walk(x,path?path+'.'+k:k));};walk(data,'');
    for(const q of data.questions){if(ids.has(q.id))errors.push('题号重复');ids.add(q.id);if(!q.text||(!q.options&&!q.items))errors.push('题目结构缺失');}
    for(const id of ['Q1','Q3','Q4','Q6','Q8','Q11','Q12','Q13','Q14','Q15','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q27'])if(!ids.has(id))errors.push('缺少题目：'+id);
    if(findings.sections[0]?.heading!=='Survey Design'||findings.sections[1]?.heading!=='Survey Findings'||findings.sections[1].paragraphs.length<13)errors.push('团队发现定位已变化');
    return errors;
  }
  const paths={
    unknown:{label:'还不确定',text:'先从推荐的方向里挑一个真实任务，想清楚要用到什么资料、做到什么程度算好、怎么检查，再看要不要用 AI 工具。不确定不代表能力不够。',deliverable:'列一张清单：任务、要用的资料、怎么检查、还有什么没确认。结论是“暂时不用 AI”也可以。',questions:['Q11','Q12','Q15'],finding:0},
    noNeed:{label:'暂时用不上 AI',text:'不用 AI 也完全可以。先用原来的方法把任务做好；等遇到具体的困难，再看工具能不能帮上忙。',deliverable:'交出一份用原方法做的成果，写下哪里还想改进。没有明确需要，可以先不学工具。',questions:['Q15','Q23'],finding:2},
    policy:{label:'单位没说清能不能用，或者不让用',text:'先问清楚能用哪些工具、哪些资料可以放进去、谁来把关。没说清或不让用时，就用公开资料和人工方法做，不要把内部、客户或个人资料传上去。',deliverable:'写下哪些已经确认可以用、哪些还没确认，以及不用 AI 时怎么做。',questions:['Q13','Q14'],finding:5},
    resources:{label:'缺工具、缺培训或没时间学',text:'把任务缩小到你现在顾得上的范围，先用公开资料和手头的工具完成。列出真正缺的支持，确认用得上再考虑花钱买工具或报培训。',deliverable:'做出一个小成果，注明参考了哪些公开资料，再列出还需要争取的支持。不需要付费账号，学习时间自己定。',questions:['Q14','Q15','Q18'],finding:5},
    verify:{label:'判断不了 AI 给的对不对',text:'先练“核对”：把 AI 给的内容逐条和原始资料对一对，分清哪些是事实、哪些是推测、哪些没有依据。拿不准的，请懂行的人帮忙看。',deliverable:'做一张对照表：原文在哪、你的判断、为什么这么改。确认不了的也留着。',questions:['Q27','Q23'],finding:7},
    ready:{label:'有明确的任务，也有工具可用',text:'先用原来的方法做一遍作为对照，再在允许的情况下试试用工具做，比较质量、检查花的时间和出的错。做得快不等于收入更高或工作更稳。',deliverable:'同一个任务做两遍，记录两种做法的差别和出错的地方。没法确认的改进先标“待验证”。',questions:['Q13','Q23','Q27'],finding:7}
  };
  function plan(profile={},choice='unknown'){
    const p=paths[choice]||paths.unknown;
    const experience=profile.aiExperience==='aiExperience-0'?'你还没用过 AI，可以先做不需要 AI 的任务。':profile.aiExperience&&profile.aiExperience!=='aiExperience-5'?'你用过 AI，不过用得多不等于会检查它的结果。':'你没说是否用过 AI，先把任务弄清楚就好。';
    return {...p,choice:paths[choice]?choice:'unknown',experience,general};
  }
  root.SurveySupport=Object.freeze({validate,plan,paths,general});
})(typeof window!=='undefined'?window:globalThis);
