import React from "react";

const ImageWebp = ({
  srcSet,
  src,
  pictureClass,
  forwardedRef,
  alt,
  ...properties
}) => {
  return (
    <picture
      className={pictureClass ? pictureClass : ""}
      style={{ display: "flex" }}
    >
      <source srcSet={srcSet} type="image/webp" />
      <img
        alt={alt}
        src={src}
        ref={forwardedRef}
        loading="eager"
        {...properties}
      />
    </picture>
  );
};

export default ImageWebp;
