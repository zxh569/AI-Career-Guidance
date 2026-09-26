(function(root){
  'use strict';
  const headings=['Interview Design','AI Is Restructuring Tasks Before It Replaces Entire Occupations','Productivity Gains Often Became Higher Expectations Rather Than Less Work','The Skill Premium May Be Moving From Producing an Answer to Judging One','AI May Remove the Tasks Through Which Beginners Used to Learn','Workers Are Often Expected to Adapt Before Institutions Have Caught Up','Unequal Benefits Reflect Existing Resources, Not Just Access to the Same Technology'];
  const titles=['访谈设计','I1：工作任务、情境与价值变化','I2：提效、工作量与新增核验责任','I3：专业判断与输出核验','I4：入门任务与学习路径','I5：组织规则与个人责任','I6：资源差异与不同看法'];
  const summaries=['团队说明访谈涉及不同工作场景，目的是理解机制，不是统计全国劳动者。','受访者描述AI辅助与人工判断的分工；个别创意工作者也担心客户支付意愿变化。不能据此判定某种职业安全或必然贬值。','部分受访者描述节省的时间被更高交付要求吸收，同时需要检查、纠错与承担责任。这不是统一提效比例。','团队将重点归纳为专业知识、情境理解、核验和责任，而不只是生成初稿。访谈不构成技能溢价或个人能力测量。','受访者担心基础任务减少会影响新人积累经验。这提示保留练习与指导，不证明所有入门岗位都在减少。','案例涉及工具、数据、教学或雇主规则不清晰的情况；可以先核实使用边界，不推定用户所在机构也如此。','受访者对收益是否均等看法不同，团队讨论语言、工具、数据、培训和专业知识的作用；不能按学历、机构大小或城市替用户下结论。'];
  const general='一般知识，非当前招聘市场证据';
  function validate(data){
    if(!data||!Array.isArray(data.sections)||data.sections.length!==headings.length)return ['访谈文件缺失或章节版本变化'];
    const errors=[];
    data.sections.forEach((s,i)=>{if(s.heading!==headings[i]||!Array.isArray(s.paragraphs)||s.paragraphs.length!==[1,4,4,4,3,4,4][i]||s.paragraphs.some(p=>typeof p!=='string'||!p.trim()))errors.push('访谈定位不兼容：'+titles[i]);});return errors;
  }
  function plan(profile={}){
    const transfer=profile.goal==='goal-4';
    const starter=profile.stage==='stage-0'||profile.educationStatus==='educationStatus-0'||['workYears-0','workYears-1'].includes(profile.workYears)||['goal-1','goal-2'].includes(profile.goal);
    const mode=transfer?'transfer':starter?'starter':'general';
    const learning={id:'learning',title:transfer?'转向前，保留新领域的基础练习':starter?'不要跳过入门任务中的学习过程':'把专业判断变成可复核的记录',
      basis:transfer?'你的背景（自述）：目标为转行业或转岗位。总年限不等于新领域经验。':starter?'你的背景（自述）：在校/在读、较少工作经历或实习/首份工作目标，触发入门学习提醒；不代表你缺少能力。':'背景不足以确认是否处于入门阶段；使用通用复核路径，不推定你已经有专业经验。',
      action:mode==='general'?'从一个方向的真实任务中，选出需要专业判断的环节。写出判断依据、适用条件和反例，请能判断该任务的人复核。':'从一个方向的真实任务中，先亲自完成基础环节，解释每个判断的依据，再请合格指导者指出遗漏。随后在允许且有需要时比较工具辅助做法，不把完整交给工具当成已经学会。',
      deliverable:'保留自己的初稿、原始资料位置、判断理由、复核反馈和修订记录。暂时找不到指导者时标记待复核，不把未核验作品当作上岗能力；设备或照护练习沿用正规指导要求。',refs:[[4,0],[4,1],[3,0],[3,1]]};
    const workload={id:'workload',title:'评估全部工作量，不只看初稿速度',basis:'适用于任务验证的通用提醒，不推断你已被加量或已经提效。',action:'先明确本次交付的质量、范围、修改次数和复核责任。记录准备、制作、检查、返工及协调的实际过程；若对方要求增加方案或提高标准，把新增工作另列，不与原任务直接比较。',deliverable:'交付一份过程与范围对照表，标注新增要求和仍未确认的验收标准。实际时间可自行记录，不预设节省幅度，也不将更快等同于更轻松或更高收入。',refs:[[2,0],[2,1],[2,3]]};
    const responsibility={id:'responsibility',title:'在交付前确认核验与责任边界',basis:'补充已有调查中的政策与资源核对；不默认机构提供支持。',action:'为关键结论逐项写清原始依据、由谁或什么角色复核、哪些资料允许使用、什么情况下应暂停交付。需要的工具、培训或指导未到位时，选择可完成的人工步骤，或先提出具体支持需求。',deliverable:'形成任务—证据—复核角色—交付条件清单。只记录角色，不填写姓名、雇主或内部资料；不能验证的重要结论保留为待确认。',refs:[[1,0],[3,1],[5,1],[5,2],[6,3]]};
    const blocks=[learning,workload,responsibility];
    if(profile.goal==='goal-7'||(Array.isArray(profile.skills)&&profile.skills.some(x=>['skills-1','skills-7'].includes(x))))blocks.push({id:'value',title:'如果按作品交付，再核对付费与验收条件',basis:'你的背景（自述）：勾选写作/内容制作相关技能，或目标为自由职业。这只触发条件核对，不认定你在从事创意收费工作。',action:'如确实考虑按作品收费，核实对方需要的独特价值、质量标准、修改范围、使用权和付款条件。把作品价值与制作速度分开，保留真实约定，不因个别访谈直接降价、转行或断定收入会减少。',deliverable:'整理一份不含客户身份的交付条件清单；未取得真实条件时记为未知，不编造报价或收入。',refs:[[1,3]]});
    return {mode,blocks,general};
  }
  root.InterviewSupport=Object.freeze({validate,plan,headings,titles,summaries,general});
})(typeof window!=='undefined'?window:globalThis);
