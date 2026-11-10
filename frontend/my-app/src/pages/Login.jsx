import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import api from "../api";
import AuthLayout from "../components/AuthLayout";
import loginPhoto from "../assets/login-bg.svg";

const errorText = (err, fallback) =>
  typeof err.response?.data === "string" ? err.response.data : fallback;

export default function Login() {
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/users/login", form);
      (keep ? localStorage : sessionStorage).setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(errorText(err, "아이디와 비밀번호를 확인해주세요."));
    }
  };

  return (
    <AuthLayout
      photo={loginPhoto}
      title={["좋았던 순간은,", "좋아하는 장소에 남아요."]}
      caption="강하윤님의 기록 · 서촌, 느린 오후"
      returnLabel="로그인 없이 둘러보기"
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="auth-welcome">
          <p className="auth-eyebrow">나의 장소 기록장</p>
          <h1>다시 만나 반가워요</h1>
          <p>로그인하고 나만의 장소를 이어서 기록해보세요.</p>
        </div>

        <div className="fields">
          <div className="field">
            <label className="field-label">아이디<em>*</em></label>
            <div className="input">
              <input name="loginId" value={form.loginId} onChange={onChange} placeholder="아이디를 입력해주세요" />
            </div>
          </div>

          <div className="field">
            <label className="field-label">비밀번호<em>*</em></label>
            <div className="input">
              <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={onChange} placeholder="비밀번호를 입력해주세요" />
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <Eye size={19} /> : <EyeOff size={19} />}
              </button>
            </div>
          </div>

          <label className="check">
            <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />
            <span className="check-box"><Check size={13} strokeWidth={3} /></span>
            로그인 상태 유지
          </label>

          {error && <p className="msg error">{error}</p>}

          <button className="btn-submit" disabled={!form.loginId || !form.password}>로그인</button>
        </div>

        <div className="auth-switch">
          아직 계정이 없으신가요?
          <Link to="/signup">회원가입 →</Link>
        </div>
      </form>
    </AuthLayout>
  );
}