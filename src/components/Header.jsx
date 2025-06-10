import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Header() {
  const [fields, setFields] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isAppRoute = location.pathname.startsWith("/app");

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const match = fields.find((f) =>
        f.name.toLowerCase().includes(searchText.toLowerCase())
      );

      if (match) {
        navigate(`/app/live-tracking?fieldId=${match.id}`);
      } else {
        alert("No match found. Redirecting to the default field.");
        navigate(`/app/live-tracking?fieldId=1`);
      }
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (!value) return setSuggestions([]);

    const matches = fields.filter((f) =>
      f.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches);
  };

  const handleSuggestionClick = (id, name) => {
    setSearchText(name);
    setSuggestions([]);
    navigate(`/app/live-tracking?fieldId=${id}`);
  };

  const navLinks = [
    { to: "/app/live-tracking", label: "Live Tracking" },
    { to: "/app/pre-order", label: "Pre-Order" },
    { to: "/app/seal-points", label: "SEAL Points" },
    { to: "/app/swapping", label: "Swapping" },
  ];

  return (
    <header className="bg-white shadow sticky-top">
      <nav className="container d-flex align-items-center py-3 justify-content-between">
        <NavLink
          to="/"
          className="fw-bold fs-4 text-success text-decoration-none me-3 d-flex align-items-center"
        >
          <img
            src="/SEALlogo.png"
            alt="SEAL Logo"
            style={{ height: "30px", marginRight: "5px" }}
          />
          SEAL Everything
        </NavLink>

        {isAppRoute ? (
          <>
            {/* Search */}
            <div className="flex-grow-1 mx-3 position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search Field..."
                value={searchText}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
              />
              {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 mt-1 shadow">
                  {suggestions.map((field) => (
                    <li
                      key={field.id}
                      className="list-group-item list-group-item-action"
                      onClick={() =>
                        handleSuggestionClick(field.id, field.name)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {field.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Navigation */}
            <div className="d-flex align-items-center flex-wrap">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `me-3 text-primary text-decoration-none ${
                      isActive ? "fw-bold" : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <Dropdown>
                <Dropdown.Toggle variant="outline-success" id="moreDropdown">
                  More
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={NavLink} to="/app/community/vote">
                    Community Voting
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/app/community/activity">
                    Local Activities
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/app/delivery">
                    CBA Delivery
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/app/scrap-pickup">
                    Scrap Pickup
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        ) : (
          <NavLink
            to="/app"
            className={({ isActive }) =>
              `text-primary text-decoration-none ${isActive ? "fw-bold" : ""}`
            }
          >
            Enter App
          </NavLink>
        )}
      </nav>
    </header>
  );
}
