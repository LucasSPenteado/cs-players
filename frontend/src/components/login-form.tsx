const LoginForm = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-gray-200">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-8 shadow-lg">
        <h2 className="mb-1 text-xl font-semibold">Login to your account</h2>
        <p className="mb-6 text-sm text-gray-400">
          Enter your email below to login to your account
        </p>

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
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
