import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";

const initialArticles = [
  {
    id: "article-014",
    title: "Tối ưu góc làm việc tại nhà để tập trung sâu hơn",
    category: "Năng suất",
    status: "Đã xuất bản",
    updated: "12 phút trước",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=480&q=85",
    imageAlt: "Góc làm việc sáng, có bàn gỗ và cây xanh",
    excerpt:
      "Một góc làm việc tốt không cần nhiều thiết bị. Ánh sáng, mặt bàn gọn và những khoảng nghỉ ngắn thường tạo nên khác biệt lớn hơn.",
    paragraph:
      "Bắt đầu bằng việc quan sát cách bạn sử dụng căn phòng trong một ngày. Ánh sáng tự nhiên, vị trí ổ cắm và tiếng ồn sẽ quyết định bố cục phù hợp hơn bất kỳ món đồ mới nào.",
    words: "1.284 từ",
  },
  {
    id: "article-013",
    title: "Cách xây thói quen đọc mỗi ngày không áp lực",
    category: "Lối sống",
    status: "Bản nháp",
    updated: "Hôm qua",
    image:
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=480&q=85",
    imageAlt: "Một người đang đọc sách bên cửa sổ",
    excerpt:
      "Đọc đều đặn bắt đầu từ một khoảng thời gian nhỏ, một cuốn sách đang khiến bạn tò mò và một nơi dễ quay lại.",
    paragraph:
      "Thay vì đặt mục tiêu số trang lớn, hãy gắn việc đọc với một khoảnh khắc đã có sẵn trong ngày. Một chương ngắn cũng đủ để tạo nhịp và giúp bạn dễ tiếp tục vào ngày mai.",
    words: "936 từ",
  },
  {
    id: "article-012",
    title: "Vì sao nhóm nhỏ cần lịch xuất bản rõ ràng?",
    category: "Chiến lược nội dung",
    status: "Chờ duyệt",
    updated: "2 ngày trước",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=480&q=85",
    imageAlt: "Sổ ghi chú và bút trên bàn làm việc",
    excerpt:
      "Một lịch xuất bản hữu ích không lấp kín tuần. Nó cho cả nhóm biết việc gì đã sẵn sàng, ai đang phụ trách và đâu là bước kế tiếp.",
    paragraph:
      "Khi mọi người cùng nhìn thấy trạng thái của từng bài, cuộc trao đổi chuyển từ hỏi tiến độ sang giải quyết đúng phần còn thiếu. Bắt đầu với một lịch đơn giản và điều chỉnh theo nhịp làm việc thực tế.",
    words: "1.102 từ",
  },
];

const initialJob = {
  id: "demo-job-01",
  keyword: "cách chăm sóc cây trong căn hộ",
  status: "Đang xử lý",
  progress: 60,
  updated: "Vừa cập nhật",
  paused: false,
  simulation: false,
};

const workflowStages = ["Nghiên cứu", "Viết bài", "Tạo ảnh", "Xuất bản"];

const navigation = [
  { label: "Tổng quan", icon: LayoutDashboard, target: "overview" },
  { label: "Bài viết", icon: FileText, target: "articles" },
  { label: "Lịch xuất bản", icon: CalendarDays, target: "articles" },
  { label: "Thư viện ảnh", icon: ImageIcon, target: "articles" },
];

const filters = ["Tất cả", "Đã xuất bản", "Bản nháp", "Chờ duyệt"];

function getStageIndex(progress) {
  return progress >= 60 ? 1 : 0;
}

function StatusLabel({ status }) {
  const statusClass =
    {
      "Đã xuất bản": "status-published",
      "Bản nháp": "status-draft",
      "Chờ duyệt": "status-review",
      "Đang xử lý": "status-processing",
      "Tạm dừng": "status-paused",
    }[status] ?? "status-draft";

  return (
    <span className={`status-label ${statusClass}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

function App() {
  const [articles, setArticles] = useState(initialArticles);
  const [job, setJob] = useState(initialJob);
  const [keyword, setKeyword] = useState("");
  const [keywordError, setKeywordError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [activeNav, setActiveNav] = useState("Tổng quan");
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleTitleDraft, setArticleTitleDraft] = useState("");
  const [articleError, setArticleError] = useState("");
  const keywordRef = useRef(null);
  const searchRef = useRef(null);
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const wasMobileMenuOpen = useRef(false);
  const noticeTimer = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (isMobileViewport && mobileMenuOpen) {
      sidebarRef.current?.querySelector("a, button")?.focus();
    } else if (isMobileViewport && wasMobileMenuOpen.current) {
      menuButtonRef.current?.focus();
    }

    wasMobileMenuOpen.current = mobileMenuOpen;
  }, [isMobileViewport, mobileMenuOpen]);

  function handleSidebarKeyDown(event) {
    if (!isMobileViewport || !mobileMenuOpen) return;

    if (event.key === "Escape") {
      setMobileMenuOpen(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusableItems = sidebarRef.current?.querySelectorAll(
      "a[href], button:not([disabled])",
    );
    if (!focusableItems?.length) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  }

  useEffect(() => {
    if (!job?.simulation || job.paused || job.progress >= 60) return undefined;

    const timer = window.setTimeout(() => {
      setJob((current) => {
        if (!current || current.paused) return current;
        const progress = Math.min(current.progress + 26, 60);
        return {
          ...current,
          progress,
          status: progress >= 60 ? "Đang xử lý" : "Đang nghiên cứu",
          updated: "Vừa cập nhật",
        };
      });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [job]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(
    () => () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("vi");

    return articles.filter((article) => {
      const matchesFilter =
        activeFilter === "Tất cả" || article.status === activeFilter;
      const matchesSearch =
        !normalizedSearch ||
        `${article.title} ${article.category}`
          .toLocaleLowerCase("vi")
          .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, articles, searchTerm]);

  const selectedArticle = articles.find(
    (article) => article.id === selectedArticleId,
  );
  const activeStage = getStageIndex(job?.progress ?? 0);

  function showNotice(message) {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 4200);
  }

  function handleGenerate(event) {
    event.preventDefault();
    const value = keyword.trim();

    if (!value) {
      setKeywordError("Nhập từ khóa hoặc chủ đề để bắt đầu.");
      keywordRef.current?.focus();
      return;
    }

    setKeywordError("");
    setJob({
      id: `demo-${Date.now()}`,
      keyword: value,
      status: "Đang nghiên cứu",
      progress: 8,
      updated: "Vừa bắt đầu",
      paused: false,
      simulation: true,
    });
    setKeyword("");
    showNotice(
      "Đã chạy mô phỏng cho chủ đề này. AI backend chưa được kết nối.",
    );
  }

  function handleNavigation(item) {
    setActiveNav(item.label);
    setMobileMenuOpen(false);
    if (item.label === "Lịch xuất bản") setActiveFilter("Chờ duyệt");
    if (item.label === "Bài viết") setActiveFilter("Tất cả");
    document.getElementById(item.target)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    if (item.label === "Thư viện ảnh") {
      showNotice("Ảnh minh họa đang được xem cùng các bài viết mẫu.");
    }
  }

  function toggleJob() {
    if (!job) return;
    const paused = !job.paused;
    setJob({ ...job, paused, status: paused ? "Tạm dừng" : "Đang xử lý" });
    showNotice(
      paused ? "Tác vụ demo đã tạm dừng." : "Tác vụ demo đã tiếp tục.",
    );
  }

  function openArticle(article) {
    setSelectedArticleId(article.id);
    setEditingArticleId(null);
    setArticleError("");
  }

  function startEditing(article) {
    setEditingArticleId(article.id);
    setArticleTitleDraft(article.title);
    setArticleError("");
  }

  function saveArticle() {
    const title = articleTitleDraft.trim();
    if (!title) {
      setArticleError("Tiêu đề không được để trống.");
      return;
    }

    setArticles((current) =>
      current.map((article) =>
        article.id === editingArticleId
          ? { ...article, title, status: "Bản nháp", updated: "Vừa cập nhật" }
          : article,
      ),
    );
    setEditingArticleId(null);
    setArticleError("");
    showNotice("Đã lưu thay đổi vào dữ liệu demo.");
  }

  function publishArticle(article) {
    setArticles((current) =>
      current.map((item) =>
        item.id === article.id
          ? { ...item, status: "Đã xuất bản", updated: "Vừa cập nhật" }
          : item,
      ),
    );
    showNotice("Đã cập nhật trạng thái xuất bản demo.");
  }

  return (
    <div className="app-shell min-h-screen">
      <aside
        ref={sidebarRef}
        className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}
        aria-hidden={isMobileViewport && !mobileMenuOpen}
        inert={isMobileViewport && !mobileMenuOpen}
        onKeyDown={handleSidebarKeyDown}
      >
        <a
          className="brand-lockup"
          href="#overview"
          aria-label="AI Content Workspace, tổng quan"
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="brand-name">
            CONTENT
            <span>WORKSPACE</span>
          </span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar">CW</span>
          <span className="workspace-copy">
            <strong>Không gian cá nhân</strong>
            <span>Bản demo</span>
          </span>
          <ChevronRight size={15} aria-hidden="true" />
        </div>

        <nav className="primary-nav" aria-label="Điều hướng chính">
          <p className="nav-heading">WORKSPACE</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`nav-link ${activeNav === item.label ? "is-active" : ""}`}
                key={item.label}
                onClick={() => handleNavigation(item)}
                type="button"
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
                {item.label === "Lịch xuất bản" && (
                  <span className="nav-count">1</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-link"
            onClick={() =>
              showNotice("Trợ giúp sẽ có trong workspace hoàn chỉnh.")
            }
            type="button"
          >
            <CircleHelp size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>Trợ giúp</span>
          </button>
          <button
            className="nav-link"
            onClick={() => showNotice("Cài đặt workspace chưa được kết nối.")}
            type="button"
          >
            <Settings2 size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>Cài đặt</span>
          </button>
          <div className="sidebar-footnote">
            <span className="connection-dot" />
            Chế độ xem trước
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileMenuOpen(false)}
          type="button"
          aria-label="Đóng menu"
        />
      )}

      <div className="main-column min-w-0 flex-1">
        <header className="topbar">
          <div className="topbar-left">
            <button
              ref={menuButtonRef}
              className="icon-button mobile-menu-button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              type="button"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <div className="breadcrumbs">
              <span>Workspace</span>
              <ChevronRight size={14} aria-hidden="true" />
              <strong>{activeNav}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            {searchOpen && (
              <label className="header-search">
                <Search size={16} aria-hidden="true" />
                <span className="sr-only">Tìm trong bài viết</span>
                <input
                  ref={searchRef}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm bài viết..."
                  value={searchTerm}
                />
                <button
                  aria-label="Đóng tìm kiếm"
                  className="search-close"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchTerm("");
                  }}
                  type="button"
                >
                  <X size={15} />
                </button>
              </label>
            )}
            <button
              className={`icon-button ${searchOpen ? "header-search-trigger-active" : ""}`}
              onClick={() => setSearchOpen((open) => !open)}
              type="button"
              aria-label={searchOpen ? "Đóng tìm kiếm" : "Tìm kiếm"}
              title="Tìm kiếm bài viết"
            >
              <Search size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <div className="popover-anchor">
              <button
                className="icon-button notification-button"
                onClick={() => setNotificationsOpen((open) => !open)}
                type="button"
                aria-label="Thông báo"
                aria-expanded={notificationsOpen}
                title="Thông báo"
              >
                <Bell size={18} strokeWidth={1.8} aria-hidden="true" />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <section
                  className="notification-popover"
                  aria-label="Thông báo gần đây"
                >
                  <div className="popover-heading">
                    <strong>Thông báo</strong>
                    <span>1 mới</span>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon">
                      <LoaderCircle size={16} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>
                        Agent{" "}
                        {job?.status.toLocaleLowerCase("vi") ?? "đang chờ"}
                      </strong>
                      <small>
                        {job?.keyword ?? "Tác vụ demo"} · {job?.progress ?? 0}%
                      </small>
                    </span>
                  </div>
                  <p className="demo-caption">
                    Thông báo minh họa trong bản demo.
                  </p>
                </section>
              )}
            </div>
            <span className="topbar-divider" />
            <button
              className="account-button"
              onClick={() => showNotice("Tài khoản đang ở chế độ xem trước.")}
              type="button"
            >
              <span className="account-avatar">CW</span>
              <span className="account-label">Tài khoản demo</span>
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="dashboard" id="overview">
          <section className="page-heading">
            <div>
              <h1>Tạo bài viết mới</h1>
              <p>
                Bắt đầu với một chủ đề. Agent sẽ lo phần nghiên cứu và bản nháp.
              </p>
            </div>
            <span className="preview-badge">
              <span className="preview-dot" />
              Dữ liệu demo
            </span>
          </section>

          <div className="workbench-grid">
            <section
              className="composer-panel surface-panel"
              aria-labelledby="composer-title"
            >
              <div className="panel-heading">
                <div className="panel-title-wrap">
                  <span className="section-mark" aria-hidden="true">
                    <Sparkles size={16} strokeWidth={1.8} />
                  </span>
                  <h2 id="composer-title">Ý tưởng của bạn</h2>
                </div>
                <span className="panel-meta">BÀI BLOG</span>
              </div>

              <form
                className="composer-form"
                onSubmit={handleGenerate}
                noValidate
              >
                <label htmlFor="keyword">Từ khóa hoặc chủ đề</label>
                <div
                  className={`keyword-field ${keywordError ? "has-error" : ""}`}
                >
                  <Search size={18} strokeWidth={1.8} aria-hidden="true" />
                  <input
                    id="keyword"
                    ref={keywordRef}
                    aria-describedby={
                      keywordError ? "keyword-error" : "keyword-help"
                    }
                    aria-invalid={Boolean(keywordError)}
                    autoComplete="off"
                    maxLength={140}
                    onChange={(event) => {
                      setKeyword(event.target.value);
                      if (keywordError) setKeywordError("");
                    }}
                    placeholder="Ví dụ: cách chăm sóc cây trong căn hộ"
                    value={keyword}
                  />
                  {keyword && (
                    <button
                      aria-label="Xóa từ khóa"
                      className="clear-keyword"
                      onClick={() => {
                        setKeyword("");
                        keywordRef.current?.focus();
                      }}
                      type="button"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                {keywordError ? (
                  <p className="field-error" id="keyword-error" role="alert">
                    {keywordError}
                  </p>
                ) : (
                  <p className="field-help" id="keyword-help">
                    Một ý tưởng cụ thể giúp Agent nghiên cứu đúng trọng tâm.
                  </p>
                )}

                <div className="composer-options">
                  <div className="option-field">
                    <span className="option-label">Định dạng</span>
                    <span className="option-value">
                      <FileText size={15} aria-hidden="true" />
                      Bài blog
                    </span>
                  </div>
                  <div className="option-field">
                    <span className="option-label">Giọng văn</span>
                    <span className="option-value">Chuyên gia thân thiện</span>
                  </div>
                  <button
                    className="text-action"
                    onClick={() =>
                      showNotice(
                        "Tùy chọn nâng cao sẽ có trong workspace hoàn chỉnh.",
                      )
                    }
                    type="button"
                  >
                    <Settings2 size={15} aria-hidden="true" />
                    Tùy chỉnh
                  </button>
                </div>

                <div className="composer-footer">
                  <span className="safe-note">
                    <Check size={14} aria-hidden="true" />
                    Có thể chỉnh sửa trước khi xuất bản
                  </span>
                  <button className="primary-action" type="submit">
                    <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                    Tạo bài viết bằng AI
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </section>

            <section
              className="agent-panel surface-panel"
              aria-labelledby="agent-title"
            >
              <div className="panel-heading">
                <div className="panel-title-wrap">
                  <span className="agent-mark" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <h2 id="agent-title">AI Agent</h2>
                </div>
                <span
                  className={`agent-status ${job?.paused ? "is-paused" : ""}`}
                  role="status"
                >
                  <span className="status-dot" />
                  {job?.paused ? "Tạm dừng" : job?.status}
                </span>
              </div>

              {job ? (
                <>
                  <div className="job-title-row">
                    <div className="job-subject">{job.keyword}</div>
                    <span className="job-percent">{job.progress}%</span>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label={`Tiến trình Agent: ${job.progress}%`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={job.progress}
                  >
                    <span style={{ width: `${job.progress}%` }} />
                  </div>
                  <ol className="workflow-route" aria-label="Các bước xử lý">
                    {workflowStages.map((stage, index) => {
                      const state =
                        index < activeStage
                          ? "complete"
                          : index === activeStage
                            ? "active"
                            : "queued";
                      return (
                        <li
                          className={`workflow-stage stage-${state}`}
                          key={stage}
                        >
                          <span className="stage-marker" aria-hidden="true">
                            {state === "complete" ? <Check size={10} /> : null}
                          </span>
                          <span>{stage}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="job-foot">
                    <span className="job-message">
                      <span className="job-live-dot" />
                      {job.progress >= 60
                        ? "Đang viết bản nháp từ các nguồn đã chọn."
                        : "Đang nghiên cứu chủ đề và sắp xếp nguồn."}
                    </span>
                    <button
                      className="job-control"
                      onClick={toggleJob}
                      type="button"
                      aria-label={
                        job.paused
                          ? "Tiếp tục tác vụ demo"
                          : "Tạm dừng tác vụ demo"
                      }
                      title={job.paused ? "Tiếp tục" : "Tạm dừng"}
                    >
                      {job.paused ? <Play size={15} /> : <Pause size={15} />}
                    </button>
                  </div>
                  <div className="demo-notice">
                    <span className="demo-line" />
                    <span>
                      Mô phỏng giao diện, chưa kết nối AI backend.
                      {job.simulation
                        ? job.progress >= 60
                          ? " Tiến trình demo dừng ở 60%."
                          : " Không có yêu cầu nào được gửi đến AI."
                        : " Đây là trạng thái mẫu."}
                    </span>
                  </div>
                </>
              ) : (
                <div className="agent-empty">
                  <LoaderCircle size={18} aria-hidden="true" />
                  <p>Chưa có tác vụ đang chạy.</p>
                </div>
              )}
            </section>
          </div>

          <section
            className="articles-section"
            id="articles"
            aria-labelledby="articles-title"
          >
            <div className="articles-heading">
              <div>
                <h2 id="articles-title">Bài viết gần đây</h2>
                <p>Theo dõi bản nháp và nội dung đã xuất bản của bạn.</p>
              </div>
              <button
                className="view-all-button"
                onClick={() => {
                  setActiveFilter("Tất cả");
                  setSearchTerm("");
                  showNotice("Đang hiển thị tất cả bài viết mẫu.");
                }}
                type="button"
              >
                Xem tất cả
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="article-toolbar">
              <div
                className="filter-tabs"
                role="group"
                aria-label="Lọc bài viết"
              >
                {filters.map((filter) => (
                  <button
                    aria-pressed={activeFilter === filter}
                    className={`filter-tab ${activeFilter === filter ? "is-selected" : ""}`}
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    type="button"
                  >
                    {filter}
                    {filter === "Chờ duyệt" && (
                      <span className="filter-count" aria-label="1 bài viết">
                        1
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="article-count">
                {filteredArticles.length} bài viết mẫu
              </span>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="article-list">
                <div className="article-list-header" aria-hidden="true">
                  <span>NỘI DUNG</span>
                  <span>TRẠNG THÁI</span>
                  <span>CẬP NHẬT</span>
                  <span />
                </div>
                {filteredArticles.map((article) => (
                  <article className="article-row" key={article.id}>
                    <button
                      className="article-main"
                      onClick={() => openArticle(article)}
                      type="button"
                      aria-label={`Mở xem trước: ${article.title}`}
                    >
                      <img
                        alt={article.imageAlt}
                        className="article-cover"
                        loading="lazy"
                        src={article.image}
                      />
                      <span className="article-copy">
                        <strong>{article.title}</strong>
                        <span>{article.category}</span>
                      </span>
                    </button>
                    <div className="article-status-cell">
                      <StatusLabel status={article.status} />
                    </div>
                    <span className="article-updated">
                      <Clock3 size={14} aria-hidden="true" />
                      {article.updated}
                    </span>
                    <div className="article-actions">
                      <button
                        className="row-action"
                        onClick={() => openArticle(article)}
                        type="button"
                        aria-label={`Xem bài viết: ${article.title}`}
                        title="Xem bài viết"
                      >
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="row-action row-more"
                        onClick={() => openArticle(article)}
                        type="button"
                        aria-label={`Tùy chọn bài viết: ${article.title}`}
                        title="Tùy chọn"
                      >
                        <MoreHorizontal size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <BookOpen size={20} aria-hidden="true" />
                <strong>Không tìm thấy bài viết phù hợp</strong>
                <span>Thử từ khóa khác hoặc xóa bộ lọc hiện tại.</span>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("Tất cả");
                  }}
                  type="button"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {selectedArticle && (
              <section
                className="article-preview-panel"
                aria-labelledby="preview-title"
              >
                <div className="preview-panel-head">
                  <div>
                    <h3 id="preview-title">Xem trước bài viết</h3>
                    <p>{selectedArticle.words} · Nội dung demo</p>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => {
                      setSelectedArticleId(null);
                      setEditingArticleId(null);
                    }}
                    type="button"
                    aria-label="Đóng xem trước"
                  >
                    <X size={17} />
                  </button>
                </div>
                {editingArticleId === selectedArticle.id ? (
                  <div className="edit-article-form">
                    <label htmlFor="article-title">Tiêu đề bài viết</label>
                    <input
                      id="article-title"
                      onChange={(event) =>
                        setArticleTitleDraft(event.target.value)
                      }
                      value={articleTitleDraft}
                    />
                    {articleError && (
                      <p className="field-error">{articleError}</p>
                    )}
                    <div className="preview-actions">
                      <button
                        className="secondary-action"
                        onClick={() => setEditingArticleId(null)}
                        type="button"
                      >
                        Hủy
                      </button>
                      <button
                        className="primary-action compact-action"
                        onClick={saveArticle}
                        type="button"
                      >
                        <Check size={15} />
                        Lưu thay đổi demo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="markdown-preview">
                    <h4>{selectedArticle.title}</h4>
                    <p>{selectedArticle.excerpt}</p>
                    <h5>Điều cần biết</h5>
                    <p>{selectedArticle.paragraph}</p>
                  </div>
                )}
                {editingArticleId !== selectedArticle.id && (
                  <div className="preview-actions">
                    <button
                      className="secondary-action"
                      onClick={() => startEditing(selectedArticle)}
                      type="button"
                    >
                      Chỉnh sửa tiêu đề
                    </button>
                    {selectedArticle.status !== "Đã xuất bản" && (
                      <button
                        className="primary-action compact-action"
                        onClick={() => publishArticle(selectedArticle)}
                        type="button"
                      >
                        <ArrowUpRight size={15} />
                        Xuất bản demo
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}
          </section>

          <footer className="page-footer">
            <span>AI Content Workspace</span>
            <span>Giao diện demo · Chưa kết nối dịch vụ AI hoặc xuất bản</span>
          </footer>
        </main>
      </div>

      {notice && (
        <div className="toast-message" role="status" aria-live="polite">
          <span className="toast-check">
            <Check size={14} />
          </span>
          {notice}
          <button
            onClick={() => setNotice("")}
            type="button"
            aria-label="Đóng thông báo"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
