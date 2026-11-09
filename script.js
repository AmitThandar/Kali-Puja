(() => {
  const D = window.EVENT_DATA;
  if (!D) return;
  const $ = (id) => document.getElementById(id);
  const set = (id, value) => { const el=$(id); if(el && value!==undefined) el.textContent=value; };
  const bnDigits = n => String(n).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
  const dayNames = ["প্রথম দিন","দ্বিতীয় দিন","তৃতীয় দিন","চতুর্থ দিন","পঞ্চম দিন"];

  document.title = `${D.titleBn} | ${D.clubName}`;
  set("brandName",D.clubName); set("footerClub",D.clubName); set("footerClubName",D.clubName);
  set("clubHero",`${D.clubName}-এর পরিচালনায়`); set("edition",D.edition);
  set("heroTitle",`${D.titleBn.replace("সার্বজনীন ","সার্বজনীন<br>")}`);
  $("heroTitle").innerHTML = `সার্বজনীন<br><em>শ্রী শ্রী শ্যামা</em><br>পূজা`;
  set("heroTagline",D.tagline); set("heroIntro",D.intro); set("heroDate",D.dateRange);
  set("heroBengaliDate",D.bengaliDateRange); set("heroLocation",D.location);
  set("stampYear",D.year); set("heroImage",D.coverImage); $("heroImage").src=D.coverImage;
  set("aboutClub",`আয়োজনে — ${D.clubName}`); set("pujaBengaliDate",D.bengaliDateRange);
  set("pujaDate",D.dateRange); set("contactAddress",D.contact.address || D.location);
  set("contactYear",bnDigits(D.year)); set("footerYear",D.year);
  set("statDays",bnDigits(D.schedule.length)); set("statYear",D.edition.match(/\d+/)?.[0] || "৪৪");
  set("aboutText",`${D.titleBn}কে কেন্দ্র করে ${D.schedule.length} দিনের এই আয়োজন শুধুই ধর্মীয় অনুষ্ঠান নয় — এটি আমাদের পাড়া, মানুষ, সংস্কৃতি ও সম্প্রীতির এক মিলনমেলা।`);
  set("contactAddress",D.contact.address || D.location);
  if(D.contact.phone){$("phoneWrap").hidden=false;set("contactPhone",D.contact.phone);}

  const tabs=$("dayTabs"), content=$("scheduleContent");
  function renderDay(index){
    const day=D.schedule[index];
    [...tabs.children].forEach((b,i)=>b.classList.toggle("active",i===index));
    content.innerHTML=`<div class="day-panel-head"><h3>${day.label} · ${day.weekday}</h3><span>${day.bengaliDate} &nbsp; / &nbsp; ${day.date}</span></div><div class="event-list">${day.events.map(e=>`<article class="event-item"><div class="event-time">${e[0]}</div><div><div class="event-name">${e[1]}</div>${e[2]?`<div class="event-note">${e[2]}</div>`:""}</div></article>`).join("")}</div>`;
  }
  D.schedule.forEach((day,i)=>{
    const b=document.createElement("button");b.className="day-tab";b.type="button";
    b.textContent=day.label;b.setAttribute("role","tab");b.addEventListener("click",()=>renderDay(i));tabs.appendChild(b);
  });
  renderDay(0);

  const comps=[];
  D.schedule.forEach((day,i)=>day.events.forEach(e=>{
    const title=e[1];
    if(/প্রতিযোগিতা|দৌড়|হিট দ্য বোতল|হাঁড়ি ভাঙা|মিউজিক্যাল চেয়ার|লক্ষ্মীলাভ|বল নিক্ষেপ|যেমন খুশি/.test(title))
      comps.push({title,detail:e[2]||"সকলের অংশগ্রহণে",day:day.label});
  }));
  $("competitionGrid").innerHTML=comps.map((c,i)=>`<article class="competition-card"><span class="comp-day">${c.day}</span><strong>${c.title}</strong><small>${c.detail}</small></article>`).join("");
  $("partnerGrid").innerHTML=D.culturalPartners.map((p,i)=>`<article class="partner-card"><span>PROGRAM PARTNER 0${i+1}</span><h3>${p.name}</h3><p>${p.role}</p></article>`).join("");
  $("galleryGrid").innerHTML=D.gallery.map((src,i)=>`<button class="gallery-item" type="button" data-src="${src}" aria-label="লিফলেটের ছবি ${i+1}"><img src="${src}" alt="শ্যামা পূজার লিফলেট পৃষ্ঠা ${i+1}" loading="lazy"></button>`).join("");
  $("galleryGrid").addEventListener("click",e=>{
    const item=e.target.closest(".gallery-item");if(!item)return;
    $("lightboxImage").src=item.dataset.src;$("lightbox").classList.add("open");$("lightbox").setAttribute("aria-hidden","false");
  });
  function closeLightbox(){$("lightbox").classList.remove("open");$("lightbox").setAttribute("aria-hidden","true");}
  $("lightboxClose").addEventListener("click",closeLightbox);
  $("lightbox").addEventListener("click",e=>{if(e.target===$("lightbox"))closeLightbox();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();});
  $("supportList").innerHTML=`${D.culturalPartners.map(p=>`<div class="support-item"><strong>${p.name}</strong><span>${p.role}</span></div>`).join("")}<div class="support-item"><strong>${D.localAdvertiser.name}</strong><span>${D.localAdvertiser.description} · ${D.localAdvertiser.address} · ${D.localAdvertiser.phone}</span></div>`;
  // Permanent black theme; footer social icons use official profile URLs when supplied.
  const social = D.social || {};
  const whatsapp = (social.whatsapp || D.contact.whatsapp || "").replace(/[^0-9]/g, "");
  const waUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("নমস্কার, শ্যামা পূজা সম্পর্কে জানতে চাই।")}` : "#contact";
  const wa = $("footerWhatsapp");
  const ig = $("footerInstagram");
  const fb = $("footerFacebook");
  if (wa) wa.href = waUrl;
  const clubSocialFallbacks = {
    instagram: "https://www.instagram.com/explore/search/keyword/?q=Dhallhara%20Uttar%20Palli%20Yubagoshthi",
    facebook: "https://www.facebook.com/search/pages/?q=Dhallhara%20Uttar%20Palli%20Yubagoshthi"
  };
  [[ig, social.instagram || clubSocialFallbacks.instagram], [fb, social.facebook || clubSocialFallbacks.facebook]].forEach(([el, url]) => {
    if (!el) return;
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.classList.remove("is-unavailable", "unavailable");
    el.removeAttribute("aria-disabled");
  });
  if (whatsapp) {
    $("floatingWhatsapp").href = waUrl;
    $("contactWhatsapp").href = waUrl;
    $("contactWhatsapp").hidden = false;
  }

  // Dedicated developer profile inspired by the creator card on Agomonii.
  const developer = D.developer || {};
  const developerEmail = developer.email || "amitthandar.in@gmail.com";
  const emailLink = $("developerEmailLink");
  if (emailLink) { emailLink.href = `mailto:${developerEmail}`; emailLink.textContent = developerEmail; }
  const copyEmail = $("copyDeveloperEmail");
  if (copyEmail) copyEmail.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(developerEmail);
      copyEmail.querySelector("span").textContent = "COPIED";
      window.setTimeout(() => { copyEmail.querySelector("span").textContent = "COPY"; }, 1600);
    } catch (_) {
      window.location.href = `mailto:${developerEmail}`;
    }
  });
  [["developerInstagram", developer.instagram], ["developerLinkedIn", developer.linkedin], ["developerGitHub", developer.github], ["developerPortfolio", developer.portfolio]].forEach(([id, url]) => {
    const link = $(id);
    if (!link) return;
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      // Keep the icon usable even if a profile URL has not been configured.
      const profileSearch = {
        developerInstagram: "https://www.instagram.com/",
        developerLinkedIn: "https://www.linkedin.com/",
        developerGitHub: "https://github.com/",
        developerPortfolio: "https://www.google.com/search?q=Amit+Thandar+portfolio"
      };
      link.href = profileSearch[id] || "#developer";
      if (link.href !== "#developer") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
    link.classList.remove("unavailable", "is-unavailable");
    link.removeAttribute("aria-disabled");
  });

  // Developer profile is a modal opened from the top navigation, not a page section.
  const developerModal = $("developerModal");
  const openDeveloper = $("openDeveloper");
  const closeDeveloper = $("closeDeveloper");
  const developerDialog = developerModal?.querySelector(".developer-modal-dialog");
  let lastDeveloperTrigger = null;
  function showDeveloperProfile(){
    if(!developerModal) return;
    lastDeveloperTrigger = document.activeElement;
    developerModal.hidden = false;
    developerModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("developer-modal-open");
    developerDialog?.focus();
  }
  function hideDeveloperProfile(){
    if(!developerModal) return;
    developerModal.hidden = true;
    developerModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("developer-modal-open");
    lastDeveloperTrigger?.focus?.();
  }
  openDeveloper?.addEventListener("click",()=>{
    $("mainNav").classList.remove("open");
    $("menuToggle").setAttribute("aria-expanded","false");
    showDeveloperProfile();
  });
  closeDeveloper?.addEventListener("click",hideDeveloperProfile);
  developerModal?.querySelectorAll("[data-close-developer]").forEach(el=>el.addEventListener("click",hideDeveloperProfile));
  document.addEventListener("keydown",e=>{if(e.key==="Escape" && developerModal && !developerModal.hidden) hideDeveloperProfile();});

  $("menuToggle").addEventListener("click",()=>{
    const nav=$("mainNav");const open=nav.classList.toggle("open");
    $("menuToggle").setAttribute("aria-expanded",String(open));
  });
  $("mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{ $("mainNav").classList.remove("open"); $("menuToggle").setAttribute("aria-expanded","false"); }));
})();