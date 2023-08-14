// Import React Testing Library and Jest
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

// Mock axios and react-slick
jest.mock("axios");
jest.mock("react-slick");

// Create a mock response for axios.get
const mockResponse = {
  data: {
    results: [
      // Add some mock Pokémon data here
    ],
  },
};

// Create a mock Slider component for react-slick
const Slider = ({ children }) => <div>{children}</div>;

describe("App component", () => {
  // Test that the component renders correctly
  test("renders the title and the type selector", () => {
    // Render the App component
    render(<App />);

    // Expect to see the title and the type selector on the screen
    expect(screen.getByText("Pokémon Carousel")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Pokémon Type:")).toBeInTheDocument();
  });

  // Test that the component fetches and displays Pokémon data
  test("fetches and displays Pokémon data", async () => {
    // Mock the axios.get function to return the mock response
    axios.get.mockResolvedValue(mockResponse);

    // Render the App component
    render(<App />);

    // Expect to see a loading message while fetching data
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the data to be fetched and displayed
    await screen.findByText("bulbasaur");

    // Expect to see the Pokémon images and names on the screen
    expect(screen.getByAltText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    // Add more expectations for other Pokémon here
  });

  // Test that the component filters Pokémon by type
  test("filters Pokémon by type", async () => {
    // Mock the axios.get function to return the mock response
    axios.get.mockResolvedValue(mockResponse);

    // Render the App component
    render(<App />);

    // Wait for the data to be fetched and displayed
    await screen.findByText("bulbasaur");

    // Get the type selector element
    const typeSelector = screen.getByLabelText("Select Pokémon Type:");

    // Change the value of the type selector to "fire"
    fireEvent.change(typeSelector, { target: { value: "fire" } });

    // Expect to see only fire-type Pokémon on the screen
    expect(screen.getByAltText("charmander")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.queryByAltText("bulbasaur")).not.toBeInTheDocument();
    expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    // Add more expectations for other Pokémon here
  });

  // Test that the component opens a Google search page when clicking on a Pokémon image or name
  test("opens a Google search page when clicking on a Pokémon image or name", async () => {
    // Mock the axios.get function to return the mock response
    axios.get.mockResolvedValue(mockResponse);

    // Mock the window.open function
    window.open = jest.fn();

    // Render the App component
    render(<App />);

    // Wait for the data to be fetched and displayed
    await screen.findByText("bulbasaur");

    // Click on the bulbasaur image
    fireEvent.click(screen.getByAltText("bulbasaur"));

    // Expect to call window.open with a Google search URL for bulbasaur Pokémon
    expect(window.open).toHaveBeenCalledWith(
      "https://www.google.com/search?q=bulbasaur%20Pok%C3%A9mon",
      "_blank"
    );

    // Click on the bulbasaur name
    fireEvent.click(screen.getByText("bulbasaur"));

    // Expect to call window.open with a Google search URL for bulbasaur Pokémon again
    expect(window.open).toHaveBeenCalledWith(
      "https://www.google.com/search?q=bulbasaur%20Pok%C3%A9mon",
      "_blank"
    );
  });
});
