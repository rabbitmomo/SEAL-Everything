import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { users } from "../data/swappingData.js";
// Helper to convert lat/lng coords to 3D position on globe surface
function latLngToXYZ(lat, lng, offset = 0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -Math.sin(phi) * Math.cos(theta) * (1 + offset);
  const y = Math.cos(phi) * (1 + offset);
  const z = Math.sin(phi) * Math.sin(theta) * (1 + offset);

  return [x, y, z];
}

// Makes labels always face outward from globe surface
function OutwardFacingLabel({ position, children, color }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const direction = position.clone().normalize();
    ref.current.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.06}
      color={color}
      anchorX="center"
      anchorY="middle"
      maxWidth={2}
      outlineWidth={0.02}
      outlineColor="#000"
    >
      {children}
    </Text>
  );
}

export default function SwappingPage() {
  // Helper: get ISO date string days from now
  function getDatePlusDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  const [selectedNeighbor, setSelectedNeighbor] = useState(null);
  const [swapOffer, setSwapOffer] = useState([]);
  const [swapRequest, setSwapRequest] = useState(null);
  const [swapStatus, setSwapStatus] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const you = users[0];
  const earthTexture = useLoader(TextureLoader, "/Earth texture.png");
  const controlsRef = useRef();

  // When swapRequest is created, simulate async confirmation
  useEffect(() => {
    if (!swapRequest) return;
    setSwapStatus("Pending...");
    const timeout = setTimeout(() => {
      setSwapStatus("Accepted ✅");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [swapRequest]);

  // Centers camera on user location with smooth animation
  const handleFindMe = React.useCallback(() => {
    if (!controlsRef.current) return;

    const [x, y, z] = latLngToXYZ(you.lat, you.lng, 0.12);
    const targetPos = new THREE.Vector3(x, y, z);

    controlsRef.current.target.copy(targetPos);
    const camPos = targetPos.clone().multiplyScalar(3);

    let frame = 0;
    const totalFrames = 30;
    const camera = controlsRef.current.object;
    const startPos = camera.position.clone();
    const startTarget = controlsRef.current.target.clone();

    function animate() {
      frame++;
      const t = frame / totalFrames;
      camera.position.lerpVectors(startPos, camPos, t);
      controlsRef.current.target.lerpVectors(startTarget, targetPos, t);
      controlsRef.current.update();

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    }
    animate();
  }, [you.lat, you.lng]);

  useEffect(() => {
    handleFindMe();
  }, [handleFindMe]);

  // Icon for the current user
  function YouIcon(props) {
    return (
      <mesh {...props}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    );
  }

  // Icon for neighbors
  function NeighborIcon(props) {
    return (
      <mesh {...props}>
        <coneGeometry args={[0.03, 0.07, 8]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Canvas style={{ flex: 1 }} camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={3.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls ref={controlsRef} enableZoom={true} />

        {/* Earth globe */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial map={earthTexture} />
        </mesh>

        {/* Current user */}
        {(() => {
          const [x, y, z] = latLngToXYZ(you.lat, you.lng, 0.12);
          const pos = new THREE.Vector3(x, y, z);
          return (
            <>
              <YouIcon position={pos.toArray()} />
              {showLabels && (
                <OutwardFacingLabel
                  position={pos.clone().multiplyScalar(1.15)}
                  color="yellow"
                >
                  Me
                </OutwardFacingLabel>
              )}
            </>
          );
        })()}

        {/* Neighbors */}
        {users
          .filter((user) => user.id !== you.id)
          .map((user, idx) => {
            const latOffset = user.lat + idx * 0.02;
            const lngOffset = user.lng + idx * 0.02;
            const [x, y, z] = latLngToXYZ(latOffset, lngOffset, 0.14);
            const pos = new THREE.Vector3(x, y, z);
            return (
              <React.Fragment key={user.id}>
                <NeighborIcon
                  position={pos.toArray()}
                  onClick={() => setSelectedNeighbor(user)}
                  style={{ cursor: "pointer" }}
                  title={`Swap with ${user.name}`}
                />
                {showLabels && (
                  <OutwardFacingLabel
                    position={pos.clone().multiplyScalar(1.15)}
                    color="orange"
                  >
                    {user.name}
                  </OutwardFacingLabel>
                )}
              </React.Fragment>
            );
          })}
      </Canvas>

      {/* Swap panel */}
      <aside
        style={{
          width: 360,
          padding: 16,
          backgroundColor: "#f5fdf7",
          borderLeft: "1px solid #d0e8dc",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: 14,
          color: "#333",
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.8,
        }}
      >
        <h3
          style={{
            marginTop: 25,
            marginBottom: 10,
            color: "#2e7d32",
            fontSize: 18,
          }}
        >
          💱 Community Crops Swap Center
        </h3>

        <button
          onClick={() => setShowLabels((v) => !v)}
          style={{
            padding: "6px 10px",
            marginBottom: 14,
            fontSize: 13,
            backgroundColor: "#d9f2e4",
            border: "1px solid #b2dfdb",
            borderRadius: 4,
            cursor: "pointer",
          }}
          aria-pressed={showLabels}
        >
          {showLabels ? "🙈 Hide Labels" : "👁 Show Labels"}
        </button>

        <button
          onClick={handleFindMe}
          style={{
            padding: "6px 10px",
            marginBottom: 14,
            fontSize: 13,
            backgroundColor: "#a5d6a7",
            border: "1px solid #81c784",
            borderRadius: 4,
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
          title="Center the globe on your location"
        >
          📍 Find Me
        </button>

        {/* Users crops to offer */}
        <section style={{ marginBottom: 16 }}>
          <strong>Your Crops:</strong>
          <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 6 }}>
            {you.crops.map((crop) => (
              <li key={crop} style={{ marginBottom: 4 }}>
                <label>
                  <input
                    type="checkbox"
                    value={crop}
                    checked={swapOffer.includes(crop)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSwapOffer((prev) =>
                        checked
                          ? [...prev, crop]
                          : prev.filter((c) => c !== crop)
                      );
                    }}
                  />{" "}
                  {crop}
                </label>
              </li>
            ))}
          </ul>
        </section>

        {selectedNeighbor ? (
          <>
            <h4 style={{ marginBottom: 6, fontSize: 15 }}>
              🤝 Swap with{" "}
              <span style={{ color: "#1b5e20" }}>{selectedNeighbor.name}</span>
            </h4>

            <strong>{selectedNeighbor.name}'s Crops:</strong>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 6 }}>
              {selectedNeighbor.crops.map((crop) => (
                <li key={crop} style={{ marginBottom: 4 }}>
                  <label>
                    <input type="checkbox" value={crop} /> {crop}
                  </label>
                </li>
              ))}
            </ul>

            <div style={{ margin: "12px 0" }}>
              <strong>Suggested Exchange Location:</strong>
              <p style={{ margin: "6px 0", fontSize: 13, color: "#2e7d32" }}>
                📍 lat: {((you.lat + selectedNeighbor.lat) / 2).toFixed(4)},
                lng: {((you.lng + selectedNeighbor.lng) / 2).toFixed(4)}
              </p>

              <input
                type="text"
                placeholder="e.g. Green Center Putra Malaysia"
                value={
                  swapRequest?.locationName || "Green Center Putra Malaysia"
                }
                onChange={(e) =>
                  setSwapRequest((prev) => ({
                    ...prev,
                    locationName: e.target.value,
                  }))
                }
                style={{
                  marginTop: 6,
                  marginBottom: 6,
                  padding: 6,
                  width: "100%",
                  fontSize: 13,
                  border: "1px solid #c8e6c9",
                  borderRadius: 4,
                  backgroundColor: "#fbfffc",
                }}
              />

              <button
                onClick={() => alert("Location name saved!")}
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  backgroundColor: "#e0f2f1",
                  border: "1px solid #a7d7cf",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                ✏️ Change Location
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <strong>Proposed Date:</strong>
              <input
                type="date"
                value={swapRequest?.proposedDate || ""}
                style={{
                  marginTop: 6,
                  padding: 4,
                  width: "100%",
                  fontSize: 13,
                  border: "1px solid #c8e6c9",
                  borderRadius: 4,
                  backgroundColor: "#fbfffc",
                }}
                onChange={(e) =>
                  setSwapRequest((prev) => ({
                    ...(prev || {}),
                    proposedDate: e.target.value,
                  }))
                }
              />

              <button
                onClick={() => alert("Date changed successfully!")}
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  padding: "4px 8px",
                  backgroundColor: "#f1f8e9",
                  border: "1px solid #c5e1a5",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                ✏️ Change Date
              </button>
            </div>

            <button
              disabled={swapOffer.length === 0}
              onClick={() => {
                setSwapRequest((prev) => ({
                  ...(prev || {}),
                  from: you.id,
                  to: selectedNeighbor.id,
                  offeredCrops: swapOffer,
                  requestedCrops: [], 
                  proposedDate: prev?.proposedDate || getDatePlusDays(3),
                }));
                setSwapStatus(null);
                alert(`Swap request sent to ${selectedNeighbor.name}.`);
              }}
              style={{
                padding: "8px 14px",
                fontSize: 14,
                backgroundColor: swapOffer.length === 0 ? "#ccc" : "#66bb6a",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                fontWeight: "bold",
                cursor: swapOffer.length === 0 ? "not-allowed" : "pointer",
              }}
              title={
                swapOffer.length === 0 ? "Select crops to offer first" : ""
              }
            >
              🚀 Send Swap Request
            </button>
          </>
        ) : (
          <p style={{ fontStyle: "italic", color: "#666", marginTop: 8 }}>
            Select a neighbor on the globe to propose a swap.
          </p>
        )}

        {swapRequest && (
          <div
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: "#fff",
              border: "1px solid #ccebc5",
              borderRadius: 6,
              fontSize: 13,
              color: swapStatus === "Accepted ✅" ? "green" : "#33691e",
            }}
          >
            <strong>📬 Swap Request Status:</strong>
            <p>
              Offering:{" "}
              <strong>{(swapRequest?.offeredCrops || []).join(", ")}</strong>
              <br />
              To:{" "}
              {users.find((u) => u.id === swapRequest.to)?.name || "Unknown"}
              <br />
              Date: {swapRequest.proposedDate || "Not selected"}
              <br />
              Location:{" "}
              <strong>
                {swapRequest.locationName || "Green Center Putra Malaysia"}
              </strong>
              <br />
              <em>{swapStatus}</em>
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
