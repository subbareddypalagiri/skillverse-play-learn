import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Navbar from '../components/Navbar'; 
import apiClient from '@/lib/apiClient';
import { Users, BookOpen, Award, Building } from 'lucide-react';
import InteractiveInfiniteGrid from '../components/layout/InteractiveInfiniteGrid';

import './Newlanding.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const NewLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. SPLIT FLAP ANIMATION
      const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const WORD = 'HAPPINESS';
      const sfContainer = sfContainerRef.current;

      if (sfContainer) {
        sfContainer.innerHTML = ''; // Start clean
        
        function makeChar(target: string, idx: number) {
          if (target === ' ') {
            const space = document.createElement('div');
            space.className = 'split-flap-space';
            return space;
          }
          const el = document.createElement('div');
          el.className = 'sf-char';
          el.innerHTML = `<div class="divider"></div>
            <div class="sf-top"><span></span></div>
            <div class="sf-bot"><span></span></div>`;
          const top = el.querySelector('.sf-top span') as HTMLElement;
          const bot = el.querySelector('.sf-bot span') as HTMLElement;

          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, delay: idx * 0.15, ease: 'power2.out' });

          setTimeout(() => {
            el.classList.add('flipping');
            top.style.color = bot.style.color = '#c77b3f';
            let f = 0, max = 8 + idx * 3;
            const iv = setInterval(() => {
              if (f >= max) {
                clearInterval(iv); el.classList.remove('flipping');
                top.textContent = bot.textContent = target;
                top.style.color = bot.style.color = '#f2f2f2';
              } else {
                const r = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                top.textContent = bot.textContent = r; f++;
              }
            }, 50);
          }, idx * 150);
          return el;
        }

        WORD.split('').forEach((c, i) => sfContainer.appendChild(makeChar(c, i)));

        let flipping = false;
        sfContainer.addEventListener('mouseenter', () => {
          if (flipping) return; flipping = true;
          const chars = [...sfContainer.querySelectorAll('.sf-char')];
          chars.forEach((el, i) => {
            const target = WORD[i];
            const top = el.querySelector('.sf-top span') as HTMLElement;
            const bot = el.querySelector('.sf-bot span') as HTMLElement;
            el.classList.add('flipping');
            top.style.color = bot.style.color = '#c77b3f';
            let f = 0, max = 6 + i * 2;
            const iv = setInterval(() => {
              if (f >= max) {
                clearInterval(iv); el.classList.remove('flipping');
                top.textContent = bot.textContent = target;
                top.style.color = bot.style.color = '#f2f2f2';
                if (i === chars.length - 1) flipping = false;
              } else {
                const r = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                top.textContent = bot.textContent = r; f++;
              }
            }, 50);
          });
        });
      }

      // 2. HERO FADE-INS
      ['hero-sub', 'hero-desc', 'hero-cta', 'hero-tag'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.opacity = '1'; el.style.transform = 'none';
          }));
        }
      });

      // 3. SCRAMBLE TEXT EFFECT
      const GLYPHS = '!@#$%^&*()_+-=<>?/\\[]{}Xx';
      document.querySelectorAll('.scramble').forEach((el) => {
        const hElement = el as HTMLElement;
        const orig = hElement.dataset.text || '';
        let going = false;
        el.parentElement?.addEventListener('mouseenter', () => {
          if (going) return; going = true;
          let progress = 0; const locked = new Set();
          const iv = setInterval(() => {
            progress += 0.05;
            const n = Math.floor(progress * orig.length);
            for (let i = 0; i < n; i++) locked.add(i);
            el.textContent = orig.split('').map((c, i) => locked.has(i) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
            if (progress >= 1) { clearInterval(iv); el.textContent = orig; going = false; }
          }, 30);
        });
      });

      // 4. SCROLL ANIMATIONS
      gsap.utils.toArray('.fade-up').forEach((el: any) => {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') });
      });

      ScrollTrigger.create({
        trigger: '#signals', start: 'top 70%',
        onEnter: () => { document.querySelectorAll('.signal-card').forEach((c: any) => { c.style.opacity = '1'; c.style.transform = 'none'; }); }
      });

      ScrollTrigger.create({
        trigger: '#features', start: 'top 60%',
        onEnter: () => { document.querySelectorAll('.feat-card').forEach((c: any) => { c.style.opacity = '1'; c.style.transform = 'none'; }); }
      });

      ScrollTrigger.create({
        trigger: '#principles', start: 'top 50%',
        onEnter: () => {
          document.querySelectorAll('#principles-list article').forEach((art: any) => {
            art.style.opacity = '1'; art.style.transform = 'none';
            setTimeout(() => {
              const bg = art.querySelector('.ph-bg'); const txt = art.querySelector('.ph-txt'); const line = art.querySelector('.principle-line');
              if (bg) bg.style.transform = 'scaleX(1)';
              if (txt) setTimeout(() => txt.style.color = '#141414', 400);
              if (line) line.style.width = '12rem';
            }, 400);
          });
        }
      });

      // 5. NAV DOTS & PARALLAX
      ['hero', 'signals', 'features', 'principles', 'colophon'].forEach(id => {
        ScrollTrigger.create({ trigger: `#${id}`, start: 'top center', end: 'bottom center', onEnter: () => updateDot(id), onEnterBack: () => updateDot(id) });
      });
      function updateDot(active: string) {
        document.querySelectorAll('.nav-dot').forEach((d: any) => { if (d.dataset.sec === active) d.classList.add('active'); else d.classList.remove('active'); });
      }

      gsap.to('.grid-bg', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom bottom', scrub: 1 } });

      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault(); const href = a.getAttribute('href');
          if (href && href !== '#') { const t = document.querySelector(href); if (t) gsap.to(window, { scrollTo: { y: t, offsetY: 0 }, duration: 1, ease: 'power2.inOut' }); }
        });
      });

    }, containerRef);

    // 
    return () => {
      ctx.revert();
      if (sfContainerRef.current) sfContainerRef.current.innerHTML = '';
    };
  }, []);

  // Dynamic Platform Stats State
  const [stats, setStats] = React.useState({
    learners: 0,
    courses: 0,
    successRate: 100,
    partners: 12
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/courses/stats');
        if (response.data?.data) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching platform stats:', err);
      }
    };
    fetchStats();
  }, []);

  // DATA ARRAYS
  const signals = [
    { num: '01', date: '2026.05.15', title: 'unlimited events', desc: 'Meet your personal AI learning companion — adaptive, contextual, always available.' },
    { num: '02', date: '2026.04.28', title: 'Vibe 2.0', desc: 'Revamped social feed: share project reels, get peer feedback, trend in your domain.' },
    { num: '03', date: '2026.04.10', title: 'Career Hub', desc: 'Live job board, resume builder & direct recruiter connections from 50+ partners.' },
    { num: '04', date: '2026.03.22', title: 'Hackathon Season', desc: 'Season 3 kicks off — 72 hours, real problems, real prizes, real teams.' },
    { num: '05', date: '2026.03.05', title: 'Sync Circles', desc: 'New peer-study rooms with shared whiteboards, timers, and accountability streaks.' },
  ];

  const features = [
    { label: 'Learning Paths', title: 'Courses', desc: 'Expert-curated paths for max retention and real-world application.', num: '01', col: '1/3', row: '1/3' },
    { label: 'Social Platform', title: 'Vibe', desc: 'Share project reels, discover peers\' work, stay inspired.', num: '02', col: '3/4', row: '1/2' },
    { label: 'Peer Sync', title: 'Sync', desc: 'Collaborative study rooms with accountability timers & streaks.', num: '03', col: '4/5', row: '1/3' },
    { label: 'Events & Clubs', title: 'Events', desc: 'Hackathons, workshops, clubs — all in one place.', num: '04', col: '3/4', row: '2/3' },
    { label: 'Career Growth', title: 'Career Hub', desc: 'Internships, mentors & real opportunities from top companies.', num: '05', col: '1/3', row: '3/4' },
    { label: 'Milestones', title: 'Achievements', desc: 'Earn certificates, badges, visualise every milestone you hit.', num: '06', col: '3/5', row: '3/4' },
  ];

  const statsData = [
    { val: stats.learners.toLocaleString(), label: 'Active Learners', iconName: 'Users' },
    { val: stats.courses.toLocaleString(), label: 'Expert Courses', iconName: 'BookOpen' },
    { val: `${stats.successRate}%`, label: 'Success Rate', iconName: 'Award' },
    { val: stats.partners.toLocaleString(), label: 'Industry Partners', iconName: 'Building' },
  ];

  const principles = [
    { num: '01', tag: 'Learning', pre: '', hi: 'INTENTIONAL', suf: ' GROWTH', desc: 'Every feature pushes you forward — not to keep you scrolling. Progress is the product.', align: 'left' },
    { num: '02', tag: 'Community', pre: 'PEERS ', hi: 'OVER', suf: ' PASSIVE STUDY', desc: 'Learning accelerates when you share, teach, and compete. Build together, not alone.', align: 'right' },
    { num: '03', tag: 'Momentum', pre: '', hi: 'REAL', suf: ' WORLD READY', desc: 'Projects, hackathons, and recruiter connections bridge curriculum and career.', align: 'left' },
    { num: '04', tag: 'Signal', pre: 'CLARITY ', hi: 'THROUGH', suf: ' NOISE', desc: 'Clean paths, focused feedback, zero distraction. Know exactly where you stand.', align: 'right' },
  ];

  const colophons = [
    { head: 'Platform', items: ['Haappy Team', 'Interface Lab'] },
    { head: 'Stack', items: ['React + Vite', 'Supabase', 'Tailwind CSS'] },
    { head: 'Typography', items: ['Bebas Neue', 'IBM Plex Mono', 'IBM Plex Sans'] },
    { head: 'Location', items: ['India', 'Everywhere'] },
    { head: 'Contact', items: ['hello@haappy.app', 'Twitter/X'] },
    { head: 'Year', items: ['2026', 'Ongoing'] },
  ];

  return (
    <div ref={containerRef} className="bg-[#141414] text-[#f2f2f2] font-sans antialiased relative min-h-screen">
      
      {/* TOP NAVBAR */}
      <Navbar />

      {/* Futuristic Cursor-Responsive Glowing & Infinite Scrolling Grid Background */}
      <InteractiveInfiniteGrid />

      {/* LEFT SIDE NAV */}
      <nav id="side-nav" style={{
        position: 'fixed', left: 0, top: 0, zIndex: 40, height: '100vh', width: '80px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderRight: '1px solid rgba(61,61,61,.25)',
        background: 'rgba(20,20,20,.88)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 1.5rem' }}>
          <a href="#hero" className="nav-dot active" data-sec="hero"><span className="dot"></span><span className="dot-label">Index</span></a>
          <a href="#signals" className="nav-dot" data-sec="signals"><span className="dot"></span><span className="dot-label">Updates</span></a>
          <a href="#features" className="nav-dot" data-sec="features"><span className="dot"></span><span className="dot-label">Features</span></a>
          <a href="#principles" className="nav-dot" data-sec="principles"><span className="dot"></span><span className="dot-label">Philosophy</span></a>
          <a href="#colophon" className="nav-dot" data-sec="colophon"><span className="dot"></span><span className="dot-label">About</span></a>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* HERO */}
        <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingLeft: 'clamp(1.5rem, 10vw, 7rem)', paddingRight: 'clamp(1.5rem, 4vw, 3rem)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%) rotate(-90deg) translateX(-50%)', transformOrigin: 'left center' }}>
            <span className="side-label">SIGNAL / 01</span>
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            <div id="sf-container" ref={sfContainerRef} style={{ display: 'flex', gap: '.06em', alignItems: 'center', cursor: 'pointer', perspective: '1000px', flexWrap: 'wrap' }}></div>

            <div id="hero-sub" style={{ opacity: 0, transform: 'translateY(1.5rem)', transition: 'opacity .8s ease 1.5s, transform .8s ease 1.5s' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', color: 'rgba(242,242,242,.4)', marginTop: '1rem', letterSpacing: '.08em' }}>
                A dream of every student — realised.
              </h2>
            </div>

            <div id="hero-desc" style={{ opacity: 0, transform: 'translateY(1.5rem)', transition: 'opacity .8s ease 1.8s, transform .8s ease 1.8s' }}>
              <p style={{ marginTop: '3rem', maxWidth: '420px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#6b6b6b', lineHeight: 1.8 }}>
                We built the platform we wished existed — structured learning, real community, career paths that actually work. Studies designed around how you actually grow.
              </p>
            </div>

            <div id="hero-cta" style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0, transform: 'translateY(1.5rem)', transition: 'opacity .8s ease 2.1s, transform .8s ease 2.1s' }}>
              <a href="#features" className="cta-btn">
                <span className="scramble" data-text="Start Learning">Start Learning</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#signals" className="cta-link">
                <span className="scramble" data-text="Browse Courses">Browse Courses</span>
              </a>
            </div>
          </div>

          <div id="hero-tag" style={{ position: 'absolute', bottom: '2rem', right: '2rem', opacity: 0, transition: 'opacity .8s ease 2.4s' }}>
            <div className="ver-tag"></div>
          </div>
        </section>

        {/* SIGNALS */}
        <section id="signals" style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: 'clamp(1.5rem, 10vw, 7rem)', position: 'relative' }}>
          <div style={{ marginBottom: '4rem', paddingRight: '3rem' }}>
            <div className="fade-up"><span className="sec-label">01 / Updates</span></div>
            <div className="fade-up" style={{ transitionDelay: '.1s' }}><h2 className="sec-title">WHAT'S NEW</h2></div>
          </div>
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '32px', paddingRight: '48px' }}>
            {signals.map((s, i) => (
              <article key={i} className="signal-card" style={{ opacity: 0, transform: 'translateY(2rem)', transition: `opacity .6s ease ${i * 0.1}s, transform .6s ease ${i * 0.1}s` }}>
                <div className="signal-card-inner">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#6b6b6b' }}>No. {s.num}</span>
                    <time style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#4a4a4a' }}>{s.date}</time>
                  </div>
                  <h3 className="sc-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '.02em', marginBottom: '.5rem', color: '#f2f2f2', transition: 'color .3s' }}>{s.title}</h3>
                  <div className="sc-line" style={{ width: '3rem', height: '1px', background: 'rgba(199,123,63,.5)', marginBottom: '1.5rem', transition: 'width .5s' }}></div>
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6b6b', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: 'clamp(1.5rem, 10vw, 7rem)', paddingRight: 'clamp(1.5rem, 4vw, 3rem)' }}>
          <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div className="fade-up"><span className="sec-label">02 / Features</span></div>
              <div className="fade-up" style={{ transitionDelay: '.1s' }}><h2 className="sec-title">THE PLATFORM</h2></div>
            </div>
            <div className="fade-up" style={{ transitionDelay: '.2s' }}>
              <p style={{ maxWidth: '280px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6b6b', lineHeight: 1.7, textAlign: 'right' }}>
                Six pillars. One platform. Everything a student needs to grow into a professional.
              </p>
            </div>
          </div>

          <div id="bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 180px)', gap: '16px' }}>
            {features.map((f, i) => (
              <article key={i} className="feat-card" style={{ gridColumn: f.col, gridRow: f.row, opacity: 0, transform: 'translateY(2rem)', transition: `opacity .6s ease ${i * 0.08}s, transform .6s ease ${i * 0.08}s, border-color .4s` }}>
                <div className="fc-corner"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b6b' }}>{f.label}</span>
                  <h3 className="fc-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', marginTop: '.5rem', letterSpacing: '.02em', color: '#f2f2f2' }}>{f.title}</h3>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p className="fc-desc" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6b6b', lineHeight: 1.7, maxWidth: '260px' }}>{f.desc}</p>
                </div>
                <span className="fc-num" style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(107,107,107,.4)', transition: 'color .3s' }}>{f.num}</span>
              </article>
            ))}
          </div>

          <div id="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
            {statsData.map((s, i) => {
              let IconComponent = Users;
              if (s.iconName === 'BookOpen') IconComponent = BookOpen;
              if (s.iconName === 'Award') IconComponent = Award;
              if (s.iconName === 'Building') IconComponent = Building;

              return (
                <div key={i} className="stat-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div style={{ marginBottom: '.75rem', color: '#c77b3f' }}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#f2f2f2', letterSpacing: '.05em' }}>{s.val}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#6b6b6b', marginTop: '4px' }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRINCIPLES */}
        <section id="principles" style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: 'clamp(1.5rem, 10vw, 7rem)', paddingRight: 'clamp(1.5rem, 4vw, 3rem)' }}>
          <div style={{ marginBottom: '6rem' }}>
            <div className="fade-up"><span className="sec-label">03 / Philosophy</span></div>
            <div className="fade-up" style={{ transitionDelay: '.1s' }}><h2 className="sec-title">HOW WE THINK</h2></div>
          </div>
          <div id="principles-list" style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {principles.map((p, i) => (
              <article key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: p.align === 'right' ? 'flex-end' : 'flex-start', textAlign: p.align as any, opacity: 0, transform: 'translateY(3rem)', transition: `opacity .8s ease ${i * 0.1}s, transform .8s ease ${i * 0.1}s` }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '1rem' }}>{p.num} / {p.tag}</span>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 6vw, 5rem)', letterSpacing: '.02em', lineHeight: 1, display: 'flex', flexWrap: 'wrap', gap: '.2em', justifyContent: p.align === 'right' ? 'flex-end' : 'flex-start' }}>
                  {p.pre && <span style={{ color: '#f2f2f2' }}>{p.pre}</span>}
                  <span className="principle-highlight"><span className="ph-bg"></span><span className="ph-txt" style={{ color: '#f2f2f2' }}>{p.hi}</span></span>
                  {p.suf && <span style={{ color: '#f2f2f2' }}>{p.suf}</span>}
                </h3>
                <p style={{ marginTop: '1.5rem', maxWidth: '400px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#6b6b6b', lineHeight: 1.7 }}>{p.desc}</p>
                <div className="principle-line" style={{ marginTop: '2rem' }}></div>
              </article>
            ))}
          </div>
        </section>

        {/* COLOPHON */}
        <section id="colophon" style={{ paddingTop: '8rem', paddingBottom: '8rem', paddingLeft: 'clamp(1.5rem, 10vw, 7rem)', paddingRight: 'clamp(1.5rem, 4vw, 3rem)', borderTop: '1px solid rgba(61,61,61,.3)' }}>
          <div style={{ marginBottom: '4rem' }}>
            <div className="fade-up"><span className="sec-label">04 / About</span></div>
            <div className="fade-up" style={{ transitionDelay: '.1s' }}><h2 className="sec-title">CREDITS</h2></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {colophons.map((c, i) => (
              <div key={i} className="fade-up" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="colo-head">{c.head}</span>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
                  {c.items.map((it, idx) => (
                    <li key={idx} className="colo-item">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(61,61,61,.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              © 2026 Haappy. All rights reserved.
            </p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#6b6b6b' }}>
              Designed with intention. Built with precision.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default NewLanding;