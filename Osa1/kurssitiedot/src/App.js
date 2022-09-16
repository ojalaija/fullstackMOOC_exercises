const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part} {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.part1} exercises={props.exerc1}/>
      <Part part={props.part2} exercises={props.exerc2}/>
      <Part part={props.part3} exercises={props.exerc3}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.no1 + props.no2 + props.no3}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content part1={part1} exerc1={exercises1} part2={part2} exerc2={exercises2} part3={part3} exerc3={exercises3} />
      <Total no1={exercises1} no2={exercises2} no3={exercises3} />
    </div>
  )
}

export default App;
