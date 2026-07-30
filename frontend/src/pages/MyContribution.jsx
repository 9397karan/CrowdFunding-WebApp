import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../service/api";

function MyContributions() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [contributions, setContributions] = useState([]);

    useEffect(() => {

        loadContributions();

    }, []);

    const loadContributions = async () => {

        const res = await api.get(
            `/contributions/user/${user.id}`
        );

        setContributions(res.data);

    };

    return (

        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">

                My Contributions

            </h1>

            {

                contributions.length === 0 ?

                (

                    <div className="bg-white rounded-xl shadow p-8">

                        No Contributions Yet

                    </div>

                )

                :

                (

                    <div className="space-y-5">

                        {

                            contributions.map(c => (

                                <div
                                    key={c.id}
                                    className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
                                >

                                    <div>

                                        <h2 className="text-2xl font-semibold">

                                            {c.project.title}

                                        </h2>

                                        <p>

                                            {c.project.category}

                                        </p>

                                        <p className="mt-2">

                                            Contributed

                                            <span className="font-bold text-green-600">

                                                {" "}₹{c.amount}

                                            </span>

                                        </p>

                                    </div>

                                    <Link
                                        to={`/project/${c.project.id}`}
                                    >

                                        <button
                                            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                                        >

                                            View Project

                                        </button>

                                    </Link>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default MyContributions;