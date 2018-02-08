import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import App from 'containers/App';
import './bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'react-select/dist/react-select.css';
import 'fonts/fonts.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
