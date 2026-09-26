(function(root){
  'use strict';
  // Regions are conservative descriptions of the stored claims, not new research.
  const regions={
    'overall-unemployment':'全国城镇调查范围',
    'overall-sector':'官方行业总体描述；本文未给出具体地区分布',
    'cnc-entry':'珠海岗位列表样本','electrical-hs':'上海岗位版样本',
    'logistics-docs':'上海单个岗位样本','warehouse':'安徽旌德企业汇编样本',
    'care-entry':'翁牛特旗单个机构样本','ai-requirements':'杭州岗位列表样本',
    'senior-ai':'杭州岗位列表样本','accounting':'安徽旌德企业汇编样本',
    'commerce':'安徽旌德企业汇编样本','english-service':'上海岗位版样本',
    'campus-geo':'江苏、广东、浙江及长三角；仅报告覆盖的校招样本',
    'ai-geo':'报告所列城市分组及北京；仅该平台AI岗位样本',
    'ai-tasks':'杭州岗位列表样本'
  };
  function region(claim){return regions[claim.id]||'地区覆盖未明确，不能推定适用于全国或你的所在地';}
  function fact(claim){
    const sample=['岗位样本','企业校招','企业自述','招聘活动'].includes(claim.kind);
    const type=sample?'招聘市场陈述 · 岗位／企业样本，不是市场趋势':claim.kind==='平台报告转述'?'招聘市场陈述 · 报告样本趋势／调查':'招聘市场陈述 · 官方统计／描述，不等于岗位需求';
    const confidence=claim.status!=='snapshot'?'当前适用性低：历史资料或活动已结束，只能用于理解当时条件。':sample?'推广把握低：只有局部样本；当前是否在招、是否适用你仍未确认。':claim.kind==='平台报告转述'?'推广把握有限：平台样本经转述，抽样细节不足，不能代表全部雇主或个人机会。':'对原文摘要有直接来源；用于个人择业的把握有限，统计口径不能替代岗位与个人条件。';
    return {type,confidence,region:region(claim)};
  }
  function statement(item,profile={}){
    if(item.basis.includes('profile')){
      const supplied=item.fields.some(k=>Array.isArray(profile[k])?profile[k].length:!!profile[k]);
      return {type:'关于你的推断 · 尚未验证',confidence:supplied?'有限：依据自述与规则比较，尚未验证作品、相关经历、资格及雇主认可。':'低：涉及的背景尚未提供；仅提出探索或核实问题，不能据此确认适合。'};
    }
    if(item.basis.includes('general'))return {type:'一般知识／规则建议 · 不作为招聘事实',confidence:item.claimIds.length?'尚未验证：引用材料只支持其中的事实部分，不证明整条推断、学习方案或AI影响。':'尚未验证：没有支持此判断的专项实证；可用小任务和新的公开资料检验。'};
    return {type:'招聘市场陈述 · 对来源的有限解读',confidence:'有限：只在所引资料的时间、地区和样本范围内成立；不能直接外推为个人机会。'};
  }
  function direction(d,report){
    if(d.conflict)return '当前适配把握低：已发现条件冲突。先解决风险栏中的条件问题，不据此直接投递样本。';
    if(!report.personalized||!d.related)return '当前适配把握低：缺少明确的行业或技能线索。这是比较任务的起点。';
    return '当前适配把握有限：存在背景线索，但相关经验、实际能力与最新岗位条件尚未充分核实。';
  }
  // Conservative numeric provenance guard. Counts/steps are not probability scores.
  function precision(text,claimIds,market){
    if(/^本次使用市场快照 /.test(text))text=text.replace(market.research.date,'');
    const tokens=text.match(/\d+(?:\.\d+)?(?:\s*[–—~～-]\s*\d+(?:\.\d+)?)?\s*(?:%|％|万|亿|元|年|月|天|倍|成)?|[一二三四五六七八九十百]+(?:成|万元|亿元)|百分之[零一二三四五六七八九十百点]+/g)||[];
    const cited=market.claims.filter(c=>claimIds.includes(c.id));
    return [...new Set(tokens.map(t=>t.trim()))].filter(t=>!cited.some(c=>c.text.includes(t)));
  }
  function auditReport(report,market){
    const issues=[];
    const visit=v=>{if(!v||typeof v!=='object')return;if(v.basis){const numbers=precision(v.text,v.claimIds,market);if(numbers.length)issues.push({text:v.text,numbers});}Object.values(v).forEach(visit);};
    visit({notices:report.notices,directions:report.directions,questions:report.questions,plan:report.plan});for(const step of report.plan||[]){const numbers=precision(step.check,[],market);if(numbers.length)issues.push({text:step.check,numbers});}return issues;
  }
  root.ResultEvidence=Object.freeze({region,fact,statement,direction,precision,auditReport});
})(typeof window!=='undefined'?window:globalThis);
