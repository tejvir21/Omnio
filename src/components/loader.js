// import { SpinnerInfinity } from 'spinners-react';
// import './styles/Loader.css';

// export const Loader =() => {
//     return (
//         <div className="loader">
//             <SpinnerInfinity size={150} thickness={150} speed={100} color="rgb(9, 86, 187)" secondaryColor="rgba(0, 0, 0, 0)" />
//         </div>
//     )
// }

import styled from 'styled-components';

export const Loader = () => {
  return (
    <StyledWrapper>
      <main>
        <svg xmlns="http://www.w3.org/2000/svg" height="128px" width="256px" viewBox="0 0 256 128" className="ip">
          <defs>
            <linearGradient y2={0} x2={1} y1={0} x1={0} id="grad1">
              <stop stopColor="#5ebd3e" offset="0%" />
              <stop stopColor="#ffb900" offset="33%" />
              <stop stopColor="#f78200" offset="67%" />
              <stop stopColor="#e23838" offset="100%" />
            </linearGradient>
            <linearGradient y2={0} x2={0} y1={0} x1={1} id="grad2">
              <stop stopColor="#e23838" offset="0%" />
              <stop stopColor="#973999" offset="33%" />
              <stop stopColor="#009cdf" offset="67%" />
              <stop stopColor="#5ebd3e" offset="100%" />
            </linearGradient>
          </defs>
          <g strokeWidth={16} strokeLinecap="round" fill="none">
            <g stroke="#ddd" className="ip__track">
              <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
              <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
            </g>
            <g strokeDasharray="180 656">
              <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" strokeDashoffset={0} stroke="url(#grad1)" className="ip__worm1" />
              <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" strokeDashoffset={358} stroke="url(#grad2)" className="ip__worm2" />
            </g>
          </g>
        </svg>
      </main>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  :root {
    --hue: 223px;
    --bg: hsl(var(--hue),90%,95%);
    --fg: hsl(var(--hue),90%,5%);
    --trans-dur: 0.3s;
    font-size: calc(16px + (24px - 16px) * (690px - 320px) / (1280px - 320px));
  }

  .body {
    background-color: var(--bg);
    color: var(--fg);
    font: 16px/1.5 sans-serif;
    height: 100px;
    display: grid;
    place-items: center;
    transition: background-color var(--trans-dur);
  }

  main {
    padding: 24px 0;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
  }

  .ip {
    width: 100px;
    height: 50px;
  }

  .ip__track {
    stroke: hsl(var(--hue),90%,90%);
    transition: stroke var(--trans-dur);
  }

  .ip__worm1,
  .ip__worm2 {
    animation: worm1 2s linear infinite;
  }

  .ip__worm2 {
    animation-name: worm2;
  }

  /* Dark theme */
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: hsl(var(--hue),90%,5%);
      --fg: hsl(var(--hue),90%,95%);
    }

    .ip__track {
      stroke: hsl(var(--hue),90%,15%);
    }
  }

  /* Animation */
  @keyframes worm1 {
    from {
      stroke-dashoffset: 0;
    }

    50% {
      animation-timing-function: steps(1);
      stroke-dashoffset: -358;
    }

    50.01% {
      animation-timing-function: linear;
      stroke-dashoffset: 358;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes worm2 {
    from {
      stroke-dashoffset: 358;
    }

    50% {
      stroke-dashoffset: 0;
    }

    to {
      stroke-dashoffset: -358;
    }
  }`;