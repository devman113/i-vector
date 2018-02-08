import React from 'react';
import { Collapse } from 'reactstrap';
import CollapseHeader from 'components/CollapseHeader';
import axios from 'axios';

import Wrapper from './Wrapper';

class ImageGroup extends React.PureComponent {
  state = {
    open: false,
    images: []
  };

  componentWillMount() {
    const { folder, random } = this.props.group;

    let url = `./images/`;
    if (process.env.NODE_ENV !== 'production') {
      url = `http://localhost/dev/images/`;
    }

    return axios.get(`${url}?folder=${folder}`).then(
      response => {
        const images = response.data.map(file => ({ url: `./images/${folder}/${file}` }));
        this.setState({ images, open: this.props.open }, () => {
          this.indexes = images.map((_, index) => index);
          const i = random ? Math.floor(Math.random() * this.indexes.length) : 0;
          this.loadImage(i);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  loadImage = i => {
    let images = this.state.images;
    const index = this.indexes.splice(i, 1)[0];
    const image = images[index];
    image.ref.onload = () => {
      if (!this.props.data[this.props.group.folder]) {
        this.onSelectImage(image);
      }

      images = images.slice(0);
      images[index] = { ...images[index], isLoaded: true };
      this.setState({ images });
      this.props.group.images = images;

      if (this.indexes.length) {
        this.loadImage(0);
      }
    };
    image.ref.src = image.url;
  };

  toggle = () => this.setState({ open: !this.state.open });

  onSelectImage = selectedImage => this.props.onChange(this.props.group.folder, selectedImage);

  render() {
    const { group, data } = this.props;
    const { images, open } = this.state;
    const selectedImage = data[group.folder];

    return (
      <Wrapper>
        <CollapseHeader label={group.label} open={open} onClick={this.toggle} />
        <Collapse isOpen={open}>
          <div className="images">
            {images.map((image, index) => (
              <div className="image-file" key={index}>
                <img
                  alt=""
                  ref={ref => {
                    image.ref = ref;
                  }}
                />
                <span
                  className={`${image.isLoaded ? 'mask' : 'spinner'} ${
                    (selectedImage || {}).url === image.url ? 'selected' : ''
                  }`}
                  onClick={() => this.onSelectImage(image)}
                />
              </div>
            ))}
          </div>
        </Collapse>
      </Wrapper>
    );
  }
}

export default ImageGroup;
