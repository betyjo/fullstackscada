<<<<<<< HEAD
import React from "react";

export default function statuspage() {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap", // allows images to move to the next line if screen is too small
        justifyContent: "center", // optional, centers the images
      }}
    >
      <img
        src="/submersible_pump.png"
        alt="submersible pump"
        style={{
          flex: "1 1 200px", // grow, shrink, base width
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
=======
export default function StatusPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">System Status</h1>
      <p className="mt-4">View live system status here.</p>
>>>>>>> dc712b6873c2155b2ac59ee1afdd0faf73a3ddf5
    </div>
  );
}
