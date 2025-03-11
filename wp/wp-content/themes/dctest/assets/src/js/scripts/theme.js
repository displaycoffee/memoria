// import variables from sass
import themeVars from '../../scss/modules/theme.module.scss';

export const theme = {
	bps : {
		bp1 : checkSassVar(themeVars.bp01),
		bp2 : checkSassVar(themeVars.bp02),
		bp3 : checkSassVar(themeVars.bp03),
		bp4 : checkSassVar(themeVars.bp04)
	}
};

// ensure an empty or undefined sass value is false
function checkSassVar(value) {
	if (value && value != 'false') {
		let formattedValue = isNaN(parseInt(value)) ? value.replace(/\"/gi, '') : parseInt(value);
		return formattedValue;
	} else {
		return false;
	}
}