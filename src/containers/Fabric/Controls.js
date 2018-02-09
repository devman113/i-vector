import React from 'react';
import { Button, Collapse, Label, Input } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt';

import { CollapseHeader, ControlPanel } from 'components';

const SliderWithTooltip = createSliderWithTooltip(Slider);

class Controls extends React.PureComponent {
  state = {
    pattern: true,
    save: true
  };

  toggle = group => this.setState({ [group]: !this.state[group] });

  render() {
    const { onChange, data } = this.props;

    return (
      <ControlPanel>
        <div className="text-right">
          <Button color="link" onClick={() => onChange('reload')}>
            <FontAwesomeIcon icon={faSyncAlt} />
            Reload
          </Button>
        </div>

        <div className="block">
          <CollapseHeader label="Pattern" open={this.state.pattern} onClick={() => this.toggle('pattern')} />
          <Collapse isOpen={this.state.pattern}>
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
                <Label>Image Name3</Label>
                <Input value={data.name3 || ''} onChange={e => onChange('name3', e.target.value)} />
              </div>

              <div className="control">
                <Button
                  color="primary"
                  disabled={
                    !data.name1 ||
                    data.name1.trim() === '' ||
                    !data.name2 ||
                    data.name2.trim() === '' ||
                    !data.name3 ||
                    data.name3.trim() === ''
                  }
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
      </ControlPanel>
    );
  }
}

export default Controls;
