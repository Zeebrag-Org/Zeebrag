const toggleBtn = document.querySelector('.menu-toggle');
// Prefer explicit ID if present, fallback to first nav ul
const menu = document.querySelector('#main-menu') || document.querySelector('nav ul');

function setMenuState(isOpen){
  if(!menu || !toggleBtn) return;
  menu.classList.toggle('open', !!isOpen);
  toggleBtn.classList.toggle('active', !!isOpen);
  toggleBtn.setAttribute('aria-expanded', String(!!isOpen));
}

function toggleMenu(e){
  // prevent duplicate handling when pointer/touch + click both fire
  if(e) e.preventDefault && e.preventDefault();
  if(!menu || !toggleBtn) return;
  const isOpen = !menu.classList.contains('open');
  setMenuState(isOpen);
}

if(toggleBtn && menu){
  // Use pointer events where available for unified input handling
  if(window.PointerEvent){
    toggleBtn.addEventListener('pointerdown', toggleMenu);
  } else {
    toggleBtn.addEventListener('touchstart', toggleMenu, {passive: true});
    toggleBtn.addEventListener('click', toggleMenu);
  }

  // Close menu when a link inside it is tapped (mobile friendly)
  menu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> setMenuState(false));
    a.addEventListener('touchstart', ()=> setMenuState(false), {passive:true});
  });

  // Close when tapping outside the menu
  document.addEventListener('pointerdown', (ev)=>{
    if(!menu.classList.contains('open')) return;
    const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
    if(path && (path.includes(menu) || path.includes(toggleBtn))) return;
    setMenuState(false);
  });
}

const scrollToTopBtn=document.getElementById('scroll-to-top');

if(scrollToTopBtn){
  window.addEventListener('scroll',()=>{
    window.pageYOffset>300
      ?scrollToTopBtn.classList.add('show')
      :scrollToTopBtn.classList.remove('show');
  });

  scrollToTopBtn.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

const modal=document.getElementById('get-started-modal');
const closeModalBtn=document.querySelector('.close-modal');

document.addEventListener('click',e=>{
  const t=e.target;
  if(t&&(t.id==='get-started-btn'||t.id==='get-started-btn-mobile')){
    e.preventDefault();
    modal?.classList.add('show');
    document.body.style.overflow='hidden';
  }
});

closeModalBtn?.addEventListener('click',()=>{
  modal?.classList.remove('show');
  document.body.style.overflow='';
});

window.addEventListener('click',e=>{
  if(e.target===modal){
    modal.classList.remove('show');
    document.body.style.overflow='';
  }
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modal?.classList.contains('show')){
    modal.classList.remove('show');
    document.body.style.overflow='';
  }
});

function handleFormSubmit(form,opts={}){
  form.addEventListener('submit',async e=>{
    e.preventDefault();

    const formData=new FormData(form);
    const data=Object.fromEntries(formData.entries());

    const required=form.querySelectorAll('[required]');
    for(const field of required){
      if(!field.value||field.value.trim()===''){
        alert('Please fill in all required fields.');
        return;
      }
    }

    if(data.email){
      const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(data.email)){
        alert('Please enter a valid email address.');
        return;
      }
    }

    const payload={
      ...data,
      source:opts.source||'site',
      timestamp:new Date().toISOString()
    };

    const endpoint=window.GAS_ENDPOINT||'';
    if(!endpoint||endpoint.length<10){
      alert('Form service is not configured.');
      return;
    }

    try{
      const res=await fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });

      const result=await res.json().catch(()=>null);

      if(res.ok&&result&&result.success){
        alert(opts.successMessage||'Thank you! We have received your message.');
        form.reset();
        if(modal){
          modal.classList.remove('show');
          document.body.style.overflow='';
        }
      }else{
        console.error('Server error:',result);
        alert('Something went wrong. Please try again later.');
      }
    }catch(err){
      console.error('Network error:',err);
      alert('Unable to send message. Please check your internet connection.');
    }
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  const contactForm=document.getElementById('contact-form');
  const getStartedForm=document.getElementById('get-started-form');

  if(contactForm){
    handleFormSubmit(contactForm,{
      source:'contact-page',
      successMessage:'Thanks! We will contact you soon.'
    });
  }

  if(getStartedForm){
    handleFormSubmit(getStartedForm,{
      source:'get-started',
      successMessage:'Thanks! We will get back to you soon.'
    });
  }
});
