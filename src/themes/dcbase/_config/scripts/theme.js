/* Import variables from sass */
import * as themeVars from '../styles/theme/_theme.module.scss';

export const theme = {
	bps: {
		bp01: checkSassVar(themeVars.bp01),
		bp02: checkSassVar(themeVars.bp02),
		bp03: checkSassVar(themeVars.bp03),
		bp04: checkSassVar(themeVars.bp04),
	},
};

/* Ensure an empty or undefined sass value is false */
function checkSassVar(value) {
	if (value) {
		if (value == 'true') {
			return true;
		} else if (value == 'false') {
			return false;
		} else {
			let formattedValue = isNaN(value * 1) ? value.replace(/"/gi, "'") : value * 1;
			return formattedValue;
		}
	} else {
		return false;
	}
}
