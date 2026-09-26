(() => {
  'use strict';
  const KEY = 'career-guidance.profile.v1';
  const form = document.getElementById('profile-form');
  if (!form) return;
  const fields = document.getElementById('profile-fields');
  const status = document.getElementById('draft-status');
  const result = document.getElementById('profile-result');
  const clearPanel = document.getElementById('clear-confirm');
  const controls = Array.from(form.querySelectorAll('input[name], select[name], textarea[name]'));
  const scalarControls = controls.filter(control => control.type !== 'checkbox');
  const groups = [...new Set(controls.filter(control => control.type === 'checkbox').map(control => control.name))];
  let validated = false;
  let draftSaved = false;

  function showStatus(message, error = false) {
    status.textContent = message;
    status.dataset.state = error ? 'error' : 'ok';
  }

  function collect() {
    const values = {};
    scalarControls.forEach(control => { values[control.name] = control.value; });
    groups.forEach(name => {
      values[name] = controls.filter(control => control.name === name && control.checked).map(control => control.value);
    });
    return values;
  }

  // Accept only this version's known fields, option values and bounded strings.
  // Restored user text is assigned through .value, never interpreted as HTML.
  function decode(raw) {
    const draft = JSON.parse(raw);
    if (!draft || draft.version !== 1 || !draft.values || typeof draft.values !== 'object' || Array.isArray(draft.values)) {
      throw new Error('Unsupported draft');
    }
    const values = {};
    scalarControls.forEach(control => {
      const value = draft.values[control.name] ?? '';
      if (typeof value !== 'string') throw new Error('Invalid text');
      if (control.tagName === 'SELECT') {
        if (!Array.from(control.options).some(option => option.value === value)) throw new Error('Invalid option');
      } else if (value.length > control.maxLength) {
        throw new Error('Text too long');
      }
      values[control.name] = value;
    });
    groups.forEach(name => {
      const value = draft.values[name] ?? [];
      const allowed = controls.filter(control => control.name === name).map(control => control.value);
      if (!Array.isArray(value) || value.length > allowed.length || value.some(item => !allowed.includes(item))) {
        throw new Error('Invalid choices');
      }
      values[name] = [...new Set(value)];
    });
    return values;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: 1, values: collect() }));
      draftSaved = true;
      showStatus('草稿已自动保存在当前浏览器中，刷新后可继续填写。');
      return true;
    } catch (_) {
      draftSaved = false;
      showStatus('本地保存失败：浏览器可能限制存储或空间不足。当前输入仍在页面中，请勿关闭或刷新；可检查浏览器设置后再次点击“确认背景信息”重试保存。', true);
      return false;
    }
  }

  function load() {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch (_) {
      showStatus('无法读取本地草稿。当前可填写和校验，但保存能力受浏览器限制，请留意填写后的保存提示。', true);
      return;
    }
    if (raw === null) {
      showStatus('尚无草稿。开始填写后，会自动保存在当前浏览器中。');
      return;
    }
    try {
      const values = decode(raw);
      controls.forEach(control => {
        if (control.type === 'checkbox') control.checked = values[control.name].includes(control.value);
        else control.value = values[control.name];
      });
      draftSaved = true;
      showStatus('已恢复本地草稿，可继续编辑；提交后仅校验输入。');
    } catch (_) {
      showStatus('已有草稿无法读取或版本不兼容，尚未覆盖。开始填写新内容会替换旧草稿；也可使用“清除本地草稿”。', true);
    }
  }

  function validate(control) {
    let message = '';
    if (control.required && !control.value.trim()) message = '请选择一项；不确定时可选择相应选项。';
    else if (control.tagName === 'SELECT' && !Array.from(control.options).some(option => option.value === control.value)) message = '请选择列表中的一项。';
    else if (control.maxLength >= 0 && control.value.length > control.maxLength) message = `请控制在${control.maxLength}字以内。`;
    const error = document.getElementById(`${control.id}-error`);
    error.textContent = message;
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
    return !message;
  }

  function onEdit(event) {
    if (!controls.includes(event.target)) return;
    result.textContent = '';
    delete result.dataset.state;
    if (validated && event.target.type !== 'checkbox') validate(event.target);
    // Save on every edit, including incomplete drafts; do not wait for submit/unload.
    save();
  }

  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);
  form.addEventListener('submit', event => {
    event.preventDefault();
    validated = true;
    const invalid = scalarControls.filter(control => !validate(control));
    const saved = save();
    if (invalid.length) {
      result.dataset.state = 'error';
      result.textContent = `还有${invalid.length}项需要检查，请按字段提示修改。${saved ? '未完成的草稿也已保存。' : '草稿未能保存，请勿关闭或刷新页面。'}`;
      invalid[0].focus();
    } else {
      result.dataset.state = saved ? 'ok' : 'error';
      result.textContent = `输入校验通过。${saved ? '背景已保存在当前浏览器中。' : '但草稿保存失败，请勿关闭或刷新页面。'}本次没有上传信息或生成职业建议。`;
      result.focus();
    }
  });

  document.getElementById('clear-draft').addEventListener('click', () => {
    clearPanel.hidden = false;
    document.getElementById('cancel-clear').focus();
  });
  document.getElementById('cancel-clear').addEventListener('click', () => {
    clearPanel.hidden = true;
    document.getElementById('clear-draft').focus();
  });
  document.getElementById('confirm-clear').addEventListener('click', () => {
    try {
      localStorage.removeItem(KEY);
    } catch (_) {
      showStatus('无法清除浏览器中的草稿，页面内容已保留。请检查浏览器存储设置后重试，或通过浏览器清除此页面的数据。', true);
      return;
    }
    form.reset();
    scalarControls.forEach(control => {
      control.removeAttribute('aria-invalid');
      document.getElementById(`${control.id}-error`).textContent = '';
    });
    validated = false;
    draftSaved = false;
    clearPanel.hidden = true;
    result.textContent = '';
    delete result.dataset.state;
    showStatus('本地草稿和本页已填内容已清除。再次填写会创建新草稿。');
    scalarControls[0].focus();
  });

  // Warn before another open copy silently replaces the saved draft.
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      draftSaved = false;
      showStatus('另一页面修改或清除了本地草稿。本页输入尚未改变；继续编辑或确认会保存本页内容。如需读取另一页面的版本，请先刷新。', true);
    }
  });
  window.addEventListener('beforeunload', event => {
    const hasInput = controls.some(control => control.type === 'checkbox' ? control.checked : control.value !== '');
    if (hasInput && !draftSaved) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  load();
  fields.disabled = false;
})();
