import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';

const Wrapper = styled.a`
  display: block;
  padding: 0.75rem 1.25rem;
  cursor: pointer;

  svg {
    float: right;
    margin-top: 4px;
  }
`;

export default ({ label, open, onClick }) => {
  return (
    <Wrapper className="text-muted" onClick={onClick}>
      {label}
      <FontAwesomeIcon icon={open ? faAngleUp : faAngleDown} />
    </Wrapper>
  );
};
