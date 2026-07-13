
    const DATA={events:'./data/events.2026.json',family:'./data/familyMembers.sample.json',coverage:'./data/dataCoverage.2026.json'};
    const STORAGE_KEY='adp-kai-kalender-bali-family-v1-6';
    const ADAT_MEMORY_KEY='adp-kai-kalender-bali-adat-memory-v2-1';
    const CLOUD_SYNC_KEY='adp-kai-kalender-bali-cloud-sync-v2-2';
    const BANTEN_CHECKLIST_KEY='adp-kai-kalender-bali-banten-checklists-v2-3';
    const CEREMONY_ARCHIVE_KEY='adp-kai-kalender-bali-ceremony-archives-v2-4';
    const BACKUP_STATUS_KEY='adp-kai-kalender-bali-last-backup-v2-4-7';
    const LEGACY_STORAGE_KEY='adp-kai-kalender-bali-family-v1-5';
    const LEGACY_STORAGE_KEY_2='adp-kai-kalender-bali-family-v1-4';
    const LEGACY_STORAGE_KEY_3='adp-kai-kalender-bali-family-v1-3';
    const NOTIFY_PREF_KEY='adp-kai-kalender-bali-notify-v1-9';
    const FIREBASE_CONFIG_KEY='adp-kai-kalender-bali-firebase-config-v2-5';
    const FIREBASE_AUTH_RUNTIME_KEY='adp-kai-kalender-bali-firebase-auth-pilot-v2-5-1';
    const FIRESTORE_SEED_STATUS_KEY='adp-kai-kalender-bali-firestore-seed-status-v2-5-3';
    const FIRESTORE_SYNC_LOG_KEY='adp-kai-kalender-bali-firestore-sync-log-v2-5-4';
    const DEVICE_TRANSFER_TEST_KEY='adp-kai-kalender-bali-device-transfer-test-v2-5-5';
    const SYNC_CONFIDENCE_KEY='adp-kai-kalender-bali-sync-confidence-v2-5-6';
    const CLOUD_HARDENING_KEY='adp-kai-kalender-bali-cloud-hardening-v2-6';
    const AUTO_BACKUP_REMINDER_KEY='adp-kai-kalender-bali-auto-backup-reminder-v2-6-2';
    const REAL_SYNC_GATE_KEY='adp-kai-kalender-bali-real-sync-gate-v2-6-5';
    const CLOUD_DRY_RUN_KEY='adp-kai-kalender-bali-cloud-dry-run-v2-6-7';
    const DRY_RUN_VALIDATION_GATE_KEY='adp-kai-kalender-bali-dry-run-validation-gate-v2-6-7';
    const RESTORE_REVIEW_STATUS_KEY='adp-kai-kalender-bali-restore-review-v2-5-3';
    function localTodayIso(){const now=new Date();const y=now.getFullYear();const m=String(now.getMonth()+1).padStart(2,'0');const d=String(now.getDate()).padStart(2,'0');return `${y}-${m}-${d}`;}
    function getInitialSelectedDate(){const params=new URLSearchParams(location.search);const qDate=params.get('date');const qD=params.get('d');if(qDate&&/^\d{4}-\d{2}-\d{2}$/.test(qDate))return qDate;if(qD){const parsed=parseDMY(qD);if(parsed)return parsed;}const today=localTodayIso();if(today.slice(0,4)==='2026')return today;return '2026-07-10';}
    const state={events:[],family:[],sampleFamily:[],coverage:[],adatMemory:{places:[],shrines:[],decisions:[],bantenTemplates:[]},syncProfile:{email:'',familyName:'',familyId:'',syncMode:'manual_export',lastCloudSeedAt:null},firebaseConfig:{apiKey:'',authDomain:'',projectId:'',appId:'',messagingSenderId:'',storageBucket:''},firebaseAuthUser:null,firestoreSeed:{lastFetched:null,lastUploadedAt:null,lastFetchedAt:null},eventChecklists:{},ceremonyArchives:[],deferredPrompt:null,selectedDate:getInitialSelectedDate(),displayMode:false,notifyPref:{enabled:false,lastTestAt:null}};
    const monthNames=['Januari','Pebruari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','Nopember','Desember'];
    const dows=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    const SAPTAWARA=['Redite','Soma','Anggara','Buda','Wraspati','Sukra','Saniscara'];
    const PANCAWARA=['Umanis','Paing','Pon','Wage','Keliwon'];
    const WUKU=['Sinta','Landep','Ukir','Kulantir','Tolu','Gumbreg','Wariga','Warigadean','Julungwangi','Sungsang','Dungulan','Kuningan','Langkir','Medangsia','Pujut','Pahang','Krulut','Merakih','Tambir','Medangkungan','Matal','Uye','Menail','Prangbakat','Bala','Ugu','Wayang','Kelawu','Dukut','Watugunung'];
    const dayMs=86400000;
    const idDate=s=>new Date(s+'T00:00:00+08:00').toLocaleDateString('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric',timeZone:'Asia/Makassar'});
    const diff=(a,b)=>Math.round((new Date(b+'T00:00:00+08:00')-new Date(a+'T00:00:00+08:00'))/dayMs);
    const addDays=(iso,n)=>{const dt=new Date(iso+'T00:00:00+08:00');dt.setDate(dt.getDate()+n);return dt.toLocaleDateString('sv-SE',{timeZone:'Asia/Makassar'});};
    const formatDMY=iso=>`${iso.slice(8,10)}/${iso.slice(5,7)}/${iso.slice(0,4)}`;
    function parseDMY(v){const m=String(v||'').trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);if(!m)return null;const d=+m[1],mo=+m[2],y=+m[3];if(y<1900||y>2100||mo<1||mo>12||d<1||d>new Date(y,mo,0).getDate())return null;return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;}
    const setDateField=iso=>{document.getElementById('datePicker').value=formatDMY(iso);};
    async function getJson(u){const r=await fetch(u,{cache:'no-cache'});if(!r.ok)throw new Error(u);return r.json();}
    function setupMonthSelect(){const sel=document.getElementById('monthSelect');sel.innerHTML=monthNames.map((m,i)=>`<option value="${i+1}">${m} 2026</option>`).join('');sel.addEventListener('change',()=>renderMonth(+sel.value));}
    function normalizeMember(raw,idx){
      const o=raw.otonan||{};
      const source=o.source||o.inputMode||(o.saptawara||o.pancawara||o.wuku?'bali_day':'anchor_manual');
      const anchor=o.anchorDate||o.effectiveBaliDate||o.nextDate||null;
      return {id:raw.id||`family_${Date.now()}_${idx}`,name:raw.name||`Anggota Keluarga ${idx+1}`,role:raw.role||'family_member',otonan:{enabled:o.enabled!==false,source,anchorDate:anchor,birthGregorian:o.birthGregorian||raw.birth?.gregorianDate||null,birthTime:o.birthTime||'',beforeSunrise:o.beforeSunrise||'unknown',effectiveBaliDate:o.effectiveBaliDate||anchor,saptawara:o.saptawara||raw.baliBirth?.saptawara||null,pancawara:o.pancawara||raw.baliBirth?.pancawara||null,wuku:o.wuku||raw.baliBirth?.wuku||null,status:o.status||'local_family_input',validationStatus:o.validationStatus||(source==='bali_day'?'family_confirmed':'needs_bali_day_confirmation')}};
    }
    function saveFamily(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.family));}
    function loadFamilyFromStorage(sample){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||localStorage.getItem(LEGACY_STORAGE_KEY)||localStorage.getItem(LEGACY_STORAGE_KEY_2)||localStorage.getItem(LEGACY_STORAGE_KEY_3)||'null');if(Array.isArray(saved))return saved.map(normalizeMember);}catch(e){}return sample.map(normalizeMember);}
    function loadNotifyPref(){try{return JSON.parse(localStorage.getItem(NOTIFY_PREF_KEY)||'{"enabled":false,"lastTestAt":null}');}catch(e){return {enabled:false,lastTestAt:null};}}
    function saveNotifyPref(){localStorage.setItem(NOTIFY_PREF_KEY,JSON.stringify(state.notifyPref));}
    function safeSlug(text){return String(text||'data').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'data';}
    function downloadText(filename,content,type='application/json'){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);}
    function updateBackupStatus(message){const el=document.getElementById('backupStatus');if(el)el.textContent=message;}
    function buildBackupPayload(){return {app:'ADP KAI Kalender Bali Digital',shortName:'KD-Bali',phase:'2.6',backupVersion:4,exportedAt:new Date().toISOString(),timezone:'Asia/Makassar / device local',storageKey:STORAGE_KEY,adatMemoryKey:ADAT_MEMORY_KEY,cloudSyncKey:CLOUD_SYNC_KEY,bantenChecklistKey:BANTEN_CHECKLIST_KEY,ceremonyArchiveKey:CEREMONY_ARCHIVE_KEY,notes:'Backup mencakup otonan, Family Adat Memory, checklist banten/sarana, arsip upacara, dan profil sync lokal. Untuk keputusan adat penting tetap verifikasi dengan kalender resmi/sumber adat/pemangku.',syncProfile:state.syncProfile,firebaseConfigStatus:firebaseConfigStatusSummary(),family:state.family,adatMemory:state.adatMemory,eventChecklists:state.eventChecklists,ceremonyArchives:state.ceremonyArchives};}
    function exportBackup(){const payload=buildBackupPayload();const stamp=new Date().toISOString().slice(0,10);downloadText(`kd-bali-otonan-backup-${stamp}.json`,JSON.stringify(payload,null,2),'application/json');localStorage.setItem(BACKUP_STATUS_KEY,JSON.stringify({lastBackupAt:new Date().toISOString(),familyCount:payload.family.length,adatPlaceCount:payload.adatMemory?.places?.length||0,shrineCount:payload.adatMemory?.shrines?.length||0}));updateBackupStatus(`Backup JSON dibuat: ${payload.family.length} anggota · ${formatDMY(localTodayIso())}`);renderSetupProgress();renderCloudReadinessGate();if(typeof renderAutoBackupReminder==='function')renderAutoBackupReminder();if(typeof renderRealSyncDecisionGate==='function')renderRealSyncDecisionGate();if(typeof addSyncLog==='function')addSyncLog('backup','Backup JSON manual dibuat.');}
    function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;}
    function exportOtonanCsv(){const rows=[['date','display_date','member_name','role','event_title','source','saptawara','pancawara','wuku','validation_status','notes']];state.family.forEach(m=>{otonanDatesInYear(m).forEach(date=>{const o=m.otonan||{};rows.push([date,formatDMY(date),m.name,m.role,`Otonan ${m.name}`,o.source||'',o.saptawara||'',o.pancawara||'',o.wuku||'',o.validationStatus||'',otonanStatusLabel(m)]);});});const csv=rows.map(r=>r.map(csvEscape).join(',')).join('\n');downloadText(`kd-bali-jadwal-otonan-2026.csv`,csv,'text/csv;charset=utf-8');updateBackupStatus(`Export CSV dibuat: ${Math.max(rows.length-1,0)} tanggal otonan 2026.`);}
    function icsEscape(v){return String(v||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');}
    function compactDate(iso){return String(iso||'').replace(/-/g,'');}
    function compactStamp(){return new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');}
    function uidSafe(v){return String(v||'event').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
    function buildIcsEvent({date,title,type,description,uid}){const start=compactDate(date);const end=compactDate(addDays(date,1));return ['BEGIN:VEVENT',`UID:${icsEscape(uid||('kd-bali-'+uidSafe(title)+'-'+date))}@adp-kai`,`DTSTAMP:${compactStamp()}`,`DTSTART;VALUE=DATE:${start}`,`DTEND;VALUE=DATE:${end}`,`SUMMARY:${icsEscape(title)}`,`DESCRIPTION:${icsEscape(description)}`,`CATEGORIES:${icsEscape(type||'Kalender Bali')}`,'END:VEVENT'].join('\r\n');}
    function exportCalendarIcs(){const calendarEvents=state.events.map(e=>({date:e.date,title:e.title,type:e.type||e.category||'rahinan',description:`Kalender Bali Digital · ${e.category||'event'} · status ${e.source?.verificationStatus||'digital_source_only'} · sumber ${e.source?.sourceName||'SRC-001'} · Untuk keputusan adat penting tetap verifikasi dengan kalender cetak/sumber adat/pemangku.`,uid:`${e.id||uidSafe(e.title)}-${e.date}`}));const otonanEvents=[];state.family.forEach(m=>{otonanDatesInYear(m).forEach(date=>{otonanEvents.push({date,title:`Otonan ${m.name}`,type:'otonan',description:`Otonan keluarga · ${otonanSourceLabel(m)} · ${otonanStatusLabel(m)} · data lokal KD-Bali. Verifikasi adat tetap diperlukan untuk keputusan penting.`,uid:`otonan-${uidSafe(m.id||m.name)}-${date}`});});});const adatEvents=buildAdatInstancesInYear(2026).map(e=>({date:e.date,title:e.title,type:'adat',description:`Adat keluarga KD-Bali · ${e.category} · ${e.level||'level belum diatur'} · ${e.validationStatus||'user_recorded'} · bukan keputusan adat resmi.`,uid:`adat-${uidSafe(e.id)}-${e.date}`}));const all=[...calendarEvents,...otonanEvents,...adatEvents].sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ADP KAI//KD-Bali Calendar//ID','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:KD-Bali 2026','X-WR-TIMEZONE:Asia/Makassar',...all.map(buildIcsEvent),'END:VCALENDAR'].join('\r\n');downloadText('kd-bali-kalender-2026.ics',body,'text/calendar;charset=utf-8');updateBackupStatus(`Export ICS dibuat: ${all.length} event kalender + otonan + adat keluarga. Import file .ics ini ke Google Calendar/Apple Calendar jika dibutuhkan.`);}
    function appBaseUrl(){return location.origin+location.pathname.replace(/[^/]*$/,'');}
    function selectedDateParam(){return encodeURIComponent(formatDMY(state.selectedDate));}
    function displayUrl(){return `${appBaseUrl()}?v=267&app=kd-bali-v267&display=1&d=${selectedDateParam()}`;}
    function liveFeedUrl(){return `${appBaseUrl()}?v=267&app=kd-bali-v267&feed=display&d=${selectedDateParam()}`;}
    function buildDisplayPayload(iso=state.selectedDate){const evs=eventsOn(iso);const ots=otonanOn(iso);const ads=adatOn(iso);const upcoming=buildUpcoming(iso).slice(0,12).map(e=>({date:e.displayDate,displayDate:formatDMY(e.displayDate),title:e.title,type:e.type||e.category,kind:e.kind,daysLeft:e.daysLeft,label:reminderLabel(e.daysLeft),marker:eventPillClass(e)}));return {app:'KD-Bali',phase:'2.6',feedType:'live_selected_day_display_feed',generatedAt:new Date().toISOString(),selectedDate:iso,displayDate:formatDMY(iso),timezone:'Asia/Makassar / device local',deviceUse:{tabletDisplayUrl:displayUrl(),liveFeedUrl:liveFeedUrl(),refreshSeconds:900},today:{label:idDate(iso),events:evs.map(e=>({title:e.title,type:e.type,category:e.category,marker:eventPillClass(e),isPurnama:!!e.isPurnama,isTilem:!!e.isTilem,verificationStatus:e.source?.verificationStatus||'digital_source_only',source:e.source?.sourceName||'SRC-001'})),otonan:ots.map(m=>({title:`Otonan ${m.name}`,memberName:m.name,source:m.otonan?.source,validationStatus:m.otonan?.validationStatus||'needs_bali_day_confirmation'})),adat:ads.map(e=>({title:e.title,category:e.category,level:e.level,validationStatus:e.validationStatus,checklist:checklistSummaryForInstance(e.id)}))},upcoming,markers:{purnama:'red_dot',tilem:'black_dot_highlighted',rerainan:'gold_dot',otonan:'green_dot',merajan:'purple_dot'},validationNote:'Data digital_source_only. Untuk keputusan adat penting tetap verifikasi dengan kalender cetak/resmi, sumber adat setempat, atau pemangku.'};}
    function updateDisplayFeedUrl(){const el=document.getElementById('displayFeedUrl');if(el)el.textContent=liveFeedUrl();}
    async function copyText(text,label){try{await navigator.clipboard.writeText(text);updateBackupStatus(`${label} disalin ke clipboard.`);}catch(e){prompt(`Copy ${label}:`,text);}}
    function renderFeedMode(iso=state.selectedDate){const payload=buildDisplayPayload(iso);document.body.className='feed-mode';document.body.innerHTML=`<pre>${JSON.stringify(payload,null,2).replace(/[<>&]/g,c=>({'<':'\\u003c','>':'\\u003e','&':'\\u0026'}[c]))}</pre>`;}
    function exportDisplayFeed(){const payload=buildDisplayPayload(state.selectedDate);downloadText(`kd-bali-display-feed-${state.selectedDate}.json`,JSON.stringify(payload,null,2),'application/json');updateBackupStatus(`Display JSON dibuat untuk ${formatDMY(state.selectedDate)}. Live feed juga siap untuk tablet/ESP32/e-paper.`);updateDisplayFeedUrl();}
    function buildValidationSummary(){const total=state.events.length;const needsRecheck=state.events.filter(e=>(e.source?.verificationStatus||'').includes('recheck')||(e.source?.dataStatus||'').includes('recheck')).length;const directFetch=state.events.filter(e=>(e.source?.dataStatus||'').includes('direct_fetch')).length;const purnamaTilemPage=state.events.filter(e=>(e.source?.dataStatus||'').includes('digital_source_only_pt')).length;const digitalOnly=state.events.filter(e=>(e.source?.verificationStatus||'')==='digital_source_only').length;const quality=total?Math.round(((directFetch+purnamaTilemPage*0.65)/total)*100):0;const months=(state.coverage||[]).map(m=>({...m,score:m.totalEvents?Math.round(((m.directFetch+(m.purnamaTilemYearPageOnly||0)*0.65)/m.totalEvents)*100):0,status:m.needsRecheck>0?'needs_cross_check':'digital_source_ready'}));return {total,directFetch,purnamaTilemPage,needsRecheck,digitalOnly,quality,months};}
    function renderValidationConsole(){const s=buildValidationSummary();const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};set('valTotalEvents',s.total);set('valDirectFetch',s.directFetch);set('valNeedsRecheck',s.needsRecheck);set('valQualityScore',s.quality+'%');const bar=document.getElementById('valQualityBar');if(bar)bar.style.width=Math.max(0,Math.min(100,s.quality))+'%';const risky=s.months.filter(m=>m.needsRecheck>0);const queue=document.getElementById('validationQueue');if(queue){queue.innerHTML=risky.length?`<div class="row priority-soon"><div><strong>Prioritas cross-check berikutnya</strong><span class="small">${risky.map(m=>m.monthNameId+' ('+m.needsRecheck+' item)').join(' · ')}</span></div><span class="pill gold">${risky.length} bulan</span></div>`:`<div class="row"><div><strong>Coverage digital awal lengkap</strong><span class="small">Tetap lakukan validasi adat/cetak sebelum keputusan penting.</span></div><span class="pill green">OK</span></div>`;}const body=document.getElementById('validationTableBody');if(body){body.innerHTML=s.months.map(m=>`<tr><td>${m.monthNameId}</td><td>${m.totalEvents}</td><td>${m.directFetch}</td><td>${m.purnamaTilemYearPageOnly||0}</td><td>${m.needsRecheck}</td><td><span class="tag ${m.needsRecheck?'danger':'warn'}">${m.status}</span></td></tr>`).join('');}}
    function exportValidationCsv(){const s=buildValidationSummary();const rows=[['month','month_name','total_events','direct_fetch','purnama_tilem_year_page_only','needs_recheck','score','status','notes']];s.months.forEach(m=>rows.push([m.month,m.monthNameId,m.totalEvents,m.directFetch,m.purnamaTilemYearPageOnly||0,m.needsRecheck,m.score,m.status,m.needsRecheck?'Cross-check dengan kalender cetak/sumber adat/pemangku.':'Digital source ready; tetap bukan final adat resmi.']));rows.push([]);rows.push(['summary','total_events',s.total,'direct_fetch',s.directFetch,'pt_page_only',s.purnamaTilemPage,'needs_recheck',s.needsRecheck,'quality_score',s.quality+'%']);const csv=rows.map(r=>r.map(csvEscape).join(',')).join('\n');downloadText('kd-bali-validation-report-2026.csv',csv,'text/csv;charset=utf-8');updateBackupStatus(`Validation report CSV dibuat: ${s.total} event · ${s.needsRecheck} butuh recheck · quality ${s.quality}%.`);}
    
    function importBackupFile(file){if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const payload=JSON.parse(reader.result);const family=Array.isArray(payload)?payload:(Array.isArray(payload.family)?payload.family:null);if(!family&&!payload.adatMemory&&!payload.syncProfile)throw new Error('format');if(family){state.family=family.map(normalizeMember);saveFamily();}if(payload.adatMemory){state.adatMemory=normalizeAdatMemory(payload.adatMemory);saveAdatMemory();}if(payload.syncProfile){state.syncProfile=normalizeSyncProfile(payload.syncProfile);saveCloudSyncProfile();}if(payload.eventChecklists){state.eventChecklists=normalizeEventChecklists(payload.eventChecklists);saveEventChecklists();}if(payload.ceremonyArchives){state.ceremonyArchives=normalizeCeremonyArchives(payload.ceremonyArchives);saveCeremonyArchives();}rerender();renderCloudSyncStatus();updateBackupStatus(`Import berhasil: ${state.family.length} anggota · ${state.adatMemory.places.length} merajan/sanggah · profil sync ${state.syncProfile.email||'belum diisi'}.`);}catch(err){alert('File backup tidak valid. Pastikan memakai file JSON export dari KD-Bali.');}};reader.readAsText(file);}
    function cycleMatch(anchor,iso){if(!anchor)return false;return Math.abs(diff(anchor,iso))%210===0;}
    function nextOtonanDate(anchor,fromIso){if(!anchor)return null;let days=diff(anchor,fromIso);let steps=Math.ceil(days/210);if(steps<0)steps=0;let next=addDays(anchor,steps*210);if(diff(fromIso,next)<0)next=addDays(next,210);return next;}
    function otonanDatesInYear(member,year=2026){const anchor=member.otonan?.anchorDate;if(!anchor)return[];const out=[];let cur=nextOtonanDate(anchor,`${year}-01-01`);let guard=0;while(cur&&cur.slice(0,4)<=String(year)&&guard<4){if(cur.slice(0,4)===String(year))out.push(cur);cur=addDays(cur,210);guard++;}return out;}
    function defaultBantenTemplates(){return [
      {id:'piodalan_merajan_alit',name:'Piodalan Merajan - Alit/Rutin',level:'alit',validationStatus:'needs_local_confirmation',items:['Canang sari','Dupa','Bunga','Tirta/tempat tirta','Segehan sederhana','Catatan keluarga']},
      {id:'piodalan_merajan_ageng',name:'Piodalan Merajan - Ageng/Besar',level:'ageng',validationStatus:'needs_local_confirmation',items:['Canang sari','Pejati','Daksina','Kwangen','Buah','Bunga','Dupa','Tirta/tempat tirta','Perlengkapan sembahyang','Pembagian tugas keluarga','Catatan pemangku/serati']}
    ];}
    function normalizeAdatMemory(raw={}){return {places:Array.isArray(raw.places)?raw.places:[],shrines:Array.isArray(raw.shrines)?raw.shrines:[],decisions:Array.isArray(raw.decisions)?raw.decisions:[],bantenTemplates:Array.isArray(raw.bantenTemplates)&&raw.bantenTemplates.length?raw.bantenTemplates:defaultBantenTemplates()};}
    function loadAdatMemory(){try{return normalizeAdatMemory(JSON.parse(localStorage.getItem(ADAT_MEMORY_KEY)||'{}'));}catch(e){return normalizeAdatMemory({});}}
    function saveAdatMemory(){localStorage.setItem(ADAT_MEMORY_KEY,JSON.stringify(state.adatMemory));}
    function updateAdatStatus(message){const el=document.getElementById('adatMemoryStatus');if(el)el.textContent=message;}
    function adatLevelFor(place,date){if(!place.anchorDate||!date)return '';const cycle=Math.round(diff(place.anchorDate,date)/210);if(place.pattern==='pawukon_210_alit_ageng')return cycle%2===0?'alit':'ageng';return place.pattern==='pawukon_210'?'rutin':'';}
    function placeDatesInYear(place,year=2026){const anchor=place.anchorDate;if(!anchor)return[];const out=[];let cur=nextOtonanDate(anchor,`${year}-01-01`);let guard=0;while(cur&&cur.slice(0,4)<=String(year)&&guard<4){if(cur.slice(0,4)===String(year))out.push(cur);cur=addDays(cur,210);guard++;}return out;}
    function buildAdatInstancesInYear(year=2026){return state.adatMemory.places.flatMap(place=>placeDatesInYear(place,year).map(date=>({id:`${place.id}_${date}`,placeId:place.id,date,title:`Piodalan ${place.name}`,category:'merajan_sanggah',type:'adat',kind:'adat',isAdat:true,importance:adatLevelFor(place,date)==='ageng'?'high':'normal',level:adatLevelFor(place,date),validationStatus:place.validationStatus||'user_recorded',notes:place.notes||''})));}
    function adatOn(iso){return buildAdatInstancesInYear(+iso.slice(0,4)).filter(e=>e.date===iso);}
    function exportAdatMemory(){const payload={app:'KD-Bali',phase:'2.6',exportType:'family_adat_memory',exportedAt:new Date().toISOString(),notes:'Adat Memory adalah catatan keluarga, bukan keputusan adat resmi. Tetap verifikasi dengan pemangku/tetua/desa/griya/sumber resmi.',adatMemory:state.adatMemory,eventChecklists:state.eventChecklists,ceremonyArchives:state.ceremonyArchives};downloadText(`kd-bali-adat-memory-${new Date().toLocaleDateString('sv-SE')}.json`,JSON.stringify(payload,null,2));updateAdatStatus('Export Adat Memory JSON dibuat. Simpan file ini sebagai backup sampai cloud sync aktif.');}
    function loadAdatSample(){state.adatMemory=normalizeAdatMemory({places:[{id:'merajan_sample',name:'Merajan / Sanggah Rumah',anchorDate:'2026-07-22',pattern:'pawukon_210_alit_ageng',validationStatus:'user_recorded',notes:'Contoh placeholder. Ganti sesuai catatan keluarga dan konfirmasi pemangku/tetua.'}],shrines:[{id:'pelinggih_kemulan_sample',name:'Pelinggih Kemulan',category:'utama',follows:'main_merajan',notes:'Contoh placeholder, ikuti struktur merajan keluarga.'},{id:'pelinggih_taksu_sample',name:'Pelinggih Taksu',category:'pendamping',follows:'main_merajan',notes:'Contoh placeholder.'}],decisions:[{id:'decision_sample',topic:'Contoh keputusan adat keluarga',question:'Ada perbedaan tafsir tentang sarana piodalan.',sources:'Tetua keluarga / pemangku / kalender cetak',finalDecision:'Mengikuti versi keluarga setelah konfirmasi pemangku.',status:'draft',createdAt:new Date().toISOString()}]});saveAdatMemory();rerender();updateAdatStatus('Contoh struktur adat dimuat. Jangan gunakan sebagai standar adat final.');}
    function renderAdatMemory(){
      const pList=document.getElementById('adatPlaceList');if(pList)pList.innerHTML=state.adatMemory.places.map(p=>{const dates=placeDatesInYear(p).map(d=>`${formatDMY(d)} (${adatLevelFor(p,d)||'rutin'})`).join(', ');return `<div class="row kind-adat"><div><strong>${p.name}</strong><span class="small">${p.pattern||'manual'} · ${p.validationStatus||'user_recorded'}${p.anchorDate?' · acuan '+formatDMY(p.anchorDate):''}</span><span class="small">Jatuh 2026: ${dates||'belum dihitung'}</span><span class="small">${p.notes||''}</span></div><span class="pill purple">merajan</span></div>`;}).join('')||'<div class="row"><div><strong>Belum ada merajan/sanggah</strong><span class="small">Tambahkan profil merajan keluarga.</span></div></div>';
      const sList=document.getElementById('pelinggihList');if(sList)sList.innerHTML=state.adatMemory.shrines.map(x=>`<div class="row kind-adat"><div><strong>${x.name}</strong><span class="small">${x.category||'lainnya'} · ${x.follows||'unknown'}</span><span class="small">${x.notes||''}</span></div><span class="pill purple">pelinggih</span></div>`).join('')||'<div class="row"><div><strong>Belum ada pelinggih</strong><span class="small">Catat pelinggih satu per satu sesuai merajan keluarga.</span></div></div>';
      const dList=document.getElementById('decisionList');if(dList)dList.innerHTML=state.adatMemory.decisions.map(x=>`<div class="row kind-decision"><div><strong>${x.topic}</strong><span class="small">${x.status||'draft'} · ${x.question||''}</span><span class="small">Sumber: ${x.sources||'-'}</span><span class="small">Keputusan: ${x.finalDecision||'-'}</span></div><span class="pill blue">catatan</span></div>`).join('')||'<div class="row"><div><strong>Belum ada keputusan</strong><span class="small">Catat ketika ada perbedaan tafsir atau keputusan keluarga.</span></div></div>';
      const bList=document.getElementById('bantenTemplateList');if(bList)bList.innerHTML=state.adatMemory.bantenTemplates.map(t=>`<div class="banten-template"><strong>${t.name}</strong><span class="small">Level: ${t.level} · ${t.validationStatus}</span><span class="small">${(t.items||[]).join(' · ')}</span></div>`).join('');
      renderBantenChecklistPlanner();
      renderCeremonyArchivePlanner();
      renderCloudSyncStatus();
    }
    function setupAdatMemory(){
      const placeForm=document.getElementById('adatPlaceForm');if(placeForm)placeForm.addEventListener('submit',e=>{e.preventDefault();const anchor=parseDMY(document.getElementById('adatPlaceAnchor').value);state.adatMemory.places.push({id:`place_${Date.now()}`,name:document.getElementById('adatPlaceName').value.trim(),anchorDate:anchor,pattern:document.getElementById('adatPlacePattern').value,validationStatus:document.getElementById('adatPlaceValidation').value,notes:document.getElementById('adatPlaceNotes').value.trim(),createdAt:new Date().toISOString()});saveAdatMemory();e.target.reset();rerender();updateAdatStatus('Merajan/sanggah tersimpan lokal. Export backup atau aktifkan cloud sync nanti.');});
      const shrineForm=document.getElementById('pelinggihForm');if(shrineForm)shrineForm.addEventListener('submit',e=>{e.preventDefault();state.adatMemory.shrines.push({id:`shrine_${Date.now()}`,name:document.getElementById('pelinggihName').value.trim(),category:document.getElementById('pelinggihCategory').value,follows:document.getElementById('pelinggihFollows').value,notes:document.getElementById('pelinggihNotes').value.trim(),createdAt:new Date().toISOString()});saveAdatMemory();e.target.reset();renderAdatMemory();updateAdatStatus('Pelinggih tersimpan lokal.');});
      const decisionForm=document.getElementById('decisionForm');if(decisionForm)decisionForm.addEventListener('submit',e=>{e.preventDefault();state.adatMemory.decisions.push({id:`decision_${Date.now()}`,topic:document.getElementById('decisionTopic').value.trim(),question:document.getElementById('decisionQuestion').value.trim(),sources:document.getElementById('decisionSources').value.trim(),finalDecision:document.getElementById('decisionFinal').value.trim(),status:document.getElementById('decisionStatus').value,createdAt:new Date().toISOString()});saveAdatMemory();e.target.reset();renderAdatMemory();updateAdatStatus('Catatan keputusan adat tersimpan lokal.');});
      const loadBtn=document.getElementById('loadAdatSampleBtn');if(loadBtn)loadBtn.addEventListener('click',loadAdatSample);
      const exportBtn=document.getElementById('exportAdatMemoryBtn');if(exportBtn)exportBtn.addEventListener('click',exportAdatMemory);
      const clearBtn=document.getElementById('clearAdatMemoryBtn');if(clearBtn)clearBtn.addEventListener('click',()=>{if(confirm('Hapus data Adat Memory lokal di browser ini?')){state.adatMemory=normalizeAdatMemory({});state.eventChecklists={};state.ceremonyArchives=[];saveAdatMemory();saveEventChecklists();saveCeremonyArchives();rerender();updateAdatStatus('Adat Memory, checklist, dan arsip upacara lokal dihapus. Template umum tetap tersedia.');}});
      setupBantenChecklist();
      setupCeremonyArchive();
      setupCloudSync();
    }

    function normalizeChecklistItem(item){if(typeof item==='string')return {id:`item_${safeSlug(item)}_${Date.now()}`,name:item,checked:false,notes:''};return {id:item.id||`item_${safeSlug(item.name||'item')}_${Date.now()}`,name:item.name||'Item banten/sarana',checked:!!item.checked,notes:item.notes||''};}
    function normalizeEventChecklists(raw={}){if(Array.isArray(raw)){return raw.reduce((acc,c)=>{if(c&&c.instanceId)acc[c.instanceId]={...c,items:(c.items||[]).map(normalizeChecklistItem)};return acc;},{});}const out={};Object.entries(raw||{}).forEach(([id,c])=>{if(c)out[id]={...c,instanceId:c.instanceId||id,items:(c.items||[]).map(normalizeChecklistItem)};});return out;}
    function loadEventChecklists(){try{return normalizeEventChecklists(JSON.parse(localStorage.getItem(BANTEN_CHECKLIST_KEY)||'{}'));}catch(e){return {};}}
    function saveEventChecklists(){localStorage.setItem(BANTEN_CHECKLIST_KEY,JSON.stringify(state.eventChecklists||{}));}
    function normalizeCeremonyArchive(raw){return {id:raw.id||`archive_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,instanceId:raw.instanceId||'',eventId:raw.eventId||'',date:raw.date||'',title:raw.title||'Upacara adat',level:raw.level||'',status:raw.status||'planned',budget:raw.budget||'',tasks:raw.tasks||'',notes:raw.notes||'',sources:raw.sources||'',createdAt:raw.createdAt||new Date().toISOString(),updatedAt:raw.updatedAt||new Date().toISOString()};}
    function normalizeCeremonyArchives(raw=[]){return Array.isArray(raw)?raw.map(normalizeCeremonyArchive).filter(x=>x.title):[];}
    function loadCeremonyArchives(){try{return normalizeCeremonyArchives(JSON.parse(localStorage.getItem(CEREMONY_ARCHIVE_KEY)||'[]'));}catch(e){return [];}}
    function saveCeremonyArchives(){localStorage.setItem(CEREMONY_ARCHIVE_KEY,JSON.stringify(state.ceremonyArchives||[]));}
    function renderCeremonyArchivePlanner(){
      const eventSelect=document.getElementById('archiveEventSelect');const list=document.getElementById('ceremonyArchiveList');const status=document.getElementById('ceremonyArchiveStatus');
      if(!eventSelect||!list)return;
      const instances=buildAdatInstancesInYear(2026);const current=eventSelect.value;
      eventSelect.innerHTML=instances.length?instances.map(e=>`<option value="${e.id}">${formatDMY(e.date)} · ${e.title} · ${e.level||'rutin'}</option>`).join(''):'<option value="">Belum ada event merajan/sanggah</option>';
      if(current&&instances.some(e=>e.id===current))eventSelect.value=current;
      if(status){status.textContent=`${(state.ceremonyArchives||[]).length} arsip tersimpan. Data ini bersifat catatan keluarga/private dan ikut backup/cloud seed.`;}
      const rows=(state.ceremonyArchives||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(a=>`<div class="row kind-adat"><div><strong>${a.title}</strong><span class="small">${a.date?formatDMY(a.date):'-'} · ${a.level||'rutin'} · ${a.status||'planned'}${a.budget?' · biaya '+a.budget:''}</span><span class="small">Tugas: ${a.tasks||'-'}</span><span class="small">Catatan: ${a.notes||'-'}</span><span class="small">Sumber: ${a.sources||'-'}</span></div><span class="pill purple">arsip</span></div>`).join('');
      list.innerHTML=rows||'<div class="row"><div><strong>Belum ada arsip upacara</strong><span class="small">Setelah piodalan/upacara selesai, catat biaya, tugas, catatan, dan sumber keputusan.</span></div></div>';
    }
    function saveCeremonyArchiveFromForm(){
      const eventSelect=document.getElementById('archiveEventSelect');const inst=buildAdatInstancesInYear(2026).find(e=>e.id===eventSelect?.value);
      if(!inst){alert('Belum ada event piodalan merajan/sanggah. Tambahkan Merajan/Sanggah terlebih dahulu.');return;}
      const archive=normalizeCeremonyArchive({instanceId:inst.id,eventId:inst.placeId,date:inst.date,title:inst.title,level:inst.level||'rutin',status:document.getElementById('archiveStatus')?.value||'planned',budget:document.getElementById('archiveBudget')?.value.trim()||'',tasks:document.getElementById('archiveTasks')?.value.trim()||'',notes:document.getElementById('archiveNotes')?.value.trim()||'',sources:document.getElementById('archiveSources')?.value.trim()||''});
      const existingIndex=(state.ceremonyArchives||[]).findIndex(x=>x.instanceId===archive.instanceId);
      if(existingIndex>=0){state.ceremonyArchives[existingIndex]={...state.ceremonyArchives[existingIndex],...archive,updatedAt:new Date().toISOString()};}else{state.ceremonyArchives.push(archive);}
      saveCeremonyArchives();renderCeremonyArchivePlanner();updateAdatStatus('Arsip upacara tersimpan lokal dan ikut backup/cloud seed.');
      ['archiveBudget','archiveTasks','archiveNotes','archiveSources'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    }
    function exportCeremonyArchiveCsv(){
      const rows=[['archive_id','instance_id','date','title','level','status','budget','tasks','notes','sources','updated_at']];
      (state.ceremonyArchives||[]).forEach(a=>rows.push([a.id,a.instanceId,a.date,a.title,a.level,a.status,a.budget,a.tasks,a.notes,a.sources,a.updatedAt]));
      const csv=rows.map(r=>r.map(csvEscape).join(',')).join('\n');downloadText(`kd-bali-arsip-upacara-2026.csv`,csv,'text/csv;charset=utf-8');updateAdatStatus(`Export arsip upacara CSV dibuat: ${Math.max(rows.length-1,0)} arsip.`);
    }
    function setupCeremonyArchive(){
      const form=document.getElementById('ceremonyArchiveForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();saveCeremonyArchiveFromForm();});
      const exp=document.getElementById('exportCeremonyArchiveCsvBtn');if(exp)exp.addEventListener('click',exportCeremonyArchiveCsv);
    }

    function checklistSummaryForInstance(instanceId){const c=state.eventChecklists?.[instanceId];if(!c||!Array.isArray(c.items)||!c.items.length)return {total:0,done:0,percent:0,status:'not_created'};const done=c.items.filter(x=>x.checked).length;return {total:c.items.length,done,percent:Math.round(done/c.items.length*100),status:done===c.items.length?'done':'in_progress'};}
    function selectedChecklistInstance(){const select=document.getElementById('checklistEventSelect');return select?buildAdatInstancesInYear(2026).find(e=>e.id===select.value):null;}
    function templateForChecklist(){const select=document.getElementById('checklistTemplateSelect');const id=select?.value;return (state.adatMemory.bantenTemplates||[]).find(t=>t.id===id)||state.adatMemory.bantenTemplates?.[0]||defaultBantenTemplates()[0];}
    function renderBantenChecklistPlanner(){
      const eventSelect=document.getElementById('checklistEventSelect');const templateSelect=document.getElementById('checklistTemplateSelect');const list=document.getElementById('bantenChecklistList');const status=document.getElementById('bantenChecklistStatus');
      if(!eventSelect||!templateSelect||!list)return;
      const instances=buildAdatInstancesInYear(2026);const currentEventValue=eventSelect.value;const currentTemplateValue=templateSelect.value;
      eventSelect.innerHTML=instances.length?instances.map(e=>`<option value="${e.id}">${formatDMY(e.date)} · ${e.title} · ${e.level||'rutin'}</option>`).join(''):'<option value="">Belum ada event merajan/sanggah</option>';
      if(currentEventValue&&instances.some(e=>e.id===currentEventValue))eventSelect.value=currentEventValue;
      templateSelect.innerHTML=(state.adatMemory.bantenTemplates||defaultBantenTemplates()).map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
      if(currentTemplateValue&&(state.adatMemory.bantenTemplates||[]).some(t=>t.id===currentTemplateValue))templateSelect.value=currentTemplateValue;
      const inst=selectedChecklistInstance()||instances[0];if(inst)eventSelect.value=inst.id;
      const checklist=inst?state.eventChecklists?.[inst.id]:null;const summary=inst?checklistSummaryForInstance(inst.id):{total:0,done:0,percent:0,status:'not_created'};
      if(status)status.textContent=inst?`Checklist untuk ${inst.title} (${formatDMY(inst.date)} · ${inst.level||'rutin'}): ${summary.done}/${summary.total} selesai. Template dapat disesuaikan keluarga dan wajib dikonfirmasi sesuai adat setempat.`:'Belum ada event piodalan merajan/sanggah. Tambahkan profil merajan dulu.';
      if(!inst){list.innerHTML='<div class="row"><div><strong>Belum ada checklist</strong><span class="small">Tambahkan Merajan/Sanggah agar jadwal piodalan muncul.</span></div></div>';return;}
      if(!checklist){list.innerHTML='<div class="row"><div><strong>Checklist belum dibuat</strong><span class="small">Pilih template lalu tekan Generate / Update Checklist.</span></div><span class="pill purple">draft</span></div>';return;}
      list.innerHTML=`<div class="check-progress"><i style="width:${summary.percent}%"></i></div><div class="checklist-meta"><span class="tag warn">${summary.percent}% siap</span><span class="tag">${checklist.templateName||'template keluarga'}</span><span class="tag">${checklist.level||inst.level||'rutin'}</span></div>`+checklist.items.map((item,i)=>`<label class="check-item ${item.checked?'done':''}"><input type="checkbox" data-check-instance="${inst.id}" data-check-index="${i}" ${item.checked?'checked':''}><span>${item.name}${item.notes?`<br><small class="small">${item.notes}</small>`:''}</span></label>`).join('');
      list.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.addEventListener('change',()=>{const instId=cb.dataset.checkInstance;const idx=+cb.dataset.checkIndex;if(state.eventChecklists[instId]?.items?.[idx]){state.eventChecklists[instId].items[idx].checked=cb.checked;state.eventChecklists[instId].updatedAt=new Date().toISOString();saveEventChecklists();renderBantenChecklistPlanner();}}));
    }
    function generateChecklistForSelectedEvent(){const inst=selectedChecklistInstance();if(!inst){alert('Belum ada event piodalan. Tambahkan Merajan/Sanggah terlebih dahulu.');return;}const template=templateForChecklist();const extra=document.getElementById('checklistExtraItem')?.value.trim();const old=state.eventChecklists?.[inst.id];const oldByName=new Map((old?.items||[]).map(x=>[x.name,x]));const baseItems=(template.items||[]).map(normalizeChecklistItem);if(extra)baseItems.push(normalizeChecklistItem(extra));const items=baseItems.map(item=>oldByName.has(item.name)?{...item,checked:!!oldByName.get(item.name).checked}:item);state.eventChecklists[inst.id]={instanceId:inst.id,eventId:inst.placeId,date:inst.date,title:inst.title,level:inst.level||template.level||'rutin',templateId:template.id,templateName:template.name,items,validationStatus:'family_custom_checklist',updatedAt:new Date().toISOString()};saveEventChecklists();const extraEl=document.getElementById('checklistExtraItem');if(extraEl)extraEl.value='';renderBantenChecklistPlanner();updateAdatStatus('Checklist banten/sarana disimpan lokal untuk event yang dipilih.');}
    function exportChecklistCsv(){const rows=[['instance_id','date','title','level','template','item','checked','validation_status','notes']];Object.values(state.eventChecklists||{}).forEach(c=>(c.items||[]).forEach(item=>rows.push([c.instanceId,c.date,c.title,c.level,c.templateName,item.name,item.checked?'yes':'no',c.validationStatus||'',item.notes||''])));const csv=rows.map(r=>r.map(csvEscape).join(',')).join('\n');downloadText(`kd-bali-banten-checklist-2026.csv`,csv,'text/csv;charset=utf-8');updateAdatStatus(`Export checklist CSV dibuat: ${Math.max(rows.length-1,0)} item.`);}
    function setupBantenChecklist(){const form=document.getElementById('bantenChecklistForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();generateChecklistForSelectedEvent();});const exp=document.getElementById('exportChecklistCsvBtn');if(exp)exp.addEventListener('click',exportChecklistCsv);const eventSelect=document.getElementById('checklistEventSelect');if(eventSelect)eventSelect.addEventListener('change',renderBantenChecklistPlanner);const templateSelect=document.getElementById('checklistTemplateSelect');if(templateSelect)templateSelect.addEventListener('change',renderBantenChecklistPlanner);}

    function normalizeSyncProfile(raw={}){const email=String(raw.email||'').trim();const familyName=String(raw.familyName||'').trim();const familyId=raw.familyId||safeSlug(email||familyName||'family')||'family_local';return {email,familyName,familyId,syncMode:raw.syncMode||'manual_export',lastCloudSeedAt:raw.lastCloudSeedAt||null};}
    function loadCloudSyncProfile(){try{return normalizeSyncProfile(JSON.parse(localStorage.getItem(CLOUD_SYNC_KEY)||'{}'));}catch(e){return normalizeSyncProfile({});}}
    function saveCloudSyncProfile(){localStorage.setItem(CLOUD_SYNC_KEY,JSON.stringify(normalizeSyncProfile(state.syncProfile)));}
    function cloudCollectionPaths(){const familyId=state.syncProfile.familyId||'family_local';return [`users/{uid}`,`families/${familyId}`,`families/${familyId}/members`,`families/${familyId}/adatPlaces`,`families/${familyId}/shrines`,`families/${familyId}/adatDecisions`,`families/${familyId}/bantenTemplates`,`families/${familyId}/eventChecklists`,`families/${familyId}/ceremonyArchives`,`families/${familyId}/eventInstances`];}
    function buildCloudSeedPayload(){const profile=normalizeSyncProfile(state.syncProfile);const year=2026;const adatInstances=buildAdatInstancesInYear(year);const otonanInstances=[];state.family.forEach(m=>otonanDatesInYear(m).forEach(date=>otonanInstances.push({id:`otonan_${uidSafe(m.id||m.name)}_${date}`,date,title:`Otonan ${m.name}`,type:'otonan',memberId:m.id,source:'family_private_event',visibility:'family_private'})));return {app:'KD-Bali',phase:'2.6',exportType:'cloud_seed_firestore_ready',exportedAt:new Date().toISOString(),profile,firestorePaths:cloudCollectionPaths(),users:{uid_placeholder:{email:profile.email,displayName:profile.email||'User 1',activeFamilyId:profile.familyId}},families:{[profile.familyId]:{familyId:profile.familyId,familyName:profile.familyName||'Keluarga User',ownerUid:'uid_placeholder',timezone:'Asia/Makassar',privacyLevel:'private'}},members:state.family,adatPlaces:state.adatMemory.places,shrines:state.adatMemory.shrines,adatDecisions:state.adatMemory.decisions,bantenTemplates:state.adatMemory.bantenTemplates,eventChecklists:Object.values(state.eventChecklists||{}),ceremonyArchives:state.ceremonyArchives,eventInstances:[...otonanInstances,...adatInstances],notes:'Cloud Seed ini adalah jembatan manual menuju Firebase Auth + Firestore. Saat Firebase real aktif, data ini dipakai sebagai struktur awal users/families/subcollections.'};}
    function exportCloudSeed(){const payload=buildCloudSeedPayload();state.syncProfile={...normalizeSyncProfile(state.syncProfile),lastCloudSeedAt:new Date().toISOString()};saveCloudSyncProfile();downloadText(`kd-bali-cloud-seed-${safeSlug(payload.profile.familyName||payload.profile.email||'family')}-${new Date().toLocaleDateString('sv-SE')}.json`,JSON.stringify(payload,null,2));renderCloudSyncStatus();updateBackupStatus('Cloud Seed JSON dibuat. Ini bisa dipakai untuk migrasi manual atau persiapan Firestore.');}
    function importCloudSeedFile(file){if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const payload=JSON.parse(reader.result);if(payload.profile){state.syncProfile=normalizeSyncProfile(payload.profile);saveCloudSyncProfile();}if(Array.isArray(payload.members)){state.family=payload.members.map(normalizeMember);saveFamily();}if(payload.adatMemory){state.adatMemory=normalizeAdatMemory(payload.adatMemory);}else{state.adatMemory=normalizeAdatMemory({places:payload.adatPlaces,shrines:payload.shrines,decisions:payload.adatDecisions,bantenTemplates:payload.bantenTemplates});}if(payload.eventChecklists){state.eventChecklists=normalizeEventChecklists(payload.eventChecklists);}if(payload.ceremonyArchives){state.ceremonyArchives=normalizeCeremonyArchives(payload.ceremonyArchives);}saveAdatMemory();saveEventChecklists();saveCeremonyArchives();rerender();renderCloudSyncStatus();updateBackupStatus('Cloud Seed berhasil di-import. Data family/adat memory dimuat di perangkat ini.');}catch(err){alert('File Cloud Seed tidak valid atau rusak.');}};reader.readAsText(file);}
    async function copyCloudSchema(){const text=cloudCollectionPaths().join('\n');try{await navigator.clipboard.writeText(text);updateBackupStatus('Schema path Cloud Sync disalin.');}catch(e){alert(text);}}

    function getCloudReadiness(){
      const profile=normalizeSyncProfile(state.syncProfile||{});
      const backup=getLastBackupStatus();
      const otonanCount=(state.family||[]).filter(m=>m.otonan?.enabled&&m.otonan?.anchorDate).length;
      const merajanCount=state.adatMemory?.places?.length||0;
      const pelinggihCount=state.adatMemory?.shrines?.length||0;
      const checklistCount=Object.keys(state.eventChecklists||{}).length;
      const archiveCount=(state.ceremonyArchives||[]).length;
      const checks=[
        {key:'otonan',label:'Otonan',ok:otonanCount>0,detail:otonanCount?`${otonanCount} data otonan tercatat`:'belum ada otonan inti'},
        {key:'merajan',label:'Merajan',ok:merajanCount>0,detail:merajanCount?`${merajanCount} merajan/sanggah tercatat`:'belum ada piodalan acuan'},
        {key:'pelinggih',label:'Pelinggih',ok:pelinggihCount>0,detail:pelinggihCount?`${pelinggihCount} pelinggih tercatat`:'belum ada registry pelinggih'},
        {key:'backup',label:'Backup',ok:!!backup.lastBackupAt,detail:backup.lastBackupAt?`terakhir ${formatDMY(String(backup.lastBackupAt).slice(0,10))}`:'belum ada backup'},
        {key:'profile',label:'Profil Sync',ok:!!profile.email,detail:profile.email?profile.email:'email/family belum diisi'}
      ];
      const done=checks.filter(c=>c.ok).length;
      const percent=Math.round((done/checks.length)*100);
      const missing=checks.find(c=>!c.ok);
      let next={title:'Data siap untuk Firebase Setup',text:`Checklist ${done}/${checks.length} selesai. Siapkan Firebase Config sebelum login real. Checklist banten ${checklistCount} dan arsip ${archiveCount} tetap bisa dilengkapi bertahap.`,view:'settings',adat:'cloud',target:'#firebaseSetupPanel',label:'Buka Firebase Setup'};
      if(missing?.key==='otonan')next={title:'Belum siap cloud: isi otonan dulu',text:'Mulai dari data inti keluarga. Cloud jangan diaktifkan sebelum data paling penting masuk.',view:'adat',adat:'otonan',target:'#adatDashboard',label:'Buka Otonan'};
      else if(missing?.key==='merajan')next={title:'Belum siap cloud: catat merajan/sanggah',text:'Tambahkan piodalan acuan merajan/sanggah agar kalender adat keluarga punya inti.',view:'adat',adat:'merajan',target:'#adatDashboard',label:'Buka Merajan'};
      else if(missing?.key==='pelinggih')next={title:'Belum siap cloud: daftar pelinggih utama',text:'Catat pelinggih utama sesuai versi keluarga. Tidak perlu sempurna, cukup registry awal.',view:'adat',adat:'merajan',target:'#adatDashboard',label:'Buka Pelinggih'};
      else if(missing?.key==='backup')next={title:'Belum siap cloud: backup dulu',text:'Sebelum migrasi cloud/login real, buat backup JSON agar data lokal aman.',view:'adat',adat:'otonan',target:'#adatOtonanPanel',label:'Buka Backup'};
      else if(missing?.key==='profile')next={title:'Belum siap cloud: isi profil sync',text:'Masukkan email dan nama keluarga untuk membuat familyId dan Cloud Seed.',view:'adat',adat:'cloud',target:'#adatMemoryPanel',label:'Buka Profil Sync'};
      return {checks,done,percent,ready:done===checks.length,next,profile};
    }
    function renderCloudReadinessGate(){
      const gate=document.getElementById('cloudReadinessGate');if(!gate)return;
      const r=getCloudReadiness();
      const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
      set('cloudGateScore',r.percent+'% siap');
      const fb=firebaseConfigStatusSummary();
      set('cloudGateTitle',r.ready?(fb.ready?'Data dan Firebase config siap':'Data siap, Firebase config belum lengkap'):'Belum siap masuk Cloud Login Real');
      set('cloudGateText',r.ready?(fb.ready?'Data inti keluarga dan Firebase config sudah siap. Tahap berikutnya boleh masuk Firebase Auth + Firestore real.':'Data inti keluarga sudah siap. Lengkapi Firebase Config di Pengaturan sebelum login real diaktifkan.'):'KD-Bali menahan ekspansi cloud sampai otonan, merajan, pelinggih, backup, dan profil sync minimal siap.');
      const bar=document.getElementById('cloudGateBar');if(bar)bar.style.width=r.percent+'%';
      const list=document.getElementById('cloudGateChecklist');if(list){list.innerHTML=r.checks.map(c=>`<div class="cloud-check ${c.ok?'done':'wait'}"><strong>${c.ok?'✅':'□'} ${c.label}</strong><span>${c.detail}</span></div>`).join('');}
      set('cloudGateNextTitle',r.next.title);set('cloudGateNextText',r.next.text);
      const nextBtn=document.getElementById('cloudGateNextBtn');if(nextBtn){nextBtn.textContent=r.next.label;nextBtn.dataset.jumpView=r.next.view;nextBtn.dataset.adatJump=r.next.adat;nextBtn.dataset.scrollTarget=r.next.target;}
    }
    function renderCloudSyncStatus(){const profile=normalizeSyncProfile(state.syncProfile);const status=document.getElementById('cloudSyncStatus');if(status){status.textContent=profile.email?`Profil sync siap untuk ${profile.email} · familyId: ${profile.familyId} · mode: ${profile.syncMode}. Firebase real belum aktif sampai config/login dipasang.`:'Cloud Sync Foundation belum diisi. Masukkan email/family name untuk menyiapkan migrasi ke Firebase.';}const metrics=document.getElementById('cloudSyncMetrics');if(metrics){const adatCount=(state.adatMemory.places?.length||0)+(state.adatMemory.shrines?.length||0)+(state.adatMemory.decisions?.length||0)+Object.keys(state.eventChecklists||{}).length+(state.ceremonyArchives?.length||0);const instanceCount=state.family.reduce((n,m)=>n+otonanDatesInYear(m).length,0)+buildAdatInstancesInYear(2026).length;metrics.innerHTML=`<div class="mini-metric"><span>Family ID</span><strong>${profile.familyId||'-'}</strong></div><div class="mini-metric"><span>Data adat</span><strong>${adatCount} item</strong></div><div class="mini-metric"><span>Event instances</span><strong>${instanceCount} jadwal</strong></div>`;}const email=document.getElementById('cloudEmail');const fam=document.getElementById('cloudFamilyName');const mode=document.getElementById('cloudSyncMode');if(email&&!document.activeElement?.isSameNode(email))email.value=profile.email||'';if(fam&&!document.activeElement?.isSameNode(fam))fam.value=profile.familyName||'';if(mode)mode.value=profile.syncMode||'manual_export';}
    function setupCloudSync(){const form=document.getElementById('cloudProfileForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('cloudEmail').value.trim();const familyName=document.getElementById('cloudFamilyName').value.trim();const syncMode=document.getElementById('cloudSyncMode').value;const nextFamilyId=(state.syncProfile.familyId&&state.syncProfile.familyId!=='family'&&state.syncProfile.familyId!=='family_local')?state.syncProfile.familyId:safeSlug(email||familyName||'family_local');state.syncProfile=normalizeSyncProfile({email,familyName,syncMode,familyId:nextFamilyId});saveCloudSyncProfile();renderCloudSyncStatus();renderCloudReadinessGate();updateBackupStatus('Profil Cloud Sync tersimpan lokal. Export Cloud Seed untuk backup/migrasi.');});const exp=document.getElementById('exportCloudSeedBtn');if(exp)exp.addEventListener('click',exportCloudSeed);const inp=document.getElementById('importCloudSeedInput');if(inp)inp.addEventListener('change',e=>{importCloudSeedFile(e.target.files?.[0]);e.target.value='';});const copy=document.getElementById('copyCloudSchemaBtn');if(copy)copy.addEventListener('click',copyCloudSchema);}



    function normalizeFirebaseConfig(raw={}){
      return {
        apiKey:String(raw.apiKey||'').trim(),
        authDomain:String(raw.authDomain||'').trim(),
        projectId:String(raw.projectId||'').trim(),
        appId:String(raw.appId||'').trim(),
        messagingSenderId:String(raw.messagingSenderId||raw.senderId||'').trim(),
        storageBucket:String(raw.storageBucket||'').trim()
      };
    }
    function loadFirebaseConfig(){try{return normalizeFirebaseConfig(JSON.parse(localStorage.getItem(FIREBASE_CONFIG_KEY)||'{}'));}catch(e){return normalizeFirebaseConfig({});}}
    function saveFirebaseConfig(){localStorage.setItem(FIREBASE_CONFIG_KEY,JSON.stringify(normalizeFirebaseConfig(state.firebaseConfig)));}
    function firebaseConfigChecks(){const c=normalizeFirebaseConfig(state.firebaseConfig||{});return [
      {key:'apiKey',label:'API Key',ok:!!c.apiKey,detail:c.apiKey?'terisi':'kosong'},
      {key:'authDomain',label:'Auth Domain',ok:!!c.authDomain,detail:c.authDomain||'kosong'},
      {key:'projectId',label:'Project ID',ok:!!c.projectId,detail:c.projectId||'kosong'},
      {key:'appId',label:'App ID',ok:!!c.appId,detail:c.appId?'terisi':'kosong'},
      {key:'sender',label:'Sender ID',ok:!!c.messagingSenderId,detail:c.messagingSenderId?'opsional terisi':'opsional'},
      {key:'bucket',label:'Storage Bucket',ok:!!c.storageBucket,detail:c.storageBucket?'opsional terisi':'opsional'}
    ];}
    function firebaseConfigStatusSummary(){const checks=firebaseConfigChecks();const required=checks.slice(0,4);const done=required.filter(x=>x.ok).length;return {requiredDone:done,requiredTotal:required.length,ready:done===required.length,projectId:state.firebaseConfig?.projectId||'',authDomain:state.firebaseConfig?.authDomain||''};}
    function renderFirebaseConfig(){
      const c=normalizeFirebaseConfig(state.firebaseConfig||{});state.firebaseConfig=c;
      const fields={firebaseApiKey:'apiKey',firebaseAuthDomain:'authDomain',firebaseProjectId:'projectId',firebaseAppId:'appId',firebaseSenderId:'messagingSenderId',firebaseStorageBucket:'storageBucket'};
      Object.entries(fields).forEach(([id,key])=>{const el=document.getElementById(id);if(el&&!document.activeElement?.isSameNode(el))el.value=c[key]||'';});
      const status=firebaseConfigStatusSummary();
      const pill=document.getElementById('firebaseStatusPill');if(pill)pill.textContent=status.ready?'Config siap':'Config belum lengkap';
      const box=document.getElementById('firebaseConfigStatus');if(box)box.textContent=status.ready?`Firebase config lokal siap untuk project ${status.projectId}. Tahap berikutnya bisa mengaktifkan Firebase Auth + Firestore real.`:`Firebase config belum lengkap (${status.requiredDone}/${status.requiredTotal} wajib). Isi API Key, Auth Domain, Project ID, dan App ID dari Firebase Console.`;
      const checks=document.getElementById('firebaseConfigChecks');if(checks)checks.innerHTML=firebaseConfigChecks().map(x=>`<div class="firebase-check ${x.ok?'done':'wait'}"><strong>${x.label}</strong><span>${x.ok?'OK':'Belum'} · ${x.detail}</span></div>`).join('');
    }
    function firebaseEnvText(){const c=normalizeFirebaseConfig(state.firebaseConfig||{});return [`VITE_FIREBASE_API_KEY=${c.apiKey}`,`VITE_FIREBASE_AUTH_DOMAIN=${c.authDomain}`,`VITE_FIREBASE_PROJECT_ID=${c.projectId}`,`VITE_FIREBASE_APP_ID=${c.appId}`,`VITE_FIREBASE_MESSAGING_SENDER_ID=${c.messagingSenderId}`,`VITE_FIREBASE_STORAGE_BUCKET=${c.storageBucket}`].join('\n');}
    function exportFirebaseConfig(){const payload={app:'KD-Bali',phase:'2.6',type:'firebase_web_config_local_export',exportedAt:new Date().toISOString(),config:normalizeFirebaseConfig(state.firebaseConfig),warning:'Simpan file ini dengan aman. Jangan upload config ke tempat publik jika project rules belum dikunci.'};downloadText(`kd-bali-firebase-config-${new Date().toLocaleDateString('sv-SE')}.json`,JSON.stringify(payload,null,2),'application/json');}
    async function copyFirebaseEnv(){const text=firebaseEnvText();try{await navigator.clipboard.writeText(text);const box=document.getElementById('firebaseConfigStatus');if(box)box.textContent='ENV Firebase disalin. Gunakan nanti saat migrasi dari single HTML ke build app/Vite.';}catch(e){alert(text);}}
    function setupFirebasePrep(){
      const form=document.getElementById('firebaseConfigForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();state.firebaseConfig=normalizeFirebaseConfig({apiKey:document.getElementById('firebaseApiKey')?.value,authDomain:document.getElementById('firebaseAuthDomain')?.value,projectId:document.getElementById('firebaseProjectId')?.value,appId:document.getElementById('firebaseAppId')?.value,messagingSenderId:document.getElementById('firebaseSenderId')?.value,storageBucket:document.getElementById('firebaseStorageBucket')?.value});saveFirebaseConfig();renderFirebaseConfig();renderCloudReadinessGate();renderFirebaseAuthPilot();});
      const exp=document.getElementById('exportFirebaseConfigBtn');if(exp)exp.addEventListener('click',exportFirebaseConfig);
      const copy=document.getElementById('copyFirebaseEnvBtn');if(copy)copy.addEventListener('click',copyFirebaseEnv);
      const clear=document.getElementById('clearFirebaseConfigBtn');if(clear)clear.addEventListener('click',()=>{if(confirm('Reset Firebase config lokal di browser ini?')){state.firebaseConfig=normalizeFirebaseConfig({});localStorage.removeItem(FIREBASE_CONFIG_KEY);renderFirebaseConfig();renderCloudReadinessGate();renderFirebaseAuthPilot();}});
      renderFirebaseConfig();
    }


    const firebaseAuthRuntime={app:null,auth:null,modules:null,unsubscribe:null,ready:false};
    function firebaseSdkConfig(){const c=normalizeFirebaseConfig(state.firebaseConfig||{});const cfg={apiKey:c.apiKey,authDomain:c.authDomain,projectId:c.projectId,appId:c.appId};if(c.messagingSenderId)cfg.messagingSenderId=c.messagingSenderId;if(c.storageBucket)cfg.storageBucket=c.storageBucket;return cfg;}
    function setFirebaseAuthStatus(text,kind='info'){const el=document.getElementById('firebaseAuthStatus');if(el)el.textContent=text;const pill=document.getElementById('firebaseAuthPill');if(pill){pill.textContent=kind==='ok'?'Auth siap':kind==='user'?'Login aktif':kind==='error'?'Auth error':'Auth belum aktif';}}
    function renderFirebaseAuthPilot(){const user=state.firebaseAuthUser;const fb=firebaseConfigStatus();const box=document.getElementById('firebaseUserBox');if(box){box.innerHTML=user?`<strong>${user.displayName||'User Firebase'}</strong><span>${user.email||'-'}</span><span>UID: ${user.uid}</span><span>Family ID lokal: ${normalizeSyncProfile(state.syncProfile).familyId||'-'}</span>`:'<strong>Belum login</strong><span>Setelah login berhasil, email akan otomatis mengisi Profil Sync lokal.</span>';}if(user)setFirebaseAuthStatus(`Login Firebase aktif untuk ${user.email||user.uid}. Data belum otomatis sync penuh; Firestore Seed Sync memakai upload/restore manual pada phase 2.6.`, 'user');else if(fb.ready)setFirebaseAuthStatus('Firebase config lengkap. Klik Cek Koneksi Auth atau Login Google untuk uji Auth.', 'ok');else setFirebaseAuthStatus(`Firebase config belum lengkap (${fb.requiredDone}/${fb.requiredTotal} wajib). Lengkapi Firebase Setup Kit terlebih dahulu.`, 'info');}
    async function loadFirebaseAuthModules(){if(firebaseAuthRuntime.modules)return firebaseAuthRuntime.modules;const appMod=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');const authMod=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js');firebaseAuthRuntime.modules={appMod,authMod};return firebaseAuthRuntime.modules;}
    async function initFirebaseAuthRuntime(){const status=firebaseConfigStatus();if(!status.ready)throw new Error('Firebase config belum lengkap. Isi API Key, Auth Domain, Project ID, dan App ID.');const {appMod,authMod}=await loadFirebaseAuthModules();const cfg=firebaseSdkConfig();const app=appMod.getApps().find(a=>a.name==='kdBaliAuthPilot')||appMod.initializeApp(cfg,'kdBaliAuthPilot');const auth=authMod.getAuth(app);firebaseAuthRuntime.app=app;firebaseAuthRuntime.auth=auth;firebaseAuthRuntime.ready=true;if(firebaseAuthRuntime.unsubscribe)firebaseAuthRuntime.unsubscribe();firebaseAuthRuntime.unsubscribe=authMod.onAuthStateChanged(auth,user=>{state.firebaseAuthUser=user?{uid:user.uid,email:user.email||'',displayName:user.displayName||'',photoURL:user.photoURL||''}:null;if(user?.email){const profile=normalizeSyncProfile(state.syncProfile);state.syncProfile={...profile,email:user.email,familyName:profile.familyName||user.displayName||'Keluarga User',familyId:profile.familyId||safeSlug(user.email)};saveCloudSyncProfile();renderCloudSyncStatus();renderCloudReadinessGate();}renderFirebaseAuthPilot();renderFirestoreSeedPilot();});return {auth,authMod};}
    async function firebaseAuthLoginGoogle(){try{setFirebaseAuthStatus('Menyiapkan Firebase Auth...', 'info');const {auth,authMod}=await initFirebaseAuthRuntime();const provider=new authMod.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});await authMod.signInWithPopup(auth,provider);setFirebaseAuthStatus('Login Google berhasil. Profil sync lokal diperbarui.', 'user');}catch(err){console.error(err);setFirebaseAuthStatus('Login gagal: '+(err?.message||err), 'error');alert('Login Firebase gagal. Cek: Firebase Config benar, Google provider aktif, dan domain Vercel sudah masuk Authorized domains. Detail: '+(err?.message||err));}}
    async function firebaseAuthLogout(){try{if(!firebaseAuthRuntime.auth)await initFirebaseAuthRuntime();await firebaseAuthRuntime.modules.authMod.signOut(firebaseAuthRuntime.auth);state.firebaseAuthUser=null;renderFirebaseAuthPilot();setFirebaseAuthStatus('Logout berhasil. Data lokal tetap tersimpan di browser ini.', 'ok');}catch(err){console.error(err);setFirebaseAuthStatus('Logout gagal: '+(err?.message||err), 'error');}}
    function setupFirebaseAuthPilot(){const initBtn=document.getElementById('initFirebaseAuthBtn');if(initBtn)initBtn.addEventListener('click',async()=>{try{setFirebaseAuthStatus('Mengecek Firebase Auth runtime...', 'info');await initFirebaseAuthRuntime();setFirebaseAuthStatus('Firebase Auth runtime siap. Lanjut Login Google.', 'ok');}catch(err){console.error(err);setFirebaseAuthStatus('Cek Auth gagal: '+(err?.message||err), 'error');}});const login=document.getElementById('googleLoginBtn');if(login)login.addEventListener('click',firebaseAuthLoginGoogle);const logout=document.getElementById('firebaseLogoutBtn');if(logout)logout.addEventListener('click',firebaseAuthLogout);renderFirebaseAuthPilot();}

    function otonanOn(iso){return state.family.filter(m=>m.otonan?.enabled&&m.otonan?.anchorDate&&cycleMatch(m.otonan.anchorDate,iso));}
    function otonanSourceLabel(m){const o=m.otonan||{};if(o.source==='gregorian_birth')return 'dari lahir Gregorian';if(o.source==='bali_day')return 'dari hari Bali langsung';return 'input acuan lokal';}
    function otonanStatusLabel(m){const o=m.otonan||{};const parts=[];if(o.source==='bali_day')parts.push([o.saptawara,o.pancawara,o.wuku].filter(Boolean).join(' · '));if(o.source==='gregorian_birth'&&o.birthGregorian)parts.push('lahir '+formatDMY(o.birthGregorian));if(o.beforeSunrise==='yes')parts.push('sebelum matahari terbit → effective '+formatDMY(o.effectiveBaliDate));if(o.beforeSunrise==='no')parts.push('setelah matahari terbit');if(o.beforeSunrise==='unknown'&&o.source==='gregorian_birth')parts.push('batas sunrise belum dikonfirmasi');parts.push(o.validationStatus||'local_family_input');return parts.filter(Boolean).join(' · ');}
    function eventsOn(iso){return state.events.filter(e=>e.date===iso).sort((a,b)=>(b.importance==='high')-(a.importance==='high'));}
    function renderMonth(month){document.getElementById('monthSelect').value=month;document.getElementById('monthTitle').textContent=monthNames[month-1]+' 2026';const grid=document.getElementById('calendarGrid');const first=new Date(Date.UTC(2026,month-1,1));const days=new Date(2026,month,0).getDate();const start=first.getUTCDay();let html='';for(let i=0;i<start;i++)html+='<div class="day muted"></div>';for(let d=1;d<=days;d++){const iso=`2026-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const evs=eventsOn(iso);const ots=otonanOn(iso);const ads=adatOn(iso);const cls=[iso===state.selectedDate?'today':'',ots.length?'has-otonan':''].filter(Boolean).join(' ');const marks=[];if(evs.some(e=>e.isPurnama))marks.push('<i class="dot red"></i>');if(evs.some(e=>e.isTilem))marks.push('<i class="dot black"></i>');if(evs.some(e=>!e.isPurnama&&!e.isTilem))marks.push('<i class="dot gold"></i>');if(ots.length)marks.push('<i class="dot green"></i>');if(ads.length)marks.push('<i class="dot purple"></i>');const eventHtml=evs.slice(0,2).map(e=>`<div class="event-mini ${e.importance==='high'?'high':''}">${e.title}</div>`).join('');const otHtml=ots.slice(0,1).map(m=>`<div class="event-mini otonan">Otonan ${m.name}</div>`).join('');const adHtml=ads.slice(0,1).map(a=>`<div class="event-mini adat">${a.title}</div>`).join('');html+=`<button class="day ${cls}" data-date="${iso}" aria-label="${iso}"><div class="day-num"><span>${d}</span><span class="markers">${marks.join('')}</span></div>${eventHtml}${otHtml}${adHtml}</button>`;}grid.innerHTML=html;grid.querySelectorAll('.day:not(.muted)').forEach(el=>el.addEventListener('click',()=>{state.selectedDate=el.dataset.date;setDateField(state.selectedDate);renderMonth(+state.selectedDate.slice(5,7));renderInfo(state.selectedDate);updateDisplayFeedUrl();}));renderInfo(state.selectedDate);}
    function buildUpcoming(iso){const calendarItems=state.events.map(e=>({...e,kind:'calendar',daysLeft:diff(iso,e.date),displayDate:e.date})).filter(e=>e.daysLeft>=0);const adatItems=buildAdatInstancesInYear(+iso.slice(0,4)).map(e=>({...e,kind:'adat',daysLeft:diff(iso,e.date),displayDate:e.date})).filter(e=>e.daysLeft>=0);const familyItems=state.family.filter(m=>m.otonan?.enabled&&m.otonan?.anchorDate).map(m=>{const nd=nextOtonanDate(m.otonan.anchorDate,iso);return {title:`Otonan ${m.name}`,type:'otonan',category:'family',kind:'otonan',importance:'high',isOtonan:true,daysLeft:diff(iso,nd),displayDate:nd,member:m};});return [...calendarItems,...familyItems,...adatItems].sort((a,b)=>a.daysLeft-b.daysLeft).slice(0,20);}
    
    function reminderLabel(days){if(days===0)return 'Hari-H';if(days===1)return 'H-1';if(days<=3)return 'H-'+days;if(days<=7)return 'H-'+days;if(days<=30)return 'H-'+days;return days+' hari';}
    function reminderClass(days){if(days===0||days===1)return 'priority-now';if(days<=7)return 'priority-soon';return '';}
    function reminderPrepText(e){if(e.daysLeft===0)return 'Hari ini. Cek agenda keluarga dan kebutuhan persembahyangan.';if(e.daysLeft===1)return 'Besok. Siapkan kebutuhan utama.';if(e.daysLeft<=3)return 'Persiapan dekat. Cek banten/catatan keluarga.';if(e.daysLeft<=7)return 'Masuk radar minggu ini.';return 'Rencana awal.';}
    function eventKindClass(e){if(e.isAdat||e.kind==='adat')return 'kind-adat';if(e.isOtonan)return 'kind-otonan';if(e.isPurnama)return 'kind-purnama';if(e.isTilem)return 'kind-tilem';return 'kind-calendar';}
    function eventPillClass(e){return (e.isAdat||e.kind==='adat')?'purple':e.isPurnama?'red':e.isTilem?'black':e.isOtonan?'green':'gold';}
    function renderHome(iso,up){const evs=eventsOn(iso);const ots=otonanOn(iso);const ads=adatOn(iso);const agenda=[...evs.map(e=>({...e,isOtonan:false,displayDate:iso})),...ots.map(m=>({title:'Otonan '+m.name,isOtonan:true,type:'otonan',displayDate:iso})),...ads.map(a=>({...a,isAdat:true,displayDate:iso}))];document.getElementById('homeDateTitle').textContent=idDate(iso);document.getElementById('homeDateNote').textContent=agenda.length?`${agenda.length} agenda terdeteksi untuk tanggal ini.`:'Tidak ada rahinan/otonan/adat keluarga tercatat pada tanggal ini. Tetap cek agenda keluarga manual.';document.getElementById('homeTodayAgenda').innerHTML=agenda.length?agenda.slice(0,5).map(e=>`<div class="agenda-chip"><span><i class="dot ${eventPillClass(e)}"></i> ${e.title}</span><small>${e.isOtonan?'Otonan':e.isAdat?'Adat keluarga':e.type}</small></div>`).join(''):'<div class="agenda-empty">Tidak ada agenda terjadwal di data digital/lokal.</div>';const next=up[0];document.getElementById('homeNextReminder').innerHTML=next?`<div class="agenda-chip"><span><i class="dot ${eventPillClass(next)}"></i> ${next.title}</span><small>${reminderLabel(next.daysLeft)}</small></div><div class="agenda-empty">${formatDMY(next.displayDate)} · ${reminderPrepText(next)}</div>`:'<div class="agenda-empty">Tidak ada reminder mendatang pada dataset ini.</div>';}
    function renderStatus(iso,up){const todayEvents=eventsOn(iso).length+otonanOn(iso).length+adatOn(iso).length;const next=up[0];document.getElementById('statusToday').textContent=todayEvents?todayEvents+' agenda':'Kosong';document.getElementById('statusTodayNote').textContent=idDate(iso);document.getElementById('statusNext').textContent=next?next.title:'Belum ada';document.getElementById('statusNextNote').textContent=next?`${formatDMY(next.displayDate)} · ${reminderLabel(next.daysLeft)}`:'Tidak ada reminder mendatang.';document.getElementById('statusNotify').textContent=state.notifyPref.enabled?'Aktif/test OK':'Belum aktif';document.getElementById('statusDisplay').textContent=state.displayMode?'Display meja':'HP';}
    function renderInfo(iso){const evs=eventsOn(iso);const ots=otonanOn(iso);const ads=adatOn(iso);const cov=state.coverage.find(c=>c.month===+iso.slice(5,7));let today=`<div class="row"><div><strong>${idDate(iso)}</strong><span class="small">${evs.length+ots.length+ads.length?evs.length+' event kalender, '+ots.length+' otonan, '+ads.length+' adat keluarga':'Belum ada event pada tanggal ini'}</span></div><span class="pill gold">${cov?.needsRecheck||0} recheck</span></div>`;today+=evs.map(e=>`<div class="row ${eventKindClass(e)}"><div><strong>${e.title}</strong><span class="small">${e.category} · ${e.source.verificationStatus} · ${e.source.dataStatus}</span></div><span class="pill ${eventPillClass(e)}">${e.type}</span></div>`).join('');today+=ads.map(a=>`<div class="row kind-adat"><div><strong>${a.title}</strong><span class="small">${a.category} · level ${a.level||'rutin'} · ${a.validationStatus} · catatan keluarga</span></div><span class="pill purple">adat</span></div>`).join('');today+=ots.map(m=>`<div class="row kind-otonan"><div><strong>Otonan ${m.name}</strong><span class="small">${otonanSourceLabel(m)} · ${otonanStatusLabel(m)} · siklus 210 hari dari ${formatDMY(m.otonan.anchorDate)}</span></div><span class="pill green">otonan</span></div>`).join('');document.getElementById('todayInfo').innerHTML=today;
      const up=buildUpcoming(iso);renderStatus(iso,up);renderHome(iso,up);const near=up.filter(e=>e.daysLeft<=30);const calendarNear=near.filter(e=>e.kind!=='otonan').slice(0,8);const otonanNear=near.filter(e=>e.kind==='otonan').slice(0,6);const later=up.filter(e=>e.daysLeft>30).slice(0,4);let reminderHtml='';reminderHtml+=`<div class="reminder-section-title"><strong>Rahinan / adat keluarga ≤ 30 hari</strong><span>${calendarNear.length} item</span></div>`;reminderHtml+=calendarNear.map(e=>`<div class="row ${reminderClass(e.daysLeft)} ${eventKindClass(e)}"><div><strong>${e.title}</strong><span class="small">${idDate(e.displayDate)} · ${reminderPrepText(e)}</span></div><span class="pill ${eventPillClass(e)}">${reminderLabel(e.daysLeft)}</span></div>`).join('')||'<div class="row"><div><strong>Belum ada rahinan dekat</strong><span class="small">Tidak ada item kalender dalam 30 hari dari tanggal dipilih.</span></div></div>';reminderHtml+=`<div class="reminder-section-title"><strong>Otonan keluarga ≤ 30 hari</strong><span>${otonanNear.length} item</span></div>`;reminderHtml+=otonanNear.map(e=>`<div class="row ${reminderClass(e.daysLeft)} kind-otonan"><div><strong>${e.title}</strong><span class="small">${idDate(e.displayDate)} · data lokal · ${reminderPrepText(e)}</span></div><span class="pill green">${reminderLabel(e.daysLeft)}</span></div>`).join('')||'<div class="row"><div><strong>Belum ada otonan dekat</strong><span class="small">Tambahkan data otonan keluarga untuk memunculkan reminder.</span></div></div>';if(later.length){reminderHtml+=`<div class="reminder-section-title"><strong>Berikutnya</strong><span>${later.length} item</span></div>`;reminderHtml+=later.map(e=>`<div class="row ${eventKindClass(e)}"><div><strong>${e.title}</strong><span class="small">${idDate(e.displayDate)}${e.kind==='otonan'?' · data lokal':''}</span></div><span class="pill ${eventPillClass(e)}">${reminderLabel(e.daysLeft)}</span></div>`).join('');}document.getElementById('upcomingList').innerHTML=reminderHtml;}
    function renderFamily(){const rows=state.family.map((m,i)=>{const next=m.otonan?.anchorDate?nextOtonanDate(m.otonan.anchorDate,state.selectedDate):null;const dates=otonanDatesInYear(m).map(formatDMY).join(', ');return `<div class="row"><div><strong>${m.name}</strong><span class="small">${m.role} · ${otonanSourceLabel(m)}${m.otonan?.anchorDate?' · acuan '+formatDMY(m.otonan.anchorDate):' · otonan belum diatur'}${next?' · berikutnya '+formatDMY(next):''}</span><span class="small bali-day-summary">${otonanStatusLabel(m)}</span><span class="small">Tanggal jatuh 2026: ${dates||'belum bisa dihitung'}</span></div><div><span class="pill ${next?'green':'gold'}">${next?reminderLabel(diff(state.selectedDate,next)):'sample'}</span><br><button class="delete-btn" data-id="${m.id}" title="Hapus">hapus</button></div></div>`;}).join('');document.getElementById('familyList').innerHTML=rows||'<div class="row"><div><strong>Belum ada data keluarga</strong><span class="small">Tambahkan placeholder di form.</span></div></div>';document.querySelectorAll('.delete-btn').forEach(btn=>btn.addEventListener('click',()=>{state.family=state.family.filter(m=>m.id!==btn.dataset.id);saveFamily();rerender();}));}
    function rerender(){renderFamily();renderAdatMemory();updateAdatSummary();renderWizardGuardrails();renderCloudReadinessGate();renderFirebaseConfig();renderFirestoreSeedPilot();renderAutoBackupReminder();renderMonth(+state.selectedDate.slice(5,7));}
    function renderWizardGuardrails(){
      const lastBackup=getLastBackupStatus();
      const checks={
        Otonan:{ok:(state.family||[]).some(m=>m.otonan&&m.otonan.anchorDate),label:(state.family||[]).filter(m=>m.otonan&&m.otonan.anchorDate).length+' otonan'},
        Merajan:{ok:(state.adatMemory?.places||[]).length>0,label:(state.adatMemory?.places||[]).length+' merajan'},
        Pelinggih:{ok:(state.adatMemory?.shrines||[]).length>0,label:(state.adatMemory?.shrines||[]).length+' pelinggih'},
        Backup:{ok:!!lastBackup,label:lastBackup?'backup pernah dibuat':'belum backup'}
      };
      Object.entries(checks).forEach(([key,c])=>{
        const step=document.getElementById('wizardStep'+key);const stat=document.getElementById('wizardStatus'+key);
        if(step){step.classList.toggle('done',!!c.ok);step.classList.toggle('waiting',!c.ok);step.classList.remove('locked');}
        if(stat)stat.textContent=c.ok?'OK · '+c.label:'Perlu diisi · '+c.label;
      });
      const flow=document.getElementById('flowLockText');
      if(flow){
        if(!checks.Otonan.ok)flow.textContent='Mulai dari Otonan. Jangan lanjut banten/arsip sebelum data keluarga inti masuk.';
        else if(!checks.Merajan.ok)flow.textContent='Otonan sudah ada. Langkah berikutnya: catat Merajan/Sanggah dan piodalan acuan.';
        else if(!checks.Pelinggih.ok)flow.textContent='Merajan sudah ada. Langkah berikutnya: tambah daftar pelinggih utama sesuai versi keluarga.';
        else if(!checks.Backup.ok)flow.textContent='Data inti sudah mulai siap. Export backup dulu sebelum lanjut detail banten, arsip, atau cloud.';
        else flow.textContent='Data inti dan backup sudah siap. Setelah UI stabil, keputusan berikutnya adalah cloud login real.';
      }
    }
    function fillSelect(id,items,placeholder){const el=document.getElementById(id);el.innerHTML=`<option value="">${placeholder}</option>`+items.map(x=>`<option value="${x}">${x}</option>`).join('');}
    function setupOtonanMode(){fillSelect('birthSaptawara',SAPTAWARA,'Pilih saptawara');fillSelect('birthPancawara',PANCAWARA,'Pilih pancawara');fillSelect('birthWuku',WUKU,'Pilih wuku');const mode=document.getElementById('otonanInputMode');const apply=()=>{const isBali=mode.value==='bali_day';document.getElementById('gregorianFields').hidden=isBali;document.getElementById('baliDayFields').hidden=!isBali;};mode.addEventListener('change',apply);apply();}
    function buildMemberFromForm(){const name=document.getElementById('memberName').value.trim();const role=document.getElementById('memberRole').value;const mode=document.getElementById('otonanInputMode').value;if(!name){alert('Nama tampilan wajib diisi. Gunakan placeholder untuk mockup publik.');return null;}const id=name.toLowerCase().replace(/[^a-z0-9]+/gi,'_')+'_'+Date.now();if(mode==='gregorian_birth'){const birth=parseDMY(document.getElementById('birthGregorian').value);const birthTime=document.getElementById('birthTime').value||'';const beforeSunrise=document.getElementById('beforeSunrise').value;if(!birth){alert('Tanggal lahir Gregorian wajib format dd/mm/yyyy. Contoh: 14/07/2026');return null;}const effective=beforeSunrise==='yes'?addDays(birth,-1):birth;return {id,name,role,otonan:{enabled:true,source:'gregorian_birth',anchorDate:effective,birthGregorian:birth,birthTime,beforeSunrise,effectiveBaliDate:effective,status:'local_family_input',validationStatus:beforeSunrise==='unknown'?'needs_bali_day_confirmation':'family_confirmed'}};}const saptawara=document.getElementById('birthSaptawara').value;const pancawara=document.getElementById('birthPancawara').value;const wuku=document.getElementById('birthWuku').value;const anchor=parseDMY(document.getElementById('baliAnchor').value);if(!saptawara||!pancawara||!wuku){alert('Untuk input Hari Bali, isi saptawara, pancawara, dan wuku.');return null;}if(!anchor){alert('Tanggal otonan acuan wajib diisi agar sistem bisa mencatat jatuhnya otonan di kalender. Contoh: 14/07/2026');return null;}return {id,name,role,otonan:{enabled:true,source:'bali_day',anchorDate:anchor,saptawara,pancawara,wuku,effectiveBaliDate:anchor,beforeSunrise:'not_applicable',status:'local_family_input',validationStatus:'family_confirmed'}};}
    function setupBackupControls(){document.getElementById('exportBackupBtn').addEventListener('click',exportBackup);document.getElementById('exportOtonanCsvBtn').addEventListener('click',exportOtonanCsv);document.getElementById('exportCalendarIcsBtn').addEventListener('click',exportCalendarIcs);document.getElementById('exportValidationReportBtn').addEventListener('click',exportValidationCsv);document.getElementById('exportDisplayFeedBtn').addEventListener('click',exportDisplayFeed);document.getElementById('copyDisplayLinkBtn').addEventListener('click',()=>copyText(displayUrl(),'Display link'));document.getElementById('copyFeedLinkBtn').addEventListener('click',()=>copyText(liveFeedUrl(),'Live feed link'));document.getElementById('importBackupInput').addEventListener('change',e=>{importBackupFile(e.target.files?.[0]);e.target.value='';});}
    function setupFamilyForm(){setupOtonanMode();document.getElementById('familyForm').addEventListener('submit',e=>{e.preventDefault();const member=buildMemberFromForm();if(!member)return;state.family.push(member);saveFamily();e.target.reset();document.getElementById('otonanInputMode').value='gregorian_birth';setupOtonanMode();rerender();updateBackupStatus('Data otonan tersimpan lokal. Disarankan export backup setelah menambah data penting.');});document.getElementById('loadSampleBtn').addEventListener('click',()=>{state.family=state.sampleFamily.map(normalizeMember);saveFamily();rerender();updateBackupStatus('Sample dimuat. Jangan pakai identitas asli untuk demo publik.');});document.getElementById('clearFamilyBtn').addEventListener('click',()=>{if(confirm('Hapus data otonan lokal di browser ini?')){state.family=[];saveFamily();rerender();updateBackupStatus('Data lokal dihapus dari browser ini.');}});setupBackupControls();}



    function getLastBackupStatus(){try{return JSON.parse(localStorage.getItem(BACKUP_STATUS_KEY)||'{}');}catch(e){return {};}}
    function setSetupCard(key,done,text,status){
      const card=document.getElementById('setupCard'+key);const textEl=document.getElementById('setup'+key+'Text');const statusEl=document.getElementById('setup'+key+'Status');
      if(card)card.classList.toggle('done',!!done);if(textEl)textEl.textContent=text;if(statusEl)statusEl.textContent=done?'Selesai':'Belum lengkap';
    }
    function renderSetupProgress(){
      const otonanCount=(state.family||[]).filter(m=>m.otonan?.enabled).length;
      const merajanCount=state.adatMemory?.places?.length||0;
      const pelinggihCount=state.adatMemory?.shrines?.length||0;
      const backup=getLastBackupStatus();
      const hasBackup=!!backup.lastBackupAt;
      const steps=[otonanCount>0,merajanCount>0,pelinggihCount>0,hasBackup];
      const done=steps.filter(Boolean).length;
      const percent=Math.round((done/steps.length)*100);
      const bar=document.getElementById('setupProgressBar');if(bar)bar.style.width=percent+'%';
      const pct=document.getElementById('setupPercentText');if(pct)pct.textContent=percent+'% siap';
      setSetupCard('Otonan',otonanCount>0,otonanCount?`${otonanCount} otonan aktif tercatat.`:'Belum ada otonan aktif. Mulai dari keluarga inti dulu.','');
      setSetupCard('Merajan',merajanCount>0,merajanCount?`${merajanCount} merajan/sanggah tercatat.`:'Belum ada profil merajan/sanggah. Catat piodalan utama dulu.','');
      setSetupCard('Pelinggih',pelinggihCount>0,pelinggihCount?`${pelinggihCount} pelinggih tercatat.`:'Belum ada daftar pelinggih. Isi bertahap sesuai versi keluarga.','');
      setSetupCard('Backup',hasBackup,hasBackup?`Backup terakhir: ${formatDMY((backup.lastBackupAt||'').slice(0,10))}.`:'Belum ada catatan backup di browser ini. Export backup setelah data inti masuk.','');
      const nextTitle=document.getElementById('setupNextActionTitle');const nextText=document.getElementById('setupNextActionText');const nextBtn=document.getElementById('setupNextActionBtn');
      let cfg;
      if(!otonanCount)cfg={title:'Langkah berikutnya: isi Otonan Keluarga',text:'Mulai dari data yang paling sering dibutuhkan keluarga: otonan anak/anggota keluarga.',view:'adat',adat:'otonan',label:'Buka Otonan'};
      else if(!merajanCount)cfg={title:'Langkah berikutnya: catat Merajan/Sanggah',text:'Tambahkan piodalan utama merajan/sanggah. Detail lain tidak perlu diisi dulu.',view:'adat',adat:'merajan',label:'Buka Merajan'};
      else if(!pelinggihCount)cfg={title:'Langkah berikutnya: daftar Pelinggih',text:'Catat pelinggih satu per satu sesuai struktur keluarga. Jangan pakai standar umum yang dipaksakan.',view:'adat',adat:'merajan',label:'Buka Pelinggih'};
      else if(!hasBackup)cfg={title:'Langkah berikutnya: backup data lokal',text:'Data inti sudah mulai rapi. Export backup sebelum lanjut banten, arsip, atau cloud.',view:'settings',adat:'cloud',label:'Buka Backup'};
      else cfg={title:'Data inti siap untuk tahap berikutnya',text:'Lanjutkan secara bertahap ke checklist banten/sarana, arsip upacara, atau cloud login real setelah UI stabil.',view:'adat',adat:'banten',label:'Buka Banten'};
      if(nextTitle)nextTitle.textContent=cfg.title;if(nextText)nextText.textContent=cfg.text;if(nextBtn){nextBtn.textContent=cfg.label;nextBtn.dataset.jumpView=cfg.view;nextBtn.dataset.adatJump=cfg.adat;nextBtn.dataset.scrollTarget=cfg.view==='adat'?'#adatDashboard':'#settingsPanel';}
    }

    function updateAdatSummary(){
      const places=state.adatMemory?.places?.length||0;
      const shrines=state.adatMemory?.shrines?.length||0;
      const checklistCount=Object.keys(state.eventChecklists||{}).length;
      const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
      set('adatSummaryOtonan',(state.family||[]).filter(m=>m.otonan?.enabled).length);
      set('adatSummaryMerajan',places);
      set('adatSummaryPelinggih',shrines);
      set('adatSummaryChecklist',checklistCount);
      renderSetupProgress();
      renderCloudReadinessGate();
    }
    function setupAdatSubNav(){
      const tabs=[...document.querySelectorAll('[data-adat-nav]')];
      const valid=['overview','otonan','merajan','banten','arsip','cloud'];
      function setAdatModule(module,opts={}){
        if(!valid.includes(module))module='overview';
        document.body.dataset.adatModule=module;
        tabs.forEach(btn=>btn.classList.toggle('active',btn.dataset.adatNav===module));
        const overview=document.getElementById('adatOverviewCards');
        if(overview)overview.hidden=module!=='overview';
        if(opts.scroll!==false){
          const target=opts.scrollTarget||'#adatDashboard';
          setTimeout(()=>document.querySelector(target)?.scrollIntoView({behavior:'smooth',block:'start'}),70);
        }
      }
      tabs.forEach(btn=>btn.addEventListener('click',()=>setAdatModule(btn.dataset.adatNav)));
      document.querySelectorAll('[data-adat-jump]').forEach(btn=>btn.addEventListener('click',()=>setAdatModule(btn.dataset.adatJump)));
      const params=new URLSearchParams(location.search);
      setAdatModule(params.get('adat')||'overview',{scroll:false});
      updateAdatSummary();
    }

    function setSettingsModule(module='overview', opts={}){
      document.body.dataset.settingsModule=module||'overview';
      if(opts.scrollTarget){setTimeout(()=>document.querySelector(opts.scrollTarget)?.scrollIntoView({behavior:'smooth',block:'start'}),80);}
    }
    function setupSettingsNav(){
      document.querySelectorAll('[data-settings-nav]').forEach(btn=>btn.addEventListener('click',()=>setSettingsModule(btn.dataset.settingsNav||'overview',{scrollTarget:btn.dataset.scrollTarget||null})));
    }
    function setupMainNav(){
      const buttons=[...document.querySelectorAll('[data-main-nav]')];
      const valid=['today','calendar','adat','settings'];
      function setView(view,opts={}){
        if(!valid.includes(view))view='today';
        document.body.dataset.mainView=view;
        buttons.forEach(btn=>btn.classList.toggle('active',btn.dataset.mainNav===view));
        if(opts.scrollTarget){
          setTimeout(()=>document.querySelector(opts.scrollTarget)?.scrollIntoView({behavior:'smooth',block:'start'}),80);
        }else if(opts.scroll!==false){
          setTimeout(()=>document.querySelector('.main-nav')?.scrollIntoView({behavior:'smooth',block:'start'}),40);
        }
      }
      buttons.forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.mainNav)));
      document.querySelectorAll('[data-jump-view]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.jumpView,{scrollTarget:btn.dataset.scrollTarget||null})));
      document.querySelectorAll('[data-scroll-target]:not([data-jump-view])').forEach(btn=>btn.addEventListener('click',()=>document.querySelector(btn.dataset.scrollTarget)?.scrollIntoView({behavior:'smooth',block:'start'})));
      const params=new URLSearchParams(location.search);
      const initial=params.get('view')||(params.get('display')?'calendar':'today');
      setView(initial,{scroll:false});
    }

    function setupGuidanceToggle(){
      const btn=document.getElementById('toggleSetupGuideBtn');
      if(!btn)return;
      function sync(){btn.textContent=document.body.classList.contains('show-setup-guide')?'Tutup Panduan Setup':'Lihat Panduan Setup';}
      btn.addEventListener('click',()=>{document.body.classList.toggle('show-setup-guide');sync();if(document.body.classList.contains('show-setup-guide'))setTimeout(()=>document.querySelector('.setup-guide')?.scrollIntoView({behavior:'smooth',block:'start'}),80);});
      sync();
    }

    const firestoreRuntime={db:null,modules:null,ready:false,lastDocRef:null};
    function setFirestoreSeedStatus(text,kind='info'){
      const el=document.getElementById('firestoreSeedStatus');if(el)el.textContent=text;
      const pill=document.getElementById('firestoreSeedPill');if(pill){pill.textContent=kind==='ok'?'Firestore siap':kind==='uploaded'?'Seed terupload':kind==='fetched'?'Seed ditemukan':kind==='error'?'Firestore error':'Seed belum aktif';}
    }
    function firestoreSeedStatusLocal(){try{return JSON.parse(localStorage.getItem(FIRESTORE_SEED_STATUS_KEY)||'{}');}catch(e){return {};}}
    function saveFirestoreSeedStatus(data){localStorage.setItem(FIRESTORE_SEED_STATUS_KEY,JSON.stringify({...firestoreSeedStatusLocal(),...data,updatedAt:new Date().toISOString()}));}

    function syncLogLocal(){try{return JSON.parse(localStorage.getItem(FIRESTORE_SYNC_LOG_KEY)||'[]');}catch(e){return [];}}
    function saveSyncLog(logs){localStorage.setItem(FIRESTORE_SYNC_LOG_KEY,JSON.stringify((logs||[]).slice(0,50)));}
    function syncActionLabel(action){return {check:'Cek Firestore',upload:'Upload Cloud Seed',fetch:'Ambil Cloud Seed',restore:'Restore Cloud Seed',pre_restore_backup:'Backup Pra-Restore',snapshot:'Snapshot Lokal',rules:'Copy Rules',error:'Sync Error',transfer_test:'Uji Transfer',hardening:'Cloud Hardening',backup:'Backup Lokal',backup_review:'Review Backup'}[action]||action;}
    function addSyncLog(action,message='',extra={}){try{const now=new Date().toISOString();const user=state.firebaseAuthUser||{};const profile=normalizeSyncProfile(state.syncProfile||{});const entry={id:`sync_${Date.now()}`,at:now,action,message:message||syncActionLabel(action),userEmail:user.email||profile.email||'',uid:user.uid||'',familyId:firestoreFamilyId?firestoreFamilyId():(profile.familyId||''),path:firestoreSeedPathText?firestoreSeedPathText():'',counts:snapshotCounts? snapshotCounts(null):{},...extra};const logs=[entry,...syncLogLocal()].slice(0,50);saveSyncLog(logs);renderSyncLog();return entry;}catch(e){console.warn('sync log failed',e);}}

    function deviceTransferLocal(){try{return JSON.parse(localStorage.getItem(DEVICE_TRANSFER_TEST_KEY)||'{}');}catch(e){return {};}}
    function saveDeviceTransferStatus(data){localStorage.setItem(DEVICE_TRANSFER_TEST_KEY,JSON.stringify({...deviceTransferLocal(),...data,updatedAt:new Date().toISOString()}));}
    function buildTransferChecklist(){const fb=firebaseConfigStatus();const backup=getLastBackupStatus();const seed=firestoreSeedStatusLocal();const local=snapshotCounts(null);const dataCore=(local.Otonan||0)+(local.Merajan||0)+(local.Pelinggih||0);const logs=syncLogLocal();const done=deviceTransferLocal();const items=[
      {key:'core',label:'Data inti keluarga',ok:dataCore>0,detail:dataCore>0?`Ada ${dataCore} data inti.`:'Isi minimal otonan/merajan/pelinggih dulu.'},
      {key:'backup',label:'Backup lokal',ok:!!backup.lastBackupAt,detail:backup.lastBackupAt?`Backup: ${new Date(backup.lastBackupAt).toLocaleDateString('id-ID')}`:'Buat backup sebelum cloud restore.'},
      {key:'firebase',label:'Firebase Config',ok:fb.ready,detail:fb.ready?'Config lengkap.':`${fb.requiredDone}/${fb.requiredTotal} field wajib lengkap.`},
      {key:'login',label:'Login Google',ok:!!state.firebaseAuthUser,detail:state.firebaseAuthUser?`Login: ${state.firebaseAuthUser.email||state.firebaseAuthUser.uid}`:'Login dulu dari Firebase Auth Pilot.'},
      {key:'upload',label:'Upload Cloud Seed',ok:!!seed.lastUploadedAt||!!state.firestoreSeed.lastUploadedAt,detail:(seed.lastUploadedAt||state.firestoreSeed.lastUploadedAt)?`Upload: ${new Date(seed.lastUploadedAt||state.firestoreSeed.lastUploadedAt).toLocaleString('id-ID')}`:'Upload seed dari perangkat sumber.'},
      {key:'fetch',label:'Ambil/Review Seed',ok:!!seed.lastFetchedAt||!!state.firestoreSeed.lastFetched,detail:(seed.lastFetchedAt||state.firestoreSeed.lastFetched)?'Seed pernah diambil untuk review.':'Ambil seed di perangkat tujuan.'},
      {key:'log',label:'Sync Log',ok:logs.length>0,detail:logs.length?`${logs.length} log tersimpan.`:'Belum ada log sync.'},
      {key:'tested',label:'Uji transfer',ok:!!done.lastTransferTestAt,detail:done.lastTransferTestAt?`Tercatat: ${new Date(done.lastTransferTestAt).toLocaleString('id-ID')}`:'Catat setelah berhasil di HP/browser baru.'}
    ];const ready=items.filter(i=>i.ok).length;return {items,ready,total:items.length,percent:Math.round(ready/items.length*100),decision:ready>=7?'Siap lanjut desain sync real penuh.':ready>=5?'Siap uji HP/browser baru, tapi jangan aktifkan sync otomatis dulu.':'Belum siap transfer. Lengkapi checklist dari atas.'};}
    function renderDeviceTransferTest(){const data=buildTransferChecklist();const pill=document.getElementById('transferScorePill');if(pill)pill.textContent=`${data.percent}% siap`;const box=document.getElementById('transferChecklistCards');if(box)box.innerHTML=data.items.map(i=>`<div class="transfer-card ${i.ok?'ok':'todo'}"><strong>${i.ok?'✅':'⬜'} ${i.label}</strong><span>${i.detail}</span></div>`).join('');const status=document.getElementById('deviceTransferStatus');if(status)status.textContent=data.decision;}
    function transferChecklistText(target='old'){const data=buildTransferChecklist();const profile=normalizeSyncProfile(state.syncProfile||{});const lines=[`KD-Bali Device Transfer Checklist - ${target==='old'?'HP lama / sumber':'HP baru / tujuan'}`,`Tanggal: ${new Date().toLocaleString('id-ID')}`,`User: ${(state.firebaseAuthUser?.email||profile.email||'-')}`,`Family ID: ${firestoreFamilyId()}`,`Kesiapan: ${data.percent}%`,'' ];if(target==='old')lines.push('Urutan HP lama:', '1. Cek data inti keluarga/adat.', '2. Export Backup Lokal.', '3. Login Google.', '4. Upload Cloud Seed ke Firestore.', '5. Catat Snapshot Lokal.', '6. Jangan hapus app/data lama sebelum HP baru berhasil restore.');else lines.push('Urutan HP baru:', '1. Buka KD-Bali versi terbaru.', '2. Masukkan Firebase Config yang sama.', '3. Login Google dengan email yang sama.', '4. Ambil Seed dari Cloud.', '5. Review local-vs-cloud.', '6. Backup lokal kosong/awal.', '7. Restore Cloud Seed.', '8. Cek Otonan, Merajan, Pelinggih, Checklist, Arsip.');lines.push('', 'Checklist status:');data.items.forEach(i=>lines.push(`${i.ok?'[OK]':'[ ]'} ${i.label} - ${i.detail}`));lines.push('', 'Keputusan:', data.decision);return lines.join('\n');}
    async function copyTransferChecklist(target){const text=transferChecklistText(target);try{await navigator.clipboard.writeText(text);setFirestoreSeedStatus(`Checklist ${target==='old'?'HP lama':'HP baru'} disalin.`, 'ok');}catch(e){alert(text);}}
    function recordTransferTest(){saveDeviceTransferStatus({lastTransferTestAt:new Date().toISOString(),userEmail:state.firebaseAuthUser?.email||normalizeSyncProfile(state.syncProfile).email||'',familyId:firestoreFamilyId(),counts:snapshotCounts(null)});addSyncLog('transfer_test','Uji pindah HP/browser baru ditandai berhasil.');renderDeviceTransferTest();renderSyncConfidencePanel();setFirestoreSeedStatus('Uji transfer berhasil dicatat. Jangan lanjut sync real penuh sebelum hasil ini stabil di minimal 2 perangkat.', 'ok');}
    function exportTransferChecklist(){downloadText(`kd-bali-device-transfer-checklist-${new Date().toLocaleDateString('sv-SE')}.txt`,transferChecklistText('old')+'\n\n---\n\n'+transferChecklistText('new'),'text/plain');setFirestoreSeedStatus('Transfer checklist TXT berhasil dibuat.', 'ok');}

    function syncConfidenceLocal(){try{return JSON.parse(localStorage.getItem(SYNC_CONFIDENCE_KEY)||'{}');}catch(e){return {};}}
    function saveSyncConfidenceStatus(data){localStorage.setItem(SYNC_CONFIDENCE_KEY,JSON.stringify({...syncConfidenceLocal(),...data,updatedAt:new Date().toISOString()}));}
    function buildSyncConfidenceReport(){
      const backup=getLastBackupStatus();
      const fb=firebaseConfigStatus();
      const logs=syncLogLocal();
      const seed=firestoreSeedStatusLocal();
      const transfer=deviceTransferLocal();
      const confidence=syncConfidenceLocal();
      const local=snapshotCounts(null);
      const hasLog=action=>logs.some(l=>l.action===action);
      const lastLog=logs[0];
      const dataTotal=(local.Otonan||0)+(local.Merajan||0)+(local.Pelinggih||0)+(local.Checklist||0)+(local.Arsip||0);
      const transferCounts=transfer.counts||{};
      const transferTotal=(transferCounts.Otonan||0)+(transferCounts.Merajan||0)+(transferCounts.Pelinggih||0)+(transferCounts.Checklist||0)+(transferCounts.Arsip||0);
      const countMatch=!!transfer.lastTransferTestAt && (transferTotal===0 || transferTotal===dataTotal);
      const checks=[
        {key:'data',label:'Data inti ada',ok:dataTotal>0,detail:dataTotal>0?`Total data lokal: ${dataTotal}`:'Isi minimal otonan/merajan/pelinggih/checklist/arsip dulu.'},
        {key:'backup',label:'Backup lokal ada',ok:!!backup.lastBackupAt,detail:backup.lastBackupAt?`Backup: ${new Date(backup.lastBackupAt).toLocaleString('id-ID')}`:'Buat backup lokal sebelum sync/restore.'},
        {key:'firebase',label:'Firebase config siap',ok:!!fb.ready,detail:fb.ready?'Config lengkap.':'Lengkapi Firebase Setup Kit.'},
        {key:'login',label:'Login Google aktif',ok:!!state.firebaseAuthUser?.uid,detail:state.firebaseAuthUser?.email||'Login Google lewat Auth Pilot.'},
        {key:'upload',label:'Cloud Seed pernah upload',ok:!!seed.lastUploadedAt||hasLog('upload'),detail:seed.lastUploadedAt?`Upload: ${new Date(seed.lastUploadedAt).toLocaleString('id-ID')}`:(hasLog('upload')?'Ada log upload.':'Upload Cloud Seed dari perangkat sumber.')},
        {key:'fetch',label:'Cloud Seed pernah diambil',ok:!!seed.lastFetchedAt||hasLog('fetch'),detail:seed.lastFetchedAt?`Fetch: ${new Date(seed.lastFetchedAt).toLocaleString('id-ID')}`:(hasLog('fetch')?'Ada log fetch.':'Ambil Cloud Seed di perangkat tujuan.')},
        {key:'restore',label:'Restore pernah berhasil',ok:hasLog('restore'),detail:hasLog('restore')?'Ada log restore berhasil.':'Restore di browser/HP tujuan belum tercatat.'},
        {key:'transfer',label:'Uji transfer ditandai berhasil',ok:!!transfer.lastTransferTestAt,detail:transfer.lastTransferTestAt?`Transfer test: ${new Date(transfer.lastTransferTestAt).toLocaleString('id-ID')}`:'Klik Catat Uji Transfer Berhasil setelah cek perangkat baru.'},
        {key:'counts',label:'Jumlah data konsisten',ok:countMatch,detail:countMatch?'Counts transfer dan lokal terlihat konsisten.':'Cek ulang jumlah data lokal vs hasil transfer.'},
        {key:'log',label:'Sync log tersedia',ok:logs.length>=3,detail:`${logs.length} log tersimpan${lastLog?` · terakhir: ${syncActionLabel(lastLog.action)}`:''}`}
      ];
      const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
      let level='Belum aman';
      let decision='Jangan aktifkan sync otomatis. Lengkapi upload/fetch/restore dan uji pindah HP dulu.';
      if(score>=90){level='Aman untuk lanjut hardening';decision='Pilot sync sudah cukup kuat untuk masuk Cloud Sync Hardening, tetapi tetap belum auto-sync penuh.';}
      else if(score>=70){level='Cukup untuk uji lanjutan';decision='Boleh lanjut uji di perangkat kedua/ketiga, tapi jangan aktifkan sync otomatis penuh.';}
      else if(score>=50){level='Setengah siap';decision='Flow dasar mulai terbentuk, tetapi restore/transfer/log belum cukup kuat.';}
      return {checks,score,level,decision,local,seed,transfer,confidence,logs};
    }
    function renderSyncConfidencePanel(){
      const panel=document.getElementById('syncConfidencePanel');if(!panel)return;
      const report=buildSyncConfidenceReport();
      const pill=document.getElementById('syncConfidencePill');if(pill)pill.textContent=`${report.score}% · ${report.level}`;
      const cards=document.getElementById('syncConfidenceCards');if(cards)cards.innerHTML=report.checks.map(c=>`<div class="transfer-card ${c.ok?'ok':'todo'}"><strong>${c.ok?'✅':'⬜'} ${c.label}</strong><span>${c.detail}</span></div>`).join('');
      const decision=document.getElementById('syncConfidenceDecision');if(decision)decision.textContent=report.decision;
      const meta=document.getElementById('syncConfidenceMeta');
      if(meta){const seed=report.seed||{};const conf=report.confidence||{};meta.textContent=`Cloud path: ${seed.path||firestoreSeedPathText()} · upload terakhir: ${seed.lastUploadedAt?new Date(seed.lastUploadedAt).toLocaleString('id-ID'):'-'} · fetch terakhir: ${seed.lastFetchedAt?new Date(seed.lastFetchedAt).toLocaleString('id-ID'):'-'} · confidence terakhir: ${conf.lastAcceptedAt?new Date(conf.lastAcceptedAt).toLocaleString('id-ID'):'-'}`;}
      const status=document.getElementById('syncConfidenceStatus');if(status)status.textContent=`${report.level}. ${report.decision}`;
    }
    function syncConfidenceReportText(){
      const r=buildSyncConfidenceReport();
      const profile=normalizeSyncProfile(state.syncProfile||{});
      const lines=['KD-Bali Sync Confidence Report',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Score: ${r.score}%`, `Level: ${r.level}`, `Keputusan: ${r.decision}`,`User: ${state.firebaseAuthUser?.email||profile.email||'-'}`,`Family ID: ${firestoreFamilyId()}`,`Cloud path: ${firestoreSeedPathText()}`,'','Local counts:',`Otonan ${r.local.Otonan||0} · Merajan ${r.local.Merajan||0} · Pelinggih ${r.local.Pelinggih||0} · Checklist ${r.local.Checklist||0} · Arsip ${r.local.Arsip||0}`,'','Checklist:'];
      r.checks.forEach(c=>lines.push(`${c.ok?'[OK]':'[ ]'} ${c.label} - ${c.detail}`));
      lines.push('','Catatan: ini pilot Cloud Seed, belum real-time multi-device sync penuh. Lanjutkan ke Cloud Sync Hardening hanya setelah uji di minimal dua perangkat stabil.');
      return lines.join('\n');
    }
    function markSyncConfidenceAccepted(){
      const report=buildSyncConfidenceReport();
      if(report.score<70&&!confirm('Score confidence masih di bawah 70%. Tetap tandai aman?'))return;
      saveSyncConfidenceStatus({lastAcceptedAt:new Date().toISOString(),score:report.score,level:report.level,decision:report.decision,counts:report.local,userEmail:state.firebaseAuthUser?.email||normalizeSyncProfile(state.syncProfile).email||'',familyId:firestoreFamilyId()});
      addSyncLog('confidence',`Sync pilot ditandai: ${report.score}% · ${report.level}.`);
      renderSyncConfidencePanel();
      setFirestoreSeedStatus('Sync Confidence dicatat. Gunakan laporan ini sebagai dasar sebelum Cloud Sync Hardening.', 'ok');
    }
    function exportSyncConfidenceReport(){downloadText(`kd-bali-sync-confidence-${new Date().toLocaleDateString('sv-SE')}.txt`,syncConfidenceReportText(),'text/plain');setFirestoreSeedStatus('Sync Confidence Report TXT berhasil dibuat.', 'ok');}
    function resetSyncConfidence(){if(!confirm('Reset status Sync Confidence lokal? Ini tidak menghapus data kalender/adat.'))return;localStorage.removeItem(SYNC_CONFIDENCE_KEY);addSyncLog('confidence','Sync Confidence direset.');renderSyncConfidencePanel();setFirestoreSeedStatus('Sync Confidence direset.', 'ok');}
    function renderSyncLog(){const logs=syncLogLocal();const list=document.getElementById('syncLogList');const pill=document.getElementById('syncLogPill');if(pill)pill.textContent=`${logs.length} log`;if(!list)return;if(!logs.length){list.innerHTML='<div class="sync-log-empty">Belum ada riwayat sync. Setelah upload/fetch/restore cloud seed, log akan muncul di sini.</div>';return;}list.innerHTML=logs.slice(0,8).map(l=>`<div class="sync-log-item"><b>${syncActionLabel(l.action)} · ${new Date(l.at).toLocaleString('id-ID')}</b><span>${l.message||''}</span><span>${l.userEmail?`User: ${l.userEmail} · `:''}Family: ${l.familyId||'-'}</span><span>Otonan ${l.counts?.Otonan||0} · Merajan ${l.counts?.Merajan||0} · Pelinggih ${l.counts?.Pelinggih||0} · Checklist ${l.counts?.Checklist||0} · Arsip ${l.counts?.Arsip||0}</span></div>`).join('');}
    function exportSyncLogCSV(){const logs=syncLogLocal();if(!logs.length){alert('Sync Log masih kosong.');return;}const header=['at','action','message','userEmail','familyId','path','otonan','merajan','pelinggih','checklist','arsip'];const rows=logs.map(l=>[l.at,syncActionLabel(l.action),l.message||'',l.userEmail||'',l.familyId||'',l.path||'',l.counts?.Otonan||0,l.counts?.Merajan||0,l.counts?.Pelinggih||0,l.counts?.Checklist||0,l.counts?.Arsip||0]);const csv=[header,...rows].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');downloadText(`kd-bali-sync-log-${new Date().toLocaleDateString('sv-SE')}.csv`,csv,'text/csv');setFirestoreSeedStatus('Sync Log CSV berhasil dibuat.', 'ok');}
    function captureSyncSnapshot(){addSyncLog('snapshot','Snapshot lokal dicatat manual sebelum/ setelah perubahan cloud.');setFirestoreSeedStatus('Snapshot lokal dicatat di Sync History.', 'ok');}
    function clearSyncLog(){if(!confirm('Bersihkan Sync Log lokal di browser ini? Ini tidak menghapus data kalender/adat.'))return;saveSyncLog([]);renderSyncLog();setFirestoreSeedStatus('Sync Log lokal sudah dibersihkan.', 'ok');}
    async function loadFirestoreModules(){if(firestoreRuntime.modules)return firestoreRuntime.modules;const fsMod=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');firestoreRuntime.modules={fsMod};return firestoreRuntime.modules;}
    function firestoreFamilyId(){const profile=normalizeSyncProfile(state.syncProfile);const user=state.firebaseAuthUser;return profile.familyId||safeSlug(profile.email||user?.email||user?.uid||'family');}
    function firestoreSeedDocPath(){const user=state.firebaseAuthUser;const familyId=firestoreFamilyId();if(!user?.uid)return null;return ['users',user.uid,'families',familyId,'cloudSeeds','latest'];}
    function firestoreSeedPathText(){const path=firestoreSeedDocPath();return path?path.join('/'):'Login Google dulu untuk membuat path users/{uid}/families/{familyId}/cloudSeeds/latest';}
    function buildFirestoreSeedPayload(){const backup=buildBackupPayload();const user=state.firebaseAuthUser||{};const profile=normalizeSyncProfile(state.syncProfile);return {...backup,phase:'2.6',type:'firestore_cloud_seed',seedVersion:1,cloudSchema:'users/{uid}/families/{familyId}/cloudSeeds/latest',uploadedBy:{uid:user.uid||'',email:user.email||profile.email||'',displayName:user.displayName||''},familyId:firestoreFamilyId(),cloudMeta:{createdAt:backup.exportedAt,updatedAt:new Date().toISOString(),syncMode:'manual_seed_pilot',warning:'Pilot seed sync. Belum real-time multi-device dan belum subcollection final.'}};}
    function adatFromSeed(seed){return seed?.adatMemory||{places:seed?.adatPlaces||[],shrines:seed?.shrines||[],decisions:seed?.adatDecisions||[],bantenTemplates:seed?.bantenTemplates||[]};}
    function familyFromSeed(seed){return seed?.family||seed?.members||[];}
    function checklistsFromSeed(seed){if(Array.isArray(seed?.eventChecklists)){return seed.eventChecklists.reduce((acc,c)=>{if(c?.instanceId)acc[c.instanceId]=c;return acc;},{});}return seed?.eventChecklists||{};}
    function seedMetrics(seed){const family=seed?familyFromSeed(seed):state.family||[];const adat=seed?adatFromSeed(seed):state.adatMemory||{};const checks=seed?checklistsFromSeed(seed):state.eventChecklists||{};const archives=seed?.ceremonyArchives||state.ceremonyArchives||[];return [{label:'Otonan',value:(family||[]).filter(m=>m.otonan?.enabled).length,detail:'anggota'}, {label:'Merajan',value:(adat.places||[]).length,detail:'tempat'}, {label:'Pelinggih',value:(adat.shrines||[]).length,detail:'data'}, {label:'Checklist',value:Object.keys(checks||{}).length,detail:'event'}, {label:'Arsip',value:(archives||[]).length,detail:'catatan'}, {label:'Seed',value:seed?.exportedAt?new Date(seed.exportedAt).toLocaleDateString('id-ID'):'lokal',detail:seed?.type||'preview'}];}
    function snapshotCounts(seed=null){const metrics=seedMetrics(seed);return Object.fromEntries(metrics.map(m=>[m.label,m.value]));}
    function renderRestoreReview(){const box=document.getElementById('restoreReviewSummary');const warn=document.getElementById('restoreReviewWarning');if(!box||!warn)return;const seed=state.firestoreSeed?.lastFetched||null;const local=snapshotCounts(null);const cloud=seed?snapshotCounts(seed):null;function card(title,data,meta){return `<div class="restore-review-card"><b>${title}</b><span>Otonan: ${data.Otonan||0} · Merajan: ${data.Merajan||0} · Pelinggih: ${data.Pelinggih||0}</span><span>Checklist: ${data.Checklist||0} · Arsip: ${data.Arsip||0}</span><span>${meta}</span></div>`;}box.innerHTML=card('Data lokal browser ini',local,'Sumber: localStorage perangkat ini')+card('Cloud Seed terakhir',cloud||{Otonan:0,Merajan:0,Pelinggih:0,Checklist:0,Arsip:0},seed?`Exported: ${seed.exportedAt?new Date(seed.exportedAt).toLocaleString('id-ID'):'-'}`:'Belum diambil dari Firestore');if(!seed){warn.className='restore-warning';warn.textContent='Belum ada Cloud Seed yang diambil. Klik Ambil Seed dari Cloud dulu sebelum restore.';return;}const localTotal=(local.Otonan||0)+(local.Merajan||0)+(local.Pelinggih||0)+(local.Checklist||0)+(local.Arsip||0);const cloudTotal=(cloud.Otonan||0)+(cloud.Merajan||0)+(cloud.Pelinggih||0)+(cloud.Checklist||0)+(cloud.Arsip||0);if(localTotal>0&&cloudTotal!==localTotal){warn.className='restore-warning';warn.textContent=`Perhatian: jumlah data lokal (${localTotal}) berbeda dengan Cloud Seed (${cloudTotal}). Backup lokal dulu sebelum restore.`;}else{warn.className='restore-warning restore-safe';warn.textContent='Review aman. Tetap disarankan download backup lokal sebelum restore.';}}
    function downloadPreRestoreBackup(){const payload=buildBackupPayload();payload.type='pre_restore_local_backup';payload.phase='2.6';payload.reason='Backup otomatis/manual sebelum restore Cloud Seed Firestore.';downloadText(`kd-bali-pre-restore-backup-${new Date().toLocaleDateString('sv-SE')}.json`,JSON.stringify(payload,null,2),'application/json');localStorage.setItem(BACKUP_STATUS_KEY,JSON.stringify({lastBackupAt:new Date().toISOString(),familyCount:payload.family.length,adatPlaceCount:payload.adatMemory?.places?.length||0,shrineCount:payload.adatMemory?.shrines?.length||0,preRestore:true}));renderSetupProgress();renderCloudReadinessGate();if(typeof renderAutoBackupReminder==='function')renderAutoBackupReminder();addSyncLog('pre_restore_backup','Backup lokal sebelum restore dibuat.');setFirestoreSeedStatus('Backup lokal sebelum restore sudah dibuat. Setelah itu baru restore jika sudah yakin.', 'ok');}
    function renderFirestoreSeedPilot(){
      const pathBox=document.getElementById('firestoreSeedPathBox');if(pathBox)pathBox.innerHTML=`<strong>Cloud path</strong><code>${firestoreSeedPathText()}</code>`;
      const metricEl=document.getElementById('firestoreSeedMetrics');if(metricEl)metricEl.innerHTML=seedMetrics(state.firestoreSeed?.lastFetched||null).map(m=>`<div class="firestore-sync-metric"><strong>${m.value}</strong><span>${m.label} · ${m.detail}</span></div>`).join('');
      renderRestoreReview();
      renderSyncLog();
      renderDeviceTransferTest();
      renderSyncConfidencePanel();
      renderCloudSyncHardening();
      renderAutoBackupReminder();
      const local=firestoreSeedStatusLocal();
      if(state.firestoreSeed?.lastFetched){setFirestoreSeedStatus(`Seed cloud terakhir berhasil diambil. Review perbedaan local-vs-cloud, download backup lokal, lalu restore jika sudah yakin. Exported: ${state.firestoreSeed.lastFetched.exportedAt||'-'}.`, 'fetched');}
      else if(local.lastUploadedAt){setFirestoreSeedStatus(`Cloud Seed terakhir diupload: ${new Date(local.lastUploadedAt).toLocaleString('id-ID')}. Ambil seed untuk review sebelum restore.`, 'uploaded');}
      else if(state.firebaseAuthUser){setFirestoreSeedStatus('Login aktif. Kamu bisa cek Firestore lalu upload Cloud Seed.', 'ok');}
      else setFirestoreSeedStatus('Belum login Google. Jalankan Firebase Auth Pilot dulu.', 'info');
    }
    async function initFirestoreRuntime(){
      if(!state.firebaseAuthUser)throw new Error('Belum login Google. Login dulu lewat Firebase Auth Pilot.');
      const status=firebaseConfigStatus();if(!status.ready)throw new Error('Firebase config belum lengkap.');
      if(!firebaseAuthRuntime.auth)await initFirebaseAuthRuntime();
      const {fsMod}=await loadFirestoreModules();
      const app=firebaseAuthRuntime.app;
      const db=fsMod.getFirestore(app);
      firestoreRuntime.db=db;firestoreRuntime.ready=true;
      const path=firestoreSeedDocPath();firestoreRuntime.lastDocRef=fsMod.doc(db,...path);
      return {db,fsMod,docRef:firestoreRuntime.lastDocRef};
    }
    async function checkFirestoreSeed(){try{setFirestoreSeedStatus('Mengecek Firestore...', 'info');const {fsMod,docRef}=await initFirestoreRuntime();const snap=await fsMod.getDoc(docRef);if(snap.exists()){state.firestoreSeed.lastFetched=snap.data();state.firestoreSeed.lastFetchedAt=new Date().toISOString();saveFirestoreSeedStatus({lastFetchedAt:state.firestoreSeed.lastFetchedAt,exists:true,path:firestoreSeedPathText()});renderFirestoreSeedPilot();addSyncLog('check','Firestore siap. Cloud Seed sudah ada.');setFirestoreSeedStatus('Firestore siap. Cloud Seed sudah ada dan bisa diambil.', 'fetched');}else{saveFirestoreSeedStatus({checkedAt:new Date().toISOString(),exists:false,path:firestoreSeedPathText()});renderFirestoreSeedPilot();addSyncLog('check','Firestore siap. Belum ada Cloud Seed.');setFirestoreSeedStatus('Firestore siap. Belum ada Cloud Seed, silakan upload seed dari perangkat ini.', 'ok');}}catch(err){console.error(err);addSyncLog('error','Cek Firestore gagal: '+(err?.message||err));setFirestoreSeedStatus('Cek Firestore gagal: '+(err?.message||err), 'error');alert('Firestore belum siap. Cek Firebase Config, login Google, Firestore Database sudah dibuat, dan rules mengizinkan user login. Detail: '+(err?.message||err));}}
    async function uploadFirestoreSeed(){try{if(!confirm('Upload Cloud Seed akan menyimpan data lokal browser ini ke Firestore untuk akun login saat ini. Lanjut?'))return;setFirestoreSeedStatus('Mengupload Cloud Seed...', 'info');const {fsMod,docRef}=await initFirestoreRuntime();const seed=buildFirestoreSeedPayload();await fsMod.setDoc(docRef,seed,{merge:false});state.syncProfile={...normalizeSyncProfile(state.syncProfile),lastCloudSeedAt:new Date().toISOString(),syncMode:'firebase_ready'};saveCloudSyncProfile();state.firestoreSeed.lastUploadedAt=state.syncProfile.lastCloudSeedAt;saveFirestoreSeedStatus({lastUploadedAt:state.firestoreSeed.lastUploadedAt,path:firestoreSeedPathText(),familyId:firestoreFamilyId()});renderCloudSyncStatus();renderCloudReadinessGate();renderFirestoreSeedPilot();addSyncLog('upload','Cloud Seed berhasil diupload ke Firestore.',{seedExportedAt:seed.exportedAt});setFirestoreSeedStatus('Cloud Seed berhasil diupload. Di HP baru: login Google → Ambil Seed dari Cloud → Restore.', 'uploaded');}catch(err){console.error(err);addSyncLog('error','Upload Cloud Seed gagal: '+(err?.message||err));setFirestoreSeedStatus('Upload Cloud Seed gagal: '+(err?.message||err), 'error');alert('Upload Firestore gagal. Biasanya karena Firestore belum dibuat atau rules belum mengizinkan write user login. Detail: '+(err?.message||err));}}
    async function fetchFirestoreSeed(){try{setFirestoreSeedStatus('Mengambil Cloud Seed...', 'info');const {fsMod,docRef}=await initFirestoreRuntime();const snap=await fsMod.getDoc(docRef);if(!snap.exists()){state.firestoreSeed.lastFetched=null;renderFirestoreSeedPilot();addSyncLog('fetch','Cloud Seed belum ada untuk akun/family ini.');setFirestoreSeedStatus('Cloud Seed belum ada untuk akun/family ini. Upload dari HP/browser lama dulu.', 'ok');return;}state.firestoreSeed.lastFetched=snap.data();state.firestoreSeed.lastFetchedAt=new Date().toISOString();saveFirestoreSeedStatus({lastFetchedAt:state.firestoreSeed.lastFetchedAt,exists:true,path:firestoreSeedPathText()});renderFirestoreSeedPilot();addSyncLog('fetch','Cloud Seed berhasil diambil untuk review.',{seedExportedAt:state.firestoreSeed.lastFetched?.exportedAt||''});setFirestoreSeedStatus('Cloud Seed berhasil diambil. Klik Restore ke Browser Ini untuk memulihkan data lokal.', 'fetched');}catch(err){console.error(err);addSyncLog('error','Ambil Cloud Seed gagal: '+(err?.message||err));setFirestoreSeedStatus('Ambil Cloud Seed gagal: '+(err?.message||err), 'error');alert('Ambil seed gagal. Detail: '+(err?.message||err));}}
    function restoreFirestoreSeedToLocal(){const seed=state.firestoreSeed?.lastFetched;if(!seed){alert('Belum ada seed yang diambil. Klik Ambil Seed dari Cloud dulu.');return;}const ack=document.getElementById('restoreAckCheckbox');if(ack&&!ack.checked){alert('Centang konfirmasi Restore Review dulu. Ini sengaja dibuat agar data lokal tidak tertimpa tanpa sadar.');return;}if(!confirm('Restore akan menimpa data lokal browser ini dengan Cloud Seed terakhir. Backup lokal akan diunduh lebih dulu. Lanjut?'))return;downloadPreRestoreBackup();state.family=familyFromSeed(seed).map(normalizeMember);state.adatMemory=normalizeAdatMemory(adatFromSeed(seed));state.eventChecklists=normalizeEventChecklists(checklistsFromSeed(seed));state.ceremonyArchives=normalizeCeremonyArchives(seed.ceremonyArchives||[]);state.syncProfile=normalizeSyncProfile(seed.syncProfile||seed.profile||state.syncProfile);saveFamily();saveAdatMemory();saveEventChecklists();saveCeremonyArchives();saveCloudSyncProfile();if(ack)ack.checked=false;renderFamily();renderAdatMemory();renderMonth(+state.selectedDate.slice(5,7));renderSetupProgress();renderWizardGuardrails();renderCloudReadinessGate();renderFirestoreSeedPilot();addSyncLog('restore','Restore Cloud Seed ke browser ini berhasil.',{seedExportedAt:seed.exportedAt||''});setFirestoreSeedStatus('Restore berhasil. Data cloud seed sekarang tersimpan lokal di browser ini. Backup lokal sebelum restore sudah dibuat.', 'fetched');}
    function firestoreRulesText(){return `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /users/{userId}/families/{familyId}/cloudSeeds/{seedId} {\n      allow read, write: if request.auth != null && request.auth.uid == userId;\n    }\n  }\n}`;}
    async function copyFirestoreRules(){const text=firestoreRulesText();try{await navigator.clipboard.writeText(text);addSyncLog('rules','Rules contoh Firestore disalin.');setFirestoreSeedStatus('Rules contoh disalin. Tempel di Firebase Console → Firestore Database → Rules untuk pilot pribadi.', 'ok');}catch(e){alert(text);}}
    function cloudHardeningLocal(){try{return JSON.parse(localStorage.getItem(CLOUD_HARDENING_KEY)||'{}');}catch(e){return {};}}
    function saveCloudHardeningStatus(data){localStorage.setItem(CLOUD_HARDENING_KEY,JSON.stringify({...cloudHardeningLocal(),...data,updatedAt:new Date().toISOString()}));}
    function buildCloudHardeningReport(){
      const confidence=buildSyncConfidenceReport();
      const backup=getLastBackupStatus();
      const seed=firestoreSeedStatusLocal();
      const transfer=deviceTransferLocal();
      const logs=syncLogLocal();
      const fb=firebaseConfigStatus();
      const baseline=cloudHardeningLocal();
      const local=snapshotCounts(null);
      const total=(local.Otonan||0)+(local.Merajan||0)+(local.Pelinggih||0)+(local.Checklist||0)+(local.Arsip||0);
      const backupAgeDays=backup.lastBackupAt?Math.round((Date.now()-new Date(backup.lastBackupAt).getTime())/86400000):999;
      const seedAgeDays=seed.lastUploadedAt?Math.round((Date.now()-new Date(seed.lastUploadedAt).getTime())/86400000):999;
      const hasLog=a=>logs.some(l=>l.action===a);
      const checks=[
        {key:'confidence',label:'Sync Confidence kuat',ok:confidence.score>=70||!!confidence.confidence.acceptedAt,detail:`Confidence ${confidence.score}% · ${confidence.level}`},
        {key:'backupFresh',label:'Backup lokal baru',ok:!!backup.lastBackupAt&&backupAgeDays<=7,detail:backup.lastBackupAt?`Backup ${backupAgeDays} hari lalu`:'Belum ada backup lokal.'},
        {key:'seedUpload',label:'Cloud Seed upload ada',ok:!!seed.lastUploadedAt||hasLog('upload'),detail:seed.lastUploadedAt?`Upload ${seedAgeDays} hari lalu`:'Belum ada status upload.'},
        {key:'seedFetch',label:'Cloud Seed pernah direview',ok:!!seed.lastFetchedAt||hasLog('fetch'),detail:seed.lastFetchedAt?`Fetch: ${new Date(seed.lastFetchedAt).toLocaleString('id-ID')}`:'Ambil seed dari cloud untuk review.'},
        {key:'restore',label:'Restore tercatat',ok:hasLog('restore'),detail:hasLog('restore')?'Ada log restore berhasil.':'Restore belum tercatat.'},
        {key:'transfer',label:'Transfer test berhasil',ok:!!transfer.lastTransferTestAt,detail:transfer.lastTransferTestAt?`Test: ${new Date(transfer.lastTransferTestAt).toLocaleString('id-ID')}`:'Catat uji pindah HP setelah perangkat baru aman.'},
        {key:'rules',label:'Rules draft siap',ok:!!fb.ready&&!!state.firebaseAuthUser?.uid,detail:fb.ready?(state.firebaseAuthUser?.uid?'Auth+config siap untuk rules user scoped.':'Login Google dulu untuk rules user scoped.'):'Firebase config belum lengkap.'},
        {key:'baseline',label:'Baseline dikunci',ok:!!baseline.lockedAt,detail:baseline.lockedAt?`Locked: ${new Date(baseline.lockedAt).toLocaleString('id-ID')}`:'Lock baseline setelah data dan cloud seed aman.'},
        {key:'logDepth',label:'Sync log cukup',ok:logs.length>=5,detail:`${logs.length} log tersimpan.`},
        {key:'manualOnly',label:'Policy manual seed',ok:true,detail:'Auto-sync tetap off sampai hardening selesai.'}
      ];
      const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
      let level='Belum siap hardening';
      let decision='Tetap pakai manual Cloud Seed. Jangan aktifkan real-time sync.';
      if(score>=90){level='Siap lanjut Cloud Sync Real Design';decision='Hardening kuat. Berikutnya boleh desain sync real bertahap, tetap dengan conflict guard dan backup otomatis.';}
      else if(score>=70){level='Hardening cukup untuk uji lanjutan';decision='Boleh lanjut uji multi-device lebih ketat. Auto-sync penuh masih ditunda.';}
      else if(score>=50){level='Hardening parsial';decision='Perkuat backup, restore, transfer test, dan baseline sebelum lanjut.';}
      return {checks,score,level,decision,confidence,backup,seed,transfer,logs,baseline,local,total,backupAgeDays,seedAgeDays};
    }
    function renderCloudSyncHardening(){
      const panel=document.getElementById('cloudHardeningPanel');if(!panel)return;
      const r=buildCloudHardeningReport();
      const pill=document.getElementById('cloudHardeningPill');if(pill)pill.textContent=`${r.score}% · ${r.level}`;
      const cards=document.getElementById('cloudHardeningCards');if(cards)cards.innerHTML=r.checks.map(c=>`<div class="transfer-card ${c.ok?'ok':'todo'}"><strong>${c.ok?'✅':'⬜'} ${c.label}</strong><span>${c.detail}</span></div>`).join('');
      const policy=document.getElementById('cloudHardeningPolicy');if(policy)policy.textContent=`${r.decision} Policy: manual Cloud Seed only; real-time sync belum aktif.`;
      const base=document.getElementById('cloudHardeningBaseline');if(base){base.textContent=r.baseline.lockedAt?`Baseline ${new Date(r.baseline.lockedAt).toLocaleString('id-ID')} · score ${r.baseline.score||0}% · data ${r.baseline.total||0} · ${r.baseline.path||firestoreSeedPathText()}`:'Belum ada baseline. Lock setelah upload, fetch, restore review, dan transfer test aman.';}
      const status=document.getElementById('cloudHardeningStatus');if(status)status.textContent=`${r.level}. ${r.decision}`;
    }
    function cloudHardeningReportText(){
      const r=buildCloudHardeningReport();const profile=normalizeSyncProfile(state.syncProfile||{});
      const lines=['KD-Bali Cloud Sync Hardening Report',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Score: ${r.score}%`, `Level: ${r.level}`, `Keputusan: ${r.decision}`,`User: ${state.firebaseAuthUser?.email||profile.email||'-'}`,`Family ID: ${firestoreFamilyId()}`,`Cloud path: ${firestoreSeedPathText()}`,`Policy: manual Cloud Seed only; real-time sync OFF`, '', 'Counts:',`Otonan ${r.local.Otonan||0} · Merajan ${r.local.Merajan||0} · Pelinggih ${r.local.Pelinggih||0} · Checklist ${r.local.Checklist||0} · Arsip ${r.local.Arsip||0}`,'','Checklist:'];
      r.checks.forEach(c=>lines.push(`${c.ok?'[OK]':'[ ]'} ${c.label} - ${c.detail}`));
      if(r.baseline.lockedAt){lines.push('',`Baseline locked: ${new Date(r.baseline.lockedAt).toLocaleString('id-ID')}`,`Baseline score: ${r.baseline.score||0}%`,`Baseline total data: ${r.baseline.total||0}`);}
      lines.push('', 'Next:', r.score>=90?'Desain Cloud Sync Real bertahap dengan conflict guard.':'Lengkapi checklist sebelum sync real.');
      return lines.join('\n');
    }
    function lockCloudBaseline(){const r=buildCloudHardeningReport();if(r.score<70&&!confirm(`Hardening baru ${r.score}%. Tetap lock baseline? Sebaiknya minimal 70%.`))return;saveCloudHardeningStatus({lockedAt:new Date().toISOString(),score:r.score,level:r.level,total:r.total,counts:r.local,path:firestoreSeedPathText(),seedUploadedAt:r.seed.lastUploadedAt||'',seedFetchedAt:r.seed.lastFetchedAt||'',userEmail:state.firebaseAuthUser?.email||normalizeSyncProfile(state.syncProfile).email||''});addSyncLog('hardening','Cloud hardening baseline dikunci.',{score:r.score,total:r.total});renderCloudSyncHardening();setFirestoreSeedStatus('Cloud hardening baseline dikunci. Ini menjadi patokan sebelum sync real.', 'ok');}
    function exportCloudHardeningReport(){downloadText(`kd-bali-cloud-hardening-${new Date().toLocaleDateString('sv-SE')}.txt`,cloudHardeningReportText(),'text/plain');setFirestoreSeedStatus('Cloud Hardening Report TXT berhasil dibuat.', 'ok');}
    function hardenedRulesText(){return `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    function signedIn() { return request.auth != null; }\n    function ownsUserDoc(userId) { return signedIn() && request.auth.uid == userId; }\n\n    match /users/{userId} {\n      allow read, write: if ownsUserDoc(userId);\n      match /families/{familyId}/cloudSeeds/{seedId} {\n        allow read, write: if ownsUserDoc(userId);\n      }\n      match /families/{familyId}/{document=**} {\n        allow read, write: if ownsUserDoc(userId);\n      }\n    }\n  }\n}`;}
    async function copyHardeningRules(){const text=hardenedRulesText();try{await navigator.clipboard.writeText(text);addSyncLog('rules','Hardened rules draft disalin.');setFirestoreSeedStatus('Hardened rules draft disalin. Review lagi sebelum production.', 'ok');}catch(e){alert(text);}}
    function resetCloudHardening(){if(!confirm('Reset Cloud Hardening baseline lokal? Data kalender/adat tidak dihapus.'))return;localStorage.removeItem(CLOUD_HARDENING_KEY);addSyncLog('hardening','Cloud hardening baseline direset.');renderCloudSyncHardening();setFirestoreSeedStatus('Cloud Hardening baseline direset.', 'ok');}


    function autoBackupReminderLocal(){try{return JSON.parse(localStorage.getItem(AUTO_BACKUP_REMINDER_KEY)||'{}');}catch(e){return {};}}
    function saveAutoBackupReminder(data){localStorage.setItem(AUTO_BACKUP_REMINDER_KEY,JSON.stringify({...autoBackupReminderLocal(),...data,updatedAt:new Date().toISOString()}));}
    function buildBackupDisciplineReport(){
      const backup=getLastBackupStatus();
      const seed=firestoreSeedStatusLocal();
      const hard=cloudHardeningLocal();
      const logs=syncLogLocal();
      const local=snapshotCounts(null);
      const total=(local.Otonan||0)+(local.Merajan||0)+(local.Pelinggih||0)+(local.Checklist||0)+(local.Arsip||0);
      const lastReview=autoBackupReminderLocal();
      const backupAgeDays=backup.lastBackupAt?Math.round((Date.now()-new Date(backup.lastBackupAt).getTime())/86400000):999;
      const seedAgeDays=seed.lastUploadedAt?Math.round((Date.now()-new Date(seed.lastUploadedAt).getTime())/86400000):999;
      const cloudAfterBackup=backup.lastBackupAt&&seed.lastUploadedAt?new Date(seed.lastUploadedAt).getTime()>=new Date(backup.lastBackupAt).getTime()-60000:false;
      const hasRestore=logs.some(l=>l.action==='restore');
      const hasUpload=logs.some(l=>l.action==='upload')||!!seed.lastUploadedAt;
      const checks=[
        {key:'data',label:'Data inti terdeteksi',ok:total>0,detail:total?`${total} item lokal: otonan/merajan/pelinggih/checklist/arsip.`:'Belum ada data keluarga/adat yang perlu dibackup.'},
        {key:'backupExists',label:'Backup lokal ada',ok:!!backup.lastBackupAt,detail:backup.lastBackupAt?`Backup terakhir ${new Date(backup.lastBackupAt).toLocaleString('id-ID')}`:'Export Backup JSON dulu.'},
        {key:'backupFresh',label:'Backup masih baru',ok:!!backup.lastBackupAt&&backupAgeDays<=7,detail:backup.lastBackupAt?`Umur backup ${backupAgeDays} hari.`:'Belum ada backup.'},
        {key:'cloudSeed',label:'Cloud Seed tersedia',ok:hasUpload,detail:seed.lastUploadedAt?`Cloud Seed upload ${seedAgeDays} hari lalu.`:'Upload Cloud Seed setelah backup lokal.'},
        {key:'cloudAfterBackup',label:'Urutan backup → cloud aman',ok:cloudAfterBackup||(!seed.lastUploadedAt&&!!backup.lastBackupAt),detail:cloudAfterBackup?'Cloud Seed dibuat setelah backup lokal.':seed.lastUploadedAt?'Cloud Seed lebih baru/lama tidak jelas; backup ulang lalu upload ulang jika ragu.':'Belum upload cloud seed.'},
        {key:'hardening',label:'Hardening baseline ada',ok:!!hard.lockedAt,detail:hard.lockedAt?`Baseline: ${new Date(hard.lockedAt).toLocaleString('id-ID')} · score ${hard.score||0}%`:'Lock baseline setelah transfer test aman.'},
        {key:'restoreAware',label:'Restore pernah diuji/direview',ok:hasRestore||!!lastReview.reviewedAt,detail:hasRestore?'Ada log restore.':lastReview.reviewedAt?`Review backup ${new Date(lastReview.reviewedAt).toLocaleString('id-ID')}`:'Belum ada restore/review backup.'}
      ];
      const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
      let level='Belum aman';let decision='Buat backup lokal dulu sebelum lanjut sync/cloud.';
      if(score>=90){level='Backup discipline aman';decision='Backup dan cloud baseline cukup aman untuk lanjut hardening lanjutan. Real-time sync tetap butuh conflict guard.';}
      else if(score>=70){level='Cukup aman untuk pilot';decision='Boleh lanjut uji cloud manual, tapi backup ulang setelah perubahan besar.';}
      else if(score>=45){level='Parsial';decision='Data sudah mulai ada. Lengkapi backup lokal, Cloud Seed, dan review restore.';}
      const nextBackup=backup.lastBackupAt&&backupAgeDays<7?`Backup masih aman. Review ulang maksimal dalam ${7-backupAgeDays} hari atau setelah perubahan besar.`:'Backup perlu dibuat sekarang atau setelah input data baru.';
      return {checks,score,level,decision,nextBackup,backup,seed,hard,logs,local,total,backupAgeDays,seedAgeDays,lastReview};
    }
    function renderAutoBackupReminder(){
      const panel=document.getElementById('autoBackupReminderPanel');if(!panel)return;
      const r=buildBackupDisciplineReport();
      const pill=document.getElementById('autoBackupPill');if(pill)pill.textContent=`${r.score}% · ${r.level}`;
      const cards=document.getElementById('autoBackupCards');if(cards)cards.innerHTML=r.checks.map(c=>`<div class="transfer-card ${c.ok?'ok':'todo'}"><strong>${c.ok?'✅':'⬜'} ${c.label}</strong><span>${c.detail}</span></div>`).join('');
      const decision=document.getElementById('autoBackupDecision');if(decision)decision.textContent=r.decision;
      const schedule=document.getElementById('autoBackupSchedule');if(schedule)schedule.textContent=r.nextBackup;
      const status=document.getElementById('autoBackupStatus');if(status)status.textContent=`${r.level}. ${r.decision}`;
    }
    function backupDisciplineReportText(){
      const r=buildBackupDisciplineReport();
      const lines=['KD-Bali Backup Discipline Report',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Score: ${r.score}%`, `Level: ${r.level}`, `Keputusan: ${r.decision}`, '', 'Counts:',`Otonan ${r.local.Otonan||0} · Merajan ${r.local.Merajan||0} · Pelinggih ${r.local.Pelinggih||0} · Checklist ${r.local.Checklist||0} · Arsip ${r.local.Arsip||0}`,'','Checklist:'];
      r.checks.forEach(c=>lines.push(`${c.ok?'[OK]':'[ ]'} ${c.label} - ${c.detail}`));
      lines.push('',`Backup terakhir: ${r.backup.lastBackupAt?new Date(r.backup.lastBackupAt).toLocaleString('id-ID'):'-'}`,`Cloud Seed terakhir: ${r.seed.lastUploadedAt?new Date(r.seed.lastUploadedAt).toLocaleString('id-ID'):'-'}`,`Hardening baseline: ${r.hard.lockedAt?new Date(r.hard.lockedAt).toLocaleString('id-ID'):'-'}`,'','Policy: backup lokal dulu, upload Cloud Seed setelah backup, restore harus review + backup pra-restore.');
      return lines.join('\n');
    }
    function exportBackupDisciplineReport(){downloadText(`kd-bali-backup-discipline-${new Date().toLocaleDateString('sv-SE')}.txt`,backupDisciplineReportText(),'text/plain');setFirestoreSeedStatus('Backup Discipline Report TXT berhasil dibuat.', 'ok');}
    function markBackupReminderReviewed(){saveAutoBackupReminder({reviewedAt:new Date().toISOString(),score:buildBackupDisciplineReport().score});addSyncLog('backup_review','Backup discipline direview.');renderAutoBackupReminder();setFirestoreSeedStatus('Backup discipline sudah direview. Tetap buat backup baru setelah perubahan data besar.', 'ok');}


    function buildSyncStatusSummary(){
      const backup=getLastBackupStatus();
      const seed=firestoreSeedStatusLocal();
      const hard=cloudHardeningLocal();
      const transfer=deviceTransferLocal();
      const confidence=syncConfidenceLocal();
      const fb=firebaseConfigStatusSummary();
      const logs=syncLogLocal();
      const local=snapshotCounts(null);
      const total=(local.Otonan||0)+(local.Merajan||0)+(local.Pelinggih||0)+(local.Checklist||0)+(local.Arsip||0);
      const backupAge=backup.lastBackupAt?Math.max(0,Math.round((Date.now()-new Date(backup.lastBackupAt).getTime())/86400000)):999;
      const seedAge=seed.lastUploadedAt?Math.max(0,Math.round((Date.now()-new Date(seed.lastUploadedAt).getTime())/86400000)):999;
      const hasUpload=!!seed.lastUploadedAt||logs.some(l=>l.action==='upload');
      const hasFetch=!!seed.lastFetchedAt||logs.some(l=>l.action==='fetch');
      const hasRestore=logs.some(l=>l.action==='restore');
      const items=[
        {key:'data',label:'Data lokal',ok:total>0,detail:total?`${total} item lokal tersimpan.`:'Belum ada data adat/keluarga yang perlu disync.'},
        {key:'backup',label:'Backup lokal',ok:!!backup.lastBackupAt&&backupAge<=7,partial:!!backup.lastBackupAt,detail:backup.lastBackupAt?`Backup ${backupAge} hari lalu.`:'Belum ada backup JSON.'},
        {key:'firebase',label:'Firebase config',ok:fb.ready,partial:fb.requiredDone>0,detail:fb.ready?`Project ${fb.projectId||'-'} siap.`:`${fb.requiredDone}/${fb.requiredTotal} field wajib terisi.`},
        {key:'cloudSeed',label:'Cloud Seed',ok:hasUpload&&seedAge<=14,partial:hasUpload,detail:hasUpload?`Upload ${seedAge} hari lalu.`:'Belum ada Cloud Seed upload.'},
        {key:'restore',label:'Review/restore',ok:hasFetch&&hasRestore,partial:hasFetch||hasRestore,detail:hasRestore?'Restore pernah tercatat.':hasFetch?'Seed sudah diambil, belum restore.':'Belum ada fetch/review seed.'},
        {key:'transfer',label:'Uji pindah HP',ok:!!transfer.successAt,partial:!!transfer.updatedAt,detail:transfer.successAt?`Berhasil: ${new Date(transfer.successAt).toLocaleDateString('id-ID')}`:'Belum ditandai berhasil.'},
        {key:'hardening',label:'Hardening',ok:!!hard.lockedAt,partial:!!confidence.acceptedAt,detail:hard.lockedAt?`Baseline score ${hard.score||0}%.`:confidence.acceptedAt?'Confidence diterima, baseline belum lock.':'Belum lock baseline.'}
      ];
      const points=items.reduce((sum,i)=>sum+(i.ok?1:(i.partial?.5:0)),0);
      const score=Math.round(points/items.length*100);
      let level='Belum aman';let decision='Mulai dari backup lokal, lalu Firebase config dan Cloud Seed manual.';
      if(score>=85){level='Siap hardening lanjutan';decision='Manual Cloud Seed sudah cukup kuat untuk uji lebih serius. Real-time sync tetap butuh conflict guard.';}
      else if(score>=65){level='Pilot cukup siap';decision='Lanjutkan uji pindah HP dan lock baseline sebelum sync otomatis.';}
      else if(score>=40){level='Parsial';decision='Data mulai siap. Lengkapi backup, Firebase config, upload/fetch Cloud Seed, lalu transfer test.';}
      return {items,score,level,decision,backup,seed,hard,transfer,confidence,local,total,fb};
    }
    function renderSyncStatusSummary(){
      const panel=document.getElementById('syncStatusSummaryPanel');if(!panel)return;
      const r=buildSyncStatusSummary();
      const score=document.getElementById('syncStatusScore');if(score)score.textContent=`${r.score}% · ${r.level}`;
      const bar=document.getElementById('syncStatusBar');if(bar)bar.style.width=r.score+'%';
      const grid=document.getElementById('syncStatusGrid');if(grid)grid.innerHTML=r.items.map(i=>`<div class="sync-status-item ${i.ok?'ok':i.partial?'warn':'danger'}"><strong>${i.ok?'✅':i.partial?'◐':'□'} ${i.label}</strong><span>${i.detail}</span></div>`).join('');
      const title=document.getElementById('syncStatusDecisionTitle');if(title)title.textContent=r.level;
      const body=document.getElementById('syncStatusDecisionText');if(body)body.textContent=' '+r.decision;
    }
    function syncStatusSummaryText(){
      const r=buildSyncStatusSummary();
      const lines=['KD-Bali Sync Status Summary',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Score: ${r.score}%`,`Level: ${r.level}`,`Keputusan: ${r.decision}`,'',`Total data lokal: ${r.total}`,`Otonan ${r.local.Otonan||0} · Merajan ${r.local.Merajan||0} · Pelinggih ${r.local.Pelinggih||0} · Checklist ${r.local.Checklist||0} · Arsip ${r.local.Arsip||0}`,'','Status:'];
      r.items.forEach(i=>lines.push(`${i.ok?'[OK]':i.partial?'[PARTIAL]':'[ ]'} ${i.label} - ${i.detail}`));
      lines.push('',`Backup terakhir: ${r.backup.lastBackupAt?new Date(r.backup.lastBackupAt).toLocaleString('id-ID'):'-'}`,`Cloud Seed upload: ${r.seed.lastUploadedAt?new Date(r.seed.lastUploadedAt).toLocaleString('id-ID'):'-'}`,`Cloud Seed fetch: ${r.seed.lastFetchedAt?new Date(r.seed.lastFetchedAt).toLocaleString('id-ID'):'-'}`,`Hardening baseline: ${r.hard.lockedAt?new Date(r.hard.lockedAt).toLocaleString('id-ID'):'-'}`,'','Policy: manual Cloud Seed only. Real-time sync belum aktif.');
      return lines.join('\n');
    }
    function exportSyncStatusSummary(){downloadText(`kd-bali-sync-status-summary-${new Date().toLocaleDateString('sv-SE')}.txt`,syncStatusSummaryText(),'text/plain');setFirestoreSeedStatus('Sync Status Summary TXT berhasil dibuat.', 'ok');}

    function realSyncGateLocal(){try{return JSON.parse(localStorage.getItem(REAL_SYNC_GATE_KEY)||'{}');}catch(e){return {};}}
    function saveRealSyncGate(data){localStorage.setItem(REAL_SYNC_GATE_KEY,JSON.stringify({...realSyncGateLocal(),...data,updatedAt:new Date().toISOString()}));}
    function buildRealSyncDecisionGate(){
      const summary=buildSyncStatusSummary();
      const stable=realSyncGateLocal();
      const must=[
        {key:'backup',label:'Backup lokal aman',ok:summary.items.find(i=>i.key==='backup')?.ok,detail:summary.items.find(i=>i.key==='backup')?.detail||'Belum ada status backup.'},
        {key:'firebase',label:'Firebase config siap',ok:summary.items.find(i=>i.key==='firebase')?.ok,detail:summary.items.find(i=>i.key==='firebase')?.detail||'Belum ada config.'},
        {key:'cloudSeed',label:'Cloud Seed aktif',ok:summary.items.find(i=>i.key==='cloudSeed')?.ok,detail:summary.items.find(i=>i.key==='cloudSeed')?.detail||'Belum upload seed.'},
        {key:'restore',label:'Review + restore diuji',ok:summary.items.find(i=>i.key==='restore')?.ok,detail:summary.items.find(i=>i.key==='restore')?.detail||'Belum ada restore review.'},
        {key:'transfer',label:'Pindah HP berhasil',ok:summary.items.find(i=>i.key==='transfer')?.ok,detail:summary.items.find(i=>i.key==='transfer')?.detail||'Belum uji pindah HP.'},
        {key:'hardening',label:'Hardening baseline terkunci',ok:summary.items.find(i=>i.key==='hardening')?.ok,detail:summary.items.find(i=>i.key==='hardening')?.detail||'Belum lock baseline.'},
        {key:'manualStable',label:'Manual seed stabil',ok:!!stable.manualSeedStableAt,detail:stable.manualSeedStableAt?`Ditandai stabil: ${new Date(stable.manualSeedStableAt).toLocaleString('id-ID')}`:'Belum ditandai stabil setelah uji manual.'}
      ];
      const blockers=must.filter(i=>!i.ok);
      const score=Math.round((must.length-blockers.length)/must.length*100);
      let level='NO-GO';
      let decision='Jangan aktifkan Cloud Sync Real. Selesaikan backup, Cloud Seed, restore review, transfer test, dan baseline hardening dulu.';
      if(score>=100){level='GO: siap desain Cloud Sync Real';decision='Manual seed pilot sudah stabil. Langkah berikutnya boleh masuk desain subcollection Firestore + conflict guard, bukan langsung real-time sync liar.';}
      else if(score>=75){level='HAMPIR GO';decision='Pilot sudah kuat, tetapi masih ada blocker. Selesaikan blocker sebelum Cloud Sync Real.';}
      else if(score>=45){level='WAIT';decision='Masih tahap pilot. Lanjutkan manual Cloud Seed, jangan sync otomatis.';}
      return {score,level,decision,must,blockers,summary,stable};
    }
    function renderRealSyncDecisionGate(){
      const panel=document.getElementById('realSyncDecisionGatePanel');if(!panel)return;
      const r=buildRealSyncDecisionGate();
      const pill=document.getElementById('realSyncGatePill');if(pill)pill.textContent=`${r.score}% · ${r.level}`;
      const grid=document.getElementById('realSyncGateGrid');if(grid)grid.innerHTML=r.must.map(i=>`<div class="real-sync-item ${i.ok?'ok':'danger'}"><strong>${i.ok?'✅':'□'} ${i.label}</strong><span>${i.detail}</span></div>`).join('');
      const title=document.getElementById('realSyncGateTitle');if(title)title.textContent=r.level;
      const decision=document.getElementById('realSyncGateDecision');if(decision)decision.textContent=' '+r.decision;
    }
    function realSyncGateReportText(){
      const r=buildRealSyncDecisionGate();
      const lines=['KD-Bali Real Sync Decision Gate',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Score: ${r.score}%`,`Level: ${r.level}`,`Keputusan: ${r.decision}`,'','Checklist Go/No-Go:'];
      r.must.forEach(i=>lines.push(`${i.ok?'[OK]':'[BLOCKER]'} ${i.label} - ${i.detail}`));
      lines.push('',`Blocker tersisa: ${r.blockers.length?r.blockers.map(b=>b.label).join(', '):'Tidak ada'}`,'','Policy: manual Cloud Seed tetap aktif sampai semua gate aman. Cloud Sync Real berikutnya harus memakai subcollection Firestore, conflict guard, backup sebelum overwrite, dan rollback path.');
      return lines.join('\n');
    }
    function exportRealSyncGateReport(){downloadText(`kd-bali-real-sync-gate-${new Date().toLocaleDateString('sv-SE')}.txt`,realSyncGateReportText(),'text/plain');setFirestoreSeedStatus('Real Sync Gate Report TXT berhasil dibuat.', 'ok');}
    function markManualSeedStable(){const r=buildSyncStatusSummary();saveRealSyncGate({manualSeedStableAt:new Date().toISOString(),summaryScore:r.score,level:r.level});addSyncLog('real_sync_gate','Manual seed pilot ditandai stabil.');renderRealSyncDecisionGate();setFirestoreSeedStatus('Manual Seed ditandai stabil. Tetap cek Go/No-Go sebelum sync real.', 'ok');}


    function cloudSyncBlueprintText(){
      const lines=[
        'KD-Bali Cloud Sync Real Blueprint',
        `Tanggal: ${new Date().toLocaleString('id-ID')}`,
        '',
        'Target:',
        '- Mengubah pilot manual Cloud Seed menjadi sync real yang aman, bertahap, dan bisa dipulihkan.',
        '- Data privat tetap per user/familyId, bukan data publik komunitas.',
        '',
        'Firestore target structure:',
        'users/{uid}',
        '  - email, displayName, activeFamilyId, lastLoginAt',
        'families/{familyId}',
        '  - ownerUid, familyName, timezone, privacyLevel',
        'families/{familyId}/members/{memberId}',
        'families/{familyId}/adatPlaces/{placeId}',
        'families/{familyId}/shrines/{shrineId}',
        'families/{familyId}/adatEvents/{eventId}',
        'families/{familyId}/bantenTemplates/{templateId}',
        'families/{familyId}/eventChecklists/{checklistId}',
        'families/{familyId}/ceremonyArchives/{archiveId}',
        'families/{familyId}/adatDecisions/{decisionId}',
        'families/{familyId}/syncSnapshots/{snapshotId}',
        'families/{familyId}/syncLogs/{logId}',
        '',
        'Conflict policy:',
        '- Never overwrite local data silently.',
        '- If local updatedAt > cloud updatedAt, require review before cloud restore.',
        '- If cloud updatedAt > local updatedAt, show diff summary before applying.',
        '- Always create local backup before destructive restore.',
        '- Write sync log for upload, download, restore, conflict, and rollback.',
        '',
        'Implementation rule:',
        '- Phase berikutnya boleh membuat dry-run subcollection writer dulu.',
        '- Full real-time sync hanya boleh aktif setelah dry-run, rules, backup, review, and rollback proven safe.'
      ];
      return lines.join('\n');
    }
    async function copyCloudBlueprint(){
      const text=cloudSyncBlueprintText();
      try{await navigator.clipboard.writeText(text);setFirestoreSeedStatus('Cloud Sync Blueprint berhasil disalin.', 'ok');}
      catch(e){downloadText('kd-bali-cloud-sync-blueprint.txt',text,'text/plain');setFirestoreSeedStatus('Clipboard gagal. Blueprint TXT dibuat sebagai fallback.', 'warn');}
    }
    function exportCloudBlueprint(){downloadText(`kd-bali-cloud-sync-blueprint-${new Date().toLocaleDateString('sv-SE')}.txt`,cloudSyncBlueprintText(),'text/plain');setFirestoreSeedStatus('Cloud Sync Blueprint TXT berhasil dibuat.', 'ok');}


    function dryRunLocal(){try{return JSON.parse(localStorage.getItem(CLOUD_DRY_RUN_KEY)||'{}');}catch(e){return {};}}
    function saveDryRunLocal(data){localStorage.setItem(CLOUD_DRY_RUN_KEY,JSON.stringify({...dryRunLocal(),...data,updatedAt:new Date().toISOString()}));}
    function dryRunDoc(path,type,data){return {path,type,docId:path.split('/').pop(),writeMode:'dry_run_only',data};}
    function buildCloudDryRunPayload(){
      const user=state.firebaseAuthUser||{};
      const profile=normalizeSyncProfile(state.syncProfile||{});
      const uid=user.uid||'uid_placeholder';
      const email=user.email||profile.email||'';
      const familyId=firestoreFamilyId();
      const rootFamily=`families/${familyId}`;
      const docs=[];
      docs.push(dryRunDoc(`users/${uid}`,'user',{uid,email,displayName:user.displayName||email||'User 1',activeFamilyId:familyId,lastDryRunAt:new Date().toISOString()}));
      docs.push(dryRunDoc(rootFamily,'family',{familyId,familyName:profile.familyName||'Keluarga User',ownerUid:uid,timezone:'Asia/Makassar',privacyLevel:'private',updatedAt:new Date().toISOString()}));
      (state.family||[]).forEach((m,i)=>docs.push(dryRunDoc(`${rootFamily}/members/${uidSafe(m.id||m.name||('member_'+i))}`,'member',{...m,updatedAt:new Date().toISOString()})));
      (state.adatMemory?.places||[]).forEach((p,i)=>docs.push(dryRunDoc(`${rootFamily}/adatPlaces/${uidSafe(p.id||p.name||('place_'+i))}`,'adatPlace',{...p,updatedAt:new Date().toISOString()})));
      (state.adatMemory?.shrines||[]).forEach((s,i)=>docs.push(dryRunDoc(`${rootFamily}/shrines/${uidSafe(s.id||s.name||('shrine_'+i))}`,'shrine',{...s,updatedAt:new Date().toISOString()})));
      (state.adatMemory?.decisions||[]).forEach((d,i)=>docs.push(dryRunDoc(`${rootFamily}/adatDecisions/${uidSafe(d.id||d.topic||('decision_'+i))}`,'adatDecision',{...d,updatedAt:new Date().toISOString()})));
      (state.adatMemory?.bantenTemplates||[]).forEach((t,i)=>docs.push(dryRunDoc(`${rootFamily}/bantenTemplates/${uidSafe(t.id||t.name||('template_'+i))}`,'bantenTemplate',{...t,updatedAt:new Date().toISOString()})));
      Object.values(state.eventChecklists||{}).forEach((c,i)=>docs.push(dryRunDoc(`${rootFamily}/eventChecklists/${uidSafe(c.instanceId||c.id||('checklist_'+i))}`,'eventChecklist',{...c,updatedAt:new Date().toISOString()})));
      (state.ceremonyArchives||[]).forEach((a,i)=>docs.push(dryRunDoc(`${rootFamily}/ceremonyArchives/${uidSafe(a.id||a.instanceId||('archive_'+i))}`,'ceremonyArchive',{...a,updatedAt:new Date().toISOString()})));
      const eventInstances=[];
      (state.family||[]).forEach(m=>otonanDatesInYear(m).forEach(date=>eventInstances.push({id:`otonan_${uidSafe(m.id||m.name)}_${date}`,date,title:`Otonan ${m.name}`,type:'otonan',memberId:m.id,source:'family_private_event',visibility:'family_private'})));
      buildAdatInstancesInYear(2026).forEach(e=>eventInstances.push({...e,type:'adat_family_event'}));
      eventInstances.forEach((e,i)=>docs.push(dryRunDoc(`${rootFamily}/eventInstances/${uidSafe(e.id||e.title||('event_'+i))}`,'eventInstance',{...e,updatedAt:new Date().toISOString()})));
      const snapshot={id:`snapshot_${Date.now()}`,createdAt:new Date().toISOString(),counts:snapshotCounts(null),source:'dry_run_subcollection_writer',note:'Dry-run only. No Firestore write executed.'};
      docs.push(dryRunDoc(`${rootFamily}/syncSnapshots/${snapshot.id}`,'syncSnapshot',snapshot));
      const byType=docs.reduce((acc,d)=>{acc[d.type]=(acc[d.type]||0)+1;return acc;},{});
      return {app:'KD-Bali',phase:'2.6.7',mode:'dry_run_subcollection_writer',generatedAt:new Date().toISOString(),policy:{writesToFirestore:false,realtimeSync:false,manualSeedOnly:true,requiresReviewBeforeActualWrite:true},identity:{uid,email,familyId},docCount:docs.length,countsByType:byType,docs,notes:'Payload ini hanya simulasi write plan. Gunakan untuk review path dan struktur sebelum Cloud Sync Real.'};
    }
    function setDryRunStatus(text,kind='info'){
      const pill=document.getElementById('dryRunWriterPill');if(pill)pill.textContent=kind==='ok'?'Dry-run generated':kind==='warn'?'Review needed':'Dry-run only';
      const s=document.getElementById('dryRunSummary');if(s)s.textContent=text;
    }
    function renderCloudDryRunWriter(){
      const stored=dryRunLocal();
      const payload=stored.payload||null;
      const counts=document.getElementById('dryRunCounts');
      const code=document.getElementById('dryRunPreviewCode');
      if(!counts||!code)return;
      const p=payload||buildCloudDryRunPayload();
      const types=['member','adatPlace','shrine','eventInstance','bantenTemplate','eventChecklist','ceremonyArchive','adatDecision'];
      counts.innerHTML=types.map(t=>`<div class="dry-run-count"><strong>${p.countsByType?.[t]||0}</strong><span>${t}</span></div>`).join('')+`<div class="dry-run-count"><strong>${p.docCount||0}</strong><span>total dry-run docs</span></div>`;
      const preview=(p.docs||[]).slice(0,8).map(d=>({path:d.path,type:d.type,writeMode:d.writeMode}));
      code.textContent=JSON.stringify(preview,null,2);
      if(payload)setDryRunStatus(`Dry-run terakhir: ${new Date(payload.generatedAt).toLocaleString('id-ID')} · ${payload.docCount} dokumen simulasi.`, 'ok');
      else setDryRunStatus('Preview sementara dari data lokal. Klik Generate Dry Run Payload untuk mengunci snapshot dry-run.', 'info');
    }
    function generateDryRunWriter(){
      const payload=buildCloudDryRunPayload();
      saveDryRunLocal({payload,lastGeneratedAt:payload.generatedAt,docCount:payload.docCount,countsByType:payload.countsByType});
      addSyncLog('dry_run',`Dry Run Subcollection Writer dibuat: ${payload.docCount} dokumen simulasi.`,{dryRunDocCount:payload.docCount});
      renderCloudDryRunWriter();
      setFirestoreSeedStatus('Dry Run Subcollection Writer berhasil dibuat. Belum ada data ditulis ke Firestore.', 'ok');
    }
    async function copyDryRunWriter(){
      const payload=dryRunLocal().payload||buildCloudDryRunPayload();
      const text=JSON.stringify(payload,null,2);
      try{await navigator.clipboard.writeText(text);setFirestoreSeedStatus('Dry Run JSON berhasil disalin. Ini hanya simulasi, bukan write cloud.', 'ok');}
      catch(e){downloadText('kd-bali-dry-run-subcollection-writer.json',text,'application/json');setFirestoreSeedStatus('Clipboard gagal. Dry Run JSON dibuat sebagai file.', 'warn');}
    }
    function exportDryRunWriter(){const payload=dryRunLocal().payload||buildCloudDryRunPayload();downloadText(`kd-bali-dry-run-subcollection-writer-${new Date().toLocaleDateString('sv-SE')}.json`,JSON.stringify(payload,null,2),'application/json');setFirestoreSeedStatus('Dry Run JSON berhasil diexport.', 'ok');}
    function dryRunWriterReportText(){
      const payload=dryRunLocal().payload||buildCloudDryRunPayload();
      const lines=['KD-Bali Dry Run Subcollection Writer',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Mode: ${payload.mode}`,`Firestore write: ${payload.policy.writesToFirestore?'YES':'NO'}`,`Total docs: ${payload.docCount}`,'','Counts by type:'];
      Object.entries(payload.countsByType||{}).forEach(([k,v])=>lines.push(`- ${k}: ${v}`));
      lines.push('','Sample paths:');
      (payload.docs||[]).slice(0,20).forEach(d=>lines.push(`- ${d.path} [${d.type}]`));
      lines.push('','Decision: dry-run must be reviewed before actual subcollection writer. No silent overwrite. No real-time sync yet.');
      return lines.join('\n');
    }
    function exportDryRunReport(){downloadText(`kd-bali-dry-run-report-${new Date().toLocaleDateString('sv-SE')}.txt`,dryRunWriterReportText(),'text/plain');setFirestoreSeedStatus('Dry Run Report TXT berhasil dibuat.', 'ok');}




    function dryRunGateLocal(){try{return JSON.parse(localStorage.getItem(DRY_RUN_VALIDATION_GATE_KEY)||'{}');}catch(e){return {};}}
    function saveDryRunGateLocal(data){localStorage.setItem(DRY_RUN_VALIDATION_GATE_KEY,JSON.stringify({...dryRunGateLocal(),...data,updatedAt:new Date().toISOString()}));}
    function buildDryRunValidationGate(){
      const payload=dryRunLocal().payload||null;
      const config=firebaseConfigStatusSummary();
      const backup=getLastBackupStatus();
      const realGate=buildRealSyncDecisionGate();
      const stored=dryRunGateLocal();
      const docs=payload?.docs||[];
      const paths=docs.map(d=>d.path).filter(Boolean);
      const unique=new Set(paths);
      const duplicates=paths.filter((p,i)=>paths.indexOf(p)!==i);
      const familyId=payload?.identity?.familyId||firestoreFamilyId();
      const uid=payload?.identity?.uid||state.firebaseAuthUser?.uid||'';
      const familyRoot=`families/${familyId}`;
      const badPaths=paths.filter(p=>!(p===familyRoot||p.startsWith(`${familyRoot}/`)||p===`users/${uid}`));
      const requiredTypes=['user','family','syncSnapshot'];
      const typeSet=new Set(docs.map(d=>d.type));
      const missingTypes=requiredTypes.filter(t=>!typeSet.has(t));
      const localCounts=snapshotCounts(null);
      const coreCount=(localCounts.Otonan||0)+(localCounts.Merajan||0)+(localCounts.Pelinggih||0);
      const items=[
        {key:'payload',label:'Dry Run Payload tersedia',ok:!!payload,detail:payload?`Generated: ${new Date(payload.generatedAt).toLocaleString('id-ID')} · ${payload.docCount||0} docs`:'Belum generate dry-run.'},
        {key:'docCount',label:'Jumlah dokumen masuk akal',ok:!!payload&&payload.docCount>0&&docs.length===payload.docCount,detail:payload?`${docs.length}/${payload.docCount||0} docs terbaca.`:'Tidak ada payload.'},
        {key:'noWrite',label:'Policy masih dry-run only',ok:!!payload&&payload.policy?.writesToFirestore===false&&payload.policy?.realtimeSync===false,detail:payload?'writesToFirestore=false · realtimeSync=false':'Belum ada policy.'},
        {key:'uniquePath',label:'Path dokumen unik',ok:!!payload&&duplicates.length===0,detail:duplicates.length?`Duplikat: ${duplicates.slice(0,3).join(', ')}`:'Tidak ada path duplikat.'},
        {key:'pathScope',label:'Path tetap dalam user/family scope',ok:!!payload&&badPaths.length===0,detail:badPaths.length?`Path di luar scope: ${badPaths.slice(0,2).join(', ')}`:`Scope: users/${uid||'uid'} + ${familyRoot}`},
        {key:'requiredTypes',label:'Dokumen dasar tersedia',ok:!!payload&&missingTypes.length===0,detail:missingTypes.length?`Missing: ${missingTypes.join(', ')}`:'user, family, syncSnapshot tersedia.'},
        {key:'coreData',label:'Data inti lokal ada',ok:coreCount>0,detail:coreCount?`${coreCount} data inti lokal.`:'Isi minimal otonan/merajan/pelinggih dulu.'},
        {key:'firebase',label:'Firebase config siap',ok:config.ready,detail:config.ready?`Project: ${config.projectId}`:`${config.requiredDone}/${config.requiredTotal} field wajib lengkap.`},
        {key:'login',label:'Login Google terverifikasi',ok:!!state.firebaseAuthUser,detail:state.firebaseAuthUser?`Login: ${state.firebaseAuthUser.email||state.firebaseAuthUser.uid}`:'Login dulu dari Auth Pilot.'},
        {key:'backup',label:'Backup lokal tersedia',ok:!!backup.lastBackupAt,detail:backup.lastBackupAt?`Backup: ${new Date(backup.lastBackupAt).toLocaleString('id-ID')}`:'Backup lokal wajib sebelum write pilot.'},
        {key:'realGate',label:'Real Sync Gate memadai',ok:realGate.score>=75,detail:`Real Sync Gate: ${realGate.score}% · ${realGate.level}`},
        {key:'manualStable',label:'Manual seed stabil',ok:!!realGate.stable?.manualSeedStableAt,detail:realGate.stable?.manualSeedStableAt?`Stabil: ${new Date(realGate.stable.manualSeedStableAt).toLocaleString('id-ID')}`:'Tandai manual seed stabil setelah uji restore.'},
        {key:'accepted',label:'Dry Run ditandai aman',ok:!!stored.acceptedAt,detail:stored.acceptedAt?`Accepted: ${new Date(stored.acceptedAt).toLocaleString('id-ID')}`:'Belum ditandai aman.'}
      ];
      const passed=items.filter(i=>i.ok).length;
      const score=Math.round(passed/items.length*100);
      const blockers=items.filter(i=>!i.ok);
      let level='NO-GO';
      let decision='Jangan lakukan actual write. Selesaikan blocker dry-run, backup, login, dan hardening terlebih dahulu.';
      if(score>=100){level='GO untuk actual write pilot terbatas';decision='Dry-run sudah valid. Phase berikutnya boleh membuat actual write pilot manual dengan tombol eksplisit, bukan real-time sync otomatis.';}
      else if(score>=80){level='HAMPIR GO';decision='Dry-run cukup kuat, tetapi masih ada blocker. Selesaikan blocker sebelum write pilot.';}
      else if(score>=55){level='WAIT';decision='Masih tahap validasi. Tetap gunakan manual Cloud Seed dan dry-run only.';}
      return {score,level,decision,items,blockers,payload,stored,generatedAt:new Date().toISOString()};
    }
    function renderDryRunValidationGate(){
      const panel=document.getElementById('dryRunValidationGatePanel');if(!panel)return;
      const r=buildDryRunValidationGate();
      const pill=document.getElementById('dryRunValidationPill');if(pill)pill.textContent=`${r.score}% · ${r.level}`;
      const grid=document.getElementById('dryRunValidationGrid');if(grid)grid.innerHTML=r.items.map(i=>`<div class="real-sync-item ${i.ok?'ok':'danger'}"><strong>${i.ok?'✅':'□'} ${i.label}</strong><span>${i.detail}</span></div>`).join('');
      const title=document.getElementById('dryRunValidationTitle');if(title)title.textContent=r.level;
      const decision=document.getElementById('dryRunValidationDecision');if(decision)decision.textContent=' '+r.decision;
    }
    function dryRunValidationGateReportText(){
      const r=buildDryRunValidationGate();
      const lines=['KD-Bali Dry Run Validation & Write Gate',`Tanggal: ${new Date().toLocaleString('id-ID')}`,`Score: ${r.score}%`,`Level: ${r.level}`,`Keputusan: ${r.decision}`,'','Checklist:'];
      r.items.forEach(i=>lines.push(`${i.ok?'[OK]':'[BLOCKER]'} ${i.label} - ${i.detail}`));
      lines.push('',`Blocker tersisa: ${r.blockers.length?r.blockers.map(b=>b.label).join(', '):'Tidak ada'}`,'','Policy: Phase ini tidak menulis ke Firestore. Actual write pilot berikutnya harus manual, eksplisit, dibatasi, ter-log, dan memiliki rollback/backup.');
      return lines.join('\n');
    }
    function validateDryRunGate(){const r=buildDryRunValidationGate();saveDryRunGateLocal({lastValidatedAt:new Date().toISOString(),score:r.score,level:r.level,blockers:r.blockers.map(b=>b.key)});addSyncLog('dry_run_gate',`Dry Run Validation Gate dicek: ${r.score}% · ${r.level}`);renderDryRunValidationGate();setFirestoreSeedStatus(`Dry Run Validation Gate: ${r.score}% · ${r.level}.`,r.score>=80?'ok':'warn');}
    function markDryRunGateSafe(){const r=buildDryRunValidationGate();if(r.score<80){setFirestoreSeedStatus('Dry Run belum cukup aman untuk ditandai. Selesaikan blocker hingga minimal 80%.','warn');return;}saveDryRunGateLocal({acceptedAt:new Date().toISOString(),score:r.score,level:r.level,docCount:r.payload?.docCount||0});addSyncLog('dry_run_gate','Dry Run Validation Gate ditandai aman untuk desain actual write pilot terbatas.');renderDryRunValidationGate();setFirestoreSeedStatus('Dry Run ditandai aman. Phase berikutnya boleh actual write pilot manual terbatas, bukan real-time sync.', 'ok');}
    function exportDryRunGateReport(){downloadText(`kd-bali-dry-run-write-gate-${new Date().toLocaleDateString('sv-SE')}.txt`,dryRunValidationGateReportText(),'text/plain');setFirestoreSeedStatus('Dry Run Write Gate Report TXT berhasil dibuat.', 'ok');}


    function setupFirestoreSeedPilot(){
      const check=document.getElementById('checkFirestoreSeedBtn');if(check)check.addEventListener('click',checkFirestoreSeed);
      const upload=document.getElementById('uploadFirestoreSeedBtn');if(upload)upload.addEventListener('click',uploadFirestoreSeed);
      const fetch=document.getElementById('fetchFirestoreSeedBtn');if(fetch)fetch.addEventListener('click',fetchFirestoreSeed);
      const pre=document.getElementById('downloadPreRestoreBackupBtn');if(pre)pre.addEventListener('click',downloadPreRestoreBackup);
      const restore=document.getElementById('restoreFirestoreSeedBtn');if(restore)restore.addEventListener('click',restoreFirestoreSeedToLocal);
      const rules=document.getElementById('copyFirestoreRulesBtn');if(rules)rules.addEventListener('click',copyFirestoreRules);
      const snap=document.getElementById('captureSyncSnapshotBtn');if(snap)snap.addEventListener('click',captureSyncSnapshot);
      const exportLog=document.getElementById('exportSyncLogBtn');if(exportLog)exportLog.addEventListener('click',exportSyncLogCSV);
      const clearLog=document.getElementById('clearSyncLogBtn');if(clearLog)clearLog.addEventListener('click',clearSyncLog);
      const copyOld=document.getElementById('copyOldDeviceChecklistBtn');if(copyOld)copyOld.addEventListener('click',()=>copyTransferChecklist('old'));
      const copyNew=document.getElementById('copyNewDeviceChecklistBtn');if(copyNew)copyNew.addEventListener('click',()=>copyTransferChecklist('new'));
      const recordTransfer=document.getElementById('recordTransferTestBtn');if(recordTransfer)recordTransfer.addEventListener('click',recordTransferTest);
      const exportTransfer=document.getElementById('exportTransferChecklistBtn');if(exportTransfer)exportTransfer.addEventListener('click',exportTransferChecklist);
      const markConfidence=document.getElementById('markSyncConfidenceBtn');if(markConfidence)markConfidence.addEventListener('click',markSyncConfidenceAccepted);
      const exportConfidence=document.getElementById('exportSyncConfidenceBtn');if(exportConfidence)exportConfidence.addEventListener('click',exportSyncConfidenceReport);
      const resetConfidence=document.getElementById('resetSyncConfidenceBtn');if(resetConfidence)resetConfidence.addEventListener('click',resetSyncConfidence);
      const lockBaseline=document.getElementById('lockCloudBaselineBtn');if(lockBaseline)lockBaseline.addEventListener('click',lockCloudBaseline);
      const exportHardening=document.getElementById('exportCloudHardeningBtn');if(exportHardening)exportHardening.addEventListener('click',exportCloudHardeningReport);
      const copyHardRules=document.getElementById('copyHardeningRulesBtn');if(copyHardRules)copyHardRules.addEventListener('click',copyHardeningRules);
      const resetHardening=document.getElementById('resetCloudHardeningBtn');if(resetHardening)resetHardening.addEventListener('click',resetCloudHardening);
      const runBackupCheck=document.getElementById('runBackupDisciplineCheckBtn');if(runBackupCheck)runBackupCheck.addEventListener('click',renderAutoBackupReminder);
      const copyBlueprint=document.getElementById('copyCloudBlueprintBtn');if(copyBlueprint)copyBlueprint.addEventListener('click',copyCloudBlueprint);
      const exportBlueprint=document.getElementById('exportCloudBlueprintBtn');if(exportBlueprint)exportBlueprint.addEventListener('click',exportCloudBlueprint);
      const genDryRun=document.getElementById('generateDryRunWriterBtn');if(genDryRun)genDryRun.addEventListener('click',generateDryRunWriter);
      const copyDryRun=document.getElementById('copyDryRunWriterBtn');if(copyDryRun)copyDryRun.addEventListener('click',copyDryRunWriter);
      const exportDryRun=document.getElementById('exportDryRunWriterBtn');if(exportDryRun)exportDryRun.addEventListener('click',exportDryRunWriter);
      const exportDryRunReport=document.getElementById('exportDryRunReportBtn');if(exportDryRunReport)exportDryRunReport.addEventListener('click',exportDryRunReport);
      const validateDryRun=document.getElementById('validateDryRunGateBtn');if(validateDryRun)validateDryRun.addEventListener('click',validateDryRunGate);
      const markDryGate=document.getElementById('markDryRunGateSafeBtn');if(markDryGate)markDryGate.addEventListener('click',markDryRunGateSafe);
      const exportDryGate=document.getElementById('exportDryRunGateReportBtn');if(exportDryGate)exportDryGate.addEventListener('click',exportDryRunGateReport);
      const backupNow=document.getElementById('downloadBackupFromReminderBtn');if(backupNow)backupNow.addEventListener('click',exportBackup);
      const exportBackupDisc=document.getElementById('exportBackupDisciplineBtn');if(exportBackupDisc)exportBackupDisc.addEventListener('click',exportBackupDisciplineReport);
      const markBackupReview=document.getElementById('markBackupReminderReviewedBtn');if(markBackupReview)markBackupReview.addEventListener('click',markBackupReminderReviewed);
      const refreshSyncStatus=document.getElementById('refreshSyncStatusBtn');if(refreshSyncStatus)refreshSyncStatus.addEventListener('click',renderSyncStatusSummary);
      const exportSyncStatus=document.getElementById('exportSyncStatusBtn');if(exportSyncStatus)exportSyncStatus.addEventListener('click',exportSyncStatusSummary);
      const refreshRealGate=document.getElementById('refreshRealSyncGateBtn');if(refreshRealGate)refreshRealGate.addEventListener('click',renderRealSyncDecisionGate);
      const markRealGate=document.getElementById('markManualSeedStableBtn');if(markRealGate)markRealGate.addEventListener('click',markManualSeedStable);
      const exportRealGate=document.getElementById('exportRealSyncGateBtn');if(exportRealGate)exportRealGate.addEventListener('click',exportRealSyncGateReport);
      renderFirestoreSeedPilot();
      renderDeviceTransferTest();
      renderSyncConfidencePanel();
      renderSyncStatusSummary();
      renderRealSyncDecisionGate();
      renderCloudDryRunWriter();
      renderDryRunValidationGate();
    }

    async function init(){document.getElementById('dowGrid').innerHTML=dows.map(d=>`<div class="dow">${d}</div>`).join('');setupMonthSelect();setupFamilyForm();setupAdatMemory();setupMainNav();setupSettingsNav();setupAdatSubNav();setupGuidanceToggle();setupFirebasePrep();setupFirebaseAuthPilot();setupFirestoreSeedPilot();const [events,family,coverage]=await Promise.all([getJson(DATA.events),getJson(DATA.family),getJson(DATA.coverage)]);state.events=events;state.sampleFamily=family;state.family=loadFamilyFromStorage(family);state.adatMemory=loadAdatMemory();state.eventChecklists=loadEventChecklists();state.ceremonyArchives=loadCeremonyArchives();state.syncProfile=loadCloudSyncProfile();state.firebaseConfig=loadFirebaseConfig();state.coverage=coverage;renderFirebaseAuthPilot();renderFirestoreSeedPilot();state.notifyPref=loadNotifyPref();const params=new URLSearchParams(location.search);if(params.get('feed')==='display'||params.get('feed')==='1'){renderFeedMode(state.selectedDate);return;}if(params.get('display')==='1'){state.displayMode=true;document.body.classList.add('display-mode');document.body.classList.add('tablet-mode');}const picker=document.getElementById('datePicker');setDateField(state.selectedDate);picker.addEventListener('change',()=>{const parsed=parseDMY(picker.value);if(!parsed||parsed.slice(0,4)!=='2026'){alert('Tanggal tampilan kalender harus format dd/mm/yyyy dan tahun 2026. Contoh: 11/07/2026');setDateField(state.selectedDate);return;}state.selectedDate=parsed;renderMonth(+state.selectedDate.slice(5,7));renderFamily();});renderFamily();renderAdatMemory();updateAdatSummary();renderWizardGuardrails();renderCloudReadinessGate();renderFirebaseConfig();renderFirestoreSeedPilot();renderSyncStatusSummary();renderRealSyncDecisionGate();renderCloudDryRunWriter();renderDryRunValidationGate();renderMonth(+state.selectedDate.slice(5,7));renderValidationConsole();updateDisplayFeedUrl();if(state.displayMode){setInterval(()=>{const t=localTodayIso();if(t.slice(0,4)==='2026'&&t!==state.selectedDate){state.selectedDate=t;setDateField(state.selectedDate);renderFamily();renderAdatMemory();renderMonth(+state.selectedDate.slice(5,7));}},900000);}if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js').catch(console.warn);}
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredPrompt=e;const btn=document.getElementById('installBtn');btn.hidden=false;btn.textContent='Install App';});
    document.getElementById('installBtn').addEventListener('click',async()=>{const btn=document.getElementById('installBtn');if(state.deferredPrompt){state.deferredPrompt.prompt();await state.deferredPrompt.userChoice;state.deferredPrompt=null;btn.textContent='Panduan Install';return;}alert('Jika tombol install sistem tidak muncul: buka Chrome menu titik tiga → Add to Home screen / Install app. Jika icon lama masih muncul, uninstall dulu app lama dari Settings Android → Apps, lalu install ulang dari link versi 2.6.7.');});
    document.getElementById('todayBtn').addEventListener('click',()=>{const today=localTodayIso().slice(0,4)==='2026'?localTodayIso():'2026-07-10';state.selectedDate=today;setDateField(state.selectedDate);renderFamily();renderMonth(+state.selectedDate.slice(5,7));});
    document.getElementById('modeBtn').addEventListener('click',()=>{document.body.classList.toggle('tablet-mode');document.getElementById('modeBtn').textContent=document.body.classList.contains('tablet-mode')?'Mode E-paper':'Mode Tablet';});
    document.getElementById('displayBtn').addEventListener('click',()=>{state.displayMode=!state.displayMode;document.body.classList.toggle('display-mode',state.displayMode);renderInfo(state.selectedDate);});
    document.getElementById('notifyBtn').addEventListener('click',async()=>{if(!('Notification'in window))return alert('Browser ini belum mendukung notifikasi.');const p=await Notification.requestPermission();if(p==='granted'){state.notifyPref={enabled:true,lastTestAt:new Date().toISOString()};saveNotifyPref();const next=buildUpcoming(state.selectedDate)[0];new Notification('Kalender Bali Digital',{body:next?`Reminder terdekat: ${next.title} · ${reminderLabel(next.daysLeft)}`:'Tes notifikasi berhasil. Pusat reminder aktif.',icon:'./assets/icon-192-v144.png?v=267'});renderInfo(state.selectedDate);}else{state.notifyPref.enabled=false;saveNotifyPref();renderInfo(state.selectedDate);}});
    init().catch(err=>{console.error(err);alert('Data belum bisa dibaca. Jalankan via local server atau deploy ke Vercel.');});
  