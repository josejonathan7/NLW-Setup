import { Habit } from "./components/habits"
import '../styles/global.css'

function App() {

  return (
   <div>
      <Habit completed={3} />
      <Habit completed={10} />
      <Habit completed={20} />
      <Habit completed={30} />
    </div>
  )
}

export default App
