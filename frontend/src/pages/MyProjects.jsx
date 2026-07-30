import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, Calendar } from "lucide-react";
import api from "../service/api";

function MyProjects() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/projects/creator/${user.id}`);
            setProjects(res.data);
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project? This cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await api.delete(`/projects/${id}`);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("Failed to delete project. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const isEnded = (deadline) => deadline && new Date(deadline) < new Date();

    const formatDate = (deadline) => {
        if (!deadline) return "—";
        return new Date(deadline).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    return (

        <div className="max-w-6xl mx-auto p-4 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Projects</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {projects.length > 0 && `${projects.length} project${projects.length !== 1 ? "s" : ""} total`}
                    </p>
                </div>

                <Link
                    to="/create"
                    className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>

            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            <div className="h-2.5 bg-gray-200 rounded-full w-full mt-4" />
                            <div className="flex gap-3 mt-6">
                                <div className="h-9 bg-gray-200 rounded w-16" />
                                <div className="h-9 bg-gray-200 rounded w-16" />
                                <div className="h-9 bg-gray-200 rounded w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-10 text-center border border-gray-100">
                    <p className="text-4xl mb-3">🚀</p>
                    <h2 className="text-lg font-semibold text-gray-800">
                        You haven't created any projects yet.
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Start your first campaign and bring your idea to life.
                    </p>
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-1.5 mt-5 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Create Your First Project
                    </Link>
                </div>

            ) : (

                <div className="grid sm:grid-cols-2 gap-6">

                    {projects.map(project => {

                        const percentage = Math.min(
                            (project.currentAmount / project.goalAmount) * 100,
                            100
                        );
                        const ended = isEnded(project.deadline);

                        return (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow p-6 flex flex-col"
                            >

                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {project.title}
                                    </h2>
                                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        ended ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
                                    }`}>
                                        {ended ? "Ended" : "Active"}
                                    </span>
                                </div>

                                <p className="text-gray-500 text-sm mt-1">
                                    {project.category}
                                </p>

                                <div className="mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Raised <b className="text-gray-900">₹{project.currentAmount.toLocaleString()}</b>
                                        </span>
                                        <span className="text-gray-500">
                                            of ₹{project.goalAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <p className="text-xs text-green-600 font-medium mt-1.5">
                                        {percentage.toFixed(0)}% funded
                                    </p>
                                </div>

                                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-3">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Deadline: {formatDate(project.deadline)}
                                </p>

                                <div className="flex gap-2 mt-5 pt-5 border-t border-gray-100">

                                    <Link to={`/project/${project.id}`} className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                                            <Eye className="w-3.5 h-3.5" />
                                            View
                                        </button>
                                    </Link>

                                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition">
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        disabled={deletingId === project.id}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                                    >
                                        {deletingId === project.id ? (
                                            <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                        )}
                                        Delete
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>

    );

}

export default MyProjects;