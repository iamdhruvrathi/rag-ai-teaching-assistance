import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import LibraryPage from "./pages/LibraryPage";
import UploadPage from "./pages/UploadPage";
import LectureDetailPage from "./pages/LectureDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/lecture/:id" element={<LectureDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
