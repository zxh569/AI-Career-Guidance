(function(root){
  'use strict';
  const headings=['Interview Design','AI Is Restructuring Tasks Before It Replaces Entire Occupations','Productivity Gains Often Became Higher Expectations Rather Than Less Work','The Skill Premium May Be Moving From Producing an Answer to Judging One','AI May Remove the Tasks Through Which Beginners Used to Learn','Workers Are Often Expected to Adapt Before Institutions Have Caught Up','Unequal Benefits Reflect Existing Resources, Not Just Access to the Same Technology'];
  const titles=['访谈设计','I1：工作任务、情境与价值变化','I2：提效、工作量与新增核验责任','I3：专业判断与输出核验','I4：入门任务与学习路径','I5：组织规则与个人责任','I6：资源差异与不同看法'];
  const summaries=['受访者来自不同行业，访谈是为了了解变化是怎么发生的，不是做统计。','受访者讲了 AI 和人各自做什么；也有创意工作者担心客户不愿意再为作品付钱。这不能说明哪种职业安全，或者一定会贬值。','有受访者说，AI 省下的时间很快被更高的要求填满，还多了检查、纠错和担责的活。','团队认为，关键在专业知识、理解具体情况、核对和担责，而不只是会让 AI 写初稿。','受访者担心新人练手的基础活变少，积累经验更难。这提醒新人要保留练习，不代表所有入门岗位都在减少。','有些单位对能用什么工具、能放什么资料没有明确规定，用之前先问清楚。','受访者对“大家是否同样受益”看法不一，团队讨论了语言、工具、数据、培训和专业知识的影响。'];
  const general='通用建议';
  function validate(data){
    if(!data||!Array.isArray(data.sections)||data.sections.length!==headings.length)return ['访谈文件缺失或章节版本变化'];
    const errors=[];
    data.sections.forEach((s,i)=>{if(s.heading!==headings[i]||!Array.isArray(s.paragraphs)||s.paragraphs.length!==[1,4,4,4,3,4,4][i]||s.paragraphs.some(p=>typeof p!=='string'||!p.trim()))errors.push('访谈定位不兼容：'+titles[i]);});return errors;
  }
  function plan(profile={}){
    const transfer=profile.goal==='goal-4';
    const starter=profile.stage==='stage-0'||profile.educationStatus==='educationStatus-0'||['workYears-0','workYears-1'].includes(profile.workYears)||['goal-1','goal-2'].includes(profile.goal);
    const mode=transfer?'transfer':starter?'starter':'general';
    const learning={id:'learning',title:transfer?'转行前，先在新领域打好基础':starter?'别跳过新手阶段的练习':'把你的判断过程记下来',
      basis:transfer?'你的目标是转行或转岗。以前的工作年限不等于新领域的经验。':starter?'你还在读书、工作经历不多，或正在找实习、第一份工作，所以给你这条提醒，不代表你能力不够。':'从你填的信息看不出是否刚入行，先给一条通用建议。',
      action:mode==='general'?'在一个真实任务里，找出需要专业判断的地方，写下你为什么这么判断、什么情况下不成立，再请懂行的人看看。':'选一个真实任务，基础部分先自己动手做，说清楚每一步为什么这么做，再请有经验的人指出问题。之后需要的话再试试用工具，全交给工具做完不等于自己学会了。',
      deliverable:'留好自己的初稿、参考资料、判断理由、别人的意见和修改记录。暂时找不到人看，就先标“待复核”。设备操作和照护练习要有正规指导。',refs:[[4,0],[4,1],[3,0],[3,1]]};
    const workload={id:'workload',title:'算总工作量，别只看初稿快不快',basis:'通用提醒，不代表你的工作量已经变多。',action:'先说清楚这次要交什么、做到什么程度、改几次、谁来把关。记下准备、制作、检查、返工和沟通各花了多少功夫；对方加了要求，就把新增的部分单独记。',deliverable:'整理一张表：原本要做什么、后来加了什么、验收标准还有哪些没说清。做得快不等于更轻松或收入更高。',refs:[[2,0],[2,1],[2,3]]};
    const responsibility={id:'responsibility',title:'交付前说清楚谁来检查、谁负责',basis:'接着“学习准备”那部分，不默认单位会提供支持。',action:'重要的结论逐条写清：依据是什么、谁来复核、哪些资料能用、什么情况下先别交。工具、培训或指导没到位时，先做自己能完成的部分，或者提出具体需要什么帮助。',deliverable:'列一张清单：任务、依据、谁复核、交付条件。确认不了的重要结论标“待确认”。',refs:[[1,0],[3,1],[5,1],[5,2],[6,3]]};
    const blocks=[learning,workload,responsibility];
    if(profile.goal==='goal-7'||(Array.isArray(profile.skills)&&profile.skills.some(x=>['skills-1','skills-7'].includes(x))))blocks.push({id:'value',title:'按作品收费的话，先谈清价格和验收',basis:'你勾选了写作或内容制作相关的技能，或者目标是自由职业，所以给你这条提醒。',action:'如果打算按作品收费，先问清楚对方看重什么、质量标准、改几次、作品归谁用、怎么付款。作品值多少钱和做得快不快是两回事，不用因为别人的个别经历就降价或转行。',deliverable:'整理一份交付条件清单（不写客户身份），还没谈的条件先写“未知”。',refs:[[1,3]]});
    return {mode,blocks,general};
  }
  root.InterviewSupport=Object.freeze({validate,plan,headings,titles,summaries,general});
})(typeof window!=='undefined'?window:globalThis);
