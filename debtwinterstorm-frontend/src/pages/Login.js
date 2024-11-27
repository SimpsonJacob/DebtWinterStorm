import "./Login.css";
import logo from './snow-transparent-snowflakes-1.png';

function Login() {

return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click to Start
        </a>
      </header>
    </div>
  );
}

export default Login