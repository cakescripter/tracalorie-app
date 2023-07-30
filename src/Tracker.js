import Storage from "./Storage"

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
            location.reload()
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

export default CalorieTracker