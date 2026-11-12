import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings2, Plus } from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import "../styles/MyPage.css";

const PREVIEW = 3;

export default function MyPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showAllMine, setShowAllMine] = useState(false);
  const [showAllLiked, setShowAllLiked] = useState(false);

  const clearUser = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    Promise.all([api.get("/me/posts"), api.get("/me/likes")])
      .then(([mine, liked]) => {
        setMyPosts(mine.data);
        setLikedPosts(liked.data);
      })
      .catch((err) => {
        // 서버 재시작으로 세션이 끊긴 경우
        if (err.response?.status === 401) {
          clearUser();
          alert("로그인이 만료됐어요. 다시 로그인해주세요.");
          navigate("/login");
        }
      });
  }, []);

  const logout = async () => {
    await api.post("/users/logout").catch(() => {});
    clearUser();
    navigate("/");
  };

  const remove = async (postId) => {
    if (!confirm("이 기록을 삭제할까요? 삭제하면 되돌릴 수 없어요.")) return;
    await api.delete(`/posts/${postId}`);
    setMyPosts((prev) => prev.filter((p) => p.postId !== postId));
    setLikedPosts((prev) => prev.filter((p) => p.postId !== postId));
  };

  if (!user) return null;

  const mineToShow = showAllMine ? myPosts : myPosts.slice(0, PREVIEW);
  const likedToShow = showAllLiked ? likedPosts : likedPosts.slice(0, PREVIEW);

  return (
    <>
      <Header />
      <main className="mypage container">
        <div className="mypage-heading">
          <h1>나의 장소 기록장</h1>
          <button className="logout" onClick={logout}>로그아웃</button>
        </div>

        {/* 프로필 */}
        <section className="profile">
          <div className="profile-info">
            <span className="avatar xl">{user.name?.[0]}</span>
            <div>
              <div className="profile-name">
                <strong>{user.name}</strong>
                <span>@{user.loginId}</span>
              </div>
              <p className="profile-bio">천천히 걷고, 오래 머무는 곳을 기록해요.</p>
            </div>
          </div>
          <div className="profile-side">
            <div className="stat"><strong>{myPosts.length}</strong><span>나의 기록</span></div>
            <div className="stat"><strong>{likedPosts.length}</strong><span>좋아요한 기록</span></div>
            <button className="btn-light" onClick={() => alert("계정 설정은 준비 중이에요.")}>
              <Settings2 size={18} />계정 설정
            </button>
          </div>
        </section>

        {/* 내가 남긴 기록 */}
        <section className="my-section">
          <div className="section-heading">
            <h2>내가 남긴 기록<em>{myPosts.length}</em></h2>
            <Link to="/write" className="btn-primary"><Plus size={18} />새로운 장소 기록</Link>
          </div>

          {myPosts.length === 0 ? (
            <div className="empty-box">
              <p>아직 남긴 기록이 없어요.</p>
              <Link to="/write">첫 장소 기록하기 →</Link>
            </div>
          ) : (
            <>
              <div className="card-grid">
                {mineToShow.map((p) => (
                  <div key={p.postId} className="owned">
                    <PostCard post={p} photoHeight={260} />
                    <div className="owner-controls">
                      <span>공개 기록</span>
                      <div>
                        <Link to={`/posts/${p.postId}/edit`}>수정</Link>
                        <button onClick={() => remove(p.postId)}>삭제</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {myPosts.length > PREVIEW && (
                <div className="view-all">
                  <button className="btn-light" onClick={() => setShowAllMine(!showAllMine)}>
                    {showAllMine ? "접기" : "내 기록 전체 보기"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 좋아요한 기록 */}
        <section className="my-section liked">
          <div className="section-heading">
            <div>
              <h2>좋아요한 기록<em>{likedPosts.length}</em></h2>
              <p className="section-desc">마음에 담아둔 장소, 다음 주말에 꺼내보세요.</p>
            </div>
            {likedPosts.length > PREVIEW && (
              <button className="text-link" onClick={() => setShowAllLiked(!showAllLiked)}>
                {showAllLiked ? "접기" : "전체 보기 →"}
              </button>
            )}
          </div>

          {likedPosts.length === 0 ? (
            <div className="empty-box">
              <p>아직 좋아요한 기록이 없어요.</p>
              <Link to="/">장소 둘러보러 가기 →</Link>
            </div>
          ) : (
            <div className="card-grid">
              {likedToShow.map((p) => <PostCard key={p.postId} post={p} photoHeight={220} />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}