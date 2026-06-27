/* =============================================
   Main Interactions — GSAP, Lenis, UI Logic
   ============================================= */
   (function () {
    'use strict';
  
    /* =====================
       DATA
       ===================== */
    const skillsData = [
      {
        cat: 'Backend',
        items: [
          { name: 'Go',        icon: 'devicon-go-original-wordmark',    level: 95, color: '#4F8BFF' },
          { name: 'Node.js',   icon: 'devicon-nodejs-plain-wordmark',  level: 85, color: '#4F8BFF' },
          { name: 'Python',    icon: 'devicon-python-plain-wordmark',  level: 78, color: '#4F8BFF' },
          { name: 'REST API',  icon: 'devicon-postman-plain',          level: 92, color: '#4F8BFF' },
        ],
      },
      {
        cat: 'Frontend',
        items: [
          { name: 'JavaScript', icon: 'devicon-javascript-plain',           level: 88, color: '#8A5CFF' },
          { name: 'TypeScript', icon: 'devicon-typescript-plain',           level: 82, color: '#8A5CFF' },
          { name: 'React',      icon: 'devicon-react-original-wordmark',    level: 75, color: '#8A5CFF' },
          { name: 'HTML/CSS',   icon: 'devicon-html5-plain-wordmark',       level: 90, color: '#8A5CFF' },
        ],
      },
      {
        cat: 'Databases',
        items: [
          { name: 'PostgreSQL', icon: 'devicon-postgresql-plain-wordmark', level: 90, color: '#7FE7FF' },
          { name: 'MySQL',      icon: 'devicon-mysql-plain-wordmark',      level: 88, color: '#7FE7FF' },
          { name: 'Redis',      icon: 'devicon-redis-plain-wordmark',      level: 80, color: '#7FE7FF' },
          { name: 'MongoDB',    icon: 'devicon-mongodb-plain-wordmark',    level: 72, color: '#7FE7FF' },
        ],
      },
      {
        cat: 'Cloud & DevOps',
        items: [
          { name: 'Docker', icon: 'devicon-docker-plain-wordmark',              level: 88, color: '#4F8BFF' },
          { name: 'AWS',    icon: 'devicon-amazonwebservices-plain-wordmark',   level: 82, color: '#4F8BFF' },
          { name: 'Linux',  icon: 'devicon-linux-plain',                        level: 85, color: '#4F8BFF' },
          { name: 'CI/CD',  icon: 'devicon-githubactions-plain',               level: 80, color: '#4F8BFF' },
        ],
      },
      {
        cat: 'Tools',
        items: [
          { name: 'Git',     icon: 'devicon-git-plain-wordmark',    level: 92, color: '#8A5CFF' },
          { name: 'GitHub',  icon: 'devicon-github-original',       level: 90, color: '#8A5CFF' },
          { name: 'VS Code', icon: 'devicon-vscode-plain-wordmark', level: 88, color: '#8A5CFF' },
          { name: 'Postman', icon: 'devicon-postman-plain',         level: 86, color: '#8A5CFF' },
        ],
      },
      {
        cat: 'Languages',
        items: [
          { name: 'Go',    icon: 'devicon-go-original-wordmark',     level: 95, color: '#7FE7FF' },
          { name: 'SQL',   icon: 'devicon-mysql-plain-wordmark',     level: 90, color: '#7FE7FF' },
          { name: 'Bash',  icon: 'devicon-bash-plain',               level: 82, color: '#7FE7FF' },
          { name: 'YAML',  icon: 'devicon-yaml-plain',               level: 78, color: '#7FE7FF' },
        ],
      },
    ];
  
    const techOrbitItems = [
      { icon: 'devicon-go-original-wordmark',            name: 'Go',         ring: 1 },
      { icon: 'devicon-javascript-plain',               name: 'JavaScript', ring: 1 },
      { icon: 'devicon-typescript-plain',               name: 'TypeScript', ring: 1 },
      { icon: 'devicon-html5-plain-wordmark',           name: 'HTML',       ring: 1 },
      { icon: 'devicon-css3-plain-wordmark',            name: 'CSS',        ring: 1 },
      { icon: 'devicon-git-plain-wordmark',             name: 'Git',        ring: 1 },
      { icon: 'devicon-github-original',                name: 'GitHub',     ring: 1 },
      { icon: 'devicon-docker-plain-wordmark',          name: 'Docker',     ring: 2 },
      { icon: 'devicon-linux-plain',                    name: 'Linux',      ring: 2 },
      { icon: 'devicon-mysql-plain-wordmark',           name: 'MySQL',      ring: 2 },
      { icon: 'devicon-postgresql-plain-wordmark',      name: 'PostgreSQL', ring: 2 },
      { icon: 'devicon-redis-plain-wordmark',           name: 'Redis',      ring: 2 },
      { icon: 'devicon-vscode-plain-wordmark',          name: 'VS Code',    ring: 2 },
      { icon: 'devicon-amazonwebservices-plain-wordmark', name: 'AWS',      ring: 2 },
    ];
  
    const projectsData = [
      {
        title: 'CloudScale API',
        desc: 'High-performance microservices platform handling 10K+ requests/sec with automatic scaling, circuit breaking, and distributed tracing.',
        img: 'https://picsum.photos/seed/cloudscale-api/800/500.jpg',
        tags: ['Go', 'gRPC', 'Docker', 'Kubernetes'],
        demo: '#', github: '#',
      },
      {
        title: 'DataFlow Engine',
        desc: 'Real-time data processing pipeline with streaming ETL, windowed aggregations, and exactly-once delivery semantics.',
        img: 'https://picsum.photos/seed/dataflow-engine/800/500.jpg',
        tags: ['Go', 'Kafka', 'PostgreSQL', 'Redis'],
        demo: '#', github: '#',
      },
      {
        title: 'SecureAuth',
        desc: 'Zero-trust authentication service with JWT/OAuth2, MFA, rate limiting, and comprehensive audit logging for enterprise apps.',
        img: 'https://picsum.photos/seed/secure-auth-svc/800/500.jpg',
        tags: ['Go', 'OAuth2', 'Redis', 'Docker'],
        demo: '#', github: '#',
      },
      {
        title: 'DevMetrics Dashboard',
        desc: 'Developer productivity analytics tracking code quality, deployment frequency, lead time, and team velocity across organizations.',
        img: 'https://picsum.photos/seed/devmetrics-dash/800/500.jpg',
        tags: ['TypeScript', 'React', 'Go API', 'PostgreSQL'],
        demo: '#', github: '#',
      },
      {
        title: 'CloudDeploy CLI',
        desc: 'Zero-config deployment tool that packages, optimizes, and deploys Go services to any cloud provider with a single command.',
        img: 'https://picsum.photos/seed/clouddeploy-cli/800/500.jpg',
        tags: ['Go', 'AWS', 'Docker', 'CI/CD'],
        demo: '#', github: '#',
      },
      {
        title: 'CodeReview AI',
        desc: 'Automated code review system using pattern matching and static analysis to catch bugs, security issues, and style violations.',
        img: 'https://picsum.photos/seed/codereview-ai/800/500.jpg',
        tags: ['Python', 'Go', 'GitHub API', 'Docker'],
        demo: '#', github: '#',
      },
    ];
  
    const experienceData = [
      {
        period: '2023 — Present',
        role: 'Senior Backend Developer',
        company: 'TechCorp Inc.',
        desc: 'Leading backend architecture for a SaaS platform serving 500K+ users. Designed distributed system with Go microservices, reducing API latency by 60%. Mentoring a team of 5 developers.',
        tags: ['Go', 'Kubernetes', 'PostgreSQL', 'gRPC'],
      },
      {
        period: '2021 — 2023',
        role: 'Backend Developer',
        company: 'StartupX',
        desc: 'Built the core API platform from scratch using Go and PostgreSQL. Implemented real-time features with WebSockets, achieving 99.99% uptime.',
        tags: ['Go', 'Redis', 'Docker', 'AWS'],
      },
      {
        period: '2019 — 2021',
        role: 'Full Stack Developer',
        company: 'WebAgency',
        desc: 'Developed 30+ client projects ranging from e-commerce to SaaS dashboards. Introduced automated testing, reducing bug rates by 40%.',
        tags: ['JavaScript', 'React', 'Node.js', 'MySQL'],
      },
      {
        period: '2018 — 2019',
        role: 'Junior Developer',
        company: 'FirstCompany',
        desc: 'Started my professional journey building REST APIs and web applications. Learned production-grade coding practices and agile methodology.',
        tags: ['Python', 'JavaScript', 'PostgreSQL', 'Git'],
      },
    ];
  
    /* =====================
       POPULATE SKILLS
       ===================== */
    const skillsGrid = document.getElementById('skills-grid');
  
    skillsData.forEach((cat, ci) => {
      const catEl = document.createElement('div');
      catEl.className = 'mb-2';
      catEl.innerHTML =
        '<h3 class="font-heading font-semibold text-sm tracking-wide text-white/70 mb-3 pl-1">' +
        cat.cat + '</h3>';
  
      cat.items.forEach((skill, si) => {
        const card = document.createElement('div');
        card.className = 'glass-sm skill-card tilt-card glass-hover mb-2 reveal-scale';
        card.style.transitionDelay = (ci * 4 + si) * 60 + 'ms';
        card.innerHTML =
          '<div class="skill-icon" style="background:' + skill.color + '15;border:1px solid ' + skill.color + '25">' +
            '<i class="' + skill.icon + '" style="color:' + skill.color + ';font-size:1.2rem"></i>' +
          '</div>' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex justify-between items-center mb-1">' +
              '<span class="text-sm font-medium">' + skill.name + '</span>' +
              '<span class="text-xs text-white/40">' + skill.level + '%</span>' +
            '</div>' +
            '<div class="skill-bar">' +
              '<div class="skill-bar-fill" data-level="' + skill.level + '" style="background:linear-gradient(90deg,' + skill.color + ',' + skill.color + '88)"></div>' +
            '</div>' +
          '</div>';
        catEl.appendChild(card);
      });
  
      skillsGrid.appendChild(catEl);
    });
  
    /* =====================
       POPULATE TECH ORBIT
       ===================== */
    const ring1El = document.getElementById('orbit-ring-1');
    const ring2El = document.getElementById('orbit-ring-2');
    const isMobile = window.innerWidth < 768;
    const r1 = isMobile ? 110 : 160;
    const r2 = isMobile ? 130 : 185;
  
    techOrbitItems.filter(function (t) { return t.ring === 1; }).forEach(function (t, i) {
      var el = document.createElement('div');
      el.className = 'orbit-item glass-sm';
      el.title = t.name;
      el.style.transform = 'rotateY(' + (i / 7 * 360) + 'deg) translateZ(' + r1 + 'px)';
      el.innerHTML = '<i class="' + t.icon + '" style="font-size:1.4rem"></i>';
      ring1El.appendChild(el);
    });
  
    techOrbitItems.filter(function (t) { return t.ring === 2; }).forEach(function (t, i, arr) {
      var el = document.createElement('div');
      el.className = 'orbit-item glass-sm';
      el.title = t.name;
      el.style.transform = 'rotateY(' + (i / arr.length * 360) + 'deg) translateZ(' + r2 + 'px)';
      el.innerHTML = '<i class="' + t.icon + '" style="font-size:1.4rem"></i>';
      ring2El.appendChild(el);
    });
  
    /* =====================
       POPULATE PROJECTS
       ===================== */
    var projectsGrid = document.getElementById('projects-grid');
  
    projectsData.forEach(function (p, i) {
      var card = document.createElement('div');
      card.className = 'glass project-card tilt-card reveal-scale';
      card.style.transitionDelay = i * 100 + 'ms';
  
      var tagsHTML = p.tags
        .map(function (t) { return '<span class="project-tag">' + t + '</span>'; })
        .join('');
  
      card.innerHTML =
        '<div class="project-img">' +
          '<img src="' + p.img + '" alt="' + p.title + '" loading="lazy">' +
        '</div>' +
        '<div class="p-6">' +
          '<h3 class="font-heading font-semibold text-lg mb-2">' + p.title + '</h3>' +
          '<p class="text-white/40 text-sm leading-relaxed mb-4" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">' + p.desc + '</p>' +
          '<div class="flex flex-wrap gap-1.5 mb-5">' + tagsHTML + '</div>' +
          '<div class="flex gap-3">' +
            '<a href="' + p.demo + '" class="btn-primary" style="padding:0.55rem 1.2rem;font-size:0.8rem;border-radius:10px"><span>Live Demo</span></a>' +
            '<a href="' + p.github + '" class="btn-secondary" style="padding:0.55rem 1.2rem;font-size:0.8rem;border-radius:10px">' +
              '<i class="devicon-github-original" style="font-size:0.9rem"></i> Code' +
            '</a>' +
          '</div>' +
        '</div>';
  
      projectsGrid.appendChild(card);
    });
  
     /* =====================
     POPULATE TIMELINE
     ===================== */
  var timeline = document.getElementById('timeline');
  var TIMELINE_ITEM_GAP = 260;
  var TIMELINE_PADDING = 60;
  var TIMELINE_CARD_HEIGHT = 200; /* estimated max card height */
  var TIMELINE_BOTTOM_PAD = 80;

  experienceData.forEach(function (exp, i) {
    var side = i % 2 === 0 ? 'left' : 'right';
    var topOffset = i * TIMELINE_ITEM_GAP + TIMELINE_PADDING;

    var item = document.createElement('div');
    item.className = 'timeline-item ' + side + ' reveal';
    item.style.top = topOffset + 'px';
    item.style.transitionDelay = i * 150 + 'ms';

    var tagsHTML = exp.tags
      .map(function (t) { return '<span class="project-tag">' + t + '</span>'; })
      .join('');

    item.innerHTML =
      '<div class="glass-sm p-6 glass-hover" style="text-align:' + (side === 'left' ? 'right' : 'left') + '">' +
        '<span class="text-xs font-heading tracking-wider text-accent-blue">' + exp.period + '</span>' +
        '<h3 class="font-heading font-semibold text-lg mt-1">' + exp.role + '</h3>' +
        '<p class="text-white/50 text-sm mb-2">' + exp.company + '</p>' +
        '<p class="text-white/40 text-sm leading-relaxed mb-3">' + exp.desc + '</p>' +
        '<div class="flex flex-wrap gap-1.5 ' + (side === 'left' ? 'justify-end' : '') + '">' + tagsHTML + '</div>' +
      '</div>';

    timeline.appendChild(item);

    /* Dot */
    var dot = document.createElement('div');
    dot.className = 'timeline-dot';
    dot.style.top = (topOffset + 40) + 'px';
    timeline.appendChild(dot);
  });

  /* Height = last item top + last card height + bottom padding */
  var lastItemTop = (experienceData.length - 1) * TIMELINE_ITEM_GAP + TIMELINE_PADDING;
  timeline.style.height = (lastItemTop + TIMELINE_CARD_HEIGHT + TIMELINE_BOTTOM_PAD) + 'px';
  
    /* =====================
       LOADING SCREEN
       ===================== */
    var loaderBar = document.getElementById('loader-bar');
    var loader = document.getElementById('loader');
    var loadProgress = 0;
  
    var loadInterval = setInterval(function () {
      loadProgress += Math.random() * 25 + 10;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        setTimeout(function () {
          gsap.to(loader, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: function () {
              loader.style.display = 'none';
              initAnimations();
            },
          });
        }, 300);
      }
      loaderBar.style.width = loadProgress + '%';
    }, 200);
  
    /* =====================
       LENIS SMOOTH SCROLL
       ===================== */
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smooth: true,
    });
  
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  
    /* All anchor links use Lenis */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(link.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -80 });
        /* Close mobile menu if open */
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      });
    });
  
    /* =====================
       CUSTOM CURSOR
       ===================== */
    var cursorDot  = document.getElementById('cursor-dot');
    var cursorRing = document.getElementById('cursor-ring');
    var cursorGlow = document.getElementById('cursor-glow');
    var cx = 0, cy = 0, rx = 0, ry = 0, gx = 0, gy = 0;
  
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX;
      cy = e.clientY;
    });
  
    function updateCursor() {
      rx += (cx - rx) * 0.15;
      ry += (cy - ry) * 0.15;
      gx += (cx - gx) * 0.08;
      gy += (cy - gy) * 0.08;
  
      cursorDot.style.left  = cx + 'px';
      cursorDot.style.top   = cy + 'px';
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      cursorGlow.style.left = gx + 'px';
      cursorGlow.style.top  = gy + 'px';
  
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  
    /* Hover state on interactive elements */
    document.querySelectorAll('a, button, .tilt-card, input, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function () {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });
  
    /* =====================
       SCROLL PROGRESS BAR
       ===================== */
    var scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
    });
  
    /* =====================
       NAVBAR SCROLL EFFECT
       ===================== */
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  
    /* Active nav link tracking */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[data-section]');
  
    window.addEventListener('scroll', function () {
      var current = '';
      sections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - 200) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.dataset.section === current) link.classList.add('active');
      });
    });
  
    /* =====================
       HAMBURGER MENU
       ===================== */
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
  
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  
    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  
    /* =====================
       TILT CARDS
       ===================== */
    function initTilt() {
      document.querySelectorAll('.tilt-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var centerX = rect.width / 2;
          var centerY = rect.height / 2;
          var rotateX = ((y - centerY) / centerY) * -6;
          var rotateY = ((x - centerX) / centerX) * 6;
          card.style.transform =
            'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });
      });
    }
  
    /* =====================
       GSAP SCROLL ANIMATIONS
       ===================== */
    function initAnimations() {
      gsap.registerPlugin(ScrollTrigger);
  
      /* Fade-up reveals */
      gsap.utils.toArray('.reveal').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      });
  
      /* Slide-left reveals */
      gsap.utils.toArray('.reveal-left').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      });
  
      /* Slide-right reveals */
      gsap.utils.toArray('.reveal-right').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      });
  
      /* Scale reveals */
      gsap.utils.toArray('.reveal-scale').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });
  
      /* Skill bar fills */
      gsap.utils.toArray('.skill-bar-fill').forEach(function (bar) {
        var level = bar.dataset.level;
        gsap.to(bar, {
          width: level + '%', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 92%', toggleActions: 'play none none none' },
        });
      });
  
      /* Stat counter animation */
      gsap.utils.toArray('.stat-number').forEach(function (el) {
        var target = parseInt(el.dataset.count, 10);
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          onUpdate: function () {
            el.textContent =
              (target >= 1000 ? Math.floor(obj.val).toLocaleString() : Math.floor(obj.val)) + '+';
          },
        });
      });
  
      /* Timeline dot activation */
      gsap.utils.toArray('.timeline-dot').forEach(function (dot) {
        ScrollTrigger.create({
          trigger: dot, start: 'top 75%',
          onEnter: function () { dot.classList.add('active'); },
          onLeaveBack: function () { dot.classList.remove('active'); },
        });
      });
  
      initTilt();
    }
  
    /* =====================
       CONTACT FORM
       ===================== */
    var contactForm = document.getElementById('contact-form');
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toast-message');
  
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      var name    = document.getElementById('c-name').value.trim();
      var email   = document.getElementById('c-email').value.trim();
      var message = document.getElementById('c-message').value.trim();
  
      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', false);
        return;
      }
  
      /* Simulate send */
      var btn = contactForm.querySelector('button');
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;
  
      setTimeout(function () {
        showToast('Message sent successfully! I\'ll get back to you soon.', true);
        contactForm.reset();
        btn.innerHTML =
          '<span>Send Message</span>' +
          '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
            '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' +
          '</svg>';
        btn.disabled = false;
      }, 1500);
    });
  
    function showToast(msg, success) {
      toastMsg.textContent = msg;
      toast.style.background   = success ? 'rgba(79,139,255,0.15)'  : 'rgba(255,100,100,0.15)';
      toast.style.borderColor  = success ? 'rgba(79,139,255,0.3)'   : 'rgba(255,100,100,0.3)';
      toast.querySelector('svg').style.stroke = success ? 'var(--accent-highlight)' : '#ff6464';
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 4000);
    }
  })();