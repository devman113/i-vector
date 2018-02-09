import styled from 'styled-components';

export default styled.div`
  width: 300px;
  border-left: 6px outset transparent;
  border-image: linear-gradient(to left, rgba(0, 0, 0, 0.35) 0, rgba(0, 0, 0, 0.15) 50%, transparent 100%) 1 50%;
  overflow-y: auto;
`;
