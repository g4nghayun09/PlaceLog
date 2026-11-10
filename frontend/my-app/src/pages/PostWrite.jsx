import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, X, ImagePlus, Grip, Sprout, ChevronUp, ChevronDown, Globe, Check } from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/PostWrite.css";

const MAX_IMAGES = 10;
const MAX_SIZE = 10 * 1024 * 1024;

export default function PostWrite() {
  const { postId } = useParams();
  const isEdit = Boolean(postId);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [reorder, setReorder] = useState(false);
  const [showCoords, setShowCoords] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: "", categoryId: null, placeName: "", address: "", addressDetail: "",
    latitude: "", longitude: "", content: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("user") && !sessionStorage.getItem("user")) {
      alert("로그인이 필요해요.");
      navigate("/login");
      return;
    }
    api.get("/categories").then((res) => setCategories(res.data));
    if (isEdit) {
      api.get(`/posts/${postId}`).then(({ data }) => {
        setForm({
          title: data.title, categoryId: data.categoryId, placeName: data.placeName,
          address: data.address || "", addressDetail: "",
          latitude: data.latitude ?? "", longitude: data.longitude ?? "", content: data.content || "",
        });
        setImages(data.imageUrls || []);
      });
    }
  }, [postId]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // 사진 업로드
  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => ["image/jpeg", "image/png"].includes(f.type));
    if (files.length === 0) return alert("JPG, PNG 파일만 올릴 수 있어요.");
    if (files.some((f) => f.size > MAX_SIZE)) return alert("사진당 최대 10MB까지 올릴 수 있어요.");
    if (images.length + files.length > MAX_IMAGES) return alert(`사진은 최대 ${MAX_IMAGES}장까지 올릴 수 있어요.`);

    const data = new FormData();
    files.forEach((f) => data.append("files", f));
    setUploading(true);
    try {
      const res = await api.post("/images", data);
      setImages((prev) => [...prev, ...res.data]);
    } catch {
      alert("사진 업로드에 실패했어요.");
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => !uploading && fileRef.current.click();
  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));
  const makeCover = (idx) => {
    setImages([images[idx], ...images.filter((_, i) => i !== idx)]);
    setReorder(false);
  };

  const dropHandlers = {
    onDragOver: (e) => { e.preventDefault(); setDragOver(true); },
    onDragLeave: () => setDragOver(false),
    onDrop: (e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); },
  };

  // 주소 검색
  const searchAddress = () => {
    if (!window.daum?.Postcode) return alert("주소 검색을 불러오지 못했어요. 새로고침해주세요.");
    new window.daum.Postcode({
      oncomplete: (data) => setForm((f) => ({ ...f, address: data.roadAddress || data.jibunAddress })),
    }).open();
  };

  const canSubmit =
    images.length > 0 && form.title.trim() && form.categoryId &&
    form.placeName.trim() && form.address && form.content.trim();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const body = {
      categoryId: form.categoryId,
      title: form.title.trim(),
      content: form.content.trim(),
      placeName: form.placeName.trim(),
      address: [form.address, form.addressDetail.trim()].filter(Boolean).join(" "),
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      imageUrls: images,
    };
    try {
      if (isEdit) {
        await api.put(`/posts/${postId}`, body);
        navigate(`/posts/${postId}`);
      } else {
        const res = await api.post("/posts", body);
        navigate(`/posts/${res.data.postId}`);
      }
    } catch (err) {
      alert(typeof err.response?.data === "string" ? err.response.data : "저장에 실패했어요.");
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <form className="write" onSubmit={onSubmit}>
          <div className="write-intro">
            <Link to="/" className="back-link"><ArrowLeft size={16} />둘러보기로 돌아가기</Link>
            <h1>{isEdit ? "장소 기록을 수정해요" : "나만의 장소를 기록해요"}</h1>
            <div className="write-intro-row">
              <p>사진과 이야기로 오늘의 장소를 남겨보세요.</p>
              <span className="required-guide">* 필수 입력</span>
            </div>
          </div>

          <div className="write-form">
            {/* 왼쪽: 사진 */}
            <section className="photo-col">
              <div className="photo-heading">
                <h3>장소 사진 <em>*</em></h3>
                <span>{images.length} / {MAX_IMAGES}</span>
              </div>

              {images.length === 0 ? (
                <button type="button" className={`add-photo big ${dragOver ? "drag" : ""}`} onClick={openPicker} {...dropHandlers}>
                  <ImagePlus size={28} />{uploading ? "올리는 중..." : "사진 추가"}
                </button>
              ) : (
                <>
                  <div className="photo photo-cover">
                    <img src={images[0]} alt="대표 사진" />
                    <span className="cover-badge">대표 사진</span>
                    <button type="button" className="remove-btn" onClick={() => removeImage(0)}><X size={15} /></button>
                  </div>
                  <div className="photo-grid">
                    {images.slice(1).map((url, i) => (
                      <div key={url} className={`photo photo-thumb ${reorder ? "selectable" : ""}`} onClick={() => reorder && makeCover(i + 1)}>
                        <img src={url} alt="" />
                        {!reorder && (
                          <button type="button" className="remove-btn" onClick={() => removeImage(i + 1)}><X size={13} /></button>
                        )}
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && !reorder && (
                      <button type="button" className={`add-photo ${dragOver ? "drag" : ""}`} onClick={openPicker} {...dropHandlers}>
                        <ImagePlus size={24} />{uploading ? "올리는 중..." : "사진 추가"}
                      </button>
                    )}
                  </div>
                </>
              )}

              <input ref={fileRef} type="file" accept="image/jpeg,image/png" multiple hidden
                onChange={(e) => { uploadFiles(e.target.files); e.target.value = ""; }} />

              <p className="upload-guide">
                사진을 끌어 놓거나 눌러서 올려주세요.<br />
                JPG, PNG · 사진당 최대 10MB · 최대 10장<br />
                첫 번째 사진이 대표 사진으로 보여요.
              </p>

              <button type="button" className={`reorder-btn ${reorder ? "active" : ""}`} disabled={images.length < 2} onClick={() => setReorder(!reorder)}>
                <Grip size={16} />{reorder ? "대표로 할 사진을 눌러주세요" : "사진 순서 바꾸기"}
              </button>

              <div className="journal-prompt">
                <Sprout size={24} />
                <strong>작은 발견도 좋은 기록이 돼요.</strong>
                <p>마음에 든 자리, 기억나는 한 입,<br />다시 걷고 싶은 길. 나만의 시선을 들려주세요.</p>
              </div>
            </section>

            {/* 오른쪽: 입력 */}
            <section className="fields-col">
              <div className="field">
                <label className="field-label">기록 제목<em>*</em></label>
                <div className="input">
                  <input value={form.title} onChange={set("title")} maxLength={50} placeholder="예: 햇살이 오래 머무는 창가" />
                </div>
                <p className="help">장소의 분위기나 나만의 순간을 한 문장으로 표현해보세요. (최대 50자)</p>
              </div>

              <div className="field">
                <label className="field-label">카테고리<em>*</em></label>
                <div className="chip-row">
                  {categories.map((c) => (
                    <button type="button" key={c.categoryId}
                      className={`chip ${form.categoryId === c.categoryId ? "active" : ""}`}
                      onClick={() => setForm({ ...form, categoryId: c.categoryId })}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field-label">장소 이름<em>*</em></label>
                <div className="input">
                  <input value={form.placeName} onChange={set("placeName")} maxLength={100} placeholder="예: 느린 오후" />
                </div>
              </div>

              <div className="field">
                <label className="field-label">주소<em>*</em></label>
                <div className="address-row">
                  <div className="input readonly" onClick={searchAddress}>
                    <input value={form.address} readOnly placeholder="주소 찾기를 눌러주세요" />
                  </div>
                  <button type="button" className="btn-outline" onClick={searchAddress}>주소 찾기</button>
                </div>
                <div className="input">
                  <input value={form.addressDetail} onChange={set("addressDetail")} placeholder="상세 주소 (선택)" />
                </div>
              </div>

              <div className="coords">
                <button type="button" className="coords-toggle" onClick={() => setShowCoords(!showCoords)}>
                  <span>위치 좌표<small>선택</small></span>
                  {showCoords ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showCoords && (
                  <>
                    <div className="coords-row">
                      <div className="field">
                        <label className="field-label">위도<small>선택</small></label>
                        <div className="input"><input type="number" step="any" value={form.latitude} onChange={set("latitude")} placeholder="예: 37.5788" /></div>
                      </div>
                      <div className="field">
                        <label className="field-label">경도<small>선택</small></label>
                        <div className="input"><input type="number" step="any" value={form.longitude} onChange={set("longitude")} placeholder="예: 126.9731" /></div>
                      </div>
                    </div>
                    <p className="coords-help">좌표를 몰라도 괜찮아요. 주소만으로 기록을 남길 수 있어요.</p>
                  </>
                )}
              </div>

              <div className="field">
                <label className="field-label">방문 이야기<em>*</em></label>
                <textarea className="story" value={form.content} onChange={set("content")} maxLength={2000} placeholder="그곳에서 어떤 시간을 보냈는지 들려주세요." />
                <div className="story-guide">
                  <span>직접 경험한 이야기를 자유롭게 남겨주세요.</span>
                  <span>{form.content.length.toLocaleString()} / 2,000</span>
                </div>
              </div>
            </section>
          </div>

          <div className="write-actions">
            <p className="visibility"><Globe size={16} />등록한 기록은 모든 사람에게 공개돼요.</p>
            <div className="action-btns">
              <button type="button" className="btn-outline" onClick={() => navigate(-1)}>취소</button>
              <button className="btn-save" disabled={!canSubmit || uploading}>
                <Check size={18} />{isEdit ? "수정 저장하기" : "기록 저장하기"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}