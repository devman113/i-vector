import styled from 'styled-components';

export default styled.div`
  display: flex;
  height: 100vh;

  > * {
    min-width: 300px;
  }

  main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
