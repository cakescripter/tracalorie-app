## Calorie Tracker Web Application

### Description

This repository houses a user-friendly Calorie Tracker web application developed using Vanilla JavaScript. The app allows users to keep track of their daily calorie consumption and workouts, assisting them in reaching their fitness goals effectively. It serves as an excellent tool to manage your calorie intake and monitor your progress towards a healthier lifestyle. Project created during Brad Traversy course.

### Demo:

Check it out live: [Tracalorie App](https://chimerical-paletas-0ee4cd.netlify.app)
![Screen projektu](Tracalorie.png)

### Key Features:

- **Adding meals and workouts:** With this application, you can easily input the name and calorie count of the meals you consume and the workouts you engage in. The app will automatically update the total calorie count based on your entries.

- **Removing meals and workouts:** If you wish to remove any previously added meals or workouts, simply click on the "Remove" button next to the item, and it will be promptly removed from the tracker.

- **Setting the calorie limit:** Users have the flexibility to set their daily calorie limit. The application will calculate and display the remaining calories, helping you stay on track with your dietary goals.

- **Filtering items:** For easy organization and quick access, the app allows you to search and filter through the added meals and workouts using the provided filter input fields.

- **Local Storage Integration:** The application now incorporates local storage functionality, ensuring that your tracked data persists even after closing the browser or refreshing the page. This enhancement provides a more seamless experience and prevents data loss.

### Known Issue:
After adding local storage i've noticed an intermittent issue with the application which is  **inaccurate calories and progress bar**. Occasionally, the total calorie count and progress bar do not update correctly, leading to inaccurate representations of the consumed calories and progress towards the daily goal.

### Planned improvements:
- **Webpack Integration:** To optimize the application's performance and ensure efficient loading of assets, I'm planning to integrate Webpack into the project. Webpack will help bundle and minify the JavaScript, CSS, and other assets, reducing the overall file sizes and improving the application's load time. Webpack will also enable me to use the latest ECMAScript modules (ES modules) syntax, allowing for better code organization and modularity.

- **Refactoring to Modules:** Currently, the application is developed using Vanilla JavaScript, which means that all the code exists in a single script file. To make the code more modular, maintainable, and scalable, I plan to refactor it using JavaScript modules.