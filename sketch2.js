

// Your data array (NY and NJ)
const data = [
  { year: 2001, NY: 25201, NJ: 96685 },
  { year: 2002, NY: 37675, NJ: 124590 },
  { year: 2003, NY: 22222, NJ: 118005 },
  { year: 2004, NY: 20748, NJ: 83850 },
  { year: 2005, NY: 24759, NJ: 73805 },
  { year: 2006, NY: 60324, NJ: 63815 },
  { year: 2007, NY: 65745, NJ: 67305 },
  { year: 2008, NY: 56115, NJ: 88190 },
  { year: 2009, NY: 57030, NJ: 73935 },
  { year: 2010, NY: 65580, NJ: 55485 },
  { year: 2011, NY: 67260, NJ: 61195 },
  { year: 2012, NY: 66250, NJ: 69560 },
  { year: 2013, NY: 54100, NJ: 39730 },
  { year: 2014, NY: 66543, NJ: 48535 },
  { year: 2015, NY: 51000, NJ: 43115 },
  { year: 2016, NY: 57265, NJ: 83894 },
  { year: 2017, NY: 72250, NJ: 70120 },
  { year: 2018, NY: 76770, NJ: 72190 },
  { year: 2019, NY: 47390, NJ: 53510 },
  { year: 2020, NY: 59110, NJ: 60830 },
  { year: 2022, NY: 45370, NJ: 48990 },
  { year: 2023, NY: 54660, NJ: 54865 },
  { year: 2024, NY: 49390, NJ: 49320 }
];

const sketch = (p) => {
  const margin = 50;
  let tooltipData = null;  // To hold the tooltip information
  let hoverState = "";     // To track whether hovering on NY or NJ

  p.setup = function() {
    const canvas = p.createCanvas(800, 400);
    canvas.parent('visualization2');
    canvas.style('display', 'block');
    
    p.background(0); // Black background
    p.fill(255); // White text
    
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);

    p.drawLineChart();
  };

  // Function to draw the line chart
  p.drawLineChart = function() {
    if (data.length === 0) {
      console.log('No data available.');
      return;
    }

    const chartWidth = p.width - margin * 2;
    const chartHeight = p.height - margin * 2;

    // Force minValue to be 0 to ensure the Y-axis starts from 0
    const minValue = 0;
    const maxValue = p.max(data.map(d => Math.max(d.NY, d.NJ)));  // Max value from NY and NJ combined

    // Draw X and Y axes
    p.stroke(255);
    p.line(margin, p.height - margin, p.width - margin, p.height - margin);  // X-axis
    p.line(margin, margin, margin, p.height - margin);  // Y-axis

    // Tooltip reset
    tooltipData = null;
    hoverState = "";  // Reset hover state

    // Set the line for NY
    p.stroke(255,99,97);  // Blue color for NY
    p.strokeWeight(2);  // Line thickness for NY
    p.noFill();  // No fill for the line chart

    p.beginShape();  // Begin NY line
    // Add extra control points at the beginning and end
    p.curveVertex(margin, p.map(data[0].NY, minValue, maxValue, p.height - margin, margin));  // First extra point
    for (let i = 0; i < data.length; i++) {
      const x = p.map(i, 0, data.length - 1, margin, p.width - margin);
      const y = p.map(data[i].NY, minValue, maxValue, p.height - margin, margin);
      p.curveVertex(x, y);  // Use curveVertex for smooth line
    }
    p.curveVertex(p.width - margin, p.map(data[data.length - 1].NY, minValue, maxValue, p.height - margin, margin));  // Last extra point
    p.endShape();

    // Set the line for NJ
    p.stroke(89,80,141);  // Red color for NJ
    p.strokeWeight(2);  // Line thickness for NJ

    p.beginShape();  // Begin NJ line
    p.curveVertex(margin, p.map(data[0].NJ, minValue, maxValue, p.height - margin, margin));  // First extra point for NJ
    for (let i = 0; i < data.length; i++) {
      const x = p.map(i, 0, data.length - 1, margin, p.width - margin);
      const y = p.map(data[i].NJ, minValue, maxValue, p.height - margin, margin);
      p.curveVertex(x, y);  // Use curveVertex for smooth line
    }
    p.curveVertex(p.width - margin, p.map(data[data.length - 1].NJ, minValue, maxValue, p.height - margin, margin));  // Last extra point for NJ
    p.endShape();

    // Add ellipses to data points for both NY and NJ
    for (let i = 0; i < data.length; i++) {
      const xNY = p.map(i, 0, data.length - 1, margin, p.width - margin);
      const yNY = p.map(data[i].NY, minValue, maxValue, p.height - margin, margin);

      const xNJ = p.map(i, 0, data.length - 1, margin, p.width - margin);
      const yNJ = p.map(data[i].NJ, minValue, maxValue, p.height - margin, margin);

      // Detect hover for NY
      if (p.dist(p.mouseX, p.mouseY, xNY, yNY) < 8) {
        tooltipData = { x: xNY, y: yNY, year: data[i].year, value: data[i].NY, state: "NY" };
        hoverState = "NY";
        p.fill(255,166,1);  // Highlight hover state for NY
      } else {
        p.fill(255,99,97);  // Normal color for NY
      }
      p.noStroke();
      p.ellipse(xNY, yNY, 8, 8);  // NY points

      // Detect hover for NJ
      if (p.dist(p.mouseX, p.mouseY, xNJ, yNJ) < 8) {
        tooltipData = { x: xNJ, y: yNJ, year: data[i].year, value: data[i].NJ, state: "NJ" };
        hoverState = "NJ";
        p.fill(255,166,1);  // Highlight hover state for NJ
      } else {
        p.fill(89,80,141);  // Normal color for NJ
      }
      p.noStroke();
      p.ellipse(xNJ, yNJ, 8, 8);  // NJ points
    }

    // Draw the tooltip if there is hover data
    if (tooltipData) {
      const tooltipWidth = 100;
      const tooltipHeight = 50;
      
      // Adjust tooltip position to prevent it from being cut off at the edges
      let tooltipX = tooltipData.x + 10;
      if (tooltipX + tooltipWidth > p.width) {
        tooltipX = tooltipData.x - tooltipWidth - 10;  // Adjust if going off the screen
      }

      p.fill(50, 50, 50, 500);  // Semi-transparent background for tooltip
      p.noStroke();
      p.rect(tooltipX, tooltipData.y - 30, tooltipWidth, tooltipHeight, 5);  // Tooltip box

      // White text inside tooltip
      p.fill(255);  
      p.textAlign(p.LEFT);
      p.textSize(10);
      p.text(`Year: ${tooltipData.year}`, tooltipX + 5, tooltipData.y - 15);
      p.text(`${tooltipData.state}: ${tooltipData.value}`, tooltipX + 5, tooltipData.y - 5);
    }

    // Set axis font style
    p.fill(150);  // Grey color for axis labels
    p.noStroke();
    p.textSize(12);  // Small font size for axis labels
    p.textAlign(p.CENTER);

    // Add X-axis ticks (Years) – Show every 5th year
    for (let i = 0; i < data.length; i += 5) {
        const x = p.map(i, 0, data.length - 1, margin, p.width - margin);
        p.textAlign(p.CENTER);
        p.text(data[i].year, x, p.height - margin + 20);  // X-axis ticks
    }
  // Add key for New York and New Jersey
p.textSize(12);
p.textAlign(p.LEFT);

// Key for New York (Blue)
p.fill(255,99,97);
p.noStroke();
p.ellipse(margin + 100, margin + 15, 10, 10);  // Blue circle for NY
p.fill(255);  // White text for the key
p.text('New York', margin + 110, margin + 15);

// Key for New Jersey (Red)
p.fill(89,80,141);
p.noStroke();
p.ellipse(margin + 100, margin + 35, 10, 10);  // Red circle for NJ
p.fill(255);  // White text for the key
p.text('New Jersey', margin + 110, margin + 35);

    // Add Y-axis ticks – Starting from 0, increments of 50k
    const yIncrement = 50000;
    for (let yTick = 0; yTick <= maxValue; yTick += yIncrement) {
      const y = p.map(yTick, minValue, maxValue, p.height - margin, margin);  // Correct mapping for Y-ticks
      p.textAlign(p.RIGHT);
      p.text(p.nf(yTick, 0, 0), margin - 10, y);  // Y-axis ticks
    };
  };

  
  // Redraw chart when the mouse moves to update hover state
  p.mouseMoved = function() {
    p.background(0);  // Clear and redraw the background
    p.drawLineChart();  // Redraw the chart with hover state
  };
};

// Create a new p5 instance with the sketch function
new p5(sketch);
