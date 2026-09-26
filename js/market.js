(() => {
  'use strict';
  const data = window.MARKET_SNAPSHOT;
  const status = document.getElementById('market-integrity');
  if (!data || !window.MarketAudit) {
    status.textContent = '市场资料未加载。请确认 data/market-snapshot.js 与 js/market-audit.js 存在，然后刷新。';
    return;
  }
  const audit = window.MarketAudit.validate(data);
  if (!audit.valid) {
    status.textContent = `来源检查未通过，已停止展示市场陈述。${audit.errors.join('；')}`;
    status.classList.add('market-error');
    return;
  }
  const node = (tag, content, className) => {
    const element = document.createElement(tag);
    if (content !== undefined) element.textContent = content;
    if (className) element.className = className;
    return element;
  };
  const external = (label,url) => {
    const link = node('a',label); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.referrerPolicy = 'no-referrer'; return link;
  };
  const statuses = {snapshot:'研究快照',historical:'历史背景／旧样本',closed:'已结束，仅作样本'};
  const sources = new Map(data.sources.map(s=>[s.id,s]));
  const topics = new Map(data.topics.map(t=>[t.id,t.label]));
  const filter = document.getElementById('market-topic');
  data.topics.forEach(t=>{const option=node('option',t.label); option.value=t.id;filter.append(option);});
  filter.disabled=false;
  document.getElementById('research-date').textContent = `${data.research.date}（研究环境时区：${data.research.timezone}）`;
  document.getElementById('research-method').textContent = data.research.method;
  status.textContent = `来源检查通过：每条资料都有原文链接和访问日期。`;
  function render() {
    const list = document.getElementById('market-cards'); list.replaceChildren();
    const visible = data.claims.filter(c=>!filter.value || c.topic===filter.value);
    visible.forEach(c=>{
      const card=node('article',undefined,'market-card'); card.id=`claim-${c.id}`;
      const meta=node('p',`${topics.get(c.topic)} · ${c.kind}`,'market-meta');
      card.append(meta,node('h3',c.title),node('p',statuses[c.status],'market-badge'),node('p',c.text,'market-statement'),node('p',`数据时期：${c.period}`,'market-date'),node('p',`局限：${c.caveat}`,'market-caveat'));
      const evidence=node('div',undefined,'market-evidence');
      c.evidence.forEach(e=>{
        const s=sources.get(e.sourceId);
        const p=node('p');p.append(external(`${s.publisher}：${s.title}（新窗口）`,e.url));
        evidence.append(p,node('p',`发布日期：${s.publishedAt} · 访问日期：${e.accessedAt}`),node('p',`原文定位：${e.locator}`));
      });
      card.append(evidence);list.append(card);
    });
    document.getElementById('market-count').textContent=`按主题筛选，只影响本页显示。`;
  }
  filter.addEventListener('change',render); render();
  data.research.limitations.forEach(l=>document.getElementById('market-gaps').append(node('li',l)));
  const sourceList=document.getElementById('market-sources');
  data.sources.forEach(s=>{
    const item=node('li');item.id=`source-${s.id}`;
    item.append(external(`${s.publisher} · ${s.title}（新窗口）`,s.url),node('p',`发布：${s.publishedAt}；访问：${s.accessedAt}；数据时期：${s.period}`),node('p',s.scope),node('p',s.accessNote));sourceList.append(item);
  });
  data.research.queries.forEach(q=>document.getElementById('market-queries').append(node('li',`${q.searchedAt} · ${q.query}`)));
  const accessList=document.getElementById('market-access');
  data.research.accessLog.forEach(a=>{
    const item=node('li');item.append(node('strong',`${a.platform} · ${a.result}`),node('p',`${a.accessedAt} · ${a.detail}`),external('查看本次尝试的公开地址（新窗口）',a.url));accessList.append(item);
  });
})();
