import VtkExample from "./components/VtkExample";
import VtkExample2 from "./components/VtkExample2";
import ApplicationContainer from './components/ApplicationContainer'
import {Navigate, Route, Routes} from 'react-router-dom';

function App() {
    const wrapRouteComponent = (component) => (
        <ApplicationContainer>
            {component}
        </ApplicationContainer>
    );
  return (
      <Routes>
          <Route path="/" element={<Navigate to="/tools-1"/>}/>
          <Route path="/tools-1" element={wrapRouteComponent(<VtkExample/>)}/>
          <Route path="/tools-2" element={wrapRouteComponent(<VtkExample2/>)}/>
      </Routes>
  );
}

export default App;
