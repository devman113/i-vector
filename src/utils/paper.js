export default class Paper {
  canvas = null;
  ctx = null;

  backgroundColor = null;
  backgroundImage = null;
  overlayImage = null;
  objects = [];

  constructor(id) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  add = (obj, index) => {
    if (index === undefined) {
      this.objects.push(obj);
    } else {
      this.objects.splice(index, 0, obj);
    }
    obj.ctx = this.ctx;
    return obj;
  };

  renderAll = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.backgroundColor) {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    this.objects.forEach(obj => {
      (obj.info.render || obj.render)();
    });

    if (this.overlayImage) {
      this.ctx.drawImage(this.overlayImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  };
}

class PaperObject {
  ctx = null;
  info = { x: 0, y: 0 };

  set = info => {
    Object.assign(this.info, info);
    const { size } = info;
    if (size) {
      this.info.width = size;
      this.info.height = size * this.ratio;
    }
    return this;
  };
}

class Sprite extends PaperObject {
  image = null;

  constructor() {
    super();
    Object.assign(this.info, { ancor: [0, 0] });
  }

  setImage = image => {
    this.image = image;
    this.info.width = this.info.width || image.naturalWidth;
    this.info.height = this.info.height || image.naturalHeight;
    this.ratio = image.naturalHeight / image.naturalWidth;
  };

  getPatternedCanvas = pattern => {
    let canvas = document.createElement('canvas');
    if (this.ratio < 1) {
      canvas.width = pattern.naturalWidth;
      canvas.height = pattern.naturalWidth * this.ratio;
    } else {
      canvas.width = pattern.naturalHeight / this.ratio;
      canvas.height = pattern.naturalHeight;
    }

    let contenxt = canvas.getContext('2d');
    contenxt.drawImage(pattern, (canvas.width - pattern.naturalWidth) / 2, (canvas.height - pattern.naturalHeight) / 2);

    contenxt.globalCompositeOperation = 'destination-in';
    contenxt.drawImage(this.image, 0, 0, canvas.width, canvas.height);

    return canvas;
  };

  render = (info, ctx) => {
    ctx = ctx || this.ctx;
    if (!ctx || !this.image) return;

    info = Object.assign({}, this.info, info);

    const { x, y, width, height, scaleX, scaleY, rotate, ancor, pattern } = info;

    ctx.save();

    Object.assign(ctx, info);

    ctx.translate(x, y);

    if (scaleX || scaleY) {
      ctx.scale(scaleX || 1, scaleY || 1);
    }

    if (rotate) {
      ctx.rotate(rotate);
    }

    let obj;
    if (pattern) {
      obj = this.getPatternedCanvas(pattern);
    } else {
      obj = this.image;
    }

    ctx.drawImage(obj, -width * ancor[0], -height * ancor[1], width, height);

    ctx.restore();
  };
}

Sprite.load = (url, callback) => {
  const image = new Image();
  image.onload = () => {
    const sprite = new Sprite();
    sprite.setImage(image);
    callback && callback(sprite);
  };
  image.src = url;
};

class Text extends PaperObject {
  text = '';

  constructor() {
    super();
    Object.assign(this.info, { textBaseline: 'middle' });
  }

  render = (info, ctx) => {
    ctx = ctx || this.ctx;
    if (!ctx || !this.text) return;

    info = Object.assign({}, this.info, info);

    const { x, y, scaleX, scaleY, rotate } = info;

    ctx.save();

    Object.assign(ctx, info);

    ctx.translate(x, y);

    if (scaleX || scaleY) {
      ctx.scale(scaleX || 1, scaleY || 1);
    }

    if (rotate) {
      ctx.rotate(rotate);
    }

    const fontsize = parseInt(ctx.font, 10);
    const arr = this.text.split('\n');
    let ty = 0;
    if (ctx.textBaseline === 'middle') {
      ty = -(arr.length - 1) * fontsize * 0.5;
    } else if (ctx.textBaseline === 'bottom' || ctx.textBaseline === 'alphabetic') {
      ty = -(arr.length - 1) * fontsize;
    }

    arr.forEach(text => {
      ctx.fillText(text, 0, ty);
      ty += fontsize;
    });

    ctx.restore();
  };
}

Paper.Sprite = Sprite;
Paper.Text = Text;
