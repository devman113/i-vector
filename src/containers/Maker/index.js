import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import axios from 'axios';

import Paper from 'utils/paper';
import App from 'containers/App';
import ImageGroup from 'components/ImageGroup';
import { IMAGE_GROUPS, DATA } from './constants';
import ControlPanel from './ControlPanel';
import Wrapper from './Wrapper';

class Fabric extends Component {
  state = {
    data: {}
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResizeStage);

    this.setState({ data: { ...DATA } });

    this.paper = new Paper('canvas');
    this.onResizeStage();

    Paper.Sprite.load('./images/shape.svg', sprite => {
      const { x, y, size } = DATA;
      this.shape = this.paper.add(sprite).set({
        ancor: [0.5, 0.5],
        x,
        y,
        width: size,
        height: size / sprite.image.naturalWidth * sprite.image.naturalHeight
      });

      this.text = this.paper.add(new Paper.Text()).set({
        align: 'center',
        x: this.paper.canvas.width / 2,
        y: this.paper.canvas.height / 2,
        fontname: DATA.fontname,
        fontsize: DATA.fontsize,
        textcolor: DATA.textcolor
      });
      this.text.text = DATA.text;
    });
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

        // update control data
        this.setState({
          data: {
            ...data,
            [name]: value,
            maxX: canvas.width,
            maxY: canvas.width,
            maxSize: canvas.width,
            maxFontSize: canvas.width / 4
          }
        });

        if (this.pattern) {
          this.updatePatternInfo();
        }

        this.text.set({
          x: canvas.width / 2,
          y: canvas.height / 2
        });

        this.paper.overlayImage = value.ref;
        this.paper.renderAll();
        return;
      }

      case IMAGE_GROUPS[1].folder:
        if (!this.pattern) {
          this.pattern = this.paper.add(new Paper.Sprite(), 0).set({ ancor: [0.5, 0.5] });
        }

        this.pattern.setImage(value.ref);
        this.updatePatternInfo();
        this.paper.renderAll();
        break;

      case IMAGE_GROUPS[2].folder:
        this.shape.set({ pattern: value.ref });
        this.paper.renderAll();
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
          this.shape.set({
            width: value,
            height: value / this.shape.image.naturalWidth * this.shape.image.naturalHeight
          });
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
          this.text.set({ fontname: value });
          this.paper.renderAll();
        }
        break;

      case 'fontsize':
        if (this.text) {
          this.text.set({ fontsize: value });
          this.paper.renderAll();
        }
        break;

      case 'textcolor':
        if (this.text) {
          this.text.set({ textcolor: value });
          this.paper.renderAll();
        }
        break;

      case 'reload':
        const { images } = IMAGE_GROUPS[2];
        if (this.shape && images) {
          const index = Math.floor(Math.random() * images.length);
          this.shape.set({ pattern: images[index].ref });
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
    this.shape.render({}, ctx);
    this.text.render({}, ctx);
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

  updatePatternInfo = () => {
    const { naturalWidth, naturalHeight } = this.pattern.image;
    const { width, height } = this.paper.canvas;
    const scale = Math.max(width / naturalWidth, height / naturalHeight);
    this.pattern.set({
      x: width / 2,
      y: height / 2,
      scaleX: scale,
      scaleY: scale
    });
  };

  render() {
    const { data, stageW, stageH } = this.state;

    return (
      <Wrapper stageW={stageW} stageH={stageH}>
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

export default Fabric;
