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
      showStatus('已自动保存。');
      return true;
    } catch (_) {
      draftSaved = false;
      showStatus('保存失败，可能是浏览器限制了存储。已填的内容还在，先别关闭或刷新页面。', true);
      return false;
    }
  }

  function load() {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch (_) {
      showStatus('读取不到保存的内容，可以继续填写，但可能保存不了。', true);
      return;
    }
    if (raw === null) {
      showStatus('开始填写后会自动保存。');
      return;
    }
    try {
      const values = decode(raw);
      controls.forEach(control => {
        if (control.type === 'checkbox') control.checked = values[control.name].includes(control.value);
        else control.value = values[control.name];
      });
      draftSaved = true;
      showStatus('已恢复上次填写的内容，可以接着填。');
    } catch (_) {
      showStatus('之前保存的内容读不出来，重新填写会覆盖它。', true);
    }
  }

  function validate(control) {
    let message = '';
    if (control.required && !control.value.trim()) message = '请选一项，不确定也有对应的选项。';
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
      result.textContent = `还有${invalid.length}项需要修改，请看对应的提示。${saved ? '已填的内容已保存。' : '保存失败了，先别关闭或刷新页面。'}`;
      invalid[0].focus();
    } else {
      result.dataset.state = saved ? 'ok' : 'error';
      result.textContent = `填写没有问题。${saved ? '已保存在这个浏览器里。' : '不过保存失败了，先别关闭或刷新页面。'}想看建议，请点下面的“生成探索建议”。`;
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
      showStatus('清除失败，请检查浏览器的存储设置后再试。', true);
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
    showStatus('已清除。');
    scalarControls[0].focus();
  });

  // Warn before another open copy silently replaces the saved draft.
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      draftSaved = false;
      showStatus('另一个页面改动了保存的内容。这里的填写没有变，继续填写会以这里为准。', true);
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
