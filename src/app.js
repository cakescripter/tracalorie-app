import '@fortawesome/fontawesome-free/js/all'
import { Modal, Collapse } from 'bootstrap'
import './css/bootstrap.css'
import './css/style.css'

// CalorieTracker class to manage calorie tracking
class CalorieTracker {
    // Private internal state variables
    #calorieLimit = Storage.getCalorieLimit()
    #totalCalories = Storage.getTotalCalories(0)
    #meals = Storage.getMeals()
    #workouts = Storage.getWorkouts()

    // Private UI elements
    #totalCaloriesEl
    #caloriesConsumedEl
    #caloriesBurnedEl
    #caloriesRemainingEl
    #calorieLimitEl
    #progressEl



    // Constructor to initialize the tracker
    constructor() {
        this.#initializeElements()
        this.#render()
        document.querySelector('#limit').value = this.calorieLimit
    }

    // Public method to add a meal or workout
    addItem(item, type) {
        if (type === 'meal') {
            this.#meals.push(item)
            this.#totalCalories += item.calories
            Storage.setMeal(item)
        } else if (type === 'workout') {
            this.#workouts.push(item)
            this.#totalCalories -= item.calories
            Storage.setWorkout(item)
        }
        Storage.setTotalCalories(this.#totalCalories)
        this.#displayNewItem(item, type)
        this.#render()
    }

    // Public method to remove a meal
    removeMeal(id) {
        const index = this.#meals.findIndex((meal) => meal.id === id)
        if (index !== -1) {
            const meal = this.#meals[index]
            this.#totalCalories -= meal.calories
            this.#meals.splice(index, 1)
            Storage.removeMeal(id)
            Storage.setTotalCalories(this.#totalCalories)
            this.#render()
        }
    }

    // Public method to remove a workout
    removeWorkout(id) {
        const index = this.#workouts.findIndex((workout) => workout.id === id)
        if (index !== -1) {
            const workout = this.#workouts[index]
            this.#totalCalories += workout.calories
            this.#workouts.splice(index, 1)
            Storage.removeWorkout(id)
            Storage.setTotalCalories(this.#totalCalories)
            this.#render()
        }
    }

    // Public method to reset the tracker
    reset() {
        this.#totalCalories = 0
        this.#meals = []
        this.#workouts = []
        Storage.clearAll()
        this.#render()
    }

    // Public method to set the calorie limit
    setLimit(calorieLimit) {
        this.#calorieLimit = calorieLimit
        Storage.setCalorieLimit(calorieLimit)
        this.#displayCalorieLimit()
        this.#render()
    }
    loadItems() {
        this.#meals.forEach(meal => this.#displayNewItem(meal, 'meal'))
        this.#workouts.forEach(workout => this.#displayNewItem(workout, 'workout'))
    }

    // @change these to private

    // Public method to get the total calorie limit
    getCalorieLimit() {
        return this.#calorieLimit
    }

    // Public method to get the current total calories consumed
    getTotalCalories() {
        return this.#totalCalories
    }

    // Public method to get the meals array
    getMeals() {
        return this.#meals
    }

    // Public method to get the workouts array
    getWorkouts() {
        return this.#workouts
    }

    // Private method to initialize the UI elements
    #initializeElements() {
        this.#totalCaloriesEl = document.querySelector('#calories-total')
        this.#caloriesConsumedEl = document.querySelector('#calories-consumed')
        this.#caloriesBurnedEl = document.querySelector('#calories-burned')
        this.#caloriesRemainingEl = document.querySelector('#calories-remaining')
        this.#calorieLimitEl = document.querySelector('#calories-limit')
        this.#progressEl = document.querySelector('#calorie-progress')
    }

    // Private method to render the UI
    #render() {
        this.#displayCalorieLimit()
        this.#displayCalorieTotal()
        this.#displayCaloriesConsumed()
        this.#displayCaloriesBurned()
        this.#displayCaloriesRemaining()
        this.#displayCalorieProgress()
    }

    // Helper method to display the calorie limit
    #displayCalorieLimit() {
        this.#calorieLimitEl.innerHTML = this.#calorieLimit
    }

    // Helper method to display the total calories consumed
    #displayCalorieTotal() {
        this.#totalCaloriesEl.innerHTML = this.#totalCalories
    }

    // Helper method to display the total calories consumed from meals
    #displayCaloriesConsumed() {
        const consumed = this.#meals.reduce((total, meal) => total + meal.calories, 0)
        this.#caloriesConsumedEl.innerHTML = consumed
    }

    // Helper method to display the total calories burned from workouts
    #displayCaloriesBurned() {
        const burned = this.#workouts.reduce((total, workout) => total + workout.calories, 0)
        this.#caloriesBurnedEl.innerHTML = burned
    }

    // Helper method to display the remaining calories
    #displayCaloriesRemaining() {
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

    // Helper method to display the calorie progress
    #displayCalorieProgress() {
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100
        this.#progressEl.style.width = `${Math.min(percentage, 100)}%`
    }

    // Helper method to display a new meal or workout in the UI
    #displayNewItem(item, type) {
        const itemsEl = type === 'meal' ? document.querySelector('#meal-items') : document.querySelector('#workout-items')
        const itemEl = document.createElement('div')
        itemEl.classList.add('card', 'my-2')
        itemEl.setAttribute('data-id', item.id)
        itemEl.innerHTML = `
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${item.name}</h4>
                <div class="fs-1 bg-${type === 'meal' ? 'primary' : 'secondary'} text-white text-center rounded-2 px-2 px-sm-5">
                  ${item.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
        `
        itemsEl.appendChild(itemEl)
    }

}

// Meal class to represent a meal with name and calories
class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

// Workout class to represent a workout with name and calories
class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name
        this.calories = calories
    }
}

class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit')
        }
        return calorieLimit
    }
    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit)
    }

    static getTotalCalories(defaultCalories = 0) {
        let totalCalories
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories
        } else {
            totalCalories = +localStorage.getItem('totalCalories')
        }
        return totalCalories
    }
    static setTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories)
    }
    static getMeals() {
        let meals
        if (localStorage.getItem('meals') === null) {
            meals = []
        } else {
            meals = JSON.parse(localStorage.getItem('meals'))
        }
        return meals
    }
    static setMeal(meal) {
        const meals = Storage.getMeals()
        meals.push(meal)
        localStorage.setItem('meals', JSON.stringify(meals))
    }
    static removeMeal(id) {
        const meals = Storage.getMeals()
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1)
            }
        })
        localStorage.setItem('meals', JSON.stringify(meals))
    }

    static getWorkouts() {
        let workouts
        if (localStorage.getItem('workouts') === null) {
            workouts = []
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'))
        }
        return workouts
    }
    static setWorkout(workout) {
        const workouts = Storage.getWorkouts()
        workouts.push(workout)
        localStorage.setItem('workouts', JSON.stringify(workouts))

    }
    static removeWorkout(id) {
        const workouts = Storage.getWorkouts()
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1)
            }
        })
        localStorage.setItem('workouts', JSON.stringify(workouts))
    }
    static clearAll() {
        localStorage.removeItem('totalCalories')
        localStorage.removeItem('meals')
        localStorage.removeItem('workouts')
    }
}
// App class to manage the application and interact with the tracker
class App {
    constructor() {
        this.tracker = new CalorieTracker()
        this.#loadEventListeners()
        this.tracker.loadItems()

    }
    #loadEventListeners() {
        // Event listeners for adding and removing items
        document.querySelector('#meal-form').addEventListener('submit', (e) => this.newItem(e, 'meal'))
        document.querySelector('#workout-form').addEventListener('submit', (e) => this.newItem(e, 'workout'))
        document.querySelector('#meal-items').addEventListener('click', (e) => this.removeItem(e, 'meal'))
        document.querySelector('#workout-items').addEventListener('click', (e) => this.removeItem(e, 'workout'))

        // Event listeners for filtering items and setting the calorie limit
        document.querySelector('#filter-meals').addEventListener('keyup', (e) => this.filterItems(e, 'meal'))
        document.querySelector('#filter-workouts').addEventListener('keyup', (e) => this.filterItems(e, 'workout'))
        document.querySelector('#reset').addEventListener('click', () => this.reset())
        document.querySelector('#limit-form').addEventListener('submit', (e) => this.setLimit(e))
    }

    // Method to handle adding new items (meals or workouts)
    newItem(e, type) {
        e.preventDefault()
        const name = document.querySelector(`#${type}-name`)
        const calories = document.querySelector(`#${type}-calories`)
        if (name.value === '' || calories.value === '') {
            alert('Enter all fields')
            return
        }
        const item = type === 'meal' ? new Meal(name.value, +calories.value) : new Workout(name.value, +calories.value)
        this.tracker.addItem(item, type)
        name.value = ''
        calories.value = ''
        const collapseElement = document.querySelector(`#collapse-${type}`)
        const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: true })
    }

    // Method to handle removing items (meals or workouts)
    removeItem(e, type) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id')
                type === 'meal' ? this.tracker.removeMeal(id) : this.tracker.removeWorkout(id)
                e.target.closest('.card').remove()
            }
        }
    }

    // Method to handle filtering items (meals or workouts)
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

    // Method to reset the tracker and clear UI
    reset() {
        this.tracker.reset()
        document.querySelector('#meal-items').innerHTML = ''
        document.querySelector('#workout-items').innerHTML = ''
        document.querySelector('#filter-meals').value = ''
        document.querySelector('#filter-workouts').value = ''
    }

    // Method to set the calorie limit
    setLimit(e) {
        e.preventDefault()
        const limit = document.querySelector('#limit')
        if (limit.value == '') {
            limit.value = 2000
        }
        this.tracker.setLimit(+limit.value)
        limit.value = ''
        const modalEl = document.querySelector('#limit-modal')
        const modal = bootstrap.Modal.getInstance(modalEl)
        modal.hide()
    }
}

// Initialize the app
const app = new App()
