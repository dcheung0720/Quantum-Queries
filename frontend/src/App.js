import logo from './logo.svg';
import './App.css';
import CrimeCount from './components/Visualizations/CrimeCount';
import useJsonData from './utilities/jsonData';
import ViolentCrimeCounts from './components/Visualizations/ViolentCrimeCounts';



function App() {
  const [data, error] = useJsonData();
  return (
    <div className="App">
        <CrimeCount data = {data}></CrimeCount>
        <ViolentCrimeCounts data = {data}></ViolentCrimeCounts>
    </div>
  );
}



export default App;
