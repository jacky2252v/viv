import React from "react";
export default function navbar() {
  return (
    <div>
      <nav className="navbar" style={{ backgroundColor: "#e3f2fd" }}>
        <div className="container-fluid">
          <a
            className="navbar-brand"
            style={{ color: "gray" }}
            href="https://www.google.com/"
          >
            <div className="row">
              <div className="col-4">
                <img
                  src="./naruto.png"
                  alt=""
                  className="d-inline-block align-text-top"
                  width={30}
                  height={24}
                />
              </div>
              <div className="col-8">Jayant blogs:</div>
            </div>
          </a>
        </div>
      </nav>
    </div>
  );
}
