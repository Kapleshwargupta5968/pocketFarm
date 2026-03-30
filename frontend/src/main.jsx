import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import {store} from "./app/store";
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <App>
        <RouterProvider router={router}/>
      </App>
      <ToastContainer />
    </Provider>

)
