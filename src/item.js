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

export { Meal, Workout }