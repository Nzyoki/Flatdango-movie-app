const url = "http://localhost:3000/films";

document.addEventListener("DOMContentLoaded", () => {
    //first film details
    const displayFirstFilm = () => {
        fetch(url)
            .then(r => r.json())
            .then(data => {
                const firstFilm = data[0];
                displayFilmDetails(firstFilm); 
                setupBuyTicketButton(firstFilm); 
            })
            .catch(error => console.error("Error fetching the first film:", error));
    };

    //list of films
    const filmList = () => {
        fetch(url)
            .then(r => r.json())
            .then(data => {
                const movieList = document.getElementById("films");
                movieList.innerHTML = ""; // Clear any existing items
                data.forEach(film => {
                    const listItem = document.createElement("li");
                    listItem.textContent = film.title;
                    listItem.classList.add("film", "item");
                    movieList.appendChild(listItem);

                    // display movie details upon clicking
                    listItem.addEventListener("click", () => {
                        displayFilmDetails(film);
                        setupBuyTicketButton(film);
                    });
                });
            })
            .catch(error => console.error("Error fetching the film list:", error));
    };

    // Display film details
    const displayFilmDetails = (film) => {
        const filmPoster = document.getElementById("poster");
        const filmTitle = document.getElementById("tittle");
        const filmRuntime = document.getElementById("runtime");
        const filmShowtime = document.getElementById("showtime");
        const filmTickets = document.getElementById("tickets");

        filmPoster.src = film.poster;
        filmTitle.textContent = film.title;
        filmRuntime.textContent = `Runtime: ${film.runtime} mins`;
        filmShowtime.textContent = `Showtime: ${film.showtime}`;
        filmTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
    };

    // BUY TICKET BUTTON
    const setupBuyTicketButton = (film) => {
        const buyTicketButton = document.getElementById("buyTicket");
        let availableTickets = film.capacity - film.tickets_sold;

        // RESET BUY BUTTON TO SOLD OUT
        buyTicketButton.disabled = availableTickets === 0;
        buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";

        buyTicketButton.onclick = () => {
            if (availableTickets > 0) {
                availableTickets--;
                document.getElementById("tickets").textContent = `Available Tickets: ${availableTickets}`;
                buyTicketButton.disabled = availableTickets === 0;
                buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";
            }
        };
    };
});
