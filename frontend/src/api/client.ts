const API_BASE = "http://localhost:8010";

export async function getApiKeyStatus(): Promise<{ set: boolean }> {
  const res = await fetch(`${API_BASE}/api/settings/api-key`);
  return res.json();
}

export async function setApiKey(apiKey: string): Promise<void> {
  const form = new FormData();
  form.append("api_key", apiKey);
  const res = await fetch(`${API_BASE}/api/settings/api-key`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
}

export interface CloneVoiceParams {
  text: string;
  temperature?: number;
  top_p?: number;
  speed?: number;
}

export async function cloneVoice(
  audio: Blob,
  params: CloneVoiceParams,
): Promise<Blob> {
  const form = new FormData();
  form.append("audio", audio, "reference.wav");
  form.append("text", params.text);
  form.append("temperature", String(params.temperature ?? 0.7));
  form.append("top_p", String(params.top_p ?? 0.7));
  form.append("speed", String(params.speed ?? 1.0));

  const res = await fetch(`${API_BASE}/api/clone`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.blob();
}
