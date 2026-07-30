import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../service/api";

function CreatorDashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const res = await api.get(`/projects/creator/${user.id}`);
        setProjects(res.data);
    };

    const totalProjects = projects.length;

    const totalRaised = projects.reduce(
        (sum, project) => sum + project.currentAmount,
        0
    );

    const activeProjects = projects.filter(
        project => project.currentAmount < project.goalAmount
    ).length;

    return (

        <div className="max-w-7xl mx-auto p-6">

            <h1 className="text-4xl font-bold">

                Creator Dashboard

            </h1>

            <p className="text-gray-500 mt-2">

                Welcome, {user.name} 👋

            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">

                <div className="bg-white shadow rounded-xl p-6">

                    <h2 className="text-gray-500">

                        Total Projects

                    </h2>

                    <p className="text-4xl font-bold mt-3">

                        {totalProjects}

                    </p>

                </div>

                <div className="bg-white shadow rounded-xl p-6">

                    <h2 className="text-gray-500">

                        Total Raised

                    </h2>

                    <p className="text-4xl font-bold mt-3 text-green-600">

                        ₹{totalRaised}

                    </p>

                </div>

                <div className="bg-white shadow rounded-xl p-6">

                    <h2 className="text-gray-500">

                        Active Projects

                    </h2>

                    <p className="text-4xl font-bold mt-3 text-blue-600">

                        {activeProjects}

                    </p>

                </div>

            </div>

            <div className="mt-10">

                <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold">

                        My Projects

                    </h2>

                    <Link
                        to="/create"
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                        + Create Project
                    </Link>

                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">

                    {
                        projects.map(project => {

                            const percentage = Math.min(
                                (project.currentAmount / project.goalAmount) * 100,
                                100
                            );

                            return (

                                <div
                                    key={project.id}
                                    className="bg-white rounded-xl shadow p-6"
                                >

                                    <h3 className="text-xl font-bold">

                                        {project.title}

                                    </h3>

                                    <p className="text-gray-500">

                                        {project.category}

                                    </p>

                                    <div className="mt-4">

                                        <p>

                                            Goal : ₹{project.goalAmount}

                                        </p>

                                        <p>

                                            Raised : ₹{project.currentAmount}

                                        </p>

                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">

                                        <div
                                            className="bg-green-500 h-3 rounded-full"
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />

                                    </div>

                                    <p className="mt-2">

                                        {percentage.toFixed(0)}% Funded

                                    </p>

                                    <div className="flex gap-3 mt-5">

                                        <Link
                                            to={`/project/${project.id}`}
                                        >
                                            <button className="bg-green-600 text-white px-4 py-2 rounded">
                                                View
                                            </button>
                                        </Link>

                                        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                                            Edit
                                        </button>

                                        <button className="bg-red-600 text-white px-4 py-2 rounded">
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            );

                        })
                    }

                </div>

            </div>

        </div>

    );

}

export default CreatorDashboard;