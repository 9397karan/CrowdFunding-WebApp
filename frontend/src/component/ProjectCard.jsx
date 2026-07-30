import { Link } from "react-router-dom";

function ProjectCard({ project }) {

    const percentage = Math.min(
        (project.currentAmount / project.goalAmount) * 100,
        100
    );

    const categoryColors = {
        Technology: "bg-blue-100 text-blue-700",
        Medical: "bg-red-100 text-red-700",
        Education: "bg-purple-100 text-purple-700",
        Environment: "bg-green-100 text-green-700",
        Business: "bg-amber-100 text-amber-700",
    };

    const badgeClass = categoryColors[project.category] || "bg-gray-100 text-gray-700";
    const imageUrl = `https://picsum.photos/seed/${project.category}-${project.id}/600/400`;
    return (

        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-transform hover:shadow-xl">
<img
    src={imageUrl}
    alt={project.title}
    className="w-full h-52 object-cover rounded-t-xl"
/>

            <div className="p-4 sm:p-5 flex flex-col flex-1">

                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${badgeClass}`}>
                    {project.category}
                </span>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                    {project.title}
                </h2>

                <p className="text-gray-500 text-sm mt-1.5 line-clamp-2 flex-1">
                    {project.description}
                </p>

                <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                            Raised <b className="text-gray-900">₹{project.currentAmount.toLocaleString()}</b>
                        </span>
                        <span className="text-gray-500">
                            of ₹{project.goalAmount.toLocaleString()}
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>

                    <p className="text-xs font-medium text-green-600">
                        {percentage.toFixed(0)}% Funded
                    </p>
                </div>

                <Link to={`/project/${project.id}`} className="mt-4">
                    <button className="w-full bg-blue-600 text-white text-sm sm:text-base py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        View Details
                    </button>
                </Link>

            </div>

        </div>

    );

}

export default ProjectCard;