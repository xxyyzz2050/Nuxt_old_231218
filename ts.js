var Employee = {
  firstname: 'Mohammed',
  lastname: 'Haddad'
}

console.log(Employee.firstname)
// expected output: "Mohammed"

delete Employee.firstname

console.log(Employee.firstname)
console.log('emp', Employee)
// expected output: undefined
