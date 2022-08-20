import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import EditorPage from './views/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <div className="App">
      <div>
        <Toaster 
        position='top-right'
        >
        </Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
