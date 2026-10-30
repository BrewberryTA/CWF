/* Important Conversations with Fools: the interactive pieces.
   Nothing here sends, saves or stores anything a visitor types. No network calls, no storage.
   ---------------------------------------------------------------------------------------
   EDIT THE WORDS HERE. Each list is plain text; add, remove or rewrite lines freely.
*/

// Draw a card (Home). The first five are lines already on the site; the rest are new drafts.
var CARD_QUESTIONS = [
  "What are the odds the world is exactly as you think it is?",
  "How much of what you believe did you ever check for yourself?",
  "When did you last change your mind about something that mattered?",
  "What would you see if you looked at it all again?",
  "What if the world is stranger than you’ve been told?",
  "What have you been waiting for permission to say?",
  "Which of your beliefs would you least like to have tested?",
  "Who taught you what you think is true, and did they ever check?",
  "What do you know now that you’d have argued against ten years ago?",
  "What does everyone around you agree on that nobody has looked at closely?",
  "If you were wrong about the thing you’re surest of, how would you find out?",
  "What conversation have you been having alone?",
  "What story about yourself have you outgrown but still tell?",
  "What question did you stop asking because the answer scared you?",
  "What would you say if you knew no one would think less of you?"
];

// Today's planet (all pages). Sunday is 0. Traditional rulers of the weekdays.
var PLANET_DAYS = [
  {day:"Sunday",    planet:"Sun",     q:"What part of you have you kept out of the light?"},
  {day:"Monday",    planet:"Moon",    q:"What do you feel that you haven’t let yourself name?"},
  {day:"Tuesday",   planet:"Mars",    q:"What would you do this week if you weren’t afraid of being wrong?"},
  {day:"Wednesday", planet:"Mercury", q:"What have you been meaning to say, and to whom?"},
  {day:"Thursday",  planet:"Jupiter", q:"What belief have you outgrown but still carry?"},
  {day:"Friday",    planet:"Venus",   q:"Who would you be closer to if you said one honest thing?"},
  {day:"Saturday",  planet:"Saturn",  q:"What limit have you accepted that was never really yours?"}
];

// Take it apart (The Fool). One opening is picked at random; the follow-ups ask HOW, not WHY.
// Explaining how something works exposes the gaps; being asked to justify it tends to dig people in.
var WHY_OPENINGS = [
  "What’s something you believe that most people around you don’t?",
  "What’s something about how the world works that you’d bet on?",
  "What’s something you’re sure of about the world?"
];
var WHY_FOLLOWUPS = [
  "How does that actually work? Walk through it step by step.",
  "How did you come to know that? Trace it back to where you first got it.",
  "Now, how well do you really understand it, compared to when you started?"
];
// As above, so below: the secret message found by turning the page over (footer seal).
var BELOW = {
  line: "And that which is below is like that which is above.",
  body: "You turned the world over to see what was underneath. Most people never do. Nothing here has changed. You’re only seeing it from the other side, and that is the whole idea.",
  question: "If the world outside is a mirror of the world inside, what is yours showing you?"
};

var WHY_END = "The gap between what you thought you knew and what you could explain is the edge of your map. That’s a conversation worth having out loud.";

// The edges of the map (Home). One per sea monster, in order: name, question, note.
var MAP_MONSTERS = [
  {name:"The hard problem", q:"Why is there something it is like to be you?", n:"Science can map what the brain does. Nobody can yet say why any of it is felt from the inside."},
  {name:"The dark", q:"What is most of the universe made of?", n:"Ordinary matter is about five percent of it. The rest has names, dark matter and dark energy, but names aren’t answers."},
  {name:"The first question", q:"Why is there something rather than nothing?", n:"Every answer anyone has offered starts with something already there."},
  {name:"The chooser", q:"Do you choose, or does it only feel that way?", n:"Every decision you make rests on an answer nobody has."},
  {name:"The spark", q:"How did chemistry become life?", n:"Life began here somehow. How lifeless matter first started copying itself is still unknown."},
  {name:"The arrow", q:"Why does time only run one way?", n:"Most of the basic laws of physics work the same forward and backward. Your life doesn’t."}
];

// Say it without "is" (The Fool). Example rewrites shown on request.
var NORIS_EXAMPLES = [
  ["He is lazy.", "He didn’t finish his part, and I had to pick it up."],
  ["She is rude.", "She didn’t say hello this morning, and it stung."],
  ["My boss is impossible.", "My boss changed the plan twice this week, and I felt dismissed."],
  ["They are selfish.", "They took the last of it without asking, and I felt invisible."]
];

// Easter eggs.
var EYE_WHISPER = "Some things are easier to see with your eyes closed.";      // after blinking the eye three times
var FOOL_WORD = "You said the word. Every important conversation starts at zero."; // typing "fool"
var STARS_LABEL = "THE FOOL";                                                       // the hidden constellation
// Holding the footer seal for seven seconds: the founder's question.
var FOUNDER = {
  eyebrow: "From the founder",
  question: "What if there is a reason you’re alive, and finding it is the whole point?",
  sign: "The first fool"
};

/* --------------------------------------------------------------------------------------- */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s,r){return (r||document).querySelector(s)}
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}

  /* Today's planet */
  (function(){
    var t = PLANET_DAYS[new Date().getDay()];
    var titles = document.querySelectorAll('.geo title');
    for (var i=0;i<titles.length;i++){
      if (titles[i].textContent === t.planet){
        var g = titles[i].parentNode.parentNode.parentNode; // glyph > .upright > positioned group
        g.setAttribute('class', ((g.getAttribute('class')||'') + ' today').trim());
      }
    }
    var heroWrap = $('.hero .wrap');
    if (heroWrap){
      var p = el('p','dayline');
      var b = el('b', null, t.planet);
      p.appendChild(document.createTextNode(t.day + ' belongs to '));
      p.appendChild(b);
      p.appendChild(document.createTextNode('.'));
      p.appendChild(el('span','dq',t.q));
      heroWrap.appendChild(p);
    }
  })();

  /* Draw the Fool's card */
  (function(){
    var card = $('#card'); if (!card) return;
    var q = $('.q', card), again = $('#again'), bag = [], last = null;
    function next(){
      if (!bag.length){ bag = CARD_QUESTIONS.slice(); for (var i=bag.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=bag[i];bag[i]=bag[j];bag[j]=x} if (bag[bag.length-1]===last) bag.unshift(bag.pop()); }
      last = bag.pop(); return last;
    }
    function show(){ q.textContent = next(); card.classList.add('up'); card.setAttribute('aria-label','Your question: ' + q.textContent + '. Tap to put the card back.'); again.hidden = false; }
    card.addEventListener('click', function(){
      if (card.classList.contains('up')){ card.classList.remove('up'); card.setAttribute('aria-label','Draw a card'); }
      else show();
    });
    again.addEventListener('click', function(){
      if (!card.classList.contains('up')) { show(); return; }
      card.classList.remove('up');
      setTimeout(show, reduce ? 0 : 650);
    });
  })();

  /* Say it and let it burn */
  (function(){
    var box = $('#burn'); if (!box) return;
    var ta = $('textarea', box), go = $('#burn-go'), stage = $('.stage', box), after = $('.after', box);
    go.addEventListener('click', function(){
      var text = ta.value.replace(/\s+$/,''); if (!text.trim()) { ta.focus(); return; }
      var ash = el('div','ashes'); ash.setAttribute('aria-hidden','true');
      var chars = Array.from(text).slice(0, 1200), n = chars.length;
      chars.forEach(function(c, i){
        if (c === '\n'){ ash.appendChild(document.createElement('br')); return; }
        var s = el('span', null, c);
        var d = (i / Math.max(n,1)) * 1.6 + Math.random() * .7;
        s.style.setProperty('--d', d.toFixed(2) + 's');
        s.style.setProperty('--r', (Math.random()*40-20).toFixed(0) + 'deg');
        ash.appendChild(s);
      });
      ta.value = '';
      stage.hidden = true;
      box.insertBefore(ash, after);
      setTimeout(function(){ ash.remove(); after.hidden = false; $('.again', after).focus(); }, reduce ? 1000 : 3200);
    });
    $('.again', after).addEventListener('click', function(){ after.hidden = true; stage.hidden = false; ta.focus(); });
  })();

  /* Take it apart */
  (function(){
    var box = $('#why'); if (!box) return;
    var trail = $('.trail', box), ask = $('.ask', box), ta = $('textarea', box), go = $('#why-go'), stage = $('.stage', box), end = $('.end', box), step = 0;
    function start(){
      trail.innerHTML = ''; step = 0; end.hidden = true; stage.hidden = false;
      ask.textContent = WHY_OPENINGS[Math.floor(Math.random()*WHY_OPENINGS.length)];
      ta.value = '';
    }
    go.addEventListener('click', function(){
      var a = ta.value.trim(); if (!a) { ta.focus(); return; }
      var li = el('li', null, ask.textContent); li.appendChild(el('span', null, a)); trail.appendChild(li);
      ta.value = '';
      if (step < WHY_FOLLOWUPS.length){ ask.textContent = WHY_FOLLOWUPS[step++]; ta.focus(); }
      else { stage.hidden = true; $('.ask', end).textContent = WHY_END; end.hidden = false; $('a', end).focus(); }
    });
    $('.again', end).addEventListener('click', function(){ start(); ta.focus(); });
    start();
  })();

  /* As above, so below: the footer seal turns the page over */
  (function(){
    var seal = $('footer .below'); if (!seal) return;
    var b = el('button','turn'); b.type = 'button';
    b.setAttribute('aria-label','As above, so below. Turn the page over.');
    b.title = 'As above, so below';
    seal.parentNode.insertBefore(b, seal); b.appendChild(seal);
    var root = document.documentElement;
    // Wrap the page content (not the star field) so only the content turns over.
    var page = el('div','page'), kids = Array.prototype.slice.call(document.body.children);
    document.body.insertBefore(page, document.body.firstChild);
    kids.forEach(function(k){ if (!k.classList.contains('sky') && k.tagName !== 'SCRIPT') page.appendChild(k); });
    // The secret message, shown right side up once the page is turned over.
    var below = el('div','belowmsg'); below.hidden = true;
    below.setAttribute('role','dialog'); below.setAttribute('aria-label','As above, so below');
    below.innerHTML = '<div class="bm-in">'
      + '<p class="bm-latin">ET QVOD INFERIVS EST SICVT QVOD EST SVPERIVS</p>'
      + '<p class="bm-line">' + BELOW.line + '</p>'
      + '<p>' + BELOW.body + '</p>'
      + '<p class="bm-q">' + BELOW.question + '</p>'
      + '<p class="bm-row"><button type="button" class="bm-back">Turn it back</button> <button type="button" class="again bm-stay">Stay below a while</button></p>'
      + '</div>';
    document.body.appendChild(below);
    var inverted = false, busy = false, DUR = reduce ? 0 : 1300;

    // Turn around the middle of the screen so whatever you're looking at stays in view.
    function turn(){
      if (busy) return; busy = true;
      var s = window.scrollY, vh = window.innerHeight, H = page.offsetHeight;
      page.style.transition = 'none';
      if (!inverted){
        page.style.transformOrigin = '50% ' + (s + vh/2) + 'px';
        page.style.transform = 'rotate(0deg)';
      } else {
        var p = H - (s + vh/2);
        page.style.transformOrigin = '50% ' + p + 'px';
        page.style.transform = 'rotate(180deg)';
        window.scrollTo(0, p - vh/2);
        below.hidden = true; root.classList.remove('inverted');
      }
      void page.offsetWidth;
      page.style.transition = DUR ? 'transform ' + DUR + 'ms cubic-bezier(.65,0,.25,1)' : 'none';
      page.style.transform = inverted ? 'rotate(0deg)' : 'rotate(180deg)';
      setTimeout(function(){
        page.style.transition = 'none';
        if (!inverted){
          // Re-anchor on the page's own center so the whole upside-down page can still be scrolled.
          page.style.transformOrigin = '50% 50%';
          window.scrollTo(0, H - s - vh);
          inverted = true; root.classList.add('inverted');
          below.hidden = false; $('.bm-back', below).focus();
        } else {
          page.style.transform = ''; page.style.transformOrigin = '';
          inverted = false; b.focus();
        }
        busy = false;
      }, DUR + 30);
    }
    b.addEventListener('click', function(){ if (b.dataset.suppress){ delete b.dataset.suppress; return; } turn(); });
    $('.bm-back', below).addEventListener('click', turn);
    $('.bm-stay', below).addEventListener('click', function(){ below.hidden = true; b.focus(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !below.hidden) below.hidden = true; });
  })();

  /* The ring turns as you scroll */
  (function(){
    if (reduce) return;
    var rings = [];
    function wrap(sel, c, k){
      var g = $(sel); if (!g) return;
      var w = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.parentNode.insertBefore(w, g); w.appendChild(g);
      rings.push({w:w, c:c, k:k});
    }
    wrap('.geo .spin-t', 400, .12);
    wrap('footer .below .spin-t', 85, -.2);
    var ticking = false;
    function draw(){
      ticking = false; var y = window.scrollY || 0;
      rings.forEach(function(r){ r.w.setAttribute('transform','rotate(' + (y*r.k).toFixed(2) + ' ' + r.c + ' ' + r.c + ')'); });
    }
    window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(draw); } }, {passive:true});
    draw();
  })();
})();

/* --------------------------------------------------------------------------------------- */
/* The map with edges, and the easter eggs */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
  function svgel(tag,attrs){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);return e}
  function cls(e,c,on){var v=(e.getAttribute('class')||'').split(/\s+/).filter(function(x){return x&&x!==c});if(on)v.push(c);e.setAttribute('class',v.join(' '))}
  function toast(text, ms){
    var t = el('div','toast',text); document.body.appendChild(t);
    setTimeout(function(){ t.classList.add('go'); }, ms||4200);
    setTimeout(function(){ t.remove(); }, (ms||4200)+900);
  }

  /* The edges of the map */
  (function(){
    var box = $('#edges'); if (!box) return;
    var name=$('.mq-name',box), q=$('.mq-q',box), n=$('.mq-n',box), mons=$$('.mon',box);
    function pick(m){
      mons.forEach(function(x){ cls(x,'on',x===m); });
      var d = MAP_MONSTERS[+m.getAttribute('data-i')]; if (!d) return;
      name.textContent = d.name; q.textContent = d.q; n.textContent = d.n;
      box.querySelector('.mapq').classList.remove('fresh'); void box.offsetWidth; box.querySelector('.mapq').classList.add('fresh');
    }
    mons.forEach(function(m){
      m.addEventListener('click', function(){ pick(m); });
      m.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(m); } });
    });
  })();

  /* The eye opens: follows the cursor, blinks when clicked */
  (function(){
    var eye = $('.geo .eye'); if (!eye) return;
    var parts = eye.children, lid = null, pupil = null;
    for (var i=0;i<parts.length;i++){ var t=parts[i]; if (t.tagName==='path' && /Q400/.test(t.getAttribute('d')||'')) lid=t; if (t.tagName==='circle' && t.getAttribute('r')==='2.0') pupil=t; }
    if (!lid || !pupil) return;
    var lookG = svgel('g',{}); pupil.parentNode.insertBefore(lookG,pupil); lookG.appendChild(pupil);
    var blinkG = svgel('g',{'class':'blink'}); lid.parentNode.insertBefore(blinkG,lid); blinkG.appendChild(lid); blinkG.appendChild(lookG);
    var hit = svgel('circle',{cx:400,cy:54,r:26,fill:'transparent','class':'eyehit',tabindex:'0',role:'button','aria-label':'The eye'});
    eye.appendChild(hit);
    var geo = $('.geo');
    if (!reduce) document.addEventListener('pointermove', function(e){
      var m = geo.getScreenCTM(); if (!m) return;
      var p = geo.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; p = p.matrixTransform(m.inverse());
      var dx=p.x-400, dy=p.y-55, d=Math.sqrt(dx*dx+dy*dy)||1;
      lookG.setAttribute('transform','translate(' + (dx/d*3.6).toFixed(2) + ' ' + (dy/d*1.6).toFixed(2) + ')');
    }, {passive:true});
    var blinks = 0;
    function blink(){
      cls(blinkG,'shut',false); void blinkG.getBoundingClientRect(); cls(blinkG,'shut',true);
      setTimeout(function(){ cls(blinkG,'shut',false); }, 260);
      if (++blinks === 3) setTimeout(function(){ toast(EYE_WHISPER); }, 400);
    }
    hit.addEventListener('click', blink);
    hit.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); blink(); } });
  })();

  /* The serpent eats: click the ouroboros and it races around, swallowing its tail */
  (function(){
    var serp = $('.geo .serpent'); if (!serp) return;
    var hit = svgel('circle',{cx:200,cy:200,r:186,fill:'none',stroke:'transparent','stroke-width':'22','class':'serphit',tabindex:'0',role:'button','aria-label':'The serpent'});
    serp.appendChild(hit);
    var seal = $('.geo .seal'), busy=false;
    function eat(){
      if (busy) return; busy = true;
      cls(serp,'feeding',true); cls(seal,'glow',true);
      setTimeout(function(){ cls(serp,'feeding',false); cls(seal,'glow',false); busy=false; }, reduce ? 600 : 3400);
    }
    hit.addEventListener('click', eat);
    hit.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); eat(); } });
  })();

  /* Day and night: the sun in the seal brings day, the moon brings night */
  (function(){
    var seal = $('.geo .seal'); if (!seal) return;
    var root = document.documentElement;
    try { if (sessionStorage.getItem('fools-light')==='day') root.classList.add('day'); } catch(e){}
    function set(day){
      root.classList.toggle('day', day);
      try { sessionStorage.setItem('fools-light', day ? 'day' : 'night'); } catch(e){}
    }
    var sun = svgel('circle',{cx:286,cy:102,r:24,fill:'transparent','class':'lighthit',tabindex:'0',role:'button','aria-label':'The sun: bring the day'});
    var moon = svgel('circle',{cx:112,cy:106,r:22,fill:'transparent','class':'lighthit',tabindex:'0',role:'button','aria-label':'The moon: bring the night'});
    seal.appendChild(sun); seal.appendChild(moon);
    [[sun,true],[moon,false]].forEach(function(p){
      p[0].addEventListener('click', function(e){ e.stopPropagation(); set(p[1]); });
      p[0].addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); set(p[1]); } });
    });
  })();

  /* Type "fool" anywhere (outside a text box) and the zero card falls */
  (function(){
    var buf = '';
    document.addEventListener('keydown', function(e){
      var t = e.target; if (t && (t.tagName==='TEXTAREA' || t.tagName==='INPUT' || t.isContentEditable)) return;
      if (!e.key || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf === 'fool'){
        buf = '';
        var c = el('div','fallcard'); c.setAttribute('role','status');
        c.innerHTML = '<span class="fz">0</span><span class="fn">THE FOOL</span><span class="fl"></span>';
        c.querySelector('.fl').textContent = FOOL_WORD;
        document.body.appendChild(c);
        setTimeout(function(){ c.classList.add('go'); }, 6500);
        setTimeout(function(){ c.remove(); }, 7600);
        c.addEventListener('click', function(){ c.remove(); });
      }
    });
  })();

  /* Stars that connect: linger near them and a fool constellation draws itself */
  (function(){
    var sky = $('svg.sky'); if (!sky) return;
    // A walking figure with a staff over his shoulder and a dog at his heel.
    var P = [[868,520],[878,548],[872,590],[858,632],[884,632],[852,566],[900,560],[906,508],[928,488],[838,652],[828,640]];
    var L = [[0,1],[1,2],[2,3],[2,4],[1,5],[1,6],[6,7],[7,8],[3,9],[9,10]];
    var g = svgel('g',{'class':'constel'});
    L.forEach(function(l){ g.appendChild(svgel('line',{x1:P[l[0]][0],y1:P[l[0]][1],x2:P[l[1]][0],y2:P[l[1]][1],pathLength:'1'})); });
    P.forEach(function(p){ g.appendChild(svgel('circle',{cx:p[0],cy:p[1],r:'1.6'})); });
    var t = svgel('text',{x:'878',y:'690','text-anchor':'middle'}); t.textContent = STARS_LABEL; g.appendChild(t);
    sky.appendChild(g);
    var timer = null, shown = false;
    function near(x,y){
      var m = sky.getScreenCTM(); if (!m) return false;
      var p = sky.createSVGPoint(); p.x=x; p.y=y; p = p.matrixTransform(m.inverse());
      return Math.abs(p.x-876) < 90 && Math.abs(p.y-580) < 120;
    }
    function check(x,y){
      if (near(x,y)){ if (!timer && !shown) timer = setTimeout(function(){ shown = true; cls(g,'on',true); }, 900); }
      else { clearTimeout(timer); timer = null; if (shown){ shown = false; cls(g,'on',false); } }
    }
    document.addEventListener('pointermove', function(e){ check(e.clientX,e.clientY); }, {passive:true});
    document.addEventListener('pointerdown', function(e){ check(e.clientX,e.clientY); }, {passive:true});
  })();

  /* A note in the console for anyone who opens it */
  try {
    console.log('%c0  THE FOOL', 'font-family:Cinzel,Georgia,serif;font-size:20px;color:#B39250;letter-spacing:.2em');
    console.log('%cYou opened the back of the clock to see how it works. That instinct is the whole point of this room.\nWhat else have you taken apart lately?\n\nIf you want in, write to us and mention the console.', 'font-family:Georgia,serif;font-size:13px;color:#A0957F;line-height:1.6');
  } catch(e){}

  /* Hold the seal for seven seconds: the founder's question */
  (function(){
    var b = $('footer .turn'); if (!b) return;
    var ring = svgel('svg',{'class':'holdring',viewBox:'0 0 100 100','aria-hidden':'true'});
    ring.appendChild(svgel('circle',{cx:50,cy:50,r:48,pathLength:'1'}));
    b.appendChild(ring);
    var msg = el('div','belowmsg founder'); msg.hidden = true; msg.setAttribute('role','dialog'); msg.setAttribute('aria-label',FOUNDER.eyebrow);
    msg.innerHTML = '<div class="bm-in"><p class="bm-latin"></p><p class="bm-line"></p><p class="bm-sign"></p><p class="bm-row"><button type="button" class="again">Close</button></p></div>';
    $('.bm-latin',msg).textContent = FOUNDER.eyebrow; $('.bm-line',msg).textContent = FOUNDER.question; $('.bm-sign',msg).textContent = '— ' + FOUNDER.sign;
    document.body.appendChild(msg);
    $('.again',msg).addEventListener('click', function(){ msg.hidden = true; b.focus(); });
    document.addEventListener('keydown', function(e){ if (e.key==='Escape') msg.hidden = true; });
    var timer=null, start=0;
    b.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    b.addEventListener('pointerdown', function(e){
      if (e.button && e.button !== 0) return;
      start = Date.now(); b.classList.add('holding');
      timer = setTimeout(function(){ b.classList.remove('holding'); b.dataset.suppress = '1'; msg.hidden = false; $('.again',msg).focus(); timer = null; }, 7000);
    });
    function stop(){
      if (!start) return;
      var held = Date.now() - start; start = 0;
      b.classList.remove('holding');
      if (timer){ clearTimeout(timer); timer = null; if (held > 600) b.dataset.suppress = '1'; }
    }
    b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop); b.addEventListener('pointercancel', stop);
  })();
})();

/* Say it without "is" */
(function(){
  var box = document.getElementById('noris'); if (!box) return;
  function $(q){ return box.querySelector(q); }
  var BE = /\b(?:is|isn['’]t|are|aren['’]t|was|wasn['’]t|were|weren['’]t|am|be|been|being|(?:he|she|it|that|there|what|who|here|this)['’]s|\w+['’](?:re|m))\b/gi;
  function esc(t){ return t.replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function mark(t){ var n = 0; var html = esc(t).replace(/\b(?:is|isn(?:'|&#39;|’)t|are|aren(?:'|’)t|was|wasn(?:'|’)t|were|weren(?:'|’)t|am|be|been|being|(?:he|she|it|that|there|what|who|here|this)(?:'|’)s|\w+(?:'|’)(?:re|m))\b/gi, function(m){ n++; return '<mark>' + m + '</mark>'; }); return {html:html, n:n}; }
  var a = $('#noris-a'), b = $('#noris-b'), s1 = $('.s1'), s2 = $('.s2'), s3 = $('.s3'), nudge = $('.nudge'), ex = 0;
  $('#noris-find').addEventListener('click', function(){
    var t = a.value.trim(); if (!t){ a.focus(); return; }
    var m = mark(t);
    $('.said').innerHTML = m.html;
    $('.hint-line').textContent = m.n
      ? (m.n === 1 ? 'There it is. That one word turns a moment into who someone is.' : 'There they are. Each one turns a moment into who someone is.')
      : 'No “is” in that one. Look for a word doing the same job, like “always,” “never” or a label.';
    s1.hidden = true; s2.hidden = false; nudge.textContent = ''; b.value = ''; b.focus();
  });
  $('#noris-ex').addEventListener('click', function(){
    var e = NORIS_EXAMPLES[ex++ % NORIS_EXAMPLES.length];
    nudge.innerHTML = 'For example: “' + esc(e[0]) + '” becomes “' + esc(e[1]) + '”';
  });
  $('#noris-done').addEventListener('click', function(){
    var t = b.value.trim(); if (!t){ b.focus(); return; }
    var m = mark(t);
    if (m.n){ nudge.innerHTML = 'Still one in there: ' + m.html; return; }
    $('.before').textContent = a.value.trim(); $('.after').textContent = t;
    s2.hidden = true; s3.hidden = false; $('#noris-again').focus();
  });
  $('#noris-again').addEventListener('click', function(){ a.value = ''; b.value = ''; s3.hidden = true; s1.hidden = false; a.focus(); });
})();

/* Explore: reveal the rest of the home page; open automatically for #links into it */
(function(){
  var btn = document.getElementById('explore'), more = document.getElementById('more');
  if (!btn || !more) return;
  function open(scroll){
    if (more.hidden){
      more.hidden = false; more.classList.add('open');
      btn.setAttribute('aria-expanded','true'); btn.parentNode.hidden = true;
    }
    if (scroll) more.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function fromHash(){
    var id = location.hash.slice(1); if (!id) return;
    var t = document.getElementById(id);
    if (t && more.contains(t)){ open(false); setTimeout(function(){ t.scrollIntoView(); }, 0); }
  }
  btn.addEventListener('click', function(){ open(true); });
  window.addEventListener('hashchange', fromHash);
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="#"]'); if (!a) return;
    var u = new URL(a.href, location.href);
    if (u.pathname === location.pathname && u.hash && u.hash === location.hash) fromHash();
  });
  fromHash();
})();
