const parentDiv = document.getElementById("individual-incident-div");

let casualty_count_p5 = new p5(function(p) {

    const parentDiv = document.getElementById("individual-incident-div");
    const rectWidth = 10;
    const rectColor = "red";
    let coordinate;
    let yearCoordinate;
    let deathCoordinate;
    
    let data;

    p.preload = function() {
        data = p.loadJSON("http://gaosa.me/data-vis/data/days_highlight.json");
    };

    p.calcCoordinate = function() {
        const xlo = 10;
        const xhi = parentDiv.clientWidth - 10;
        const ylo = 60;
        const yhi = parentDiv.clientHeight;
        const scaleY = d3.scaleSymlog()
            .range([yhi, ylo])
            .domain([0, 1570])
            .constant(30);
    
        const scaleX = d3.scaleLinear()
            .range([xlo, xhi])
            .domain([0, 17531]);

        coordinate = [];
        
        for (let i in data) {
            coordinate.push([scaleX(data[i][0]), scaleY(data[i][1])]);
        }

        yearCoordinate = [];
        const years = [[1975, 1826], [1980, 3652], [1985, 5479], [1990, 7305], [1995, 9131], [2000, 10957],
            [2005, 12784], [2010, 14610], [2015, 16436]];
        for (let i = 0; i < years.length; ++i) {
            yearCoordinate.push([years[i][0], scaleX(years[i][1]), parentDiv.clientHeight]);
        }

        deathCoordinate = [];
        const deaths = [3, 20, 50, 100, 300, 750, 1500];
        for (let i = 0; i < deaths.length; ++i) {
            deathCoordinate.push([deaths[i], 0, scaleY(deaths[i])]);
        }
    }

    p.setup = function() {
        const canvas = p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
        canvas.style("position", "absolute");
        canvas.style("z-index", 2);
        p.calcCoordinate();
    };

    p.windowResized = function() {
        p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
        p.calcCoordinate();
    }

    p.drawHighlightDots = function() {
        for (let i = 0; i < coordinate.length; ++i) {
            p.fill(rectColor);
            p.noStroke();
            p.ellipse(coordinate[i][0], coordinate[i][1], rectWidth);
        }
    }

    p.split = function(str, l){
        let strs = [];
        while(str.length > l){
            let pos = str.substring(0, l).lastIndexOf(' ');
            pos = pos <= 0 ? l : pos;
            strs.push(str.substring(0, pos));
            let i = str.indexOf(' ', pos)+1;
            if(i < pos || i > pos+l)
                i = pos;
            str = str.substring(i);
        }
        strs.push(str);
        return strs.join('\n');
    }

    p.drawYearTicks = function() {
        for (let i = 0; i < yearCoordinate.length; ++i) {
            p.fill("black");
            p.rect(yearCoordinate[i][1] - 2, yearCoordinate[i][2] - 15, 4, 15);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.fill("black");
            p.textStyle(p.BOLD);
            p.textSize(15);
            p.noStroke();
            p.text(yearCoordinate[i][0], yearCoordinate[i][1] + 10, yearCoordinate[i][2]);
        }
    }

    p.drawDeathTicks = function() {
        for (let i = 0; i < deathCoordinate.length; ++i) {
            p.fill("red");
            p.rect(deathCoordinate[i][1], deathCoordinate[i][2] - 2, 15, 4);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.fill("red");
            p.textStyle(p.BOLD);
            p.textSize(15);
            p.noStroke();
            p.text(deathCoordinate[i][0], deathCoordinate[i][1], deathCoordinate[i][2] - 5);
        }
    }

    p.draw = function() {
        p.clear();
        p.drawHighlightDots();
        p.drawYearTicks();
        p.drawDeathTicks();
        let idx = -1;
        for (let i = 0; i < coordinate.length; ++i) {
            if (p.mouseX >= coordinate[i][0] - rectWidth / 2 &&
                p.mouseX < coordinate[i][0] + rectWidth / 2 &&
                p.mouseY >= coordinate[i][1] - rectWidth / 2 &&
                p.mouseY < coordinate[i][1] + rectWidth / 2) {
                    idx = i;
                    break;
                }
        }
        if (idx !== -1) {
            p.textSize(15);
            p.strokeWeight(2);
            p.stroke("black");
            p.textAlign(p.RIGHT, p.TOP);
            p.fill("red");
            p.text(p.split(data[idx][2], 60), coordinate[idx][0] - 20, coordinate[idx][1] - 40);
        }
    };
}, 'individual-incident-div');

const drawDots = function(width, height, data) {
    const base = d3.select("#individual-incident-div");
    const element = document.getElementById("d3-canvas");
    if (element !== null) {
        element.parentNode.removeChild(element);
    }
    const chart = base.append("canvas")
        .attr("width", width)
        .attr("height", height)
        .style("position", "absolute")
        .style("left", 0)
        .attr("id", "d3-canvas")
        .style("z-index", 1);
    const context = chart.node().getContext("2d");

    const paddingTop = 60;
    const domainDays = [0,17531];
    const domainDeath = [0, 1570];
    const paddingH = 10;

    const scaleY = d3.scaleSymlog()
        .range([height, paddingTop])
        .domain(domainDeath)
        .constant(30);
    
    const scaleX = d3.scaleLinear()
        .range([paddingH, width - paddingH])
        .domain(domainDays);

    data.forEach(function(d, i) {
        context.beginPath();
        context.arc(scaleX(d[0]), scaleY(d[1]), 4, 0, 2*Math.PI);
        context.fillStyle="red";
        context.globalAlpha = 0.4;
        context.fill();
        context.closePath();
    });
};

// Draw all the dots

const fetchAndDraw = function() {
    fetch('http://gaosa.me/data-vis/data/days_death.json')
        .then((resp) => resp.json())
        .then(function(data) {
            drawDots(parentDiv.clientWidth, parentDiv.clientHeight, data);
        });
};

fetchAndDraw();
window.addEventListener("resize", fetchAndDraw);
