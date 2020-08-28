export default function createRandomNumber(n: number = 6) {
	return (+new Date() * Math.floor((1 + Math.random()) * 10)).toString().slice(-n);
}
