import type { ButtonHTMLAttributes } from "react";
import "./SVGComponent.css";

const logoSrc = `${import.meta.env.BASE_URL}brand/eurovision-vienna-2026-white.svg`;

const SVGComponent = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className="eurovision-logo-button"
    aria-label="Reset order"
    {...props}
  >
    <img className="eurovision-logo" src={logoSrc} alt="" />
  </button>
);

export default SVGComponent;
