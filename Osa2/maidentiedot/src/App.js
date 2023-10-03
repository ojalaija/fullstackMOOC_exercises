import axios from "axios";
import { useState, useEffect } from "react";
import Display from "./components/Display";


const App = () => {
  const [countries, setCountries] = useState([])
  const [filters, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])

  const countriesToShow = (filters ==='')
  ? countries
  : countries.filter(country =>
    country.name.common.toLowerCase()
    .includes(filters.toLowerCase()))

  const toggleSetFilter = (choice) => {
    setFilter(choice)
  }

  const handleFilterChanges = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      Find countries: <input value={filters} onChange={handleFilterChanges} />
      <Display filteredCountries={countriesToShow} action={toggleSetFilter} />
    </div>
  )
}

export default App;
