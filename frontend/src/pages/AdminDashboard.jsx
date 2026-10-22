
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, FolderKanban, LogOut, Search,
  RefreshCw, Trash2, Eye, TrendingUp, IndianRupee, Target
} from "lucide-react";
import api from "../service/api";

const money = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const button = "p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3";
const card = "bg-white rounded-xl p-5 shadow-sm";

function StatCard({ label, value, Icon }) {
  return <div className={card}>
    <div className="flex justify-between text-gray-500">
      {label}<Icon size={22} className="text-indigo-600" />
    </div>
    <h3 className="text-2xl font-bold mt-3">{value}</h3>
  </div>;
}

function AdminTable({ headers, children }) {
  return <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead><tr className="border-b bg-gray-50">
        {headers.map(h => <th key={h} className="p-3">{h}</th>)}
      </tr></thead>
      <tbody>{children}</tbody>
    </table>
  </div>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState("Dashboard");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, u, p] = await Promise.all([
        api.get("/admin/stats"), api.get("/admin/users"),
        api.get("/admin/projects")
      ]);
      setStats(s.data);
      setUsers(u.data);
      setProjects(p.data);
    } catch {
      setError("Unable to load data. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.role !== "ADMIN") navigate("/login", { replace: true });
    else loadData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const deleteProject = async p => {
    if (!window.confirm(`Delete "${p.title}"? Contribution records may also be deleted.`)) return;
    try {
      await api.delete(`/projects/${p.id}`);
      setSelected(null);
      await loadData();
    } catch (e) {
      setError(e.response?.data?.message || "Unable to delete project.");
    }
  };

  const completed = projects.filter(p =>
    Number(p.goalAmount) > 0 &&
    Number(p.currentAmount) >= Number(p.goalAmount)
  ).length;

  const cards = [
    ["Total Users", stats.totalUsers, Users],
    ["Total Projects", stats.totalProjects, FolderKanban],
    ["Total Contributions", stats.totalContributions, TrendingUp],
    ["Total Raised", money(stats.totalRaised), IndianRupee],
    ["Average Contribution", money(
      Number(stats.totalContributions)
        ? Number(stats.totalRaised) / Number(stats.totalContributions) : 0
    ), IndianRupee],
    ["Completed Projects", completed, Target]
  ];

  const menu = [
    ["Dashboard", LayoutDashboard],
    ["Manage Users", Users],
    ["Manage Projects", FolderKanban]
  ];

  const filteredUsers = users.filter(u =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()) &&
    (role === "ALL" || u.role === role)
  );

  const filteredProjects = projects.filter(p =>
    `${p.title} ${p.category} ${p.creator?.name || ""}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const progress = p => {
    const goal = Number(p.goalAmount) || 0;
    return goal ? Math.min(Number(p.currentAmount || 0) / goal * 100, 100) : 0;
  };

  return <div className="min-h-screen bg-gray-100">
    <header className="bg-indigo-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">CrowdFund Admin</h1>
      <button onClick={logout} className="flex gap-2 items-center">
        <LogOut size={18} /> Logout
      </button>
    </header>

    <div className="flex min-h-screen">
      <aside className="w-56 bg-white shadow p-4 shrink-0">
        {menu.map(([name, Icon]) =>
          <button key={name} onClick={() => { setPage(name); setSearch(""); }}
            className={`${button} w-full mb-2 ${page === name ? "bg-indigo-100 text-indigo-700" : ""}`}>
            <Icon size={19} />{name}
          </button>
        )}
        <button onClick={loadData} className={`${button} w-full mt-3`}>
          <RefreshCw size={18} /> Refresh Data
        </button>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-6">{page}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

        {loading ? <p>Loading dashboard...</p> : <>
          {page === "Dashboard" ? <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cards.map(([label, value, Icon]) =>
                <StatCard key={label} label={label} value={value ?? 0} Icon={Icon} />
              )}
            </div>

            <section className={`${card} mt-6`}>
              <h3 className="text-lg font-bold mb-5">Project Funding Progress</h3>
              {projects.length ? projects.map(p =>
                <div key={p.id} className="mb-5">
                  <div className="flex justify-between gap-3 mb-2">
                    <span className="font-medium">{p.title}</span>
                    <span className="text-sm text-gray-500">{progress(p).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-indigo-600 h-3 rounded-full"
                      style={{ width: `${progress(p)}%` }} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {money(p.currentAmount)} raised of {money(p.goalAmount)}
                  </p>
                </div>
              ) : <p>No projects available.</p>}
            </section>

            <section className={`${card} mt-6`}>
              <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
              {projects.slice(-5).reverse().map(p =>
                <div key={p.id} className="border-b py-3 flex justify-between gap-3">
                  <span>{p.title}</span>
                  <span>{money(p.currentAmount)} / {money(p.goalAmount)}</span>
                </div>
              )}
              <button onClick={() => setPage("Manage Projects")}
                className="text-indigo-600 mt-4">View all projects →</button>
            </section>
          </> : <section className={card}>
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[12rem]">
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${page === "Manage Users" ? "users" : "projects"}...`}
                  className="border rounded-lg p-3 pl-10 w-full" />
              </div>
              {page === "Manage Users" && <select value={role}
                onChange={e => setRole(e.target.value)} className="border rounded-lg p-3">
                {["ALL", "ADMIN", "CREATOR", "BACKER"].map(r =>
                  <option key={r} value={r}>{r === "ALL" ? "All roles" : r}</option>
                )}
              </select>}
            </div>

            {page === "Manage Users" ?
              <AdminTable headers={["ID", "Name", "Email", "Role"]}>
                {filteredUsers.map(u => <tr key={u.id} className="border-b">
                  {[u.id, u.name, u.email, u.role].map((v, i) =>
                    <td key={i} className="p-3">{v}</td>
                  )}
                </tr>)}
              </AdminTable> :
              <AdminTable headers={["ID", "Project", "Category", "Goal", "Raised", "Actions"]}>
                {filteredProjects.map(p => <tr key={p.id} className="border-b">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{money(p.goalAmount)}</td>
                  <td className="p-3">{money(p.currentAmount)}</td>
                  <td className="p-3"><div className="flex gap-2">
                    <button onClick={() => setSelected(p)}
                      className="bg-indigo-600 text-white p-2 rounded" title="View details">
                      <Eye size={17} />
                    </button>
                    <button onClick={() => deleteProject(p)}
                      className="bg-red-100 text-red-600 p-2 rounded" title="Delete project">
                      <Trash2 size={17} />
                    </button>
                  </div></td>
                </tr>)}
              </AdminTable>
            }
          </section>}
        </>}
      </main>
    </div>

    {selected && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">Project Details</h2>
          <button onClick={() => setSelected(null)} className="text-2xl text-gray-500">×</button>
        </div>
        <h3 className="text-xl font-semibold">{selected.title}</h3>
        <p className="text-gray-500">{selected.category || "No category"}</p>
        <div className="grid sm:grid-cols-2 gap-3 my-5">
          {[
            ["Goal", money(selected.goalAmount)],
            ["Collected", money(selected.currentAmount)],
            ["Creator", selected.creator?.name || "Unknown"],
            ["Deadline", selected.deadline || "—"]
          ].map(([label, value]) => <div key={label} className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>)}
        </div>
        <h4 className="font-bold mb-2">Description</h4>
        <p className="whitespace-pre-line break-words text-gray-600">
          {selected.description || "No description available."}
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setSelected(null)}
            className="flex-1 border p-3 rounded-lg">Close</button>
          <button onClick={() => deleteProject(selected)}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg">Delete Project</button>
        </div>
      </div>
    </div>}
  </div>;
}
