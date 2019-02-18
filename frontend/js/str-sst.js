const def = ["Amelogenin", "CSF1PO", "D2S1338", "D3S1358", "D5S818", "D7S820", "D8S1179", "D13S317", "D16S539", "D18S51", "D19S433", "D21S11", "FGA", "Penta_D", "Penta_E", "TH01", "TPOX", "vWA"];
const opt = ["D10S1248", "D1S1656", "D2S441", "D6S1043", "D12S391", "D22S1045", "DXS101", "DYS391", "F13A01", "F13B", "FESFPS", "LPL", "Penta_C", "SE33"];

var all = ["Amelogenin", "CSF1PO", "D1S1656", "D2S1338", "D2S441", "D3S1358", "D5S818", "D6S1043", "D7S820", "D8S1179", "D10S1248", "D12S391", "D13S317", "D16S539", "D18S51", "D19S433", "D21S11", "D22S1045", "DXS101", "DYS391", "F13A01", "F13B", "FESFPS", "FGA", "LPL", "Penta_C", "Penta_D", "Penta_E", "SE33", "TH01", "TPOX", "vWA"]

const ip = "localhost";//129.194.71.205
const html = $("html");

var jsonInput;
var jsonQuery;
var jsonResponse;

var dialogImport;
var dialogExport;

$(document).ready(function () {
    resetAll();
    parseURLVariables();
    bindEvents();
});

function resetAll() {
    resetMarkers();

    document.getElementById("input-tanabe").checked = true;
    document.getElementById("input-nonempty").checked = true;
    document.getElementById("check-include-Amelogenin").checked = false;
    document.getElementById("filter-score").value = 60;
    document.getElementById("filter-size").value = 200;
    document.getElementById("results").style.display = "none";
    document.getElementById("warning").style.display = "none";
    document.getElementById("extension").value = "csv";
    document.getElementById("inputFile").value = "";
    document.getElementById("samples").innerHTML = "";
    document.getElementById("sample-label").innerHTML = "";
    document.getElementById("sample-label").style.display = "none";
    document.getElementById("warning").style.opacity = "0";
    document.getElementById("results").style.opacity = "0";
}

function resetMarkers() {
    for (var i = 0; i < def.length; i++){
        document.getElementById("input-" + def[i]).value = "";
        document.getElementById("input-" + def[i]).style.color = "#000000";
        document.getElementById("input-" + def[i]).style.borderColor = "#ccc";
    }
    for (i = 0; i < opt.length; i++){
        document.getElementById("input-" + opt[i]).value = "";
        document.getElementById("input-" + opt[i]).style.color = "#000000";
        document.getElementById("input-" + opt[i]).style.borderColor = "#ccc";
        document.getElementById("check-" + opt[i]).checked = false;
        document.getElementById("input-" + opt[i]).disabled = true;
        document.getElementById("input-" + opt[i]).value = "";
        document.getElementById("label-" + opt[i]).style.color = "#7e7e7e";
    }
}

function parseURLVariables() {
    if (window.location.search.length > 0) {
        var a = window.location.search.substring(1).split("&");
        for (var i = 0; i < a.length; i++) {
            var q = a[i].split("=");
            var key = q[0].split("%20").join("_");
            var value = q[1].split("%20").join("").split("%22").join("").split("%27").join("");
            if (value !== undefined) {
                if (def.indexOf(key) !== -1) {
                    document.getElementById("input-" + key).value = value;
                } else if (opt.indexOf(key) !== -1) {
                    document.getElementById("input-" + key).value = value;
                    document.getElementById("input-" + key).disabled = false;
                    document.getElementById("check-" + key).checked = true;
                    document.getElementById("label-" + key).style.color = "#107dac";
                }
            }
        }
    }
}

function bindEvents() {
    for (var i = 0; i < def.length; i++){
        var e = document.getElementById("input-" + def[i]);
        if (i === 0) {
            e.onkeypress = e.onpaste = restrictXYEvent;
        } else {
            e.onkeypress = e.onpaste = restrictSTREvent;
        }
        e.onblur = blurEvent;
        e.oninput = inputEvent;
        validateElement(e);
    }
    for (i = 0; i < opt.length; i++){
        e = document.getElementById("input-" + opt[i]);
        e.onkeypress = e.onpaste = restrictSTREvent;
        e.onblur = blurEvent;
        e.oninput = inputEvent;
        validateElement(e);
    }
    window.onscroll = scrollable;
}

function restrictXYEvent(e) {
    if (e.ctrlKey || e.key === " " || e.key === "Backspace" || e.key === "Delete") return true;
    var char = e.type === "keypress" ? String.fromCharCode(e.keyCode || e.which) : (e.clipboardData || window.clipboardData).getData("Text");
    return !/[^\sxy,]/i.test(char);
}

function restrictSTREvent(e) {
    if (e.ctrlKey || e.key === " " || e.key === "Backspace" || e.key === "Delete")  return true;
    var char = e.type === "keypress" ? String.fromCharCode(e.keyCode || e.which) : (e.clipboardData || window.clipboardData).getData("Text");
    return !/[^\s\d,.]/.test(char);
}

function inputEvent() {
    document.getElementById("sample-label").innerHTML = "";
}

function blurEvent(e) {
    validateElement(document.getElementById(e.target.id));
}

function validateElement(e) {
    var s = e.value.split(" ").join("");
    var wrong = "color:#ff0000;border-color:#ff0000";
    var right = "color:#000000;border-color:#ccc";

    if (s.length === 0) {
        e.style = right;
    } else if (/[,.]{2,}|\d{3,}|(\.\d{2,}|[,.]$|^[,.])/.test(s)) {
        e.style = wrong;
    } else {
        if (e.id === "input-Amelogenin") {
            if (/^[XY,]+$/.test(s)) {
                e.style = right;
            } else {
                e.style = wrong;
            }
        } else {
            if (/^[0-9,.]+$/.test(s)) {
                e.style = right;
            } else {
                e.style = wrong;
            }
        }
    }
}

function scrollable() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scroller").style.display = "block";
    } else {
        document.getElementById("scroller").style.display = "none";
    }
}

function scrollUp() {
    document.body.scrollIntoView({behavior: 'instant', block: "start", inline: "nearest"});
}

function jsonParameters() {
    var map = {};
    map["algorithm"] = $("input[name=score]:checked").val();
    map["scoringMode"] = $("input[name=mode]:checked").val();
    map["scoreFilter"] = document.getElementById("filter-score").value;
    map["maxResults"] = document.getElementById("filter-size").value;
    map["includeAmelogenin"] = document.getElementById("check-include-Amelogenin").checked;

    return map;
}

function search() {
    jsonQuery = {};

    for (var i = 0; i < def.length; i++){
        var v = document.getElementById("input-" + def[i]).value.split(" ").join("");
        if (v !== '') {
            jsonQuery[def[i].split("_").join(" ")] = v;
        }
    }
    for (i = 0; i < opt.length; i++) {
        v = document.getElementById("input-" + opt[i]).value.split(" ").join("");
        if (v !== '') {
            jsonQuery[opt[i].split("_").join(" ")] = v;
        }
    }
    if (Object.keys(jsonQuery).length === 0) {
        document.getElementById("results").style.display = "none";
        document.getElementById("warning").style.display = "block";
        $("#warning").animate({opacity: 1}, 400, "swing");
        document.getElementById("warning").scrollIntoView({behavior: 'smooth', block: "end", inline: "nearest"});
        return;
    }
    jQuery.extend(jsonQuery, jsonParameters());
    html.addClass("waiting");
    $.ajax({
        type: "POST",
        url: "http://" + ip + ":8080/str-sst/api/query",
        data: JSON.stringify(jsonQuery),
        contentType: "application/json",
        dataType: "json",
        success: function (response, status, xhr) {
            if (response.results.length !== 0) {
                jsonResponse = response;
                table.build(response);
                document.getElementById("results").style.display = "table";
                $("#results").animate({opacity: 1}, 1000, "swing");
                document.getElementById("warning").style.display = "none";
                document.getElementById('caption').scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
            } else {
                document.getElementById("results").style.display = "none";
                document.getElementById("warning").style.display = "block";
                $("#warning").animate({opacity: 1}, 400, "swing");
                document.getElementById("warning").scrollIntoView({behavior: 'smooth', block: "end", inline: "nearest"});
            }
        },
        error: function (response, status, xhr) {
            alert("Error: The server is not responding\nPlease contact an administrator");
        },
        complete: function () {
            html.removeClass("waiting");
        }
    });
}

var table = {
    build: function (json) {
        var a, b, c, i, j, t, v, map;

        var nall = [];
        Array.prototype.push.apply(nall, all);

        for (i = 0; i < opt.length; i++) {
            if (document.getElementById("check-" + opt[i]).checked === false) {
                nall.splice(nall.indexOf(opt[i]), 1);
            }
        }

        var tr = "";
        var html = "<tr><th class='unselectable b0'><p class=\"sort-by\">Accession</p></th><th class='unselectable'><p class=\"sort-by\">Name</p></th><th class='unselectable'><p class=\"sort-by\">Nº Markers</p></th></th><th class='unselectable'><p class=\"sort-by\">Score</p></th>";
        for (i = 0; i < nall.length; i++) {
            a = nall[i].split("_").join(" ");
            if (a === 'Amelogenin') a = 'Amel';

            html += "<th class='unselectable'><p class=\"sort-by\">" + a + "</p></th>";
            tr += "<td>" + document.getElementById("input-" + nall[i]).value + "</td>";
        }
        html += "</tr><tr><td class='b0'>NA</td><td>Query</td><td>NA</td><td>NA</td></td>" + tr + "</tr>";

        for (i = 0; i < json.results.length; i++) {
            map = {};
            for (a in json.results[i].haplotypes) {
                for (b in json.results[i].haplotypes[a].markers) {
                    t = [];
                    for (c in json.results[i].haplotypes[a].markers[b].alleles) {
                        v = json.results[i].haplotypes[a].markers[b].alleles[c];
                        if (v.matched === false) {
                            t.push("<span style='color:red'>" + v.value + "</span>");
                        } else {
                            t.push(v.value);
                        }
                    }
                    var key = json.results[i].haplotypes[a].markers[b].name.split(" ").join("_");
                    if (nall.indexOf(key) > -1) {
                        if (json.results[i].haplotypes[a].markers[b].conflicted) {
                            map[key] = "<a class=\"as\" title=\"" + table._formatSources(json.results[i].haplotypes[a].markers[b].sources) + "\">" + t.join(",") + "</a>";
                        } else {
                            map[key] = t.join(",");
                        }
                    }
                }
                html += "<tr>";

                var cls;
                if ($("input[name=score]:checked").val() === "1") {
                    if (json.results[i].haplotypes[a].score >= 90.0) {
                        cls = "b1";
                    } else if (json.results[i].haplotypes[a].score < 80.0) {
                        cls = "b2";
                    } else {
                        cls = "b3";
                    }
                } else {
                    if (json.results[i].haplotypes[a].score >= 80.0) {
                        cls = "b1";
                    } else if (json.results[i].haplotypes[a].score < 60.0) {
                        cls = "b2";
                    } else {
                        cls = "b3";
                    }
                }
                var ver;
                if (a == 0 && json.results[i].haplotypes.length === 2) {
                    ver = " <span style='color:#373434'><i>Best</i></span>";
                } else if (a == 1) {
                    ver = " <span style='color:#373434'><i>Worst</i></span>";
                } else {
                    ver = "";
                }

                if (json.results[i].problematic) {
                    html += "<td class='" + cls + "'><a title=\"" + table._formatDescription(json.results[i].problem) + "\" style='color:red' href=\"https://web.expasy.org/cellosaurus/" + json.results[i].accession + "\" target=\"_blank\">" + json.results[i].accession + "</a>" + ver + "</td>"
                } else {
                    html += "<td class='" + cls + "'><a href=\"https://web.expasy.org/cellosaurus/" + json.results[i].accession + "\" target=\"_blank\">" + json.results[i].accession + "</a>" + ver + "</td>"
                }

                html += "<td>" + json.results[i].name + "</td>";
                if ((document.getElementById("check-include-Amelogenin").checked && json.results[i].haplotypes[a].markerNumber < 9) || (!document.getElementById("check-include-Amelogenin").checked && json.results[i].haplotypes[a].markerNumber < 8)) {
                    html += "<td><span style='color:red' title='A minimum of eight STR markers is recommended'>" + json.results[i].haplotypes[a].markerNumber + "</span></td>";
                } else {
                    html += "<td>" + json.results[i].haplotypes[a].markerNumber + "</td>";
                }
                html += "<td>" + json.results[i].haplotypes[a].score.toFixed(2) + "%</td>";

                for (j = 0; j < nall.length; j++){
                    v = map[nall[j]];
                    if (v === undefined) v = "";
                    html += "<td>" + v + "</td>";
                }
                html += "</tr>";
            }
        }
        var tableResults = $("#table-results");
        tableResults.empty();
        tableResults.append(html);
        table._makeSortable();
    },
    _formatDescription: function (description) {
        var dom = "<b>Problematic cell line:</b><br><span style='color:red;'>";
        dom += description
            .replace(".","</span>.")
            .replace(/(PubMed=)(\d+)/g, "$1<a class='ab' href='https://www.ncbi.nlm.nih.gov/pubmed/$2' target='_blank'>$2</a>")
            .replace(/(DOI=)([\w/.]+)/g, "$1<a class='ab' href='https://www.doi.org/$2' target='_blank'>$2</a>");

        return dom;
    },
    _formatSources: function (sources) {
        var dom = "<b>Source";
        if (sources.length > 1) {
            dom += "s";
        }
        dom += ":</b><br>";

        for (var i = 0; i < sources.length ; i++) {
            if (sources[i].startsWith("PubMed")) {
                dom += sources[i].substring(0, 7);
                dom += "<a class='ab' href='https://www.ncbi.nlm.nih.gov/pubmed/";
                dom += sources[i].substring(7);
                dom += "' target='_blank'>";
                dom += sources[i].substring(7);
                dom += "</a><br>";
            } else if (sources[i].startsWith("DOI")) {
                dom += sources[i].substring(0, 4);
                dom += "<a class='ab' href='https://www.doi.org/";
                dom += sources[i].substring(4);
                dom += "' target='_blank'>";
                dom += sources[i].substring(4);
                dom += "</a><br>";
            } else {
                dom += sources[i];
                dom += "<br>";
            }
        }
        return dom;
    },
    // Adapted from Nick Grealy
    // https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript/49041392#49041392
    _makeSortable: function () {
        const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
        const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : compare(v1, v2))
        (getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

        function compare(v1, v2) {
            if (v1.endsWith("%")) {
                while (v1.length < 7) {
                    v1 = "0" + v1;
                }
                while (v2.length < 7) {
                    v2 = "0" + v2;
                }
            }
            return v1.toString().localeCompare(v2)
        }

        document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
            var ths = document.querySelectorAll('th');
            for (var i = 0; i < ths.length; i++) {
                ths[i].getElementsByClassName('sort-by')[0].className = "sort-by";
            }
            if (this.asc) {
                th.getElementsByClassName('sort-by')[0].className = "sort-by asc";
            } else {
                th.getElementsByClassName('sort-by')[0].className = "sort-by des";
            }
            const table = th.closest('table');
            Array.from(table.querySelectorAll('tr:nth-child(n+3)'))
                .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                .forEach(tr => table.appendChild(tr) );
        })));
    }
};

function example() {
    resetMarkers();

    document.getElementById("input-Amelogenin").value = "X";
    document.getElementById("input-CSF1PO").value = "11,12";
    document.getElementById("input-D2S1338").value = "19,23";
    document.getElementById("input-D3S1358").value = "15,17";
    document.getElementById("input-D5S818").value = "11,12";
    document.getElementById("input-D7S820").value = "10";
    document.getElementById("input-D8S1179").value = "10";
    document.getElementById("input-D13S317").value = "11,12";
    document.getElementById("input-D16S539").value = "11,12";
    document.getElementById("input-D18S51").value = "13";
    document.getElementById("input-D19S433").value = "14";
    document.getElementById("input-D21S11").value = "29,30";
    document.getElementById("input-FGA").value = "20,22";
    document.getElementById("input-Penta_D").value = "11,13";
    document.getElementById("input-Penta_E").value = "14,16";
    document.getElementById("input-TH01").value = "6,9";
    document.getElementById("input-TPOX").value = "8,9";
    document.getElementById("input-vWA").value = "17,19";
    document.getElementById("sample-label").innerHTML = "Example <b style='color:#ac3dad'>HT-29</b> loaded";
    $("#sample-label").show("slide", 400);
}

function check(i) {
    if (document.getElementById("input-" + i).disabled) {
        document.getElementById("input-" + i).disabled = false;
        document.getElementById("label-" + i).style.color = "#107dac";
    } else {
        document.getElementById("input-" + i).disabled = true;
        document.getElementById("input-" + i).value = "";
        document.getElementById("label-" + i).style.color = "#7e7e7e";
    }
}

var importFile = {
    read: function (files) {
        switch (files[0].name.split(".").pop()) {
            case undefined:
                break;
            case "csv":
            case "tsv":
            case "txt":
                importFile._csv(files[0]);
                break;
            case "xls":
                importFile._xls(files[0]);
                break;
            case "xlsx":
                importFile._xlsx(files[0]);
                break;
        }
    },
    load: function (value) {
        for (var i = 0; i < jsonInput.length; i++) {
            if (jsonInput[i].description === value) {
                resetMarkers();

                for (var property in jsonInput[i]) {
                    if (jsonInput[i].hasOwnProperty(property)) {
                        var name = importFile._format(property);

                        if (def.includes(name)) {
                            var e = document.getElementById("input-"+ name);
                            e.value = jsonInput[i][property].split(" ").join("");
                            validateElement(e)
                        }
                        if (opt.includes(name)) {
                            document.getElementById("check-" + opt[i]).checked = true;
                            document.getElementById("label-" + i).style.color = "#107dac";
                            e = document.getElementById("input-" + i);
                            e.disabled = false;
                            e.value = jsonInput[i][property].split(" ").join("");
                            validateElement(e)
                        }
                    }
                }
                document.getElementById("sample-label").innerHTML = "Sample <b style='color:#ac3dad'>" + value + "</b> loaded";
                $("#sample-label").show("slide", 400);
                dialogImport.dialog("close");
                break;
            }
        }
    },
    _callback: function (results) {
        if (results.length === 0) {
            document.getElementById("samples").innerHTML = "<p style='color:red;'><b>Error:</b><br>The input file does not contain any samples</p>";
            jsonInput = {};
            $("#batch").button().attr('disabled', true).addClass('ui-state-disabled');
            return;
        }
        if (results[0].Marker) {
            jsonInput = importFile._genemapper(results);
        } else {
            jsonInput = results;
            importFile._rename(jsonInput);
        }
        if (importFile._validate(jsonInput)) {
            if (jsonInput.length === 1) {
                importFile.load(jsonInput[0].description);
            } else {
                var samples = "<i>Click on a sample to load its values in the form or use<br>the <b>Batch Query</b> option to search them all</i><br><br><b>" + jsonInput.length + " samples detected:</b><br>";
                for (var i = 0; i < jsonInput.length; i++) {
                    jsonInput = $.extend(jsonInput, jsonParameters());
                    samples += "<a class='sample' onclick='importFile.load(this.innerText)'>" + jsonInput[i].description + "</a><br>"
                }
                document.getElementById("samples").innerHTML = samples;
                $("#batch").button().attr('disabled', false).removeClass('ui-state-disabled');
            }
        } else {
            document.getElementById("samples").innerHTML = "<p style='color:red;'><b></b>Error:</b><br>The input file is badly formatted</p>";
            jsonInput = {};
            $("#batch").button().attr('disabled', true).addClass('ui-state-disabled') ;
        }
    },
    _genemapper: function (results) {
        var array = [];
        var object = {};

        var sample = results[0]["Sample Name"];
        for (var i = 0; i < results.length; i++) {
            if (results[i]["Sample Name"] !== sample) {
                object.description = sample;
                array.push(object);
                object = {};
                sample = results[i]["Sample Name"];
            }
            var alleles = [];
            var j = 1;
            while(results[i]["Allele " + j]) {
                if (results[i]["Allele " + j] !== "") {
                    alleles.push(results[i]["Allele " + j])
                }
                j++;
            }
            object[results[i].Marker] = alleles.join(",");
        }
        object.description = sample;
        array.push(object);

        return array;
    },
    _format: function (key) {
        var name = key.trim().toUpperCase().replace(" ", "_");

        switch (name) {
            case "AM":
            case "AMEL":
            case "AMELOGENIN":
                return "Amelogenin";
            case "THO1":
                return "TH01";
            case "CSF1P0":
                return "CSF1PO";
            case "VWA":
                return "vWA";
            case "PENTA_C":
            case "PENTA_D":
            case "PENTA_E":
                return "Penta_" + name[name.length -1];
            default:
                return name;
        }
    },
    _rename: function (json) {
        for (var i = 0; i < json.length; i++) {
            if (json[i]["SampleReferenceNbr"] !== undefined) {
                json[i].description = json[i]["SampleReferenceNbr"];
                delete json[i]["SampleReferenceNbr"];
            } else if (json[i]["Sample Name"] !== undefined) {
                json[i].description = json[i]["Sample Name"];
                delete json[i]["Sample Name"];
            } else if (json[i]["Name"] !== undefined) {
                json[i].description = json[i]["Name"];
                delete json[i]["Name"];
            }
        }
    },
    _validate: function(json) {
        if (json.some(e => !e.hasOwnProperty("description"))) return false;
        if (json.some(e => e["description"].length === 0)) return false;

        var c = 0;
        for (var i = 0; i < json.length; i++) {
            for (var property in json[i]) {
                if (json[i].hasOwnProperty(property)) {
                    if (def.includes(property) || opt.includes(property)) c++;
                }
            }
        }
        return c > 0;
    },
    _csv: function (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                importFile._callback(results.data);
            }
        });
    },
    _xls: function (file) {
        var reader = new FileReader();
        reader.onload = event => {
            const bstr = event.target.result;
            const wb = XLS.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const results =  XLS.utils.sheet_to_json(ws, { defval: "" });
            importFile._callback(results);
        };
        reader.readAsBinaryString(file);
    },
    _xlsx: function (file) {
        var reader = new FileReader();
        reader.onload = event => {
            const bstr = event.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const results = XLSX.utils.sheet_to_json(ws, { defval: ""});
            importFile._callback(results);
        };
        reader.readAsBinaryString(file);
    },
    openDialog: function () {
        dialogImport.dialog("open");
    }
};

var exportTable = {
    toCSV: function (name) {
        var csv = this._tableToCSV(document.getElementById('table-results'));
        var blob = new Blob([csv], {type: "text/csv"});

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, name + ".csv");
        } else {
            this._downloadAnchor(URL.createObjectURL(blob), name + ".csv");
        }
    },
    toJson: function (name) {
        var blob = new Blob([JSON.stringify(jsonResponse, undefined, 2)], {type: "text/plain"});

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, name + ".json");
        } else {
            this._downloadAnchor(URL.createObjectURL(blob), name + ".json");
        }
    },
    toPdf: function (name) {
        var element = $("#table-results");
        var ori = element.width() > element.height() + 2 ? "l" : "p";
        var opt = {
            margin:       0,
            filename:     name + ".pdf",
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'px', format: [element.width(), element.height()+2], orientation: ori }
        };
        html2pdf().set(opt).from(document.getElementById("table-results")).save();
    },
    _downloadAnchor: function (content, name) {
        var anchor = document.createElement("a");
        anchor.style = "display:none !important";
        anchor.id = "downloadanchor";
        document.body.appendChild(anchor);

        if ("download" in anchor) {
            anchor.download = name;
        }
        anchor.href = content;
        anchor.click();
        anchor.remove();
    },
    _tableToCSV: function (table) {
        var rows = [];
        var cells = [];

        var metadata = ",\"#";
        metadata += "Description: '";
        metadata += jsonResponse.description;
        metadata += "';Data set: 'Cellosaurus release ";
        metadata += jsonResponse.cellosaurusRelease;
        metadata += "';Run on: '";
        metadata += jsonResponse.runOn;
        metadata += "';STR-SST version: '";
        metadata += jsonResponse.softwareVersion;
        metadata += "';Algorithm: '";
        metadata += jsonResponse.parameters.algorithm;
        metadata += "';Scoring Mode: '";
        metadata += jsonResponse.parameters.scoringMode;
        metadata += "';Score Filter: '";
        metadata += jsonResponse.parameters.scoreFilter;
        metadata += "';Max Results: '";
        metadata += jsonResponse.parameters.maxResults;
        metadata += "';Include Amelogenin: '";
        metadata += jsonResponse.parameters.includeAmelogenin;
        metadata += "'\"";

        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[0].cells.length; j++) {
                var cell = '"';
                cell += table.rows[i].cells[j].textContent;
                if (j === 0 &&  table.rows[i].cells[j].innerHTML.startsWith('<a title="Problematic')) {
                    cell += " (Problematic cell line)"
                }
                cell += '"';
                cells.push(cell);
            }
            if (i === 0) {
                rows.push(cells.join(",") + metadata);
            } else {
                rows.push(cells.join(","));
            }
            cells = [];
        }
        return rows.join("\r\n");
    },
    switchIcon: function (v) {
        switch (v) {
            case "csv":
                document.getElementById("imgCsv").style.display = "block";
                document.getElementById("imgJson").style.display = "none";
                document.getElementById("imgPdf").style.display = "none";
                break;
            case "json":
                document.getElementById("imgCsv").style.display = "none";
                document.getElementById("imgJson").style.display = "block";
                document.getElementById("imgPdf").style.display = "none";
                break;
            case "pdf":
                document.getElementById("imgCsv").style.display = "none";
                document.getElementById("imgJson").style.display = "none";
                document.getElementById("imgPdf").style.display = "block";
                break;
        }
    },
    openDialog: function () {
        dialogExport.dialog("open");
    }
};

$(function () {
    dialogImport = $("#dialog-import").dialog({
        autoOpen: false,
        height: 550,
        width: 500,
        modal: true,
        resizable: false,
        closeText: null,
        hide: {effect: "fold", duration: 300},
        show: {effect: "fold", duration: 300},
        buttons: [{
                text: "Batch Query",
                disabled: true,
                id: "batch",
                click: function() {
                    html.addClass("waiting");
                    $.ajax({
                        type: "POST",
                        url: "http://" + ip + ":8080/str-sst/api/batch",
                        data: JSON.stringify(jsonInput),
                        contentType: "application/json",
                        dataType: 'text',
                        mimeType: 'text/plain; charset=x-user-defined',
                        success: function (response, status, xhr) {
                            var filename = "Cellosaurus_STR_Results.zip";

                            var newContent = "";
                            for (var i = 0; i < response.length; i++) {
                                newContent += String.fromCharCode(response.charCodeAt(i) & 0xFF);
                            }
                            var bytes = new Uint8Array(newContent.length);
                            for (i = 0; i < newContent.length; i++) {
                                bytes[i] = newContent.charCodeAt(i);
                            }
                            var type = xhr.getResponseHeader('Content-Type');
                            var blob = new Blob([bytes], { type: type });

                            var URL = window.URL || window.webkitURL;
                            var downloadUrl = URL.createObjectURL(blob);

                            if (filename) {
                                var a = document.createElement("a");
                                if (typeof a.download === 'undefined') {
                                    window.location = downloadUrl;
                                } else {
                                    a.href = downloadUrl;
                                    a.download = filename;
                                    document.body.appendChild(a);
                                    a.click();
                                }
                            } else {
                                window.location = downloadUrl;
                            }
                            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                            dialogImport.dialog("close");
                        },
                        error: function (response, status, xhr) {
                            console.log(response);
                            console.log(status);
                            console.log(xhr);

                            alert("Error: The server is not responding\nPlease contact an administrator");
                        },
                        complete: function () {
                            html.removeClass("waiting");
                        }
                    });
                }
            },
            {
                text: "Close",
                click: function() {
                    dialogImport.dialog("close");
                }
            },
        ],
        open: function () {
            $("#background").addClass("blur");
        },
        close: function () {
            $("#background").removeClass("blur");
        },
    });
    dialogImport.find("form").on("submit", function (event) {
        event.preventDefault();
    });
    dialogExport = $("#dialog-export").dialog({
        autoOpen: false,
        height: 350,
        width: 450,
        modal: true,
        resizable: false,
        closeText: null,
        hide: {effect: "fold", duration: 300},
        show: {effect: "fold", duration: 300},
        buttons: {
            Save: function () {
                jsonResponse.description = $("#description").val();

                var val = document.getElementById("extension").value;
                switch (val) {
                    case "csv":
                        exportTable.toCSV($("#name").val());
                        break;
                    case "json":
                        exportTable.toJson($("#name").val());
                        break;
                    case "pdf":
                        exportTable.toPdf($("#name").val());
                        break;
                }
                dialogExport.dialog("close");
            },
            Close: function () {
                dialogExport.dialog("close");
            }
        },
        open: function () {
            $("#background").addClass("blur");
        },
        close: function () {
            $("#background").removeClass("blur");
        }
    });
    dialogExport.find("form").on("submit", function (event ) {
        event.preventDefault();
    });
    $(document).tooltip({
        content: function () {
            return $(this).prop('title');
        },
        position: {
            my: "left center",
            at: "right+15 center"
        },
        show: null,
        close: function (event, ui) {
            ui.tooltip.hover(
                function () {
                    $(this).stop(true).fadeTo(400, 1);
                },
                function () {
                    $(this).fadeOut("400", function () {
                        $(this).remove();
                    })
                }
            );
        }
    });
});
