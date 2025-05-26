import React from "react";
import Header from "../components/Header";
import { NavLink } from "react-router-dom";

export default function AppPage() {
  return (
    <>
      <div className="container py-5 text-center">
        <h1
          className="mb-3"
          style={{
            fontWeight: "700",
            letterSpacing: "1.5px",
            color: "#00796b",
          }}
        >
          Welcome to SEAL Everything
        </h1>
        <p
          className="lead mb-5"
          style={{ fontSize: "1.25rem", color: "#004d40", fontWeight: "500" }}
        >
          Here's how you can make a real impact in local agriculture—step by
          step.
        </p>

        <div className="row row-cols-1 row-cols-md-4 g-4 mb-5">
          {[
            {
              title: "Live Tracking",
              icon: "bi bi-geo-alt-fill",
              color: "#2196f3",
              description:
                "Monitor crop growth in real-time with our 3D field model.",
              link: "/app/live-tracking",
              btnClass: "btn-primary",
              btnText: "Track Now",
            },
            {
              title: "Pre-Order",
              icon: "bi bi-cart3",
              color: "#4caf50",
              description:
                "Browse what's growing and reserve your fresh produce in advance.",
              link: "/app/pre-order",
              btnClass: "btn-success",
              btnText: "Pre-Order Fresh Produce",
            },
            {
              title: "SEAL Points",
              icon: "bi bi-star-fill",
              color: "#ffb300",
              description:
                "Earn rewards for eco-friendly actions and redeem perks.",
              link: "/app/seal-points",
              btnClass: "btn-warning",
              btnText: "View Points",
            },
            {
              title: "Swapping",
              icon: "bi bi-arrow-repeat",
              color: "#ff5722",
              description:
                "Exchange or share your produce with the local community.",
              link: "/app/swapping",
              btnClass: "btn-info",
              btnText: "Swap Now",
            },
          ].map(
            ({ title, icon, color, description, link, btnClass, btnText }) => (
              <div key={title} className="col">
                <div
                  className="card h-100 shadow"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "15px",
                    border: `1px solid ${color}`,
                    color: color,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = `0 10px 30px ${color}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5
                      className="card-title"
                      style={{ fontWeight: "700", fontSize: "1.25rem" }}
                    >
                      <i
                        className={`${icon} me-2`}
                        style={{ fontSize: "1.3rem" }}
                      ></i>
                      {title}
                    </h5>
                    <p
                      className="card-text flex-grow-1"
                      style={{ fontWeight: "500" }}
                    >
                      {description}
                    </p>
                    <NavLink
                      to={link}
                      className={`btn ${btnClass} btn-gradient mt-auto text-white fw-bold`}
                      style={{
                        borderRadius: "50px",
                        backgroundImage: `linear-gradient(45deg, ${color}, #00796b)`,
                        boxShadow: `0 4px 12px ${color}aa`,
                        transition: "background-position 0.5s ease",
                        backgroundSize: "200% 200%",
                        backgroundPosition: "left",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundPosition = "right")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundPosition = "left")
                      }
                    >
                      {btnText}
                    </NavLink>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Community Impact Section */}
        <div
          className="p-5 rounded shadow-lg"
          style={{
            background: "linear-gradient(135deg, #1de9b6 0%, #1dc4e9 100%)",
            color: "white",
            fontWeight: "600",
            textShadow: "0 1px 5px rgba(0,0,0,0.3)",
          }}
        >
          <h3 className="mb-3">
            <i
              className="bi bi-people-fill me-2"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Join Our Growing Community
          </h3>

          <p className="mb-4 fs-5">
            Together, we support local farmers, reduce food waste, and build a
            sustainable future. Connect, share tips, participate in events, and
            make a real difference in your neighborhood.
          </p>

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <NavLink
              to="/app/community/vote"
              className="btn btn-light btn-lg fw-bold"
              style={{
                borderRadius: "50px",
                color: "#00796b",
                boxShadow: "0 5px 15px #00796b66",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Explore Community Voting Hub
            </NavLink>

            <NavLink
              to="/app/community/activity"
              className="btn btn-light btn-lg fw-bold"
              style={{
                borderRadius: "50px",
                color: "#00796b",
                boxShadow: "0 5px 15px #00796b66",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Explore Local Community Activity
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
