(function(root){
  'use strict';
  const options=['大体合理','部分合理','不太合理','暂时无法判断'];
  function mount(container,context){
    const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
    const section=node('section');section.className='advice-card feedback-section';section.id='result-feedback';section.setAttribute('aria-labelledby','feedback-title');
    const heading=node('h3','这些建议合理吗？');heading.id='feedback-title';
    const privacy=node('p','请不要写姓名、电话、单位名称等个人信息。');privacy.id='feedback-privacy';
    section.append(heading,node('p','反馈只留在这个页面上，我们不会自动收到；刷新页面、改背景或重新生成都会清空。'),privacy,node('p','想保留的话，先预览，再下载成文件。文件里只有你的反馈和推荐的方向名称。'));
    const form=node('form');form.noValidate=true;form.setAttribute('autocomplete','off');
    form.addEventListener('submit',e=>e.preventDefault());
    const field=(id,title,type)=>{const wrap=node('div');wrap.className='feedback-field';const label=node('label',title);label.htmlFor=id;const control=node(type);control.id=id;control.setAttribute('aria-describedby','feedback-privacy feedback-status');wrap.append(label,control);form.append(wrap);return control;};
    const rating=field('feedback-rating','整体来看，这些建议合理吗？（必选）','select');rating.required=true;
    const empty=node('option','请选择');empty.value='';rating.append(empty);options.forEach(text=>{const o=node('option',text);o.value=text;rating.append(o);});
    const unreasonable=field('feedback-unreasonable','哪里不合理？为什么？（选填）','textarea');
    const overlooked=field('feedback-overlooked','有没有漏掉你的重要情况？（选填）','textarea');
    for(const input of [unreasonable,overlooked]){input.maxLength=1000;input.rows=4;}
    const buttons=node('div');buttons.className='feedback-actions';
    const button=text=>{const b=node('button',text);b.type='button';b.className='profile-secondary';buttons.append(b);return b;};
    const previewButton=button('预览反馈文件'),download=button('下载反馈 JSON（不上传）'),clear=button('清空这份反馈');download.disabled=true;
    const status=node('p','还没下载。填写不会发送任何内容。');status.id='feedback-status';status.setAttribute('role','status');
    const preview=node('pre');preview.className='feedback-preview';preview.hidden=true;preview.tabIndex=0;preview.setAttribute('aria-label','即将下载的完整反馈内容');
    form.append(buttons,status,preview);section.append(form);container.append(section);
    let prepared=null;
    const invalidate=()=>{prepared=null;download.disabled=true;preview.hidden=true;preview.textContent='';rating.removeAttribute('aria-invalid');status.textContent='反馈改过了，请重新预览再下载（未上传）。';};
    form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
    previewButton.addEventListener('click',()=>{
      if(!options.includes(rating.value)){status.textContent='请先选一个整体评价，选“暂时无法判断”也可以。';rating.setAttribute('aria-invalid','true');rating.focus();return;}
      if(unreasonable.value.length>1000||overlooked.value.length>1000){status.textContent='每项请控制在1000字以内。';return;}
      prepared=JSON.stringify({schemaVersion:1,marketResearchDate:context.researchDate,directions:context.directions.map(d=>({id:d.id,title:d.title})),feedback:{reasonableness:rating.value,unreasonable:unreasonable.value.trim(),overlookedBackground:overlooked.value.trim()}},null,2);
      preview.textContent=prepared;preview.hidden=false;download.disabled=false;status.textContent='这是文件的全部内容。确认没有个人信息后再下载，下载不会发送给网站。';preview.focus();
    });
    download.addEventListener('click',()=>{
      if(!prepared)return;
      let url,link;
      try{
        url=URL.createObjectURL(new Blob([prepared],{type:'application/json;charset=utf-8'}));
        link=node('a');link.href=url;link.download='career-guidance-feedback.json';link.hidden=true;section.append(link);link.click();
        status.textContent='已开始下载，请在浏览器的下载列表里查看。未上传；如果下载被拦截，可以直接复制上面的内容。';
      }catch(_){status.textContent='无法启动下载。可以复制上面的内容自己保存，没有上传。';}
      finally{if(link)link.remove();if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}
    });
    clear.addEventListener('click',()=>{rating.value='';unreasonable.value='';overlooked.value='';invalidate();status.textContent='已清空。已经下载的文件请自己删除。';rating.focus();});
    return section;
  }
  root.FeedbackSection=Object.freeze({mount});
})(typeof window!=='undefined'?window:globalThis);
