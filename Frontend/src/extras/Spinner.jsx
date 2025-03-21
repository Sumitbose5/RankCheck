import React from "react";
import styled, { keyframes } from "styled-components";

// Spin Animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Spinner Component
const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ fullScreen }) => (fullScreen ? "height: 100vh;" : "padding: 20px;")}
`;

const SpinnerCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid transparent;
  border-top: 4px solid #3b82f6; /* Blue */
  border-right: 4px solid #a855f7; /* Purple */
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const Spinner = ({ fullScreen = true }) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <SpinnerCircle />
    </SpinnerWrapper>
  );
};
