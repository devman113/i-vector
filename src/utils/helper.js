import axios from 'axios';
import App from 'containers/App';

export const calcStageSize = (canvas, container) => {
  const cw = canvas.width;
  const ch = canvas.height;
  const ratio = cw / ch;

  let stageW = container.clientWidth - 80;
  let stageH = container.clientHeight - 80;
  if (ratio > stageW / stageH) {
    stageH = stageW / ratio;
  } else {
    stageW = stageH * ratio;
  }

  return { stageW, stageH };
};

export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const uploadImages = (images, onUploadProgress, onComplte) => {
  const formData = new FormData();
  Object.keys(images).forEach(name => {
    formData.append(name, dataURLtoFile(images[name], name));
  });

  let url = `./save-images/`;
  if (process.env.NODE_ENV !== 'production') {
    url = `http://localhost/dev/save-images/`;
  }

  return axios.post(url, formData, { onUploadProgress }).then(
    response => {
      onComplte();
    },
    error => {
      console.log(error);
    }
  );
};

export const showNtification = msg => {
  App.notificaionSystem.addNotification({
    message: msg,
    position: 'tc',
    level: 'success'
  });
};
