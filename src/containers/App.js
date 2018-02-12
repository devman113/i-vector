import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import NotificationSystem from 'react-notification-system';

import { FONTS } from 'components/FontSelect';
import Maker from './Maker';
import Fabric from './Fabric';
import Card from './Card';
import Wood from './Wood';

const pages = {
  maker: <Maker />,
  fabric: <Fabric />,
  card: <Card />,
  wood: <Wood />
};

class App extends Component {
  render() {
    const pageName = (process.env.PUBLIC_URL || process.env.REACT_APP_PUBLIC_URL).replace('/', '');
    const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    return (
      <div>
        <Helmet>
          <title>Vector Image - {title}</title>
          {FONTS.map(
            ({ name, google }, index) =>
              google && (
                <link
                  key={index}
                  href={`https://fonts.googleapis.com/css?family=${name}`}
                  rel="stylesheet"
                  type="text/css"
                />
              )
          )}
        </Helmet>

        {pages[pageName]}

        <NotificationSystem
          ref={ref => {
            App.notificaionSystem = ref;
          }}
        />
      </div>
    );
  }
}

export default App;
