import { useEffect, useMemo, useState } from "react";
import { Search, LayoutGrid, Coffee, Utensils, Footprints, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import "../styles/Main.css";

const ICONS = { "카페": Coffee, "음식점": Utensils, "산책": Footprints, "문화·기타": BookOpen };
const PAGE_SIZE = 6;
const SUGGESTIONS = ["서촌", "성수", "연남"];

export default function Main() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    api.get("/posts", { params: { categoryId } }).then((res) => setPosts(res.data));
    setPage(1);
  }, [categoryId]);

  // 검색 + 정렬
  const filtered = useMemo(() => {
    const k = keyword.trim();
    let list = k
      ? posts.filter((p) => [p.title, p.placeName, p.address, p.content].some((v) => v?.includes(k)))
      : posts;
    if (sort === "popular") list = [...list].sort((a, b) => b.likeCount - a.likeCount);
    return list;
  }, [posts, keyword, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const search = (value) => { setKeyword(value); setPage(1); };
  const changeSort = (value) => { setSort(value); setPage(1); };

  return (
    <>
      <Header />
      <main className="main container">
        <section className="intro">
          <div className="intro-text">
            <p className="eyebrow">나의 일상, 누군가의 발견</p>
            <h1>오늘은 어디에 머물까요?</h1>
            <p className="intro-desc">좋아하는 장소를 기록하고, 다른 사람의 시선으로 새로운 곳을 만나보세요.</p>
          </div>
          <div className="search">
            <label className="search-input">
              <Search size={20} />
              <input value={keyword} onChange={(e) => search(e.target.value)} placeholder="장소 이름, 동네, 기록 검색" />
            </label>
            <p className="search-suggest">
              어디부터 가볼까요?&nbsp;&nbsp;
              {SUGGESTIONS.map((w, i) => (
                <span key={w}>{i > 0 && " · "}<button onClick={() => search(w)}>{w}</button></span>
              ))}
            </p>
          </div>
        </section>

        <nav className="category-nav">
          <button className={`chip ${categoryId === null ? "active" : ""}`} onClick={() => setCategoryId(null)}>
            <LayoutGrid size={17} /> 전체
          </button>
          {categories.map((c) => {
            const Icon = ICONS[c.name] || BookOpen;
            return (
              <button key={c.categoryId} className={`chip ${categoryId === c.categoryId ? "active" : ""}`} onClick={() => setCategoryId(c.categoryId)}>
                <Icon size={17} /> {c.name}
              </button>
            );
          })}
        </nav>

        <div className="feed-heading">
          <div className="feed-title">
            <h2>이웃의 장소 기록</h2>
            <span>새롭게 쌓인 {filtered.length}개의 순간</span>
          </div>
          <div className="sort">
            <button className={sort === "latest" ? "active" : ""} onClick={() => changeSort("latest")}>최신순</button>
            <span className="divider">|</span>
            <button className={sort === "popular" ? "active" : ""} onClick={() => changeSort("popular")}>좋아요순</button>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <p className="empty">아직 기록이 없어요. 첫 장소를 기록해보세요!</p>
        ) : (
          <div className="feed-grid">
            {pageItems.map((p) => <PostCard key={p.postId} post={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`page ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={18} /></button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}