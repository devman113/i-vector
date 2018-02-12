import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';

import { DemoContainer, ImagePanel, ImageGroup, PopupLoading } from 'components';
import Paper from 'utils/paper';
import * as helper from 'utils/helper';
import Controls from './Controls';
import { IMAGE_GROUPS, DATA } from './constants';

class Card extends Component {
  state = {
    data: {}
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResizeStage);

    this.setState({ data: { ...DATA } });

    this.paper = new Paper('canvas');
    this.onResizeStage();

    Paper.Sprite.load(DATA.shapeUrl, sprite => {
      const { x, size, tx, ty, fontname, fontsize, textcolor, text, direction, padding } = this.state.data;

      this.shape = this.paper.add(sprite).set({
        ancor: [0.5, 0.5],
        x,
        size,
        pattern: this.pattern
      });
      this.updateShapeY();

      this.text = this.paper.add(new Paper.Text()).set({
        textAlign: 'center',
        textBaseline: direction,
        x: tx,
        y: ty[direction] + (direction === 'top' ? padding : -padding),
        font: `${fontsize}px ${fontname}`,
        fillStyle: textcolor
      });
      this.text.text = text;
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeStage);
  }

  onResizeStage = () => {
    const stageSize = helper.calcStageSize(this.paper.canvas, this.container);
    this.setState({ ...stageSize });
  };

  onControl = (name, value) => {
    this.setState(
      {
        data: { ...this.state.data, [name]: value }
      },
      () => {
        const { data } = this.state;
        const { canvas } = this.paper;

        switch (name) {
          case IMAGE_GROUPS[0].folder: {
            canvas.width = value.ref.naturalWidth;
            canvas.height = value.ref.naturalHeight;
            this.onResizeStage();

            this.paper.backgroundImage = value.ref;
            this.paper.renderAll();
            break;
          }

          case IMAGE_GROUPS[1].folder:
            this.pattern = value.ref;
            if (this.shape) {
              this.shape.set({ pattern: this.pattern });
              this.paper.renderAll();
            }
            break;

          case 'x':
            if (this.shape) {
              this.shape.set({ x: value });
              this.paper.renderAll();
            }
            break;

          case 'y':
            if (this.shape) {
              this.shape.set({ y: value });
              this.paper.renderAll();
            }
            break;

          case 'size':
            if (this.shape) {
              this.shape.set({ size: value });
              this.paper.renderAll();
            }
            break;

          case 'text':
            if (this.text) {
              this.text.text = value;
              this.updateShapeY();
              this.paper.renderAll();
            }
            break;

          case 'fontname':
            if (this.text) {
              this.text.set({ font: `${data.fontsize}px ${value}` });
              this.paper.renderAll();
            }
            break;

          case 'fontsize':
            if (this.text) {
              this.text.set({ font: `${value}px ${data.fontname}` });
              this.updateShapeY();
              this.paper.renderAll();
            }
            break;

          case 'textcolor':
            if (this.text) {
              this.text.set({ fillStyle: value });
              this.paper.renderAll();
            }
            break;

          case 'direction':
            if (this.text) {
              this.text.set({
                textBaseline: value,
                y: DATA.ty[value] + (value === 'top' ? data.padding : -data.padding)
              });
              this.updateShapeY();
              this.paper.renderAll();
            }
            break;

          case 'padding':
            if (this.text) {
              this.text.set({
                y: DATA.ty[data.direction] + (data.direction === 'top' ? value : -value)
              });
              this.updateShapeY();
              this.paper.renderAll();
            }
            break;

          case 'reload':
            const { images } = IMAGE_GROUPS[1];
            if (this.shape && images) {
              const index = Math.floor(Math.random() * images.length);
              this.onControl(IMAGE_GROUPS[1].folder, images[index]);
            }
            break;

          case 'save':
            this.saveImage();
            break;

          default:
        }
      }
    );
  };

  updateShapeY = () => {
    const { data } = this.state;
    const d = data.text ? (data.padding + data.fontsize) / 2 : 0;
    const y = data.y + (data.direction === 'top' ? d : -d);
    this.shape.set({ y });
  };

  saveImage = () => {
    const image1 = this.paper.canvas.toDataURL('png');

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    this.shape.render({ x: this.shape.info.x - 160, y: this.shape.info.y - 380 }, ctx);
    this.text.render({ x: this.text.info.x - 160, y: this.text.info.y - 380 }, ctx);
    const image2 = canvas.toDataURL('png');

    helper.uploadImages(
      {
        [this.state.data.name1]: image1,
        [this.state.data.name2]: image2
      },
      progress => {
        this.setState({ label: 'Uploading...', progress: Math.floor(progress.loaded / progress.total * 100) });
      },
      () => {
        this.setState({ progress: null });
        helper.showNtification('Saved Successfully!');
      }
    );
  };

  render() {
    const { data, stageW, stageH, label, progress } = this.state;

    return (
      <DemoContainer>
        <Controls data={data} onChange={this.onControl} />

        <main
          ref={ref => {
            this.container = ref;
          }}
        >
          <canvas id="canvas" width="0" style={{ width: `${stageW}px`, height: `${stageH}px` }} />

          {stageW === 0 && (
            <div className="loading">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />Loading...
            </div>
          )}
        </main>

        <ImagePanel>
          {IMAGE_GROUPS.map((group, index) => (
            <ImageGroup key={index} group={group} data={data} open={index === 0} onChange={this.onControl} />
          ))}
        </ImagePanel>

        {progress && <PopupLoading label={label} progress={progress} />}
      </DemoContainer>
    );
  }
}

export default Card;
