import Navbar from './Navbar';
const ApplicationContainer = ({children}) => {
  return (
    <>
        <header className="App-header"
              style={{position: 'absolute', textAlign: 'center', zIndex: 1, right: 10, top: 10}}
        >
            <h1>VTR.js</h1>
            <Navbar/>
        </header>
        <main>
            <div className="wrapper">
                {children}
            </div>
        </main>
    </>
  );
};

export default ApplicationContainer;
