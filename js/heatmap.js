let heatmap_p5 = new p5(function(p) {
    
    const parentDiv = document.getElementById("heatmap-div");
    let dat, years, data, groups;

    p.preload = function() {
        dat = p.loadJSON("data/group_cnt.json");
    };

    p.setup = function() {
        const canvas = p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
        canvas.style("position", "absolute");
        canvas.style("z-index", 2);
        years = dat.years;
        data = dat.data;
        groups = dat.groups;
        p.textStyle(p.BOLD);
    };

    p.windowResized = function() {
        p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
    };

    p.calcColor = function(val) {
        const color2 = '0000FF';  // Blue
        const color1 = 'FF0000';  // Red
        
        const hex = function(x) {
            x = x.toString(16);
            return (x.length == 1) ? '0' + x : x;
        };
        // const scaleY = d3.scaleSymlog()
        //     .range([0.0, 1.0])
        //     .domain([0, 1454])
        //     .constant(30);
        const scaleY = d3.scaleLog()
            .range([0.0, 1.0])
            .domain([1, 1455]);
        const ratio = scaleY(val + 1);

        const r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
        const g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
        const b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

        const color = p.color('#' + hex(r) + hex(g) + hex(b));
        color.setAlpha(ratio * 255);

        return color;
    }

    p.draw = function() {
        p.clear();
        const top = 100, left = 100, right = 100, bottom = 30, count = 20;
        const rectHeight = (p.height - top - bottom) / count;
        const rectWidth = (p.width - left - right) / years.length;
        for (let i = 0; i < count; ++i) {
            for (let j = 0; j < years.length; ++j) {
                p.fill(p.calcColor(data[i][j]));
                p.noStroke();
                p.rect(left + j * rectWidth, top + i * rectHeight, rectWidth, rectHeight);
            }
        }
        if (p.mouseX >= left && p.mouseX < p.width - right && p.mouseY >= top && p.mouseY < p.height - bottom) {
            const x = Math.floor((p.mouseX - left) / rectWidth);
            const y = Math.floor((p.mouseY - top) / rectHeight);
            p.noFill();
            p.stroke("white");
            p.strokeWeight(2);
            p.rect(left, top + y * rectHeight, p.width - left - right, rectHeight);
            p.rect(left + x * rectWidth, top, rectWidth, p.height - top - bottom);
            p.textAlign(p.CENTER, p.TOP);
            p.noStroke();
            p.fill("white");
            p.textSize(15);
            p.text(years[x], left + rectWidth / 2 + x * rectWidth, p.height - bottom + 10);
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text(years[x], left + rectWidth / 2 + x * rectWidth, top - 10);
            p.textAlign(p.RIGHT, p.CENTER);
            const regExp = /\(([^)]+)\)/;
            const matches = regExp.exec(groups[y]);
            let text = groups[y];
            if (matches !== null) {
                text = matches[1];
            }
            p.text(text, left - 10, top + rectHeight / 2 + y * rectHeight);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(text, p.width - right + 10, top + rectHeight / 2 + y * rectHeight);
            if (x < years.length - 2) {
                p.text(data[y][x], (x + 1) * rectWidth + left + 10, top + rectHeight / 2 + y * rectHeight);
            }
            if (x >= 2) {
                p.textAlign(p.RIGHT, p.CENTER);
                p.text(data[y][x], x * rectWidth + left - 10, top + rectHeight / 2 + y * rectHeight);
            }
        }
    };
}, 'heatmap-div');