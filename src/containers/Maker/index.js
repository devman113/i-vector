import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';

import { DemoContainer, ImagePanel, ImageGroup, PopupLoading } from 'components';
import Paper from 'utils/paper';
import * as helper from 'utils/helper';
import Controls from './Controls';
import { IMAGE_GROUPS, DATA } from './constants';

class Fabric extends Component {
  state = {
    data: {}
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResizeStage);

    this.setState({ data: { ...DATA } });

    this.paper = new Paper('canvas');
    this.onResizeStage();

    Paper.Sprite.load(DATA.shapeUrl, sprite => {
      const { x, y, size, fontname, fontsize, textcolor, text } = DATA;

      this.shape = this.paper.add(sprite).set({
        ancor: [0.5, 0.5],
        x,
        y,
        size,
        pattern: this.pattern
      });

      this.text = this.paper.add(new Paper.Text()).set({
        textAlign: 'center',
        x: this.paper.canvas.width / 2,
        y: this.paper.canvas.height / 2,
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
            const { naturalWidth, naturalHeight } = value.ref;

            // update stage size
            canvas.width = naturalWidth;
            canvas.height = naturalHeight;
            this.onResizeStage();

            this.setState({
              data: {
                ...data,
                maxX: naturalWidth,
                maxY: naturalWidth,
                maxSize: naturalWidth,
                maxFontSize: naturalWidth / 4
              }
            });

            this.text.set({
              x: naturalWidth / 2,
              y: naturalHeight / 2
            });

            this.paper.overlayImage = value.ref;
            this.paper.renderAll();
            break;
          }

          case IMAGE_GROUPS[1].folder:
            this.paper.backgroundImage = value.ref;
            this.paper.renderAll();
            break;

          case IMAGE_GROUPS[2].folder:
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
              this.paper.renderAll();
            }
            break;

          case 'textcolor':
            if (this.text) {
              this.text.set({ fillStyle: value });
              this.paper.renderAll();
            }
            break;

          case 'reload':
            const { images } = IMAGE_GROUPS[2];
            if (this.shape && images) {
              const index = Math.floor(Math.random() * images.length);
              this.onControl(IMAGE_GROUPS[2].folder, images[index]);
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

  saveImage = () => {
    const image1 = this.paper.canvas.toDataURL('png');

    const canvas = document.createElement('canvas');
    canvas.width = this.paper.canvas.width;
    canvas.height = this.paper.canvas.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.paper.backgroundImage, 0, 0, canvas.width, canvas.height);
    this.shape.render({}, ctx);
    this.text.render({}, ctx);
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

export default Fabric;
