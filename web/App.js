import { Diagram } from './components/Diagram.js';

export function App() {
  const element = React.createElement;

  const [activePage, setActivePage] = React.useState("list");
  
  React.useEffect(() => {
    const path = window.location.href;

    if (path.includes("index2.html")) {
      setActivePage("tree");
    }
  }, []);

  return (
    element(
      'div', 
      null, 
      Diagram({ type: activePage }),
    )
  );
}