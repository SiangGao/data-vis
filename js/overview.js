function drawCurvedLine(context, data, scaleX, scaleY) {
    context.beginPath();

    context.strokeStyle = "red";
    context.lineWidth = 5;
    context.globalAlpha = 1.0;
    context.moveTo(scaleX(data[0][0]), scaleY(data[0][1]));

    for (let i = 0; i < data.length - 1; ++i) {
        const x1 = scaleX(data[i][0]), x2 = scaleX(data[i + 1][0]);
        const y1 = scaleY(data[i][1]), y2 = scaleY(data[i + 1][1]);
        const x_mid = (x1 + x2) / 2;
        const y_mid = (y1 + y2) / 2;
        const cp_x1 = (x_mid + x1) / 2;
        const cp_x2 = (x_mid + x2) / 2;
        context.quadraticCurveTo(cp_x1, y1, x_mid, y_mid);
        context.quadraticCurveTo(cp_x2, y2, x2, y2);
    }

    context.stroke();
}

function drawDots(context, data, scaleX, scaleY) {

    const scaleR = d3.scaleLog()
        .range([10, 30])
        .domain([470, 17000]);

    data.forEach(function(d, i) {
        context.beginPath();
        context.arc(scaleX(d[0]), scaleY(d[1]), scaleR(d[2]), 0, 2*Math.PI);
        context.fillStyle="red";
        context.globalAlpha = 0.4;
        context.fill();
        context.closePath();

        context.beginPath();
        context.arc(scaleX(d[0]), scaleY(d[1]), 6, 0, 2*Math.PI);
        context.fillStyle="red";
        context.globalAlpha = 1.0;
        context.fill();
        context.closePath();

        // context.save();
        // context.translate(scaleX(d[0]), scaleY(d[1]));
        // context.rotate(-Math.PI / 2);

        // context.textAlign = 'left';

        // context.font = "bold 15px Arial";
        // context.globalAlpha = 1.0;
        // context.fillText("" + d[2], 15, 7);

        // context.restore();
    });
}

function drawCoordinate(context, scaleX, scaleY) {
    const xs = [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015];
    xs.forEach(function(d, i) {
        const x = scaleX(d);
        context.globalAlpha = 0.2;
        context.lineWidth = 2;
        context.fillStyle="red";
        context.beginPath();
        context.moveTo(x, scaleY(0) + 30);
        context.lineTo(x, scaleY(73000) - 30);
        context.stroke();
        context.font = "bold 15px Arial";
        context.textAlign = 'center';
        context.globalAlpha = 1.0;
        context.fillText("" + d, x, scaleY(0) + 50);
    });

    const ys = [100, 10000, 20000, 40000, 70000];
    ys.forEach(function(d, i) {
        const y = scaleY(d);
        context.globalAlpha = 0.2;
        context.lineWidth = 2;
        context.fillStyle="red";
        context.beginPath();
        context.moveTo(scaleX(1970) - 30, y);
        context.lineTo(scaleX(2017) + 30, y);
        context.stroke();
        context.font = "bold 15px Arial";
        context.textAlign = 'right';
        context.globalAlpha = 1.0;
        context.fillText("" + d, scaleX(1970) - 35, y + 5);
    });
}

function drawTitle(context) {
    context.fillStyle = "white";
    context.font = "bold 40px Arial";
    context.fillText("Terrorist Attacks Casualties by Year", 70, 70);
    context.font = "15px Arial";
    context.fillText("*Radius of each dot represents the count of terrorist attacks", 75, 90);
}

function draw(width, height) {
    var base = d3.select("#vis-overview");
    var chart = base.append("canvas")
        .attr("width", width)
        .attr("height", height);

    var context = chart.node().getContext("2d");

    // year, death, count
    var data = [[1970, 367, 651], [1971, 119, 471], [1972, 602, 568], [1973, 621, 473], [1974, 1122, 581], [1975, 781, 740], 
                [1976, 1158, 923], [1977, 874, 1319], [1978, 2664, 1526], [1979, 4378, 2662], [1980, 7532, 2662], 
                [1981, 8106, 2586], [1982, 7512, 2544], [1983, 11271, 2870], [1984, 15462, 3495], [1985, 12004, 2915], 
                [1986, 10524, 2860], [1987, 12141, 3183], [1988, 14014, 3721], [1989, 13617, 4324], [1990, 13261, 3887], 
                [1991, 15961, 4683], [1992, 19610, 5071], [1994, 14663, 3456], [1995, 20233, 3081], 
                [1996, 17383, 3058], [1997, 19468, 3197], [1998, 10754, 934], [1999, 7819, 1395], [2000, 8890, 1814], 
                [2001, 29662, 1906], [2002, 10356, 1333], [2003, 10126, 1278], [2004, 16911, 1166], [2005, 18258, 2017], 
                [2006, 23740, 2758], [2007, 33728, 3242], [2008, 27594, 4805], [2009, 27210, 4721], [2010, 23651, 4826], 
                [2011, 22566, 5076], [2012, 39381, 8522], [2013, 57679, 12036], [2014, 68853, 16903], [2015, 72833, 14965], 
                [2016, 69225, 13587], [2017, 48208, 10900]];

    const marginX = 100;
    const marginY = 100;

    const scaleX = d3.scaleLinear()
        .range([marginX, width - marginX])
        .domain([1970, 2017]);
    
    const scaleY = d3.scaleLinear()
        .range([height - marginY, marginY])
        .domain([0, 73000]);
    
    drawTitle(context);
    drawDots(context, data, scaleX, scaleY);
    drawCurvedLine(context, data, scaleX, scaleY);
    drawCoordinate(context, scaleX, scaleY);
}

draw(window.innerWidth, window.innerHeight);