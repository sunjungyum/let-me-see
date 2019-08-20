/* global chrome */

// Gets the query term(s) from the selected text
function getSelection() {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, { method: "getSelection" }, function(response) {
            // If response is returned
            if (response && response.data) {
                // Encodes symbols and spaces for URL use
                var query = encodeURIComponent(response.data);

                // Clear outputs and button URLs from past queries
                $("#wiki_content").empty().append("Wikipedia search results are loading...");
                $("#wolfram_content").empty().append("WolframAlpha search results are loading...");
                $("#reddit_content").empty().append("Reddit search results are loading...");
                $("#wiki_button").attr("href", "https://www.wikipedia.org");
                $("#wolfram_button").attr("href", "https://www.wolframalpha.com");
                $("#reddit_button").attr("href", "https://www.reddit.com");

                // Display updated search results
                display_wikipedia(query);
                display_wolfram(query);
                display_reddit(query);
            }
            // If response is undefined
            else {
                $("#wiki_content").append("Request error: select text to see search results");
                $("#wolfram_content").append("Request error: select text to see search results");
                $("#reddit_content").append("Request error: select text to see search results");
                var divider = document.createElement("DIV");
                divider.setAttribute("style", "width: 500px; height: 14px; float:left; display:inline-block");
                $("#reddit_content").append(divider);
            }
        });
    });
}

// Display Wikipedia search results using query
function display_wikipedia(received_query) {
    // API query for Wikipedia
    var query_url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=6&namespace=0&search=" + received_query;

    // Create DIV element for the entire output
    var output = document.createElement("DIV");

    // AJAX is used to get JSON elements from search results
    $.ajax({
        type: "GET",
        url: query_url,
        dataType: "json",
    }).then(function(results) {
        // If/else for whether or not there are results for the search query
        if (results[1].length > 0) {
            // Traverse through top 5 results, appending to "output" DIV
            for (let i = 0; i < results[1].length; i++) {
                // Divider for visual reasons
                var divider = document.createElement("DIV");
                divider.setAttribute("style", "width: 500px; height: 20px; float:left; display:inline-block");
                if (i > 0) {
                    output.appendChild(divider);
                }

                // Header for title of article
                var header = document.createElement("H3");
                header.innerHTML = results[1][i];
                output.appendChild(header);

                // Paragraph for excerpt from article
                var excerpt = document.createElement("P");
                if (results[2][i].includes("may refer to:")) {
                    excerpt.innerHTML = "Wikipedia provides several meanings for the selected text. Click to read more!";
                } else if (results[2][i] == "") {
                    excerpt.innerHTML = "Wikipedia does not provide an excerpt for this article. Click to read more!";
                } else {
                    excerpt.innerHTML = results[2][i];
                }
                output.appendChild(excerpt);


                // Button to link to article
                var more = document.createElement("a");
                more.innerHTML = "Read more";
                more.setAttribute("href", results[3][i]);
                more.setAttribute("class", "visual_button_3");
                more.setAttribute("target", "_blank");
                output.appendChild(more);

                // Divider for visual reasons
                output.appendChild(divider.cloneNode());
                output.appendChild(document.createElement("HR"));
            }
        } else {
            output.append("No results found!");
        }

        // Append entire "output" variable and button to the Wikipedia section in the HTML popup
        $("#wiki_content").empty().append(output);
        $("#wiki_button").attr("href", "https://en.wikipedia.org/wiki/special:search/" + received_query);

    });
}

// Display WolframAlpha search results using query
function display_wolfram(received_query) {
    // API query for WolframAlpha
    var query_url = "http://api.wolframalpha.com/v2/query?input=" + received_query + "&appid=Y53E88-HKW7PAJL7A&output=json";

    // Create DIV element for the entire output
    var output = document.createElement("DIV");

    // AJAX is used to get JSON elements from search results
    $.ajax({
        type: "GET",
        url: query_url,
        dataType: "json",
    }).then(function(data) {
        // Store variable for data in case query needs to be replaced by suggestion
        var correct_data = data;

        // If there is a better suggested query for the inputted text, update the "correct_data" variable
        if (correct_data.queryresult.hasOwnProperty("didyoumeans")) {
            query_url = "http://api.wolframalpha.com/v2/query?input=" + correct_data.queryresult.didyoumeans["val"] +
                "&appid=Y53E88-HKW7PAJL7A&output=json";
            $.ajax({
                type: "GET",
                url: query_url,
                dataType: "json",
            }).then(function(new_data) {
                correct_data = new_data;
            });
        }

        // If/else for whether or not there are results for the search query
        if (correct_data.queryresult.pods) {
            // Traverse through each of the pods (different categories of the same answer) and append to the "output" variable
            for (let i = 0; i < correct_data.queryresult.pods.length; i++) {
                // Divider for visual reasons
                var divider = document.createElement("DIV");
                divider.setAttribute("style", "width: 500px; height: 14px; float:left; display:inline-block");
                if (i > 0) {
                    output.appendChild(divider);
                }

                // Header for section title from each "pod" in WolframAlpha, removes "pod" label
                var title = correct_data["queryresult"]["pods"][i]["title"];
                var header = document.createElement("H3");
                header.innerHTML = title;
                output.appendChild(header);
                output.appendChild(divider.cloneNode());

                // Traverse through subpods (subsections) of each pod, taking the images for each pod and adding it to output
                for (let j = 0; j < correct_data["queryresult"]["pods"][i]["subpods"].length; j++) {
                    var image = document.createElement("IMG");
                    image.setAttribute("src", correct_data["queryresult"]["pods"][i]["subpods"][j]["img"]["src"]);
                    output.appendChild(image);
                }

                // Divider for visual reasons
                if (i < correct_data.queryresult.pods.length) {
                    output.appendChild(divider.cloneNode());
                    output.appendChild(document.createElement("HR"));
                }
            }
            output.appendChild(divider.cloneNode());
            console.log(data);
            console.log(data["queryresult"]["sources"]);
            if (data["queryresult"]["sources"]) {
                var source = document.createElement("P");
                source.innerHTML = "Primary Source: Wolfram|Alpha Knowledgebase, 2019";
                output.appendChild(source);
            }

        
        } else {
            output.append("No results found!");
        }
        // output.appendChild(divider.cloneNode());
        // console.log(data);
        // console.log(data["queryresult"]["sources"]);
        // if (data["queryresult"]["sources"]) {
        //     var source_list = document.createElement("DIV");
        //     for (let i = 0; i < data["queryresult"]["sources"].length; i++) {
        //         var source = document.createElement("a");
        //         source.innerHTML = data["queryresult"]["sources"][i]["text"];
        //         source.setAttribute("href", data["queryresult"]["sources"][i]["url"]);
        //         source.setAttribute("class", "visual_button_3");
        //         source.setAttribute("target", "_blank");
        //         output.appendChild(source);
        //     }
        // }
        // Append entire "output" variable and button to the WolframAlpha section in the HTML popup
        $("#wolfram_content").empty().append(output);
        $("#wolfram_button").attr("href", "https://www.wolframalpha.com/input/?i=" + received_query);

    });
}

// Display Reddit search results using query
function display_reddit(received_query) {
    // API query for Reddit
    var query_url = "http://www.reddit.com/search.json?q=" + received_query;

    // Create DIV element for the entire output
    var output = document.createElement("DIV");

    // AJAX is used to get JSON elements from search results
    $.ajax({
        type: "GET",
        url: query_url,
        dataType: "json",
    }).then(function(results) {
        // If/else for whether or not there are results for the search query
        if (results.data.children.length > 0) {
            // Traverse through the top 10 posts and append to "output" variable
            var posts = results.data.children;
            for (var i = 0; i < 10 && i < posts.length; i++) {
                var anchor = document.createElement("a");
                anchor.innerHTML = posts[i].data.title;
                anchor.setAttribute("href", posts[i].data.url);
                anchor.setAttribute("class", "visual_button_2");
                anchor.setAttribute("target", "_blank");
                output.appendChild(anchor);
            }
        } else {
            output.append("No results found!");

            // Divider for visual reasons
            var divider = document.createElement("DIV");
            divider.setAttribute("style", "width: 500px; height: 14px; float:left; display:inline-block");
            output.append(divider);
        }

        // Append entire "output" variable and button to the Reddit section in the HTML popup
        $("#reddit_content").empty().append(output);
        $("#reddit_button").attr("href", "https://www.reddit.com/search?q=" + received_query);
    });
}

// Calls the main function
getSelection();