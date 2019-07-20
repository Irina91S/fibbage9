import React from "react";

const SvgSloth = props => (
  <svg height={80} width={150}  viewBox="0 0 100 500" {...props}>
    <path
      d="M256.001 49.548C65.076 49.548 0 156.521 0 268.089c0 29.047 8.258 75.259 8.258 75.259l24.774-7.922c8.258 39.61 24.774 71.298 24.774 71.298l16.516-15.844c66.065 55.454 107.355 63.377 148.645 63.377h66.065c41.29 0 82.581-7.922 148.645-63.377l16.516 15.844s16.516-31.688 24.774-71.298l24.774 7.922s8.258-46.212 8.258-75.259C512 156.521 446.924 49.548 256.001 49.548z"
      fill="#cdb987"
    />
    <ellipse
      cx={256.001}
      cy={297.291}
      rx={173.42}
      ry={107.355}
      fill="#c39b6e"
    />
    <path
      d="M256.001 115.613c-109.46 0-198.194 77.642-198.194 173.42 0 47.89 41.29 173.42 198.194 173.42s198.194-125.53 198.194-173.42c-.001-95.777-88.735-173.42-198.194-173.42zm99.097 173.42s-41.29 24.774-99.097 24.774-99.097-24.774-99.097-24.774l-54.762 54.762c-5.279-33.886 2.23-67.239 38.246-96.053C181.678 214.71 219.491 256 256.001 256s74.323-41.29 115.613-8.258c36.017 28.813 43.525 62.168 38.246 96.053l-54.762-54.762z"
      fill="#aa825a"
    />
    <path
      d="M182.982 371.178c18.255 36.51 45.636 54.765 73.019 54.765s54.765-18.254 73.019-54.765H182.982z"
      fill="#464655"
    />
    <g fill="#746257">
      <path d="M338.147 362.051c0 25.205-36.778 36.509-82.146 36.509s-82.146-11.305-82.146-36.509 41.819-63.892 82.146-63.892 82.146 38.688 82.146 63.892zM167.639 332.606l-39.362 25.941c-11.137 7.339-26.115 4.261-33.455-6.876-6.398-9.708-4.867-22.342 3.006-30.283l33.173-33.495c11.293-11.403 29.693-11.492 41.095-.198 11.403 11.294 11.492 29.693.198 41.096-1.405 1.419-3.056 2.745-4.655 3.815z" />
    </g>
    <circle cx={152.165} cy={307.799} r={18.254} fill="#464655" />
    <path
      d="M344.361 333.426l39.362 25.941c11.137 7.339 26.115 4.261 33.455-6.876 6.398-9.708 4.867-22.342-3.006-30.283l-33.173-33.495c-11.293-11.403-29.693-11.492-41.095-.198-11.403 11.294-11.492 29.693-.198 41.096 1.405 1.419 3.056 2.746 4.655 3.815z"
      fill="#746257"
    />
    <g fill="#464655">
      <circle cx={359.825} cy={308.625} r={18.254} />
      <circle cx={237.75} cy={371.18} r={9.127} />
      <circle cx={274.251} cy={371.18} r={9.127} />
    </g>
  </svg>
);

export default SvgSloth;
