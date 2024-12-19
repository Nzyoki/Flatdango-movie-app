const url = "http://localhost:3000/films";

document.addEventListener("DOMContentLoaded", () => {
    // Function to display details of the first film
    const displayFirstFilm = () => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const firstFilm = data[0];
                displayFilmDetails(firstFilm);
                setupBuyTicketButton(firstFilm);
            })
            .catch(error => console.error("Error fetching the first film:", error));
    };

    // Function to display the list of films
    const filmList = () => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const movieList = document.getElementById("films");
                movieList.innerHTML = ""; // Clear any existing items
                data.forEach(film => {
                    const listItem = document.createElement("li");
                    listItem.textContent = film.title;
                    listItem.classList.add("film", "item");
                    movieList.appendChild(listItem);

                    // Display movie details upon clicking
                    listItem.addEventListener("click", () => {
                        displayFilmDetails(film);
                        setupBuyTicketButton(film);
                    });

                    // Create and append the delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.className = "delete-button";
                    listItem.appendChild(deleteButton);

                    // Event listener to delete the movie
                    deleteButton.onclick = (event) => {
                        event.stopPropagation(); // Prevent triggering the li.onclick
                        fetch(`http://localhost:3000/films/${film.id}`, {
                            method: 'DELETE'
                        })
                        .then(() => {
                            listItem.remove(); // Remove the li from the DOM
                        })
                        .catch(error => console.error("Error deleting the film:", error));
                    };
                });
            })
            .catch(error => console.error("Error fetching the film list:", error));
    };

    // Function to display film details
    const displayFilmDetails = (film) => {
        const filmPoster = document.getElementById("poster");
        const filmTitle = document.getElementById("title");
        const filmRuntime = document.getElementById("runtime");
        const filmShowtime = document.getElementById("showtime");
        const filmTickets = document.getElementById("tickets");

        filmPoster.src = film.poster;
        filmTitle.textContent = film.title;
        filmRuntime.textContent = `Runtime: ${film.runtime} mins`;
        filmShowtime.textContent = `Showtime: ${film.showtime}`;
        filmTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
    };

    // Function to set up the buy ticket button
    const setupBuyTicketButton = (film) => {
        const buyTicketButton = document.getElementById("buyTicket");
        let availableTickets = film.capacity - film.tickets_sold;

        // Reset buy button to sold out if no tickets are available
        buyTicketButton.disabled = availableTickets === 0;
        buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";

        buyTicketButton.onclick = () => {
            if (availableTickets > 0) {
                film.tickets_sold += 1; // Update tickets sold
                availableTickets--;
                document.getElementById("tickets").textContent = `Available Tickets: ${availableTickets}`;
                buyTicketButton.disabled = availableTickets === 0;
                buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";
            }
        };
    };

    // Initialize the page by displaying the first film and the list of films
    displayFirstFilm();
    filmList();
});