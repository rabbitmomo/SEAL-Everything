import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { activities } from "../data/communityData.js";

export default function CommunityActivityPage() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedActivity = activities.find((a) => a.id === selectedId);

  const handleBack = () => setSelectedId(null);

  return (
    <div
      className="container py-5"
      style={{
        backgroundColor: "#f4f0fa",
        minHeight: "100vh",
      }}
    >
      {!selectedActivity ? (
        <div className="row">
          {activities.map((activity) => (
            <div key={activity.id} className="col-md-4 mb-4 d-flex">
              <div
                className="card text-white flex-fill activity-card shadow-sm"
                onClick={() => setSelectedId(activity.id)}
                style={{ background: activity.gradient, cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{activity.title}</h5>
                  <p className="card-text mt-2 text-truncate-3">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="card text-white mx-auto shadow"
          style={{
            maxWidth: "800px",
            background: selectedActivity.gradient,
            padding: "2rem",
            borderRadius: "1rem",
          }}
        >
          <h2 className="mb-3">{selectedActivity.title}</h2>
          <p><strong>Description:</strong> {selectedActivity.description}</p>
          <p><strong>Objective:</strong> {selectedActivity.objective}</p>
          <p><strong>Tentative Plan:</strong> {selectedActivity.tentative}</p>
          <p><strong>Date:</strong> {selectedActivity.date}</p>
          <p><strong>Location:</strong> {selectedActivity.location}</p>

          <button className="btn btn-light mt-4" onClick={handleBack}>
            ← Back to All Activities
          </button>
        </div>
      )}
    </div>
  );
}
