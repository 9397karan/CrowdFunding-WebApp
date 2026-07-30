import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import api from "../service/api";
import ProjectCard from "../component/ProjectCard";

const CATEGORIES = ["All", "Technology", "Medical", "Education", "Environment", "Business"];

function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("latest");

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = useMemo(() => {
        let data = [...projects];

        if (search.trim() !== "") {
            data = data.filter(project =>
                project.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            data = data.filter(project => project.category === category);
        }

        if (sortBy === "goal") {
            data.sort((a, b) => b.goalAmount - a.goalAmount);
        } else if (sortBy === "funded") {
            data.sort((a, b) => b.currentAmount - a.currentAmount);
        } else {
            data.sort((a, b) => b.id - a.id);
        }

        return data;
    }, [projects, search, category, sortBy]);

    const hasActiveFilters = search.trim() !== "" || category !== "All" || sortBy !== "latest";

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setSortBy("latest");
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                    Discover Amazing Projects
                </h1>
                <p className="mt-2 text-gray-500 text-lg">
                    Support ideas that matter, from creators around the world.
                </p>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 sticky top-4 z-10">
                <div className="grid md:grid-cols-3 gap-4">

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="latest">Latest</option>
                        <option value="goal">Highest Goal</option>
                        <option value="funded">Most Funded</option>
                    </select>

                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear filters
                    </button>
                )}
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 mb-6 text-gray-600">
                <SlidersHorizontal className="w-4 h-4" />
                <p className="text-sm">
                    <span className="font-semibold text-gray-900">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? "s" : ""} found
                </p>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="grid md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                            <div className="h-40 bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-2 bg-gray-200 rounded-full w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <h3 className="text-lg font-semibold text-gray-800">No projects found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Project grid */}
            {!loading && filteredProjects.length > 0 && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <div key={project.id} className="transition-transform hover:-translate-y-1 duration-200">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Home;