export function saveUser(token, user) {
  if (token) {
    localStorage.setItem("token", token);
  }

  if (user) {
    const data = typeof user === "string" ? JSON.parse(user) : { ...user };
    if (token && data.token !== token) {
      data.token = token;
    }
    localStorage.setItem("user", JSON.stringify(data));
  }
}

export function getUser() {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  const direct = localStorage.getItem("token");
  if (direct) return direct;

  const user = getUser();
  if (!user || typeof user === "string") return null;

  if (user.token) return user.token;
  if (user.accessToken) return user.accessToken;
  if (user.authToken) return user.authToken;
  if (user.jwt) return user.jwt;

  const search = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "string" && value.length > 20) return value;
      if (typeof value === "object") {
        const inner = search(value);
        if (inner) return inner;
      }
    }
    return null;
  };

  return search(user);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
