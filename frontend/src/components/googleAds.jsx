import React, { useEffect } from "react";

const AdUnit = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Ad error:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-3940256099942544"
      data-ad-slot="6300978111"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdUnit;
