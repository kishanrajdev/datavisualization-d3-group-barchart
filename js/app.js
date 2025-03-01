const margin = {top: 40, left: 60};
const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.8;

const svg = d3.select(".d3-chart")
  .append("svg")
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', '0 0 ' + window.innerWidth  + ' ' + window.innerHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("../data/marriage-rate-and-divorce-rate.csv").then(data => {  // fetching data
  const years = new Set(data.map(d => +d.Year));
  const types = ["Marriage Rate", "Divorce Rate"];  //used for colors domain and inneX domain
  const yVals = data.map((d) => +d.Count);  // yscale range

  const yDomain = [0, Math.max(...yVals) + 1];

  // bottom x axis which shows years
  const mainXAxis = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.3);

  // x axis for types Marriage/Divorce
  const innerXAxis = d3.scaleBand()
      .domain(types)
      .padding("0.025")
      .range([ 0, mainXAxis.bandwidth() ]);

  //  Y axis
  const y = d3.scaleLinear()
        .domain(yDomain)
        .range([ height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(mainXAxis));

  svg.append("g")
    .call(d3.axisLeft(y));

  drawBarChart();

  function drawBarChart() {
    const color = d3.scaleOrdinal()
      .domain(types)
      .range(["blue","pink"]);

    const groupedData = d3.group(data, d => d.Year);
    
    const yearsG = svg.append("g")
      .selectAll()
      .data(groupedData)
      .join("g")
        .attr("transform", (d) => {
          return `translate(${mainXAxis(+d[0])},0)`;
        })

    yearsG.selectAll()
      .data(([, d]) => d)
      .join("rect")
      .attr("x", (d) => {
        return innerXAxis(d["General Marriage_Rate_and Divorce_Rate"]);
      })
      .attr("y", (d) => y(+d.Count))
      .attr("height", (d) => {
        return y(0) - y(d.Count);
      })
      .attr("width", (d) => innerXAxis.bandwidth())
      .attr("fill", d => {
        const yearData = groupedData.get(d.Year);
        if (yearData[0].Count - yearData[1].Count < 2) {
          return "red";
        }
        return color(d["General Marriage_Rate_and Divorce_Rate"])
      });
  }
})
