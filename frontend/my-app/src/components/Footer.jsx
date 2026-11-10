import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-note">
          <span className="brand brand-sm">placelog<span className="brand-dot" /></span>
          <p>좋아하는 장소를, 오래 기억하도록.</p>
        </div>
        <p>© 2026 placelog · 강하윤</p>
      </div>
    </footer>
  );
}