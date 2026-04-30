const API = "https://college-platform-938p.onrender.com";

export async function apiPost(endpoint: string, body: any) {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let data;

    try {
      data = await res.json();
    } catch {
      data = { message: "Invalid JSON response (server error)" };
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  } catch (err) {
    console.error("API ERROR:", err);

    return {
      ok: false,
      status: 500,
      data: { message: "Network error" },
    };
  }
}