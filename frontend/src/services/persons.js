import axios from 'axios'
const baseUrl = '/api/persons'

console.log(baseUrl)

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
}

const addPerson = person => {
  return axios.post(baseUrl, person)
    .then(response => response.data)
}

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = person => {
  return axios.put(`${baseUrl}/${person.id}`, person)
    .then(response => response.data)
}

const API = {getAll, addPerson, deletePerson, updatePerson}
export default API