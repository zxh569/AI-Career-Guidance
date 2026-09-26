(function(root){
  'use strict';
  const options=['大体合理','部分合理','不太合理','暂时无法判断'];
  function mount(container,context){
    const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
    const section=node('section');section.className='advice-card feedback-section';section.id='result-feedback';section.setAttribute('aria-labelledby','feedback-title');
    const heading=node('h3','这些建议合理吗？');heading.id='feedback-title';
    const privacy=node('p','请勿填写姓名、电话、邮箱、身份证号码、详细地址、雇主名称或他人的个人信息。只描述建议的问题，以及遗漏的背景类别或工作安排。');privacy.id='feedback-privacy';
    section.append(heading,node('p','反馈仅暂存在当前页面内存中，不上传、不自动保存到浏览器存储。刷新、修改背景或重新生成建议会清空未下载的反馈。网站运营者不会自动收到反馈。'),privacy,node('p','如需保留，请先预览，再主动下载 JSON 文件。文件只包含你的反馈、方向名称和市场研究日期，不附带背景表单、完整报告或用户标识；下载后由你决定是否分享。'));
    const form=node('form');form.noValidate=true;form.setAttribute('autocomplete','off');
    form.addEventListener('submit',e=>e.preventDefault());
    const field=(id,title,type)=>{const wrap=node('div');wrap.className='feedback-field';const label=node('label',title);label.htmlFor=id;const control=node(type);control.id=id;control.setAttribute('aria-describedby','feedback-privacy feedback-status');wrap.append(label,control);form.append(wrap);return control;};
    const rating=field('feedback-rating','整体看，这些建议是否合理？（必选）','select');rating.required=true;
    const empty=node('option','请选择');empty.value='';rating.append(empty);options.forEach(text=>{const o=node('option',text);o.value=text;rating.append(o);});
    const unreasonable=field('feedback-unreasonable','哪些建议不合理，为什么？（选填，最多1000字）','textarea');
    const overlooked=field('feedback-overlooked','是否遗漏了影响判断的重要背景？（选填，最多1000字）','textarea');
    for(const input of [unreasonable,overlooked]){input.maxLength=1000;input.rows=4;}
    const buttons=node('div');buttons.className='feedback-actions';
    const button=text=>{const b=node('button',text);b.type='button';b.className='profile-secondary';buttons.append(b);return b;};
    const previewButton=button('预览反馈文件'),download=button('下载反馈 JSON（不上传）'),clear=button('清空这份反馈');download.disabled=true;
    const status=node('p','尚未导出。填写不会发送任何内容。');status.id='feedback-status';status.setAttribute('role','status');
    const preview=node('pre');preview.className='feedback-preview';preview.hidden=true;preview.tabIndex=0;preview.setAttribute('aria-label','即将下载的完整反馈内容');
    form.append(buttons,status,preview);section.append(form);container.append(section);
    let prepared=null;
    const invalidate=()=>{prepared=null;download.disabled=true;preview.hidden=true;preview.textContent='';rating.removeAttribute('aria-invalid');status.textContent='反馈已修改，仅在本页暂存。请重新预览后下载；尚未上传。';};
    form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
    previewButton.addEventListener('click',()=>{
      if(!options.includes(rating.value)){status.textContent='请先选择对建议的整体判断；“暂时无法判断”也可以。';rating.setAttribute('aria-invalid','true');rating.focus();return;}
      if(unreasonable.value.length>1000||overlooked.value.length>1000){status.textContent='每项文字请控制在1000字以内。';return;}
      prepared=JSON.stringify({schemaVersion:1,marketResearchDate:context.researchDate,directions:context.directions.map(d=>({id:d.id,title:d.title})),feedback:{reasonableness:rating.value,unreasonable:unreasonable.value.trim(),overlookedBackground:overlooked.value.trim()}},null,2);
      preview.textContent=prepared;preview.hidden=false;download.disabled=false;status.textContent='这是文件的全部内容。请检查并删除可能包含的个人信息，再选择下载；此操作不会提交给网站。';preview.focus();
    });
    download.addEventListener('click',()=>{
      if(!prepared)return;
      let url,link;
      try{
        url=URL.createObjectURL(new Blob([prepared],{type:'application/json;charset=utf-8'}));
        link=node('a');link.href=url;link.download='career-guidance-feedback.json';link.hidden=true;section.append(link);link.click();
        status.textContent='已请求浏览器下载，请在下载列表中确认。未上传反馈；若下载被阻止，可从预览中复制内容并自行保存。';
      }catch(_){status.textContent='无法启动下载。内容仍在本页预览中，可复制后自行保存；没有上传。';}
      finally{if(link)link.remove();if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}
    });
    clear.addEventListener('click',()=>{rating.value='';unreasonable.value='';overlooked.value='';invalidate();status.textContent='本页反馈已清空。已经下载的文件需由你自行删除。';rating.focus();});
    return section;
  }
  root.FeedbackSection=Object.freeze({mount});
})(typeof window!=='undefined'?window:globalThis);
