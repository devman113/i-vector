import React from 'react';
import styled from 'styled-components';
import { Modal, Progress } from 'reactstrap';

const Wrapper = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: auto !important;

  .modal-content {
    width: auto;
    background-color: transparent;
    color: #fff;
    border: none;
    text-align: center;

    .progress {
      width: 300px;
    }
  }
`;

export default ({ label, progress }) => {
  return (
    <Wrapper isOpen fade={false}>
      {progress && (
        <Progress animated value={progress}>
          {progress}%
        </Progress>
      )}
      {label && <div>{label}</div>}
    </Wrapper>
  );
};
