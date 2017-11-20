import * as d3 from "d3";
import './main.css';

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
	.then((response) => response.json())
	.then(function(data) {
		chart(data);
	})
	.catch(function(error) {
		console.log(error);
	});

function chart(data) {
	const dataset = data.data,
	w = 1000,
	h = 500,
	padding = 60,
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	parseTime = d3.timeParse("%Y-%m-%d");

	dataset.forEach((d)=>d[0]=parseTime(d[0]));

	const svg = d3.select("main")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

	const yScale = d3.scaleLinear()
						.domain([0,d3.max(dataset,(d)=>d[1])]).nice()
						.range([h-padding,padding]);
	const xScale = d3.scaleTime()
						.domain([d3.min(dataset,(d)=>d[0]),d3.max(dataset,(d)=>d[0])]).nice()
						.range([padding, w-padding]);

	let div = d3.select("body").append("div")
		.attr("class","tooltip")
		.style("opacity", 0);

	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class","bar")
		.attr("x", (d,i) => xScale(d[0]))
		.attr("y", (d,i) => yScale(d[1]))
		.attr("width", 4)
		.attr("height", (d,i) => h - padding - yScale(d[1]))
		.on("mouseover", (d)=>{
			let parseDate = d3.timeFormat("%B-%Y");
			let info = parseDate(d[0]) + "<br/>" + d[1];
			div.transition()
				.duration(200)
				.style("opacity",.9);
			div.html(info)
				.style("left", (d3.event.pageX)+"px")
				.style("top", (d3.event.pageY-28)+"px");
			})
		.on("mouseout", (d)=> {
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});

	const xAxis = d3.axisBottom(xScale);
	svg.append("g")
		.attr("transform","translate(0,"+(h-padding) +")")
		.call(xAxis);


	const yAxis = d3.axisLeft(yScale);
	svg.append("g")
		.attr("transform", "translate("+(padding)+",0)")
		.call(yAxis);
	svg.append("text")
		.attr("transform","rotate(-90)")
		.attr("y", padding)
		.attr("x", 0-(h/2))
		.attr("dy","1em")
		.style("text-anchor","middle")
		.text("In billions of dollars");

	svg.append("text")
		.attr("x", (w/2))
		.attr("y", 0+padding/2)
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.style("text-decoration","underline")
		.text("United States Gross Domestic Product");
}