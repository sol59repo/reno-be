exports.formatDate = (date, hasTime = false) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }

    if (hasTime) {
        options.hour12 = false;
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        options.timeZone = 'Asia/Singapore'; // Set timezone to Singapore
    }
    const formattedDate = new Intl.DateTimeFormat('en-SG', options).format(date);
    return formattedDate;
}