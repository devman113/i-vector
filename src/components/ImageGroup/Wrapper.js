import styled from 'styled-components';

export default styled.div`
  border-top: 1px solid #dddddd;

  > a {
    color: #000 !important;
  }

  .images {
    padding: 0.25rem 1.25rem 0.75rem;

    .image-file {
      display: inline-block;
      width: 78px;
      padding-top: 78px;
      position: relative;

      * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      img {
        padding: 8px;
      }

      &:hover {
        .mask {
          background-image: rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
      }

      .selected {
        border: 3px solid #ffa94d !important;
      }

      .spinner {
        background-color: #fff;
      }
    }
  }
`;
