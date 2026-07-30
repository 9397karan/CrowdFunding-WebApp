import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import CreatorDashboard from "./pages/CreatorDashboard";
import Navbar from "./component/Navbar";
import MyProjects from "./pages/MyProjects";
import MyContributions from "./pages/MyContribution";

function App() {

  return (

    <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/create" element={<CreateProject />} />

        <Route path="/project/:id" element={<ProjectDetails />} />

        <Route path="/creator" element={<CreatorDashboard />} />

        <Route path="/my-projects" element={<MyProjects />} />

        <Route path="/my-contributions" element={<MyContributions />}/>

        <Route
    path="/creator-dashboard"
    element={<CreatorDashboard />}
/>
      </Routes>

    </BrowserRouter>

  );

}

export default App;