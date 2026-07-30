import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FolderPlus, IndianRupee, Calendar, FileText } from "lucide-react";
import api from "../service/api";

const CATEGORIES = ["Technology", "Medical", "Education", "Environment", "Business"];
const DESCRIPTION_LIMIT = 1000;

function CreateProject() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [project, setProject] = useState({
        title: "",
        category: "",
        description: "",
        goalAmount: "",
        deadline: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const todayStr = new Date().toISOString().split("T")[0];

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Please login first</h2>
                    <p className="text-gray-500 text-sm mt-1">You need an account to create a project.</p>
                    <Link to="/login" className="inline-block mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (user.role !== "CREATOR") {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Creators only</h2>
                    <p className="text-gray-500 text-sm mt-1">Only creator accounts can start a project.</p>
                    <Link to="/" className="inline-block mt-4 text-indigo-600 text-sm font-medium hover:underline">
                        ← Back to home
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setError("");
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    };

    const createProject = async (e) => {
        e.preventDefault();
        setError("");

        if (Number(project.goalAmount) <= 0) {
            setError("Goal amount must be greater than 0.");
            return;
        }

        if (project.deadline < todayStr) {
            setError("Deadline cannot be in the past.");
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/projects", {
                ...project,
                creator: { id: user.id }
            });

            navigate("/");

        } catch (err) {
            setError("Failed to create project. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="max-w-3xl mx-auto my-10 px-4">

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FolderPlus className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Project</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Share your idea with backers around the world.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={createProject} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Project Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Solar-Powered Water Purifier"
                            className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            value={project.title}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category
                        </label>
                        <select
                            name="category"
                            className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
                            value={project.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                                Description
                            </label>
                            <span className={`text-xs ${project.description.length > DESCRIPTION_LIMIT ? "text-red-500" : "text-gray-400"}`}>
                                {project.description.length}/{DESCRIPTION_LIMIT}
                            </span>
                        </div>
                        <textarea
                            name="description"
                            rows="6"
                            placeholder="Tell backers what you're building, why it matters, and how the funds will be used..."
                            className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                            value={project.description}
                            onChange={handleChange}
                            maxLength={DESCRIPTION_LIMIT}
                            required
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Goal Amount
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="goalAmount"
                                    placeholder="50000"
                                    min="1"
                                    className="w-full border border-gray-200 pl-9 pr-3 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    value={project.goalAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Deadline
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="date"
                                    name="deadline"
                                    min={todayStr}
                                    className="w-full border border-gray-200 pl-9 pr-3 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    value={project.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Project"
                        )}
                    </button>

                </form>

            </div>

        </div>

    );

}

export default CreateProject;