import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import AppPage from "./pages/AppPage.jsx";
import PreOrderPage from "./pages/PreOrderPage.jsx";
import LiveTrackingPage from "./pages/LiveTrackingPage.jsx";
import SealPointsPage from "./pages/SealPointsPage.jsx";
import SwappingPage from "./pages/SwappingPage.jsx";
import CommunityVotePage from "./pages/CommunityVotePage.jsx";
import CommunityActivityPage from "./pages/CommunityActivity.jsx";
import DeliveryPage from "./pages/DeliveryPage.jsx";
import ScrapPickUpPage from "./pages/ScrapPickUpPage.jsx";

function App() {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith("/app");

  useEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error);
        document.addEventListener("click", () => video.play(), { once: true });
      });
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {isAppRoute && (
        <video
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src="/AppBackground3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <Header />

      <main
        className="flex-grow"
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          minHeight: "100vh",
          background: isAppRoute ? "transparent" : "radial-gradient(circle at top left, #e0f7fa, #ffffff 70%)",
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/app/pre-order" element={<PreOrderPage />} />
          <Route path="/app/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/app/seal-points" element={<SealPointsPage />} />
          <Route path="/app/swapping" element={<SwappingPage />} />
          <Route path="/app/community/vote" element={<CommunityVotePage />} />
          <Route path="/app/community/activity" element={<CommunityActivityPage />} />
          <Route path="/app/delivery" element={<DeliveryPage />} />
          <Route path="/app/scrap-pickup" element={<ScrapPickUpPage />} />
        </Routes>
      </main>

      {/* Spline preloaders */}
      <div style={{ width: 0, height: 0, overflow: "hidden" }}>
        <iframe src="https://prod.spline.design/DZfbw9CS6xj-go5q/scene.splinecode" title="preload1" />
        <iframe src="https://prod.spline.design/n5LzLMalk90YbY3w/scene.splinecode" title="preload2" />
        <iframe src="https://prod.spline.design/Xox3GOfQsnbHOl2e/scene.splinecode" title="preload3" />
        <iframe src="https://prod.spline.design/8CYC9U9A5LEfvlEE/scene.splinecode" title="preload4" />
      </div>
    </div>
  );
}

export default App;
