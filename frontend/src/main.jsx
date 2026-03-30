import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import {store} from "./app/store";
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <App>
        <RouterProvider router={router}/>
      </App>
    </Provider>

)
