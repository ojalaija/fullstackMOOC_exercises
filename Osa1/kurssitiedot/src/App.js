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
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content part1={part1.name} exerc1={part1.exercises} part2={part2.name} exerc2={part2.exercises} part3={part3.name} exerc3={part3.exercises} />
      <Total no1={part1.exercises} no2={part2.exercises} no3={part3.exercises} />
    </div>
  )
}

export default App;
