import AddTask from './components/AddTask'

function App() {
  return <AddTask onAdd={text => console.log(text)} />
}

export default App
