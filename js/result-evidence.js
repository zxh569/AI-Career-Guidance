(function(root){
  'use strict';
  // Regions are conservative descriptions of the stored claims, not new research.
  const regions={
    'overall-unemployment':'全国城镇调查范围',
    'overall-sector':'全国（未分地区）',
    'cnc-entry':'珠海岗位列表样本','electrical-hs':'上海岗位版样本',
    'logistics-docs':'上海单个岗位样本','warehouse':'安徽旌德企业汇编样本',
    'care-entry':'翁牛特旗单个机构样本','ai-requirements':'杭州岗位列表样本',
    'senior-ai':'杭州岗位列表样本','accounting':'安徽旌德企业汇编样本',
    'commerce':'安徽旌德企业汇编样本','english-service':'上海岗位版样本',
    'campus-geo':'江苏、广东、浙江及长三角；仅报告覆盖的校招样本',
    'ai-geo':'报告所列城市分组及北京；仅该平台AI岗位样本',
    'ai-tasks':'杭州岗位列表样本',
    'health-hospital':'安徽旌德单家医院样本','edu-childcare':'安徽旌德企业汇编样本','edu-english':'安徽旌德企业汇编样本',
    'media-design':'安徽旌德企业汇编样本','media-content':'安徽旌德企业汇编样本','agri-farm':'安徽旌德企业汇编样本',
    'research-lab':'安徽旌德企业汇编样本','agri-quality':'上海崇明单家企业样本','realestate-admin':'上海岗位版样本',
    'realestate-property':'上海岗位版样本','energy-utility':'上海岗位版样本','env-green':'上海岗位版样本','public-community':'北京朝阳区公告'
  };
  function region(claim){return regions[claim.id]||'地区未明确';}
  function fact(claim){
    const sample=['岗位样本','企业校招','企业自述','招聘活动'].includes(claim.kind);
    const type=sample?'招聘样本':claim.kind==='平台报告转述'?'平台报告':'官方统计';
    const confidence=claim.status!=='snapshot'?'资料已结束或是旧的，只能参考当时的要求。':sample?'只是个别岗位的样本，不代表整个行业，也不确定现在是否还在招。':claim.kind==='平台报告转述'?'平台报告的转述，只反映该平台的样本。':'官方统计，只说明整体情况，不能换算成个人机会。';
    return {type,confidence,region:region(claim)};
  }
  function statement(item,profile={}){
    if(item.basis.includes('profile')){
      const supplied=item.fields.some(k=>Array.isArray(profile[k])?profile[k].length:!!profile[k]);
      return {type:'你的情况',confidence:supplied?'有限：根据你填的信息判断，还需要实际验证。':'低：相关信息你还没填。'};
    }
    if(item.basis.includes('general'))return {type:'通用建议（一般知识）',confidence:item.claimIds.length?'尚未验证：引用的资料只支持其中的事实部分。':'尚未验证：没有专门的资料支持，可以用小任务自己检验。'};
    return {type:'招聘资料',confidence:'有限：只在资料的时间、地区和样本范围内成立。'};
  }
  function direction(d,report){
    if(d.conflict)return '和这条招聘的要求还有差距，先把条件补上再考虑投。';
    if(!report.personalized||!d.related)return '你的背景和这个方向暂时没有明显交集，可以当作了解一类新工作。';
    return '和你的背景有相关的地方，但经验和能力还需要实际验证。';
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
