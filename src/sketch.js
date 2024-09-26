import p5 from 'p5';

// Your data array
const data = [
    { x: "1959", y: 217426 },
    { x: "1960", y: 238338 },
    { x: "1961", y: 265688 },
    { x: "1962", y: 124490 },
    { x: "1963", y: 173494 },
    { x: "1964", y: 182700 },
    { x: "1965", y: 185982 },
    { x: "1966", y: 171850 },
    { x: "1967", y: 219024 },
    { x: "1968", y: 213450 },
    { x: "1969", y: 130831 },
    { x: "1970", y: 106511 },
    { x: "1971", y: 150965 },
    { x: "1972", y: 73242 },
    { x: "1973", y: 40835 },
    { x: "1974", y: 87653 },
    { x: "1975", y: 88408 },
    { x: "1976", y: 127003 },
    { x: "1977", y: 73605 },
    { x: "1978", y: 42740 },
    { x: "1979", y: 43554 },
    { x: "1980", y: 69242 },
    { x: "1981", y: 97028 },
    { x: "1982", y: 104532 },
    { x: "1983", y: 123465 },
    { x: "1984", y: 127317 },
    { x: "1985", y: 146325 },
    { x: "1986", y: 110368 },
    { x: "1987", y: 109443 },
    { x: "1988", y: 131183 },
    { x: "1989", y: 137939 },
    { x: "1990", y: 135444 },
    { x: "1991", y: 147744 },
    { x: "1992", y: 184780 },
    { x: "1993", y: 100627 },
    { x: "1994", y: 157159 },
    { x: "1995", y: 148172 },
    { x: "1996", y: 105903 },
    { x: "1997", y: 121465 },
    { x: "1998", y: 137974 },
    { x: "1999", y: 171628 },
    { x: "2000", y: 157156 },
    { x: "2001", y: 145259 },
    { x: "2002", y: 181620 },
    { x: "2003", y: 164526 },
    { x: "2004", y: 129582 },
    { x: "2005", y: 123248 },
    { x: "2006", y: 146639 },
    { x: "2007", y: 150559 },
    { x: "2008", y: 161612 },
    { x: "2009", y: 151273 },
    { x: "2010", y: 139350 },
    { x: "2011", y: 148886 },
    { x: "2012", y: 149157 },
    { x: "2013", y: 111750 },
    { x: "2014", y: 132936 },
    { x: "2015", y: 111434 },
    { x: "2016", y: 157899 },
    { x: "2017", y: 161661 },
    { x: "2018", y: 169749 },
    { x: "2019", y: 120109 },
    { x: "2020", y: 139875 },
    { x: "2022", y: 109194 },
    { x: "2023", y: 121475 },
    { x: "2024", y: 112842 }
];

const sketch = (p) => {
  const margin = 50;
  let tooltipData = null;  // To hold the tooltip information

  p.setup = function() {
    const canvas = p.createCanvas(800, 400);
    canvas.parent('visualization');
    canvas.style('display', 'block');
    
    p.background(0); // Black background
    p.fill(255); // White text
    
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);

    p.drawLineChart();
    p.drawKey();
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
    const maxValue = p.max(data.map(d => d.y));  // Max value from data

    // Draw X and Y axes
    p.stroke(255);
    p.line(margin, p.height - margin, p.width - margin, p.height - margin);  // X-axis
    p.line(margin, margin, margin, p.height - margin);  // Y-axis

    // For hover tooltips
    tooltipData = null;

    // Draw smoothed line
    p.noFill();
    p.stroke(188,80,144);
    p.strokeWeight(2);
    p.beginShape();

    // Add extra control points to ensure the first and last points are connected
    p.curveVertex(margin, p.map(data[0].y, minValue, maxValue, p.height - margin, margin));  // First extra point

    for (let i = 0; i < data.length; i++) {
      const x = p.map(i, 0, data.length - 1, margin, p.width - margin);
      const y = p.map(data[i].y, minValue, maxValue, p.height - margin, margin);
      p.curveVertex(x, y);  // Smoothing the line
    }

    p.curveVertex(p.width - margin, p.map(data[data.length - 1].y, minValue, maxValue, p.height - margin, margin));  // Last extra point
    p.endShape();

    // Draw filled ellipses and handle hover state
    for (let i = 0; i < data.length; i++) {
      const x = p.map(i, 0, data.length - 1, margin, p.width - margin);
      const y = p.map(data[i].y, minValue, maxValue, p.height - margin, margin);

      // Check if the mouse is hovering over this point
      if (p.dist(p.mouseX, p.mouseY, x, y) < 8) {
        tooltipData = { x, y, year: data[i].x, population: data[i].y };
        p.fill(255,166,1);  // Change color on hover
      } else {
        p.fill(188,80,144);  // Normal color for points
      }

      // Draw the ellipse (hover state changes color)
      p.noStroke();
      p.ellipse(x, y, 8, 8);  // Small circle to mark the data points
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
        p.text(data[i].x, x, p.height - margin + 20);  // X-axis ticks
    }
  
    // Add Y-axis ticks – Starting from 0, increments of 50k
    const yIncrement = 50000;
    for (let yTick = 0; yTick <= maxValue; yTick += yIncrement) {
      const y = p.map(yTick, minValue, maxValue, p.height - margin, margin);  // Correct mapping for Y-ticks
      p.textAlign(p.RIGHT);
      p.text(p.nf(yTick, 0, 0), margin - 10, y);  // Y-axis ticks
    }

    // Draw tooltip if hovering over a data point
    if (tooltipData) {
      const tooltipWidth = 100;
      const tooltipHeight = 50;

      // Adjust tooltip position to prevent it from being cut off at the edges
      let tooltipX = tooltipData.x + 10;
      if (tooltipX + tooltipWidth > p.width) {  // If tooltip is going off-screen, adjust its position
        tooltipX = tooltipData.x - tooltipWidth - 10;
      }

      p.fill(50, 50, 50, 500);  // Semi-transparent background for tooltip
      p.noStroke();
      p.rect(tooltipX, tooltipData.y - 30, tooltipWidth, tooltipHeight, 5);  // Tooltip box
      p.fill(255);  // White text inside tooltip
      p.textAlign(p.LEFT);
      p.textSize(10);
      p.text(`Year: ${tooltipData.year}`, tooltipX + 5, tooltipData.y - 15);
      p.text(`Population: ${tooltipData.population}`, tooltipX + 5, tooltipData.y - 5);
    }
  };

  // Function to draw the key
  p.drawKey = function() {
    p.textSize(12);
    p.textAlign(p.LEFT);

    // Key for the line (Yellow)
    p.fill(188,80,144);
    p.noStroke();
    p.ellipse(margin + 10, margin + 10, 10, 10);  // Yellow circle
    p.fill(255);  // White text for the key
    p.text('Population Over Time', margin + 25, margin + 15);
  };

  // Redraw chart when the mouse moves to update hover state
  p.mouseMoved = function() {
    p.background(0);  // Clear and redraw the background
    p.drawLineChart();  // Redraw the chart with hover state
  };
};

// Create a new p5 instance with the sketch function
new p5(sketch);
