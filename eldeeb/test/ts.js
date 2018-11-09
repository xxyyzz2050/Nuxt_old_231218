eldeeb = require('../lib/')

p1=eldeeb.promise()
p2=eldeeb.promise(p1)
p3=eldeeb.promise(r=>r())


console.log("p1",p1)
console.log("p2",p2)
console.log("p3",p3)


p1.wait(2).then(x=>console.log(x.seconds))//.wait(1).done(x=>console.log(x.seconds))
