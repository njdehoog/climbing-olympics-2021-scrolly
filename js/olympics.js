var hero_images = document.querySelectorAll(".hero-image img");
var scroller = scrollama();

function highlightRows(selector, indices, color) {
  d3.select(selector).select("tbody").selectAll("tr")
    .each(function (d, i) {
      if (indices.includes(i)) {
        d3.select(this).transition().duration(500).style("background-color", color);
      }
    });
}

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  // console.log(response);

  let step = response.element.dataset.step;
  let image_element = document.querySelector(`#hero-image-${step}`)
  if (image_element) {
    image_element.classList.add("visible");
  }

  if (step == 16) {
    highlightRows("#women-ranks table", [0,8], "#fbc531");
  } else if (step == 17) {
    highlightRows("#women-ranks table", [0], "#FAEDC8");
  } else if (step == 19) {
    highlightRows("#men-ranks table", [0,7,18], "#fbc531");
  } else if (step == 20) {
    highlightRows("#men-ranks table", [7,18], "#FAEDC8");
  }
}

function handleStepExit(response) {
  // response = { element, direction, index }
  // console.log(response);

  if (response.direction == "up") {
    let step = response.element.dataset.step;
    let image_element = document.querySelector(`#hero-image-${step}`)
    if (image_element) {
      image_element.classList.remove("visible");
    }

    if (step == 16) {
      highlightRows("#women-ranks table", [0,8], "transparent");
    } else if (step == 17) {
      highlightRows("#women-ranks table", [0,8], "#fbc531");
    } else if (step == 19) {
      highlightRows("#men-ranks table", [0,7,18], "transparent");
    } else if (step == 20) {
      highlightRows("#men-ranks table", [7,18], "#fbc531");
    }
  }
}

function init() {
  scroller
    .setup({
      step: "article#scrolly .step",
      debug: false,
      offset: 0.9
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  window.addEventListener("resize", scroller.resize);
}

init();

// The table generation function
function tabulate(data, columns, selector) {
  var table = d3.select(selector).insert("table", "figcaption"),
      thead = table.append("thead"),
      tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
          .text(function(column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
              return {column: column, value: row[column]};
          });
      })
      .enter()
      .append("td")
      .html(function(d) { return d.value; });
  
  return table;
}  


d3.csv("data/combined_women.csv").then(function(data) {
  tabulate(data, ["Name", "Rank speed", "Rank lead", "Rank bouldering"], "#women-ranks");  
});

d3.csv("data/combined_men.csv").then(function(data) {
  tabulate(data, ["Name", "Rank speed", "Rank lead", "Rank bouldering"], "#men-ranks");  
});