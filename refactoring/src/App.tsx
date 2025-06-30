import './App.css';
import './legacy.css';

// Komponenten-Shells
function Header() {
  return (
    <header id="banner" className="body">
      <h1><a href="#">InteractiVenn</a></h1>
      <nav>
        <ul>
          <li><a href="#tree">Unions by tree</a></li>
          <li className="active"><a href="#list">Unions by list</a></li>
          <li><a href="#citation">Citation</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#help">Help</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Controls() {
  // Platzhalter für alle Steuerelemente (Set-Eingaben, Buttons, etc.)
  return (
    <aside id="controls">
      {/* TODO: Set-Eingaben, Farben, Buttons, Import/Export, etc. */}
      <p>Controls folgen ...</p>
    </aside>
  );
}

function Visualization() {
  // Platzhalter für das SVG-Diagramm
  return (
    <section id="visualization">
      {/* TODO: SVG-Diagramm, Interaktivität, etc. */}
      <svg id="diagram" width="600" height="578"></svg>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contentinfo" className="body">
      <address id="about" className="vcard body">
        <a href="http://vicg.icmc.usp.br/infovis2/InfoVis2">
          <img src="legacy/web/images/vicg.png" alt="VICG - Visualization, Imaging and Computer Graphics" width="234" height="30" className="photo" />
        </a>
      </address>
    </footer>
  );
}

function App() {
  // State-Management für Sets, Farben, Diagramm, etc. folgt ...
  return (
    <div>
      <Header />
      <main>
        <Controls />
        <Visualization />
      </main>
      <Footer />
    </div>
  );
}

export default App;
