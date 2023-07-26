// CalorieTracker class to manage calorie tracking
class CalorieTracker {
    // Private internal state variables
    #calorieLimit = 2000;
    #totalCalories = 0;
    #meals = [];
    #workouts = [];

    // Private UI elements
    #totalCaloriesEl;
    #caloriesConsumedEl;
    #caloriesBurnedEl;
    #caloriesRemainingEl;
    #calorieLimitEl;
    #progressEl;

    // Constructor to initialize the tracker
    constructor() {
        this.#initializeElements();
        this.#render();
    }

    // Public method to add a meal
    addMeal(meal) {
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;
        this.#displayNewMeal(meal);
        this.#render();
    }

    // Public method to add a workout
    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        this.#displayNewWorkout(workout);
        this.#render();
    }

    // Public method to remove a meal
    removeMeal(id) {
        const index = this.#meals.findIndex((meal) => meal.id === id);
        if (index !== -1) {
            const meal = this.#meals[index];
            this.#totalCalories -= meal.calories;
            this.#meals.splice(index, 1);
            this.#render();
        }
    }

    // Public method to remove a workout
    removeWorkout(id) {
        const index = this.#workouts.findIndex((workout) => workout.id === id);
        if (index !== -1) {
            const workout = this.#workouts[index];
            this.#totalCalories += workout.calories;
            this.#workouts.splice(index, 1);
            this.#render();
        }
    }

    // Public method to reset the tracker
    reset() {
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];
        this.#render();
    }

    // Public method to set the calorie limit
    setLimit(calorieLimit) {
        this.#calorieLimit = calorieLimit;
        this.#displayCalorieLimit();
        this.#render();
    }

    // Public method to get the total calorie limit
    getCalorieLimit() {
        return this.#calorieLimit;
    }

    // Public method to get the current total calories consumed
    getTotalCalories() {
        return this.#totalCalories;
    }

    // Public method to get the meals array
    getMeals() {
        return this.#meals;
    }

    // Public method to get the workouts array
    getWorkouts() {
        return this.#workouts;
    }

    // Private method to initialize the UI elements
    #initializeElements() {
        this.#totalCaloriesEl = document.querySelector('#calories-total');
        this.#caloriesConsumedEl = document.querySelector('#calories-consumed');
        this.#caloriesBurnedEl = document.querySelector('#calories-burned');
        this.#caloriesRemainingEl = document.querySelector('#calories-remaining');
        this.#calorieLimitEl = document.querySelector('#calories-limit');
        this.#progressEl = document.querySelector('#calorie-progress');
    }

    // Private method to render the UI
    #render() {
        this.#displayCalorieLimit();
        this.#displayCalorieTotal();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
        this.#displayCaloriesRemaining();
        this.#displayCalorieProgress();
    }

    // Helper method to display the calorie limit
    #displayCalorieLimit() {
        this.#calorieLimitEl.innerHTML = this.#calorieLimit;
    }

    // Helper method to display the total calories consumed
    #displayCalorieTotal() {
        this.#totalCaloriesEl.innerHTML = this.#totalCalories;
    }

    // Helper method to display the total calories consumed from meals
    #displayCaloriesConsumed() {
        const consumed = this.#meals.reduce((total, meal) => total + meal.calories, 0);
        this.#caloriesConsumedEl.innerHTML = consumed;
    }

    // Helper method to display the total calories burned from workouts
    #displayCaloriesBurned() {
        const burned = this.#workouts.reduce((total, workout) => total + workout.calories, 0);
        this.#caloriesBurnedEl.innerHTML = burned;
    }

    // Helper method to display the remaining calories
    #displayCaloriesRemaining() {
        const remaining = this.#calorieLimit - this.#totalCalories;
        this.#caloriesRemainingEl.innerHTML = remaining;
        const shorthand = this.#caloriesRemainingEl.parentElement.parentElement;
        if (remaining <= 0) {
            shorthand.classList.remove('bg-light');
            shorthand.classList.add('bg-danger');
            this.#progressEl.classList.remove('bg-success');
            this.#progressEl.classList.add('bg-danger');
        } else {
            shorthand.classList.remove('bg-danger');
            shorthand.classList.add('bg-light');

            this.#progressEl.classList.remove('bg-danger');
            this.#progressEl.classList.add('bg-success');
        }
    }

    // Helper method to display the calorie progress
    #displayCalorieProgress() {
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
        this.#progressEl.style.width = `${Math.min(percentage, 100)}%`;
    }

    // Helper method to display a new meal in the UI
    #displayNewMeal(meal) {
        const mealsEl = document.querySelector('#meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
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
        `;
        mealsEl.appendChild(mealEl);
    }

    // Helper method to display a new workout in the UI
    #displayNewWorkout(workout) {
        const workoutsEl = document.querySelector('#workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
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
        `;
        workoutsEl.appendChild(workoutEl);
    }
}

// Meal class to represent a meal with name and calories
class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

// Workout class to represent a workout with name and calories
class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

// App class to manage the application and interact with the tracker
class App {
    constructor() {
        this.tracker = new CalorieTracker();

        // Event listeners for adding and removing items
        document.querySelector('#meal-form').addEventListener('submit', (e) => this.newItem(e, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', (e) => this.newItem(e, 'workout'));
        document.querySelector('#meal-items').addEventListener('click', (e) => this.removeItem(e, 'meal'));
        document.querySelector('#workout-items').addEventListener('click', (e) => this.removeItem(e, 'workout'));

        // Event listeners for filtering items and setting the calorie limit
        document.querySelector('#filter-meals').addEventListener('keyup', (e) => this.filterItems(e, 'meal'));
        document.querySelector('#filter-workouts').addEventListener('keyup', (e) => this.filterItems(e, 'workout'));
        document.querySelector('#reset').addEventListener('click', () => this.reset());
        document.querySelector('#limit-form').addEventListener('submit', (e) => this.setLimit(e));
    }

    // Method to handle adding new items (meals or workouts)
    newItem(e, type) {
        e.preventDefault();
        const name = document.querySelector(`#${type}-name`);
        const calories = document.querySelector(`#${type}-calories`);
        // if (name.value === '' || calories.value === '') {
        //     alert('Enter all fields');
        //     return;
        // }
        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this.tracker.addMeal(meal);
        } else if (type === 'workout') {
            const workout = new Workout(name.value, +calories.value);
            this.tracker.addWorkout(workout);
        }
        name.value = '';
        calories.value = '';
        const collapseElement = document.querySelector(`#collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: true });
    }

    // Method to handle removing items (meals or workouts)
    removeItem(e, type) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
                type === 'meal' ? this.tracker.removeMeal(id) : this.tracker.removeWorkout(id);
                e.target.closest('.card').remove();
            }
        }
    }

    // Method to handle filtering items (meals or workouts)
    filterItems(e, type) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Method to reset the tracker and clear UI
    reset() {
        this.tracker.reset();
        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';
        document.querySelector('#filter-meals').value = '';
        document.querySelector('#filter-workouts').value = '';
    }

    // Method to set the calorie limit
    setLimit(e) {
        e.preventDefault();
        const limit = document.querySelector('#limit');
        if (limit.value == '') {
            limit.value = 2000
        }
        this.tracker.setLimit(+limit.value);
        limit.value = '';
        const modalEl = document.querySelector('#limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

// Initialize the app
const app = new App();