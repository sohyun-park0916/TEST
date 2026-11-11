// ---------- 뉴스 탭 (더미 데이터) ----------
const NEWS = {
  news: [
    ["해운일보", "컨테이너 운임 3주 연속 상승…아시아-유럽 노선 강세"],
    ["물류신문", "부산항 물동량 사상 최대치 경신"],
    ["경제매일", "프롬해운, 디지털 선적 조회 서비스 확대"],
    ["IT투데이", "AI로 바뀌는 물류 현장, 자동화 사례 늘어"],
    ["국제뉴스", "수에즈 운하 통항 정상화 기대감"],
  ],
  ent: [
    ["엔터뉴스", "연말 시상식 라인업 공개"],
    ["스타데일리", "올겨울 개봉 기대작 TOP 5"],
    ["뮤직위크", "신곡 차트 1위 차지한 그룹은?"],
  ],
  sports: [
    ["스포츠한국", "K리그 최종 라운드, 우승 향방은"],
    ["야구타임즈", "스토브리그 FA 시장 개막"],
    ["골프뉴스", "시즌 최종전 우승자 탄생"],
  ],
  biz: [
    ["경제신문", "환율 1,380원대 등락…수출기업 영향은"],
    ["머니투데이", "코스피 2,680선 회복"],
    ["산업일보", "조선업 수주 호조 지속"],
  ],
};

function renderNews(key) {
  document.getElementById("news").innerHTML = NEWS[key]
    .map(([press, title]) => `<li><span class="press">${press}</span><a href="#">${title}</a></li>`)
    .join("");
}
document.querySelectorAll(".tab").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderNews(btn.dataset.tab);
  })
);
renderNews("news");

// ---------- CMA CGM 스케줄 (2026-11-11 조회, 12/15 출항분까지) ----------
// [출항, 터미널, 서류마감, 모선, 도착, 소요일, 경유]
const SCHEDULE = {
  busan: [
    ["2026-11-16", "BNCT", "11-13 01:54", "CMA CGM MONTE CRISTO", "2026-12-26", 40, "알렉산드리아"],
    ["2026-11-22", "BNCT", "11-19 07:14", "CMA CGM D'ARTAGNAN", "2027-01-02", 41, "알렉산드리아"],
    ["2026-11-27", "BNCT", "11-24 03:00", "CMA CGM ADONIS", "2027-01-06", 40, "알렉산드리아"],
    ["2026-12-10", "BNCT", "12-06 22:00", "CMA CGM APOLLON", "2027-01-23", 44, "알렉산드리아"],
  ],
  incheon: [
    ["2026-11-12", "선광신항", "11-09 12:00", "CNC PLUTO", "2026-12-26", 44, "닝보·알렉산드리아"],
    ["2026-11-18", "한진", "11-13 11:00", "KOTA NASRAT", "2027-01-06", 49, "닝보·알렉산드리아"],
    ["2026-11-25", "선광신항", "11-23 12:00", "KUO LONG", "2027-01-23", 59, "닝보·알렉산드리아"],
    ["2026-11-25", "한진", "11-19 17:00", "CNC PANTHER", "2027-01-23", 59, "닝보·알렉산드리아"],
    ["2026-12-02", "선광신항", "11-30 12:00", "SEA OF LUCK", "2027-01-23", 52, "닝보·알렉산드리아"],
    ["2026-12-03", "한진", "11-30 12:00", "SKY PRIDE", "2027-01-23", 51, "닝보·알렉산드리아"],
    ["2026-12-09", "선광신항", "12-07 12:00", "CNC MARS", "2027-01-30", 52, "닝보·알렉산드리아"],
    ["2026-12-09", "한진", "12-04 12:00", "HUI ZHOU JIN HAI", "2027-01-30", 52, "닝보·알렉산드리아"],
    ["2026-12-13", "한진", "12-09 12:00", "KOTA NASRAT", "2027-02-13", 62, "닝보·알렉산드리아"],
  ],
};

function cutoffPassed(dep, cutoff) {
  // 서류마감 "MM-DD HH:MM" → 출항 연도 기준 Date
  const [md, hm] = cutoff.split(" ");
  return new Date(`${dep.slice(0, 4)}-${md}T${hm}:00+09:00`) < new Date();
}

function renderSchedule(pol) {
  const rows = SCHEDULE[pol];
  const open = rows.filter((r) => !cutoffPassed(r[0], r[2]));
  const fastest = Math.min(...(open.length ? open : rows).map((r) => r[5]));
  document.getElementById("schedTable").innerHTML =
    "<thead><tr><th>출항</th><th>터미널</th><th>서류마감</th><th>모선</th><th>도착</th><th>소요</th><th>경유</th></tr></thead><tbody>" +
    rows
      .map(([dep, term, cut, vsl, arr, days, via]) => {
        const closed = cutoffPassed(dep, cut);
        return `<tr class="${closed ? "closed" : ""}"><td>${dep.slice(5)}</td><td>${term}</td><td>${cut}${
          closed ? '<span class="badge">마감</span>' : ""
        }</td><td>${vsl}</td><td>${arr.slice(2)}</td><td class="num">${days}일${
          days === fastest && !closed ? '<span class="badge fast">최단</span>' : ""
        }</td><td>${via}</td></tr>`;
      })
      .join("") +
    "</tbody>";
}
document.querySelectorAll(".stab").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".stab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderSchedule(btn.dataset.pol);
  })
);
renderSchedule("busan");

function doSearch() {
  const q = document.getElementById("q").value.trim();
  if (q) window.open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank");
}

// ---------- Supabase 구글 로그인 ----------
const cfg = window.SOHYUN_CONFIG || {};
const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY.startsWith("eyJ");
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
const box = document.getElementById("loginBox");

const GOOGLE_ICON =
  '<span class="g"><svg width="14" height="14" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6C6.6 42.6 14.6 48 24 48z"/></svg></span>';

function renderLoggedOut(notice) {
  box.innerHTML = `
    <p class="desc">SOHYUN을 더 안전하고 편리하게 이용하세요</p>
    <button class="btn-login" id="btnLogin">${GOOGLE_ICON} Google로 로그인</button>
    <div class="sub-links"><span>아이디 찾기 · 비밀번호 찾기</span><span>회원가입</span></div>
    ${notice ? `<p class="notice">${notice}</p>` : ""}`;
  document.getElementById("btnLogin").onclick = async () => {
    if (!sb) return renderLoggedOut("Supabase 설정(config.js)이 아직 비어 있습니다.");
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) renderLoggedOut("로그인 오류: " + error.message);
  };
}

function renderLoggedIn(user) {
  const m = user.user_metadata || {};
  const name = m.full_name || m.name || user.email;
  box.innerHTML = `
    <div class="profile">
      <img src="${m.avatar_url || m.picture || "logo.png"}" alt="" referrerpolicy="no-referrer" />
      <div><div class="name">${name}님</div><div class="email">${user.email || ""}</div></div>
    </div>
    <button class="btn-logout" id="btnLogout">로그아웃</button>`;
  document.getElementById("btnLogout").onclick = async () => {
    await sb.auth.signOut();
    renderLoggedOut();
  };
}

if (sb) {
  sb.auth.getSession().then(({ data }) =>
    data.session ? renderLoggedIn(data.session.user) : renderLoggedOut()
  );
  sb.auth.onAuthStateChange((_e, session) =>
    session ? renderLoggedIn(session.user) : renderLoggedOut()
  );
} else {
  renderLoggedOut();
}
