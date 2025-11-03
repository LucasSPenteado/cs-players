import { AxiosError } from "axios";
import axiosInstance from "../services/axios";
import { useEffect, useState, type FormEvent } from "react";
import { useCookies } from "react-cookie";
import { CircleAlert } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(["refreshToken", "accessToken"]);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    try {
      const res = await axiosInstance.post("/login", {
        email: userData.email,
        password: userData.password,
      });
      if (res.status === 200) {
        setCookie("refreshToken", res.data.refreshToken);
        setCookie("accessToken", res.data.accessToken);
      }
    } catch (error) {
      setError(
        error instanceof AxiosError
          ? error.response?.data.message
          : "An error has occurred",
      );
      setShowError(true);
    }
  };

  useEffect(() => {
    if (!showError) return;
    const timer = setTimeout(() => {
      setShowError(false);
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [showError]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-gray-200">
      {showError && (
        <div className="mb-8 flex w-full max-w-sm gap-2 rounded-2xl bg-zinc-900 p-4">
          <CircleAlert className="text-red-400" />
          <p>{error}</p>
        </div>
      )}
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-8 shadow-lg">
        <h2 className="mb-1 text-xl font-semibold">Login to your account</h2>
        <p className="mb-6 text-sm text-gray-400">
          Enter your email below to login to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <a
                href="#"
                className="text-sm text-gray-400 transition hover:text-gray-300"
              >
                Forgot your password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gray-100 py-2 font-medium text-gray-900 transition hover:bg-gray-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="#" className="text-gray-200 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
