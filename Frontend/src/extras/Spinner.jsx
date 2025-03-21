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
  height: 100vh; /* Full screen height */
`;

const SpinnerCircle = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid transparent;
  border-top: 5px solid #3b82f6; /* Blue */
  border-right: 5px solid #a855f7; /* Purple */
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Spinner = () => {
  return (
    <SpinnerWrapper>
      <SpinnerCircle />
    </SpinnerWrapper>
  );
};
