import '@fortawesome/fontawesome-free/js/all'
import { Modal, Collapse } from 'bootstrap'

import CalorieTracker from './Tracker'
import { Meal, Workout } from './item'

import './css/bootstrap.css'
import './css/style.css'

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
        const bsCollapse = new Collapse(collapseElement, { toggle: true })
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
        const modal = Modal.getInstance(modalEl)
        modal.hide()
    }
}

// Initialize the app
const app = new App()
