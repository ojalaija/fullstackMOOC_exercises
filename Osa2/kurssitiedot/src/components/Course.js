const Header = ({course}) => (
<h2>{course}</h2>
)

const Part = (props) => (
<p>{props.name} {props.exercises}</p>
)

const Content = ({parts}) => {
return (
    <div>
    {parts.map(part =>
        <Part key= {part.id} name={part.name} exercises={part.exercises} />
    )}
    </div>
)
}

const Total = ({parts}) => {
const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
return (
    <div>
    <p><b>Total of {totalExercises} excercises</b></p>
    </div>
)
}

const Course = ({name, parts}) => {
return (
    <div>
    <Header course={name} />
    <Content parts={parts} />
    <Total parts={parts} />
    </div>
)
}

export default Course