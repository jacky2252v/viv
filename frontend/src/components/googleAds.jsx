import React, { useEffect } from "react";

const AdUnit = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("Ad error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", minHeight: "100px" }}
      data-ad-client="ca-pub-3940256099942544"
      data-ad-slot="6300978111"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdUnit;
