function formatDate(date) {
	const hour = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${hour}/0${month}/${year}`;
}

exports.formatDate = formatDate; 