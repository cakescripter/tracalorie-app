class CalorieTracker {
    #calorieLimit = 2000;
    #totalCalories = 0;
    #meals = [];
    #workouts = [];

    #totalCaloriesEl = document.querySelector('#calories-total');
    #caloriesConsumedEl = document.querySelector('#calories-consumed');
    #caloriesBurnedEl = document.querySelector('#calories-burned');
    #caloriesRemainingEl = document.querySelector('#calories-remaining');
    #calorieLimitEl = document.querySelector('#calories-limit');
    #progressEl = document.querySelector('#calorie-progress');
    #mealsEl = document.querySelector('#meal-items');
    #workoutsEl = document.querySelector('#workout-items');

    constructor() {
        this.render();
    }

    addItem(item, type) {
        if (type === 'meal') {
            this.#meals.push(item);
            this.#totalCalories += item.calories;
            this.displayNewItem(item, true);
        } else if (type === 'workout') {
            this.#workouts.push(item);
            this.#totalCalories -= item.calories;
            this.displayNewItem(item, false);
        } else {
            console.error('Invalid item type:', type);
            return;
        }

        this.render();
    }

    displayCalorieLimit() {
        this.#calorieLimitEl.innerHTML = this.#calorieLimit;
    }

    displayCalorieTotal() {
        this.#totalCaloriesEl.innerHTML = this.#totalCalories;
    }

    displayCaloriesConsumed() {
        const consumed = this.#meals.reduce((total, meal) => total + meal.calories, 0);
        this.#caloriesConsumedEl.innerHTML = consumed;
    }

    displayCaloriesBurned() {
        const burned = this.#workouts.reduce((total, workout) => total + workout.calories, 0);
        this.#caloriesBurnedEl.innerHTML = burned;
    }

    displayCaloriesRemaining() {
        const remaining = this.#calorieLimit - this.#totalCalories;
        this.#caloriesRemainingEl.innerHTML = remaining;
        const shorthand = this.#caloriesRemainingEl.parentElement.parentElement.classList;
        if (remaining <= 0) {
            shorthand.remove('bg-light');
            shorthand.add('bg-danger');
            this.#progressEl.classList.remove('bg-success');
            this.#progressEl.classList.add('bg-danger');
        } else {
            shorthand.remove('bg-danger');
            shorthand.add('bg-light');
            this.#progressEl.classList.remove('bg-danger');
            this.#progressEl.classList.add('bg-success');
        }
    }

    displayCalorieProgress() {
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
        this.#progressEl.style.width = `${Math.min(percentage, 100)}%`;
    }

    displayNewItem(item, isMeal) {
        const itemEl = document.createElement('div');
        itemEl.classList.add('card', 'my-2');
        itemEl.setAttribute('data-id', item.id);
        itemEl.innerHTML = `
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${item.name}</h4>
            <div class="fs-1 ${isMeal ? 'bg-primary' : 'bg-secondary'} text-white text-center rounded-2 px-2 px-sm-5">
              ${item.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      `;

        isMeal ? this.#mealsEl.appendChild(itemEl) : this.#workoutsEl.appendChild(itemEl);
    }

    render() {
        this.displayCalorieLimit();
        this.displayCalorieTotal();
        this.displayCaloriesConsumed();
        this.displayCaloriesBurned();
        this.displayCaloriesRemaining();
        this.displayCalorieProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class App {
    constructor() {
        this.tracker = new CalorieTracker();

        document.querySelector('#meal-form').addEventListener('submit', (e) => this.handleFormSubmit(e, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', (e) => this.handleFormSubmit(e, 'workout'));
    }

    handleFormSubmit(e, type) {
        e.preventDefault();

        const name = document.querySelector(`#${type}-name`);
        const calories = document.querySelector(`#${type}-calories`);

        if (name.value === '' || calories.value === '') {
            alert('Enter all fields');
            return;
        }

        const item = type === 'meal' ? new Meal(name.value, +calories.value) : new Workout(name.value, +calories.value);
        this.tracker.addItem(item, type);

        name.value = '';
        calories.value = '';

        const collapseElement = document.querySelector(`#collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: true
        });
    }
}

const app = new App();