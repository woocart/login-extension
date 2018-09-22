import OptionsSync from 'webext-options-sync'

/* istanbul ignore next */
document.addEventListener('DOMContentLoaded', () => {
	/* istanbul ignore next line */
	new OptionsSync().syncForm('#options-form')
})
