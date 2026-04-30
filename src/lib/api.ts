const API = "https://college-platform-938p.onrender.com";

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  try {
    const data = JSON.parse(text);
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { message: "Invalid server response" } };
  }
}