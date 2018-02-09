import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import NotificationSystem from 'react-notification-system';

import { FONTS } from 'components/FontSelect';
import Maker from './Maker';
import Fabric from './Fabric';

class App extends Component {
  render() {
    return (
      <div>
        <Helmet>
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

        <Maker />
        {/* <Fabric /> */}

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
