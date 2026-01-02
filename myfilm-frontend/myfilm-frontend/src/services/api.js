const API_URL = "http://localhost:5000/api"; // backend url-in

async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    credentials: "include", // 🍪 cookie / token üçün
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  auth: {
    login: (body) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    register: (body) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    logout: () =>
      request("/auth/logout", {
        method: "POST",
      }),

    check: () => request("/auth/check"),
  },

  films: {
    search: (q) => request(`/films/search?q=${encodeURIComponent(q)}`),

    add: (body) =>
      request("/films/addfilm", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    myFilms: () => request("/films/myfilms"), // ✅ Dashboard üçün
  },
};
