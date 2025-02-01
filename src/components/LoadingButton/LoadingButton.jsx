import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1991da;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <StyledButton {...props}>
      {loading && <Spinner />}
      {children}
    </StyledButton>
  );
};

export default LoadingButton;
