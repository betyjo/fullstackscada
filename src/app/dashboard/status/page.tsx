import React from "react";

export default function StatusPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">System Status</h1>
      <p className="mt-4 mb-4">View live system status here.</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <img
          src="/submersible_pump.png"
          alt="submersible pump"
          style={{
            flex: "1 1 200px",
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <img
          src="/booster_pump.png"
          alt="Booster pump"
          style={{
            flex: "1 1 200px",
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <img
          src="/submersible_pump.png"
          alt="submersible pump"
          style={{
            flex: "1 1 200px",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
