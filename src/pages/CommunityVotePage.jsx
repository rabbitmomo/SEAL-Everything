import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fields } from "../data/fieldData.js";
import { allProposals as initialProposals } from "../data/communityVotingData.js";

export default function CommunityVotingPage() {
  const [proposals, setProposals] = useState(initialProposals);

  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [voted, setVoted] = useState(false);
  const [choice, setChoice] = useState("");

  const visible = selectedFieldId
    ? proposals.filter((p) => p.fieldId === selectedFieldId)
    : proposals;

  const active = visible.filter((p) => p.status === "Active");
  const past = visible.filter((p) => p.status === "Ended");
  const proposal = proposals.find((p) => p.id === selectedProposalId) || {};

  const percent = (p, opt) => {
    const total = Object.values(p.votes).reduce((a, b) => a + b, 0);
    return total ? Math.round(((p.votes[opt] || 0) / total) * 100) : 0;
  };

  const selField = fields.find((f) => f.id === selectedFieldId) || {
    name: "All Fields",
    location: "",
  };

  const handleCastVote = () => {
    if (!choice) return;
    setProposals((prev) =>
      prev.map((p) =>
        p.id === selectedProposalId
          ? {
              ...p,
              votes: {
                ...p.votes,
                [choice]: (p.votes[choice] || 0) + 1,
              },
            }
          : p
      )
    );
    setVoted(true);
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4f0fa" }}>
      <h2 className="text-center mb-4 fw-bold">🗳️ Community Voting Hub</h2>

      <div className="mb-4 d-flex justify-content-center flex-wrap gap-2">
        <button
          className={`btn btn-outline-secondary ${
            selectedFieldId === null ? "active" : ""
          }`}
          onClick={() => {
            setSelectedFieldId(null);
            setSelectedProposalId(null);
            setVoted(false);
            setChoice("");
          }}
        >
          All Fields
        </button>
        {fields.map((f) => (
          <button
            key={f.id}
            className={`btn btn-outline-primary ${
              selectedFieldId === f.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedFieldId(f.id);
              setSelectedProposalId(null);
              setVoted(false);
              setChoice("");
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <strong>Viewing:</strong> {selField.name}
        {selField.location && ` — ${selField.location}`}
      </div>

      {selectedProposalId ? (
        <div className="card mx-auto shadow-lg p-4" style={{ maxWidth: 700 }}>
          {(() => {
            const f = fields.find((x) => x.id === proposal.fieldId) || {};
            return (
              <p className="small text-muted mb-2">
                <strong>Field:</strong> {f.name} — {f.location}
              </p>
            );
          })()}

          <h4>{proposal.title}</h4>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(proposal.deadline).toLocaleDateString()}
          </p>

          {!voted ? (
            <>
              {["Yes", "No"].map((opt) => (
                <div className="form-check" key={opt}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vote"
                    id={opt}
                    onChange={() => setChoice(opt)}
                  />
                  <label className="form-check-label" htmlFor={opt}>
                    {opt}
                  </label>
                </div>
              ))}
              <button
                className="btn btn-primary mt-3"
                onClick={handleCastVote}
                disabled={!choice}
              >
                🗳️ I'm in! Submit my vote
              </button>
              <p className="text-muted mt-2 small">
                You can only vote once, so choose wisely!
              </p>
            </>
          ) : (
            <>
              <h6 className="mt-4">📊 Results</h6>
              {["Yes", "No"].map((opt) => {
                const pc = percent(proposal, opt);
                return (
                  <div className="mb-3" key={opt}>
                    <div className="d-flex justify-content-between">
                      <span>{opt}</span>
                      <span>
                        {proposal.votes[opt] || 0} ({pc}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className={`progress-bar ${
                          opt === "Yes" ? "bg-success" : "bg-danger"
                        }`}
                        style={{ width: `${pc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="alert alert-success">🎉 Thanks for voting!</div>
            </>
          )}

          <button
            className="btn btn-outline-secondary mt-3"
            onClick={() => {
              setSelectedProposalId(null);
              setVoted(false);
              setChoice("");
            }}
          >
            ← Back
          </button>
        </div>
      ) : (
        <>
          <h4 className="mt-5 mb-3">📌 Active Proposals</h4>
          <div
            className="d-flex flex-row flex-nowrap overflow-auto pb-3"
            style={{ gap: "1rem" }}
          >
            {active.length === 0 && (
              <p className="text-muted fst-italic">
                Looks like there's nothing up for vote here right now. Check
                back later!
              </p>
            )}
            {active.map((p) => {
              const f = fields.find((x) => x.id === p.fieldId) || {};
              return (
                <div
                  key={p.id}
                  className="flex-shrink-0"
                  style={{ width: "32%", minWidth: "280px" }}
                >
                  <div
                    className="card h-100 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedProposalId(p.id)}
                  >
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title text-truncate mb-2">
                        {p.title}
                      </h6>
                      <p className="small text-muted mb-2">
                        {f.name} — {f.location}
                      </p>
                      <p className="small mb-1">
                        <strong>Deadline:</strong>{" "}
                        {new Date(p.deadline).toLocaleDateString()}
                      </p>
                      <p className="small text-muted mb-auto">
                        <strong>Total Votes:</strong>{" "}
                        {Object.values(p.votes).reduce((a, b) => a + b, 0)}
                      </p>
                      <span className="badge bg-primary align-self-start">
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <h5 className="mt-4 mb-3">🕓 Past Proposals</h5>
          <div className="row">
            {past.map((p) => {
              const f = fields.find((x) => x.id === p.fieldId) || {};
              const y = percent(p, "Yes"),
                n = percent(p, "No");
              return (
                <div key={p.id} className="col-md-6 mb-4">
                  <div className="card p-3 bg-light shadow-sm">
                    <h6 className="mb-1">{p.title}</h6>
                    <p className="small text-muted mb-2">
                      {f.name} — {f.location}
                    </p>
                    <small className="text-muted">
                      Ended: {new Date(p.deadline).toLocaleDateString()}
                    </small>
                    <div className="mt-2">
                      <div className="d-flex justify-content-between">
                        <span>Agree</span>
                        <span>{y}%</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${y}%` }}
                        />
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Decline</span>
                        <span>{n}%</span>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-danger"
                          style={{ width: `${n}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
