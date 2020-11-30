// Handles search, filter and pagination functionality on the Views page.

/* global Vue, axios, search, createPagination, processDisplayResults, filter */

const pageSize = 10;
const params = new URLSearchParams(window.location.search);
let searchTerm = params.get("s") ? params.get("s").trim() : "";
let pageInQuery = params.get("page");

// Get selected tags to filter
let selectedTags = [];
for (let p of params) {
	if (p[0] !== "s" && p[0] !== "page") {
		selectedTags.push(p[0]);
	}
}

new Vue({
	el: "#defaultContainer",
	mounted() {
		let vm = this;
		let pagination;

		if (searchTerm || selectedTags.length > 0) {
			// Hide the static view section and show the dynamic search and filtering result section
			document.querySelector(".views.static-view").style.display = "none";
			document.querySelector(".views.dynamic-view").style.display = "block";

			axios.get(
				window.location.origin + "/viewsWithTags.json"
			).then(function (response) {
				// Search
				let results = response.data.views;
				if (searchTerm) {
					results = search(results, searchTerm);
				}

				// Filter by selected tags
				let tagsQuery = "";
				if (selectedTags.length > 0)
				{
					results = filter(results, selectedTags);
					tagsQuery = selectedTags.join("=on&") + "=on";
				}

				// Convert some post values to formats that can be displayed
				if (results.length > 0) {
					results = processDisplayResults(results);
				}

				// Paginate search results
				if (results.length > pageSize) {
					pagination = createPagination(results, pageSize, pageInQuery, "/views/?s=" + searchTerm + "&" + tagsQuery + "&page=:page");
				}

				vm.tags = response.data.tags.map(tag => {
					return {
						slug: tag.slug,
						name: tag.name,
						checked: selectedTags.includes(tag.slug)
					};
				});
				vm.selectedTags = response.data.tags.filter(tag => {
					return selectedTags.includes(tag.slug);
				});
				vm.pagination = pagination;
				vm.resultsToDisplay = pagination ? pagination.items : results;
				vm.searchResult = `${results.length} of ${response.data.views.length} resources matched`;
			});
		}
	},
	data: {
		searchTerm: searchTerm,
		searchResult: "Searching...",
		tags: [],
		resultsToDisplay: [],
		pagination: null
	},
	computed: {}
});
