// Room Availability Counts (initial values)
let availableRooms = {
    suite: 10,
    deluxe: 15,
    standard: 45
};

// Base Handler Class
class HotelRoom  {
    constructor(name, nextHandler = null) {
        this.name = name;
        this.nextHandler = nextHandler;
    }

    handle(bidPrice) {
        if (this.canHandle(bidPrice)) {
            this.processBid(bidPrice);
        } else if (this.nextHandler) {
            this.nextHandler.handle(bidPrice);
        } else {
            displayMessage("Bid rejected. Please provide a new bid.");
        }
    }

    canHandle(bidPrice) {
        return false;
    }

    processBid(bidPrice) {
        // Default process logic (to be overridden by subclasses)
    }
}

// Suite Handler
class SuiteHandler extends HotelRoom  {
    constructor(nextHandler) {
        super("Suite", nextHandler);
    }

    canHandle(bidPrice) {
        return bidPrice >= 280 && availableRooms.suite > 0; // Suite accepts $280 or above
    }

    processBid(bidPrice) {
        availableRooms.suite -= 1; // Reduce the number of available suites
        displayMessage("Bid accepted for Suite!");
        updateRoomCounts(); // Update the room counts in the UI
    }
}

// Deluxe Handler
class DeluxeHandler extends HotelRoom  {
    constructor(nextHandler) {
        super("Deluxe", nextHandler);
    }

    canHandle(bidPrice) {
        return (bidPrice >= 150 && bidPrice < 280 && availableRooms.deluxe > 0) || 
               (bidPrice >= 280 && availableRooms.suite === 0 && availableRooms.deluxe > 0);
    }

    processBid(bidPrice) {
        availableRooms.deluxe -= 1; // Reduce the number of available deluxe rooms
        displayMessage("Bid accepted for Deluxe Room!");
        updateRoomCounts(); // Update the room counts in the UI
    }
}

// Standard Handler
class StandardHandler extends HotelRoom  {
    constructor() {
        super("Standard");
    }

    canHandle(bidPrice) {
        return (bidPrice >= 80 && bidPrice < 150 && availableRooms.standard > 0) || 
               (bidPrice >= 150 && availableRooms.deluxe === 0 && availableRooms.standard > 0);
    }

    processBid(bidPrice) {
        availableRooms.standard -= 1; // Reduce the number of available standard rooms
        displayMessage("Bid accepted for Standard Room!");
        updateRoomCounts(); // Update the room counts in the UI
    }
}

// Set up the chain of responsibility
let standardHandler = new StandardHandler();
let deluxeHandler = new DeluxeHandler(standardHandler);
let suiteHandler = new SuiteHandler(deluxeHandler);

// Function to process the bid
function submitBid() {
    let bidPrice = parseFloat(document.getElementById("bidPrice").value);
    
    if (isNaN(bidPrice)) {
        displayMessage("Please enter a valid bid price.");
        return;
    }

    suiteHandler.handle(bidPrice); // Start the chain of responsibility with the Suite handler
}

// Function to update the available room counts in the UI
function updateRoomCounts() {
    document.getElementById("suiteCount").textContent = availableRooms.suite;
    document.getElementById("deluxeCount").textContent = availableRooms.deluxe;
    document.getElementById("standardCount").textContent = availableRooms.standard;

    // Check if all rooms are sold out
    if (availableRooms.suite === 0 && availableRooms.deluxe === 0 && availableRooms.standard === 0) {
        displayMessage("All rooms are sold out!");
    }
}

// Function to display messages on the webpage
function displayMessage(message) {
    document.getElementById("message").textContent = message;
}
