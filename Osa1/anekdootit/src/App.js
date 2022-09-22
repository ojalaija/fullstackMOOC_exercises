import { useState } from 'react'

const Display = (props) => {
  return (
    <div>
      <h1>{props.heading}</h1>
      <p>{props.anecdote}</p>
      <p>has {props.votes} votes</p>
    </div>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
    </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  
  const emptyVotes = new Uint8Array(anecdotes.length)
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(emptyVotes)
  const [winner, setWinner] = useState(0)

  const randomSelection = () => {
    const randomNumber = Math.floor(Math.random()*anecdotes.length)
    console.log('rand number is: ',randomNumber)
    return (
      setSelected(randomNumber)
    )
  }

  const findWinner = (voteArray) => {
    const winnerVal = Math.max(...voteArray)
    console.log('max votes:', winnerVal)
    const newWinner = voteArray.indexOf(winnerVal)
    return (
      setWinner(newWinner)
    )
  }

  const voteAnecdote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    findWinner(votesCopy)
    console.log('voting situation:', votesCopy)
    return (
      setVotes(votesCopy)
    )
  }

  return (
    <div>
      <Display heading='Anecdote of the day' anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={voteAnecdote} text='vote' />
      <Button handleClick={randomSelection} text='next anecdote' />
      <Display heading='Anecdote with most votes' anecdote={anecdotes[winner]} votes={votes[winner]} />
    </div>
  )
}

export default App