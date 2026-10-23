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

// One more why (The Fool). One opening is picked at random; the follow-ups go deeper in order.
var WHY_OPENINGS = [
  "What’s something you believe that most people around you don’t?",
  "What’s a choice you’ve made that you’d defend to anyone?",
  "What’s something you’re sure of about the world?"
];
var WHY_FOLLOWUPS = [
  "Why do you believe that?",
  "Where did that come from?",
  "What would it cost you if it turned out to be wrong?"
];
// As above, so below: the secret message found by turning the page over (footer seal).
var BELOW = {
  line: "And that which is below is like that which is above.",
  body: "You turned the world over to see what was underneath. Most people never do. Nothing here has changed. You’re only seeing it from the other side, and that is the whole idea.",
  question: "If the world outside is a mirror of the world inside, what is yours showing you?"
};

var WHY_END = "That’s the one worth saying out loud, to people who’ll listen to all of it.";

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

  /* One more why */
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
    b.addEventListener('click', turn);
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
