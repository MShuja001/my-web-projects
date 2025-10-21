function sum(a,b) {
    let result=a+b
    return a + b;
}
function sub(a,b) {
    let result=a-b
    return a - b;
}
function mul(a,b) {
    let result=a*b
    return a * b;
}
function div(a,b) {
    let result=a/b
    return a / b;
}
function exp(a,b) {
    let result=a**b
    return a ** b;
}
let man= Math.random()
let a=16;
let b= 12;
if(man <0.1){
    console.log("The sum of the numbers is: " + sum(a,b))
    console.log("The subtraction of the numbers is: " + sub(a,b))
    console.log("The multiplication of the numbers is: " + mul(a,b))
    console.log("The division of the numbers is: " + div(a,b))
    console.log("The exponentiation of the numbers is: " + exp(a,b))
}
else{
    console.log("Error")
}