Our project, a Chrome extension, can be either downloaded as an actual extension from the Chrome Web Store or loaded as
unpacked extension. We have not yet uploaded the extension to the Store because we hope to do so after adding even more
features. The most simple way to use our project is to download it as a ZIP file from the IDE, unzip it,
navigate to “chrome://extensions”, turn on “Developer Mode,” click “Load Unpacked,” and upload the unzipped file(s).
This will package our program.

To use our extension, users should select some words, and must click the “Let Me See!” icon in the extensions bar next to
the search bar. When clicked, a pop-up will appear with three tabs—-one for Wikipedia, one for WolframAlpha and one for Reddit.
Users can navigate between the results of the two websites by clicking on the tabs.

When no terms are selected, an error message will appear, stating “Request error: select text to see search results. When
terms are selected, the Wikipedia tab will display the top 5 article results. The top 10 Reddit results of
the search will be listed in the Reddit tab. When a result is clicked, a new tab will open with the content of the post—an image
if it is an image post, an article if it is an article post, and the Reddit post itself if it is a self post (text). In the
WolframAlpha tab, all the pods (different categories for a search term) and their headers will be displayed in a format where
users can scroll vertically. WolframAlpha’s search feature in their website also interprets unknown terms to a “did you mean”
term, if applicable. In this case, the extension will search for this “did you mean” term instead of the selected term.

Regardless of whether or not terms are selected, there will always be a “Go to site” button
on each tab. When no terms are selected, a new tab will open to the main page of the website. When terms are selected, the
button will instead open a new tab to the search results of the selected term(s). If no results are found, the button will
still open a new tab to the search results, so that users can explore the options in the site for themselves. In the case of a
“did you mean” WolframAlpha search, the button will redirect to the search of the “did you mean” term.

Each time the user clicks on the extension icon, previous search results and button redirects will automatically be
cleared and replaced with the new search results.