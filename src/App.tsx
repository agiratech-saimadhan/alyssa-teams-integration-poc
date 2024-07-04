import "./App.css";
import Container from "./components/container";
import BackgroundGradient from "./components/ui/background";

function App() {
  return (
    <main className="grid place-items-center h-screen w-full ">
      <div className="absolute -z-30 inset-0">
        <BackgroundGradient />
      </div>

      <Container />
    </main>
  );
}

export default App;
