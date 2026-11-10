import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, MapPin, Copy, Heart, Share2 } from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import "../styles/PostDetail.css";

const fullDate = (d) => {
  const date = new Date(d);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 기록`;
};
// "서울 종로구 자하문로7길 18" → "서울 · 종로구"
const area = (address = "") => address.split(" ").slice(0, 2).join(" · ");

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

  const [post, setPost] = useState(null);
  const [current, setCurrent] = useState(0);
  const [like, setLike] = useState({ liked: false, likeCount: 0 });
  const [others, setOthers] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrent(0);
    api.get(`/posts/${postId}`)
      .then((res) => setPost(res.data))
      .catch(() => { alert("게시물을 찾을 수 없어요."); navigate("/"); });
    api.get(`/posts/${postId}/like`).then((res) => setLike(res.data));
    api.get("/posts").then((res) =>
      setOthers(res.data.filter((p) => p.postId !== Number(postId)).slice(0, 3))
    );
  }, [postId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const toggleLike = async () => {
    if (!user) return navigate("/login");
    const res = await api.post(`/posts/${postId}/like`);
    setLike(res.data);
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(post.address);
    showToast("주소를 복사했어요.");
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch { /* 취소 */ }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("링크를 복사했어요.");
    }
  };

  const remove = async () => {
    if (!confirm("이 기록을 삭제할까요? 삭제하면 되돌릴 수 없어요.")) return;
    await api.delete(`/posts/${postId}`);
    navigate("/");
  };

  if (!post) return <><Header /><main className="container detail-loading">불러오는 중...</main></>;

  const images = post.imageUrls || [];
  const isOwner = user?.userId === post.userId;

  return (
    <>
      <Header />
      <main className="detail container">
        <div className="breadcrumb">
          <Link to="/" className="crumb">
            <ArrowLeft size={18} />장소 둘러보기<span className="slash">/</span><span className="crumb-cat">{post.categoryName}</span>
          </Link>
          {isOwner && (
            <div className="owner-actions">
              <Link to={`/posts/${postId}/edit`}><Pencil size={15} />수정</Link>
              <button onClick={remove}>삭제</button>
            </div>
          )}
        </div>

        <div className="detail-body">
          {/* 사진 */}
          <section className="gallery">
            <div className="featured">
              {images[current] && <img src={images[current]} alt={post.placeName} />}
              {images.length > 0 && <span className="position">{current + 1} / {images.length}</span>}
            </div>
            {images.length > 1 && (
              <div className="thumbs">
                {images.map((url, i) => (
                  <button key={url} className={`thumb ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)}>
                    <img src={url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 이야기 */}
          <section className="story-col">
            <div className="title-block">
              <div className="cat-area">
                <strong>{post.categoryName}</strong>
                <span>{area(post.address)}</span>
              </div>
              <h1>{post.title}</h1>
              <div className="author">
                <span className="avatar lg">{post.writerName?.[0]}</span>
                <div>
                  <p className="author-name">{post.writerName}</p>
                  <p className="author-date">{fullDate(post.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="place-box">
              <p className="place-name"><MapPin size={18} />{post.placeName}</p>
              <p className="place-address">{post.address}</p>
              <button className="copy-btn" onClick={copyAddress}><Copy size={13} />주소 복사</button>
            </div>

            <div className="visit-story">
              {post.content?.split(/\n+/).filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
            </div>

            <div className="reactions">
              <button className={`like-btn ${like.liked ? "liked" : ""}`} onClick={toggleLike}>
                <Heart size={18} fill={like.liked ? "currentColor" : "none"} />좋아요 {like.likeCount}
              </button>
              <button className="share-btn" onClick={share}><Share2 size={18} />공유</button>
            </div>
          </section>
        </div>

        {others.length > 0 && (
          <section className="more">
            <div className="more-heading">
              <h2>이웃의 다른 장소 기록</h2>
              <Link to="/">전체 기록 보기 →</Link>
            </div>
            <div className="more-grid">
              {others.map((p) => <PostCard key={p.postId} post={p} photoHeight={228} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}