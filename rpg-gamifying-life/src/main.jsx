import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.jsx'
import Favicon from 'react-favicon';
import Logo from '../public/images/marca.svg'

import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <Favicon url={Logo}/>
    <App />
    </QueryClientProvider>
)
