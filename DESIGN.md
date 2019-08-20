Starting from the top, the main display of our extension is the "popup.html" page, but it is very skin and bones.
We have decided to keep the HTML page simple in order to be easily adaptable if we were to add more websites.
In its current configuration, we can integrate another website query into the page by adding another section, complete
with a label, content DIV, divider, and button.

Most of the grunt work of building the page is done by the "popup.js" file, which triggers when the "popup.html" file is
opened because it has been added as a script. In "popup.js", we recieve the query text of the selected page by sending a message
to "content_script.js", which has access to the information about the opened tab. This is then used in each function
corresponding to a website query: the display functions for Wikipedia, WolframAlpha, and Reddit. All functions fulfill the same duty of
taking in the query, getting a JSON object with the results from the application programming interface (API) or search, and then
parsing the JSON object into different elements that we can display using HTML. However, it seemed to be better to have three
separate functions for the websites because they require different code to create URLs, parse the JSON, and create appropriate
HTML, based on how each website asks for parameters and structures its response.

In order to inform the "popup.js" file of the current selected text, there is the previously mentioned "content_script.js"
file that is run when the "popup.html" document is created (after the extension is clicked on). This sets up a listener for
a message. The "popup.js" then sends a message with a "getSelection" method, triggering the message listener, and prompting a
response that consists of the current selected text. If the method is somehow not "getSelection", there will be an empty
response sent. This is necessary because content scripts are the only scripts that have access to this information. In other
words, "popup.js" cannot act in the same way as "content_script.js".

The "manifest.json" file is used to declare the basic info about the extension (e.g. icons, name) and its permissions (to
access the website's tabs and look up all urls). It also establishes the content script and makes it run when the popup icon
is opened. "all_frames: false" is an important distinction which means that the content script will be run in only the top
frame of the webpage. When "all_frames" is set to "true" (which we initially had done), there is a double execution of content
script, resulting in undefined queries.

Originally, we intended to include several APIs from Google, such as Youtube and Google Custom Search. However, with all of
these sites as well as Wikipedia, we had problems with the Content Security Policy, which would either throw an error for an
"inline" script even without any, or an error about a "chrome-extension-resource"and ask us to whitelist a filesystem. This was
puzzling, as we knew that the querying and parsing of the API-generated JSON element resulted in all the right information. The
only issue was that Chrome had many policies that, even after days of research, we could not bypass. Finally, after realizing that
a callback function argument was missing, we were able to successfully implement Wikipedia (in which we had already dealt with
its JSON and displays), but we had moved on beyond the Google-APIs. Reddit was a suitable replacement because its json could be
obtained through a simple search with JSON specified in the URL.