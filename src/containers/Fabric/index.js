import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';

import { DemoContainer, ImagePanel, ImageGroup, PopupLoading } from 'components';
import Paper from 'utils/paper';
import * as helper from 'utils/helper';
import Controls from './Controls';
import { IMAGE_GROUPS, DATA } from './constants';

class Maker extends React.Component {
  state = {
    data: {}
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResizeStage);

    this.setState({ data: { ...DATA } });

    this.paper = new Paper('canvas');
    this.onResizeStage();

    const ruler = new Image();
    ruler.onload = () => {
      this.paper.overlayImage = ruler;
    };
    ruler.src = DATA.rulerUrl;
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
            const image = value.ref;
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            this.onResizeStage();

            if (!this.bg) {
              this.bg = this.paper.add(new Paper.Sprite());
            }
            this.bg.setImage(image);
            this.bg.set({ width: canvas.width, height: canvas.height });

            this.paper.renderAll();
            break;
          }

          case IMAGE_GROUPS[1].folder:
            const { naturalWidth } = value.ref;

            // update control data
            this.setState({
              data: {
                ...data,
                [name]: value,
                maxPX: naturalWidth,
                maxPY: naturalWidth,
                minPSize: naturalWidth / 25,
                maxPSize: naturalWidth
              }
            });

            if (!this.pattern) {
              this.pattern = this.paper.add(new Paper.Sprite(), 0).set({
                x: data.px,
                y: data.py,
                width: data.pSize,
                height: data.pSize / naturalWidth * value.ref.naturalHeight,
                render: (info, ctx) => {
                  ctx = ctx || this.pattern.ctx;
                  info = Object.assign({}, this.pattern.info, info);
                  const { width, height } = info;

                  let y = -info.y;
                  while (y < ctx.canvas.height) {
                    let x = -info.x;
                    while (x < ctx.canvas.width) {
                      ctx.drawImage(this.pattern.image, x, y, width, height);
                      x += width;
                    }
                    y += height;
                  }
                }
              });
            }

            this.pattern.setImage(value.ref);
            this.paper.renderAll();
            return;

          case 'px':
            if (this.pattern) {
              this.pattern.set({ x: value });
              this.paper.renderAll();
            }
            break;

          case 'py':
            if (this.pattern) {
              this.pattern.set({ y: value });
              this.paper.renderAll();
            }
            break;

          case 'pSize':
            if (this.pattern) {
              this.pattern.set({ size: value });
              this.paper.renderAll();
            }
            break;

          case 'reload':
            const { images } = IMAGE_GROUPS[1];
            if (this.pattern && images) {
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

  saveImage = () => {
    const image1 = this.paper.canvas.toDataURL('png');

    const canvas = document.createElement('canvas');
    canvas.width = this.paper.canvas.width;
    canvas.height = this.paper.canvas.height;
    const ctx = canvas.getContext('2d');

    this.pattern.info.render({}, ctx);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(this.bg.image, 0, 0);
    const image2 = canvas.toDataURL('png');

    ctx.globalCompositeOperation = 'source-over';
    this.pattern.info.render({}, ctx);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillRect((canvas.width - 1500) / 2, (canvas.height - 1500) / 2, 1500, 1500);
    const image3 = canvas.toDataURL('png');

    helper.uploadImages(
      {
        [this.state.data.name1]: image1,
        [this.state.data.name2]: image2,
        [this.state.data.name3]: image3
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

export default Maker;
