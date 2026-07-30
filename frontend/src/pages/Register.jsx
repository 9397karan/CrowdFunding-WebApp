import { useState } from "react";
import api from "../service/api";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Lightbulb, Heart } from "lucide-react";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const selectRole = (role) => {
        setError("");
        setUser({ ...user, role });
    };

    const register = async (e) => {
        e.preventDefault();
        setError("");

        if (user.role === "") {
            setError("Please select a role.");
            return;
        }

        if (user.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            await api.post("/users/register", user);
            navigate("/login");
        } catch (err) {
            setError("Registration failed. This email may already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                        <p className="text-gray-500 text-sm mt-1">Join CrowdFund and start supporting ideas</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={register} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Jane Doe"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="At least 6 characters"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                I want to join as
                            </label>
                            <div className="grid grid-cols-2 gap-3">

                                <button
                                    type="button"
                                    onClick={() => selectRole("CREATOR")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                                        user.role === "CREATOR"
                                            ? "border-indigo-600 bg-indigo-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <Lightbulb className={`w-5 h-5 ${user.role === "CREATOR" ? "text-indigo-600" : "text-gray-400"}`} />
                                    <div className="text-center">
                                        <p className={`text-sm font-semibold ${user.role === "CREATOR" ? "text-indigo-700" : "text-gray-700"}`}>
                                            Creator
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Launch a project</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => selectRole("BACKER")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                                        user.role === "BACKER"
                                            ? "border-indigo-600 bg-indigo-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${user.role === "BACKER" ? "text-indigo-600" : "text-gray-400"}`} />
                                    <div className="text-center">
                                        <p className={`text-sm font-semibold ${user.role === "BACKER" ? "text-indigo-700" : "text-gray-700"}`}>
                                            Backer
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Support projects</p>
                                    </div>
                                </button>

                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 !mt-6"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
                            Login
                        </Link>
                    </p>

                </div>

            </div>

        </div>

    );
}

export default Register;