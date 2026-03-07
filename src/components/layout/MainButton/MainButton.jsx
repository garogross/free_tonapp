import clsx from "clsx";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./MainButton.module.scss";

const MainButton = memo(
  ({
    className,
    children,
    asLink,
    asNavLink,
    size,
    isSecondaryVariant,
    ...properties
  }) => {
    if (asNavLink) {
      // Extract href for Link, pass other props to the <a>
      const { href, ...restProps } = properties || {};
      return (
        <Link
          to={href}
          {...restProps}
          className={clsx(
            styles.mainButton,
            className,
            size === "sm" && styles.mainButton_sm,
            size === "md" && styles.mainButton_md,
            isSecondaryVariant && styles.mainButton_secondary,
          )}
        >
          {children}
        </Link>
      );
    }

    const TagName = asLink ? "a" : "button";

    return (
      <TagName
        className={clsx(
          styles.mainButton,
          className,
          size === "sm" && styles.mainButton_sm,
          size === "md" && styles.mainButton_md,
          isSecondaryVariant && styles.mainButton_secondary,
        )}
        {...properties}
      >
        {children}
      </TagName>
    );
  },
);

export default MainButton;
