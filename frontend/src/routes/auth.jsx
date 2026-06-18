import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { name } }
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    _jsx("main", { className: "min-h-screen pt-24 pb-16 px-4 flex items-center justify-center bg-hero", children:
      _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full max-w-md glass rounded-3xl p-8 shadow-card", children: [
        _jsx("h1", { className: "text-3xl font-bold text-center", children: mode === "signin" ? "Welcome back" : "Create account" }),
        _jsx("p", { className: "mt-2 text-sm text-center text-muted-foreground", children:
          mode === "signin" ? "Sign in to shop the future." : "Join NexStore. Inspect in 3D, own with one tap."
        }),

        _jsxs("form", { onSubmit: submit, className: "space-y-3 mt-6", children: [
          mode === "signup" &&
          _jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Full Name", className: "w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold" }),

          _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", className: "w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold" }),
          _jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password", className: "w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold" }),
          
          mode === "signup" &&
          _jsx("input", { type: "password", required: true, minLength: 6, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Confirm Password", className: "w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold" }),

          _jsx("button", { disabled: loading, className: "w-full bg-gradient-gold text-primary-foreground rounded-full py-3 font-medium shadow-glow disabled:opacity-50 mt-4", children:
            loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Register"
          })
        ] }),

        _jsxs("p", { className: "mt-6 text-sm text-center text-muted-foreground", children: [
          mode === "signin" ? "New to NexStore?" : "Already a member?", " ",
          _jsx("button", { onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "text-gold hover:underline", children:
            mode === "signin" ? "Create account" : "Sign in"
          })
        ] })
      ] })
    })
  );
}