class CalorieTracker {
    #calorieLimit = 2000
    #totalCalories = 0
    #meals = []
    #workouts = []

    #totalCaloriesEl = document.querySelector('#calories-total')
    #caloriesConsumedEl = document.querySelector('#calories-consumed')
    #caloriesBurnedEl = document.querySelector('#calories-burned')
    #caloriesRemainingEl = document.querySelector('#calories-remaining')
    #calorieLimitEl = document.querySelector('#calories-limit')
    #progressEl = document.querySelector('#calorie-progress')

    constructor() {
        this.render()
    }

    addMeal(meal) {
        this.#meals.push(meal)
        this.#totalCalories += meal.calories
        this.render()
    }

    addWorkout(workout) {
        this.#workouts.push(workout)
        this.#totalCalories -= workout.calories
        this.render()
    }

    displayCalorieLimit() {
        this.#calorieLimitEl.innerHTML = this.#calorieLimit
    }

    displayCalorieTotal() {
        this.#totalCaloriesEl.innerHTML = this.#totalCalories
    }

    displayCaloriesConsumed() {
        const consumed = this.#meals.reduce((total, meal) => total + meal.calories, 0)
        this.#caloriesConsumedEl.innerHTML = consumed
    }

    displayCaloriesBurned() {
        const burned = this.#workouts.reduce((total, workout) => total + workout.calories, 0)
        this.#caloriesBurnedEl.innerHTML = burned
    }

    displayCaloriesRemaining() {
        const remaining = this.#calorieLimit - this.#totalCalories
        this.#caloriesRemainingEl.innerHTML = remaining
        const shorthand = this.#caloriesRemainingEl.parentElement.parentElement.classList
        if (remaining <= 0) {
            shorthand.remove('bg-light')
            shorthand.add('bg-danger')
            this.#progressEl.classList.remove('bg-success')
            this.#progressEl.classList.add('bg-danger')
        } else {
            shorthand.remove('bg-danger')
            shorthand.add('bg-light')

            this.#progressEl.classList.remove('bg-danger')
            this.#progressEl.classList.add('bg-success')
        }

    }

    displayCalorieProgress() {
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100
        this.#progressEl.style.width = `${Math.min(percentage, 100)}%`;
    }

    render() {
        this.displayCalorieLimit()
        this.displayCalorieTotal()
        this.displayCaloriesConsumed()
        this.displayCaloriesBurned()
        this.displayCaloriesRemaining()
        this.displayCalorieProgress()
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

class App {
    constructor() {
        this.tracker = new CalorieTracker()

        document.querySelector('#meal-form')
            .addEventListener('submit', (e) => this.handleFormSubmit(e, 'meal'))

        document.querySelector('#workout-form')
            .addEventListener('submit', (e) => this.handleFormSubmit(e, 'workout'))

    }

    handleFormSubmit(e, type) {
        e.preventDefault()

        const name = document.querySelector(`#${type}-name`)
        const calories = document.querySelector(`#${type}-calories`)

        if (name.value === '' || calories.value === '') {
            alert('Enter all fields')
            return
        }

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value)
            this.tracker.addMeal(meal)
        } else if (type === 'workout') {
            const workout = new Workout(name.value, +calories.value)
            this.tracker.addWorkout(workout)
        }

        name.value = ''
        calories.value = ''

        const collapseElement = document.querySelector(`#collapse-${type}`)
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: true
        })
    }
}

const app = new App()
