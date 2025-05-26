import React from "react";
import { useNavigate } from "react-router-dom";
import SplineScene from "../components/SplineScene";
import "../styles/main.css";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <SplineScene />
      <div className="flex flex-col min-h-screen">
        {/* Section 1: Hero / Title with Spline background */}
        <section
          id="hero"
          className="position-relative hero-section overflow-hidden"
        >
          <div className="position-relative d-flex flex-column align-items-center justify-content-center vh-100 px-3 text-center hero-content">
            <h1 className="display-4 fw-bold w-75 mx-auto">
              SEAL Everything — Bringing Community-Powered Farming to Life
            </h1>
            <p className="lead mt-3 w-75 mx-auto">
              Zero waste. Locally grown. Totally transparent.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow rounded-pill mt-4 mb-4 d-flex align-items-center justify-content-center"
              onClick={() => navigate("/app")}
            >
              Try the Demo !
            </button>

            <p className="mt-5 fst-italic text-muted">
              Made by Team UKM — Kok Ngin Hao, Cheong Vai Theng, Chou
              Kar Mei, Gan Than Thie
            </p>

            <button
              onClick={() => {
                const el = document.getElementById("problem");
                const headerOffset = 65;
                if (el) {
                  const elementPosition =
                    el.getBoundingClientRect().top + window.pageYOffset;
                  const offsetPosition = elementPosition - headerOffset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className="arrow-down-button"
            >
              ↓
            </button>
          </div>
        </section>

        {/* Section 2: The Problem */}
        <section id="problem" className="py-5 bg-white">
          <div className="container text-center">
            <h2 className="h3 mb-4">The Problem We’re Facing</h2>
            <div className="row">
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded bg-light h-100">
                  <h5>Maria, the Farmer</h5>
                  <p>
                    She had to throw away 10,000 lbs of tomatoes because there
                    just weren’t enough buyers.
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded bg-light h-100">
                  <h5>Sarah, the Shopper</h5>
                  <p>She finds it tough to afford fresh veggies regularly.</p>
                </div>
              </div>
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded bg-light h-100">
                  <h5>The Neighborhood</h5>
                  <p>
                    People often buy too much and end up wasting spoiled food.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Broken System */}
        <section
          id="broken-system"
          className="py-5 bg-success bg-opacity-10 text-center"
        >
          <div className="container">
            <h2 className="h3 mb-3">A Food System That’s Broken</h2>
            <p className="lead mb-0">
              It’s not just about supply — our local food system is falling
              apart.
            </p>
            <p className="mt-3">
              Farmers, families, and communities all want to help — but right
              now, they’re working alone.
            </p>
          </div>
        </section>

        {/* Section 4: Root Cause */}
        <section id="root-cause" className="py-5 bg-white">
          <div className="container text-center">
            <h2 className="h3 mb-4">Why This Happens</h2>
            <div className="row">
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded h-100">
                  <h5>Farmers</h5>
                  <p>
                    They overplant to cover risk, but often still lose income.
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded h-100">
                  <h5>Consumers</h5>
                  <p>
                    Face unpredictable prices and end up wasting more food than
                    they’d like.
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded h-100">
                  <h5>Communities</h5>
                  <p>
                    Often lack the tools to turn scraps into something useful.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: What If We Linked Them */}
        <section
          id="what-if"
          className="py-5 bg-success bg-opacity-25 text-center"
        >
          <div className="container">
            <h2 className="h2 fw-bold mb-3">
              Imagine if we all worked as one.
            </h2>
            <p className="lead">
              The community becomes the system — planning together, sharing the
              harvest, and turning waste back into resources.
            </p>
          </div>
        </section>

        {/* Section 6: Introducing SEAL Everything */}
        <section id="introducing" className="py-5 bg-white text-center">
          <div className="container">
            <h2 className="h3 mb-4">Introducing SEAL Everything</h2>
            <p className="lead mb-5">
              SEAL Everything connects local agriculture into a shared, circular
              flow — from planting to plate to compost — with full traceability
              and zero waste.
            </p>
          </div>
        </section>

        {/* Section 7: The Results */}
        <section
          id="results"
          className="py-5 bg-success bg-opacity-25 text-center"
        >
          <div className="container">
            <h2 className="h3 mb-4">The Results</h2>
            <div className="row">
              <div className="col-md-4 px-4 mb-4 ">
                <div className="p-3 border rounded h-100 bg-white">
                  <h5>Farmers</h5>
                  <p>Cut down waste and get paid upfront.</p>
                </div>
              </div>
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded h-100 bg-white">
                  <h5>Families</h5>
                  <p>Enjoy fresh, affordable food with less waste.</p>
                </div>
              </div>
              <div className="col-md-4 px-4 mb-4">
                <div className="p-3 border rounded h-100 bg-white">
                  <h5>Communities</h5>
                  <p>
                    Close the loop — turning scraps into compost and energy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Summary */}
        <section id="summary" className="py-5 bg-white text-center">
          <div className="container">
            <h2 className="h2 fw-bold mb-3">Why This Matters</h2>
            <p className="lead mb-0">
              With SEAL Everything, every seed is sown with care, every harvest
              is shared, and every scrap feeds the next season. We’re bringing
              food, families, and sustainability together, one step at a time.
            </p>
          </div>
        </section>

        {/* Section 9: Thank You */}
        <section
          id="thank-you"
          className="py-5 bg-success bg-opacity-25 text-center"
        >
          <div className="container">
            <h2 className="h3 mb-4">Thank You</h2>
            <p>Team UKM</p>
          </div>
        </section>
      </div>
    </>
  );
}
