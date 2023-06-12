import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./assets/css/responsive.css"

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./components/loader/Loader";
//https://store-ndn.herokuapp.com/
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loader/>} persistor={persistor}>
      <App/>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(<App />)
