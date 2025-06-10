import React from "react";
import {
  mockFields,
  mockCrops,
  mockOrder,
  mockOrderId,
  mockSelectedField,
  mockOrderDate,
  mockDeposit,
  stages,
} from "../data/deliveryData";

const DeliveryPage = ({
  currentStageIndex = 2,
  orderId = mockOrderId,
  fields = mockFields,
  selectedField = mockSelectedField,
  orderDate = mockOrderDate,
  crops = mockCrops,
  order = mockOrder,
  deposit = mockDeposit,
  printReceipt = () => alert("Printing receipt..."),
  formatDate = (date) => new Date(date).toLocaleDateString(),
}) => {
  const totalCost = crops
    .filter((crop) => order[crop.id] > 0)
    .reduce((sum, crop) => sum + order[crop.id] * crop.price, 0);

  const amountDueLater = Math.max(0, totalCost - deposit);

  return (
    <div className="container">
      <h3 className="mb-5 pt-5 text-center">Delivery Progress</h3>

      <div className="d-flex align-items-center justify-content-between flex-wrap">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isActive = index === currentStageIndex;

          return (
            <React.Fragment key={index}>
              <div
                className="d-flex flex-column align-items-center text-center px-2"
                style={{ minWidth: 120 }}
              >
                <div
                  className={`rounded-circle mb-2 ${
                    isCompleted
                      ? "bg-success"
                      : isActive
                      ? "bg-primary"
                      : "bg-secondary"
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
                    fontWeight: isActive ? "600" : "400",
                    color: isActive ? "#0d6efd" : "#6c757d",
                  }}
                >
                  {stage}
                </small>
              </div>

              {index !== stages.length - 1 && (
                <div
                  className="d-flex align-items-center"
                  style={{ flex: 1, minWidth: 40 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="24"
                    fill="none"
                    stroke={index < currentStageIndex ? "#198754" : "#6c757d"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-arrow-right"
                  >
                    <line x1="0" y1="12" x2="30" y2="12"></line>
                    <polyline points="20 4 30 12 20 20"></polyline>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Order Receipt Section */}
      <div className="mt-5 px-4 py-4 bg-light rounded shadow-sm">
        <h4 className="text-success mb-3">🧾 Order Receipt</h4>

        <p className="mb-2">
          <strong>Order ID:</strong>{" "}
          <span className="text-dark">{orderId || "-"}</span>
          <br />
          <strong>Field:</strong>{" "}
          <span className="text-dark">
            {fields?.find((f) => f.id === selectedField)?.name || "-"}
          </span>
          <br />
          <strong>Order Date:</strong>{" "}
          <span className="text-muted">
            {orderDate ? formatDate(orderDate) : "-"}
          </span>
        </p>

        <ul className="list-group mb-3">
          {crops
            .filter((crop) => order[crop.id] > 0)
            .map((crop) => (
              <li
                key={crop.id}
                className="list-group-item d-flex justify-content-between"
              >
                {crop.name} ({order[crop.id]} kg)
                <span>RM{(order[crop.id] * crop.price).toFixed(2)}</span>
              </li>
            ))}
        </ul>

        <p className="fw-bold text-end">
          Total Paid (Deposit only):{" "}
          <span className="text-success">
            RM{parseFloat(deposit).toFixed(2)}
          </span>
        </p>

        <p className="fw-bold text-end">
          Amount Due Later:{" "}
          <span className="text-danger">RM{amountDueLater.toFixed(2)}</span>
        </p>

        <p className="text-muted text-center mt-3">
          Thanks for supporting our local farmers! 🌱
        </p>

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-success rounded-pill px-4 py-2"
            onClick={printReceipt}
          >
            🖨️ Print Order Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
