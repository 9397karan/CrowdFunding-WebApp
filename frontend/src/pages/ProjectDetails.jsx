
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Users, ArrowLeft, TrendingUp } from "lucide-react";
import api from "../service/api";
import ProjectCard from "../component/ProjectCard";
import DonationReceipt from "../component/DonationReceipt";

export default function ProjectDetails() {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const [project, setProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [amount, setAmount] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            const [p, c, all] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get(`/contributions/project/${id}`),
                api.get("/projects")
            ]);

            setProject(p.data);
            setContributions(c.data);
            setProjects(all.data.filter(x => x.id != id).slice(0, 3));
        } catch {
            setError("Unable to load project details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadData();
    }, [id]);

    const goal = Number(project?.goalAmount || 0);
    const collected = Number(project?.currentAmount || 0);
    const remaining = Math.max(0, goal - collected);
    const percentage = goal ? Math.min(collected / goal * 100, 100) : 0;

    const daysLeft = project?.deadline
        ? Math.ceil((new Date(project.deadline) - new Date()) / 86400000)
        : null;

    const contribute = async () => {
        setError("");

        const donation = Number(amount);

        if (!user) return setError("Please login to contribute.");
        if (user.role !== "BACKER")
            return setError("Only backers can contribute.");
        if (!amount || !Number.isFinite(donation) || donation < 1)
            return setError("Enter a valid donation amount of at least ₹1.");
        if (remaining <= 0)
            return setError("This project has reached its funding goal.");
        if (donation > remaining)
            return setError(`Maximum donation allowed: ₹${remaining.toLocaleString("en-IN")}.`);

        setSubmitting(true);

        try {
            if (!window.Razorpay) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = resolve;
                    script.onerror = () => reject(
                        new Error("Unable to load Razorpay.")
                    );
                    document.body.appendChild(script);
                });
            }

            // Fetch the latest project amount before creating the order.
            const latest = (await api.get(`/projects/${id}`)).data;
            const latestRemaining = Math.max(
                0,
                Number(latest.goalAmount) - Number(latest.currentAmount || 0)
            );

            setProject(latest);

            if (latestRemaining <= 0 || donation > latestRemaining) {
                throw new Error(
                    latestRemaining <= 0
                        ? "This project has reached its funding goal."
                        : `Only ₹${latestRemaining.toLocaleString("en-IN")} remains. Enter a lower amount.`
                );
            }

            const order = (await api.post("/payments/create-order", {
                projectId: Number(id),
                userId: user.id,
                amountPaise: Math.round(donation * 100)
            })).data;

            const checkout = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                order_id: order.orderId,
                name: "CrowdFunding",
                description: latest.title,

                handler: async response => {
                    try {
                        // Verify payment with the backend first.
                        await api.post("/payments/verify", {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        // Show receipt only after successful verification.
                        setReceipt({
                            donorName: user.name || "Donor",
                            projectName: latest.title,
                            amount: donation,
                            date: new Date().toISOString(),
                            paymentId: response.razorpay_payment_id
                        });

                        setAmount("");
                        setError("");
                        await loadData();
                    } catch (err) {
                        setError(
                            err.response?.data?.message ||
                            "Payment verification failed. Contact support before retrying."
                        );
                    } finally {
                        setSubmitting(false);
                    }
                },

                modal: {
                    ondismiss: () => setSubmitting(false)
                },

                theme: { color: "#4f46e5" }
            });

            checkout.on("payment.failed", response => {
                setError(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );
                setSubmitting(false);
            });

            checkout.open();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Payment could not be started."
            );
            setSubmitting(false);
        }
    };

    if (loading)
        return <div className="p-10 text-center">Loading project...</div>;

    if (!project)
        return (
            <div className="p-10 text-center">
                Project not found. <Link to="/">Go Home</Link>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            
{receipt && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <DonationReceipt
                donation={receipt}
                onClose={() => setReceipt(null)}
            />
        </div>
    </div>
)}


            <div className="relative">
                <img
                    src={`https://picsum.photos/seed/${project.category}-${project.id}/1200/500`}
                    alt={project.title}
                    className="w-full h-64 sm:h-80 object-cover"
                />
                <Link
                    to="/"
                    className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 flex gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-6">
                    <div>
                        <span className="text-indigo-600 font-semibold">
                            {project.category}
                        </span>
                        <h1 className="text-3xl font-bold mt-2">
                            {project.title}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Created by {project.creator?.name}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold">About this project</h2>
                        <p className="text-gray-600 mt-3 whitespace-pre-line">
                            {project.description}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold flex gap-2 items-center">
                            <Users size={20} /> Recent Contributions
                        </h2>

                        {contributions.length ? contributions.map(c => (
                            <div key={c.id} className="flex justify-between border-b py-3">
                                <span>{c.user?.name}</span>
                                <b>₹{Number(c.amount).toLocaleString("en-IN")}</b>
                            </div>
                        )) : (
                            <p className="text-gray-500 mt-3">
                                Be the first to support this project.
                            </p>
                        )}
                    </div>
                </section>

                <aside>
                    <div className="bg-white rounded-xl shadow p-6 space-y-5 lg:sticky lg:top-6">
                        <div className="flex justify-between items-baseline">
                            <b className="text-2xl">
                                ₹{collected.toLocaleString("en-IN")}
                            </b>
                            <span className="text-gray-500">
                                of ₹{goal.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="h-3 bg-gray-200 rounded-full">
                            <div
                                className="h-3 bg-green-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-green-600 flex gap-1">
                                <TrendingUp size={16} />
                                {percentage.toFixed(0)}% funded
                            </span>
                            <span className="text-gray-500 flex gap-1">
                                <Calendar size={16} />
                                {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                            </span>
                        </div>

                        <p className="text-xs text-gray-400">
                            Deadline: {project.deadline || "—"}
                        </p>

                        <div className="bg-indigo-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Remaining goal</p>
                            <b className="text-xl text-indigo-700">
                                ₹{remaining.toLocaleString("en-IN")}
                            </b>
                        </div>

                        <hr />
                        <h3 className="font-semibold">Support this project</h3>

                        {error && (
                            <p className="text-sm text-red-600" role="alert">
                                {error}
                            </p>
                        )}

                        {!user ? (
                            <Link
                                to="/login"
                                className="block text-center bg-indigo-600 text-white p-3 rounded-lg"
                            >
                                Login to contribute
                            </Link>
                        ) : user.role !== "BACKER" ? (
                            <p className="text-gray-500 text-sm">
                                Only backers can contribute.
                            </p>
                        ) : remaining <= 0 ? (
                            <p className="text-green-700 font-semibold">
                                Funding goal reached!
                            </p>
                        ) : (
                            <>
                                <input
                                    type="number"
                                    min="1"
                                    max={remaining}
                                    step="1"
                                    value={amount}
                                    onChange={e => {
                                        setAmount(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Enter amount in ₹"
                                    className="w-full border p-3 rounded-lg"
                                />

                                <button
                                    onClick={contribute}
                                    disabled={
                                        submitting ||
                                        !amount ||
                                        Number(amount) < 1 ||
                                        Number(amount) > remaining
                                    }
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white p-3 rounded-lg"
                                >
                                    {submitting ? "Processing..." : "Contribute"}
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                {projects.length > 0 && (
                    <section className="lg:col-span-3">
                        <h2 className="text-xl font-bold mb-5">
                            More projects to explore
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(p => (
                                <ProjectCard key={p.id} project={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
