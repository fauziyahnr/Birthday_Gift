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

// Ambil elemen section
const section1 = document.getElementById('section-1');
const section2 = document.getElementById('section-2');
const backBtn = document.getElementById('backBtn');

// 1) Gift open + confetti
function openGift(){
  if(gift.classList.contains('open')) return;
  
  // 1. Jalankan animasi kado & pesta kembang api (confetti)
  gift.classList.add('open');
  launchConfetti();

  // 2. Transisi Menghilangkan Section 1
  if (section1 && section2) {
    section1.classList.add('opacity-0');

    setTimeout(() => {
      // Sembunyikan total Section 1
      section1.classList.add('hidden');

      // Tampilkan Section 2
      section2.classList.remove('hidden');

      // Beri efek fade-in yang halus
      setTimeout(() => {
        section2.classList.remove('opacity-0');
      }, 50);

    }, 600); // Waktu tunggu sesuai durasi animasi transisi
  }
}

// Opsional: Logika jika ingin kembali ke Section 1
if (backBtn) {
  backBtn.addEventListener('click', () => {
    section2.classList.add('opacity-0');

    setTimeout(() => {
      section2.classList.add('hidden');
      section1.classList.remove('hidden');
      gift.classList.remove('open'); // Reset status kado

      setTimeout(() => {
        section1.classList.remove('opacity-0');
      }, 50);

    }, 600);
  });
}
openBtn.addEventListener('click', openGift);
gift.addEventListener('click', openGift);

// 2) Confetti implementation (canvas)
function launchConfetti(){
  const ctx = confettiCanvas.getContext('2d');
  resizeCanvas();

  // Tampilkan kembali canvas jika sebelumnya tersembunyi
  confettiCanvas.style.display = 'block';

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

    if(particles.length > 0) {
      raf = requestAnimationFrame(frame);
    } else {
      // PERUBAHAN DI SINI: Sembunyikan canvas total ketika confetti sudah habis
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiCanvas.style.display = 'none';
    }
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

// 4) Countdown (Target: 13 September 2026)
function updateCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  // Tanggal Target: 13 September 2026 jam 00:00:00
  const targetDate = new Date('2026-09-13T00:00:00');
  const now = new Date();

  // Hitung selisih waktu dalam milidetik
  const diff = targetDate - now;

  // Konversi selisih ke hitungan hari
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const daysDiff = diff / oneDayInMs;

  // KONDISI 1: Tepat di Hari Ulang Tahun (13 September 2026)
  // Berada di antara jam 00:00:00 hingga 23:59:59 hari H (0 sampai -1 hari)
  if (daysDiff <= 0 && daysDiff > -1) {
    countdownEl.textContent = 'SELAMAT ULANG TAHUN';
    return;
  }

  // KONDISI 2: Sudah Lewat Tanggal Ulang Tahun (Setelah 13 September 2026)
  if (daysDiff <= -1) {
    const daysPassed = Math.floor(Math.abs(daysDiff));
    countdownEl.textContent = `${daysPassed} hari yang lalu kamu ulang tahun`;
    return;
  }

  // KONDISI SEBELUM: Masih Belum Ulang Tahun (Hitung Mundur Biasa)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const formatNum = (num) => String(num).padStart(2, '0');
  countdownEl.textContent = `${days}d ${formatNum(hrs)}j ${formatNum(mins)}m ${formatNum(secs)}s`;
}
// Jalankan pertama kali & set interval per detik
updateCountdown();
setInterval(updateCountdown, 1000);

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

