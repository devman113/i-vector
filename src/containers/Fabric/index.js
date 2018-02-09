import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';

import { DemoContainer, ImagePanel, ImageGroup, PopupLoading } from 'components';
import Paper from 'utils/paper';
import * as helper from 'utils/helper';
import Controls from './Controls';
import { IMAGE_GROUPS, DATA } from './constants';

class Maker extends Component {
  state = {
    data: {}
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResizeStage);

    this.setState({ data: { ...DATA } });

    this.paper = new Paper('canvas');
    this.onResizeStage();
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

            this.paper.overlayImage = value.ref;
            this.paper.renderAll();
            break;
          }

          case IMAGE_GROUPS[1].folder:
            const { naturalWidth, naturalHeight } = value.ref;

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
                height: data.pSize / naturalWidth * naturalHeight,
                render: (info, ctx) => {
                  const { image } = this.pattern;
                  const { width, height } = info;
                  let y = -info.y;
                  while (y < canvas.height) {
                    let x = -info.x;
                    while (x < canvas.width) {
                      ctx.drawImage(image, x, y, width, height);
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
              this.pattern.set({
                width: value,
                height: value * this.pattern.ratio
              });
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
    let image1 = this.paper.canvas.toDataURL('png');

    let canvas = document.createElement('canvas');
    canvas.width = this.paper.canvas.width;
    canvas.height = this.paper.canvas.height;
    let ctx = canvas.getContext('2d');
    this.pattern.render({}, ctx);
    let image3 = canvas.toDataURL('png');

    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(this.paper.overlayImage, 0, 0);
    let image2 = canvas.toDataURL('png');

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
        <Helmet>
          <title>Vector Image - Fabric</title>
        </Helmet>

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
