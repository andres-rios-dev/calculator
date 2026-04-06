# Calculator

A fully functional browser-based calculator with a clean, modern UI, built entirely with vanilla HTML, CSS, and JavaScript. This is the final project of The Odin Project's Foundations path, bringing together every concept learned throughout the curriculum into a single interactive application.

## Live Demo

**[Click here for a live demo](https://andres-rios-dev.github.io/calculator/)**

## What I Learned

As the capstone project of the Foundations path, building this calculator forced me to synthesize everything from HTML structure to advanced JavaScript logic. Key takeaways included:

* **State Management:** Tracking five interdependent variables (`digitBuffer`, `num1`, `num2`, `operator`, `hasResult`) to model every possible state of the calculator—from idle, to mid-operation, to displaying a result—taught me how even a "simple" app requires careful state design.
* **Event Delegation:** Instead of attaching a listener to each of the 19 buttons, I used a single listener on the parent container and leveraged `closest()` to identify the clicked button. This pattern keeps the code scalable and avoids redundant bindings.
* **Data Attributes as a Routing System:** Using `data-type`, `data-action`, and `data-value` in the HTML to classify buttons, then reading them with `dataset` in JavaScript, created a clean separation between the UI structure and the application logic.
* **Operation Chaining:** Handling sequences like `5 + 5 + 2 =` required computing intermediate results on-the-fly when the user presses a second operator, rather than waiting for `=`. This was the trickiest piece of logic to get right.
* **Edge Case Handling:** Preventing division by zero, blocking duplicate decimal points, stripping leading zeros, and toggling the sign of both in-progress and completed numbers required thinking through every possible user interaction.
* **Separation of Concerns:** Organizing the code into clear sections (constants, state, math engine, display, state mutations, event handling) made debugging far easier and reinforced the importance of structured, readable code.

## Purpose

This project was created as the **final project of The Odin Project's Foundations curriculum**. It represents the culmination of the entire path—combining HTML semantics, CSS layout and styling, and JavaScript fundamentals—into a cohesive, interactive application. The main goal was to demonstrate the ability to **manage complex application state**, handle user input through the DOM, and build a polished product from scratch using only vanilla technologies.
