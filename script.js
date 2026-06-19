/**
 * 锦蔓商贸 — 古风官网交互脚本
 * 编钟主营、战鼓方略、卷轴展阅
 */

(function () {
  'use strict';

  // ===== 主营业务数据 =====
  const BIZ_DATA = [
    {
      title: '商品贸易',
      text: '深耕国内国际贸易，涵盖日用百货、消费品等多品类流通，以稳健渠道连接供需两端，助力客户拓展市场版图。'
    },
    {
      title: '批发经销',
      text: '面向商超、门店及经销商提供大宗批发服务，规模化采购降低成本，灵活配送满足区域市场需求。'
    },
    {
      title: '零售铺货',
      text: '精准布局终端零售网络，优选畅销品类铺货上架，帮助合作方快速占领消费市场、提升品牌曝光。'
    },
    {
      title: '品牌代理',
      text: '携手国内外优质品牌，提供区域代理与渠道运营支持，以专业团队赋能品牌价值与市场增长。'
    },
    {
      title: '供应链整合',
      text: '整合上游生产与下游销售资源，优化采购、库存与配送环节，为客户打造高效协同的供应链体系。'
    },
    {
      title: '仓储物流',
      text: '提供仓储管理与物流配送一体化服务，保障货物安全、准时送达，让商贸履约更加省心可靠。'
    },
    {
      title: '定制采销',
      text: '根据客户需求量身定制采购与销售方案，灵活匹配品类、数量与交期，满足个性化商贸合作。'
    }
  ];

  // ===== 企业方略数据 =====
  const DRUM_DATA = [
    {
      title: '企业愿景',
      text: '立足羊城、辐射全国，成为南粤地区值得信赖的综合性商贸服务企业，以卓越品质赢得长久口碑。',
      tag: 0
    },
    {
      title: '经营理念',
      text: '诚信为本、品质为先，以客户需求为导向，以专业服务为基石，在每一次合作中兑现承诺。',
      tag: 1
    },
    {
      title: '服务宗旨',
      text: '客户至上、用心服务，提供从咨询、选品到履约的全流程商务支持，让合作省心、放心、安心。',
      tag: 2
    },
    {
      title: '合作模式',
      text: '开放共赢、长期同行，与供应商、渠道商及终端客户建立稳定互信的合作关系，共创商业价值。',
      tag: 3
    }
  ];

  // ===== 音频上下文（用户交互后初始化） =====
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // 五声音阶频率（宫商角徵羽 + 变宫、清角）
  const BELL_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25];

  function playBell(noteIndex) {
    const ctx = getAudioContext();
    const freq = BELL_NOTES[noteIndex] || 440;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2, ctx.currentTime);
    filter.Q.setValueAtTime(8, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2.5);

    // 泛音
    const harmonic = ctx.createOscillator();
    const hGain = ctx.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2.5, ctx.currentTime);
    hGain.gain.setValueAtTime(0, ctx.currentTime);
    hGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    hGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    harmonic.connect(hGain);
    hGain.connect(ctx.destination);
    harmonic.start(ctx.currentTime);
    harmonic.stop(ctx.currentTime + 1.5);
  }

  function playDrum() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 低频鼓身
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // 噪声冲击
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(200, now);
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }

  // ===== 载入动画 =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('ink-loader').classList.add('hidden');
      initRevealAnimations();
    }, 2200);
  });

  // ===== 滚动显现 =====
  function initRevealAnimations() {
    const heroChars = document.querySelectorAll('.vertical-title .char');
    heroChars.forEach((el) => el.classList.add('visible'));

    const heroReveals = document.querySelectorAll('.hero .reveal:not(.char)');
    heroReveals.forEach((el) => el.classList.add('visible'));

    const sections = document.querySelectorAll('.section, .scroll-panel, .bells-stage, .drum-stage, .drum-advantages, .contact-scroll');
    sections.forEach((el) => el.classList.add('fade-section'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    sections.forEach((el) => observer.observe(el));
  }

  // ===== 编钟交互 · 主营业务 =====
  const bellContent = document.getElementById('bell-content');
  const bellTitle = bellContent?.querySelector('.biz-content-title');
  const bellText = bellContent?.querySelector('.biz-content-text');

  function showBizContent(index) {
    const data = BIZ_DATA[index];
    if (!data || !bellContent) return;

    bellContent.classList.add('switching');
    setTimeout(() => {
      if (bellTitle) bellTitle.textContent = data.title;
      if (bellText) bellText.textContent = data.text;
      bellContent.classList.remove('switching');
    }, 200);
  }

  document.querySelectorAll('.bell').forEach((bell) => {
    bell.addEventListener('click', () => {
      const noteIndex = parseInt(bell.dataset.note, 10);
      const bizIndex = parseInt(bell.dataset.biz, 10);

      document.querySelectorAll('.bell').forEach((b) => b.classList.remove('active'));
      bell.classList.add('active');
      bell.classList.add('ringing');
      playBell(noteIndex);
      showBizContent(bizIndex);
      setTimeout(() => bell.classList.remove('ringing'), 500);
    });
  });

  // ===== 战鼓交互 · 企业方略 =====
  const warDrum = document.getElementById('war-drum');
  const drumRipple = document.getElementById('drum-ripple');
  const drumContent = document.getElementById('drum-content');
  const drumTitle = drumContent?.querySelector('.biz-content-title');
  const drumText = drumContent?.querySelector('.biz-content-text');
  const orbitTags = document.querySelectorAll('.orbit-tag');
  let drumIndex = 0;

  function showDrumContent(index) {
    const data = DRUM_DATA[index];
    if (!data || !drumContent) return;

    drumContent.classList.add('switching');
    orbitTags.forEach((tag) => tag.classList.remove('active'));
    const activeTag = document.querySelector(`.orbit-tag[data-orbit="${data.tag}"]`);
    if (activeTag) activeTag.classList.add('active');

    setTimeout(() => {
      if (drumTitle) drumTitle.textContent = data.title;
      if (drumText) drumText.textContent = data.text;
      drumContent.classList.remove('switching');
    }, 200);
  }

  if (warDrum) {
    orbitTags[0]?.classList.add('active');

    warDrum.addEventListener('click', () => {
      warDrum.classList.add('beating');
      playDrum();

      drumRipple.classList.remove('active');
      void drumRipple.offsetWidth;
      drumRipple.classList.add('active');

      drumIndex = (drumIndex + 1) % DRUM_DATA.length;
      showDrumContent(drumIndex);

      setTimeout(() => warDrum.classList.remove('beating'), 300);
      setTimeout(() => drumRipple.classList.remove('active'), 800);
    });
  }

  // ===== 导航高亮 =====
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionIds = ['hero', 'about', 'bells', 'drum', 'contact'];

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = 'hero';

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollY) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').slice(1);
      link.style.color = href === current ? 'var(--cinnabar)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===== 卷轴展开音效（首次进入 about 区块） =====
  let scrollSoundPlayed = false;
  const aboutSection = document.getElementById('about');

  if (aboutSection) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !scrollSoundPlayed) {
            scrollSoundPlayed = true;
            playScrollUnfurl();
          }
        });
      },
      { threshold: 0.3 }
    );
    scrollObserver.observe(aboutSection);
  }

  function playScrollUnfurl() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.6);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }
})();
