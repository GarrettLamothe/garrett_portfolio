
let score=prompt("score")
if (score > 100) {
    prompt('Please enter a valid score')
}

if (score >= 90) {
    alert('You have received an A')
} else if (score >=80 && score<90) {
    alert('You have received a B')
} else if (score >=70 && score<80) {
    alert('You have received a C')
} else {
    alert('You have failed')
}
console.log(score)