import { Link } from "react-router-dom";
import { Images, MapPin, Heart } from "lucide-react";
import "../styles/PostCard.css";

const formatDate = (d) => {
  const date = new Date(d);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
// "서울 종로구 서촌로 12" → "종로구 서촌로"
const shortArea = (address = "") => address.split(" ").slice(1, 3).join(" ");

export default function PostCard({ post, photoHeight = 286 }) {
  const images = post.imageUrls || [];

  return (
    <Link to={`/posts/${post.postId}`} className="post-card">
      <div className="post-photo" style={{ height: photoHeight }}>
        {images[0] && <img src={images[0]} alt={post.placeName} />}
        {images.length > 0 && (
          <span className="photo-count"><Images size={13} />{images.length}</span>
        )}
      </div>

      <div className="post-info">
        <div className="post-meta">
          <strong>{post.categoryName}</strong>
          <span>{shortArea(post.address)}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-place"><MapPin size={14} />{post.placeName}</div>
      </div>

      <div className="post-social">
        <div className="post-author">
          <span className="avatar">{post.writerName?.[0]}</span>
          <span className="author-name">{post.writerName}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        <div className="post-likes"><Heart size={17} />{post.likeCount}</div>
      </div>
    </Link>
  );
}