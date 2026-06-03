import { useEffect, useState } from "react";
import { getApiKeyStatus, setApiKey } from "../api/client";

export default function Settings() {
  const [apiKey, setApiKeyLocal] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getApiKeyStatus().then((res) => {
      if (res.set) setSaved(true);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("请输入 API Key");
      return;
    }
    setError("");
    try {
      await setApiKey(apiKey.trim());
      setSaved(true);
      setApiKeyLocal("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "保存失败");
    }
  };

  return (
    <div>
      <h1 className="page-title">设置</h1>
      <p className="page-desc">配置 FishAudio API 密钥</p>

      <div className="card">
        <label>FishAudio API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyLocal(e.target.value)}
          placeholder="输入你的 FishAudio API Key..."
        />
        <a
          className="link-btn"
          href="https://fish.audio/zh-CN/app/api-keys/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ↗ 前往 FishAudio 获取 API Key
        </a>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>

        {saved && <div className="status status-info">API Key 已配置</div>}
        {error && <div className="status status-error">{error}</div>}
      </div>
    </div>
  );
}
