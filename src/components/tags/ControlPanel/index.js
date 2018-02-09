import styled from 'styled-components';

export default styled.div`
  width: 300px;
  border-right: 6px outset transparent;
  border-image: linear-gradient(to right, rgba(0, 0, 0, 0.35) 0, rgba(0, 0, 0, 0.15) 50%, transparent 100%) 1 50%;
  overflow-y: auto;

  > div:first-child {
    padding: 0.75rem 0;

    .btn-link {
      text-decoration: none;

      svg {
        margin-right: 5px;
      }
    }
  }

  .block {
    border-top: 1px solid #dddddd;

    .controls {
      padding: 0 1.25rem 0.75rem;

      .control {
        margin-bottom: 15px;
      }

      .color-picker {
        display: flex;

        label {
          margin-top: 8px;
          margin-right: 15px;
        }
      }
    }
  }
`;
