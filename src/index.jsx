import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Wrap from './wrap';

const rootEl = document.getElementById('root');

// if (DEBUG) {
//   ReactDOM.render(
//     (<AppContainer><Wrap /></AppContainer>), rootEl
//   );
//   if (module.hot) {
//     module.hot.accept('./wrap', () => {
//       const NextApp = require('./wrap').default;
//       ReactDOM.render(
//         <AppContainer>
//           <NextApp />
//         </AppContainer>,
//         rootEl
//       );
//     });
//   }
// } else {
//   ReactDOM.render(<Wrap />, rootEl);
// }
if (DEBUG) {
  const render = (Component) => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      rootEl,
    );
  };
  render(Wrap);
  if (module.hot) {
    module.hot.accept('./wrap', () => {render(Wrap)})
  }
} else {
  ReactDOM.render(<Wrap />, rootEl);
}
