import React from 'react';
import styled from 'styled-components';
import { Popover } from 'reactstrap';
import { ChromePicker } from 'react-color';

const Wrapper = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;

  div {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export default class ColorPicker extends React.PureComponent {
  state = {};

  static cpCount = 0;

  componentWillMount() {
    this.popoverId = `popover${ColorPicker.cpCount++}`;
  }

  toggle = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <Wrapper>
        <div id={this.popoverId} onClick={this.toggle} style={{ backgroundColor: this.props.color || '#000000' }} />
        <Popover placement="bottom" isOpen={this.state.open} target={this.popoverId} toggle={this.toggle}>
          <ChromePicker {...this.props} />
        </Popover>
      </Wrapper>
    );
  }
}
