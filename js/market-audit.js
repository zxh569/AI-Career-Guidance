(function (root) {
  'use strict';
  const kinds = ['官方统计', '官方描述', '招聘活动', '岗位样本', '平台报告转述', '企业校招', '企业自述'];
  const statuses = ['snapshot', 'historical', 'closed'];
  function isDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function isURL(value) {
    try {
      const url = new URL(value);
      return typeof value === 'string' && ['https:', 'http:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
    } catch (_) { return false; }
  }
  function validate(data) {
    const errors = [];
    const ok = (condition, message) => { if (!condition) errors.push(message); };
    const text = value => typeof value === 'string' && value.trim().length > 0;
    const record = value => value && typeof value === 'object' && !Array.isArray(value);
    const shape = (value, keys, where) => {
      ok(record(value), `${where} 必须为对象`);
      if (!record(value)) return false;
      for (const key of Object.keys(value)) ok(keys.includes(key), `${where} 存在未定义字段 ${key}`);
      for (const key of keys) ok(Object.hasOwn(value, key), `${where} 缺少字段 ${key}`);
      return true;
    };
    if (!shape(data, ['schemaVersion','research','topics','sources','claims'], '数据')) return {valid:false, errors, claimCount:0, sourceCount:0};
    ok(data.schemaVersion === 1, '不支持的数据版本');
    const r = data.research || {};
    shape(r, ['date','timezone','method','queries','accessLog','limitations'], '研究记录');
    ok(isDate(r.date), '研究日期无效');
    ok(text(r.timezone) && text(r.method), '研究时区或方法缺失');
    const arrays = {};
    for (const key of ['topics','sources','claims']) {
      ok(Array.isArray(data[key]) && data[key].length > 0, `${key} 必须为非空数组`);
      arrays[key] = Array.isArray(data[key]) ? data[key] : [];
    }
    for (const key of ['queries','accessLog','limitations']) ok(Array.isArray(r[key]) && r[key].length > 0, `研究记录缺少 ${key}`);
    const checkDate = (value, where) => {
      ok(isDate(value), `${where} 缺失或日期无效`);
      if (isDate(value) && isDate(r.date)) ok(value <= r.date, `${where} 晚于研究日期`);
    };
    const topicIds = new Set();
    arrays.topics.forEach((t,i) => {
      if (!shape(t,['id','label'],`主题${i}`)) return;
      ok(text(t.id) && !topicIds.has(t.id), `主题ID缺失或重复 ${t.id}`); topicIds.add(t.id);
      ok(text(t.label), `主题${i} 缺少名称`);
    });
    const sourceMap = new Map();
    arrays.sources.forEach((s,i) => {
      if (!shape(s,['id','title','publisher','url','publishedAt','accessedAt','period','scope','accessNote'],`来源${i}`)) return;
      ok(text(s.id) && !sourceMap.has(s.id), `来源ID缺失或重复 ${s.id}`);
      sourceMap.set(s.id,s);
      for (const key of ['title','publisher','period','scope','accessNote']) ok(text(s[key]), `来源 ${s.id} 缺少 ${key}`);
      ok(isURL(s.url), `来源 ${s.id} URL缺失或无效`);
      checkDate(s.accessedAt, `来源 ${s.id} 访问日期`);
      ok(s.publishedAt === '未知' || isDate(s.publishedAt), `来源 ${s.id} 发布日期必须有效或写未知`);
      if (isDate(s.publishedAt)) ok(s.publishedAt <= s.accessedAt, `来源 ${s.id} 发布日期晚于访问日期`);
    });
    const claimIds = new Set();
    const usedSources = new Set();
    arrays.claims.forEach((c,i) => {
      if (!shape(c,['id','topic','title','text','kind','period','caveat','status','evidence'],`陈述${i}`)) return;
      ok(text(c.id) && !claimIds.has(c.id), `陈述ID缺失或重复 ${c.id}`); claimIds.add(c.id);
      ok(topicIds.has(c.topic), `陈述 ${c.id} 主题不存在`);
      for (const key of ['title','text','period','caveat']) ok(text(c[key]), `陈述 ${c.id} 缺少 ${key}`);
      ok(kinds.includes(c.kind), `陈述 ${c.id} 证据类型无效`);
      ok(statuses.includes(c.status), `陈述 ${c.id} 时效状态无效`);
      ok(Array.isArray(c.evidence) && c.evidence.length > 0, `陈述 ${c.id} 没有来源证据`);
      if (!Array.isArray(c.evidence)) return;
      c.evidence.forEach((e,j) => {
        if (!shape(e,['sourceId','url','accessedAt','locator'],`陈述 ${c.id} 证据${j}`)) return;
        const source = sourceMap.get(e.sourceId);
        ok(!!source, `陈述 ${c.id} 来源不存在`);
        ok(isURL(e.url), `陈述 ${c.id} 缺少有效来源URL`);
        checkDate(e.accessedAt, `陈述 ${c.id} 访问日期`);
        ok(text(e.locator), `陈述 ${c.id} 缺少原文定位`);
        if (source) {
          ok(e.url === source.url && e.accessedAt === source.accessedAt, `陈述 ${c.id} 引用与来源登记不一致`);
          usedSources.add(e.sourceId);
        }
      });
    });
    for (const id of sourceMap.keys()) ok(usedSources.has(id), `来源 ${id} 未关联任何陈述`);
    const queryIds = new Set();
    (Array.isArray(r.queries) ? r.queries : []).forEach((q,i) => {
      if (!shape(q,['id','query','searchedAt'],`检索${i}`)) return;
      ok(text(q.id) && !queryIds.has(q.id), `检索ID缺失或重复 ${q.id}`); queryIds.add(q.id);
      ok(text(q.query), `检索${i} 缺少检索词`); checkDate(q.searchedAt, `检索${i} 日期`);
    });
    (Array.isArray(r.accessLog) ? r.accessLog : []).forEach((a,i) => {
      if (!shape(a,['platform','url','accessedAt','result','detail'],`访问${i}`)) return;
      for (const key of ['platform','result','detail']) ok(text(a[key]), `访问${i} 缺少${key}`);
      ok(isURL(a.url), `访问${i} URL无效`); checkDate(a.accessedAt, `访问${i} 日期`);
    });
    (Array.isArray(r.limitations) ? r.limitations : []).forEach((l,i)=>ok(text(l),`研究局限${i} 为空`));
    return {valid:errors.length === 0, errors, claimCount:arrays.claims.length, sourceCount:arrays.sources.length};
  }
  root.MarketAudit = Object.freeze({validate});
})(typeof window !== 'undefined' ? window : globalThis);
