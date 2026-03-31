import React from "react";

const LoginForm = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ff8c42]/20 to-[#ff6b22]/20 p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back
                </h2>

                {/* Form */}
                <form className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="
                w-full px-4 py-2 rounded-lg border border-gray-300
                focus:outline-none
                focus:ring-2 focus:ring-[#ff8c42]
                focus:border-transparent
                transition-all
              "
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="
                w-full px-4 py-2 rounded-lg border border-gray-300
                focus:outline-none
                focus:ring-2 focus:ring-[#ff8c42]
                focus:border-transparent
                transition-all
              "
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <a
                            href="#"
                            className="text-sm text-[#ff6b22] hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="
              w-full py-2 rounded-lg font-medium text-white
              bg-gradient-to-r from-[#ff8c42] to-[#ff6b22]
              hover:opacity-90
              active:scale-95
              transition-all duration-200
            "
                    >
                        Login
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>


                </form>

                {/* Footer */}
                <p className="text-sm text-center text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <a href="#" className="text-[#ff6b22] font-medium hover:underline">
                        Register
                    </a>
                </p>

            </div>
        </div>
    );
};

export default LoginForm;