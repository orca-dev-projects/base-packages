const cockatiel = require('cockatiel');
const retry = cockatiel.Policy.handleAll().retry().attempts(3).exponential();
const circuitBreaker = cockatiel.Policy.handleAll().circuitBreaker(
    30 * 1000,
    new cockatiel.ConsecutiveBreaker(5)
);
const retryWithBreaker = cockatiel.Policy.wrap(retry, circuitBreaker);
exports = module.exports = {
    retryWithBreaker,
    retry,
    Policy: cockatiel.Policy
};
