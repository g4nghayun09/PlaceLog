import { Link, NavLink } from "react-router-dom";
import { CircleUser, Plus } from "lucide-react";
import "../styles/Header.css";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

  return (
    <header className="header">
      <div className="header-inner container">
        <div className="header-left">
          <Link to="/" className="brand">placelog<span className="brand-dot" /></Link>
          <nav className="header-nav">
            <NavLink to="/" end>장소 둘러보기</NavLink>
            <NavLink to="/mypage">마이페이지</NavLink>
          </nav>
        </div>
        <div className="header-right">
          {user ? (
            <Link to="/mypage" className="account">
              <CircleUser size={26} strokeWidth={1.5} />
              <span>{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="account">로그인</Link>
          )}
          <Link to="/write" className="btn-primary">
            <Plus size={18} /> 장소 기록하기
          </Link>
        </div>
      </div>
    </header>
  );
}