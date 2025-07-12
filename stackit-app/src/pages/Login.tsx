import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../assets/login bg.jpeg";
import loginHand from "../assets/login hand.jpeg";
import { Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-black bg-opacity-80 rounded-2xl border border-gray-300 p-0 w-full max-w-2xl min-h-[650px] flex flex-col items-center shadow-2xl"
        style={{ overflow: "hidden" }}
      >
        <img src={loginHand} alt="Login" className="w-full h-64 object-cover" style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }} />
        <div className="w-full flex flex-col gap-10 px-16 py-12">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700">
              <Lock size={28} />
            </span>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-14 rounded-full px-7 py-5 bg-[#fff7e0] text-black placeholder-gray-500 focus:outline-none w-full text-lg"
              required
            />
          </div>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700">
              <Lock size={28} />
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-14 rounded-full px-7 py-5 bg-[#fff7e0] text-black placeholder-gray-500 focus:outline-none w-full text-lg"
              required
            />
          </div>
          {error && <div className="text-red-500 text-base text-center">{error}</div>}
          <div className="flex gap-8 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full border border-gray-400 px-12 py-4 text-lg text-white hover:bg-[#222] transition-all w-1/2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <Link
              to="/signup"
              className="rounded-full border border-gray-400 px-12 py-4 text-lg text-white hover:bg-[#222] transition-all w-1/2 text-center flex items-center justify-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
} 