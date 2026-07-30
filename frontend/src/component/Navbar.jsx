import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const linkClasses = (path) =>
        `relative px-1 py-2 text-sm font-medium transition-colors ${isActive(path)
            ? "text-white"
            : "text-indigo-100 hover:text-white"
        }`;

    const initials = user?.name
        ?.split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const NavLinks = ({ onClick }) => (
        <>
            <Link to="/" onClick={onClick} className={linkClasses("/")}>
                Home
                {isActive("/") && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
            </Link>

            {user && user.role === "CREATOR" && (
                <>
                <Link to="/creator-dashboard" onClick={onClick} className={linkClasses("/creator-dashboard")}>
                        Dashboard{isActive("/creator-dashboard") && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                        )}</Link>
                    <Link to="/create" onClick={onClick} className={linkClasses("/create")}>
                        Create Project
                        {isActive("/create") && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                        )}
                    </Link>
                    
            <Link to="/my-projects" onClick={onClick} className={linkClasses("/my-projects")}>
                My Projects
                {isActive("/my-projects") && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
            </Link>
        </>
    )
}

{
    user && user.role === "BACKER" && (
        <Link to="/my-contributions" onClick={onClick} className={linkClasses("/my-contributions")}>
            My Contributions
            {isActive("/my-contributions") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
        </Link>
    )
}
        </>
    );

return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-20">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
                        💰
                    </span>
                    CrowdFund
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLinks />
                </div>

                {/* Desktop right side */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full pl-2 pr-3 py-1.5 transition"
                            >
                                <span className="w-7 h-7 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center">
                                    {initials}
                                </span>
                                <span className="text-sm font-medium">{user.name}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.role}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-indigo-100 hover:text-white transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

            </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
            <div className="md:hidden bg-indigo-700 border-t border-white/10 px-4 py-4 space-y-1">
                <div className="flex flex-col gap-1">
                    <NavLinks onClick={() => setMobileOpen(false)} />
                </div>

                <div className="pt-3 mt-3 border-t border-white/10">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 px-1 py-2">
                                <span className="w-8 h-8 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center">
                                    {initials}
                                </span>
                                <span className="text-sm font-medium">Hi, {user.name}</span>
                            </div>
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-2 mt-1 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="text-center py-2 text-sm font-medium text-indigo-100 hover:text-white transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                                className="text-center text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        )}
    </nav>
);
}

export default Navbar;