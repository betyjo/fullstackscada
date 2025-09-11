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
    </div>
  );
}
