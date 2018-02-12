import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';

import { DemoContainer, ImagePanel, ImageGroup, PopupLoading } from 'components';
import Paper from 'utils/paper';
import * as helper from 'utils/helper';
import Controls from './Controls';
import Preview from './Preview';
import { IMAGE_GROUPS, DATA } from './constants';

class Wood extends React.Component {
  state = {
    data: {}
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResizeStage);

    this.setState({ data: { ...DATA } });

    this.paper = new Paper('canvas');
    this.onResizeStage();

    Paper.Sprite.load(DATA.shapeUrl, sprite => {
      const { data } = this.state;

      this.shape = this.paper.add(sprite).set({
        size: data.size,
        pattern: this.pattern,
        render: () => {
          if (this.pattern) {
            const { ctx } = this.shape;
            const { width, height } = this.shape.info;
            const obj = this.shape.getPatternedCanvas(this.pattern);

            ctx.save();

            Object.assign(ctx, data);
            ctx.drawImage(obj, 832, 0, width, height);
            ctx.drawImage(obj, 580, 58, width, height);
            ctx.drawImage(obj, 448, 102, width, height);
            ctx.drawImage(obj, 320, 147, width, height);
            ctx.drawImage(obj, 192, 192, width, height);
            ctx.drawImage(obj, 768, 448, width, height);

            ctx.restore();
          }
        }
      });
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
        const { canvas } = this.paper;

        switch (name) {
          case IMAGE_GROUPS[0].folder: {
            canvas.width = value.ref.naturalWidth;
            canvas.height = value.ref.naturalHeight;
            this.onResizeStage();

            if (this.watermark) {
              this.watermark.set({ x: canvas.width, y: canvas.height });
            }

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

          case IMAGE_GROUPS[2].folder:
            if (!this.watermark) {
              this.watermark = this.paper
                .add(new Paper.Sprite(), 0)
                .set({ ancor: [1, 1], x: canvas.width, y: canvas.height });
            }

            this.watermark.setImage(value.ref);
            this.paper.renderAll();
            break;

          case IMAGE_GROUPS[3].folder:
            this.isolated = value.ref;
            break;

          case 'preview':
            this.setState({ preview: true });
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
    this.renderPreview(canvas);
    let image2 = canvas.toDataURL('png');

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

  closePreview = () => this.setState({ preview: false });

  renderPreview = canvas => {
    canvas.width = this.pattern.naturalWidth;
    canvas.height = this.pattern.naturalHeight;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    this.watermark.render({ x: width, y: height }, ctx);

    const { data } = this.state;
    const w = width * 0.8;
    const h = w * this.shape.ratio;
    const d = w / data.size;

    ctx.shadowOffsetX = data.shadowOffsetX * d;
    ctx.shadowOffsetY = data.shadowOffsetY * d;
    ctx.shadowBlur = data.shadowBlur * d;
    ctx.shadowColor = DATA.shadowColor;

    const obj = this.shape.getPatternedCanvas(this.isolated);

    ctx.drawImage(obj, (width - w) / 2, (height - h) / 2, w, h);
  };

  render() {
    const { data, stageW, stageH, label, progress, preview } = this.state;

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

        {preview && <Preview render={this.renderPreview} onClose={this.closePreview} />}
        {progress && <PopupLoading label={label} progress={progress} />}
      </DemoContainer>
    );
  }
}

export default Wood;
