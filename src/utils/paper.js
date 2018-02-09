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
      obj.render();
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

  render = (info, ctx) => {
    ctx = ctx || this.ctx;
    if (!ctx || !this.image) return;

    info = Object.assign({}, this.info, info);

    if (this.info.render) {
      this.info.render(info, ctx);
      return;
    }

    const { ancor, x, y, width, height, scaleX, scaleY, rotate, shadow, alpha, operation, pattern } = info;

    ctx.save();

    ctx.translate(x, y);

    if (rotate) {
      ctx.rotate(rotate);
    }

    if (scaleX || scaleY) {
      ctx.scale(scaleX || 1, scaleY || 1);
    }

    if (alpha) {
      ctx.globalAlpha = alpha;
    }

    if (shadow) {
      ctx.shadowOffsetX = shadow.offsetX;
      ctx.shadowOffsetY = shadow.offsetY;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowColor = shadow.color;
    }

    if (operation) {
      ctx.globalCompositeOperation = operation;
    }

    let obj;
    if (pattern) {
      let canvas = document.createElement('canvas');
      canvas.width = this.image.naturalWidth;
      canvas.height = this.image.naturalHeight;

      let contenxt = canvas.getContext('2d');
      contenxt.drawImage(this.image, 0, 0);

      const scale = Math.max(canvas.width / pattern.naturalWidth, canvas.height / pattern.naturalHeight);
      contenxt.scale(scale, scale);

      contenxt.globalCompositeOperation = 'source-in';
      contenxt.drawImage(pattern, 0, 0);

      obj = canvas;
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

  render = (info, ctx) => {
    ctx = ctx || this.ctx;
    if (!ctx || !this.text) return;

    info = Object.assign({}, this.info, info);

    if (this.info.render) {
      this.info.render(ctx, info);
      return;
    }

    const { align, x, y, scaleX, scaleY, rotate, shadow, alpha, operation } = info;

    ctx.save();

    ctx.translate(x, y);

    if (rotate) {
      ctx.rotate(rotate);
    }

    if (scaleX || scaleY) {
      ctx.scale(scaleX || 1, scaleY || 1);
    }

    if (alpha) {
      ctx.globalAlpha = alpha;
    }

    if (shadow) {
      ctx.shadowOffsetX = shadow.offsetX;
      ctx.shadowOffsetY = shadow.offsetY;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowColor = shadow.color;
    }

    if (operation) {
      ctx.globalCompositeOperation = operation;
    }

    if (align) {
      ctx.textAlign = align;
    }

    ctx.font = `${info.fontsize}px ${info.fontname}`;
    ctx.fillStyle = info.textcolor;

    const arr = this.text.split('\n');
    let ty = -arr.length * info.fontsize * 0.42;
    arr.forEach(text => {
      ctx.fillText(text, 0, ty);
      ty += info.fontsize;
    });

    ctx.restore();
  };
}

Paper.Sprite = Sprite;
Paper.Text = Text;
