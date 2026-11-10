import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check, CircleCheck, CircleAlert, ChevronRight } from "lucide-react";
import api from "../api";
import AuthLayout from "../components/AuthLayout";
import signupPhoto from "../assets/signup-bg.svg";

const ID_RULE = /^[a-zA-Z0-9]{4,20}$/;
const PW_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;

export default function Signup() {
  const [form, setForm] = useState({ loginId: "", password: "", passwordConfirm: "", name: "" });
  const [idStatus, setIdStatus] = useState(null); // null | ok | taken | invalid
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState({ terms: false, privacy: false });
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "loginId") setIdStatus(null); // 아이디 바꾸면 다시 확인
  };

  const checkId = async () => {
    if (!ID_RULE.test(form.loginId)) return setIdStatus("invalid");
    const res = await api.get("/users/check", { params: { loginId: form.loginId } });
    setIdStatus(res.data ? "ok" : "taken");
  };

  const pwValid = PW_RULE.test(form.password);
  const pwMatch = form.passwordConfirm && form.password === form.passwordConfirm;
  const nameValid = form.name.trim().length >= 2 && form.name.trim().length <= 10;
  const canSubmit = idStatus === "ok" && pwValid && pwMatch && nameValid && agree.terms && agree.privacy;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/signup", { loginId: form.loginId, password: form.password, name: form.name.trim() });
      alert("가입이 완료됐어요! 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      alert(typeof err.response?.data === "string" ? err.response.data : "회원가입에 실패했어요.");
    }
  };

  const idMessage = {
    ok: <p className="msg"><CircleCheck size={13} />사용할 수 있는 아이디예요. (영문·숫자 4~20자)</p>,
    taken: <p className="msg error"><CircleAlert size={13} />이미 사용 중인 아이디예요.</p>,
    invalid: <p className="msg error"><CircleAlert size={13} />영문·숫자 4~20자로 입력해주세요.</p>,
  }[idStatus] || <p className="help">영문·숫자 4~20자로 입력하고 중복 확인을 눌러주세요.</p>;

  return (
    <AuthLayout
      photo={signupPhoto}
      title={["가까운 곳에도,", "새로운 발견이 있어요."]}
      caption="이지우님의 기록 · 성수동, 서울숲"
      returnLabel="장소 둘러보기"
    >
      <form className="auth-form signup" onSubmit={onSubmit}>
        <div className="auth-welcome">
          <p className="auth-eyebrow">당신의 첫 번째 기록을 기다려요</p>
          <h1>나의 장소 기록, 시작해요</h1>
          <p>간단한 가입으로 좋아하는 장소를 모아보세요.</p>
        </div>

        <div className="fields">
          <div className="field">
            <label className="field-label">아이디<em>*</em></label>
            <div className="id-row">
              <div className="input">
                <input name="loginId" value={form.loginId} onChange={onChange} placeholder="아이디를 입력해주세요" />
              </div>
              <button type="button" className="btn-outline" onClick={checkId}>중복 확인</button>
            </div>
            {idMessage}
          </div>

          <div className="field">
            <label className="field-label">비밀번호<em>*</em></label>
            <div className="input">
              <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={onChange} placeholder="비밀번호를 입력해주세요" />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <Eye size={19} /> : <EyeOff size={19} />}</button>
            </div>
            <p className={`help ${form.password && !pwValid ? "error" : ""}`}>영문, 숫자를 포함해 8~20자로 입력해주세요.</p>
          </div>

          <div className="field">
            <label className="field-label">비밀번호 확인<em>*</em></label>
            <div className="input">
              <input name="passwordConfirm" type={showPw2 ? "text" : "password"} value={form.passwordConfirm} onChange={onChange} placeholder="비밀번호를 한 번 더 입력해주세요" />
              <button type="button" onClick={() => setShowPw2(!showPw2)}>{showPw2 ? <Eye size={19} /> : <EyeOff size={19} />}</button>
            </div>
            {form.passwordConfirm && (pwMatch
              ? <p className="msg"><CircleCheck size={13} />비밀번호가 일치해요.</p>
              : <p className="msg error"><CircleAlert size={13} />비밀번호가 일치하지 않아요.</p>)}
          </div>

          <div className="field">
            <label className="field-label">이름<em>*</em></label>
            <div className="input">
              <input name="name" value={form.name} onChange={onChange} placeholder="이름을 입력해주세요" />
            </div>
            <p className="help">장소 기록에 표시될 이름이에요. (2~10자)</p>
          </div>
        </div>

        <div className="agreements">
          {[["terms", "이용약관 동의"], ["privacy", "개인정보 수집 및 이용 동의"]].map(([key, label]) => (
            <label key={key} className="check agree">
              <input type="checkbox" checked={agree[key]} onChange={(e) => setAgree({ ...agree, [key]: e.target.checked })} />
              <span className="check-box"><Check size={13} strokeWidth={3} /></span>
              <span className="agree-text">{label} <em>(필수)</em></span>
              <ChevronRight size={16} />
            </label>
          ))}
        </div>

        <button className="btn-submit" disabled={!canSubmit}>가입하고 기록 시작하기</button>

        <div className="auth-switch plain">
          이미 계정이 있으신가요?
          <Link to="/login">로그인 →</Link>
        </div>
      </form>
    </AuthLayout>
  );
}