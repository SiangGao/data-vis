let individual_incident_p5 = new p5(function(p) {
    
    // Data containing year, casualties and incident count
    const data = [[1970, 367, 651], [1971, 119, 471], [1972, 602, 568], [1973, 621, 473], [1974, 1122, 581], [1975, 781, 740], 
        [1976, 1158, 923], [1977, 874, 1319], [1978, 2664, 1526], [1979, 4378, 2662], [1980, 7532, 2662], 
        [1981, 8106, 2586], [1982, 7512, 2544], [1983, 11271, 2870], [1984, 15462, 3495], [1985, 12004, 2915], 
        [1986, 10524, 2860], [1987, 12141, 3183], [1988, 14014, 3721], [1989, 13617, 4324], [1990, 13261, 3887], 
        [1991, 15961, 4683], [1992, 19610, 5071], [1994, 14663, 3456], [1995, 20233, 3081], 
        [1996, 17383, 3058], [1997, 19468, 3197], [1998, 10754, 934], [1999, 7819, 1395], [2000, 8890, 1814], 
        [2001, 29662, 1906], [2002, 10356, 1333], [2003, 10126, 1278], [2004, 16911, 1166], [2005, 18258, 2017], 
        [2006, 23740, 2758], [2007, 33728, 3242], [2008, 27594, 4805], [2009, 27210, 4721], [2010, 23651, 4826], 
        [2011, 22566, 5076], [2012, 39381, 8522], [2013, 57679, 12036], [2014, 68853, 16903], [2015, 72833, 14965], 
        [2016, 69225, 13587], [2017, 48208, 10900]];

    const boundaryColor = "rgb(172, 18, 20)";
    const fillColor = "rgba(172, 18, 20, 0.6)";
    const parentDiv = document.getElementById("casualty-count-div");
    const dotWidth = 20;

    p.setup = function() {
        p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
        p.textStyle(p.BOLD);
    };

    p.windowResized = function() {
        p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
    }

    p.drawData = function(xlo, xhi, ylo, yhi, isCasualty, which) {
        const idx = isCasualty ? 1 : 2;
        const yRangeHi = isCasualty ? 73000 : 17000;
        // Whether higher value means smaller y (appears higher on canvas)
        const reverse = isCasualty;
        // X-axis: From 1970 to 2017
        // Y-axis: From 0 to 73000 if casualty
        //         From 0 to 17000 if incident count
        const len = data.length;
          
        if (which.includes("area")) {
            // Draw Area
            p.fill(fillColor);
            p.noStroke();
            p.beginShape();
            for (let i = -1; i <= len; ++i) {
                let xx = 0, yy = 0;
                if (i === -1) {
                    xx = 1970;
                } else if (i === len) {
                    xx = 2017;
                } else {
                    xx = data[i][0];
                    yy = data[i][idx];
                }
                const x = p.map(xx, 1970, 2017, xlo, xhi);
                const y = reverse ? p.map(yy, 0, yRangeHi, yhi, ylo)
                            : p.map(yy, 0, yRangeHi, ylo, yhi);
                p.vertex(x, y);
            }
            p.endShape();
        }
        
        if (which.includes("dots")) {
          // Draw dots
          p.fill(boundaryColor);
          p.noStroke();
          for (let i = 0; i < len; ++i) {
            const x = p.map(data[i][0], 1970, 2017, xlo, xhi);
            const y = reverse ? p.map(data[i][idx], 0, yRangeHi, yhi, ylo)
                      : p.map(data[i][idx], 0, yRangeHi, ylo, yhi);
            p.ellipse(x, y, dotWidth);
          }
        }
        
        if (which.includes("line")) {
          // Draw line
          p.noFill();
          p.stroke(boundaryColor);
          p.strokeWeight(dotWidth / 3);
          p.beginShape();
          for (let i = 0; i < len; ++i) {
            const x = p.map(data[i][0], 1970, 2017, xlo, xhi);
            const y = reverse ? p.map(data[i][idx], 0, yRangeHi, yhi, ylo)
                      : p.map(data[i][idx], 0, yRangeHi, ylo, yhi);
            p.vertex(x, y);
          }
          p.endShape();
        }
        
    }

    p.drawVerticalLine = function(ylo, h) {
        p.noStroke();
        p.fill(boundaryColor);
        p.rect(p.mouseX - 1, ylo, 2, h)
    }

    p.drawHighlightCircle = function(i, xlo, xhi, ylo, yhi, isCasualty, count) {
        if (i == 23) {
            return;
        }
        if (i > 23) {
            --i;
        }
        const yRangeHi = isCasualty ? 73000 : 17000;
        // Whether higher value means smaller y (appears higher on canvas)
        const reverse = isCasualty;
        const idx = isCasualty ? 1 : 2;
        const x = p.map(data[i][0], 1970, 2017, xlo, xhi);
        const y = reverse ? p.map(data[i][idx], 0, yRangeHi, yhi, ylo)
                  : p.map(data[i][idx], 0, yRangeHi, ylo, yhi);
        p.noStroke();
        p.fill(fillColor);
        p.ellipse(x, y, dotWidth * 2);
        p.fill(boundaryColor);
        p.stroke('black');
        p.strokeWeight(2);
        if (isCasualty) {
            if (i <= 40) {
                p.textAlign(p.LEFT, p.BOTTOM);
                p.text(count, x + 10, y - 10);
            } else {
                p.textAlign(p.RIGHT, p.BOTTOM);
                p.text(count, x - 10, y - 10);
            }
        } else {
            if (i <= 40) {
                p.textAlign(p.LEFT, p.TOP);
                p.text(count, x + 10, y + 10);
            } else {
                p.textAlign(p.RIGHT, p.TOP);
                p.text(count, x - 10, y + 10);
            }
        }
    }

    p.drawYearText = function(year, ylo, yhi) {
        p.textAlign(p.CENTER, p.BOTTOM);
        p.stroke('black');
        p.strokeWeight(2);
        p.textSize(20);
        p.text(year, p.mouseX, ylo);
        p.textAlign(p.CENTER, p.TOP);
        p.text(year, p.mouseX, yhi);
    }

    p.draw = function() {
        p.clear();
        //p.background('black');
        const marginh = 40, marginv = 70;
        
        p.drawData(marginh, p.width - marginh, marginv, p.height / 2 - 10, true, [ 'line', 'dots']);
        p.drawData(marginh, p.width - marginh, p.height / 2 + 10, p.height - marginv, false, ['line', 'dots']);
        
        const d = p.mouseX - marginh + dotWidth/2;
        const w = (p.width - 2 * marginh) / (2017 - 1970);
        const idx = Math.floor(d / w);
        if (idx >= 0 && idx <= 47) {
            const d = p.mouseX - marginh + dotWidth/2;
            const w = (p.width - 2 * marginh) / (2017 - 1970);
            const idx = Math.floor(d / w);
            let death = 0, count = 0;
            p.drawVerticalLine(40, p.height - 80);
            if (idx < 23) {
                death = data[idx][1];
                count = data[idx][2];
            } else if (idx > 23) {
                death = data[idx - 1][1];
                count = data[idx - 1][2];
            }
            p.drawYearText(1970 + idx, 40, p.height - 40);
            if (d % w < dotWidth) {
                p.drawHighlightCircle(idx, marginh, p.width - marginh, marginv, p.height / 2 - 10, true, death);
                p.drawHighlightCircle(idx, marginh, p.width - marginh, p.height / 2 + 10, p.height - marginv, false, count);
            }
        }
    };
}, 'casualty-count-div');
