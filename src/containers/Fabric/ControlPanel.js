import React from 'react';
import { Button, Collapse, Label, Input } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';

import CollapseHeader from 'components/CollapseHeader';
import { CPWrapper } from './Wrapper';

const SliderWithTooltip = createSliderWithTooltip(Slider);

class ControlPanel extends React.PureComponent {
  state = {
    shape: true,
    text: true,
    save: true
  };

  toggle = group => this.setState({ [group]: !this.state[group] });

  render() {
    const { onChange, data } = this.props;
    return (
      <CPWrapper>
        <div className="block">
          <CollapseHeader label="Pattern" open={this.state.shape} onClick={() => this.toggle('shape')} />
          <Collapse isOpen={this.state.shape}>
            <div className="controls">
              <div className="control">
                <Label>Offset X</Label>
                <SliderWithTooltip
                  min={0}
                  max={data.maxPX}
                  value={data.px}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('px', v)}
                />
              </div>

              <div className="control">
                <Label>Offset Y</Label>
                <SliderWithTooltip
                  min={0}
                  max={data.maxPY}
                  value={data.py}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('py', v)}
                />
              </div>

              <div className="control">
                <Label>Size</Label>
                <SliderWithTooltip
                  min={data.minPSize}
                  max={data.maxPSize}
                  value={data.pSize}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('pSize', v)}
                />
              </div>
            </div>
          </Collapse>
        </div>

        <div className="block">
          <CollapseHeader label="Save" open={this.state.save} onClick={() => this.toggle('save')} />
          <Collapse isOpen={this.state.save}>
            <div className="controls">
              <div className="control">
                <Label>Image Name</Label>
                <Input value={data.name1 || ''} onChange={e => onChange('name1', e.target.value)} />
              </div>

              <div className="control">
                <Label>Image Name2</Label>
                <Input value={data.name2 || ''} onChange={e => onChange('name2', e.target.value)} />
              </div>

              <div className="control">
                <Button
                  color="primary"
                  disabled={!data.name1 || data.name1.trim() === '' || !data.name2 || data.name2.trim() === ''}
                  outline
                  block
                  onClick={() => onChange('save')}
                >
                  Save To Server
                </Button>
              </div>
            </div>
          </Collapse>
        </div>
      </CPWrapper>
    );
  }
}

export default ControlPanel;
