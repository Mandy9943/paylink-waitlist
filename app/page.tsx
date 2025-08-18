"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"waitlist" | "manifesto">(
    "waitlist"
  );
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (loading) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Te rugăm să introduci un email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        const code = data?.error;
        if (code === "invalid_email") setError("Email invalid.");
        else if (code === "rate_limited")
          setError("Prea multe cereri. Încearcă în 1 minut.");
        else if (code === "resend_failed")
          setError("Eroare la trimiterea emailului. Încearcă din nou.");
        else setError("A apărut o eroare. Încearcă din nou.");
        return;
      }
      setShowConfirmation(true);
      setEmail("");
    } catch (_) {
      setError("Conexiune indisponibilă. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
        linear-gradient(45deg, #5c43c6, #a69ae3, #bfb5eb, #fafafe),
        linear-gradient(-45deg, #fafafe, #bfb5eb, #a69ae3, #5c43c6)
      `,
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      {/* Background decorative elements */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
      `}</style>

      <div
        className="absolute inset-0"
        style={{
          background: `
          radial-gradient(circle at 20% 20%, rgba(92, 67, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(166, 154, 227, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(191, 181, 235, 0.15) 0%, transparent 50%)
        `,
        }}
      />

      <div
        className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl opacity-30"
        style={{
          background: "rgba(250, 250, 254, 0.4)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-40 right-32 w-48 h-48 rounded-full blur-2xl opacity-20"
        style={{
          background: "rgba(92, 67, 198, 0.3)",
          animation: "float 12s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full blur-lg opacity-25"
        style={{
          background: "rgba(166, 154, 227, 0.4)",
          animation: "float 10s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Top right button */}
        <div className="absolute top-6 right-6"></div>

        {/* Tab toggle */}
        <div className="mb-8">
          <div className="bg-black/80 backdrop-blur-sm rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab("waitlist")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "waitlist"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Lista de așteptare
            </button>
            <button
              onClick={() => setActiveTab("manifesto")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "manifesto"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Manifesto
            </button>
          </div>
        </div>

        {/* Main content card */}
        <Card
          className={`w-full max-w-lg mx-auto p-8 border-0 shadow-2xl ${
            activeTab === "waitlist"
              ? "bg-white/95 backdrop-blur-sm"
              : "bg-gray-900/95 backdrop-blur-sm text-white"
          }`}
        >
          {activeTab === "waitlist" ? (
            <div className="text-center space-y-6">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="PayLinks Logo"
                  width={30}
                  height={30}
                />
                <span className="text-xl font-semibold text-gray-900">
                  PayLinks
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                  Acceptă Plăți Online Rapid
                </h1>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Fii printre primii care acceptă plăți online în 30 de secunde.
                Perfect pentru freelanceri, servicii locale, creatori și ONG
                uri.
              </p>

              {/* Email form */}
              <div className="flex flex-col space-y-2">
                {error && (
                  <div className="text-red-600 text-sm text-left">{error}</div>
                )}
                <div className="flex space-x-3">
                  <Input
                    type="email"
                    placeholder="Emailul tău"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    className="flex-1 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSubmit}
                    className="bg-black text-white hover:bg-gray-800 px-6 rounded-full"
                    disabled={loading}
                  >
                    {loading ? "Se trimite…" : "Înscrie-te acum"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Logo */}

              {/* Manifesto text */}
              <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                <h2 className="text-lg font-semibold text-white mb-4 text-center">
                  De ce există PayLinks.ro
                </h2>
                <p>
                  Trăim într-o perioadă în care schimbarea economică se
                  accelerează. Automatizarea, inteligența artificială și
                  transformările globale anunță o realitate dură: milioane de
                  locuri de muncă vor dispărea în următorii ani. România nu va
                  fi ocolită de acest val.
                </p>
                <p>
                  În curând, tot mai mulți oameni vor fi nevoiți să își găsească
                  singuri surse de venit. Și atunci, întrebarea devine simplă:
                  Cum putem să îi ajutăm să-și transforme rapid ideile,
                  talentele și cunoștințele în bani reali?
                </p>
                <p className="font-semibold text-white">
                  Răspunsul nostru este PayLinks.ro.
                </p>
                <p>
                  Am creat această platformă pentru a oferi oricui un mod de a
                  accepta plăți online în doar 30 de secunde, fără cunoștințe
                  tehnice, fără contracte, fără bariere.
                </p>
                <p>
                  În loc să aștepți să vină "soluțiile mari", în 30 de secunde
                  poți avea primul tău link de plată activ și gata să îți aducă
                  venituri.
                </p>
                <p>
                  PayLinks.ro există pentru a transforma fiecare român cu o idee
                  într-un antreprenor digital, pregătit pentru viitor.
                </p>
                <p className="font-semibold text-white italic">
                  Atunci când valul schimbării vine, nu există alegerea de a-l
                  opri. Alegerea reală este dacă te îneci… sau înveți să înoți
                  mai repede decât ceilalți.
                </p>
              </div>

              {/* Signature */}
              <div className="pt-6 space-y-2">
                <div className="text-2xl font-script text-white">
                  Andrei B.{" "}
                </div>
                <div className="text-sm text-gray-400">
                  Andrei Bucur{" "}
                  <span className="text-gray-500">Fondator @ PayLinks</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center w-full max-w-lg text-sm">
          <div className="flex items-center space-x-2 text-white/70">
            <span>Urmărește PayLinks pe</span>
            <a
              href="https://www.instagram.com/paylinksro?igsh=N3FzdGpwYWppMGl3"
              target="_blank"
              className="flex items-center space-x-1 underline hover:text-white"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.259.013-3.668.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="PayLinks Logo"
                  width={30}
                  height={30}
                />
                <span className="text-xl font-semibold text-gray-900">
                  PayLinks
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-900">
                Ești pe listă...
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Ți-am trimis un email de confirmare. Dacă nu îl vezi, verifică
                și folderul Spam sau Promotions.
              </p>

              {/* Instagram CTA */}
              <Button
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/paylinksro?igsh=N3FzdGpwYWppMGl3",
                    "_blank"
                  )
                }
                className="w-full bg-black text-white hover:bg-gray-800 rounded-full flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.259.013-3.668.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Urmărește PayLinks pe Instagram</span>
              </Button>

              {/* Close button */}
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Închide
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
