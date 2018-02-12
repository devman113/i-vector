import React from 'react';
import styled from 'styled-components';
import { Modal } from 'reactstrap';

const Wrapper = styled(Modal)`
  display: flex;
  align-items: center;
  height: 100%;
  margin: auto !important;
  transform: none !important;

  canvas {
    width: 100%;
    height: auto;
  }
`;

class Preview extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      const canvas = document.getElementById('canvas1');
      this.props.render(canvas);
    });
  }

  render() {
    return (
      <Wrapper isOpen size="lg" toggle={this.props.onClose}>
        <canvas id="canvas1" width="100" height="100" />
      </Wrapper>
    );
  }
}

export default Preview;
