import React, { useEffect, useState } from "react";
import SplineCropOne from "../components/SplineCropsOne";
import SplineCropTwo from "../components/SplineCropsTwo";
import SplineCropThree from "../components/SplineCropsThree";
import { useSearchParams } from "react-router-dom";
import { mockFieldStatus } from "../data/fieldData";

export default function FieldLiveTracking() {
  const [fields, setFields] = useState([]);
  const [searchParams] = useSearchParams();
  const fieldIdParam = searchParams.get("fieldId");
  const initialFieldId = fieldIdParam ? parseInt(fieldIdParam) : 1;

  const [selectedField, setSelectedField] = useState(initialFieldId);
  const [fieldStatus, setFieldStatus] = useState(null);

  const [weatherData, setWeatherData] = useState(null);
  const [analysis, setAnalysis] = useState(""); 

  useEffect(() => {
    fetch("https://seal-everything-server-production.up.railway.app/field-primary")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setFields(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (selectedField !== null) {
      const field = fields.find((f) => f.id === selectedField);
      setFieldStatus(mockFieldStatus[selectedField]);

      if (field?.location) {
        fetch(
          `https://seal-everything-server-production.up.railway.app/weather?city=${encodeURIComponent(
            field.location
          )}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch weather");
            return res.json();
          })
          .then((data) => {
            setWeatherData(data);
          })
          .catch((err) => {
            console.error("Weather fetch error:", err);
            setWeatherData(null);
          });
      }
    }
  }, [selectedField, fields]);

  useEffect(() => {
    if (selectedField && fieldStatus && weatherData) {
      const field = fields.find((f) => f.id === selectedField);
      const payload = {
        prompt: `Analyze the health and sustainability of the following agricultural field data and give suggestions if needed:\n\n
Field Name: ${field?.name}\n
Location: ${field?.location}\n
Crops:\n${fieldStatus.crops
          .map((c) => `- ${c.name} (${c.growthStage})`)
          .join("\n")}\n
Estimated Harvest Date: ${fieldStatus.estimatedHarvestDate}\n
Last Fertilized: ${fieldStatus.lastFertilized}\n
Irrigation Status: ${fieldStatus.irrigationStatus}\n
Soil Moisture: ${fieldStatus.soilMoisture}\n
Weather:\n
  - Temperature: ${weatherData.temperature}°C\n
  - Condition: ${weatherData.condition}\n
  - Humidity: ${weatherData.humidity}%\n
  - Wind Speed: ${weatherData.windSpeed} km/h\n
Notes: ${fieldStatus.notes || "None"}
`,
      };

      fetch("https://seal-everything-server-production.up.railway.app/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch analysis");
          return res.json();
        })
        .then((data) => {
          setAnalysis(data.message || "No analysis available.");
        })
        .catch((err) => {
          console.error("AI Analysis Error:", err);
          setAnalysis("Unable to retrieve analysis at this time.");
        });
    }
  }, [fields, selectedField, fieldStatus, weatherData]);

  useEffect(() => {
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
              maxHeight: "450px",
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
              {weatherData ? (
                <>
                  <p>🌡️ Temperature: {weatherData.temperature}°C</p>
                  <p>🌤️ Condition: {weatherData.condition}</p>
                  <p>💧 Humidity: {weatherData.humidity}%</p>
                  <p>💨 Wind Speed: {weatherData.windSpeed} km/h</p>
                </>
              ) : (
                <p className="text-muted">Weather data not available.</p>
              )}
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

            <section className="mt-4">
              <h5 className="mb-2">🧠 Field Health Summary (AI Analysis):</h5>
              <p className="text-muted">{analysis || "Analyzing..."}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
