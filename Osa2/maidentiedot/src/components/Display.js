import React from "react"
import axios from "axios"
import { useState, useEffect } from "react"

const CountryInfo = ({country}) => {
    const languages = Object.values(country.languages)
    const [wind, setWind] = useState('')
    const [temp, setTemp] = useState('')
    const [weather, setWeather] = useState('')

    useEffect(() => {
        const api_key = process.env.REACT_APP_API_KEY
        const lat = country.capitalInfo.latlng[0]
        const lon = country.capitalInfo.latlng[1]
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
            .then(response => {
                setTemp(response.data.main.temp)
                setWind(response.data.wind.speed)
                setWeather(response.data.weather[0])
            })
    }, [country.capitalInfo])

    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages:</h3>
        <ul>
          {languages.map(language =>
            <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <h3>Weather in {country.capital}</h3>
        <p>Temperature: {temp} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} />
        <p>Wind: {wind} m/s</p>
      </div>
    )
}
  
const MatchListItem = ({match, action}) => {
return (
    <div>
    {match.name.common}
    <button onClick={()=>action(match.name.common)}>show</button>
    </div>
)
}


const Display = (props) => {
    const matches = props.filteredCountries

    if (matches.length > 10) {
        return (
        <p>Too many matches, spesify another filter</p>
        )
    }
    else if (matches.length === 0) {
        return (
        <p>No matches, try another filter</p>
        )
    }
    else if (matches.length > 1) {
        return (
        matches.map(match =>
            <MatchListItem key={match.name.official} match={match} action={props.action}/>)
        )
    }
    else {
        return (
            <CountryInfo country={matches[0]} wind={props.wind} temperature={props.temperature} setCapital={props.setCapital} />
        )
    }
}

export default Display