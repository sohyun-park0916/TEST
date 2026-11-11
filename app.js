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
