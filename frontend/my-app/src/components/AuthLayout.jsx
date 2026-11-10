import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
import "../styles/Auth.css";

export default function AuthLayout({ photo, title, caption, returnLabel, children }) {
  return (
    <div className="auth">
      <aside className="auth-visual" style={{ backgroundImage: `url(${photo})` }}>
        <Link to="/" className="auth-brand">placelog<span className="dot" /></Link>
        <div className="auth-intro">
          <p className="auth-tagline">좋아하는 장소를, 오래 기억하도록.</p>
          <h2>{title[0]}<br />{title[1]}</h2>
          <p className="auth-desc">
            내가 사랑한 작은 공간이 누군가의 새로운 하루가 돼요.<br />
            당신만의 장소 이야기를 들려주세요.
          </p>
          <p className="auth-caption"><MapPin size={14} />{caption}</p>
        </div>
      </aside>

      <section className="auth-area">
        <Link to="/" className="auth-return">{returnLabel}<ArrowUpRight size={16} /></Link>
        <div className="auth-form-wrap">{children}</div>
        <p className="auth-copy">© 2026 placelog · 강하윤</p>
      </section>
    </div>
  );
}