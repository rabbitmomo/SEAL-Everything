import React, { useState, useEffect } from "react";
import SplineCropOne from "../components/SplineCropsOne";
import SplineCropTwo from "../components/SplineCropsTwo";
import SplineCropThree from "../components/SplineCropsThree";
import { cropsByField } from "../data/fieldData";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-MY", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

const generateOrderId = () => {
  const now = new Date();
  return (
    "ORD" +
    now
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14)
  );
};

export default function PreOrderPage() {
  const [fields, setFields] = useState([]);

  const [step, setStep] = useState(2);
  const [selectedField, setSelectedField] = useState(1);
  const [order, setOrder] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deposit, setDeposit] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderDate, setOrderDate] = useState(null);
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    fetch("http://localhost:5000/field-primary")
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
  const crops = selectedField ? cropsByField[selectedField] : [];

  const handleQtyChange = (cropId, value) => {
    const qty = Math.max(0, parseInt(value, 10) || 0);
    setOrder((prev) => ({ ...prev, [cropId]: qty }));
  };

  const totalQty = Object.values(order).reduce((sum, qty) => sum + qty, 0);
  const totalCost = crops.reduce(
    (sum, crop) => sum + (order[crop.id] || 0) * crop.price,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Oops! Please choose a payment method.");
      return;
    }
    if (!deposit) {
      alert("Please enter a deposit amount.");
      return;
    }
    const depositAmount = parseFloat(deposit);
    const minDeposit = totalCost / 2;
    if (
      depositAmount < minDeposit ||
      depositAmount > totalCost ||
      isNaN(depositAmount)
    ) {
      alert(
        `Your deposit should be between RM${minDeposit.toFixed(
          2
        )} and RM${totalCost.toFixed(2)}.`
      );
      return;
    }
    setSubmitted(true);
    setOrderDate(new Date());
    setOrderId(generateOrderId());
    setStep(4);
  };

  useEffect(() => {
    if (step === 3 && !deposit) {
      setDeposit((totalCost / 2).toFixed(2));
    }
  }, [deposit, step, totalCost]);

  const printReceipt = () => window.print();

  const renderSplineModel = () => {
    switch (selectedField) {
      case 1:
        return <SplineCropOne />;
      case 2:
        return <SplineCropTwo />;
      case 3:
        return <SplineCropThree />;
      default:
        return (
          <p style={{ textAlign: "center", paddingTop: "2rem" }}>
            Please select a field above to view crops.
          </p>
        );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 1200 }}>
      <h2 className="text-center mb-4 fw-bold text-success">
        📋 Pre-Order Fresh Crops
      </h2>

      {/* Field selection */}
      <div className="mb-5 d-flex justify-content-center gap-3 flex-wrap">
        {fields.map(({ id, name }) => (
          <button
            key={id}
            className={`btn btn-outline-success px-4 py-2 rounded-pill ${
              selectedField === id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedField(id);
              setOrder({});
              setStep(2);
              setSubmitted(false);
              setPaymentMethod("");
              setDeposit("");
              setOrderDate(null);
              setOrderId(null);
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div
        className="d-flex flex-wrap gap-4"
        style={{ justifyContent: "space-between", minHeight: 450 }}
      >
        <div
          style={{
            flexBasis: "30%",
            flexGrow: 1,
            minWidth: 300,
            maxHeight: 450,
            backgroundColor: "#f0fff0",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          {renderSplineModel()}
        </div>

        <div
          style={{
            flexBasis: "40%",
            flexGrow: 1,
            minWidth: 320,
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
            padding: 24,
            boxShadow: "0 0 10px rgba(0,0,0,0.08)",
          }}
        >
          {step === 1 && (
            <p className="text-center text-muted fs-5">
              Select a field above to start your pre-order.
            </p>
          )}

          {(step === 2 || step === 3) && (
            <>
              <h4 className="mb-4">Choose Your Crops & Quantity</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (totalQty === 0) {
                    alert("Please add at least one crop to your order.");
                    return;
                  }
                  setStep(3);
                }}
              >
                {crops.map(({ id, name, price }) => (
                  <div
                    key={id}
                    className="mb-3 d-flex align-items-center justify-content-between border-bottom pb-2"
                  >
                    <div>
                      <label className="fw-semibold">{name}</label>
                      <div className="text-muted small">
                        RM{price.toFixed(2)} each
                      </div>
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={order[id] || 0}
                      className="form-control text-center"
                      style={{ maxWidth: 80, borderRadius: 10 }}
                      onChange={(e) => handleQtyChange(id, e.target.value)}
                    />
                  </div>
                ))}

                <div className="text-end mb-3">
                  <strong>Total Cost: </strong>
                  <span className="text-success fw-bold">
                    RM{totalCost.toFixed(2)}
                  </span>
                </div>

                {step === 2 && (
                  <div className="text-end mt-3">
                    <button
                      type="submit"
                      className="btn btn-success rounded-pill px-4 py-2"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}
              </form>
            </>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h4 className="mb-3">Payment & Confirmation</h4>

              <p className="mb-3">
                <strong>Total Quantity:</strong> {totalQty} units
                <br />
                <strong>Total Cost:</strong>{" "}
                <span className="text-success fw-bold">
                  RM{totalCost.toFixed(2)}
                </span>
              </p>

              <div className="mb-3">
                <label>
                  <strong>Payment Method:</strong>
                </label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">-- Please select --</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="mb-3">
                <label>
                  <strong>Deposit Amount (Minimum 50%) (RM):</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min={(totalCost / 2).toFixed(2)}
                  max={totalCost.toFixed(2)}
                  step="0.01"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder={`Between RM${(totalCost / 2).toFixed(
                    2
                  )} and RM${totalCost.toFixed(2)}`}
                />
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-success px-4 py-2 rounded-pill"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          )}

          {step === 4 && submitted && (
            <div
              className="mt-5 p-4 rounded shadow mx-auto"
              style={{
                backgroundColor: "#f0fff0",
                borderLeft: "6px solid #4caf50",
              }}
            >
              <h4 className="text-success mb-3">🧾 Your Order Receipt</h4>

              <p className="mb-2">
                <strong>Order ID:</strong>{" "}
                <span className="text-dark">{orderId}</span>
                <br />
                <strong>Field:</strong>{" "}
                <span className="text-dark">
                  {fields.find((f) => f.id === selectedField)?.name}
                </span>
                <br />
                <strong>Date:</strong>{" "}
                <span className="text-dark">{formatDate(orderDate)}</span>
              </p>

              <ul className="list-group mb-3">
                {crops.map(({ id, name, price }) => {
                  const qty = order[id] || 0;
                  if (qty === 0) return null;
                  return (
                    <li
                      key={id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {name} ({qty} units)
                      </span>
                      <span>RM {(qty * price).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>

              <p className="fw-semibold">
                Total Deposit Paid: RM {parseFloat(deposit).toFixed(2)}
              </p>

              <button
                className="btn btn-outline-success w-100 rounded-pill"
                onClick={printReceipt}
              >
                Print Receipt
              </button>

              <button
                className="btn btn-success mt-3 w-100 rounded-pill"
                onClick={() => {
                  setStep(1);
                  setSelectedField(null);
                  setOrder({});
                  setPaymentMethod("");
                  setDeposit("");
                  setSubmitted(false);
                  setOrderDate(null);
                  setOrderId(null);
                }}
              >
                Place New Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
