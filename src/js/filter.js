// For expand/collapse functionality on filters.

/* global $ */

/*
 * Show/hide the corresponding arrow up and down buttons based on the expand state
 * @param {DOM element} expandButtonElm - The DOM element of the expand button.
 * @param {String} expandButtonState - A value of "true" or "false".
 */
function setExpandSVGState(expandButtonElm, expandButtonState) {
	const arrowupSVG = $(expandButtonElm).find(".arrowup");
	arrowupSVG[expandButtonState === "false" ? "hide" : "show"]();
	const arrowdownSVG = $(expandButtonElm).find(".arrowdown");
	arrowdownSVG[expandButtonState === "true" ? "hide" : "show"]();
}

// Clicking the expand button on the filter header opens/closes the filter
const expandButtons = document.querySelectorAll(".filter .filter-expand-button");

for (let i = 0; i < expandButtons.length; i++) {
	// At the page load, show/hidearrow up and down buttons based on the aria-expand state of the expand button
	const initialExpandedValue = expandButtons[i].getAttribute("aria-expanded");
	setExpandSVGState(expandButtons[i], initialExpandedValue);

	// Add event listener for expand buttons
	expandButtons[i].addEventListener("click", (e) => {
		e.preventDefault();
		const currentExpandedValue = expandButtons[i].getAttribute("aria-expanded");
		const expandedState = currentExpandedValue === "true" ? "false" : "true";
		expandButtons[i].setAttribute("aria-expanded", expandedState);
		expandButtons[i].setAttribute("aria-label", expandedState === "true" ? "collapse" : "expand");

		// Open/close the filter
		// Find the form filter by using its relative position with the button instead of a css selector is to work around
		// the case when there are 2 filters (one for the static view and one for the dynamic view) are on the page. Clicking
		// on one of expand buttons only opens the form that this button corresponds to.
		const filter = $(expandButtons[i]).parent().siblings();
		filter[expandedState === "false" ? "hide" : "show"]();

		// Show/hide the expand svg
		setExpandSVGState(expandButtons[i], expandedState);
	});
}

// Clicking "reset filter" buttons unchecks all filter selections
const resetFilterButtons = document.querySelectorAll(".filter .reset-button");

for (let i = 0; i < resetFilterButtons.length; i++) {
	resetFilterButtons[i].addEventListener("click", () => {
		$(".filter-checkbox").prop("checked", false);
	});
}

// Clicking the "reset filter" button on the dynamic view also submits the form to perform the search and filter
document.querySelector(".dynamic-view .reset-button").addEventListener("click", () => {
	document.querySelector(".dynamic-view form").submit();
});
