/** 
 * copies the given text to clipboard
 * @param {string} text text to be copied
 * @returns {void}
 */
export function copyToClipboard(text: string): void {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log('Text copied to clipboard');
			})
			.catch((error) => {
				console.error('Failed to copy text to clipboard:', error);
			});
	} else {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed'; // Ensure off-screen position
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();

		try {
			document.execCommand('copy');
		} catch (error) {
			console.error('Failed to copy text to clipboard:', error);
		}

		document.body.removeChild(textarea);
	}
}
