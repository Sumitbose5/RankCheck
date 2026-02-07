import React from 'react';
import styled from 'styled-components';

const Loader = ({ text }) => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <div className="loader-box">
          <span className="loader-text">{text || 'SYNCING_DATA'}</span>
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
        </div>
        <div className="shadow-block" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;

  .loader-container {
    position: relative;
    width: 240px;
  }

  .loader-box {
    position: relative;
    background: #000;
    border: 4px solid #fff;
    padding: 15px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* The 3D "Funky" Shadow */
  .shadow-block {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 100%;
    height: 100%;
    background: #22c55e; /* Lime Green shadow */
    border: 4px solid #fff;
    z-index: 1;
  }

  .loader-text {
    color: #fff;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
    text-align: left;
    display: block;
    animation: blink 0.8s steps(2) infinite;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background: #333;
    border: 2px solid #fff;
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    position: absolute;
    height: 100%;
    width: 0%;
    background: #ec4899; /* Hot Pink fill */
    animation: load-crunch 2.5s infinite;
    border-right: 4px solid #fff;
  }

  @keyframes blink {
    50% { opacity: 0.5; }
  }

  @keyframes load-crunch {
    0% { width: 0%; }
    20% { width: 15%; }
    40% { width: 45%; }
    55% { width: 50%; }
    75% { width: 85%; }
    100% { width: 100%; }
  }
`;

export default Loader;