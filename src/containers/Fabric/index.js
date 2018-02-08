import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import axios from 'axios';

import Paper from 'utils/paper';
import App from 'containers/App';
import ImageGroup from 'components/ImageGroup';
import { IMAGE_GROUPS, DATA } from './constants';
import ControlPanel from './ControlPanel';
import Wrapper from './Wrapper';

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
    const { canvas } = this.paper;
    const cw = canvas.width;
    const ch = canvas.height;
    const ratio = cw / ch;

    let stageW = this.container.clientWidth - 80;
    let stageH = this.container.clientHeight - 80;
    if (ratio > stageW / stageH) {
      stageH = stageW / ratio;
    } else {
      stageW = stageH * ratio;
    }

    this.setState({ stageW, stageH });
  };

  onControl = (name, value) => {
    const { data } = this.state;
    const { canvas } = this.paper;

    switch (name) {
      case IMAGE_GROUPS[0].folder: {
        // update stage size
        canvas.width = value.ref.naturalWidth;
        canvas.height = value.ref.naturalHeight;
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
            render: ctx => {
              const { info, image } = this.pattern;
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
            height: value / this.pattern.image.naturalWidth * this.pattern.image.naturalHeight
          });
          this.paper.renderAll();
        }
        break;

      case 'save':
        this.saveImage();
        break;

      default:
    }

    this.setState({
      data: { ...data, [name]: value }
    });
  };

  saveImage = () => {
    this.saving = true;

    let image1 = this.paper.canvas.toDataURL('png');
    image1 = image1.replace('data:image/png;base64,', '');

    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('filename1', this.state.data.name1);

    let canvas = document.createElement('canvas');
    canvas.width = this.paper.canvas.width;
    canvas.height = this.paper.canvas.height;
    let ctx = canvas.getContext('2d');
    this.pattern.render({}, ctx);
    let image2 = canvas.toDataURL('png');
    image2 = image2.replace('data:image/png;base64,', '');

    formData.append('image2', image2);
    formData.append('filename2', this.state.data.name2);

    let url = `./save-images/`;
    if (process.env.NODE_ENV !== 'production') {
      url = `http://localhost/dev/save-images/`;
    }
    axios.post(url, formData).then(
      response => {
        this.saving = false;
        App.notificaionSystem.addNotification({
          message: 'Saved Successfully!',
          position: 'tc',
          level: 'success'
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    const { data, stageW, stageH } = this.state;

    return (
      <Wrapper stageW={stageW} stageH={stageH}>
        <Helmet>
          <title>Vector Image - Fabric</title>
        </Helmet>

        <ControlPanel data={data} onChange={this.onControl} />

        <main
          ref={ref => {
            this.container = ref;
          }}
        >
          <canvas id="canvas" width="0" />

          {stageW === 0 && (
            <div className="loading">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />Loading...
            </div>
          )}
        </main>

        <div className="image-panel">
          {IMAGE_GROUPS.map((group, index) => (
            <ImageGroup key={index} group={group} data={data} open={index === 0} onChange={this.onControl} />
          ))}
        </div>
      </Wrapper>
    );
  }
}

export default Maker;
