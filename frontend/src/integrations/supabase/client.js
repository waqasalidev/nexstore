let authListeners = [];

const triggerAuthChange = (event, session) => {
  authListeners.forEach((cb) => cb(event, session));
};

export const supabase = {
  auth: {
    async getUser() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return { data: { user: null }, error: new Error("No token session found") };

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Invalid session token");
        const user = await res.json();
        return { data: { user }, error: null };
      } catch (err) {
        return { data: { user: null }, error: err };
      }
    },

    async getSession() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return { data: { session: null }, error: null };

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Invalid session token");
        const user = await res.json();
        return {
          data: {
            session: {
              access_token: token,
              user,
            },
          },
          error: null,
        };
      } catch (err) {
        return { data: { session: null }, error: err };
      }
    },

    async signInWithPassword({ email, password }) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to log in");
        }

        const user = await res.json();
        localStorage.setItem("token", user.token);
        const session = { access_token: user.token, user };
        triggerAuthChange("SIGNED_IN", session);
        return { data: { user, session }, error: null };
      } catch (err) {
        return { data: { user: null, session: null }, error: err };
      }
    },

    async signUp({ email, password, options }) {
      try {
        const name = options?.data?.name || "";
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to register account");
        }

        const user = await res.json();
        localStorage.setItem("token", user.token);
        const session = { access_token: user.token, user };
        triggerAuthChange("SIGNED_IN", session);
        return { data: { user, session }, error: null };
      } catch (err) {
        return { data: { user: null, session: null }, error: err };
      }
    },

    async signOut() {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout API failed", err);
      }
      localStorage.removeItem("token");
      triggerAuthChange("SIGNED_OUT", null);
      return { error: null };
    },

    onAuthStateChange(callback) {
      authListeners.push(callback);
      this.getSession().then(({ data }) => {
        callback(data?.session ? "SIGNED_IN" : "SIGNED_OUT", data?.session);
      });
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners = authListeners.filter((cb) => cb !== callback);
            },
          },
        },
      };
    },
  },

  from(table) {
    return {
      select(fields) {
        return {
          eq(f1, v1) {
            return {
              eq(f2, v2) {
                return {
                  async maybeSingle() {
                    if (table === "user_roles") {
                      const { data } = await supabase.auth.getUser();
                      if (data?.user?.role === "admin") {
                        return { data: { role: "admin" }, error: null };
                      }
                      return { data: null, error: null };
                    }
                    return { data: null, error: null };
                  },
                };
              },
            };
          },
        };
      },
    };
  },
};