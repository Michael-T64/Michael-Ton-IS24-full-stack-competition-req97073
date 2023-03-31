import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './client/Home';
import Header from './components/Header';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Header />
                <div className="main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
