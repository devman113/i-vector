import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import axios from 'axios';

import Paper from 'utils/paper';
import { dataURLtoFile } from 'utils/helper';
import App from 'containers/App';
import ImageGroup from 'components/ImageGroup';
import PopupLoading from 'components/PopupLoading';
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
    this.setState({ saving: true });

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

    const formData = new FormData();
    formData.append('file1', dataURLtoFile(image1, this.state.data.name1));
    formData.append('file2', dataURLtoFile(image2, this.state.data.name2));
    formData.append('file3', dataURLtoFile(image3, this.state.data.name3));

    let url = `./save-images/`;
    if (process.env.NODE_ENV !== 'production') {
      url = `http://localhost/dev/save-images/`;
    }
    axios
      .post(url, formData, {
        onUploadProgress: progress => {
          this.setState({ progress: Math.floor(progress.loaded / progress.total * 100) });
        }
      })
      .then(
        response => {
          this.setState({ progress: null });
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
    const { data, stageW, stageH, progress } = this.state;

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

        {progress && <PopupLoading label="Uploading..." progress={progress} />}
      </Wrapper>
    );
  }
}

export default Maker;
