import { useState } from "react";

const Header = ({header}) => (
  <h1>{header}</h1>
)

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticsLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const all = good + neutral + bad
  const average = ((good+bad*(-1))/all).toFixed(1)
  const positive = ((good/all)*100).toFixed(1)+' %'

  if (all===0) {
    return (
      <p>No feedback given</p>
    )
  } else {
    return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text='good' value={good} />
          <StatisticsLine text='neutral' value={neutral} />
          <StatisticsLine text='bad' value={bad} />
          <StatisticsLine text='all' value={all} />
          <StatisticsLine text='average' value={average} />
          <StatisticsLine text='positive' value={positive} />
        </tbody>
      </table>
    </div>
    )
  }
}

const App = () => {
  const buttonHeader = 'give feedback'
  const statsHeader = 'statistics'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => {
    setGood(good +1)
  }

  const handleClickNeutral = () => {
    setNeutral(neutral +1)
  }

  const handleClickBad = () => {
    setBad(bad +1)
  }

  return (
    <div>
      <Header header= {buttonHeader} />
      <Button handleClick={handleClickGood} text= 'good' />
      <Button handleClick={handleClickNeutral} text= 'neutral' />
      <Button handleClick={handleClickBad} text= 'bad' />
      <Header header= {statsHeader} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
