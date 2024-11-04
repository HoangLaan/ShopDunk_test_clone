import React from 'react';

import AppRouter from 'routers/AppRouter/AppRouter';
import { store } from 'store';
import { Provider } from 'react-redux';
import { AuthProvider } from 'context/AuthProvider';
import { MqttProvider } from 'context/MqttProvider';
import { ToastContainer } from 'react-toastify';
import 'assets/bw_scss/blackwind.scss';
import 'assets/bw_scss/main.css';
import 'styles/App.css';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from 'components/shared/ConfirmDeleteModal';

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <MqttProvider>
        <AppRouter />
        <ToastContainer />
        <ConfirmModal />
        <div id='bw_modal_root'></div>
      </MqttProvider>
    </AuthProvider>
  </Provider>
);
export default App;
