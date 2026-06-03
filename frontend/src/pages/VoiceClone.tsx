import { useRef, useState } from "react";
import { cloneVoice } from "../api/client";

export default function VoiceClone() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.7);
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFile = () => {
    const f = fileRef.current?.files?.[0];
    setFileName(f ? f.name : "");
  };

  const handleClone = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("请先选择音频文件");
      return;
    }
    if (!text.trim()) {
      setError("请输入要生成的文本");
      return;
    }
    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const blob = await cloneVoice(file, {
        text: text.trim(),
        temperature,
        top_p: topP,
        speed,
      });
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "请求失败");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFileName("");
    setText("");
    setTemperature(0.7);
    setTopP(0.7);
    setSpeed(1.0);
    setAudioUrl(null);
    setError("");
  };

  return (
    <div>
      <h1 className="page-title">语音克隆</h1>
      <p className="page-desc">
        上传参考音频，输入要生成的文本，即可获得克隆语音
      </p>

      <div className="card">
        <label>参考音频</label>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          onChange={handleFile}
        />
        {fileName && <div className="file-name">{fileName}</div>}
      </div>

      <div className="card">
        <label>生成文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入要让克隆音色朗读的文本..."
        />
      </div>

      <div className="card">
        <label>温度 (Temperature): {temperature.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1.5"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#86868b" }}>
          <span>精确 (0)</span>
          <span>创造 (1.5)</span>
        </div>
      </div>

      <div className="card">
        <label>Top-P: {topP.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#86868b" }}>
          <span>保守 (0)</span>
          <span>多样 (1)</span>
        </div>
      </div>

      <div className="card">
        <label>语速 (Speed): {speed.toFixed(2)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ position: "relative", fontSize: 12, color: "#86868b", height: 20 }}>
          <span style={{ position: "absolute", left: 0 }}>慢 (0.5x)</span>
          <span style={{ position: "absolute", left: "33%", transform: "translateX(-50%)" }}>正常 (1x)</span>
          <span style={{ position: "absolute", right: 0 }}>快 (2x)</span>
        </div>
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={handleClone}
          disabled={loading}
        >
          {loading ? "生成中..." : "生成克隆语音"}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          重置
        </button>
      </div>

      {error && <div className="status status-error">{error}</div>}

      {loading && <div className="status status-info">正在调用 FishAudio API 生成语音...</div>}

      {audioUrl && (
        <div className="card">
          <label>生成结果</label>
          <audio controls src={audioUrl} style={{ width: "100%" }} />
          <div className="btn-group">
            <a
              className="btn btn-primary"
              href={audioUrl}
              download="cloned_voice.mp3"
            >
              下载音频
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
