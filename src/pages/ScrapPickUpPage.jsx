import React, { useState, useEffect } from "react";
import { pickupStages, mockScrapTypes, mockRequest } from "../data/strapPickUpData";

const ScrapPickUpPage = () => {
  // Current stage is fixed here but can be dynamic in a real app
  const currentStageIndex = 1;

  const [request, setRequest] = useState(null);

  useEffect(() => {
    setRequest(mockRequest);
  }, []);

  if (!request) {
    return <div>Loading request details...</div>;
  }

  const scrapTypeName =
    mockScrapTypes.find((type) => type.id === request.scrapTypeId)?.name || "Unknown";

  const formatDateToLocale = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const handlePrintOrder = () => {
    alert("Printing your scrap pick-up order now!");
  };

  return (
    <div className="container">
      <h3 className="mb-5 pt-5 text-center">Scrap Pick-Up Progress</h3>

      <div className="d-flex align-items-center justify-content-between flex-wrap mb-5">
        {pickupStages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isActive = index === currentStageIndex;

          return (
            <React.Fragment key={stage}>
              <div
                className="d-flex flex-column align-items-center text-center px-2"
                style={{ minWidth: 120 }}
              >
                <div
                  className={`rounded-circle mb-2 ${
                    isCompleted ? "bg-success" : isActive ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{
                    width: 30,
                    height: 30,
                    lineHeight: "30px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <small
                  style={{
                    maxWidth: 130,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0d6efd" : "#6c757d",
                  }}
                >
                  {stage}
                </small>
              </div>

              {index !== pickupStages.length - 1 && (
                <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 40 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    fill="none"
                    stroke={isCompleted ? "#198754" : "#6c757d"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-arrow-right"
                  >
                    <line x1="0" y1="12" x2="30" y2="12" />
                    <polyline points="20 4 30 12 20 20" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <section className="px-4 py-4 bg-light rounded shadow-sm">
        <h4 className="text-success mb-3">🧾 Scrap Pick-Up Request</h4>

        <p className="mb-2">
          <strong>Request ID:</strong> <span className="text-dark">{request.requestId || "-"}</span>
          <br />
          <strong>Scrap Type:</strong> <span className="text-dark">{scrapTypeName}</span>
          <br />
          <strong>Quantity:</strong> <span className="text-dark">{request.quantityKg} kg</span>
          <br />
          <strong>Pickup Date:</strong>{" "}
          <span className="text-muted">{formatDateToLocale(request.pickupDate)}</span>
        </p>

        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={handlePrintOrder}>
            🖨️ Print Scrap Pick-Up Order
          </button>
        </div>
      </section>
    </div>
  );
};

export default ScrapPickUpPage;
