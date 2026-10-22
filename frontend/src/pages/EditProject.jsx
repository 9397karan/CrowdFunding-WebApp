
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../service/api.js'

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        title: "",
        description: "",
        category: "",
        goalAmount: "",
        deadline: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    useEffect(() => {
        if (!user || user.role !== "CREATOR") {
            navigate("/login");
            return;
        }

        const loadProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);
                const data = response.data;

                if (String(data.creator?.id) !== String(user.id)) {
                    setError("You cannot edit this project.");
                    return;
                }

                setProject({
                    title: data.title || "",
                    description: data.description || "",
                    category: data.category || "",
                    goalAmount: data.goalAmount ?? "",
                    deadline: data.deadline || ""
                });
            } catch (err) {
                setError("Unable to load project. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id, navigate]);

    const handleChange = (e) => {
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (Number(project.goalAmount) <= 0) {
            setError("Goal amount must be greater than zero.");
            return;
        }

        setSaving(true);

        try {
            await api.put(`/projects/${id}`, {
                ...project,
                goalAmount: Number(project.goalAmount)
            });

            alert("Project updated successfully!");
            navigate("/creator-dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update project. Check your backend API."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading project...</p>;
    }

    if (error && !project.title) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => navigate("/creator-dashboard")}
                    className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 my-8">
            <div className="bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-3xl font-bold mb-2">
                    Edit Project
                </h1>

                <p className="text-gray-500 mb-8">
                    Update your crowdfunding campaign details.
                </p>

                {error && (
                    <p className="text-red-600 mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 font-medium">
                            Project Title
                        </label>
                        <input
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Category
                        </label>
                        <select
                            name="category"
                            value={project.category}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Medical">Medical</option>
                            <option value="Education">Education</option>
                            <option value="Environment">Environment</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            rows="6"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Goal Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="goalAmount"
                            value={project.goalAmount}
                            onChange={handleChange}
                            min="1"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={project.deadline}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/creator-dashboard")}
                            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProject;
