import { useEffect } from "react";

export default function LiveInternetCounterHidden() {
  useEffect(() => {
    const img = new Image();

    img.src =
      "https://counter.yadro.ru/hit?r" +
      encodeURIComponent(document.referrer) +
      (typeof screen === "undefined"
        ? ""
        : ";s" +
          screen.width +
          "*" +
          screen.height +
          "*" +
          (screen.colorDepth ? screen.colorDepth : screen.pixelDepth)) +
      ";u" +
      encodeURIComponent(document.URL) +
      ";h" +
      encodeURIComponent(document.title.substring(0, 150)) +
      ";" +
      Math.random();
  }, []);

  return null;
}
