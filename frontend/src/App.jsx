
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import CreatorDashboard from "./pages/CreatorDashboard";
import Navbar from "./component/Navbar";
import MyProjects from "./pages/MyProjects";
import MyContributions from "./pages/MyContribution";
import EditProject from "./pages/EditProject";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreateProject />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/creator" element={<CreatorDashboard />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/my-contributions" element={<MyContributions />} />
                <Route path="/edit-project/:id" element={<EditProject />} />
                <Route path="/creator-dashboard" element={<CreatorDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
