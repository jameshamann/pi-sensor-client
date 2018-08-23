import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { withAuthenticator } from 'aws-amplify-react'

const AppWithAuth = withAuthenticator(App, true);

const federated = {
  google_client_id: '971008465059-ngv19hau4la5jesguoub021k27sm3lq6.apps.googleusercontent.com',
};

ReactDOM.render(<AppWithAuth federated={federated}/>, document.getElementById('root'));
registerServiceWorker();
