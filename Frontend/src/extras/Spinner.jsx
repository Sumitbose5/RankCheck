import React from "react";
import styled, { keyframes } from "styled-components";

// Chunky, Stuttery Spin Animation
const chunkySpin = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent; 
  ${({ fullScreen }) => (fullScreen ? "height: 100vh; background-color: #09090b;" : "padding: 20px;")}
`;

const SquareSpinner = styled.div`
  width: 40px;
  height: 40px;
  background-color: #22c55e; /* Neon Lime */
  border: 4px solid white;
  /* This creates the "Funky" 3D shadow effect */
  box-shadow: 8px 8px 0px #ec4899; /* Hot Pink Shadow */
  
  /* steps(1) makes the rotation "jump" instead of sliding */
  animation: ${chunkySpin} 0.6s steps(1) infinite;
`;

export const Spinner = ({ fullScreen = true }) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <SquareSpinner />
    </SpinnerWrapper>
  );
};