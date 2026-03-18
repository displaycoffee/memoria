/* Index - local styles */
import './styles/index.scss';

/* Index - local scripts */
import { theme } from '../../_config/scripts/theme.ts';
import { utils } from '../../_config/scripts/utils.ts';
import { variables } from '../../_config/scripts/variables.ts';
import { closeFormFields } from './scripts/forms';

/* Components - local styles */
import '../../components/search-form/styles/search-form.scss';

/* Components - local scripts */
///

/* Layout - local styles */
import '../../layout/container/styles/container.scss';
import '../../layout/header/styles/header.scss';

/* Layout - local scripts */
///

/* Initialize scripts */
document.addEventListener('DOMContentLoaded', function () {
	closeFormFields('.form-field-close', '.input', '.button-close');
});
