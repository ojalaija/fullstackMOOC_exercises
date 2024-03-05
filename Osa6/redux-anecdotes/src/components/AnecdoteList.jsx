import { useDispatch, useSelector } from 'react-redux'
import { votedAnectode } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes} votes <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const anecdotesSorted = anecdotes.sort((a,b) => b.votes - a.votes)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>vote for the best anecdotes</h2>
      {anecdotesSorted.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(votedAnectode(anecdote.id))}
        />
      )}
    </div>
  )
}

export default AnecdoteList