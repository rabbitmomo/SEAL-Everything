import React, { useEffect, useState } from "react";
import SplineCropOne from "../components/SplineCropsOne";
import SplineCropTwo from "../components/SplineCropsTwo";
import SplineCropThree from "../components/SplineCropsThree";
import { useSearchParams } from "react-router-dom";
import { mockFieldStatus, fields } from "../data/fieldData";

export default function FieldLiveTracking() {
  const [searchParams] = useSearchParams();
  const fieldIdParam = searchParams.get("fieldId");
  const initialFieldId = fieldIdParam ? parseInt(fieldIdParam) : 1;

  const [selectedField, setSelectedField] = useState(initialFieldId);
  const [fieldStatus, setFieldStatus] = useState(null);

  useEffect(() => {
    // When the selected field changes, update the field status from mock data
    if (selectedField !== null) {
      setFieldStatus(mockFieldStatus[selectedField]);
    }
  }, [selectedField]);

  // Helper to format just a date nicely
  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Helper to format date & time for last updated
  const formatDateTime = (date) =>
    date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Choose which 3D crop model to render based on selected field
  const renderSplineModel = () => {
    switch (selectedField) {
      case 1:
        return <SplineCropOne />;
      case 2:
        return <SplineCropTwo />;
      case 3:
        return <SplineCropThree />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1400px" }}>
      <h2 className="text-center mb-4 fw-bold text-primary">
        🌱 Field Live Tracking Dashboard
      </h2>

      <div className="mb-5 d-flex justify-content-center gap-3 flex-wrap">
        {fields.map(({ id, name }) => (
          <button
            key={id}
            className={`btn btn-outline-primary px-4 py-2 rounded-pill ${
              selectedField === id ? "active" : ""
            }`}
            onClick={() => setSelectedField(id)}
          >
            {name}
          </button>
        ))}
      </div>

      {selectedField === null && (
        <p className="text-center text-muted fs-5">
          Please select a field above to view its current details.
        </p>
      )}

      {fieldStatus && (
        <div
          className="container d-flex flex-wrap gap-4"
          style={{
            maxWidth: "1200px",
            minHeight: "500px",
            justifyContent: "space-between",
          }}
        >
          {/* Left side: 3D model */}
          <div
            style={{
              flexBasis: "30%",
              flexGrow: 1,
              minWidth: "300px",
              backgroundColor: "#f0f8ff",
              borderRadius: "0.5rem",
              padding: "1rem",
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            }}
          >
            {renderSplineModel()}
          </div>

          {/* Right side: detailed field info */}
          <div
            style={{
              flexBasis: "40%",
              flexGrow: 1,
              minWidth: "280px",
              backgroundColor: "#f9f9f9",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 0 10px rgba(0,0,0,0.08)",
            }}
          >
            <h4 className="mb-4">
              {fields.find((f) => f.id === selectedField)?.name} —{" "}
              {fields.find((f) => f.id === selectedField)?.location}
            </h4>

            <section className="mb-4">
              <h5 className="mb-3">Crops & Growth Stages:</h5>
              <ul className="list-group">
                {fieldStatus.crops.map(({ id, name, growthStage }) => (
                  <li
                    key={id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {name}
                    <span className="badge bg-success rounded-pill">
                      {growthStage}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-4">
              <p>
                <strong>Estimated Harvest Date:</strong>{" "}
                {formatDate(fieldStatus.estimatedHarvestDate)}
              </p>
              <p>
                <strong>Last Fertilized:</strong>{" "}
                {formatDate(fieldStatus.lastFertilized)}
              </p>
              <p>
                <strong>Irrigation Status:</strong>{" "}
                {fieldStatus.irrigationStatus}
              </p>
              <p>
                <strong>Soil Moisture:</strong> {fieldStatus.soilMoisture}
              </p>
            </section>

            <section className="mb-4">
              <h5 className="mb-3">Weather Conditions:</h5>
              <p>🌡️ Temperature: {fieldStatus.weather.temperature}°C</p>
              <p>🌤️ Condition: {fieldStatus.weather.condition}</p>
              <p>💧 Humidity: {fieldStatus.weather.humidity}%</p>
              <p>💨 Wind Speed: {fieldStatus.weather.windSpeed} km/h</p>
            </section>

            <section className="mb-4">
              <p>
                <strong>Last Updated:</strong>{" "}
                {formatDateTime(fieldStatus.lastUpdated)}
              </p>
            </section>

            <section>
              <h5 className="mb-3">Notes:</h5>
              <p>{fieldStatus.notes || "No additional notes at this time."}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
