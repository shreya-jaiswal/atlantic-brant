import p5 from 'p5';

const birdData = [
  { species: "Brant", totalSeen: 10015, proportion: 0.2180871913 },
  { species: "Ring-billed Gull", totalSeen: 6523, proportion: 0.1420452071 },
  { species: "Herring Gull", totalSeen: 3808, proportion: 0.08292321763 },
  { species: "Canada Goose", totalSeen: 3512, proportion: 0.07647750534 },
  { species: "Bonaparte's Gull", totalSeen: 2789, proportion: 0.06073341753 },
  { species: "Snow Goose", totalSeen: 1264, proportion: 0.02752493358 },
  { species: "European Starling", totalSeen: 1247, proportion: 0.02715474065 },
  { species: "Rock Pigeon (Feral Pigeon)", totalSeen: 1070, proportion: 0.0233003789 },
  { species: "American Black Duck", totalSeen: 1049, proportion: 0.02284308175 },
  { species: "White-throated Sparrow", totalSeen: 943, proportion: 0.02053481991 },
  { species: "Bufflehead", totalSeen: 927, proportion: 0.02018640303 },
  { species: "Greater Scaup", totalSeen: 761, proportion: 0.01657157789 },
  { species: "Mallard", totalSeen: 758, proportion: 0.01650624973 },
  { species: "Red-breasted Merganser", totalSeen: 748, proportion: 0.01628848918 },
  { species: "Boat-tailed Grackle", totalSeen: 650, proportion: 0.01415443578 },
  { species: "Ruddy Duck", totalSeen: 576, proportion: 0.01254300771 },
  { species: "Northern Shoveler", totalSeen: 513, proportion: 0.01117111624 },
  { species: "Great Black-backed Gull", totalSeen: 483, proportion: 0.01051783459 },
  { species: "Song Sparrow", totalSeen: 480, proportion: 0.01045250642 },
  { species: "House Sparrow", totalSeen: 470, proportion: 0.01023474587 }
];

const sketch = (p) => {
  const squareSize = 50;
  const squares = []; // Array to hold species and position for each square
  let totalSquares = 0;
  let gridCols, gridRows; // Number of columns and rows for the grid

  p.setup = function () {
    const canvas = p.createCanvas(600, 600);
    canvas.parent('visualization3');
    p.noStroke();

    // Only calculate the total number of squares needed based on proportions
    birdData.forEach(bird => {
      totalSquares += Math.floor(bird.proportion * 100); // Calculating squares based on proportion
    });

    // Step 1: Calculate grid dimensions (columns and rows)
    gridCols = Math.ceil(Math.sqrt(totalSquares)); // Number of columns
    gridRows = Math.ceil(totalSquares / gridCols); // Number of rows

    let squareCount = 0;

    // Fill in the squares based on bird data proportions
    birdData.forEach((bird, index) => {
      const speciesSquares = Math.floor(bird.proportion * 100);
      const color = (bird.species === "Brant") ? [255, 105, 180] : [p.map(index, 0, birdData.length - 1, 100, 220)];

      for (let i = 0; i < speciesSquares; i++) {
        squares.push({
          species: bird.species,
          totalSeen: bird.totalSeen,
          row: Math.floor(squareCount / gridCols),
          col: squareCount % gridCols,
          color: color // Pink for Brants, grey shades for other species
        });
        squareCount++;
      }
    });

    p.drawGrid();
  };

  p.drawGrid = function () {
    const offsetX = (p.width - gridCols * squareSize) / 2; // Center horizontally
    const offsetY = (p.height - gridRows * squareSize) / 2; // Center vertically

    let hoveredSpecies = null; // Track the species being hovered over

    // Check if any square is hovered and determine the species
    squares.forEach(square => {
      const x = offsetX + square.col * squareSize;
      const y = offsetY + square.row * squareSize;

      // Check if the mouse is hovering over this square
      const isHovered = p.mouseX >= x && p.mouseX <= x + squareSize && p.mouseY >= y && p.mouseY <= y + squareSize;
      if (isHovered) {
        hoveredSpecies = square.species; // Set the species being hovered over
      }
    });

    // Draw all squares and highlight all of the same species
    squares.forEach(square => {
      const x = offsetX + square.col * squareSize;
      const y = offsetY + square.row * squareSize;

      // Set the fill color: highlight the species being hovered
      if (hoveredSpecies === square.species) {
        p.fill(255); // White for hover highlight
      } else {
        p.fill(square.color);
      }

      p.rect(x + 10, y + 10, squareSize - 20, squareSize - 20, 10);
    });

    // Display the species name and total if hovering over a species
    if (hoveredSpecies) {
      const hoveredBird = squares.find(square => square.species === hoveredSpecies);
      p.fill(255); // White text for species name
      p.textSize(16);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(`${hoveredBird.species}: ${hoveredBird.totalSeen}`, p.width / 2, p.height - 20); // Display species name and total count
    }
  };

  // Redraw grid when the mouse moves to update hover state
  p.mouseMoved = function () {
    p.background(0);  // Clear and redraw the background
    p.drawGrid();     // Redraw the grid with hover state
  };
};

// Create a new p5 instance with the sketch function
new p5(sketch);
