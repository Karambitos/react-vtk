import VtkExample from "./components/VtkExample";
import VtkExample2 from "./components/VtkExample2";

function App() {
  return (
    <div className="App">
      <header className="App-header"
              style={{position: 'relative', textAlign: 'center', zIndex: 1000}}
      >
          <h1>VTR.js</h1>
      </header>
        <main>
            <VtkExample2/>
            {/*<VtkExample/>*/}
        </main>
    </div>
  );
}

export default App;
