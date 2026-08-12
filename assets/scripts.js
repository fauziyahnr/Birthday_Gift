// scripts.js — interactivity for Birthday_Gift

// DOM helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Elements
const gift = $('#gift');
const openBtn = $('#openBtn');
const revealName = $('#revealName');
const confettiCanvas = document.getElementById('confetti-canvas');
const audio = document.getElementById('bgAudio');
const musicBtn = document.getElementById('musicBtn');
const musicStatus = document.getElementById('musicStatus');
const countdownEl = document.getElementById('countdown');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const galleryItems = document.querySelectorAll('.gallery-item');
const loveLayer = document.getElementById('love-layer');

// 1) Gift open + confetti
function openGift(){
  if(gift.classList.contains('open')) return;
  gift.classList.add('open');
  revealName.style.opacity = '1';
  launchConfetti();

  // --- TAMBAHAN KODE DI SINI ---
  const surpriseContent = document.getElementById('surprise-content');
  if (surpriseContent) {
    // Hapus kelas hidden agar elemen masuk ke DOM
    surpriseContent.classList.remove('hidden');
    
    // Beri jeda kecil agar animasi fade-in Tailwind berjalan mulus
    setTimeout(() => {
      surpriseContent.classList.remove('opacity-0');
    }, 50);
  }
}
openBtn.addEventListener('click', openGift);
gift.addEventListener('click', openGift);

// 2) Confetti implementation (canvas)
function launchConfetti(){
  const ctx = confettiCanvas.getContext('2d');
  resizeCanvas();
  let particles = [];
  const colors = ['#f43f5e','#fb7185','#f97316','#f59e0b','#60a5fa','#a78bfa'];

  function createParticle(){
    const x = Math.random()*confettiCanvas.width;
    const y = Math.random()*confettiCanvas.height*0.2;
    const size = 6 + Math.random()*8;
    const color = colors[Math.floor(Math.random()*colors.length)];
    const tilt = Math.random()*Math.PI;
    const vx = -2 + Math.random()*4;
    const vy = 2 + Math.random()*6;
    particles.push({x,y,size,color,vx,vy,tilt,life:0,ttl:120});
  }
  for(let i=0;i<120;i++) createParticle();

  let raf;
  function frame(){
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    particles.forEach((p,idx)=>{
      p.life++;
      p.x += p.vx;
      p.y += p.vy + Math.sin(p.life/10)*0.5;
      p.tilt += 0.1;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.tilt);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore();
    });
    particles = particles.filter(p=>p.life < p.ttl);
    if(particles.length>0) raf = requestAnimationFrame(frame);
    else cancelAnimationFrame(raf);
  }
  frame();
}

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 3) Music controls
let playing = false;
musicBtn.addEventListener('click', ()=>{
  if(!playing){
    audio.play().catch(()=>{});
    playing = true;
    musicBtn.textContent = 'Pause';
    musicStatus.textContent = 'Playing';
  } else {
    audio.pause();
    playing = false;
    musicBtn.textContent = 'Play';
    musicStatus.textContent = 'Paused';
  }
});

// 4) Countdown (customize targetDate string as needed)
// Default: use next occurrence of current month/day (example: 12-31)
let targetDate = new Date();
// Example customization: set birthday month/day here (0-based month)
const birthMonth = targetDate.getMonth(); // default: current month
const birthDay = targetDate.getDate();
// If you want to set a specific date, replace the above with: const targetDate = new Date('2026-08-25T00:00:00');
function computeTarget(){
  const now = new Date();
  let year = now.getFullYear();
  const t = new Date(year, birthMonth, birthDay, 0,0,0);
  if(t - now <= 0) t.setFullYear(year+1);
  return t;
}
const finalDate = computeTarget();

function updateCountdown(){
  const now = new Date();
  const diff = finalDate - now;
  if(diff <= 0){
    countdownEl.textContent = 'Selamat Ulang Tahun!';
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hrs = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  countdownEl.textContent = `${days}d ${hrs}j ${mins}m ${secs}s`;
}
setInterval(updateCountdown,1000);
updateCountdown();

// 5) Gallery modal
galleryItems.forEach(img=>{
  // lazy load
  img.src = img.dataset.src;
  img.addEventListener('click', ()=>{
    modalImg.src = img.src;
    modal.classList.add('show');
  });
});
modal.addEventListener('click', ()=>{
  modal.classList.remove('show');
  modalImg.src = '';
});

// 6) Love falling effect (pure CSS/JS)
function spawnHeart(){
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = Math.random()*100 + 'vw';
  heart.style.top = '-10vh';
  heart.style.color = ['#f43f5e','#fb7185','#f97316','#f59e0b','#a78bfa'][Math.floor(Math.random()*5)];
  heart.style.fontSize = (12 + Math.random()*22) + 'px';
  heart.innerHTML = '❤';
  heart.style.opacity = (0.6 + Math.random()*0.4).toString();
  heart.style.animation = `fall ${6 + Math.random()*6}s linear forwards`;
  loveLayer.appendChild(heart);
  setTimeout(()=>heart.remove(), 14000);
}
setInterval(spawnHeart, 700);

// Accessibility: open gift with Enter on focused gift
gift.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' ') openGift();
});

// Small touch: reveal name when audio starts
audio.addEventListener('play', ()=>{
  revealName.style.opacity = '1';
});

