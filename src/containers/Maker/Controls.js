import React from 'react';
import { Button, Collapse, Label, Input } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import Textarea from 'react-textarea-autosize';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt';

import { CollapseHeader, ControlPanel, FontSelect, ColorPicker } from 'components';

const SliderWithTooltip = createSliderWithTooltip(Slider);

class Controls extends React.PureComponent {
  state = {
    shape: true,
    text: true,
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
          <CollapseHeader label="Shape" open={this.state.shape} onClick={() => this.toggle('shape')} />
          <Collapse isOpen={this.state.shape}>
            <div className="controls">
              <div className="control">
                <Label>Position X</Label>
                <SliderWithTooltip
                  min={0}
                  max={data.maxX}
                  value={data.x}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('x', v)}
                />
              </div>

              <div className="control">
                <Label>Position Y</Label>
                <SliderWithTooltip
                  min={0}
                  max={data.maxY}
                  value={data.y}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('y', v)}
                />
              </div>

              <div className="control">
                <Label>Iamge Size</Label>
                <SliderWithTooltip
                  min={1}
                  max={data.maxSize}
                  value={data.size}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('size', v)}
                />
              </div>
            </div>
          </Collapse>
        </div>

        <div className="block">
          <CollapseHeader label="Text" open={this.state.text} onClick={() => this.toggle('text')} />
          <Collapse isOpen={this.state.text}>
            <div className="controls">
              <div className="control">
                <Textarea minRows={2} value={data.text} onChange={e => onChange('text', e.target.value)} />
              </div>

              <div className="control">
                <label>Font Name</label>
                <FontSelect value={data.fontname} onChange={font => onChange('fontname', font.name)} />
              </div>

              <div className="control">
                <label>Font Size</label>
                <SliderWithTooltip
                  min={6}
                  max={data.maxFontSize}
                  value={data.fontsize}
                  tipFormatter={value => `${value}`}
                  onChange={v => onChange('fontsize', v)}
                />
              </div>

              <div className="control color-picker">
                <Label>Color</Label>
                <ColorPicker color={data.textcolor} onChange={e => onChange('textcolor', e.hex)} />
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
      </ControlPanel>
    );
  }
}

export default Controls;
