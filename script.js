const menuToggle=document.getElementById('menuToggle');
const navMenu=document.getElementById('navMenu');
if(menuToggle&&navMenu){
  menuToggle.addEventListener('click',()=>navMenu.classList.toggle('open'));
  navMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navMenu.classList.remove('open')));
}

document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card=>{
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});
