import clsx from "clsx";
import React, { memo } from "react";

import { Link } from "react-router-dom";
import styles from "./SecondaryBtn.module.scss";

const SecondaryBtn = memo(
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
            styles.secondaryBtn,
            className,
            size === "sm" && styles.secondaryBtn_sm,
            isSecondaryVariant && styles.secondaryBtn_secondary,
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
          styles.secondaryBtn,
          size === "sm" && styles.secondaryBtn_sm,
          size === "md" && styles.secondaryBtn_md,
          isSecondaryVariant && styles.secondaryBtn_secondary,
          className,
        )}
        {...properties}
      >
        {children}
      </TagName>
    );
  },
);

export default SecondaryBtn;
