import { Navbar, Welcome, Service, Transaction } from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Service />
    <Transaction />
  </div>
);

export default App;
