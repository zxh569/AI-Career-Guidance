(function(root){
  'use strict';
  const general='一般知识，非当前招聘市场证据';
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
    unknown:{label:'暂不确定，先核实',text:'先从所选方向中挑一个真实任务，说明输入、完成标准和人工核验方式，再确认是否值得尝试工具。未知不等于能力不足。',deliverable:'产出任务—输入—核验方式—待确认条件清单；允许结论为暂不使用AI。',questions:['Q11','Q12','Q15'],finding:0},
    noNeed:{label:'暂时没有明显使用需要',text:'保留不使用AI的路径。先按该方向原有方法完成任务并核对质量；只有出现明确、可验证的困难时，再比较工具是否有帮助。',deliverable:'交付原有方法的真实产出，并写明需要改善的环节；没有明确需要可暂停工具学习。',questions:['Q15','Q23'],finding:2},
    policy:{label:'允许范围不清楚／受到限制',text:'先核实可用工具、允许的数据类型和谁来复核。规则未明确或不允许时，使用公开说明和人工方法完成任务，不上传内部、客户或个人资料。',deliverable:'写出已确认／待确认的使用边界与替代做法；不必在本站提供单位名称或内部规定原文。',questions:['Q13','Q14'],finding:5},
    resources:{label:'缺少工具、培训或学习时间',text:'把任务缩小到当前可投入的范围，先用公开文档、现有工具和人工核对完成。列出真正缺少的支持，先验证用途再决定是否购买或参加培训。',deliverable:'留下一个可复核的小产出、公开资料出处和待争取的支持；不预设付费账号，也不规定学习时长。',questions:['Q14','Q15','Q18'],finding:5},
    verify:{label:'难以判断输出对错',text:'优先练习证据核验：逐项对照原始资料，区分事实、推断和缺失信息。能使用工具也不等于已经能检查其结果；有疑问时请能判断任务的人复核。',deliverable:'交付原文位置—判断—修改理由的对照表，保留不能确认的项目；不用生成虚假业务数据或履历。',questions:['Q27','Q23'],finding:7},
    ready:{label:'已有明确任务与可用资源',text:'先用已有方法做出基线，再在获得允许且愿意的情况下比较工具辅助做法；记录质量、检查成本和错误，不把速度变化当作收入或就业保证。本站不会调用工具。',deliverable:'产出相同真实任务的过程对照和失败边界；不能核验的改进只记为待验证。',questions:['Q13','Q23','Q27'],finding:7}
  };
  function plan(profile={},choice='unknown'){
    const p=paths[choice]||paths.unknown;
    const experience=profile.aiExperience==='aiExperience-0'?'你自述尚未使用AI：可以先完成不依赖AI的任务。':profile.aiExperience&&profile.aiExperience!=='aiExperience-5'?'你自述有AI使用经历：频率不是核验能力证明。':'AI使用经历尚不明确：先核实任务，不推断你是否会使用工具。';
    return {...p,choice:paths[choice]?choice:'unknown',experience,general};
  }
  root.SurveySupport=Object.freeze({validate,plan,paths,general});
})(typeof window!=='undefined'?window:globalThis);
