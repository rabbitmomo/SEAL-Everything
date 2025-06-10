import { useState, useEffect } from "react";
import { userInitialPoints, rewardOptions } from "../data/sealPointsData.js";

export default function SealPointsPage() {
  const [fields, setFields] = useState([]);
  const [points, setPoints] = useState(userInitialPoints);
  const [redeemed, setRedeemed] = useState([]);
  const [message, setMessage] = useState(null);

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

  const handleRedeem = (reward) => {
    if (points < reward.cost) {
      setMessage({
        type: "error",
        text: `Oops! You need ${reward.cost} points to redeem "${reward.label}", but you only have ${points} points right now.`,
      });
      return;
    }

    if (
      reward.type === "free-crop" &&
      redeemed.filter((r) => r.id === reward.id).length >= reward.availableQty
    ) {
      setMessage({
        type: "error",
        text: `Sorry, "${reward.label}" is currently out of stock. Please check back later!`,
      });
      return;
    }

    setPoints((prevPoints) => prevPoints - reward.cost);
    setRedeemed((prevRedeemed) => [...prevRedeemed, reward]);
    setMessage({
      type: "success",
      text: `Great! You’ve successfully redeemed "${reward.label}". Enjoy!`,
    });
  };

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <h2 className="text-center mb-4 fw-bold text-success">
        🌿 SEAL Points Reward Center
      </h2>

      <div className="mb-4 p-3 rounded text-center">
        <h4>Your Points Balance</h4>
        <p className="display-4 text-success fw-bold">{points} pts</p>
      </div>

      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-danger"
          }`}
          onAnimationEnd={() => setMessage(null)}
          onClick={() => setMessage(null)}
          style={{ cursor: "pointer" }}
          role="alert"
        >
          {message.text}
          <br />
          <small className="text-muted">(Click to dismiss)</small>
        </div>
      )}

      <h4 className="mb-3">
        <span
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            padding: "0.4rem 0.8rem",
            borderRadius: "8px",
            color: "#006400", // Dark green
            fontWeight: "600",
          }}
        >
          Available Rewards to Redeem
        </span>
      </h4>
      <div className="list-group mb-4">
        {rewardOptions.map((reward) => {
          const redeemedCount = redeemed.filter(
            (r) => r.id === reward.id
          ).length;
          const outOfStock =
            reward.type === "free-crop" && redeemedCount >= reward.availableQty;

          return (
            <div
              key={reward.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                opacity: outOfStock ? 0.5 : 1,
                pointerEvents: outOfStock ? "none" : "auto",
              }}
            >
              <div>
                <strong>{reward.label}</strong>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Cost: {reward.cost} pts
                  {reward.type === "free-crop" &&
                    ` | Available: ${reward.availableQty - redeemedCount}`}
                </div>
              </div>
              <button
                className="btn btn-success btn-sm"
                disabled={points < reward.cost || outOfStock}
                onClick={() => handleRedeem(reward)}
              >
                Redeem
              </button>
            </div>
          );
        })}
      </div>

      {redeemed.length > 0 && (
        <>
          <h4 className="mb-3">
            <span
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                padding: "0.4rem 0.8rem",
                borderRadius: "8px",
                color: "#2e7d32", // Light green
                fontWeight: "600",
              }}
            >
              Your Redeemed Rewards
            </span>
          </h4>
          <ul className="list-group">
            {redeemed.map((reward, index) => (
              <li key={`${reward.id}-${index}`} className="list-group-item">
                {reward.label}
                {reward.type === "free-crop" &&
                  ` from ${fields.find((f) => f.id === reward.fieldId)?.name}`}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
