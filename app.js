/* Translate & Listen — browser-only French → English application.
 * Translation: MyMemory public API; audio: Web Speech API. No private keys.
 * All external text inserted as text nodes to avoid cross-site scripting.
 */
(() => {
'use strict';

const SAMPLE = [
  ['Le Canada est un pays vaste et diversifié.', 'Canada is a vast and diverse country.'],
  ['Il est connu pour ses magnifiques paysages naturels, ses habitants accueillants et sa grande qualité de vie.', 'It is known for its magnificent natural landscapes, its welcoming people, and its high quality of life.'],
  ['Il compte dix provinces et trois territoires.', 'It has ten provinces and three territories.'],
  ['Sa population vient de nombreuses cultures différentes.', 'Its population comes from many different cultures.'],
  ['Le Canada est souvent reconnu pour son engagement envers l’inclusion, le multiculturalisme et la protection de l’environnement.', 'Canada is often recognized for its commitment to inclusion, multiculturalism, and protecting the environment.']
];
const CONVERSATION = [
  ['Camille : Bonjour ! Tu as des projets pour ce week-end ?', 'Camille: Hello! Do you have any plans for this weekend?'],
  ['Lucas : Oui, je voudrais visiter un petit village près de la montagne.', 'Lucas: Yes, I would like to visit a small village near the mountain.'],
  ['Camille : C’est une bonne idée. Est-ce que je peux venir avec toi ?', 'Camille: That is a good idea. Can I come with you?'],
  ['Lucas : Bien sûr ! Nous pourrions partir samedi matin.', 'Lucas: Of course! We could leave on Saturday morning.'],
  ['Camille : Parfait ! Je vais préparer quelque chose à manger pour le voyage.', 'Camille: Perfect! I will prepare something to eat for the trip.']
];
const DICT = {
  le:['the','definite article','Used before a masculine singular noun.'],la:['the','definite article','Used before a feminine singular noun.'],les:['the','definite article','Plural form of “the”.'],un:['a / one','article','Masculine singular indefinite article.'],une:['a / one','article','Feminine singular indefinite article.'],des:['some','article','Often marks an indefinite plural.'],est:['is','verb','Form of être (to be), third-person singular, present tense.'],sont:['are','verb','Form of être (to be), third-person plural.'],et:['and','conjunction','Connects words or ideas.'],ou:['or','conjunction','Introduces an alternative.'],mais:['but','conjunction','Introduces a contrast.'],pour:['for / to','preposition','Meaning depends on the phrase.'],avec:['with','preposition','Shows accompaniment.'],sans:['without','preposition','Shows absence.'],dans:['in / inside','preposition','Indicates a place or situation.'],sur:['on / about','preposition','Can express location or subject.'],près:['near','adverb / preposition','Often used as “près de” (near).'],sous:['under','preposition','Indicates position.'],de:['of / from','preposition','A very common French preposition.'],du:['of the / some','contraction','Combination of de + le.'],au:['to the / at the','contraction','Combination of à + le.'],aux:['to the / at the','contraction','Combination of à + les.'],à:['at / to','preposition','Used with places, times, and indirect objects.'],il:['he / it','pronoun','Masculine third-person subject.'],elle:['she / it','pronoun','Feminine third-person subject.'],ils:['they','pronoun','Masculine or mixed-gender plural.'],elles:['they','pronoun','Feminine plural.'],je:['I','pronoun','First-person singular subject.'],tu:['you','pronoun','Informal singular subject.'],vous:['you','pronoun','Formal singular or plural subject.'],nous:['we','pronoun','First-person plural subject.'],ce:['this / that / it','determiner / pronoun','Context determines the role.'],cette:['this / that','determiner','Feminine singular.'],ces:['these / those','determiner','Plural.'],"c'est":['it is / that is','expression','Contraction of ce + est.'],que:['that / which','conjunction / pronoun','Introduces many types of clauses.'],qui:['who / which','pronoun','Used as a relative or question word.'],où:['where','adverb','Used for place or time.'],quand:['when','adverb','Question word and conjunction.'],comment:['how','adverb','Asks about manner.'],pourquoi:['why','adverb','Asks for the reason.'],bonjour:['hello / good morning','greeting','Standard greeting during the day.'],bonsoir:['good evening','greeting','Used in the evening.'],merci:['thank you','expression','A common way to express gratitude.'],oui:['yes','adverb','Affirmative answer.'],non:['no','adverb','Negative answer.'],bien:['well / good','adverb','A frequent adverb.'],très:['very','adverb','Used for emphasis.'],plus:['more','adverb','May be pronounced differently in various contexts.'],moins:['less','adverb','Used for comparisons.'],souvent:['often','adverb','Indicates frequency.'],toujours:['always / still','adverb','Meaning depends on context.'],jamais:['never / ever','adverb','Often follows “ne” in negatives.'],"aujourd'hui":['today','adverb','Means the current day.'],demain:['tomorrow','adverb','The day after today.'],hier:['yesterday','adverb','The day before today.'],matin:['morning','noun','Masculine noun: le matin.'],soir:['evening','noun','Masculine noun: le soir.'],semaine:['week','noun','Feminine noun: la semaine.'],jour:['day','noun','Masculine noun: le jour.'],temps:['time / weather','noun','Masculine noun with several meanings.'],maison:['house / home','noun','Feminine noun: la maison.'],ville:['city / town','noun','Feminine noun: la ville.'],pays:['country','noun','Masculine noun: le pays.'],canada:['Canada','proper noun','A country in North America.'],vaste:['vast / extensive','adjective','Describes something very large in size or scope.'],diversifié:['diversified / diverse','adjective','Masculine form; feminine: diversifiée.'],diversifiée:['diversified / diverse','adjective','Feminine form of diversifié.'],connu:['known','adjective / past participle','From connaître (to know).'],connue:['known','adjective / past participle','Feminine form of connu.'],magnifiques:['magnificent / beautiful','adjective','Plural of magnifique.'],paysages:['landscapes / scenery','noun','Plural of le paysage.'],naturels:['natural','adjective','Masculine plural of naturel.'],habitants:['inhabitants / residents','noun','People who live in a place.'],accueillants:['welcoming / friendly','adjective','Masculine plural of accueillant.'],grande:['great / big / high','adjective','Feminine form of grand.'],qualité:['quality','noun','Feminine noun: la qualité.'],vie:['life','noun','Feminine noun: la vie.'],compte:['has / counts','verb','From compter; “il compte” can mean “it has”.'],dix:['ten','number','The number 10.'],provinces:['provinces','noun','Plural of province.'],trois:['three','number','The number 3.'],territoires:['territories','noun','Plural of territoire.'],population:['population','noun','Feminine noun: la population.'],vient:['comes','verb','From venir, third-person singular present.'],nombreuses:['numerous / many','adjective','Feminine plural form.'],cultures:['cultures','noun','Plural of culture.'],différentes:['different','adjective','Feminine plural of différent.'],reconnu:['recognized','past participle','From reconnaître.'],engagement:['commitment','noun','Masculine noun: l’engagement.'],envers:['toward / towards','preposition','Often expresses responsibility or attitude.'],inclusion:['inclusion','noun','Feminine noun: l’inclusion.'],multiculturalisme:['multiculturalism','noun','Masculine noun.'],protection:['protection','noun','Feminine noun.'],environnement:['environment','noun','Masculine noun: l’environnement.'],bonjour:['hello','greeting','Friendly standard greeting.'],voudrais:['would like','verb','Conditional form of vouloir (to want).'],visiter:['to visit','verb','Infinitive.'],petit:['small / little','adjective','Masculine singular form.'],village:['village','noun','Masculine noun.'],montagne:['mountain','noun','Feminine noun.'],bonne:['good','adjective','Feminine of bon.'],idée:['idea','noun','Feminine noun.'],peux:['can','verb','From pouvoir.'],venir:['to come','verb','Infinitive.'],bien:['well / indeed','adverb','In “bien sûr”: of course.'],sûr:['sure / certain','adjective','In “bien sûr”: of course.'],pourrions:['could','verb','Conditional, first-person plural, from pouvoir.'],partir:['to leave','verb','Infinitive.'],samedi:['Saturday','noun','Day of the week.'],parfait:['perfect','adjective','Masculine form.'],vais:['am going to','verb','From aller.'],préparer:['to prepare','verb','Infinitive.'],quelque:['some / something','determiner','In “quelque chose”: something.'],chose:['thing','noun','Feminine noun.'],manger:['to eat','verb','Infinitive.'],voyage:['trip / journey','noun','Masculine noun.']
};
const el = id => document.getElementById(id);
const UI = Object.fromEntries(['sourceInput','charCount','translateBtn','translateBtnText','status','frenchText','englishText','sentenceRows','mainPlayBtn','timeLabel','seekInput','listenSelect','volumeInput','speedInput','speedLabel','voiceSelect','wordPopup','wordTitle','wordMeaning','wordExtra','wordExampleFrom','wordExampleTo','wordSpeakBtn','modalBackdrop','modalTitle','modalContent','connectionTag','fileInput','draftLabel','wordTipCheck','highlightCheck','bilingualCheck','sentenceCard','textColumns'].map(id=>[id,el(id)]));
const KEYS = {draft:'tl_fr_en_draft_v1',settings:'tl_fr_en_settings_v1',cache:'tl_fr_en_cache_v1',history:'tl_fr_en_history_v1'};
const getJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const setJson = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
const copyText = async (s) => { if(!s) throw Error('Nothing to copy yet.'); if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(s); const t=document.createElement('textarea');t.value=s;document.body.append(t);t.select();let ok=document.execCommand('copy');t.remove();if(!ok) throw Error('Select and copy the text manually.'); };
const escapeHtml = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = w => w.toLocaleLowerCase('fr').replace(/^['’\-]+|['’\-]+$/g,'');
const originalSample = SAMPLE.map(x=>x[0]).join(' ');
const state = {
  segments: SAMPLE.map(([fr,en])=>({fr,en})),
  original: originalSample, translationReady:true, isSample:true, conversation:false,
  side:'fr', playing:false, paused:false, current:0, activeWord:-1,
  token:0, req:0, timer:null, elapsed:0, startedAt:0, activeUtterance:null,
  wordToken:0, lookup:{}, lastWord:null,
  voices:[], settings:getJson(KEYS.settings,{dark:false,highlight:true,bilingual:true,wordTips:true,rate:1,volume:1,side:'fr',voiceFr:'',voiceEn:''}),
  cache:getJson(KEYS.cache,{}), history:getJson(KEYS.history,[])
};
const fmtTime = sec => `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}`;
const words = text => (String(text).match(/[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*/gu)||[]).length;
const est = (text, rate=state.settings.rate) => Math.max(.85,words(text)/(2.25*rate)+.3);
const totalSeconds = () => state.segments.reduce((a,s)=>a+est(s[state.side]),0);
const completedSeconds = () => state.segments.slice(0,state.current).reduce((a,s)=>a+est(s[state.side]),0);
const friendly = e => (e instanceof Error ? e.message : String(e));

function report(s, type=''){UI.status.textContent=s; UI.status.className='status-text '+type;}
function toast(s, type=''){report(s,type);}
function setBusy(b){UI.translateBtn.disabled=b;UI.translateBtnText.textContent=b?'Translating French…':'Translate & Generate Audio';}
function countChars(){UI.charCount.textContent=`${UI.sourceInput.value.length.toLocaleString()} / 12,000`;}
function segmentText(text){
  const parts=[];
  for(const line of text.replace(/\r/g,'').split(/\n+/)){
    const clean=line.trim();if(!clean)continue;
    let sentences;
    try{sentences=Array.from(new Intl.Segmenter('fr',{granularity:'sentence'}).segment(clean),p=>p.segment.trim());}
    catch{sentences=clean.match(/[^.!?…]+[.!?…]*/g)||[clean];}
    for(let item of sentences){if(!item.trim())continue;
      let buffer='';
      for(const word of item.trim().split(/\s+/)){
        const next=buffer?buffer+' '+word:word;
        if(new TextEncoder().encode(next).length>420 && buffer){parts.push(buffer);buffer=word;}
        else buffer=next;
        if(new TextEncoder().encode(buffer).length>480){
          // Handle unusually long unbroken words; splitting preserves all characters.
          let unit='';for(const char of buffer){if(new TextEncoder().encode(unit+char).length>420){parts.push(unit);unit=char;}else unit+=char;}buffer=unit;
        }
      }
      if(buffer)parts.push(buffer);
    }
  }
  return parts;
}
function seedSampleCache(){
  for(const rows of [SAMPLE,CONVERSATION]) for(const [fr,en] of rows) if(!state.cache['fr|en|'+fr])state.cache['fr|en|'+fr]=en;
  // No saved state is modified until an actual request or user change.
}
function trimCache(){const entries=Object.entries(state.cache);if(entries.length>350)state.cache=Object.fromEntries(entries.slice(-300));setJson(KEYS.cache,state.cache);}
function decodeEntities(value){const doc=new DOMParser().parseFromString(String(value),'text/html');return doc.body.textContent||String(value);}
async function translateRemote(phrase, from='fr', to='en', signal){
  const cacheKey=from+'|'+to+'|'+phrase;
  if(state.cache[cacheKey])return state.cache[cacheKey];
  const u=new URL('https://api.mymemory.translated.net/get');u.search=new URLSearchParams({q:phrase,langpair:`${from}|${to}`}).toString();
  let response;
  try {response=await fetch(u.toString(),{method:'GET',signal,headers:{'Accept':'application/json'}});}
  catch(e){if(e?.name==='AbortError')throw e;throw Error('Cannot reach the translation service. Check your internet connection and try again.');}
  if(!response.ok)throw Error(`Translation server responded ${response.status}. Try again later.`);
  let data;try{data=await response.json();}catch{throw Error('The translation service returned an invalid response.');}
  if(Number(data.responseStatus)!==200 || !data.responseData?.translatedText){
    throw Error(data.responseDetails || 'Translation service limit reached or translation unavailable.');
  }
  const translated=decodeEntities(data.responseData.translatedText).trim();
  if(!translated)throw Error('No translation was returned.');
  state.cache[cacheKey]=translated; trimCache();
  return translated;
}
let controller=null;
function cancelPending(){if(controller){controller.abort();controller=null;}state.req++;setBusy(false);}
async function translateNow(){
  const raw=UI.sourceInput.value.trim();if(!raw){report('Add French text before translating.','bad');UI.sourceInput.focus();return;}
  const parts=segmentText(raw);if(!parts.length){report('Enter French words or sentences to translate.','bad');return;}
  if(controller)controller.abort();controller=new AbortController();const signal=controller.signal,req=++state.req;
  stopSpeech();hideWord();setBusy(true);report(`Translating ${parts.length} sentence${parts.length!==1?'s':''}…`);
  const results=Array(parts.length);let done=0;let cursor=0;
  async function worker(){while(cursor<parts.length){let idx=cursor++;let translation=await translateRemote(parts[idx],'fr','en',signal);if(req!==state.req)return;results[idx]=translation;done++;report(`Translated ${done} of ${parts.length} · ready for audio after translation.`);}}
  try{
    await Promise.all(Array.from({length:Math.min(2,parts.length)},()=>worker()));
    if(req!==state.req)return;
    state.segments=parts.map((fr,i)=>({fr,en:results[i]}));state.original=raw;state.translationReady=true;state.isSample=false;
    renderAll();UI.draftLabel.textContent='';persistHistory();report(`Translated ${parts.length} sentence${parts.length===1?'':'s'}! Tap ▶ to listen.`, 'good');
  }catch(e){if(e?.name!=='AbortError')report(`Translation failed: ${friendly(e)} Previously translated text is preserved.`,'bad');}
  finally{if(req===state.req)setBusy(false);}
}
function renderWordText(text,side,index,container){
  container.textContent='';const r=/[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*|\d+(?:[.,]\d+)*/gu;let prev=0,widx=0;
  for(const m of text.matchAll(r)){
    if(m.index>prev)container.append(document.createTextNode(text.slice(prev,m.index)));
    const b=document.createElement('button');b.type='button';b.className='word';b.textContent=m[0];
    b.dataset.side=side;b.dataset.row=index;b.dataset.word=widx++;b.dataset.char=m.index;
    b.title=state.settings.wordTips?getShortHint(m[0],side):'Tap to hear or translate this word';
    b.addEventListener('click',ev=>showWord(ev,b));container.append(b);prev=m.index+m[0].length;
  }
  if(prev<text.length)container.append(document.createTextNode(text.slice(prev)));
}
function getShortHint(word,side){const d=side==='fr'?DICT[normalize(word)]:null;return d?`${word} → ${d[0]} · Tap for context`:'Tap for meaning and context';}
function renderPanels(){
  for(const side of ['fr','en']){
    const target=side==='fr'?UI.frenchText:UI.englishText;target.replaceChildren();
    if(!state.segments.length){let span=document.createElement('span');span.className='empty-text';span.textContent=side==='fr'?'Your French text will appear here.':'Your English translation will appear here.';target.append(span);continue;}
    state.segments.forEach((segment,index)=>{const s=document.createElement('span');s.className='line-text';s.dataset.row=index;s.dataset.side=side;renderWordText(segment[side],side,index,s);target.append(s,document.createTextNode(index===state.segments.length-1?'':' '));});
  }
}
function renderSentences(){UI.sentenceRows.replaceChildren();UI.sentenceCard.style.display=state.settings.bilingual?'':'none';
  if(!state.segments.length){const div=document.createElement('div');div.className='sentence-placeholder';div.textContent='Translate French text to see aligned sentences here.';UI.sentenceRows.append(div);return;}
  state.segments.forEach((pair,index)=>{const row=document.createElement('div');row.className='sentence-row';row.dataset.row=index;
    for(const side of ['fr','en']){const col=document.createElement('div');col.className='sentence-side';col.dataset.side=side;renderWordText(pair[side],side,index,col);row.append(col);}UI.sentenceRows.append(row);
  });
}
function clearHighlights(){document.querySelectorAll('.line-text.active,.sentence-row.active,.word.active-word').forEach(n=>n.classList.remove('active','active-word'));state.activeWord=-1;}
function highlightRow(index){document.querySelectorAll('.line-text.active,.sentence-row.active').forEach(n=>n.classList.remove('active'));
  if(!state.settings.highlight)return;
  document.querySelectorAll(`.line-text[data-row="${index}"],.sentence-row[data-row="${index}"]`).forEach(n=>n.classList.add('active'));
  const row=UI.sentenceRows.querySelector(`.sentence-row[data-row="${index}"]`);
  if(row && row.getBoundingClientRect().bottom>window.innerHeight-24 && window.innerWidth>830)row.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function highlightWord(charIndex){
  document.querySelectorAll('.word.active-word').forEach(n=>n.classList.remove('active-word'));
  if(!state.settings.highlight)return;
  const side=state.side;const container=side==='fr'?UI.frenchText:UI.englishText;
  const list=[...container.querySelectorAll(`.line-text[data-row="${state.current}"] .word`)];
  if(!list.length)return;
  let matched=list.find((b,i)=>Number(b.dataset.char)<=charIndex && (i===list.length-1||Number(list[i+1].dataset.char)>charIndex));
  if(!matched)return;
  document.querySelectorAll(`.word[data-side="${side}"][data-row="${state.current}"][data-word="${matched.dataset.word}"]`).forEach(b=>b.classList.add('active-word'));
}
function renderAll(){renderPanels();renderSentences();updateTime();clearHighlights();}
function updateTime(){const total=totalSeconds();const played=state.playing?(completedSeconds()+Math.max(0,(Date.now()-state.startedAt)/1000)):state.paused?completedSeconds():0;
  UI.timeLabel.textContent=`${fmtTime(Math.min(total,played))} / ~${fmtTime(total)}`;
  UI.seekInput.value=total?Math.round(100*Math.min(1,played/total)):0;
  UI.mainPlayBtn.textContent=state.playing?'❚❚':'▶';UI.mainPlayBtn.title=state.playing?'Pause audio':state.paused?'Resume from current sentence':'Play audio';
}
function chosenVoice(lang,alternation=0){const matching=state.voices.filter(v=>v.lang.toLowerCase().startsWith(lang));
  const selected=lang==='fr'?state.settings.voiceFr:state.settings.voiceEn;
  let choice=matching.find(v=>v.voiceURI===selected)||matching[0]||null;
  if(alternation%2&&matching.length>1)choice=matching.find(v=>v!==choice)||choice;
  return choice;
}
function refreshVoices(){if(!('speechSynthesis' in window))return;state.voices=speechSynthesis.getVoices();const previous=UI.voiceSelect.value;
  UI.voiceSelect.replaceChildren();const auto=document.createElement('option');auto.value='';auto.textContent='Default French voice';UI.voiceSelect.append(auto);
  state.voices.filter(v=>v.lang.toLowerCase().startsWith('fr')).forEach(v=>{const o=document.createElement('option');o.value=v.voiceURI;o.textContent=`${v.name} (${v.lang})`;UI.voiceSelect.append(o);});
  UI.voiceSelect.value=state.settings.voiceFr||previous||'';
}
function resetTicker(){clearInterval(state.timer);state.timer=setInterval(updateTime,200);}
function stopSpeech(clear=true){state.token++;clearInterval(state.timer);state.timer=null;
  try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch{}
  state.playing=false;state.paused=false;state.activeUtterance=null;state.current=0;
  if(clear)clearHighlights();updateTime();
}
function playAt(index=0){
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){report('Your browser does not support speech synthesis. Try Safari or Chrome.','bad');return;}
  if(!state.segments.length){report('Add and translate some text first.','bad');return;}
  const cursor=Math.max(0,Math.min(index,state.segments.length-1));
  stopSpeech();const token=state.token;state.current=cursor;state.playing=true;state.paused=false;
  const next=()=>{
    if(token!==state.token||!state.playing)return;
    if(state.current>=state.segments.length){stopSpeech(false);clearHighlights();report('Finished playing.', 'good');return;}
    const sentence=state.segments[state.current][state.side];
    if(!sentence){state.current++;next();return;}
    const utter=new SpeechSynthesisUtterance(sentence);utter.lang=state.side==='fr'?'fr-FR':'en-US';utter.rate=state.settings.rate;utter.volume=state.settings.volume;
    const selected=chosenVoice(state.side,state.conversation?state.current:0);if(selected)utter.voice=selected;
    state.activeUtterance=utter;
    utter.onstart=()=>{if(token!==state.token)return;state.startedAt=Date.now();highlightRow(state.current);updateTime();};
    utter.onboundary=(event)=>{if(token!==state.token)return;if(typeof event.charIndex==='number')highlightWord(event.charIndex);};
    utter.onend=()=>{if(token!==state.token||!state.playing)return;state.current++;document.querySelectorAll('.word.active-word').forEach(n=>n.classList.remove('active-word'));next();};
    utter.onerror=event=>{if(token!==state.token)return;if(['interrupted','canceled'].includes(event.error))return;report('The device could not play this voice. Try another available voice.','bad');stopSpeech();};
    // Some engines fire `onstart` late, but playback must begin from a tap.
    state.startedAt=Date.now();highlightRow(state.current);try{speechSynthesis.speak(utter);}catch(e){stopSpeech();report('Speech playback failed: '+friendly(e),'bad');}
  };
  resetTicker();next();
}
function togglePlayback(){if(state.playing){const idx=state.current;stopSpeech(false);state.current=idx;state.paused=true;clearHighlights();updateTime();report('Paused. Play restarts the current sentence.');}
  else playAt(state.paused?state.current:0);
}
function playWordOnly(word,side){
  if(!('speechSynthesis' in window))return report('Speech not available in this browser.','bad');
  // A word pronunciation interrupts a passage, like tapping a dictionary speaker.
  stopSpeech();const u=new SpeechSynthesisUtterance(word);u.lang=side==='fr'?'fr-FR':'en-US';u.rate=Math.max(.7,state.settings.rate*.85);u.volume=state.settings.volume;u.voice=chosenVoice(side);
  try{speechSynthesis.speak(u);}catch{report('Could not pronounce the selected word.','bad');}
}
function hideWord(){UI.wordPopup.hidden=true;state.wordToken++;state.lastWord=null;}
async function showWord(ev,button){
  if(!state.settings.wordTips)return;
  const row=Number(button.dataset.row),side=button.dataset.side,word=button.textContent;
  const pair=state.segments[row];if(!pair)return;
  state.lastWord={word,side,row};const id=++state.wordToken;
  UI.wordPopup.hidden=false;UI.wordTitle.textContent=word;UI.wordMeaning.textContent='Looking up meaning…';UI.wordExtra.textContent=side==='fr'?'French → English':'English → French';
  UI.wordExampleFrom.textContent=pair.fr;UI.wordExampleTo.textContent=pair.en;
  const rect=button.getBoundingClientRect();const width=Math.min(325,window.innerWidth-24);const margin=12;
  const left=Math.max(margin,Math.min(rect.left-20,innerWidth-width-margin));
  UI.wordPopup.style.left=left+'px';UI.wordPopup.style.top='12px';
  const height=UI.wordPopup.getBoundingClientRect().height;
  const top=(rect.bottom+height+12<innerHeight)?rect.bottom+8:Math.max(12,rect.top-height-8);
  UI.wordPopup.style.top=Math.min(Math.max(12,top),innerHeight-height-12)+'px';
  const known=side==='fr'?DICT[normalize(word)]:null;
  if(known){UI.wordMeaning.textContent=`${known[0]}`;UI.wordExtra.textContent=`${known[1]} · ${known[2]}`;return;}
  const localKey=`${side}:${normalize(word)}`;
  if(state.lookup[localKey]){UI.wordMeaning.textContent=state.lookup[localKey];UI.wordExtra.textContent='Individual word translation; sentence context appears below.';return;}
  try{const translated=await translateRemote(word,side,side==='fr'?'en':'fr');if(id!==state.wordToken)return;
    state.lookup[localKey]=translated;UI.wordMeaning.textContent=translated;UI.wordExtra.textContent='Word translation is approximate. Meaning may change in this sentence.';
  }catch(e){if(id!==state.wordToken)return;UI.wordMeaning.textContent='Meaning temporarily unavailable';UI.wordExtra.textContent=friendly(e)+' The full translated sentence below can help.';}
}
function closeModal(){UI.modalBackdrop.hidden=true;UI.modalContent.replaceChildren();document.querySelectorAll('[data-nav]').forEach(n=>n.classList.toggle('is-active',n.dataset.nav==='translate'));}
function openModal(title,html,initialize){hideWord();UI.modalTitle.textContent=title;UI.modalContent.innerHTML=html;UI.modalBackdrop.hidden=false;initialize?.(UI.modalContent);}
function noHtmlText(text){return escapeHtml(text).replace(/\n/g,' ');}
function modalDocuments(){openModal('Documents',`<span class="pill">Import & export</span><p>Open a French file, translate it, and listen sentence by sentence. TXT works offline; PDF and DOCX import require an internet connection to load their document readers.</p><div class="button-row"><button class="modal-btn primary-modal" id="chooseDoc">Import French file</button><button class="modal-btn" id="downloadDoc">Download bilingual TXT</button><button class="modal-btn" id="downloadEn">Download English TXT</button></div><p class="helper">Supported: .txt, .md, .csv, .pdf (selectable text), .docx. Scanned-image PDFs require OCR, which is not built in.</p>`,root=>{
  root.querySelector('#chooseDoc').onclick=()=>UI.fileInput.click();root.querySelector('#downloadDoc').onclick=()=>downloadTranscript('both');root.querySelector('#downloadEn').onclick=()=>downloadTranscript('en');});}
function modalConversation(){openModal('Conversation mode',`<span class="pill">French dialogues</span><p>Paste French dialogue lines with speaker names, such as <strong>Camille :</strong> and <strong>Lucas :</strong>. Translate into English, then listen. When the device has two French voices, the app alternates voices between sentences.</p><div class="button-row"><button class="modal-btn primary-modal" id="loadConversation">Load example conversation</button><button class="modal-btn" id="keepConversation">Use my current text as conversation</button></div><p class="helper">To write a custom conversation, close this window, type the lines into Input, and press Translate.</p>`,root=>{
   root.querySelector('#loadConversation').onclick=()=>{cancelPending();stopSpeech();state.segments=CONVERSATION.map(([fr,en])=>({fr,en}));state.original=CONVERSATION.map(a=>a[0]).join('\n');state.conversation=true;state.isSample=true;state.translationReady=true;UI.sourceInput.value=state.original;countChars();setJson(KEYS.draft,state.original);renderAll();UI.draftLabel.textContent='';closeModal();report('Example conversation loaded. Tap ▶ to listen.','good');};
   root.querySelector('#keepConversation').onclick=()=>{state.conversation=true;closeModal();report('Conversation mode enabled. Add dialogue lines and translate.','good');};});}
function modalHistory(){const history=state.history;
  openModal('Local translation history',`<p>Your saved translations stay in this browser on this device. Nothing is uploaded to a user account.</p><div id="historyList">${history.length?history.map((h,i)=>`<div class="history-item"><div><strong>${noHtmlText((h.fr||'Untitled').slice(0,75))}${h.fr?.length>75?'…':''}</strong><p>${noHtmlText(new Date(h.date).toLocaleString())} · ${h.segments.length} sentence(s)</p></div><div class="history-actions"><button class="modal-btn" data-load="${i}">Open</button><button class="modal-btn" data-delete="${i}">×</button></div></div>`).join(''):'<p>No saved translations yet. Translate a passage or select Save.</p>'}</div><div class="button-row"><button class="modal-btn" id="clearHistory">Clear history</button></div>`,root=>{
    root.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{const h=state.history[Number(b.dataset.load)];if(!h)return;cancelPending();stopSpeech();state.segments=h.segments;state.original=h.fr;state.translationReady=true;state.isSample=false;state.conversation=!!h.conversation;UI.sourceInput.value=h.fr;countChars();setJson(KEYS.draft,h.fr);renderAll();closeModal();report('Loaded a saved passage.','good');});
    root.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{state.history.splice(Number(b.dataset.delete),1);setJson(KEYS.history,state.history);modalHistory();});
    root.querySelector('#clearHistory').onclick=()=>{if(confirm('Clear all locally saved translations?')){state.history=[];setJson(KEYS.history,[]);modalHistory();}};
  });
}
function modalSettings(){openModal('Settings',`<span class="pill">French → English only</span><h3>Playback</h3><p>Choose your iPad or Windows system voice and adjust the speed in the left panel. Voices and availability depend on your device.</p><label class="inline-check"><input id="settingDark" type="checkbox" ${state.settings.dark?'checked':''}> Dark mode</label><label class="inline-check"><input id="settingTips" type="checkbox" ${state.settings.wordTips?'checked':''}> Show word explanations</label><label class="inline-check"><input id="settingHighlight" type="checkbox" ${state.settings.highlight?'checked':''}> Highlight the speaking sentence and word when supported</label><label class="inline-check"><input id="settingBilingual" type="checkbox" ${state.settings.bilingual?'checked':''}> Show bilingual sentence view</label><h3>Translation service</h3><p>This edition uses the public MyMemory French-English translation API. No account or key is needed. New text and clicked unknown words are sent to that service; daily limits, availability, and translation quality are outside this app’s control.</p><p class="helper">No API keys, microphone permission, or login are needed. Speech is created by your device; this version does not export MP3 files.</p>`,root=>{
  const defs=[['settingDark','dark'],['settingTips','wordTips'],['settingHighlight','highlight'],['settingBilingual','bilingual']];defs.forEach(([id,key])=>root.querySelector('#'+id).onchange=e=>{state.settings[key]=e.target.checked;applySettings();});});}
function modalHelp(){openModal('How to use Translate & Listen',`<span class="pill">iPad & Windows</span><p><strong>1.</strong> Enter French text or import a file. Press <strong>Translate & Generate Audio</strong>.</p><p><strong>2.</strong> Press the round blue Play button to hear French. Change the player language to English if you want to listen to the translation instead.</p><p><strong>3.</strong> Tap any French or English word. You’ll get its meaning, a pronunciation button, and the French/English sentences for context.</p><p><strong>4.</strong> Speech highlights the current sentence on both sides. Word highlighting follows the exact word when your device sends speech boundary events.</p><p><strong>5.</strong> Use <strong>History</strong> to reopen your sessions and <strong>Export TXT</strong> to save the transcript.</p><h3>Important details</h3><p>New translations and unknown-word lookups need the internet and a third-party API. Reading, local history, and system speech can work without internet on a previously loaded passage. Install on iPad using Safari → Share → Add to Home Screen once the app is hosted on HTTPS (e.g., GitHub Pages).</p><p>The Web tab can only import sites that permit cross-origin reading; most news websites block direct imports. Copy and paste their text instead.</p>`);}
function applySettings(){document.body.classList.toggle('dark',!!state.settings.dark);UI.wordTipCheck.checked=!!state.settings.wordTips;UI.highlightCheck.checked=!!state.settings.highlight;UI.bilingualCheck.checked=!!state.settings.bilingual;
  UI.speedInput.value=state.settings.rate;UI.speedLabel.textContent=Number(state.settings.rate).toFixed(1)+'×';UI.volumeInput.value=state.settings.volume;UI.listenSelect.value=state.settings.side;
  state.side=state.settings.side;setJson(KEYS.settings,state.settings);renderAll();}
function persistHistory(){if(!state.segments.length)return;
  const h={fr:state.original,segments:state.segments.map(s=>({...s})),date:new Date().toISOString(),conversation:state.conversation};
  state.history=state.history.filter(x=>x.fr!==h.fr);state.history.unshift(h);state.history=state.history.slice(0,20);setJson(KEYS.history,state.history);
}
function saveNow(){if(!state.segments.length)return report('Nothing to save yet.','bad');persistHistory();report('Saved to local history on this device.','good');}
function downloadBlob(content,filename,mime='text/plain;charset=utf-8'){const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function downloadTranscript(mode='both'){
  if(!state.segments.length)return report('Nothing to download yet.','bad');
  let content='';if(mode==='both')content='TRANSLATE & LISTEN — FRENCH → ENGLISH\n\n'+state.segments.map((s,i)=>`${i+1}. FR: ${s.fr}\n   EN: ${s.en}`).join('\n\n');
  else content=state.segments.map(s=>s[mode]).join('\n');
  downloadBlob(content,'translate-listen-'+mode+'.txt');report('TXT file prepared.','good');
}
async function readFile(file){
  if(!file)return;cancelPending();closeModal();stopSpeech();report('Reading '+file.name+'…');
  const ext=file.name.split('.').pop().toLowerCase();
  let text='';
  try{
    if(['txt','md','csv','text'].includes(ext)||file.type==='text/plain'){text=await file.text();}
    else if(ext==='pdf'){
      const pdfjs=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
      const pages=[];for(let i=1;i<=Math.min(75,pdf.numPages);i++){
        const page=await pdf.getPage(i),items=(await page.getTextContent()).items;
        pages.push(items.map(t=>t.str).join(' '));
      }
      text=pages.join('\n');
    }else if(ext==='docx'){
      if(!window.mammoth){await new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/mammoth@1.9.0/mammoth.browser.min.js';sc.onload=res;sc.onerror=()=>rej(Error('DOCX reader could not load. Internet required.'));document.head.append(sc);});}
      const result=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});text=result.value;
    }else throw Error('Unsupported file type. Use TXT, PDF, or DOCX.');
    text=text.trim();if(!text)throw Error('This file contains no selectable text. Scanned PDF images are not supported.');
    if(text.length>12000){text=text.slice(0,12000);report('Imported first 12,000 characters. Longer documents must be translated in parts.');}
    UI.sourceInput.value=text;countChars();setJson(KEYS.draft,text);state.conversation=false;report(`Imported ${file.name}. Press Translate to continue.`,'good');
    UI.sourceInput.focus();
  }catch(e){report('File import failed: '+friendly(e),'bad');}
  finally{UI.fileInput.value='';}
}
async function doWebImport(){openModal('Import text from a website',`<p>Enter a publicly accessible French page URL. Browsers block reading most third-party sites, so copying the text into the input is usually more reliable.</p><label><span class="helper">Website address</span><input id="webUrl" type="url" placeholder="https://example.com/french-article"></label><div class="button-row"><button class="modal-btn primary-modal" id="fetchPage">Try importing page</button><button class="modal-btn" id="copyAdvice">Copy/paste instead</button></div><p class="helper" id="webStatus"></p>`,root=>{
  root.querySelector('#copyAdvice').onclick=()=>{closeModal();UI.sourceInput.focus();report('Paste the French article directly into the input.','good');};
  root.querySelector('#fetchPage').onclick=async()=>{const field=root.querySelector('#webUrl'),status=root.querySelector('#webStatus');let url;
    try{url=new URL(field.value);if(url.protocol!=='https:')throw Error('Use an HTTPS address.');}
    catch{status.textContent='Enter a valid HTTPS URL.';return;}
    status.textContent='Trying to fetch page…';
    try{const response=await fetch(url.href,{mode:'cors'});if(!response.ok)throw Error('Website returned '+response.status);
      const html=await response.text();const doc=new DOMParser().parseFromString(html,'text/html');doc.querySelectorAll('script,style,nav,footer,header,aside,noscript').forEach(x=>x.remove());
      const candidates=[...doc.querySelectorAll('article p,main p,p')].map(p=>p.textContent.trim()).filter(p=>p.length>35);
      const content=candidates.join('\n').slice(0,12000);if(!content)throw Error('No readable paragraphs were found.');
      UI.sourceInput.value=content;countChars();setJson(KEYS.draft,content);closeModal();report('Imported web text. Press Translate.','good');
    }catch(e){status.textContent='Import blocked or failed: '+friendly(e)+'. Please copy/paste the text instead.';}
  };
});}
function initHandlers(){
  el('translateBtn').onclick=translateNow;el('mainPlayBtn').onclick=togglePlayback;
  el('playFrench').onclick=()=>{state.side='fr';state.settings.side='fr';UI.listenSelect.value='fr';setJson(KEYS.settings,state.settings);playAt(0);};
  el('playEnglish').onclick=()=>{state.side='en';state.settings.side='en';UI.listenSelect.value='en';setJson(KEYS.settings,state.settings);playAt(0);};
  el('copyFrench').onclick=async()=>{try{await copyText(state.segments.map(x=>x.fr).join(' '));report('Copied French text.','good');}catch(e){report(friendly(e),'bad');}};
  el('copyEnglish').onclick=async()=>{try{await copyText(state.segments.map(x=>x.en).join(' '));report('Copied English translation.','good');}catch(e){report(friendly(e),'bad');}};
  el('saveBtn').onclick=saveNow;el('exportBtn').onclick=()=>downloadTranscript('both');
  el('clearBtn').onclick=()=>{cancelPending();stopSpeech();UI.sourceInput.value='';countChars();setJson(KEYS.draft,'');state.original='';state.segments=[];state.translationReady=false;state.conversation=false;renderAll();UI.draftLabel.textContent='';report('Input cleared.');};
  el('sampleBtn').onclick=()=>{cancelPending();stopSpeech();state.segments=SAMPLE.map(([fr,en])=>({fr,en}));state.original=originalSample;state.conversation=false;state.isSample=true;state.translationReady=true;UI.sourceInput.value=originalSample;countChars();setJson(KEYS.draft,originalSample);renderAll();UI.draftLabel.textContent='';report('French example loaded. Tap any word or press ▶.','good');};
  UI.sourceInput.addEventListener('input',()=>{countChars();setJson(KEYS.draft,UI.sourceInput.value);UI.draftLabel.textContent=UI.sourceInput.value.trim()!==state.original?'· unsent changes':'';});
  UI.listenSelect.onchange=()=>{stopSpeech();state.side=UI.listenSelect.value;state.settings.side=state.side;setJson(KEYS.settings,state.settings);updateTime();};
  UI.speedInput.oninput=()=>{state.settings.rate=Number(UI.speedInput.value);UI.speedLabel.textContent=state.settings.rate.toFixed(1)+'×';setJson(KEYS.settings,state.settings);updateTime();};
  UI.volumeInput.oninput=()=>{state.settings.volume=Number(UI.volumeInput.value);setJson(KEYS.settings,state.settings);};
  UI.voiceSelect.onchange=()=>{state.settings.voiceFr=UI.voiceSelect.value;setJson(KEYS.settings,state.settings);if(state.playing)playAt(state.current);};
  UI.seekInput.onchange=()=>{const fraction=Number(UI.seekInput.value)/100,total=totalSeconds();let sum=0,idx=0;
    for(let i=0;i<state.segments.length;i++){sum+=est(state.segments[i][state.side]);if(sum>=total*fraction){idx=i;break;}}
    playAt(idx);
  };
  UI.wordTipCheck.onchange=()=>{state.settings.wordTips=UI.wordTipCheck.checked;if(!state.settings.wordTips)hideWord();applySettings();};
  UI.highlightCheck.onchange=()=>{state.settings.highlight=UI.highlightCheck.checked;applySettings();};
  UI.bilingualCheck.onchange=()=>{state.settings.bilingual=UI.bilingualCheck.checked;applySettings();};
  el('themeBtn').onclick=()=>{state.settings.dark=!state.settings.dark;applySettings();};
  el('helpBtn').onclick=modalHelp;el('modalClose').onclick=closeModal;
  UI.modalBackdrop.addEventListener('click',e=>{if(e.target===UI.modalBackdrop)closeModal();});
  el('wordCloseBtn').onclick=hideWord;UI.wordSpeakBtn.onclick=()=>{if(state.lastWord)playWordOnly(state.lastWord.word,state.lastWord.side);};
  document.addEventListener('pointerdown',e=>{if(!UI.wordPopup.hidden&&!UI.wordPopup.contains(e.target)&&!e.target.closest('.word'))hideWord();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideWord();closeModal();}});
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{switch(b.dataset.nav){case 'translate':closeModal();break;case 'documents':modalDocuments();break;case 'conversation':modalConversation();break;case 'history':modalHistory();break;case 'settings':modalSettings();break;}});
  el('textTab').onclick=()=>UI.sourceInput.focus();el('fileTab').onclick=()=>UI.fileInput.click();el('pasteTab').onclick=async()=>{try{const v=await navigator.clipboard.readText();if(!v.trim())throw Error('Clipboard is empty.');UI.sourceInput.value=v.slice(0,12000);countChars();setJson(KEYS.draft,UI.sourceInput.value);report('Pasted text. Press Translate.','good');}catch{UI.sourceInput.focus();report('Use long-press → Paste on iPad, or Ctrl+V on Windows.');}};
  el('webTab').onclick=doWebImport;UI.fileInput.onchange=e=>readFile(e.target.files?.[0]);
  el('fullBtn').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else throw Error('Fullscreen is unavailable in this browser. On iPad, use Share → Add to Home Screen.');}catch(e){report(friendly(e),'bad');}};
  window.addEventListener('online',()=>{UI.connectionTag.textContent='● Online';});window.addEventListener('offline',()=>{UI.connectionTag.textContent='● Offline: saved text and speech only';});
  window.addEventListener('beforeunload',()=>{if('speechSynthesis' in window)speechSynthesis.cancel();});
}
function init(){seedSampleCache();initHandlers();
  if(!('speechSynthesis' in window)){report('Speech playback is unavailable in this browser. Translation still works.','bad');}
  else{refreshVoices();if('onvoiceschanged' in speechSynthesis)speechSynthesis.addEventListener('voiceschanged',refreshVoices);}
  const draft=getJson(KEYS.draft,null);
  if(typeof draft==='string'&&draft.trim() && draft!==originalSample){UI.sourceInput.value=draft;state.original=originalSample;UI.draftLabel.textContent='· unsent changes';report('Your draft was restored. Press Translate to update the reading panels.');}
  else UI.sourceInput.value=originalSample;
  countChars();applySettings();UI.connectionTag.textContent=navigator.onLine?'● Online':'● Offline: saved text and speech only';
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  if(!UI.status.textContent)report('Sample ready · Tap French words to explore or press ▶ to listen.','good');
}
init();
})();
