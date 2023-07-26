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
        this.#render()
    }

    addMeal(meal) {
        this.#meals.push(meal)
        this.#totalCalories += meal.calories
        this.displayNewMeal(meal)
        this.#render()
    }

    addWorkout(workout) {
        this.#workouts.push(workout)
        this.#totalCalories -= workout.calories
        this.displayNewWorkout(workout)
        this.#render()
    }

    removeMeal(id) {
        const index = this.#meals.findIndex((meal) => meal.id === id)
        if (index !== -1) {
            const meal = this.#meals[index]
            this.#totalCalories -= meal.calories
            this.#meals.splice(index, 1)
            this.#render()
        }
    }

    removeWorkout(id) {
        const index = this.#workouts.findIndex((workout) => workout.id === id)
        if (index !== -1) {
            const workout = this.#workouts[index]
            this.#totalCalories += workout.calories
            this.#workouts.splice(index, 1)
            this.#render()
        }
    }

    reset() {
        this.#totalCalories = 0
        this.#meals = []
        this.#workouts = []
        this.#render()
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
        const shorthand = this.#caloriesRemainingEl.parentElement.parentElement
        if (remaining <= 0) {
            shorthand.classList.remove('bg-light')
            shorthand.classList.add('bg-danger')
            this.#progressEl.classList.remove('bg-success')
            this.#progressEl.classList.add('bg-danger')
        } else {
            shorthand.classList.remove('bg-danger')
            shorthand.classList.add('bg-light')

            this.#progressEl.classList.remove('bg-danger')
            this.#progressEl.classList.add('bg-success')
        }
    }

    displayCalorieProgress() {
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100
        this.#progressEl.style.width = `${Math.min(percentage, 100)}%`;
    }

    displayNewMeal(meal) {
        const mealsEl = document.querySelector('#meal-items')
        const mealEl = document.createElement('div')
        mealEl.classList.add('card', 'my-2')
        mealEl.setAttribute('data-id', meal.id)
        mealEl.innerHTML = `
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                  ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
        `
        mealsEl.appendChild(mealEl)
    }
    displayNewWorkout(workout) {
        const workoutsEl = document.querySelector('#workout-items')
        const workoutEl = document.createElement('div')
        workoutEl.classList.add('card', 'my-2')
        workoutEl.setAttribute('data-id', workout.id)
        workoutEl.innerHTML = `
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                  ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
        `
        workoutsEl.appendChild(workoutEl)
    }

    #render() {
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
            .addEventListener('submit', (e) => this.newItem(e, 'meal'))

        document.querySelector('#workout-form')
            .addEventListener('submit', (e) => this.newItem(e, 'workout'))

        document.querySelector('#meal-items').addEventListener('click', (e) => this.removeItem(e, 'meal'))

        document.querySelector('#workout-items').addEventListener('click', (e) => this.removeItem(e, 'workout'))

        document.querySelector('#filter-meals').addEventListener('keyup', (e) => this.filterItems(e, 'meal'))

        document.querySelector('#filter-workouts').addEventListener('keyup', (e) => this.filterItems(e, 'workout'))

        document.querySelector('#reset').addEventListener('click', (e) => this.#reset(e))

    }

    newItem(e, type) {
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
    removeItem(e, type) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id')

                type === 'meal' ? this.tracker.removeMeal(id) : this.tracker.removeWorkout(id)

                e.target.closest('.card').remove()
            }
        }
    }
    filterItems(e, type) {
        const text = e.target.value.toLowerCase()
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent
            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block'
            } else {
                item.style.display = 'none'
            }
        })
    }

    #reset() {
        this.tracker.reset()
        document.querySelector('#meal-items').innerHTML = ''
        document.querySelector('#workout-items').innerHTML = ''
        document.querySelector('#filter-meals').value = ''
        document.querySelector('#filter-workouts').value = ''

    }
}

const app = new App()