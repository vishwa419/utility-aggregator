import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default MyApp;
