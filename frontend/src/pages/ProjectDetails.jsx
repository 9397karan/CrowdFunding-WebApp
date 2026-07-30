import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Users, ArrowLeft, TrendingUp } from "lucide-react";
import api from "../service/api";
import ProjectCard from "../component/ProjectCard";

function ProjectDetails() {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        setLoading(true);
        Promise.all([loadProject(), loadContributions(), loadProjects()])
            .finally(() => setLoading(false));
    }, [id]);

    const loadProject = async () => {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
    };

    const loadContributions = async () => {
        const res = await api.get(`/contributions/project/${id}`);
        setContributions(res.data);
    };

    const loadProjects = async () => {
        const res = await api.get("/projects");
        setProjects(res.data.filter(p => p.id != id).slice(0, 3));
    };

    const contribute = async () => {
        setError("");

        if (!user) {
            setError("Please login to contribute.");
            return;
        }

        if (user.role === "CREATOR") {
            setError("Creators cannot contribute.");
            return;
        }

        if (!amount || amount <= 0) {
            setError("Enter a valid amount.");
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/contributions", {
                amount,
                project: { id },
                user: { id: user.id }
            });

            setAmount("");
            await Promise.all([loadProject(), loadContributions()]);

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const daysLeft = (deadline) => {
        if (!deadline) return null;
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const formatDate = (deadline) => {
        if (!deadline) return "—";
        return new Date(deadline).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen animate-pulse">
                <div className="w-full h-72 sm:h-96 bg-gray-200" />
                <div className="max-w-6xl mx-auto p-6 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-32 bg-gray-200 rounded mt-6" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Project not found</h2>
                    <Link to="/" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
                        ← Back to all projects
                    </Link>
                </div>
            </div>
        );
    }

    const percentage = Math.min(
        (project.currentAmount / project.goalAmount) * 100,
        100
    );

    const remaining = daysLeft(project.deadline);
const imageUrl = `https://picsum.photos/seed/${project.category}-${project.id}/600/400`;
    return (

        <div className="bg-gray-50 min-h-screen">

            <div className="relative">
                <img
    src={imageUrl}
    alt={project.title}
    className="w-full h-52 object-cover rounded-t-xl"
/>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Link
                    to="/"
                    className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
            </div>

            <div className="max-w-6xl mx-auto p-4 sm:p-6">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">

                        <div>
                            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 mb-3">
                                {project.category}
                            </span>
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                                {project.title}
                            </h1>
                            <p className="text-gray-500 mt-2 text-sm">
                                Created by <span className="font-semibold text-gray-700">{project.creator?.name}</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900">About this project</h2>
                            <p className="mt-3 text-gray-600 leading-7 whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-400" />
                                Recent Contributions
                            </h2>

                            {contributions.length === 0 ? (
                                <p className="mt-4 text-sm text-gray-500">Be the first to support this project.</p>
                            ) : (
                                <div className="mt-4 divide-y divide-gray-100">
                                    {contributions.map(c => (
                                        <div key={c.id} className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                    {c.user?.name?.slice(0, 2).toUpperCase()}
                                                </span>
                                                <span className="text-sm font-medium text-gray-700">{c.user?.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{Number(c.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6 lg:sticky lg:top-6 space-y-5">

                            <div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{project.currentAmount.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        of ₹{project.goalAmount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-2 text-sm">
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        {percentage.toFixed(0)}% Funded
                                    </span>
                                    {remaining !== null && (
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {remaining > 0 ? `${remaining} days left` : "Ended"}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                    Deadline: {formatDate(project.deadline)}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-5">
                                <h3 className="font-semibold text-gray-900 mb-3">Support this project</h3>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">
                                        {error}
                                    </div>
                                )}

                                {!user ? (
                                    <>
                                        <p className="text-sm text-gray-500 mb-3">Please login to contribute.</p>
                                        <Link to="/login">
                                            <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                                                Login
                                            </button>
                                        </Link>
                                    </>
                                ) : user.role === "CREATOR" ? (
                                    <p className="text-sm text-gray-500">Creators cannot contribute.</p>
                                ) : (
                                    <>
                                        <div className="relative mb-3">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Enter amount"
                                                min="1"
                                                className="border border-gray-200 w-full pl-7 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={contribute}
                                            disabled={submitting}
                                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Contribute"
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>

                </div>

                {/* Related projects */}
                {projects.length > 0 && (
                    <div className="mt-14">
                        <h2 className="text-xl font-bold text-gray-900 mb-5">More projects to explore</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(p => (
                                <ProjectCard key={p.id} project={p} />
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>

    );

}

export default ProjectDetails;