import React from "react";
import { mount } from "cypress/react";
import Quiz from "../../client/src/components/Quiz";


// This is componet testing for the quiz component
describe("Quiz Component", () => {
  beforeEach(() => {
    cy.fixture("questions.json").as("mockQuestions"); 
  });

// Make sure the quiz button renders
  it("should render a Quiz button", () => {
    mount(<Quiz />);
    cy.contains("Start Quiz").should("be.visible");
  });

// Make sure first question renders and it has answer choices
  it("should start the quiz and show the first question", () => {
    cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
    mount(<Quiz />);
  
    cy.contains("Start Quiz").click(); // Simulating the handleStartQuiz
    cy.wait("@getQuestions"); // Get the response
  
    cy.get("h2").should("contain", "What is 2 + 2?");
  });
  it("should render choices for the first question", () => {
    cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
    mount(<Quiz />);
  
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");
  
    cy.get(".alert-secondary").should("have.length", 4); // 4 choices
  });

// Goes to the next question after the first one is completed
  it("should render the next question when an answer is selected", () => {
    cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
    mount(<Quiz />);
  
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");
  
    cy.get("button").eq(1).click(); 
    cy.get("h2").should("contain", "What is 3 + 3?"); 
  });

// Make sure the score renders once the quiz is finished
  it("should render the score when the quiz is complete", () => {
    cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
    mount(<Quiz />);
  
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");
  
    cy.get("button").eq(1).click(); 
    cy.get("button").eq(2).click(); 
    cy.wait(500);
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains(/^Your score: \d+\/\d+$/).should("exist").and("be.visible");
  });

// Make sure the user can take the quiz again
  it("should allow the user to restart the quiz", () => {
    cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
    mount(<Quiz />);
  
    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");
  
    cy.get("button").eq(1).click();
    cy.get("button").eq(2).click();

// Make sure the quiz has ended
    cy.contains("Quiz Completed").should("exist"); 

    cy.contains("Take New Quiz").click(); 
  
    cy.wait("@getQuestions");
  
    cy.get("h2").should("contain", "What is 2 + 2?"); 
  
    cy.get(".alert-secondary").should("have.length", 4);
  });
   
  
});